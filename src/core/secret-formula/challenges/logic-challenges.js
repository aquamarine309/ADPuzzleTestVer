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
    description: () => `Normal Challenges are broken. Dimension Boost multiplier is reduced to ${formatX(1)} and Galaxies are disabled.`,
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
      description: "Unlock Replicanti. (Testing)"
    }
  },
  {
    id: 4,
    description: () => `Infinity Power boost game speed instead of antimatter dimensions.`,
    goal: BEC.E10000,
    effect: () => Currency.infinityPower.value.plus(1).log10().pow(InfinityDimensions.powerConversionRate).clamp(1, 1e30),
    formatEffect: value => format(value, 3, 3),
    reward: {
      description: "Decrease the cost of Replicanti Upgrade based on current Infinity Points.",
      effect: () => BE.pow10(Currency.infinityPoints.value.plus(1).log10().pow(0.5)).times(BEC.E10),
      formatEffect: value => `/${format(value, 2, 3)}`
    }
  }
]