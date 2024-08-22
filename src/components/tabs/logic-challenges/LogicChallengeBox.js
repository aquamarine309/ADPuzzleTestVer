import ChallengeBox from "../../ChallengeBox.js";
import DescriptionDisplay from "../../DescriptionDisplay.js";
import EffectDisplay from "../../EffectDisplay.js";

export default {
  name: "LogicChallengeBox",
  components: {
    ChallengeBox,
    DescriptionDisplay,
    EffectDisplay
  },
  props: {
    challenge: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      isRunning: false,
      isCompleted: false
    };
  },
  computed: {
    config() {
      return this.challenge.config;
    },
    name() {
      return `LC${this.challenge.id}`;
    },
    goalText() {
      const el4 = GameElement(4).canBeApplied;
      const baseGoal = format(this.config.goal, 2);
      if (el4) return `${baseGoal} ➜ ${format(this.config.el4Goal, 2)}`;
      return baseGoal;
    }
  },
  methods: {
    update() {
      const challenge = this.challenge;
      this.isUnlocked = challenge.isUnlocked;
      this.isRunning = challenge.isRunning;
      this.isCompleted = challenge.isCompleted;
    }
  },
  template: `
  <ChallengeBox
    :name="name"
    :is-unlocked="isUnlocked"
    :is-running="isRunning"
    :is-completed="isCompleted"
    class="c-challenge-box--logic"
    @start="challenge.requestStart()"
  >
    <template #top>
      <DescriptionDisplay :config="config" />
      <EffectDisplay
        v-if="isRunning"
        :config="config"
      />
    </template>
    <template #bottom>
      <div class="l-challenge-box__bottom--infinity">
        <span>Goal: {{ goalText }} antimatter</span>
        <DescriptionDisplay
          :config="config.reward"
          title="Reward:"
        />
        <EffectDisplay
          v-if="isCompleted"
          :config="config.reward"
        />
      </div>
    </template>
  </ChallengeBox>
  `
};