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
      if (!this.isEnabled || this.isLocked) return "c-tt-buy-button--locked";

      return "c-tt-buy-button--unlocked";
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
  >
    {{ isLocked ? "Requires an Eternity to unlock" : formatCost(cost) }}
  </button>
  `
};