import CostDisplay from "../../CostDisplay.js";
import DescriptionDisplay from "../../DescriptionDisplay.js";
import EffectDisplay from "../../EffectDisplay.js";
import HintText from "../../HintText.js";

export default {
  name: "LogicUpgradeButton",
  components: {
    DescriptionDisplay,
    EffectDisplay,
    CostDisplay,
    HintText
  },
  props: {
    upgrade: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isAvailableForPurchase: false,
      canBeBought: false,
      isBought: false,
      isPossible: false
    };
  },
  computed: {
    config() {
      return this.upgrade.config;
    },
    classObject() {
      return {
        "c-logic-upgrade-btn--bought": this.isBought,
        "c-logic-upgrade-btn--unavailable": !this.isBought && !this.canBeBought && this.isAvailableForPurchase,
        "c-logic-upgrade-btn--possible": !this.isAvailableForPurchase && this.isPossible,
        "c-logic-upgrade-btn--locked": !this.isAvailableForPurchase && !this.isPossible,
      };
    },
    requirementConfig() {
      return {
        description: this.config.requirement
      };
    },
    canLock() {
      return this.config.canLock && !(this.isAvailableForPurchase || this.isBought);
    },
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isAvailableForPurchase = upgrade.isAvailableForPurchase;
      this.canBeBought = upgrade.canBeBought;
      this.isBought = !upgrade.isRebuyable && upgrade.isBought;
      this.isPossible = upgrade.isPossible;
    }
  },
  template: `
  <div class="l-spoon-btn-group">
    <button
      :class="classObject"
      class="l-logic-upgrade-btn c-logic-upgrade-btn"
      @click="upgrade.purchase()"
    >
      <HintText
        type="logicUpgrades"
        class="l-hint-text--logic-upgrade c-hint-text--logic-upgrade"
      >
        {{ config.name }}
      </HintText>
      <span>
        <DescriptionDisplay :config="config" />
        <template v-if="$viewModel.shiftDown === isAvailableForPurchase">
          <br>
          <DescriptionDisplay
            :config="requirementConfig"
            label="Requirement:"
            class="c-logic-upgrade-btn__requirement"
          />
        </template>
        <template v-else>
          <EffectDisplay
            :config="config"
            br
          />
          <CostDisplay
            v-if="!isBought"
            :config="config"
            br
            name="Logic Point"
          />
        </template>
      </span>
    </button>
  </div>
  `
};