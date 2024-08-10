import ChallengeFactorComponent from "./ChallengeFactorComponent.js";

export default {
  name: "ChallengeFactorPreview",
  components: {
    ChallengeFactorComponent
  },
  props: {
    factors: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      hideChallengeFactor: false
    }
  }, 
  computed: {
    averageDifficulty() {
      return formatFloat(ChallengeFactors.calculateDifficulty(this.factors), 1);
    },
    classText() {
      return this.hideChallengeFactor ? "far fa-plus-square" : "far fa-minus-square";
    }
  },
  watch: {
    hideChallengeFactor(value) {
      player.options.hideChallengeFactor = value;
    }
  },
  methods: {
    update() {
      this.hideChallengeFactor = player.options.hideChallengeFactor;
    }
  }, 
  template: `
  <div class="c-challenge-factor-preview">
    <div><i
      class="o-clickable"
      :class="classText"
      @click="hideChallengeFactor = !hideChallengeFactor"
      data-v-challenge-facfor-preview
    /> <b>Current Challenge Factors (Difficulty: {{ averageDifficulty }}):</b></div>
    <div v-if="!hideChallengeFactor">
      <div
        v-if="factors.length > 0"
        class="c-challenge-factors-row"
      >
        <ChallengeFactorComponent
          v-for="factor in factors"
          :factor="factor"
          :key="factor.id"
        />
      </div>
      <div v-else>
        Void
      </div>
    </div>
    <div
      v-else
      @click="hideChallengeFactor = false"
    >(Details hidden, click to unhide)</div>
  </div>
  `
}