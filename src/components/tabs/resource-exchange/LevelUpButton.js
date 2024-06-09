export default {
  name: "LevelUpButton",
  data() {
    return {
      isAffordable: false,
      cost: new Decimal(0),
      level: 0
    }
  },
  computed: {
    upgrade: () => ResourceExchangeUpgrade,
    btnClass() {
      return {
        "c-exchange-btn": true,
        "c-exchange-btn--disabled": !this.isAffordable
      }
    },
    config() {
      return this.upgrade.config;
    }
  },
  methods: {
    update() {
      this.isAffordable = this.upgrade.isAffordable;
      this.level = this.upgrade.boughtAmount + 1;
      this.cost.copyFrom(this.upgrade.cost);
    }
  },
  template: `
  <div
    :class="btnClass"
    @click="upgrade.purchase()"
  >
    <div>Level Up</div>
    <div>Cost: {{ format(cost, 2, 2) }} LP</div>
    <div>Exchange Lv. {{ formatInt(level) }} ➜ {{ formatInt(level + 1) }}</div>
  </div>
  `
}