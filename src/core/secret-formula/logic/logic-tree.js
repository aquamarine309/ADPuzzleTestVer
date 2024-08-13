const nodeColors = {
  normal: {
    baseColor: "var(--color-eternity)",
    bgColor: "#c896d9"
  },
  achievement: {
    baseColor: "var(--color-v--base)",
    bgColor: "#e9e0ac"
  },
  qol: {
    baseColor: "#ee0800",
    bgColor: "#ff9635"
  },
  continuum: {
    baseColor: "var(--color-laitela--accent)",
    bgColor: "var(--color-laitela--accent)"
  }
}

export const logicTree = {
  resetEternity: {
    id: 0,
    name: "Reset Eternity",
    desription: "You can restart the Eternity when gained Time Cores reach the requirement",
    requirement: "First is always free",
    symbol: "<i class='fas fa-star'></i>",
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    checkRequirement: () => true,
    position: [0, 0],
    color: nodeColors.normal
  },
  achievement1: {
    id: 1,
    reqNodes: [0],
    name: "Achievement Boost 1",
    description: "Achievements affect antimatter gain with a small power",
    requirement: () => `Complete ${formatInt(80)} Achievement`,
    symbol: "<i class='fas fa-trophy'></i> <i class='fas fa-atom'></i>",
    checkEvent: GAME_EVENT.ACHIEVEMENT_UNLOCKED,
    checkRequirement: () => Achievements.effectiveCount >= 80,
    position: [0, -1],
    color: nodeColors.achievement
  },
  achievement2: {
    id: 2,
    reqNodes: [1],
    name: "Achievement Boost 2",
    description: "Achievements affect Infinity gain with a small power",
    requirement: () => `Complete ${formatInt(90)} Achievement`,
    symbol: "<i class='fas fa-trophy'></i> <b>∞</b>",
    checkEvent: GAME_EVENT.ACHIEVEMENT_UNLOCKED,
    checkRequirement: () => Achievements.effectiveCount >= 90,
    position: [0, -2],
    color: nodeColors.achievement
  },
  qolExchange1: {
    id: 3,
    reqNodes: [0],
    name: "Free Exchange",
    description: "Exchanging resource no longer reset your resource",
    requirement: "Eternity withoit exchange matter",
    symbol: "<i class='fas fa-exchange'></i> <i class='fas fa-dollar'></i>",
    checkEvent: GAME_EVENT.ETERNITY_RESET_BRFORE,
    // eternity no matter exchanged
    checkRequirement: () => false,
    position: [1, 0],
    color: nodeColors.qol
  },
  qolExchange2: {
    id: 4,
    reqNodes: [3],
    name: "Free Exchange",
    description: "Exchanging resource no longer reset your resource",
    requirement: "Eternity withoit exchange matter",
    symbol: "<i class='fas fa-exchange'></i> <i class='fas fa-gears'></i>",
    checkEvent: GAME_EVENT.ETERNITY_RESET_BRFORE,
    // eternity no matter exchanged
    checkRequirement: () => false,
    position: [1, 1],
    color: nodeColors.qol
  },
  qolChallenge1: {
    id: 5,
    reqNodes: [3],
    name: "Free Exchange",
    description: "Exchanging resource no longer reset your resource",
    requirement: "Eternity withoit exchange matter",
    symbol: "<i class='fas fa-puzzle-piece'></i> <b>&times;</b>",
    checkEvent: GAME_EVENT.ETERNITY_RESET_BRFORE,
    // eternity no matter exchanged
    checkRequirement: () => false,
    position: [2, 0],
    color: nodeColors.qol
  },
  continuumIPmult: {
    id: 6,
    reqNodes: [0],
    name: "Continuum ID",
    description: "Convert Infinity Dimension purchases to Continuum",
    requirement: "TBD",
    symbol: "<b>ᛝ ∞</b> <i class='fas fa-arrow-up'></i>",
    checkEvent: GAME_EVENT.ACHIEVEMENT_UNLOCKED,
    checkRequirement: () => false,
    position: [-1, 0],
    color: nodeColors.continuum
  },
  continuumIPmult2: {
    id: 7,
    reqNodes: [6],
    name: "Continuum ID",
    description: "Convert Infinity Dimension purchases to Continuum",
    requirement: "TBD",
    symbol: "<b>∞</b> <i class='fas fa-arrow-up'></i> <b>2</b>",
    checkEvent: GAME_EVENT.ACHIEVEMENT_UNLOCKED,
    checkRequirement: () => false,
    position: [-1, -1],
    color: nodeColors.continuum
  },
  continuumEPmult: {
    id: 8,
    reqNodes: [6],
    name: "Continuum ID",
    description: "Convert Infinity Dimension purchases to Continuum",
    requirement: "TBD",
    symbol: "<b>ᛝ Δ</b> <i class='fas fa-arrow-up'></i>",
    checkEvent: GAME_EVENT.ACHIEVEMENT_UNLOCKED,
    checkRequirement: () => false,
    position: [-2, 0],
    color: nodeColors.continuum
  }
}