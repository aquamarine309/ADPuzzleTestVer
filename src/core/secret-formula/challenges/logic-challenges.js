import { BEC } from "../../constants.js";

export const logicChallenges = [
  {
    id: 1,
    description: () => `All Antimatter Dimensions produce less (${formatPow(0.4, 1, 1)}).
      Dimensions multiplier will multiply the amount instead of the production, except for the highest dimension.
      Buy ten multiplier is reduced to ${formatX(0.2, 0, 1)}.`,
    goal: BE.NUMBER_MAX_VALUE,
    el4Goal: BE.NUMBER_MAX_VALUE,
    effects: {
      dimensionPow: 0.4,
      buyTenMultiplier: BEC.D0_2
    },
    reward: {
      description: `Galaxies can automatically adjust the required dimensions`
    },
  },
  {
    id: 2,
    description: () => `Normal Challenges are broken. Dimension Boost multiplier is reduced to ${formatX(1)} and Galaxies are disabled.`,
    goal: BEC.E1650,
    el4Goal: BEC.E1500,
    reward: {
      description: "Decrease the requirement of Galaxies. Unlock exchange rate"
    },
  },
  {
    id: 3,
    description: () => `Antimatter Dimension multiplier is always ${formatX(1)}, but ...`,
    goal: BEC.E4000,
    el4Goal: BEC.E3000,
    reward: {
      description: "Unlock Replicanti"
    }
  },
  {
    id: 4,
    description: "Infinity Power provide a multiplier to game speed instead of Antimatter Dimensions.",
    goal: BEC.E10000,
    el4Goal: BEC.E8000,
    effect: () => Currency.infinityPower.value.plus(1).log10().pow(InfinityDimensions.powerConversionRate).clamp(1, 1e30),
    formatEffect: value => format(value, 3, 3),
    reward: {
      description: "Decrease the cost of Replicanti Upgrade based on current Infinity Points",
      effect: () => BE.pow10(Currency.infinityPoints.value.plus(1).log10().pow(0.5).times(6).times(GameElement(2).canBeApplied ? 2 : 1)),
      formatEffect: value => `/${format(value, 2, 3)}`
    }
  },
  {
    id: 5,
    description: `Infinity Dimensions multiplier based on Galaxies. Galaxies no longer affect Tickspeed.
      Tickspeed no longer affect Antimatter Dimensions production. Disable the multiplier from Logic Points and Exchange Level.
      Decrease conversion rate of Infinity Power.`,
    goal: BEC.E5000,
    el4Goal: BEC.E4000,
    effect: () => BEC.D2.pow(BE.pow(1.03, effectiveBaseGalaxies())),
    formatEffect: value => formatX(value, 3, 3),
    reward: {
      description: "Unlock extra bonus (In Shop Tab)"
    }
  },
  {
    id: 6,
    description: "Decrease cost and strength of Galaxies.",
    goal: BEC.E20000,
    el4Goal: BEC.E13200,
    effect: 0.3,
    reward: {
      description: "Galaxies are stronger based on highest Antimatter Dimension",
      effect: () => Math.pow(2 - Puzzle.maxTier / 8, 0.25),
      formatEffect: value => `+${formatPercents(value - 1, 3, 3)}`
    }
  },
  {
    id: 7,
    description: () => `
      There is only 1st Antimatter Dimension.
      Galaxies are ${formatPercents(0.5)} stronger.
      Achievement multiplier power +${format(1, 0, 1)}.
      Dimension boost multiplier ${formatPow(36)}.
      All dimension power +${format(0.028, 0, 3)}.
      Antimatter production: ${formatInt(10)}^x ➜ ${formatInt(10)}^(x^${format(1.026, 0, 4)}).
    `,
    goal: BEC.E10000,
    el4Goal: BEC.E4500,
    effects: {
      galMul: 1.5,
      achPow: 2,
      dimBoostPow: 36,
      dimPow: 1.028,
      amPow: 1.026
    },
    reward: {
      description: "Unlock auto-replicate. Logic Points also affect Infinity Points gained",
      effect: () => ResourceExchangeUpgrade.effectOrDefault(BEC.D1).pow(0.03),
      formatEffect: value => formatX(value, 2, 3)
    }
  },
  {
    id: 8,
    description: "When the number of Dimension Boosts is not a multiple of the number of Antimatter Galaxies, the production of antimatter dimensions will be reduced.",
    effect: 0.5,
    effectCondition: () => !Number.isInteger(
      DimBoost.totalBoosts.toNumberMax(Number.MAX_SAFE_INTEGER) /
      player.galaxies.clampMin(1).toNumberMax(Number.MAX_SAFE_INTEGER)
    ),
    goal: BEC.E32000,
    el4Goal: BEC.E18000,
    reward: {
      description: `Dimensional Sacrifice can automatically adjust the required dimensions`
    }
  }
]