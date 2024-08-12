export default {
  props: {
    budget: BE,
    cost: BE,
    formatCost: {
      type: Function,
      required: true,
    },
    action: {
      type: Function,
      required: true
    },
    continuum: {
      type: Boolean,
      required: false,
      default: false
    },
    continuumValue: {
      type: BE,
      required: true
    }
  },
  data() {
    return {
      isLocked: false
    };
  },
  computed: {
    isEnabled() {
      if (this.isLocked) return false;
      return this.budget.gte(this.cost);
    },
    enabledClass() {
      const locked = !this.isEnabled || this.isLocked
      if (this.continuum) return "o-continuum";
      return locked ? "c-tt-buy-button--locked" : "c-tt-buy-button--unlocked";
    },
    text() {
      if (this.continuum) return formatFloat(this.continuumValue, 2);
      return this.isLocked ? "Requires an Eternity to unlock" : this.formatCost(this.cost);
    }
  },
  methods: {
    update() {
      this.isLocked = player.eternities.eq(0);
    }
  },
  template: `
  <button
    class="l-tt-buy-button c-tt-buy-button"
    :class="enabledClass"
    @click="action"
    data-v-time-theorem-buy-button
  >
    {{ text }}
  </button>
  `
};