export default {
  name: "ElementComponent",
  props: {
    // ElementEffectState
    element: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      percents: 0
    }
  },
  computed: {
    symbol() {
      return this.element.symbol;
    },
    elementClass() {
      return this.element.uiClass;
    }
  },
  methods: {
    update() {
      this.percents = this.element.time / this.element.totalTime;
    }
  },
  template: `
  <div
    class="o-element-component"
    :class="elementClass"
  >
    {{ symbol }}
    <div class="c-element-time">{{ timeLeft }}</time>
  </div>
  `
}