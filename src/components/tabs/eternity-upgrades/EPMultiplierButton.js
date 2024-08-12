import PrimaryButton from "../../PrimaryButton.js";
import PrimaryToggleButton from "../../PrimaryToggleButton.js";

export default {
  name: "EPMultiplierButton",
  components: {
    PrimaryButton,
    PrimaryToggleButton
  },
  data() {
    return {
      isAutobuyerActive: false,
      isAutoUnlocked: false,
      isAffordable: false,
      multiplier: new BE(),
      cost: new BE(),
      continuum: false
    };
  },
  computed: {
    upgrade() {
      return EternityUpgrade.epMult;
    },
    autobuyer() {
      return Autobuyer.epMult;
    },
    classObject() {
      if (this.isDoomed) {
        return {
          "o-eternity-upgrade": true,
          "o-eternity-upgrade--useless": !this.isAffordable,
          "o-pelle-disabled-pointer": true,
          "o-pelle-disabled": true,
        };
      }
      return {
        "o-eternity-upgrade": true,
        "o-eternity-upgrade--available": this.isAffordable,
        "o-eternity-upgrade--unavailable": !this.isAffordable,
        "o-continuum": this.continuum
      };
    },
    isDoomed: () => Pelle.isDoomed,
  },
  watch: {
    isAutobuyerActive(newValue) {
      Autobuyer.epMult.isActive = newValue;
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isAutoUnlocked = this.autobuyer.isUnlocked;
      this.isAutobuyerActive = this.autobuyer.isActive;
      this.multiplier.copyFrom(upgrade.effectValue);
      this.cost.copyFrom(upgrade.cost);
      this.isAffordable = upgrade.isAffordable;
      this.continuum = Continuum.isOn("epMult");
    },
    purchaseUpgrade() {
      if (RealityUpgrade(15).isLockingMechanics) RealityUpgrade(15).tryShowWarningModal();
      else this.upgrade.purchase();
    }
  },
  template: `
  <div
    class="l-spoon-btn-group l-margin-top"
    data-v-ep-multiplier-button
  >
    <button
      :class="classObject"
      @click="purchaseUpgrade"
      data-v-ep-multiplier-button
    >
      <div :class="{ 'o-pelle-disabled': isDoomed }">
        Multiply Eternity Points from all sources by {{ formatX(5) }}
        <br>
        Currently: {{ formatX(multiplier, 2, 0) }}
      </div>
      <template v-if="!continuum">
        <br>
        Cost: {{ quantify("Eternity Point", cost, 2, 0) }}
      </template>
    </button>
    <template v-if="!continuum">
      <PrimaryButton
        class="l--spoon-btn-group__little-spoon o-primary-btn--small-spoon"
        @click="upgrade.buyMax(false)"
      >
        Max Eternity Point mult
      </PrimaryButton>
      <PrimaryToggleButton
        v-if="isAutoUnlocked"
        v-model="isAutobuyerActive"
        label="Autobuy EP mult"
        class="l--spoon-btn-group__little-spoon o-primary-btn--small-spoon"
      />
    </template>
  </div>
  `
};