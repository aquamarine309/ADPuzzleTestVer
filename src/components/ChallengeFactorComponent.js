import ChallengeFactorTooltip from "./ChallengeFactorTooltip.js";

const CHALLENGE_FACTOR_INFO_TYPE = {
  NONE: 0,
  LEVEL: 1,
  DIFFICULTY: 2
}

export default {
  name: "ChallengeFactorComponent",
  props: {
    factor: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      type: CHALLENGE_FACTOR_INFO_TYPE.NONE,
      info: ""
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
  methods: {
    update() {
      // I don't like to use "switch ... case ..."
      this.type = player.options.challengeFactorType;
      if (this.type === CHALLENGE_FACTOR_INFO_TYPE.NONE) {
        this.info = "";
      } else if (this.type === CHALLENGE_FACTOR_INFO_TYPE.LEVEL) {
        this.info = `Lv. ${this.factor.displayLevel}`;
      } else if (this.type === CHALLENGE_FACTOR_INFO_TYPE.DIFFICULTY) {
        this.info = `Diff. ${format(this.factor.difficulty, 2, 1)}`;
      }
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
    <div class="c-challenge-factor-level">
      {{ info }}
    </div>
    <ChallengeFactorTooltip :factor="factor" />
  </div>
  `
}