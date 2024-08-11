import PrimaryButton from "../../PrimaryButton.js";
import PrimaryToggleButton from "../../PrimaryToggleButton.js";

export default {
  name: "ReplicantiUpgradeButton",
  components: {
    PrimaryButton,
    PrimaryToggleButton
  },
  props: {
    setup: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      description: "",
      canBeBought: false,
      costDescription: "",
      isCapped: false,
      isAutoUnlocked: false,
      isAutobuyerOn: false,
      isEC8Running: false,
      holding: false
    };
  },
  computed: {
    upgrade() {
      return this.setup.upgrade;
    }
  },
  watch: {
    isAutobuyerOn(newValue) {
      Autobuyer.replicantiUpgrade(this.upgrade.id).isActive = newValue;
    }
  },
  methods: {
    update() {
      const setup = this.setup;
      const upgrade = setup.upgrade;
      this.description = setup.formatDescription(upgrade.value);
      this.canBeBought = upgrade.canBeBought;
      this.isCapped = upgrade.isCapped;
      if (!this.isCapped) {
        this.costDescription = setup.formatCost(upgrade.cost);
      }
      const autobuyer = Autobuyer.replicantiUpgrade(upgrade.id);
      this.isAutoUnlocked = autobuyer.isUnlocked;
      this.isAutobuyerOn = autobuyer.isActive;
      this.isEC8Running = EternityChallenge(8).isRunning;
      if (this.holding && !this.isAutobuyerOn) this.upgrade.purchase();
    }
  },
  template: `
  <div class="l-spoon-btn-group l-replicanti-upgrade-button">
    <PrimaryButton
      :enabled="canBeBought"
      class="o-primary-btn--replicanti-upgrade"
      @click="upgrade.purchase()"
      @touchstart="holding = true"
      @touchend="holding = false"
    >
      <span v-html="description" />
      <template v-if="!isCapped">
        <br>
        <span>{{ costDescription }}</span>
      </template>
    </PrimaryButton>
    <PrimaryToggleButton
      v-if="isAutoUnlocked && !isEC8Running"
      v-model="isAutobuyerOn"
      label="Auto:"
      class="l--spoon-btn-group__little-spoon o-primary-btn--replicanti-upgrade-toggle"
    />
  </div>
  `
};

export class ReplicantiUpgradeButtonSetup {
  constructor(upgrade, formatDescription, formatCost) {
    this.upgrade = upgrade;
    this.formatDescription = formatDescription;
    this.formatCost = formatCost;
  }
}