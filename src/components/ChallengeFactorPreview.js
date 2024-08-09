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
  computed: {
    averageDifficulty() {
      return formatFloat(ChallengeFactors.calculateDifficulty(this.factors), 1);
    }
  },
  template: `
  <div class="c-challenge-factor-preview">
    <div>Current Challenge Factors (Difficulty: {{ averageDifficulty }}):</div>
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
  `
}