import CostDisplay from "./CostDisplay.js";
import DescriptionDisplay from "./DescriptionDisplay.js";
import EffectDisplay from "./EffectDisplay.js";

export default {
  name: "InfinityUpgradeButton",
  components: {
    DescriptionDisplay,
    EffectDisplay,
    CostDisplay,
  },
  props: {
    upgrade: {
      type: Object,
      required: true
    },
    continuum: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      showWorstChallenge: false,
      worstChallengeString: "",
      isUseless: false,
      canBeBought: false,
      chargePossible: false,
      canBeCharged: false,
      isBought: false,
      isCharged: false,
      isDisabled: false,
      showingCharged: false,
      hasTS31: false,
      ts31Effect: new BE(0),
      hasEL1: false
    };
  },
  computed: {
    isBasedOnInfinities() {
      return /(18|27|36|45)Mult/u.test(this.upgrade.id) || this.upgrade.id === "infinitiedMult";
    },
    shiftDown() {
      return ui.view.shiftDown;
    },
    showChargedEffect() {
      return this.chargePossible && (this.isCharged || this.showingCharged || this.shiftDown);
    },
    config() {
      const config = this.upgrade.config;
      return this.showChargedEffect
        ? config.charged
        : config;
    },
    classObject() {
      return {
        "o-infinity-upgrade-btn": true,
        "o-infinity-upgrade-btn--bought": !this.isUseless && this.isBought,
        "o-infinity-upgrade-btn--available": !this.isUseless && !this.isBought && this.canBeBought,
        "o-infinity-upgrade-btn--unavailable": !this.isUseless && !this.isBought && !this.canBeBought,
        "o-infinity-upgrade-btn--useless": this.isUseless,
        "o-pelle-disabled": this.isUseless,
        "o-infinity-upgrade-btn--chargeable": !this.isCharged && this.chargePossible &&
          (this.showingCharged || this.shiftDown),
        "o-infinity-upgrade-btn--charged": this.isCharged,
        "o-pelle-disabled-pointer": this.isUseless,
        "o-continuum": this.continuum
      };
    },
    isImprovedByTS31() {
      return this.hasTS31 && this.isBasedOnInfinities && !this.showChargedEffect;
    }
  },
  methods: {
    update() {
      // Note that this component is used by both infinity upgrades and break infinity upgrades
      // (putting this comment here rather than at the top of the component since this function
      // seems more likely to be read).
      const upgrade = this.upgrade;
      this.isBought = upgrade.isBought || upgrade.isCapped;
      this.chargePossible = Ra.unlocks.chargedInfinityUpgrades.canBeApplied &&
        upgrade.hasChargeEffect && !Pelle.isDoomed;
      this.canBeBought = upgrade.canBeBought;
      this.canBeCharged = upgrade.canCharge;
      this.isCharged = upgrade.isCharged;
      // A bit hacky, but the offline passive IP upgrade (the one that doesn't work online)
      // should hide its effect value if offline progress is disabled, in order to be
      // consistent with the other offline progress upgrades which hide as well.
      // Also, the IP upgrade that works both online and offline should not
      // show 0 if its value is 0. This is a bit inconvenient because sometimes,
      // like after eternity, it can be bought but have value 0, but not showing the effect
      // in this case doesn't feel too bad. Other upgrades, including the cost scaling
      // rebuyables, should never hide their effect.
      this.isDisabled = upgrade.config.isDisabled && upgrade.config.isDisabled(upgrade.config.effect());
      this.isUseless = Pelle.uselessInfinityUpgrades.includes(upgrade.id) && Pelle.isDoomed;
      this.hasTS31 = TimeStudy(31).canBeApplied;
      if (!this.isDisabled && this.isImprovedByTS31) this.ts31Effect = BE.pow(upgrade.config.effect(), 4);
      this.hasEL1 = GameElement(1).canBeApplied && upgrade.shouldApplyEL1;
      if (upgrade.id !== "challengeMult") return;
      this.showWorstChallenge = upgrade.effectValue !== upgrade.cap &&
        player.challenge.normal.bestTimes.reduce(BE.sumReducer).lt(BE.MAX_VALUE);
      const worstChallengeTime = GameCache.worstChallengeTime.value;
      const worstChallengeIndex = 2 + player.challenge.normal.bestTimes.findIndex(time => time.eq(worstChallengeTime));
      this.worstChallengeString = `(Challenge ${worstChallengeIndex}: ${timeDisplayShort(worstChallengeTime)})`;
    }
  },
  template: `
  <button
    :class="classObject"
    @mouseenter="showingCharged = canBeCharged"
    @mouseleave="showingCharged = false"
    @click="upgrade.purchase()"
    data-v-infinity-upgrade-button
  >
    <span :class="{ 'o-pelle-disabled': isUseless }">
      <DescriptionDisplay
        :config="config"
      />
      <span v-if="showWorstChallenge">
        <br>
        {{ worstChallengeString }}
      </span>
      <EffectDisplay
        v-if="!isDisabled"
        br
        :config="config"
      />
      <template v-if="!isDisabled && isImprovedByTS31">
        <br>
        After TS31: {{ formatX(ts31Effect, 2, 2) }}
      </template>
    </span>
    <template v-if="!isBought && !continuum">
      <br>
      <span v-if="hasEL1">Auto: {{ quantify("Infinity Point", config.cost - 1, 2) }}</span>
      <CostDisplay
        v-else
        :config="config"
        name="Infinity Point"
      />
    </template>
    <slot />
  </button>
  `
};