export default {
  name: "ResourceCircleNode",
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      isOpen: false
    }
  },
  computed: {
    classObject() {
      return {
        "o-resource-circle-node": true,
        "o-resource-circle-node--locked": !this.isUnlocked,
        "o-resource-circle-node--open": this.isOpen,
        "o-resource-circle-node--locked-open": !this.isUnlocked && this.isOpen
      }
    }
  },
  methods: {
    update() {
      this.isUnlocked = this.resource.isUnlocked;
      this.isOpen = this.resource.id === player.logic.resourceExchange.lastOpenId;
    }
  },
  template: `
  <div :class="classObject">
    {{ resource.symbol }}
  </div>
  `
}