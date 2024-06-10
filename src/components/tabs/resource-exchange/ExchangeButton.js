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
      isUnlocked: false
    }
  },
  computed: {
    name() {
      return this.resource.name;
    },
    btnText() {
      if (!this.isUnlocked) return "Locked";
      if (this.isTooSmall) return `${this.name} is too little`
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
      this.min = resource.min;
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