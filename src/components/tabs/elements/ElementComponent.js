export default {
  name: "ElementComponent",
  props: {
    element: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      canBeBought: false
    }
  }, 
  computed: {
    config() {
      return this.element.config;
    },
    name() {
      return this.config.name;
    },
    id() {
      return this.config.id;
    },
    position() {
      return this.config.position;
    },
    radioactive() {
      return this.config.radioactive || false;
    },
    artificial() {
      return this.config.artificial || false;
    },
    classObject() {
      let typeClass;
      switch (this.config.type) {
        case ELEMENT_TYPE.NON_METALLIC:
          typeClass = "o-element-grid--non-metallic";
          break;
        case ELEMENT_TYPE.NOBLE_GAS:
          typeClass = "o-element-grid--noble-gas";
          break;
        case ELEMENT_TYPE.METALLIC:
          typeClass = "o-element-grid--metallic";
          break;
      }
      let unlockedClass;
      if (this.isUnlocked) unlockedClass = `${typeClass}--unlocked`;
      else if (this.canBeBought) unlockedClass = `${typeClass}--available`;
      return {
        "o-element-grid": true,
        "o-element-grid--radioactive": this.radioactive,
        [typeClass]: true,
        [unlockedClass]: this.isUnlocked || this.canBeBought
      }
    },
    styleObject() {
      return {
        top: `${5 * this.position[0] + 0.2}rem`,
        left: `${5 * this.position[1] + 0.2}rem`
      }
    }
  },
  methods: {
    update() {
      this.isUnlocked = this.element.isBought;
      this.canBeBought = this.element.canBeBought;
    },
    handleClick() {
      this.element.purchase();
    }
  }, 
  template: `
  <div
    :class="classObject"
    :style="styleObject"
    @click="handleClick"
  >
    <span class="c-element-id">{{ id }}</span>
    <span class="c-element-name">
      {{ name }}<span
        v-if="artificial"
        class="c-element-name-artificial"
      >*</span>
    </span>
  </div>
  `
}