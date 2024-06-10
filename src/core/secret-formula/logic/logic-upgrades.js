export const logicUpgrades = [
  {
    name: "Acceleration Infinity",
    id: 0,
    description: "Unlock new Antimatter Dimension.",
    requirement: () => `Infinity in ${formatInt(1)} minute or less.`,
    checkRequirement: () => Time.thisInfinityRealTime.totalMinutes <= 1,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    hasFailed: () => Time.thisInfinityRealTime.totalMinutes > 1,
    cost: 3e17,
    effect: 1
  },
  {
    name: "Half life Three",
    id: 1,
    description: "Unlock new Antimatter Dimension.",
    requirement: () => `Buy ${formatInt(12)} Infinity Upgrades.`,
    checkRequirement: () => player.infinityUpgrades.size >= 12,
    checkEvent: [
      GAME_EVENT.INFINITY_UPGRADE_BOUGHT,
      GAME_EVENT.REALITY_RESET_AFTER,
      GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT
    ],
    cost: 1e27,
    effect: 1
  },
  {
    name: "Four a minute",
    id: 2,
    description: "Unlock new Antimatter Dimension.",
    requirement: () => `In 5 hours`,
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    hasFailed: () => true,
    effect: 1
  },
  {
    name: "Pentagonal Dimension",
    id: 3,
    description: "Unlock new Antimatter Dimension.",
    requirement: () => `In 5 hours`,
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    hasFailed: () => true,
    effect: 1
  },
  {
    name: "Could Afford Six",
    id: 4,
    description: "Unlock new Antimatter Dimension.",
    requirement: () => `In 5 hours`,
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    hasFailed: () => true,
    effect: 1
  },
  {
    name: "Lucky Upgrade",
    id: 5,
    description: "Unlock new Antimatter Dimension.",
    requirement: () => `In 5 hours`,
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    hasFailed: () => true,
    effect: 1
  },
  {
    name: "Not Over Yet",
    id: 6,
    description: "Unlock new Antimatter Dimension.",
    requirement: () => `In 5 hours`,
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    hasFailed: () => true,
    effect: 1
  },
  {
    name: "Bulk Boosts",
    id: 7,
    description: "You can buy five times as many Dimension Boosts at once.",
    requirement: () => `Infinity with less than ${formatInt(18)} Dimension Boosts.`,
    checkRequirement: () => DimBoost.purchasedBoosts < 18,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    hasFailed: () => DimBoost.purchasedBoosts >= 18,
    cost: 1e21,
    effect: 5
  },
  {
    name: "Equivalent Exchange",
    id: 8,
    description: "Infinity no longer reset Exchange Resource.",
    requirement: () => `Infinity in ${formatInt(18)} seconds or less.`,
    checkRequirement: () => Time.thisInfinityRealTime.totalSeconds <= 18,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    hasFailed: () => Time.thisInfinityRealTime.totalSeconds > 18,
    cost: 6e21
  },
  {
    name: "Puzze Challenges",
    id: 9,
    description: "Unlock Puzzle Challenges.",
    requirement: () => `In 5 hours`,
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    hasFailed: () => true
  }
]