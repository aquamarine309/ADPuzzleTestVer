import { AutobuyerState } from "./autobuyer.js";

export class SingularityAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.singularity;
  }

  get name() {
    return `Singularity`;
  }

  get isUnlocked() {
    return SingularityMilestone.autoCondense.canBeApplied;
  }

  get bulk() {
    return Singularity.singularitiesGained;
  }

  tick() {
    if (Currency.darkEnergy.value.gte(Singularity.cap * SingularityMilestone.autoCondense.effectValue)) {
      Singularity.perform();
    }
  }
}
