export default {
  name: "ChallengeFactorTooltip",
  props: {
    factor: {
      type: Object,
      required: true
    }
  },
  computed: {
    config() {
      return this.factor.config;
    },
    name() {
      return this.factor.name;
    },
    description() {
      return this.config.description;
    },
    scoreDisplay() {
      return formatFloat(this.factor.difficulty, 1);
    }
  },
  template: `
  <div class="l-challenge-factor-tooltip">
    <div class="c-challenge-factor-tooltip--name">{{ name }}</div>
    <div class="c-challenge-factor-tooltip--score">(Difficulty: {{ scoreDisplay }})</div>
    <div class="c-challenge-factor-tooltip--description">{{ description }}</div>
  </div>
  `
}