export const logicUpgrades = [
  {
    name: "How Two Play",
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
    requirement: () => `In 5 hours`,
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    hasFailed: () => true,
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
  }
]