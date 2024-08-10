export default {
  name: "GameSpeedDisplay",
  props: {
  },
  data() {
    return {
      baseSpeed: new BE(0),
      pulsedSpeed: new BE(0),
      hasSeenAlteredSpeed: false,
      isStopped: false,
      isEC12: false,
      isPulsing: false,
      isFreezeActive: false,
      freezeTime: 0
    };
  },
  computed: {
    baseSpeedText() {
      if (this.isStopped) {
        return "Stopped (storing real time)";
      }
      const speed = this.formatNumber(this.baseSpeed);
      if (this.isEC12) {
        return `${speed} (fixed)`;
      }
      return `${speed}`;
    },
    pulseSpeedText() {
      return `${this.formatNumber(this.pulsedSpeed)}`;
    },
    baseText() {
      if (!this.hasSeenAlteredSpeed) return null;
      return this.baseSpeed.eq(1)
        ? "The game is running at normal speed."
        : `Game speed is altered: ${this.baseSpeedText}`;
    },
    freezeClass() {
      return {
        "c-frozen": this.isFreezeActive
      }
    },
    iconClass() {
      if (this.isFreezeActive) return "fa-snowflake";
      return null;
    },
    frozenTimeLeft() {
      return timeDisplayShort(this.freezeTime);
    }
  },
  methods: {
    update() {
      this.baseSpeed = getGameSpeedupFactor();
      this.pulsedSpeed = getGameSpeedupForDisplay();
      this.hasSeenAlteredSpeed = PlayerProgress.seenAlteredSpeed();
      this.isStopped = Enslaved.isStoringRealTime;
      this.isEC12 = EternityChallenge(12).isRunning;
      this.isPulsing = this.baseSpeed.neq(this.pulsedSpeed) && Enslaved.canRelease(true);
      this.isFreezeActive = GameElements.isActive("freeze");
      if (!this.isFreezeActive) return;
      this.freezeTime = GameElements.getTime("freeze");
    },
    formatNumber(num) {
      if (num.gte(0.001) && num.lt(1e4) && num.neq(1)) {
        return format(num, 3, 3);
      }
      if (num.lt(0.001)) {
        return `${formatInt(1)} / ${format(num.recip(), 2)}`;
      }
      return `${format(num, 2)}`;
    }
  },
  template: `
  <span
    class="c-gamespeed"
    :class="freezeClass"
    data-v-game-speed-display
  >
    <span v-if="iconClass !== null">
      <i
        class="fas"
        :class="iconClass"
      />
    </span>
    <span>
      {{ baseText }}
    </span>
    <span v-if="isFreezeActive">(<i class="fas fa-clock u-fa-padding" /> {{ frozenTimeLeft }})</span>
    <span v-if="isPulsing">(<i class="fas fa-expand-arrows-alt u-fa-padding" /> {{ pulseSpeedText }})</span>
  </span>
  `
};