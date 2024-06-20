import ResetModal from "./ResetModal.js";

export default {
  name: "EternityModal",
  components: {
    ResetModal
  },
  data() {
    return {
      exitingEC: false,
      startingIP: new BE(),
      gainedEternityPoints: new BE(),
      gainedEternities: new BE()
    };
  },
  computed: {
    message() {
      return PlayerProgress.eternityUnlocked()
        ? `Eternity will reset everything except Achievements, Challenge records, and anything under the General header
          on the Statistics tab.`
        : `Eternity will reset everything except Achievements, Challenge records, and anything under the General header
          on the Statistics tab. You will also gain an Eternity Point and unlock various upgrades.`;
    },
    gainedEPOnEternity() {
      return `You will gain ${quantify("Eternity", this.gainedEternities, 2)} 
      and ${quantify("Eternity Point", this.gainedEternityPoints, 2)} on Eternity.`;
    },
    startWithIP() {
      return this.startingIP.gt(0)
        ? `You will start your next Eternity with ${quantify("Infinity Point", this.startingIP, 2)}.`
        : ``;
    },
    eternityChallenge() {
      const ec = EternityChallenge.current;
      if (ec.isFullyCompleted) {
        return `Eternity Challenge ${ec.id} is already fully completed.`;
      }
      if (!Perk.studyECBulk.isBought) {
        return `You will gain one completion of Eternity Challenge ${ec.id}.`;
      }
      const gainedCompletions = ec.gainedCompletionStatus.gainedCompletions;
      return `You will gain ${quantifyInt("completion", gainedCompletions)} for Eternity Challenge ${ec.id}.`;
    }
  },
  methods: {
    update() {
      this.exitingEC = EternityChallenge.isRunning;
      this.startingIP = Currency.infinityPoints.startingValue;
      this.gainedEternityPoints = gainedEternityPoints();
      this.gainedEternities = gainedEternities();
    },
    handleYesClick() {
      animateAndEternity();
      EventHub.ui.offAll(this);
    }
  },
  template: `
  <ResetModal
    :header="exitingEC ? 'Complete Eternity Challenge' : 'You are about to Eternity'"
    :message="message"
    :gained-resources="gainedEPOnEternity"
    :starting-resources="startWithIP"
    :confirm-fn="handleYesClick"
    :alternate-condition="exitingEC"
    :alternate-text="exitingEC ? eternityChallenge : undefined"
    confirm-option="eternity"
  />
  `
};