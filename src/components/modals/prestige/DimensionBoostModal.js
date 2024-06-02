import ModalWrapperChoice from "../ModalWrapperChoice.js";

export default {
  name: "DimensionBoostModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    bulk: {
      type: Boolean,
      required: true,
    }
  },
  computed: {
    message() {
      const keepDimensions = Perk.antimatterNoReset.canBeApplied || Achievement(111).canBeApplied ||
        PelleUpgrade.dimBoostResetsNothing.isBought
        ? `not actually reset anything due to an upgrade you have which prevents Antimatter and Antimatter Dimensions
          from being reset in this situation. You will still gain the multiplier from the Boost, as usual.`
        : `reset your Antimatter and Antimatter Dimensions. Are you sure you want to do this?`;

      return `This will ${keepDimensions}`;
    },
  },
  methods: {
    handleYesClick() {
      if (DimBoost.purchasedBoosts > 0) return;
      requestDimensionBoost(this.bulk);
      EventHub.ui.offAll(this);
    }
  },
  template: `
  <ModalWrapperChoice
    confirmClass="o-primary-btn--width-medium c-modal-message__okay-btn o-primary-btn--disabled"
  >
    <template #header>
      You are about to do a 
      <span
        @click="handleYesClick"
        class="c-dim-boost-text"
      >
        Dimension Boost Reset
      </span>
    </template>
    <div class="c-modal-message__text">
      {{ message }}
    </div>
  </ModalWrapperChoice>
  `
};