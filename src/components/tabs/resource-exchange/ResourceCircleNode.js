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
      isUnlocked: false
    }
  },
  computed: {
    classObject() {
      return {
        "o-resource-circle-node": true,
        "o-resource-circle-node--locked": !this.isUnlocked
      }
    }
  },
  methods: {
    update() {
      this.isUnlocked = this.resource.isUnlocked;
    }
  },
  template: `
  <div :class="classObject">
    {{ resource.symbol }}
  </div>
  `
}