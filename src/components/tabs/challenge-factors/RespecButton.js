import PrimaryButton from "../../PrimaryButton.js";

export default {
  name: "RespecButton",
  components: {
    PrimaryButton
  },
  data() {
    return {
      time: 0,
      totalTime: 0,
      active: false
    }
  },
  computed: {
    canRespec() {
      return this.time >= this.totalTime;
    },
    timeString() {
      if (!this.canRespec) {
        return `${timeDisplayShort(this.time)}/${timeDisplayShort(this.totalTime)}`;
      } else {
        return "Available";
      }
    }
  },
  watch: {
    active(value) {
      player.refreshChallenge = value;
    }
  },
  methods: {
    update() {
      this.time = player.logic.refreshTimer;
      this.totalTime = ChallengeFactors.refreshPeriod;
      this.active = player.refreshChallenge;
    },
    handleClick() {
      if (!this.canRespec) return;
      this.active = !this.active;
    }
  },
  template: `
  <PrimaryButton
    :enabled="canRespec"
    class="c-restart-eternity-btn"
    @click="handleClick"
  >
    <span>Refresh Challenge Factor</span>
    <br>
    <span>{{ timeString }}</span>
    <br>
    <span v-if="canRespec">Active: {{ active ? "ON" : "OFF" }}</span>
  </PrimaryButton>
  `
}