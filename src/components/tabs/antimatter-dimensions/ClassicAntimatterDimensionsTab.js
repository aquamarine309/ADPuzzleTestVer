import AntimatterDimensionProgressBar from "./AntimatterDimensionProgressBar.js";
import AntimatterDimensionRow from "./ClassicAntimatterDimensionRow.js";
import AntimatterDimensionsTabHeader from "./ClassicAntimatterDimensionsTabHeader.js";
import AntimatterGalaxyRow from "./ClassicAntimatterGalaxyRow.js";
import DimensionBoostRow from "./ClassicDimensionBoostRow.js";
import PrimaryButton from "../../PrimaryButton.js";
import TickspeedRow from "./TickspeedRow.js";

export default {
  name: "ClassicAntimatterDimensionsTab",
  components: {
    PrimaryButton,
    AntimatterDimensionRow,
    AntimatterDimensionsTabHeader,
    AntimatterGalaxyRow,
    DimensionBoostRow,
    AntimatterDimensionProgressBar,
    TickspeedRow,
  },
  data() {
    return {
      hasDimensionBoosts: false,
      isQuickResetAvailable: false,
      isSacrificeUnlocked: false,
      buy10Mult: new BE(0),
      currentSacrifice: new BE(0),
      hasRealityButton: false,
      multiplierText: "",
      randomDimOrder: false
    };
  },
  computed: {
    range() {
      const base = Array.range(1, 8);
      if (this.randomDimOrder) return base.sort(() => Math.random() - 0.5);
      return base;
    }
  },
  methods: {
    update() {
      this.hasDimensionBoosts = player.dimensionBoosts.gt(0);
      this.isQuickResetAvailable = Player.isInAntimatterChallenge && Player.antimatterChallenge.isQuickResettable;
      this.isSacrificeUnlocked = Sacrifice.isVisible;
      this.buy10Mult.copyFrom(AntimatterDimensions.buyTenMultiplier);
      this.currentSacrifice.copyFrom(Sacrifice.totalBoost);
      this.hasRealityButton = PlayerProgress.realityUnlocked() || TimeStudy.reality.isBought;
      const sacText = this.isSacrificeUnlocked
        ? ` | Dimensional Sacrifice multiplier: ${formatX(this.currentSacrifice, 2, 2)}`
        : "";
      this.multiplierText = `Buy 10 Dimension purchase multiplier: ${formatX(this.buy10Mult, 2, 2)}${sacText}`;
      this.randomDimOrder = Puzzle.randomDimOrder;
    },
    quickReset() {
      softReset(-1, true, true);
    }
  },
  template: `
  <div class="l-old-ui-antimatter-dim-tab">
    <AntimatterDimensionsTabHeader />
    {{ multiplierText }}
    <TickspeedRow />
    <div class="l-dimensions-container">
      <AntimatterDimensionRow
        v-for="tier in range"
        :key="tier"
        :tier="tier"
      />
      <DimensionBoostRow />
      <AntimatterGalaxyRow />
    </div>
    <PrimaryButton
      v-if="isQuickResetAvailable"
      class="o-primary-btn--quick-reset"
      @click="quickReset"
    >
      Perform a Dimension Boost reset
      <span v-if="hasDimensionBoosts"> but lose a Dimension Boost</span>
      <span v-else> for no gain</span>
    </PrimaryButton>
    <div
      class="l-flex"
      data-v-classic-antimatter-dimensions-tab
    />
    <AntimatterDimensionProgressBar class="l-antimatter-dim-tab__progress_bar" />
  </div>
  `
};