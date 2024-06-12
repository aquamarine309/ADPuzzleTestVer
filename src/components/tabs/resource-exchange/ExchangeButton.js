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
      isTooSmall: false,
      isUnlocked: false,
    }
  },
  computed: {
    min() {
      return this.resource.min;
    },
    name() {
      return this.resource.name;
    },
    btnText() {
      if (!this.isUnlocked) return "Locked";
      if (this.isTooSmall) return `Not Enough ${this.name}`
      if (this.canExchange) return `Exchange ${this.name}`;
      return `Requires more than ${format(this.min, 2, 1)} ${this.name} to exchange`
    },
    btnClass() {
      return {
        "c-exchange-btn": true,
        "c-exchange-btn--disabled": !this.canExchange
      }
    }
  },
  methods: {
    update() {
      const resource = this.resource;
      this.isUnlocked = resource.isUnlocked;
      this.isTooSmall = resource.isTooSmall;
      this.canExchange = resource.canExchange;
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