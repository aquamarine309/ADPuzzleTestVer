import ChallengeFactorTooltip from "./ChallengeFactorTooltip.js";

export default {
  name: "ChallengeFactorComponent",
  props: {
    factor: {
      type: Object,
      required: true
    }
  },
  components: {
    ChallengeFactorTooltip
  },
  computed: {
    config() {
      return this.factor.config;
    },
    symbol() {
      return this.config.symbol;
    },
    styleObject() {
      return {
        "--color-factor": this.config.color
      }
    },
    typeClass() {
      switch (this.config.type) {
        case CHALLENGE_FACTOR_TYPE.DISABLED:
          return "fa-ban";
        case CHALLENGE_FACTOR_TYPE.NERF:
          return "fa-arrow-down";
        case CHALLENGE_FACTOR_TYPE.IMPROVE:
          return "fa-arrow-up";
      }
      
      throw `Unknown type of Challenge Factor`;
    }
  },
  template: `
  <div
    class="c-challenge-factor-component"
    :style="styleObject"
  >
    <div
      class="c-challenge-factor-symbol"
      v-html="symbol"
    />
    <div class="c-challenge-factor-type">
      <i
        class="fas"
        :class="typeClass"
      />
    </div>
    <ChallengeFactorTooltip :factor="factor" />
  </div>
  `
}