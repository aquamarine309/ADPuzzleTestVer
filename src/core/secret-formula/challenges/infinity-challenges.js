import { BEC } from "../../constants.js";

export const infinityChallenges = [
  {
    id: 1,
    description: `all Normal Challenge restrictions are active at once, with the exception of the
      Tickspeed (C9) and Big Crunch (C12) Challenges.`,
    goal: BEC.E1300,
    isQuickResettable: true,
    reward: {
      description: () => {
        const base = 1.3 + InfinityChallenge(9).reward.effectOrDefault(0);
        return `${formatX(base, 1, 1)} on all Infinity Dimensions for each Infinity Challenge completed`
      },
      effect: () => {
        const base = 1.3 + InfinityChallenge(9).reward.effectOrDefault(0);
        return Math.pow(base, InfinityChallenges.completed.length)
      },
      formatEffect: value => formatX(value, 1, 1)
    },
    unlockAM: BEC.E2000,
  },
  {
    id: 2,
    description: () => `Dimensional Sacrifice happens automatically every ${formatInt(400)} milliseconds once you have
      an 8th Antimatter Dimension.`,
    goal: BEC.E10500,
    isQuickResettable: false,
    reward: {
      description: () => `Dimensional Sacrifice autobuyer and stronger Dimensional Sacrifice
        ${Sacrifice.getSacrificeDescription({ "InfinityChallenge2isCompleted": false })} ➜
        ${Sacrifice.getSacrificeDescription({ "InfinityChallenge2isCompleted": true })}`,
    },
    unlockAM: BEC.E11000,
  },
  {
    id: 3,
    description: () =>
      `Tickspeed upgrades are always ${formatX(1)}. For every Tickspeed upgrade purchase, you instead get a static
      multiplier on all Antimatter Dimensions which increases based on Antimatter Galaxies.`,
    goal: BEC.E5000,
    isQuickResettable: false,
    effect: () => player.galaxies.times(0.1).add(1.05).pow(player.totalTickBought),
    formatEffect: value => formatX(value, 2, 2),
    reward: {
      description: `Antimatter Dimension multiplier based on Antimatter Galaxies and Tickspeed purchases`,
      effect: () => (Laitela.continuumActive
        ? BE.pow(player.galaxies.times(0.005).add(1.05), Tickspeed.continuumValue)
        : BE.pow(player.galaxies.times(0.005).add(1.05), player.totalTickBought)),
      formatEffect: value => formatX(value, 2, 2),
    },
    unlockAM: BEC.E12000,
  },
  {
    id: 4,
    description: () =>
      `only the latest bought Antimatter Dimension's production is normal. All other Antimatter Dimensions
      produce less (${formatPow(0.25, 2, 2)}).`,
    goal: BEC.E13000,
    isQuickResettable: true,
    effect: 0.25,
    reward: {
      description: () => `All Antimatter Dimension multipliers become multiplier${formatPow(1.05, 2, 2)}`,
      effect: 1.05
    },
    unlockAM: BEC.E14000,
  },
  {
    id: 5,
    description:
      `buying Antimatter Dimensions 1-4 causes all cheaper AD costs to increase.
      Buying Antimatter Dimensions 5-8 causes all more expensive AD costs to increase.`,
    goal: BEC.E16500,
    isQuickResettable: true,
    reward: {
      description: () =>
        `All Galaxies are ${formatPercents(0.1)} stronger and reduce the requirements for them
        and Dimension Boosts by ${formatInt(1)}`,
      effect: 1.1
    },
    unlockAM: BEC.E17500,
  },
  {
    id: 6,
    description: () =>
      `exponentially rising matter divides the multiplier on all of your Antimatter Dimensions
      once you have at least ${formatInt(1)} 2nd Antimatter Dimension.`,
    goal: BEC.D2E22222,
    isQuickResettable: true,
    effect: () => Currency.matter.value.clampMin(1),
    formatEffect: value => `/${format(value, 1, 2)}`,
    reward: {
      description: "Infinity Dimension multiplier based on tickspeed",
      effect: () => Tickspeed.perSecond.pow(0.0005),
      formatEffect: value => formatX(value, 2, 2)
    },
    unlockAM: BEC.E22500,
  },
  {
    id: 7,
    description: () => {
      // Copied from DimBoost.power; this is the base amount before any multipliers. Post-eternity this isn't
      // necessarily 2.5x by the time the player sees this challenge; it's probably most accurate to say what it
      // currently is, and this phrasing avoids 10x ➜ 10x with the old description.
      const mult = Effects.max(
        2,
        InfinityUpgrade.dimboostMult,
        InfinityChallenge(7).reward,
        TimeStudy(81)
      );
      return `you cannot buy Antimatter Galaxies. Base Dimension Boost multiplier is increased to a maximum
        of ${formatX(10)}. (Current base multiplier: ${formatX(mult, 2, 1)})`;
    },
    goal: BEC.E10000,
    isQuickResettable: false,
    effect: 10,
    reward: {
      description: () => `Dimension Boost multiplier is increased to a minimum of ${formatX(4)}`,
      effect: 4
    },
    unlockAM: BEC.E23000,
  },
  {
    id: 8,
    description: () =>
      `AD production rapidly and continually drops over time. Purchasing Antimatter Dimension or Tickspeed
        upgrades sets production back to ${formatPercents(1)} before it starts dropping again.`,
    goal: BEC.E27000,
    isQuickResettable: true,
    effect: () => BEC.D0_8446303389034288.pow(
      player.records.thisInfinity.time.minus(player.records.thisInfinity.lastBuyTime).clampMin(0)),
    reward: {
      description:
        "You get a multiplier to AD 2-7 based on 1st and 8th AD multipliers.",
      effect: () => AntimatterDimension(1).multiplier.times(AntimatterDimension(8).multiplier).pow(0.02),
      formatEffect: value => formatX(value, 2, 2)
    },
    unlockAM: BEC.E28000,
  },
  {
    id: 9,
    description: "When the number of galaxies increases, the effect of galaxies will decrease.",
    goal: BEC.E21000,
    effect: () => BEC.D1.minus(player.galaxies.add(1).ln().div(4)).clampMin(0),
    formatEffect: value => formatPercents(value, 3, 3),
    reward: {
      description: "Improve IC1 reward",
      effect: () => Math.pow(InfinityChallenges.completed.length, 2) / 12,
      formatEffect: value => `${format(1.3, 0, 1)}+${format(value, 0, 3)}=${format(value + 1.3, 0, 3)}`
    },
    unlockAM: BEC.E37500
  },
  {
    id: 10,
    description: () => `Increase Antimatter Dimension costs. Buy ten multiplier increases to ${formatX(4, 0, 1)}.`,
    goal: BEC.E35000,
    effect: 4,
    reward: {
      description: () => `Buy ten multiplier increases to ${formatX(4, 0, 1)}`,
      effect: 4
    },
    unlockAM: BEC.E40000
  },
  {
    id: 11,
    description: () => `Each consecutive Antimatter Dimension produces antimatter instead of the previous one. Galaxies are ${formatPercents(0.01)} stronger.`,
    goal: BEC.E10000,
    effect: 0.01,
    reward: {
      description: "Improve Infinity Power formula.",
      effect: 0.1
    },
    unlockAM: BEC.E50505
  }
];
