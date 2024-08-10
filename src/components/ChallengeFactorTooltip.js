export default {
  name: "ChallengeFactorTooltip",
  props: {
    factor: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      description: "",
      level: "",
      nextLevelCost: new BE(),
      capped: false
    }
  }, 
  computed: {
    config() {
      return this.factor.config;
    },
    name() {
      return this.factor.name;
    },
    scoreDisplay() {
      return formatFloat(this.factor.difficulty, 1);
    },
    levelInfo() {
      if (this.capped) return "Level capped";
      return `Next level at ${format(this.nextLevelCost, 2)} TC`;
    }
  },
  methods: {
    update() {
      this.description = this.factor.description;
      this.level = this.factor.displayLevel;
      this.capped = this.factor.levelCapped;
      if (!this.capped) {
        this.nextLevelCost = this.factor.cost;
      }
    }
  }, 
  template: `
  <div class="l-challenge-factor-tooltip">
    <div class="c-challenge-factor-tooltip--name">{{ name }}</div>
    <div class="c-challenge-factor-tooltip--score">(Difficulty: {{ scoreDisplay }} | Level: {{ level }})</div>
    <div class="c-challenge-factor-tooltip--level-info">{{ levelInfo }}</div>
    <div>{{ description }}</div>
  </div>
  `
}