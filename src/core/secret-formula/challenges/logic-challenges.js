import { BEC } from "../../constants.js";

export const logicChallenges = [
  {
    id: 1,
    description: () => `All Antimatter Dimensions produce less (${formatPow(0.4, 1, 1)}).
    Dimensions multiplier will multiply the amount instead of the production, except for the highest dimension.
    Buy ten multiplier is reduced to ${formatX(0.2, 0, 1)}.`,
    goal: BE.NUMBER_MAX_VALUE,
    effects: {
      dimensionPow: 0.4,
      buyTenMultiplier: BEC.D0_2
    },
    reward: {
      description: `Galaxies can automatically adjust the required dimensions.`
    },
  },
  {
    id: 2,
    description: () => `Dimension Boost multipiler reduced to ${formatX(1)} and Galaxies are disabled`,
    goal: BEC.E1750,
    reward: {
      description: "Decrease the requirement of Galaxies. Unlock exchange rate."
    },
  },
  {
    id: 3,
    description: () => `Antimatter Dimension multiplier is always ${formatX(1)}, but ...`,
    goal: BEC.E4000,
    reward: {
      description: "Unlock Replicanti. (NYI)"
    }
  }
]