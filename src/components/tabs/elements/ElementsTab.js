import ElementComponent from "./ElementComponent.js";
import ElementInfo from "./ElementInfo.js";

export default {
  name: "ElementsTab",
  components: {
    ElementComponent,
    ElementInfo
  },
  computed: {
    elements() {
      return GameElements.all;
    },
    selected() {
      return GameElements.selected;
    }
  },
  methods: {
    handleClick(id) {
      player.lastSelectedElementId = id;
      this.$recompute("selected");
    }
  }, 
  template: `
  <div>
    <ElementInfo :element="selected" />
    <div class="l-element-table-container">
      <ElementComponent
        v-for="element in elements"
        :key="element.id"
        :element="element"
        @click.native="handleClick(element.id)"
      />
      <div class="l-element-star-1">*</div>
      <div class="l-element-star-2">*</div>
    </div>
  </div>
  `
}