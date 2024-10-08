import GenericDimensionRowText from "../../GenericDimensionRowText.js";
import PrimaryButton from "../../PrimaryButton.js";
import PrimaryToggleButton from "../../PrimaryToggleButton.js";

export default {
  name: "ClassicTimeDimensionRow",
  components: {
    GenericDimensionRowText,
    PrimaryButton,
    PrimaryToggleButton
  },
  props: {
    tier: {
      type: Number,
      required: true
    },
    areAutobuyersUnlocked: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      isCapped: false,
      multiplier: new BE(0),
      amount: new BE(0),
      bought: new BE(0),
      rateOfChange: new BE(0),
      cost: new BE(0),
      isAvailableForPurchase: false,
      isAutobuyerOn: false,
      requirementReached: false,
      realityUnlocked: false,
      showTTCost: false,
      ttCost: 0,
      ttGen: new BE(),
      currTT: new BE(),
      continuum: false,
      continuumAmount: new BE()
    };
  },
  computed: {
    shiftDown() {
      return ui.view.shiftDown;
    },
    name() {
      return `${TimeDimension(this.tier).shortDisplayName} Time Dimension`;
    },
    buttonContents() {
      if (this.continuum) return `Continuum: ${formatFloat(this.continuumAmount, 2)}`;
      if (this.showTTCost) return this.formattedTTCost;
      return this.formattedEPCost;
    },
    tooltipContents() {
      if (this.showTTCost) return `${this.formattedEPCost}<br>${this.timeEstimate}`;
      if (this.isCapped) return `Nameless prevents the purchase of more than ${format(1)} Time Dimension`;
      return `Purchased ${quantifyInt("time", this.bought)}`;
    },
    showRow() {
      return this.realityUnlocked || this.isUnlocked || this.requirementReached;
    },
    formattedTTCost() {
      return `Unlock: ${format(this.ttCost)} TT`;
    },
    formattedEPCost() {
      return this.isCapped ? "Capped" : `${this.showCostTitle ? "Cost: " : ""}${format(this.cost, 2)} EP`;
    },
    hasLongText() {
      return this.buttonContents.length > 20;
    },
    showCostTitle() {
      return this.cost.pLog10().lt(1e6);
    },
    timeEstimate() {
      if (!this.showTTCost || this.ttGen.eq(0)) return "";
      const time = BE.sub(this.ttCost, this.currTT).dividedBy(this.ttGen);
      return time.gt(0) ? `Enough TT in ${TimeSpan.fromSeconds(time.toNumber()).toStringShort()}` : "";
    }
  },
  watch: {
    isAutobuyerOn(newValue) {
      Autobuyer.timeDimension(this.tier).isActive = newValue;
    }
  },
  methods: {
    update() {
      const tier = this.tier;
      const dimension = TimeDimension(tier);
      this.isCapped = Enslaved.isRunning && dimension.bought.gt(0);
      this.isUnlocked = dimension.isUnlocked;
      this.multiplier.copyFrom(dimension.multiplier);
      this.amount.copyFrom(dimension.totalAmount);
      this.bought.copyFrom(dimension.bought);
      this.continuum = Continuum.isOn("TD");
      if (this.continuum) {
        this.continuumAmount = dimension.continuumAmount;
      }
      if (tier < 8) {
        this.rateOfChange.copyFrom(dimension.rateOfChange);
      }
      this.cost.copyFrom(dimension.cost);
      this.isAvailableForPurchase = dimension.isAvailableForPurchase;
      if (!this.isUnlocked) {
        this.isAvailableForPurchase = dimension.requirementReached;
      }
      this.requirementReached = dimension.requirementReached;
      this.isAutobuyerOn = Autobuyer.timeDimension(this.tier).isActive;
      this.realityUnlocked = PlayerProgress.realityUnlocked();
      this.showTTCost = !this.isUnlocked && !this.shiftDown;
      if (this.tier > 4) this.ttCost = TimeStudy.timeDimension(this.tier).cost;
      this.currTT.copyFrom(Currency.timeTheorems.value);
      this.ttGen.copyFrom(getTTPerSecond().times(getGameSpeedupFactor()));
    },
    buyTimeDimension() {
      if (!this.isUnlocked) {
        TimeDimension(this.tier).tryUnlock();
        return;
      }
      buySingleTimeDimension(this.tier);
    },
    buyMaxTimeDimension() {
      buyMaxTimeDimension(this.tier);
    },
  },
  template: `
  <div
    v-show="showRow"
    class="c-dimension-row l-dimension-single-row"
    :class="{ 'c-dim-row--not-reached': !isUnlocked && !requirementReached }"
  >
    <GenericDimensionRowText
      :tier="tier"
      :name="name"
      :multiplier-text="formatX(multiplier, 2, 1)"
      :amount-text="format(amount, 2)"
      :rate="rateOfChange"
    />
    <div class="l-dim-row-multi-button-container">
      <PrimaryButton
        :enabled="isAvailableForPurchase && !isCapped"
        class="o-primary-btn--buy-td o-primary-btn--buy-dim c-dim-tooltip-container"
        :class="{ 'l-dim-row-small-text': hasLongText, 'o-continuum': continuum }"
        @click="buyTimeDimension"
        data-v-classic-time-dimension-row
      >
        {{ buttonContents }}
        <div class="c-dim-purchase-count-tooltip">
          <span v-html="tooltipContents" />
        </div>
      </PrimaryButton>
      <template v-if="!continuum">
        <PrimaryToggleButton
          v-if="areAutobuyersUnlocked"
          v-model="isAutobuyerOn"
          class="o-primary-btn--buy-td-auto"
          label="Auto:"
        />
        <PrimaryButton
          v-else
          :enabled="isAvailableForPurchase && !isCapped"
          class="o-primary-btn--buy-td-auto"
          @click="buyMaxTimeDimension"
        >
          Buy Max
        </PrimaryButton>
      </template>
    </div>
  </div>
  `
};