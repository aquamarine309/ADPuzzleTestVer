import DescriptionDisplay from "../../DescriptionDisplay.js";
import EffectDisplay from "../../EffectDisplay.js";

export default {
  name: "LogicNodeComponent",
  components: {
    DescriptionDisplay,
    EffectDisplay
  },
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
    config() {
      return this.node.config;
    },
    color() {
      return this.config.color;
    },
    position() {
      return this.config.position;
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
        top: `${50 + this.divisor * this.position[1]}%`,
        left: `${50 + this.divisor * this.position[0]}%`,
        "--color-node--base": this.color.baseColor,
        "--color-node--bg": this.color.bgColor
      }
    },
    reqClass() {
      return {
        "c-logic-node-tooltip__requirement": true,
        "c-logic-node-tooltip__requirement--bad": !this.node.isUnlocked
      }
    },
    symbol() {
      return this.config.symbol;
    },
    name() {
      return this.config.name;
    },
    requirement() {
      const req = this.config.requirement;
      if (typeof req === "function") return req();
      return req;
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
    <div class="c-logic-node-tooltip">
      <div class="c-logic-node-tooltip__name">{{ name }}</div>
      <DescriptionDisplay :config="config" />
      <EffectDisplay
        br
        :config="config"
      />
      <br>
      <div :class="reqClass">Requirement: {{ requirement }}</div>
    </div>
  </div>
  `
}