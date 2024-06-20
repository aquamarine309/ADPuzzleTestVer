import PrimaryButton from "../../PrimaryButton.js";

export default {
  name: "ClassicAntimatterGalaxyRow",
  components: {
    PrimaryButton
  },
  data() {
    return {
      type: GALAXY_TYPE.NORMAL,
      galaxies: {
        normal: new BE(0),
        replicanti: new BE(0),
        dilation: new BE(0)
      },
      requirement: {
        tier: 1,
        amount: new BE(0)
      },
      canBeBought: false,
      distantStart: 0,
      remoteStart: 0,
      lockText: null,
      canBulkBuy: false,
      creditsClosed: false,
      scalingText: {
        distant: null,
        remote: null,
      },
      hasTutorial: false,
    };
  },
  computed: {
    isDoomed: () => Pelle.isDoomed,
    dimName() {
      return AntimatterDimension(this.requirement.tier).displayName;
    },
    buttonText() {
      if (this.lockText !== null) return this.lockText;
      const reset = [];
      if (!Achievement(111).isUnlocked) reset.push("Dimensions");
      if (!Achievement(143).isUnlocked) reset.push("Dimension Boosts");
      return reset.length === 0
        ? `Increase the power of Tickspeed upgrades`
        : `Reset your ${makeEnumeration(reset)} to increase the power of Tickspeed upgrades`;
    },
    sumText() {
      const parts = [BE.max(this.galaxies.normal, 0)];
      if (this.galaxies.replicanti.gt(0)) parts.push(this.galaxies.replicanti);
      if (this.galaxies.dilation.gt(0)) parts.push(this.galaxies.dilation);
      const sum = parts.map(this.formatGalaxies).join(" + ");
      if (parts.length >= 2) {
        return `${sum} = ${this.formatGalaxies(parts.reduce(BE.sumReducer))}`;
      }
      return sum;
    },
    typeName() {
      switch (this.type) {
        case GALAXY_TYPE.NORMAL: return "Antimatter Galaxies";
        case GALAXY_TYPE.DISTANT: return "Distant Antimatter Galaxies";
        case GALAXY_TYPE.REMOTE: return "Remote Antimatter Galaxies";
      }
      return undefined;
    },
    hasIncreasedScaling() {
      return this.type !== GALAXY_TYPE.NORMAL;
    },
    costScalingText() {
      switch (this.type) {
        case GALAXY_TYPE.DISTANT:
          return `Each Galaxy is more expensive past ${quantifyInt("Galaxy", this.distantStart)}`;
        case GALAXY_TYPE.REMOTE: {
          const scalings = [
            { type: "distant", function: "quadratic", amount: this.distantStart },
            { type: "remote", function: "exponential", amount: this.remoteStart }
          ];
          return `Increased Galaxy cost scaling: ${scalings.sort((a, b) => a.amount - b.amount)
            .map(scaling => `${scaling.function} scaling past ${this.formatGalaxies(scaling.amount)} (${scaling.type})`)
            .join(", ").capitalize()}`;
        }
      }
      return undefined;
    },
    classObject() {
      return {
        "o-primary-btn--galaxy l-dim-row__prestige-button": true,
        "tutorial--glow": this.canBeBought && this.hasTutorial,
        "o-pelle-disabled-pointer": this.creditsClosed,
      };
    }
  },
  methods: {
    update() {
      this.showGalaxy = NormalChallenge(11).isCompleted;
      if (!this.showGalaxy) return;
      this.type = Galaxy.type;
      this.galaxies.normal = player.galaxies.plus(GalaxyGenerator.galaxies);
      this.galaxies.replicanti = Replicanti.galaxies.total;
      this.galaxies.dilation.copyFrom(player.dilation.totalTachyonGalaxies);
      const requirement = Galaxy.requirement;
      this.requirement.amount = requirement.amount;
      this.requirement.tier = requirement.tier;
      this.canBeBought = requirement.isSatisfied && Galaxy.canBeBought;
      this.distantStart = EternityChallenge(5).isRunning ? 0 : Galaxy.costScalingStart;
      this.remoteStart = Galaxy.remoteStart;
      this.lockText = Galaxy.lockText;
      this.canBulkBuy = EternityMilestone.autobuyMaxGalaxies.isReached;
      this.creditsClosed = GameEnd.creditsEverClosed;
      this.hasTutorial = Tutorial.isActive(TUTORIAL_STATE.GALAXY);
    },
    buyGalaxy(bulk) {
      if (!this.canBeBought) return;
      manualRequestGalaxyReset(this.canBulkBuy && bulk);
    },
    formatGalaxies(num) {
      return (typeof num !== "number" && num.gt(1e8)) ? format(num, 2) : formatInt(num);
    },
  },
  template: `
  <div
    class="c-dimension-row c-antimatter-dim-row c-antimatter-prestige-row"
    v-if="showGalaxy"
    data-v-assic-antimatter-galaxy-row
  >
    <div
      class="l-dim-row__prestige-text c-dim-row__label c-dim-row__label--amount l-text-wrapper"
      data-v-assic-antimatter-galaxy-row
    >
      {{ typeName }} ({{ sumText }}):
      requires {{ formatInt(requirement.amount) }} {{ dimName }} Dimensions
      <div
        class="l-scaling-text-wrapper"
        data-v-assic-antimatter-galaxy-row
      >
        {{ hasIncreasedScaling ? costScalingText : "" }}
      </div>
    </div>
    <PrimaryButton
      :enabled="canBeBought"
      :class="classObject"
      @click.exact="buyGalaxy(true)"
      @click.shift.exact="buyGalaxy(false)"
      data-v-assic-antimatter-galaxy-row
    >
      {{ buttonText }}
      <div
        v-if="hasTutorial"
        class="fas fa-circle-exclamation l-notification-icon"
      />
    </PrimaryButton>
  </div>
  `
};