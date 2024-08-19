import Loading from "../../../../modules/vue-loading.js";

import Payments from "../../../core/payments.js";

import { STEAM } from "../../../env.js";
import { SteamRuntime } from "../../../steam/index.js";

import PrimaryButton from "../../PrimaryButton.js";
import ShopButton from "./ShopButton.js";

export default {
  name: "ShopTab",
  components: {
    ShopButton,
    Loading,
    PrimaryButton,
  },
  data() {
    return {
      availableSTD: 0,
      spentSTD: 0,
      isLoading: false,
      IAPsEnabled: false,
      creditsClosed: false,
      loggedIn: false,
      username: "",
      canRespec: false,
      respecTimeStr: "",
      desceiption: "",
      showBtn: false,
      extraBonusTimeLeft: new BE(0),
      factorDisabled: false
    };
  },
  computed: {
    STEAM() {
      return STEAM;
    },
    purchases() {
      return ShopPurchase.all;
    },
    enableText() {
      return `In-app Purchases: ${this.IAPsEnabled ? "Enabled" : "Disabled"}`;
    },
    respecText() {
      if (!this.loggedIn) return "Not logged in!";
      if (!this.canRespec) return "No respec available! (Purchase STDs or wait 3 days since your last one)";
      return null;
    },
    hiddenName() {
      return player.options.hideGoogleName;
    },
    leftTime() {
      return TimeSpan.fromMilliseconds(this.extraBonusTimeLeft).toStringShort();
    },
    hasBonus() {
      return this.extraBonusTimeLeft.gt(0);
    },
    isDoomed: () => Pelle.isDoomed
  },
  methods: {
    update() {
      this.availableSTD = ShopPurchaseData.availableSTD;
      this.spentSTD = ShopPurchaseData.spentSTD;
      this.isLoading = Boolean(player.IAP.checkoutSession.id);
      this.IAPsEnabled = player.IAP.enabled;
      this.creditsClosed = GameEnd.creditsEverClosed;
      this.loggedIn = Cloud.loggedIn;
      this.username = Cloud.user?.displayName;
      this.canRespec = ShopPurchaseData.canRespec;
      if (!ShopPurchaseData.respecAvailable && !this.canRespec) {
        this.respecTimeStr = ShopPurchaseData.timeUntilRespec.toStringShort();
      }
      this.showBtn = LogicChallenge(5).isCompleted;
      if (this.showBtn) {
        this.factorDisabled = ChallengeFactor.noExtra.canBeApplied;
        if (this.isDoomed || this.factorDisabled) {
          this.description = wordShift.wordCycle(["Destroyed", "Annihilated", "Nullified"]);
          return;
        }
        this.extraBonusTimeLeft.copyFrom(player.extraBonusTimeLeft);
        if (!this.hasBonus) {
          this.description = "Click here to receive free bonus!";
        } else {
          this.description = ExtraBonus.current.description;
        }
      }
    },
    showStore() {
      if (STEAM && !SteamRuntime.isActive) return;
      if (this.creditsClosed) return;
      SecretAchievement(33).unlock();
      if (this.loggedIn) Modal.shop.show();
      else Modal.message.show("You cannot purchase STD coins without logging in first.");
    },
    onCancel() {
      Payments.cancelPurchase(false);
    },
    respec() {
      if (this.creditsClosed || !this.loggedIn || !this.canRespec) return;
      ShopPurchaseData.respecRequest();
    },
    toggleEnable() {
      if (ShopPurchaseData.availableSTD < 0) return;
      player.IAP.enabled = !player.IAP.enabled;
      if (ShopPurchaseData.isIAPEnabled) Speedrun.setSTDUse(true);
    },
    respecClass() {
      return {
        "o-primary-btn--subtab-option": true,
        "o-pelle-disabled-pointer": this.creditsClosed,
        "o-primary-btn--disabled": !this.loggedIn || !this.canRespec
      };
    },
    getBonus() {
      if (this.hasBonus || this.isDoomed) return false;
      // 5 hours
      player.extraBonusTimeLeft = player.extraBonusTimeLeft.plus(1.8e7);
      GameUI.update();
    }
  },
  template: `
  <div
    class="tab shop"
    data-v-shop-tab
  >
    <div
      class="c-shop-disclaimer"
      data-v-shop-tab
    >
      Disclaimer: These are not required to progress in the game, they are just for supporting the developer.
      The game is balanced without the use of any microtransactions.
    </div>
    <div>
      Note: Shop purchases made on the Android, Steam, and Web versions are
      separate and non-transferable due to legal reasons.
    </div>
    <div
      class="c-subtab-option-container"
      data-v-shop-tab
    >
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
        label="Disable in-app-purchases:"
        @click="toggleEnable()"
        data-v-shop-tab
      >
        {{ enableText }}
      </PrimaryButton>
      <PrimaryButton
        v-if="!STEAM"
        v-tooltip="respecText"
        :class="respecClass()"
        @click="respec()"
        data-v-shop-tab
      >
        Respec Shop
      </PrimaryButton>
    </div>
    <button
      v-if="showBtn"
      class="extra-bonus-btn"
      @click="getBonus"
    >
      <div v-if="isDoomed || factorDisabled">
        Extra Bonus has been
        <b class="extra-bonus-destoryed">
          {{ description }}
        </b>
      </div>
      <div v-else>
        {{ description }}
      </div>
      <div v-if="hasBonus">{{ leftTime }} left</div>
    </button>
    <div
      class="c-shop-header"
      data-v-shop-tab
    >
      <span>You have {{ availableSTD }}</span>
      <img
        src="./public/images/std_coin.png"
        class="c-shop-header__img"
        data-v-shop-tab
      >
      <button
        class="o-shop-button-button"
        :class="{ 'o-shop-button-button--disabled': !loggedIn }"
        @click="showStore()"
        data-v-shop-tab
      >
        Buy More
      </button>
    </div>
    Note: All numbers on this page are intentionally unaffected by your notation settings
    <div
      class="l-shop-buttons-container"
      data-v-shop-tab
    >
      <ShopButton
        v-for="purchase in purchases"
        :key="purchase.key"
        :purchase="purchase"
        data-v-shop-tab
      />
    </div>
    <loading
      :active="isLoading"
      :can-cancel="true"
      :on-cancel="onCancel"
      :is-full-page="true"
      data-v-shop-tab
    />
  </div>
  `
};