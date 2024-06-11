import ChallengeGrid from "../../ChallengeGrid.js";
import ChallengeTabHeader from "../../ChallengeTabHeader.js";
import LogicChallengeBox from "./LogicChallengeBox.js";

export default {
  name: "LogicChallengesTab",
  components: {
    ChallengeGrid,
    ChallengeTabHeader,
    LogicChallengeBox
  },
  data() {
    return {
      nextIC: 0,
      showAllChallenges: false
    };
  },
  computed: {
    challenges() {
      return LogicChallenges.all;
    }
  },
  methods: {
    isChallengeVisible(challenge) {
      return challenge.isUnlocked;
    }
  },
  template: `
  <div class="l-challenges-tab">
    <ChallengeTabHeader />
    <ChallengeGrid
      v-slot="{ challenge }"
      :challenges="challenges"
      :is-challenge-visible="isChallengeVisible"
    >
      <LogicChallengeBox :challenge="challenge" />
    </ChallengeGrid>
  </div>
  `
};