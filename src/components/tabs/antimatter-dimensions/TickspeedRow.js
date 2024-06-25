export default {
  name: "TickspeedRow",
  data() {
    return {
      purchasedTickspeed: new BE(0),
      freeTickspeed: new BE(0),
      isVisible: false,
      mult: new BE(0),
      cost: new BE(0),
      isAffordable: false,
      tickspeed: new BE(0),
      gameSpeedMult: new BE(0),
      galaxyCount: new BE(0),
      isContinuumActive: false,
      continuumValue: new BE(0),
      hasTutorial: false,
      hasRealityButton: false,
      isEC9: false,
    };
  },
  computed: {
    classObject() {
      return {
        "l-tickspeed-container": true,
        "l-tickspeed-container--hidden": !this.isVisible
      };
    },
    multiplierDisplay() {
      if (InfinityChallenge(3).isRunning) return `Multiply all Antimatter Dimensions by
        ${formatX(this.galaxyCount.times(0.005).plus(1.05), 3, 3)}`;
      const tickmult = this.mult;
      if (LogicChallenge(5).isRunning) return "Invalid for ADs";
      return `${formatX(tickmult.reciprocal(), 2, 3)} faster / upgrade.`;
    },
    tickspeedDisplay() {
      return `Tickspeed: ${format(this.tickspeed, 2, 3)} / sec`;
    },
    continuumString() {
      return formatFloat(this.continuumValue, 2);
    },
    upgradeCount() {
      const purchased = this.purchasedTickspeed;
      if (this.freeTickspeed.eq(0)) return quantifyInt("Purchased Upgrade", purchased);
      if (purchased.eq(0) || this.isContinuumActive) return `${formatInt(this.freeTickspeed)} Free Upgrades`;
      return `${formatInt(purchased)} Purchased + ${formatInt(this.freeTickspeed)} Free`;
    }
  },
  methods: {
    update() {
      this.hasRealityButton = PlayerProgress.realityUnlocked() || TimeStudy.reality.isBought;
      this.purchasedTickspeed.copyFrom(player.totalTickBought);
      this.freeTickspeed.copyFrom(FreeTickspeed.amount);
      this.isEC9 = EternityChallenge(9).isRunning;
      this.isVisible = Tickspeed.isUnlocked || this.isEC9;
      if (!this.isVisible) return;
      this.mult.copyFrom(Tickspeed.multiplier);
      this.cost.copyFrom(Tickspeed.cost);
      this.isAffordable = Tickspeed.isAvailableForPurchase && Tickspeed.isAffordable;
      this.tickspeed.copyFrom(Tickspeed.perSecond);
      this.gameSpeedMult = getGameSpeedupForDisplay();
      this.galaxyCount.copyFrom(player.galaxies);
      this.isContinuumActive = Laitela.continuumActive;
      if (this.isContinuumActive) this.continuumValue.copyFrom(Tickspeed.continuumValue);
      this.hasTutorial = Tutorial.isActive(TUTORIAL_STATE.TICKSPEED);
    },
    buttonClass() {
      return {
        "o-primary-btn": true,
        "tickspeed-btn": true,
        "o-primary-btn--disabled": !this.isAffordable && !this.isContinuumActive,
        "o-non-clickable o-continuum": this.isContinuumActive,
        "tutorial--glow": this.isAffordable && this.hasTutorial
      };
    },
  },
  template: `
  <div
    :class="classObject"
    data-v-tickspeed-row
  >
    <div
      class="tickspeed-buttons"
      data-v-tickspeed-row
    >
      <button
        v-tooltip="upgradeCount"
        :class="buttonClass()"
        onclick="buyTickSpeed()"
        data-v-tickspeed-row
      >
        <span v-if="isContinuumActive">
          Tickspeed Continuum: {{ continuumString }}
        </span>
        <span v-else-if="isEC9">
          Tickspeed Unpurchasable (EC 9)
        </span>
        <span v-else>
          Tickspeed Cost: {{ format(cost) }}
        </span>
        <div
          v-if="hasTutorial"
          class="fas fa-circle-exclamation l-notification-icon"
        />
      </button>
      <button
        v-if="!isContinuumActive"
        class="o-primary-btn tickspeed-max-btn"
        :class="{ 'o-primary-btn--disabled': !isAffordable && !isContinuumActive }"
        onclick="buyMaxTickSpeed()"
        data-v-tickspeed-row
      >
        Buy Max
      </button>
    </div>
    <div
      v-if="hasRealityButton"
      class="tickspeed-labels"
      data-v-tickspeed-row
    >
      {{ tickspeedDisplay }} | {{ multiplierDisplay }}
    </div>
  </div>
  `
};