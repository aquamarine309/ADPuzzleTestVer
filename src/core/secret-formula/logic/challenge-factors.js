export const challengeFactors = {
  elementImbalance: {
    id: 0,
    name: "Element Imbalance",
    description: x => `Get a random negative element when you reach ${formatPercents(0.5)} of the challenge goal. It lasts ${formatInt(x)}s.`,
    symbol: "<i class='fas fa-flask'></i>",
    color: "#a6c3e5",
    type: CHALLENGE_FACTOR_TYPE.NERF,
    difficulty: level => 10 + 5 * Math.sqrt(level),
    baseCost: 60,
    costMultiplier: 5,
    effect: level => 5 * Math.pow(2, level),
    levelCap: 5
  },
  dimensionOverflow: {
    id: 1,
    name: "Dimension Overflow",
    description: x => `You can only unlock ${quantifyInt("Antimatter Dimension", x)}.`,
    symbol: "<i class='fas fa-cubes'></i>",
    color: "#6e9e15",
    type: CHALLENGE_FACTOR_TYPE.DISABLED,
    difficulty: level => 20 * Math.pow(1.5, level),
    effect: level => 3 - level,
    baseCost: 3000,
    costMultiplier: 6000,
    levelCap: 2
  },
  logicalFallacy: {
    id: 2,
    name: "Logical Fallacy",
    description: x => `The multiplier from Logic Points ${formatPow(x, 0, 3)}.`,
    symbol: "<i class='fas fa-plus-circle'></i>",
    color: "#63e6c4",
    type: CHALLENGE_FACTOR_TYPE.NERF,
    difficulty: level => 10 + 5 * Math.pow(level, 0.2),
    baseCost: 1000,
    costMultiplier: 50,
    effect: level => 0.8 / Math.pow(level + 1, 0.2)
  },
  inexpensiveUpgrade: {
    id: 3,
    name: "Cheaper Upgrade",
    description: x => `Logic Upgrades are ${formatX(x.recip(), 2, 2)} cheaper.`,
    symbol: "<i class='fas fa-unlock'></i>",
    color: "#c48665",
    type: CHALLENGE_FACTOR_TYPE.IMPROVE,
    effect: level => BE.pow(0.8, Math.pow(level + 1, 2)),
    difficulty: level => -15 * Math.pow(1.5, Math.pow(level, 0.2)),
    baseCost: 60,
    costMultiplier: 1e3
  },
  luckyFactor: {
    id: 4,
    name: "Lucky Factor",
    description:  () => "Become luckier.",
    symbol: "<i class='fas fa-diamond'></i>",
    color: "#99ccff",
    type: CHALLENGE_FACTOR_TYPE.IMPROVE,
    difficulty: level => 20 + 5 * level,
    baseCost: 150,
    costMultiplier: 20,
    levelCap: 16
  },
  tabNerf: {
    id: 5,
    name: "Slow Down",
    description: x => `${formatPercents(x, 1)} chance of getting an element when you toggle Tab.`,
    symbol: "<i class='fas fa-tags'></i>",
    color: "#93e388",
    type: CHALLENGE_FACTOR_TYPE.NERF,
    effect: level => 1 - Math.pow(0.85, Math.pow(level + 1, 0.8)),
    difficulty: level => 15 + 5 * Math.pow(level, 0.3),
    baseCost: 600,
    costMultiplier: 30
  },
  timewall: {
    id: 6,
    name: "Great Timewall",
    description: x => `The threshold for Tickspeed Upgrades from Time Dimensions is increased by ${formatX(x, 3, 3)}.`,
    symbol: "Δ",
    color: "#c23df3",
    type: CHALLENGE_FACTOR_TYPE.NERF,
    effect: level => 1.2 + Math.pow(level, 0.4) / 20,
    difficulty: level => 20 + Math.pow(level, 0.25),
    baseCost: 100,
    costMultiplier: 40
  },
  noExtra: {
    id: 7,
    name: "AD space for rent",
    description: () => "Disable the extra bonus from Logic Challenge 5.",
    symbol: "<i class='fas fa-dollar'><i>",
    color: "#c3a964",
    type: CHALLENGE_FACTOR_TYPE.DISABLED,
    difficulty: 12,
    levelCap: 0
  }
};