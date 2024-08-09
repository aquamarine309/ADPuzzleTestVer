import { BEC } from "../../constants.js";
import { MultiplierTabIcons } from "./icons.js";

export const TC = {
  total: {
    name: "Total TC Gained on Eternity",
    displayOverride: () => `${format(gainedTimeCores(), 2, 2)} (Divided by ${formatInt(1 / GameCache.timeCoresFactor.value.staticDivisor)})`,
    multValue: () => gainedTimeCores().div(GameCache.timeCoresFactor.value.staticDivisor),
    isActive: () => PlayerProgress.eternityUnlocked() || Player.canEternity,
    overlay: ["Δ", "<i class='fa-solid fa-layer-group' />"]
  },
  fromChallenge: {
    name: "Challenges",
    multValue: () => GameCache.timeCoresFactor.value.fromChallenge,
    isActive: true,
    icon: MultiplierTabIcons.CHALLENGE("infinity")
  },
  fromLP: {
    name: "Logic Points",
    multValue: () => GameCache.timeCoresFactor.value.fromLP,
    isActive: true,
    icon: MultiplierTabIcons.EXCHANGE
  },
  fromChallengeFactor: {
    name: "Challenge Factors",
    multValue: () => GameCache.timeCoresFactor.value.fromChallengeFactor,
    isActive: () => PlayerProgress.eternityUnlocked(),
    icon: MultiplierTabIcons.CHALLENGE_FACTOR
  },
}