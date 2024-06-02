export default {
  name: "HowToPlay",
  data() {
    return {
      hasTutorial: false,
      isModern: false,
    };
  },
  computed: {
    topMargin() {
      return {
        "margin-top": this.isModern ? "4.5rem" : "1rem",
      };
    },
    topMarginTutorial() {
      return {
        "margin-top": this.isModern ? "6.9rem" : "3.1rem",
      };
    }
  },
  methods: {
    update() {
      this.hasTutorial = Tutorial.emphasizeH2P();
      this.isModern = player.options.newUI;
    },
    showH2P() {
      Modal.h2p.show();
    },
    showInfo() {
      Modal.information.show();
    }
  },
  template: `
  <div>
    <div
      class="o-tab-btn l-help-me"
      :style="topMargin"
      @click="showH2P"
      data-v-how-to-play
    >
      ?
    </div>
    <div
      v-if="hasTutorial"
      class="h2p-tutorial--glow"
      :style="topMarginTutorial"
      data-v-how-to-play
    />
    <div
      class="o-tab-btn l-information l-help-me"
      @click="showInfo"
      data-v-how-to-play
    >
      i
      <div
        v-if="hasTutorial"
        class="h2p-tooltip"
        data-v-how-to-play
      >
        Click for info
      </div>
    </div>
  </div>
  `
};