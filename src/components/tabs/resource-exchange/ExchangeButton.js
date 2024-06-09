export default {
  name: "ExchangeButton",
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      canExchange: false,
      isUnlocked: false
    }
  },
  computed: {
    name() {
      return this.resource.name;
    },
    btnText() {
      if (!this.isUnlocked) return "Locked";
      if (this.canExchange) return `Exchange ${this.name}`;
      return `Requires more than ${format(this.min, 2, 1)} ${this.name} to exchange`
    },
    btnClass() {
      return {
        "c-exchange-btn": true,
        "c-exchange-btn--disabled": !this.isUnlocked || !this.canExchange
      }
    }
  },
  methods: {
    update() {
      this.isUnlocked = this.resource.isUnlocked;
      this.canExchange = this.resource.canExchange;
      this.min = this.resource.min;
    }
  },
  template: `
  <div
    :class="btnClass"
    @click="resource.exchange()"
  >
    {{ btnText }}
  </div>
  `
}