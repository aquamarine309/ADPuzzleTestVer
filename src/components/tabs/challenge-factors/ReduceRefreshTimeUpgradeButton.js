import PrimaryButton from "../../PrimaryButton.js";

export default {
  name: "ReduceRefreshTimeUpgradeButton",
  components: {
    PrimaryButton
  },
  props: {
    upgrade: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isAffordable: false,
      cost: 0,
      effectValue: 0
    }
  },
  computed: {
    description() {
      return this.upgrade.description;
    },
    showEffect() {
      return this.upgrade.showEffect;
    }
  },
  methods: {
    update() {
      this.isAffordable = this.upgrade.isAffordable;
      this.cost = this.upgrade.cost;
      if (this.showEffect) {
        this.effectValue = this.upgrade.effectValue;
      }
    },
    purchase() {
      this.upgrade.purchase();
    }
  },
  template: `
  <PrimaryButton
    :enabled="isAffordable"
    class="c-restart-eternity-btn"
    @click="purchase"
  >
    <span>{{ description }}</span>
    <br>
    <span v-if="showEffect">Currently: {{ formatPercents(effectValue - 1) }}</span>
    <br>
    <span>Cost: {{ formatInt(cost) }} Time Cores</span>
  </PrimaryButton>
  `
}