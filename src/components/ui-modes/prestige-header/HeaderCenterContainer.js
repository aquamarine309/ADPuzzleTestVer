import ArmageddonButton from "../../tabs/celestial-pelle/ArmageddonButton.js";
import RealityCurrencyHeader from "../../RealityCurrencyHeader.js";

import HeaderTickspeedInfo from "../HeaderTickspeedInfo.js";

import RealityButton from "./RealityButton.js";

// This component contains antimatter and antimatter rate at the start of the game, as well as some additional
// information depending on the UI (tickspeed for Classic, game speed for Modern). Everything but antimatter is
// removed once Reality is unlocked, to make room for the reality button
export default {
  name: "HeaderCenterContainer",
  components: {
    HeaderTickspeedInfo,
    RealityCurrencyHeader,
    RealityButton,
    ArmageddonButton,
  },
  data() {
    return {
      shouldDisplay: true,
      isModern: false,
      hasRealityButton: false,
      isDoomed: false,
      antimatter: new BE(0),
      antimatterPerSec: new BE(0),
      reduceAntimatter: false
    };
  },
  methods: {
    update() {
      this.shouldDisplay = player.break || !Player.canCrunch;
      if (!this.shouldDisplay) return;

      this.isModern = player.options.newUI;
      this.isDoomed = Pelle.isDoomed;
      this.antimatter.copyFrom(Currency.antimatter.value);
      this.hasRealityButton = PlayerProgress.realityUnlocked() || TimeStudy.reality.isBought;
      this.reduceAntimatter = GameElements.isActive("reduceAntimatter");
      if (!this.hasRealityButton) this.antimatterPerSec.copyFrom(Currency.antimatter.productionPerSecond);
    },
  },
  template: `
  <div
    v-if="shouldDisplay"
    class="c-prestige-button-container"
  >
    <span>You have
      <i
        class="fas fa-arrow-down c-reduce-antimatter"
        v-if="reduceAntimatter"
      />
      <span class="c-game-header__antimatter">{{ format(antimatter, 2, 1) }}</span> antimatter.</span>
    <div
      v-if="hasRealityButton"
      class="c-reality-container"
      data-v-header-center-container
    >
      <RealityCurrencyHeader />
      <ArmageddonButton
        v-if="isDoomed"
        :is-header="true"
      />
      <RealityButton v-else />
    </div>
    <div v-else>
      You are getting {{ format(antimatterPerSec, 2) }} antimatter per second.
      <br>
      <HeaderTickspeedInfo />
    </div>
  </div>
  `
};