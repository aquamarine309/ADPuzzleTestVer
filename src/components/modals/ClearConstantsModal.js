import ModalWrapperChoice from "./ModalWrapperChoice.js";

export default {
  name: "ClearConstantsModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      constantCount: 0,
    };
  },
  methods: {
    update() {
      this.constantCount = Object.keys(player.reality.automator.constants).length;
      if (this.constantCount === 0) this.emitClose();
    },
    deleteConstants() {
      player.reality.automator.constants = {};
      player.reality.automator.constantSortOrder = [];
    }
  },
  template: `
  <ModalWrapperChoice
    @confirm="deleteConstants"
  >
    <template #header>
      Deleting Automator Constants
    </template>
    <div class="c-modal-message__text">
      Are you sure you wish to delete all of your currently-defined automator constants?
      <br>
      <span
        class="l-lost-text"
        data-v-clear-constants-modal
      >
        This will irreversibly delete {{ quantify("constant", constantCount) }}!
      </span>
    </div>
    <template #confirm-text>
      Delete All
    </template>
  </ModalWrapperChoice>
  `
};