import { DC } from "../../constants.js";

export const logicChallenges = [
  {
    id: 1,
    description: () => `All Antimatter Dimensions produce less (${formatPow(0.4, 1, 1)}).
    Dimensions multiplier will multiply the amount instead of the production, except for the highest dimension,
    Buy ten multiplier is reduced to ${formatX(0.2, 0, 1)}.`,
    effects: {
      dimensionPow: 0.4,
      buyingTenMultiplier: DC.D0_2
    },
    reward: {
      description: () => `Infinity Points`
    },
  }
]