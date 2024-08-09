import PrimaryButton from "../../PrimaryButton.js";

export default {
  name: "RestartEternityButton",
  components: {
    PrimaryButton
  },
  data() {
    return {
      gainedTC: new BE(0),
      respec: false,
      canEternity: false
    }
  },
  computed: {
    canRestart() {
      return this.gainedTC.gte(1);
    },
    title() {
      return this.canEternity ? "Eternity" : `Restart the Eternity`;
    },
  },
  methods: {
    update() {
      this.gainedTC = gainedTimeCores();
      this.respec = player.refreshChallenge;
      this.canEternity = Player.canEternity;
    },
    restart() {
      if (!this.canRestart) return;

      // force: true
      // auto: this.canEternity
      eternity(true, this.canEternity);
    }
  },
  template: `
  <PrimaryButton
    :enabled="canRestart"
    class="c-restart-eternity-btn"
    @click="restart"
  >
    <span class="c-restart-eternity-btn__title">{{ title }}</span>
    <br>
    <br>
    <template v-if="canRestart">
      <span v-if="respec">Refresh Challenge Factors</span>
      <br>
      <span>Gain {{ quantify("Time Core", gainedTC, 2, 1) }}</span>
    </template>
    <span v-else>Need to earn at least {{ formatInt(1) }} Time Core</span>
  </PrimaryButton>
  `
}