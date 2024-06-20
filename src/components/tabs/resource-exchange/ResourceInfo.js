export default {
  name: "ResourceInfo",
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  data() {
  return {
      isUnlocked: false,
      exchanged: new BE(0),
      newExchanged: new BE(0),
      value: new BE(0),
      newValue: new BE(0),
      isAffordable: false
    }
  },
  computed: {
    requirementLevel() {
      return this.resource.requirementLevel;
    },
    classObject() {
      return {
        "c-resource-info": true,
        "c-resource-info--disabled": !this.isUnlocked
      }
    }
  },
  methods: {
    update() {
      this.isUnlocked = this.resource.isUnlocked;
      if (!this.isUnlocked) return;
      this.exchanged.copyFrom(this.resource.data.value);
      this.newExchanged.copyFrom(this.resource.newExchanged);
      this.value.copyFrom(this.resource.value);
      this.newValue.copyFrom(this.resource.afterExchangeValue);
      this.isAffordable = this.resource.isAffordable;
    }
  },
  template: `
  <div :class="classObject">
    <div class="c-resource-info-title">
      <span v-if="isUnlocked">{{ resource.symbol }} {{ resource.name }} {{ resource.symbol }}</span>
      <span v-else>Locked</span>
    </div>
    <div
      v-if="isUnlocked"
      class="c-resource-info-values"
    >
      <span>Exchanged Amount: {{ format(exchanged, 2, 1) }} ➜ {{ format(newExchanged, 2, 1) }}</span>
      <span>Gained Points: {{ formatX(value, 2, 2) }} ➜ {{ formatX(newValue, 2, 2) }}</span>
    </div>
    <div v-else>
      (Unlock at Exchange Level {{ formatInt(requirementLevel) }})
    </div>
  </div>
  `
}