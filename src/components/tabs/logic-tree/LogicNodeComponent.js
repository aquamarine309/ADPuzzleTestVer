export default {
  name: "LogicNodeComponent",
  props: {
    node: {
      type: Object,
      required: true
    },
    containerSize: {
      type: Number,
      required: true
    },
    nodeRadius: {
      type: Number,
      required: true
    }
  },
  computed: {
    color() {
      return this.node.config.color;
    },
    position() {
      return this.node.config.position;
    },
    divisor() {
      return 100 * this.nodeRadius / this.containerSize;
    },
    classObject() {
      return {
        "c-logic-node": true,
        "c-logic-node--locked": !this.node.isUnlocked
      }
    },
    styleObject() {
      return {
        "top": `${50 + this.divisor * this.position[1]}%`,
        "left": `${50 + this.divisor * this.position[0]}%`,
        "--color-node--base": this.color.baseColor,
        "--color-node--bg": this.color.bgColor
      }
    },
    symbol() {
      return this.node.config.symbol;
    }
  },
  template: `
  <div
    :class="classObject"
    :style="styleObject"
  >
    <div
      class="c-logic-node-symbol"
      v-html="symbol"
    />
  </div>
  `
}