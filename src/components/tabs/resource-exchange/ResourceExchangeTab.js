import ResourceExchangeLayout from "./ResourceExchangeLayout.js";
import ResourceInfo from "./ResourceInfo.js";
import ExchangeButton from "./ExchangeButton.js";
import LevelUpButton from "./LevelUpButton.js"

export default {
  name: "ResourceExchangeTab",
  components: {
    ResourceExchangeLayout,
    ResourceInfo,
    ExchangeButton,
    LevelUpButton
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
    }
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
    }
  },
  template: `
  <div>
    <ResourceInfo :resource="currentResource" />
    <br>
    <div class="c-resource-exchange-layout-container">
      <ResourceExchangeLayout @toggle="handleToggle" />
      <div class="c-resource-exchange-right-container">
        <div class="c-lp-text-row">
          You have <span class="c-lp-amount">{{ format(logicPoints, 2, 2) }}</span> Logic Points.
        </div>
        <div class="c-lp-text-row">
          Logic Points and Exchange Levels provide a <span class="c-lp-amount">{{ formatX(multiplier, 2, 2) }}</span> to your Antimatter Dimensions.
        </div>
        <div class="c-resource-exchange-buttons-container">
          <ExchangeButton :resource="currentResource" />
          <LevelUpButton />
        </div>
      </div>
    </div>
  </div>
  `
}