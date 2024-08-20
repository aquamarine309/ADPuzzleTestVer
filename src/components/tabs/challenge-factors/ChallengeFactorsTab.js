import ChallengeFactorPreview from "../../ChallengeFactorPreview.js";
import RestartEternityButton from "./RestartEternityButton.js";
import ReduceRefreshTimeUpgradeButton from "./ReduceRefreshTimeUpgradeButton.js";
import RespecButton from "./RespecButton.js";
import ButtonCycle from "../../ButtonCycle.js";

export default {
  name: "ChallengeFactorsTab",
  components: {
    ChallengeFactorPreview,
    RestartEternityButton,
    ReduceRefreshTimeUpgradeButton,
    RespecButton,
    ButtonCycle
  },
  data() {
    return {
      timeCores: new BE(0),
      gainedTimeCores: new BE(0),
      tdMult: new BE(0),
      nextTDmult: new BE(0),
      type: 0,
      canRestart: false
    }
  },
  computed: {
    currentFactors() {
      return ChallengeFactors.current;
    },
    reduceUpg: () => ReduceRefreshTimeUpgrade,
    halfUpg: () => HalfRefreshTimeUpgrade,
    infoLabels: () => ["None", "Level", "Difficulty"],
    challengeFactorUnlocked() {
      return false;
    }
  },
  watch: {
    type(value) {
      player.options.challengeFactorType = value;
    }
  },
  methods: {
    update() {
      this.timeCores.copyFrom(Currency.timeCores);
      this.gainedTimeCores = gainedTimeCores();
      this.tdMult = ChallengeFactors.tdMult;
      this.nextTDmult = ChallengeFactors.tdMultAt(this.timeCores.add(this.gainedTimeCores));
      this.type = player.options.challengeFactorType;
      this.canRestart = ChallengeFactors.canRestart;
    },
  },
  created() {
    this.on$(GAME_EVENT.CHALLENGE_FACTOR_CHANGED, () => this.$recompute("currentFactors"));
  },
  template: `
  <div>
    <ButtonCycle
      v-if="challengeFactorUnlocked"
      class="o-primary-btn"
      text="Challenge Factor Info:"
      :labels="infoLabels"
      v-model="type"
    />
    <br>
    <div class="c-tc-info">
      <div>You have <span class="c-tc-amount">{{ format(timeCores, 2, 1) }}</span> {{ pluralize("Time Core", timeCores) }}.</div>
      <div>You will gain {{ quantify("Time Core", gainedTimeCores, 2, 1) }} after Eternity.</div>
      <div class="c-challenge-factor-tooltip--level-info">(See Multiplier Breakdown Tab)</div>
      <div>TD {{ formatX(tdMult, 2, 1) }}
      <span
        v-if="canRestart"
        class="c-more-td-mult"
      >➜ {{ formatX(nextTDmult, 2, 1) }}</span></div>
    </div>
    <template v-if="challengeFactorUnlocked">
      <ChallengeFactorPreview :factors="currentFactors" />
      <div class="c-factor-button-row">
        <RestartEternityButton />
        <RespecButton />
      </div>
      <div class="c-factor-button-row">
        <ReduceRefreshTimeUpgradeButton :upgrade="reduceUpg" />
        <ReduceRefreshTimeUpgradeButton :upgrade="halfUpg" />
      </div>
    </template>
    <template v-else>
      Challenge Factors are locked.
    </template>
  </div>
  `
}