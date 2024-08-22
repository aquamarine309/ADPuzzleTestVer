import DescriptionDisplay from "../../DescriptionDisplay.js";
import EffectDisplay from "../../EffectDisplay.js";
import CostDisplay from "../../CostDisplay.js";

export default {
  name: "ElementInfo",
  components: {
    DescriptionDisplay,
    EffectDisplay,
    CostDisplay
  },
  props: {
    element: {
      type: Object,
      required: false
    }
  },
  computed: {
    config() {
      return this.element.config;
    },
    name() {
      return this.config.fullName ?? this.config.name;
    },
    group() {
      const p = this.config.position;
      if (p[0] >= 8) return "IIIB";
      if (p[1] < 7) return ["IA", "IIA", "IIIB", "IVB", "VB", "VIB", "VIIB"][p[1]];
      if (p[1] >= 7 && p[1] < 10) return "VIII";
      return ["IB", "IIB", "IIIA", "IVA", "VA", "VIA", "VIIA", "O"][p[1] - 10];
    },
    type() {
      const type = [];
      const p = this.config.position;
      if (this.config.artificial) type.push("artificial");
      if (this.config.radioactive) type.push("radioactive");
      switch (this.config.type) {
        case ELEMENT_TYPE.NON_METALLIC:
          if (p[1] === 16) type.push("halogen");
          else type.push("non-metallic");
          break;
        case ELEMENT_TYPE.NOBLE_GAS:
          type.push("inert");
          break;
        case ELEMENT_TYPE.METALLIC:
          if (p[1] === 0) type.push("alkali metal");
          else if (p[1] === 1) type.push("alkaline-earth metal");
          else type.push("metallic");
          break;
      }
      return `${type.join(" ")} element`.capitalize();
    },
    infoText() {
      const info = [];
      info.push(`Atomic number: ${formatInt(this.element.id)}`);
      info.push(`Name: ${this.name}`);
      info.push(`Group: ${this.group}`);
      return info.join(" | ");
    }
  },
  template: `
  <div>
    <div
      v-if="element"
      class="c-element-info"
    >
      <span class="c-element-info-text"><i class="fas fa-atom" /> {{ infoText }} <i class="fas fa-atom" /></span>
      <span class="c-small-effect c-element-info-text">({{ type }})</span>
      <DescriptionDisplay
        :config="config"
        title="Effect:"
        class="c-element-effect"
      />
      <EffectDisplay
        class="c-element-effect"
        :config="config"
      />
      <CostDisplay
        class="c-element-effect"
        :config="config"
        name="Antimatter"
      />
    </div>
    <div v-else>
      Click an element to show info
    </div>
  </div>
  `
}