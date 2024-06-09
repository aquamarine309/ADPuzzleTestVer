export default {
  name: "BigCrunchButton",
  data() {
    return {
      isModern: false,
      smallCrunch: false,
      shouldDisplay: false,
      totalAmount: 4
    };
  },
  computed: {
    correctIndex() {
      return Math.floor(Math.random() * this.totalAmount);
    },
    buttonTexts() {
      const correct = "Big Crunch";
      const incorrect = ["Infinity", "Big Lunch", "Big Cunch", "Big Infinity", "Eternity", "Small Infinity", "Small Crunch"];
      const result = [];
      for (let i = 0; i < this.totalAmount; i++) {
        if (i === this.correctIndex) {
          result.push(correct);
          continue;
        }
        let text;
        do {
          text = incorrect.randomElement();
        } while (result.includes(text));
        result.push(text);
      }
      return result;
    }
  },
  methods: {
    update() {
      this.shouldDisplay = !player.break && Player.canCrunch;
      if (!this.shouldDisplay) return;
      this.isModern = player.options.newUI;
      this.smallCrunch = Time.bestInfinityRealTime.totalMinutes <= 1;
    },
    handleClick(index) {
      if (index === this.correctIndex) {
        this.bigCrunch();
        return;
      }
      if (this.totalAmount >= 7) {
        player.showCrunchFormat.next = true;
        GameUI.notify.error("You have got a punishment. Good luck.");
        this.totalAmount = 1;
        return;
      };
      ++this.totalAmount;
    },
    bigCrunch() {
      if (PlayerProgress.infinityUnlocked()) bigCrunchResetRequest();
      else Modal.bigCrunch.show();
    },
    
  },
  template: `
  <span v-if="shouldDisplay">
    <div v-if="isModern">
      <h3
        v-if="!smallCrunch"
        class="l-spacing"
        data-v-big-crunch-button
      >
        The world has collapsed due to excess antimatter.
      </h3>
      <div
        class="l-big-crunch-containter"
        v-for="(text, index) in buttonTexts"
        :key="index"
      >
        <button
          :class="{
            'btn-big-crunch': true,
            'btn-big-crunch--small': smallCrunch
          }"
          @click="handleClick(index)"
        >
          {{ text }}
        </button>
      </div>
    </div>
    <div v-else>
      <div
        class="l-big-crunch-containter"
        v-for="(text, index) in buttonTexts"
        :key="index"
      >
        <button
          :class="{
            'o-tab-btn': true,
            'o-big-crunch-btn': true,
            'l-old-ui__big-crunch-btn': true,
            'l-old-ui__big-crunch-btn--overlay': smallCrunch
          }"
          @click="handleClick(index)"
        >
          {{ text }}
        </button>
      </div>
      <div
        v-if="!smallCrunch"
        class="o-emptiness"
      >
        The world has collapsed due to excess of antimatter.
      </div>
    </div>
  </span>
  `
};