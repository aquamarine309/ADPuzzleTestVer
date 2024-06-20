import HeaderBlackHoleStatusText from "./HeaderBlackHoleStatusText.js";
import PrimaryButton from "../PrimaryButton.js";
import PrimaryToggleButton from "../PrimaryToggleButton.js";

export default {
  name: "HeaderBlackHole",
  components: {
    PrimaryButton,
    PrimaryToggleButton,
    HeaderBlackHoleStatusText
  },
  data() {
    return {
      canModifyBlackHoles: false,
      displaySingle: false,
      singleState: "",
      pauseText: "",
      canCharge: false,
      isCharging: false,
      storedTime: new BE(0),
      canAutoRelease: false,
      isAutoReleasing: false,
    };
  },
  computed: {
    blackHoles: () => BlackHoles.list,
    id() {
      return this.blackHole.id;
    },
    dischargeText() {
      return `Discharge: ${timeDisplayShort(this.storedTime)}`;
    },
    hasLongText() {
      return this.dischargeText.length > 15;
    },
  },
  watch: {
    isAutoReleasing(newValue) {
      player.celestials.enslaved.isAutoReleasing = newValue;
    }
  },
  methods: {
    update() {
      // Technically not entirely accurate (you can still invert within Laitela), but it's cleaner to just hide it all
      // because Laitela disables everything else and it technically still displays as pulsing even if it isn't
      this.canModifyBlackHoles = BlackHoles.areUnlocked && !Laitela.isRunning;
      this.displaySingle = BlackHoles.arePermanent;
      if (this.displaySingle) this.singleState = BlackHole(1).displayState;
      this.pauseText = this.pauseButtonText();
      this.canCharge = Enslaved.isUnlocked;
      this.isCharging = Enslaved.isStoringGameTime;
      this.storedTime.copyFrom(player.celestials.enslaved.stored);
      this.canAutoRelease = Ra.unlocks.autoPulseTime.canBeApplied;
      this.isAutoReleasing = player.celestials.enslaved.isAutoReleasing;
    },
    pauseButtonText() {
      if (BlackHoles.arePaused && player.blackHoleNegative < 1) return "Uninvert BH";
      if (BlackHoles.arePaused) return "Unpause BH";
      const accel = BlackHoles.unpauseAccelerationFactor;
      if (accel !== 1) return `${formatPercents(accel, 1)} speed`;
      if (player.blackHoleNegative < 1) return "Invert BH";
      return "Pause BH";
    },
    timeDisplayShort(ms) {
      return timeDisplayShort(ms);
    },
    chargingClassObject() {
      return {
        "o-primary-btn--buy-max c-primary-btn--black-hole-header": true,
        "o-bh-charge-disabled": this.isAutoReleasing
      };
    }
  },
  template: `
  <span
    v-if="canModifyBlackHoles"
    class="c-black-hole-header"
    data-v-header-black-hole
  >
    <PrimaryButton
      class="o-primary-btn--buy-max c-primary-btn--black-hole-header"
      onclick="BlackHoles.togglePause()"
      data-v-header-black-hole
    >
      {{ pauseText }}
    </PrimaryButton>
    <span v-if="canCharge">
      <PrimaryButton
        :class="chargingClassObject()"
        onclick="Enslaved.toggleStoreBlackHole()"
        data-v-header-black-hole
      >
        <span v-if="isCharging">
          Stop Charging
        </span>
        <span v-else>
          Charge
        </span>
      </PrimaryButton>
    </span>
    <span
      v-if="displaySingle"
      class="c-black-hole-status-text"
      v-html="'🌀:' + singleState"
      data-v-header-black-hole
    />
    <span v-else>
      <HeaderBlackHoleStatusText
        v-for="(blackHole, i) in blackHoles"
        :key="'state' + i"
        :black-hole="blackHole"
      />
    </span>
    <span v-if="canCharge">
      <PrimaryButton
        class="o-discharge-btn c-primary-btn--black-hole-header"
        :class="{ 'o-small-discharge-text': hasLongText }"
        onclick="Enslaved.useStoredTime(false)"
        data-v-header-black-hole
      >
        {{ dischargeText }}
      </PrimaryButton>
    </span>
    <span v-if="canAutoRelease">
      <PrimaryToggleButton
        v-model="isAutoReleasing"
        class="o-primary-btn--buy-max c-primary-btn--black-hole-header"
        label="Pulse:"
        data-v-header-black-hole
      />
    </span>
  </span>
  `
};