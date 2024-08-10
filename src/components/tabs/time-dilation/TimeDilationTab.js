import DilationButton from "./DilationButton.js";
import DilationUpgradeButton from "./DilationUpgradeButton.js";

export default {
  name: "TimeDilationTab",
  components: {
    DilationButton,
    DilationUpgradeButton
  },
  data() {
    return {
      tachyons: new BE(),
      dilatedTime: new BE(),
      dilatedTimeIncome: new BE(),
      galaxyThreshold: new BE(),
      baseGalaxies: new BE(),
      totalGalaxies: new BE(),
      tachyonGalaxyGain: new BE(),
      hasPelleDilationUpgrades: false,
      galaxyTimeEstimate: "",
      maxDT: new BE(),
      toMaxTooltip: "",
      isHovering: false,
    };
  },
  computed: {
    rebuyables() {
      return [
        DilationUpgrade.dtGain,
        DilationUpgrade.galaxyThreshold,
        DilationUpgrade.tachyonGain
      ];
    },
    upgrades() {
      return [
        [
          DilationUpgrade.doubleGalaxies,
          DilationUpgrade.tdMultReplicanti,
          DilationUpgrade.ndMultDT
        ],
        [
          DilationUpgrade.ipMultDT,
          DilationUpgrade.timeStudySplit,
          DilationUpgrade.dilationPenalty
        ],
      ];
    },
    // This might be negative due to rift drain, so we need to add "+" iff the value is positive. The actual
    // addition of a negative sign (or not) is assumed to be handled in a notation-specific way
    dilatedTimeGainText() {
      const sign = this.dilatedTimeIncome.gte(0) ? "+" : "";
      return `${sign}${format(this.dilatedTimeIncome, 2, 1)}`;
    },
    pelleRebuyables() {
      return [
        DilationUpgrade.dtGainPelle,
        DilationUpgrade.galaxyMultiplier,
        DilationUpgrade.tickspeedPower
      ];
    },
    pelleUpgrades() {
      return [
        DilationUpgrade.galaxyThresholdPelle,
        DilationUpgrade.flatDilationMult
      ];
    },
    ttGenerator() {
      return DilationUpgrade.ttGenerator;
    },
    baseGalaxyText() {
      return `${formatInt(this.baseGalaxies)} Base`;
    },
    hasMaxText: () => PlayerProgress.realityUnlocked() && !Pelle.isDoomed,
    allRebuyables() {
      const upgradeRows = [];
      upgradeRows.push(this.rebuyables);
      if (this.hasPelleDilationUpgrades) upgradeRows.push(this.pelleRebuyables);
      return upgradeRows;
    },
    allSingleUpgrades() {
      const upgradeRows = [];
      upgradeRows.push(...this.upgrades);
      if (this.hasPelleDilationUpgrades) upgradeRows.push(this.pelleUpgrades);
      upgradeRows.push([this.ttGenerator]);
      return upgradeRows;
    },
  },
  methods: {
    update() {
      this.tachyons.copyFrom(Currency.tachyonParticles);
      this.dilatedTime.copyFrom(Currency.dilatedTime);
      const rawDTGain = getDilationGainPerSecond().times(getGameSpeedupForDisplay());
      this.galaxyTimeEstimate = getDilationTimeEstimate(this.galaxyThreshold);
      if (PelleRifts.paradox.isActive) {
        // The number can be small and either positive or negative with the rift active, which means that extra care
        // needs to be taken to get the calculation as close to correct as possible. This relies on some details
        // related to tick microstructure to make things accurate, and it seems to be to roughly 1 part in 5e6
        const tickProp = player.options.updateRate / 1000;
        const drainFactorPerTick = 1 - (1 - Pelle.riftDrainPercent) ** tickProp;
        const drainPerSecond = this.dilatedTime.add(rawDTGain.times(tickProp)).times(drainFactorPerTick / tickProp);
        this.dilatedTimeIncome = rawDTGain.minus(drainPerSecond);
      } else {
        this.dilatedTimeIncome = rawDTGain;
      }
      this.galaxyThreshold.copyFrom(player.dilation.nextThreshold);
      this.baseGalaxies.copyFrom(player.dilation.baseTachyonGalaxies);
      this.totalGalaxies.copyFrom(player.dilation.totalTachyonGalaxies);
      this.hasPelleDilationUpgrades = PelleRifts.paradox.milestones[0].canBeApplied;
      if (this.baseGalaxies.lt(500) && DilationUpgrade.doubleGalaxies.isBought) {
        this.tachyonGalaxyGain = DilationUpgrade.doubleGalaxies.effectValue;
      } else {
        this.tachyonGalaxyGain = new BE(1);
      }
      this.tachyonGalaxyGain = this.tachyonGalaxyGain.times(DilationUpgrade.galaxyMultiplier.effectValue);
      this.maxDT.copyFrom(player.records.thisReality.maxDT);

      const estimateText = getDilationTimeEstimate(this.maxDT);
      if (this.dilatedTimeIncome.lte(0)) this.toMaxTooltip = "No DT gain";
      else this.toMaxTooltip = estimateText.startsWith("<") ? "Currently Increasing" : estimateText;
    }
  },
  template: `
  <div
    class="l-dilation-tab"
    data-v-time-dilation-tab
  >
    <span>
      You have
      <span
        class="c-dilation-tab__tachyons"
        data-v-time-dilation-tab
      >{{ format(tachyons, 2, 1) }}</span>
      {{ pluralize("Tachyon Particle", tachyons) }}.
    </span>
    <div
      @mouseover="isHovering = true"
      @mouseleave="isHovering = false"
    >
      <DilationButton />
    </div>
    <span>
      You have
      <span
        class="c-dilation-tab__dilated-time"
        data-v-time-dilation-tab
      >{{ format(dilatedTime, 2, 1) }}</span>
      Dilated Time.
      <span
        class="c-dilation-tab__dilated-time-income"
        data-v-time-dilation-tab
      >{{ dilatedTimeGainText }}/s</span>
    </span>
    <span>
      Next
      <span v-if="tachyonGalaxyGain.gt(1)">{{ formatInt(tachyonGalaxyGain) }}</span>
      {{ pluralize("Tachyon Galaxy", tachyonGalaxyGain) }} at
      <span
        class="c-dilation-tab__galaxy-threshold"
        :ach-tooltip="galaxyTimeEstimate"
        data-v-time-dilation-tab
      >{{ format(galaxyThreshold, 2, 1) }}</span>
      Dilated Time, gained total of
      <span
        class="c-dilation-tab__galaxies"
        :ach-tooltip="baseGalaxyText"
        data-v-time-dilation-tab
      >{{ formatInt(totalGalaxies) }}</span>
      {{ pluralize("Tachyon Galaxy", totalGalaxies) }}
    </span>
    <span v-if="hasMaxText">
      Your maximum Dilated Time reached this Reality is
      <span
        v-tooltip="toMaxTooltip"
        class="max-accent"
        data-v-time-dilation-tab
      >{{ format(maxDT, 2, 1) }}</span>.
    </span>
    <div
      class="l-dilation-upgrades-grid"
      data-v-time-dilation-tab
    >
      <div
        v-for="(upgradeRow, row) in allRebuyables"
        :key="'rebuyable' + row"
        class="l-dilation-upgrades-grid__row"
        data-v-time-dilation-tab
      >
        <DilationUpgradeButton
          v-for="upgrade in upgradeRow"
          :key="upgrade.id"
          :upgrade="upgrade"
          :is-rebuyable="true"
          class="l-dilation-upgrades-grid__cell"
          :show-tooltip="isHovering"
          data-v-time-dilation-tab
        />
      </div>
      <div
        v-for="(upgradeRow, row) in allSingleUpgrades"
        :key="'single' + row"
        class="l-dilation-upgrades-grid__row"
        data-v-time-dilation-tab
      >
        <DilationUpgradeButton
          v-for="upgrade in upgradeRow"
          :key="upgrade.id"
          :upgrade="upgrade"
          :is-rebuyable="false"
          class="l-dilation-upgrades-grid__cell"
          :show-tooltip="isHovering"
          data-v-time-dilation-tab
        />
      </div>
    </div>
  </div>
  `
};