import ResourceExchangeLayout from "./ResourceExchangeLayout.js";
import ResourceInfo from "./ResourceInfo.js";
import ExchangeButton from "./ExchangeButton.js";
import LevelUpButton from "./LevelUpButton.js"
import LogicUpgradeButton from "./LogicUpgradeButton.js";

export default {
  name: "ResourceExchangeTab",
  components: {
    ResourceExchangeLayout,
    ResourceInfo,
    ExchangeButton,
    LevelUpButton,
    LogicUpgradeButton
  },
  data() {
    return {
      resourceId: 0,
      logicPoints: new Decimal(0),
      multiplier: new Decimal(0)
    }
  },
  computed: {
    currentResource() {
      return ResourceExchange.all[this.resourceId];
    },
    upgrades: () => LogicUpgrades.all,
  },
  methods: {
    update() {
      this.logicPoints = Currency.logicPoints.value;
      this.multiplier = ResourceExchangeUpgrade.effectValue;
    },
    handleToggle(index) {
      if (this.resourceId === index) return;
      this.resourceId = index;
      GameUI.update();
    },
    id(row, column) {
      return (row - 1) * 5 + column - 1;
    }
  },
  template: `
  <div>
    <ResourceInfo :resource="currentResource" />
    <div class="c-resource-exchange-layout-container">
      <ResourceExchangeLayout @toggle="handleToggle" />
      <div class="c-resource-exchange-right-container">
        <div class="c-lp-text-row">
          You have <span class="c-lp-amount">{{ format(logicPoints, 2, 2) }}</span> Logic Points.
        </div>
        <div class="c-lp-text-row">
          Total Logic Points and Exchange Levels provide a <span class="c-lp-amount">{{ formatX(multiplier, 2, 2) }}</span> multiplier to your Antimatter Dimensions.
        </div>
        <div class="c-resource-exchange-buttons-container">
          <ExchangeButton :resource="currentResource" />
          <LevelUpButton />
        </div>
      </div>
    </div>
    <br>
    <div
      v-for="row in 2"
      :key="row"
      class="l-logic-upgrade-grid__row"
    >
      <LogicUpgradeButton
        v-for="column in 5"
        :key="id(row, column)"
        :upgrade="upgrades[id(row, column)]"
      />
    </div>
  </div>
  `
}