export default {
  name: "LogicNodeComponent",
  props: {
    containerSize: {
      type: Number,
      required: true
    },
    nodeRadius: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      show: false
    }
  }, 
  computed: {
    blob() {
      return Theme.currentName() === "S11";
    },
    isUnlocked() {
      return player.secretUnlocks.logicNodeBlobUnlocked;
    },
    visible() {
      return this.isUnlocked && this.show;
    },
    divisor() {
      return 100 * this.nodeRadius / this.containerSize;
    },
    styleObject() {
      // 1% is margin
      return {
        top: `${1 + this.divisor / 2}%`,
        left: `${1 + this.divisor / 2}%`,
        "--color-node--base": "#fbc21b",
        "--color-node--bg": "#ffd867",
        opacity: this.visible ? 1 : 0,
        transition: "0.3s",
        cursor: this.blob || this.isUnlocked ? "pointer" : "default"
      }
    },
    symbol() {
      // Blob: "think"
      // other: "sleep"
      return this.blob ? "\uE011" : "\uE01a";
    }
  },
  watch: {
    show(value) {
      player.secretUnlocks.logicNodeBlobShow = value;
    }
  },
  methods: {
    update() {
      this.show = player.secretUnlocks.logicNodeBlobShow;
    },
    unlock() {
      this.show = true;
      this.$recompute("isUnlocked");
    },
    handleClick() {;
      if (!this.isUnlocked && this.blob) {
        this.unlock();
      } else {
        this.show = !this.show;
      }
    }
  },
  template: `
  <!-- Locked style is better -->
  <div
    class="c-logic-node c-logic-node--locked"
    :style="styleObject"
    @click="handleClick"
  >
    <div class="c-logic-node-symbol--blob">
      {{ symbol }}
    </div>
  </div>
  `
}