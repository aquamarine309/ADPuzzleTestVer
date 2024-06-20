import ChallengeRecordsList from "./ChallengeRecordsList.js";

export default {
  name: "ChallengeRecordsTab",
  components: {
    ChallengeRecordsList
  },
  data() {
    return {
      infinityChallengesUnlocked: false,
      normalChallenges: [],
      infinityChallenges: []
    };
  },
  methods: {
    update() {
      this.infinityChallengesUnlocked = PlayerProgress.infinityChallengeCompleted() ||
        PlayerProgress.eternityUnlocked();
      this.normalChallenges = player.challenge.normal.bestTimes.map(decimal => BE.fromBE(decimal));
      this.infinityChallenges = player.challenge.infinity.bestTimes.map(decimal => BE.fromBE(decimal));
    }
  },
  template: `
  <div class="l-challenge-records-tab c-stats-tab">
    <ChallengeRecordsList
      :start="2"
      :times="normalChallenges"
      name="Normal Challenge"
    />
    <ChallengeRecordsList
      v-if="infinityChallengesUnlocked"
      :start="1"
      :times="infinityChallenges"
      name="Infinity Challenge"
      class="l-challenge-records-tab__infinity_challenges"
    />
  </div>
  `
};