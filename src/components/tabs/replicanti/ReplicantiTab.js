import wordShift from "../../../core/word-shift.js";

import ReplicantiUpgradeButton, { ReplicantiUpgradeButtonSetup } from "./ReplicantiUpgradeButton.js";
import PrimaryButton from "../../PrimaryButton.js";
import ReplicantiGainText from "./ReplicantiGainText.js";
import ReplicantiGalaxyButton from "./ReplicantiGalaxyButton.js";

export default {
  name: "ReplicantiTab",
  components: {
    PrimaryButton,
    ReplicantiGainText,
    ReplicantiUpgradeButton,
    ReplicantiGalaxyButton,
  },
  data() {
    return {
      isUnlocked: false,
      isUnlockAffordable: false,
      isInEC8: false,
      ec8Purchases: 0,
      amount: new BE(),
      mult: new BE(),
      hasTDMult: false,
      multTD: new BE(),
      hasDTMult: false,
      multDT: new BE(),
      hasIPMult: false,
      multIP: new BE(),
      hasRaisedCap: false,
      replicantiCap: new BE(),
      capMultText: "",
      distantRG: new BE(),
      remoteRG: new BE(),
      effarigInfinityBonusRG: new BE(),
      isUncapped: false,
      nextEffarigRGThreshold: new BE(),
      canSeeGalaxyButton: false,
      scrambledText: "",
      maxReplicanti: new BE(),
      estimateToMax: new BE(),
      autoreplicateUnlocked: false,
      cooldownTime: new BE(),
      boostCost: 0,
      boosts: new BE(),
      holding: 0,
      destroyedText: ""
    };
  },
  computed: {
    isDoomed: () => Pelle.isDoomed,
    replicantiChanceSetup() {
      return new ReplicantiUpgradeButtonSetup(
        ReplicantiUpgrade.chance,
        value => `Replicate chance: ${formatPercents(value)}`,
        cost => `+${formatPercents(0.01)} Costs: ${format(cost)} IP`
      );
    },
    replicationInfo() {
      if (this.autoreplicateUnlocked) return "Auto";
      if (this.canReplicate) return "Available";
      if (this.amount.gte(BE.NUMBER_MAX_VALUE)) return "Capped";
      return `Cooldown Time: ${TimeSpan.fromMilliseconds(this.cooldownTime).toStringShort(false)}`;
    },
    replicantiIntervalSetup() {
      const upgrade = ReplicantiUpgrade.interval;
      function formatInterval(interval) {
        const actualInterval = upgrade.applyModifiers(interval);
        if (
          actualInterval.isFinite() &&
          actualInterval.gt(1) &&
          upgrade.isCapped
        ) {
          // Checking isCapped() prevents text overflow when formatted as "__ ➜ __"
          return TimeSpan.fromMilliseconds(intervalNum).toStringShort(false);
        }
        if (actualInterval.lt(0.01)) return `< ${format(0.01, 2, 2)}ms`;
        if (actualInterval.gt(1000))
          return `${format(actualInterval.div(1000), 2, 2)}s`;
        return `${format(actualInterval, 2, 2)}ms`;
      }
      return new ReplicantiUpgradeButtonSetup(
        upgrade,
        value => `Interval: ${formatInterval(value)}`,
        cost =>
          `➜ ${formatInterval(upgrade.nextValue)} Costs: ${format(cost)} IP`
      );
    },
    canReplicate() {
      return this.cooldownTime.lte(0) && this.amount.lt(BE.NUMBER_MAX_VALUE);
    },
    canBoost() {
      return this.amount.gte(this.boostCost);
    },
    maxGalaxySetup() {
      const upgrade = ReplicantiUpgrade.galaxies;
      return new ReplicantiUpgradeButtonSetup(
        upgrade,
        value => {
          let description = `Max Replicanti Galaxies: `;
          const extra = upgrade.extra;
          if (extra.gt(0)) {
            const total = value + extra;
            description += `<br>${formatInt(value)} + ${formatInt(extra)} = ${formatInt(total)}`;
          } else {
            description += formatInt(value);
          }
          return description;
        },
        cost => `+${formatInt(1)} Costs: ${format(cost)} IP`
      );
    },
    amountClass() {
      if (PlayerProgress.eternityUnlocked()) return "";
      return Array.range(1, Math.min(this.boosts, 3)).map
      (x => `c-replicanti-description__accent--level-${x}`);
    },
    boostText() {
      const boostList = [];
      boostList.push(`a <span class="c-replicanti-description__accent">${formatX(this.mult, 2, 2)}</span>
        multiplier on all Infinity Dimensions`);
      if (this.hasTDMult) {
        boostList.push(`a <span class="c-replicanti-description__accent">${formatX(this.multTD, 2, 2)}</span>
          multiplier on all Time Dimensions from a Dilation Upgrade`);
      }
      if (this.hasDTMult) {
        const additionalEffect = GlyphAlteration.isAdded("replication") ? "and Replicanti speed " : "";
        boostList.push(`a <span class="c-replicanti-description__accent">${formatX(this.multDT, 2, 2)}</span>
          multiplier to Dilated Time ${additionalEffect}from Glyphs`);
      }
      if (this.hasIPMult) {
        boostList.push(`a <span class="c-replicanti-description__accent">${formatX(this.multIP)}</span>
          multiplier to Infinity Points from Glyph Alchemy`);
      }
      if (boostList.length === 1) return `${boostList[0]}.`;
      if (boostList.length === 2) return `${boostList[0]}<br> and ${boostList[1]}.`;
      return `${boostList.slice(0, -1).join(",<br>")},<br> and ${boostList[boostList.length - 1]}.`;
    },
    hasMaxText: () => PlayerProgress.realityUnlocked() && !Pelle.isDoomed,
    toMaxTooltip() {
      if (this.amount.lte(this.replicantiCap)) return null;
      return this.estimateToMax.lt(0.01)
        ? "Currently Increasing"
        : TimeSpan.fromSeconds(this.estimateToMax.toNumber()).toStringShort();
    }
  },
  methods: {
    update() {
      this.isUnlocked = Replicanti.areUnlocked;
      if (this.isDoomed) this.scrambledText = this.vacuumText();
      if (!this.isUnlocked) {
        this.destroyedText = wordShift.wordCycle(["Destroyed", "Annihilated", "Nullified"]);
        this.isUnlockAffordable = LC3.isCompleted;
        return;
      }
      this.isInEC8 = EternityChallenge(8).isRunning;
      if (this.isInEC8) {
        this.ec8Purchases = player.eterc8repl;
      }
      this.autoreplicateUnlocked = Replicanti.autoreplicateUnlocked;
      this.cooldownTime.copyFrom(Replicanti.cooldownTime);
      if (this.holding) this.replicate();
      this.boostCost = ReplicantiBoost.cost;
      this.boosts = ReplicantiBoost.amount;
      this.amount.copyFrom(Replicanti.amount);
      this.mult.copyFrom(replicantiMult());
      this.hasTDMult = DilationUpgrade.tdMultReplicanti.isBought;
      this.multTD.copyFrom(DilationUpgrade.tdMultReplicanti.effectValue);
      this.hasDTMult = getAdjustedGlyphEffect("replicationdtgain").neq(0) && !Pelle.isDoomed;
      this.multDT = 
        BE.log10(Replicanti.amount).times
          (getAdjustedGlyphEffect("replicationdtgain"))
          .clampMin(1)
      this.hasIPMult = AlchemyResource.exponential.amount > 0 && !this.isDoomed;
      this.multIP = Replicanti.amount.powEffectOf(AlchemyResource.exponential);
      this.isUncapped = PelleRifts.vacuum.milestones[1].canBeApplied;
      this.hasRaisedCap = EffarigUnlock.infinity.isUnlocked && !this.isUncapped;
      this.replicantiCap.copyFrom(replicantiCap());
      if (this.hasRaisedCap) {
        const mult = this.replicantiCap.div(BE.NUMBER_MAX_VALUE);
        this.capMultText = TimeStudy(31).canBeApplied
          ? `Base: ${formatX(mult.pow(1 / TimeStudy(31).effectValue), 2)}; after TS31: ${formatX(mult, 2)}`
          : formatX(mult, 2);
      }
      this.distantRG = ReplicantiUpgrade.galaxies.distantRGStart;
      this.remoteRG = ReplicantiUpgrade.galaxies.remoteRGStart;
      this.effarigInfinityBonusRG = Effarig.bonusRG;
      this.nextEffarigRGThreshold = BE.NUMBER_MAX_VALUE.pow(
        Effarig.bonusRG.plus(2)
      );
      this.canSeeGalaxyButton =
        Replicanti.galaxies.max.gte(1) || PlayerProgress.eternityUnlocked();
      this.maxReplicanti.copyFrom(player.records.thisReality.maxReplicanti);
      this.estimateToMax = this.calculateEstimate();
    },
    vacuumText() {
      return wordShift.wordCycle(PelleRifts.vacuum.name);
    },
    // This is copied out of a short segment of ReplicantiGainText with comments and unneeded variables stripped
    calculateEstimate() {
      const updateRateMs = player.options.updateRate;
      const logGainFactorPerTick = BE.divide(getGameSpeedupForDisplay().times(updateRateMs).times
        (player.replicanti.chance.plus(1).log10()), getReplicantiInterval());
      const postScale = BE.log10(ReplicantiGrowth.scaleFactor).div(ReplicantiGrowth.scaleLog10);
      const nextMilestone = this.maxReplicanti;
      const coeff = BE.divide(updateRateMs / 1000, logGainFactorPerTick.times(postScale));
      return coeff.times(nextMilestone.divide(this.amount).pow(postScale).minus(1));
    },
    replicate() {
      if (!this.canReplicate || this.autoreplicateUnlocked) return;
      replicantiLoop(null, false);
    },
    boost() {
      ReplicantiBoost.purchase();
    }
  },
  template: `
  <div class="l-replicanti-tab">
    <br>
    <PrimaryButton
      v-if="!isUnlocked"
      :enabled="isUnlockAffordable"
      class="o-primary-btn--replicanti-unlock"
      onclick="Replicanti.unlock();"
    >
      <template v-if="isUnlockAffordable">
        Unlock Replicanti
        <br>
        for free
      </template>
      <template v-else>
        Replicanti have been
        <br>
        <b class="extra-bonus-destoryed">{{ destroyedText }}</b>
      </template>
    </PrimaryButton>
    <template v-else>
      <div
        v-if="isDoomed"
        class="modified-cap"
        data-v-replicanti-tab
      >
        Your Replicanti cap has been removed due to the second {{ scrambledText }} milestone.
      </div>
      <div
        v-else-if="hasRaisedCap"
        class="modified-cap"
        data-v-replicanti-tab
      >
        Completion of Effarig's Infinity is giving you the following rewards:
        <br>
        Your Replicanti cap without TS192 is now {{ format(replicantiCap, 2) }}
        ({{ capMultText }})
        <br>
        {{ quantifyInt("extra Replicanti Galaxy", effarigInfinityBonusRG) }}
        (Next Replicanti Galaxy at {{ format(nextEffarigRGThreshold, 2) }} cap)
      </div>
      <p class="c-replicanti-description">
        You have
        <span
          class="c-replicanti-description__accent"
          :class="amountClass"
        >
          {{ format(amount, 2, 0) }}
        </span>
        Replicanti, translated to
        <br>
        <span v-html="boostText" />
      </p>
      <div
        v-if="hasMaxText"
        class="c-replicanti-description"
      >
        Your maximum Replicanti reached this Reality is
        <span
          v-tooltip="toMaxTooltip"
          class="max-accent"
          data-v-replicanti-tab
        >{{ format(maxReplicanti, 2) }}</span>.
      </div>
      <br>
      <div v-if="isInEC8">
        You have {{ quantifyInt("purchase", ec8Purchases) }} left within Eternity Challenge 8.
      </div>
      <div class="l-replicanti-upgrade-row">
        <ReplicantiUpgradeButton :setup="replicantiChanceSetup" />
        <ReplicantiUpgradeButton :setup="replicantiIntervalSetup" />
        <ReplicantiUpgradeButton :setup="maxGalaxySetup" />
      </div>
      <div>
        The Max Replicanti Galaxy upgrade can be purchased endlessly, but costs increase
        <br>
        more rapidly above {{ formatInt(distantRG) }} Replicanti Galaxies
        and even more so above {{ formatInt(remoteRG) }} Replicanti Galaxies.
      </div>
      <br><br>
      <ReplicantiGainText />
      <br>
      <div class="l-replicanti-upgrade-row">
        <PrimaryButton
          v-if="!autoreplicateUnlocked"
          :enabled="canReplicate"
          class="o-primary-btn--replicanti-galaxy l-replicanti-upgrade-button"
          @click="replicate"
          @touchstart="holding = true"
          @touchend="holding = false"
        >
          Replicate ({{ replicationInfo }})
        </PrimaryButton>
        <ReplicantiGalaxyButton v-if="canSeeGalaxyButton" />
        <PrimaryButton
          v-if="!autoreplicateUnlocked"
          :enabled="canBoost"
          class="o-primary-btn--replicanti-galaxy l-replicanti-upgrade-button"
          @click="boost"
        >
          Boost Replicanti
          <br>
          Reach {{ format(boostCost) }} Replicanti
        </PrimaryButton>
      </div>
    </template>
  </div>
  `
};