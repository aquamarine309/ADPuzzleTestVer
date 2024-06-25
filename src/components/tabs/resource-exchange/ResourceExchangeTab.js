import ExchangeButton from "./ExchangeButton.js";
import LevelUpButton from "./LevelUpButton.js"
import LogicUpgradeButton from "./LogicUpgradeButton.js";
import PrimaryButton from "../../PrimaryButton.js";
import ResourceExchangeLayout from "./ResourceExchangeLayout.js";
import ResourceInfo from "./ResourceInfo.js";
import SliderComponent from "../../SliderComponent.js";

export default {
  name: "ResourceExchangeTab",
  components: {
    ResourceExchangeLayout,
    ResourceInfo,
    ExchangeButton,
    LevelUpButton,
    LogicUpgradeButton,
    SliderComponent,
    PrimaryButton
  },
  data() {
    return {
      resourceId: 0,
      logicPoints: new BE(0),
      totalLogicPoints: new BE(0),
      multiplier: new BE(0),
      sliderInterval: 1,
      rateType: PERCENTS_TYPE.NORMAL
    }
  },
  computed: {
    currentResource() {
      return ResourceExchange.all[this.resourceId];
    },
    upgrades: () => LogicUpgrades.all,
    sliderProps() {
      return {
        min: 1,
        max: 100,
        interval: 1,
        width: "100%",
        tooltip: false,
        "dot-class": "c-exchange__slider-handle",
        "bg-class": "c-exchange__slider-bg",
        "process-class": "c-exchange__slider-process"
      };
    },
    rateTypeName() {
      switch (this.rateType) {
        case PERCENTS_TYPE.NORMAL:
          return "Linear";
        case PERCENTS_TYPE.LOG:
          return "Logarithmic";
      }
    }
  },
  watch: {
    resourceId(value) {
      player.logic.resourceExchange.lastOpenId = value;
    }
  },
  methods: {
    update() {
      this.resourceId = player.logic.resourceExchange.lastOpenId;
      this.logicPoints = Currency.logicPoints.value;
      this.totalLogicPoints = GameCache.logicPoints.value;
      this.multiplier = ResourceExchangeUpgrade.effectValue;
      this.rateUnlocked = LogicChallenge(2).isCompleted;
      this.sliderInterval = this.currentResource.exchangeRate * 100;
      this.rateType = this.currentResource.rateType;
    },
    handleToggle(index) {
      if (this.resourceId === index) return;
      this.resourceId = index;
      GameUI.update();
    },
    id(row, column) {
      return (row - 1) * 5 + column - 1;
    },
    adjustSliderValue(value) {
      this.sliderInterval = value;
      this.currentResource.exchangeRate = this.sliderInterval / 100;
    },
    toggleMode() {
      this.currentResource.toggleRateType();
      GameUI.update();
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
        <div>({{ format(totalLogicPoints, 2, 2) }} LP in total)</div>
        <br>
        <div class="c-lp-text-row--small">
          Total Logic Points and Exchange Levels provide a <span class="c-lp-amount--small">{{ formatX(multiplier, 2, 2) }}</span> multiplier to your Antimatter Dimensions.
        </div>
        <div
          v-if="currentResource.isUnlocked && rateUnlocked"
          class="c-exchange-rate-conatiner"
        >
          <div>
            <b>Exchange rate: {{ formatInt(sliderInterval) }}%</b>
            <SliderComponent
              lass="o-primary-btn--slider__slider"
              v-bind="sliderProps"
              :value="sliderInterval"
              @input="adjustSliderValue($event)"
            />
          </div>
          <div>
            <PrimaryButton
              class="c-exchange-mode-toggle-button"
              @click="toggleMode"
            >
              Mode: {{ rateTypeName }}
            </PrimaryButton>
          </div>
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