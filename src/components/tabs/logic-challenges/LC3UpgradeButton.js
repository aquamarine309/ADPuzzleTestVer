import CostDisplay from "../../CostDisplay.js";
import CustomizeableTooltip from "../../CustomizeableTooltip.js";
import DescriptionDisplay from "../../DescriptionDisplay.js";
import PrimaryButton from "../../PrimaryButton.js";

export default {
  name: "LC3UpgradeButton",
  components: {
    DescriptionDisplay,
    CostDisplay,
    CustomizeableTooltip,
    PrimaryButton
  },
  props: {
    upgrade: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      canBuy: false,
      purchases: new BE(0),
      timeEstimate: new BE(0),
      isCapped: false,
      hovering: false,
      notAffordable: false,
      hideEstimate: false
    };
  },
  computed: {
    config() {
      return this.upgrade.config;
    },
    effectText() {
      if (!this.config.formatEffect) return false;
      const prefix = this.isCapped ? "Capped:" : "Currently:";
      const formattedEffect = x => this.config.formatEffect(this.config.effect(x));
      const value = formattedEffect(this.purchases);
      const next = (!this.isCapped && this.hovering)
        ? formattedEffect(this.purchases.plus(1))
        : undefined;
      return { prefix, value, next };
    }
  },
  methods: {
    update() {
      this.canBuy = this.upgrade.canBeBought;
      this.isCapped = this.upgrade.isCapped;
      this.purchases = this.upgrade.effectiveAmount;
      this.hideEstimate = this.isAffordable || this.isCapped;
      this.timeEstimate = this.hideEstimate ? null : TimeSpan
        .fromSeconds(
          this.upgrade.cost.div(Currency.challengePower.value)
          .ln().div(LC3.cpPerSecond.ln())
        ).toTimeEstimate();
    }
  },
  template: `
  <div class="l-spoon-btn-group">
    <button
      class="c-lc3-upgrade"
      :class="{
        'c-lc3-upgrade--unavailable': !canBuy && !isCapped,
        'c-lc3-upgrade--bought': isCapped
      }"
      @click="upgrade.purchase()"
      @mouseover="hovering = true"
      @mouseleave="hovering = false"
    >
      <CustomizeableTooltip
        v-if="timeEstimate"
        :show="hovering && !hideEstimate"
        left="50%"
        top="0"
      >
        <template #tooltipContent>
          {{ timeEstimate }}
        </template>
      </CustomizeableTooltip>
      <DescriptionDisplay :config="config" />
      <div
        class="l-pelle-upgrade-gap"
        data-v-pelle-upgrade
      />
      <div v-if="effectText">
        {{ effectText.prefix }} {{ effectText.value }}
        <template v-if="effectText.next">
          ➜ <span
            :class="{
              'c-improved-effect': canBuy,
              'c-improved-effect--unavailable': !canBuy,
            }"
          >
            {{ effectText.next }}
          </span>
        </template>
        <div
          class="l-pelle-upgrade-gap"
          data-v-pelle-upgrade
        />
      </div>
      <CostDisplay
        v-if="!isCapped"
        :config="config"
        name="Challenge Power"
      />
    </button>
    <PrimaryButton
      class="l--spoon-btn-group__little-spoon-lc3-btn"
      @click="upgrade.buyMax()"
    >
      Buy Max
    </PrimaryButton>
  </div>
  `
};