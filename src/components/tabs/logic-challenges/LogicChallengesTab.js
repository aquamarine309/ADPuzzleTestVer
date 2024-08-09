import ChallengeGrid from "../../ChallengeGrid.js";
import ChallengeTabHeader from "../../ChallengeTabHeader.js";
import LC3Container from "./LC3Container.js";
import LogicChallengeBox from "./LogicChallengeBox.js";

export default {
  name: "LogicChallengesTab",
  components: {
    ChallengeGrid,
    ChallengeTabHeader,
    LC3Container,
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
    update() {
      this.showAllChallenges = player.options.showAllChallenges;
    },
    isChallengeVisible(challenge) {
      return challenge.isUnlocked || (this.showAllChallenges && PlayerProgress.eternityUnlocked());
    }
  },
  template: `
  <div class="l-challenges-tab">
    <ChallengeTabHeader />
    <LC3Container />
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