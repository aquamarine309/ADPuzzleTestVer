import { BEC } from "../../constants.js";

const nodeColors = {
  normal: {
    baseColor: "var(--color-eternity)",
    bgColor: "#c896d9"
  },
  achievement: {
    baseColor: "#c3b255",
    bgColor: "#e9e0ac"
  },
  qol: {
    baseColor: "#ee6810",
    bgColor: "#ff9635"
  },
  continuum: {
    baseColor: "var(--color-laitela--accent)",
    bgColor: "var(--color-laitela--accent)"
  }
}

// 没做完
// 目前仅测试版
// 如果你发现了这个
// 那也对你没有一点帮助
// 你还是去测试挑战因子吧
// awa
// (Tester only)

export const logicTree = {
  resetEternity: {
    id: 0,
    name: "时间回溯",
    description: "你可以在达到一定的TC时重置本次永恒",
    requirement: "达到永恒",
    symbol: "<i class='fas fa-star'></i>",
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    checkRequirement: () => true,
    position: [0, 0],
    color: nodeColors.normal
  },
  achievement1: {
    id: 1,
    reqNodes: [0],
    name: "成就之力 1",
    description: "成就增加IP的获取量",
    requirement: () => `完成 ${formatInt(80)} 个成就`,
    symbol: "<i class='fas fa-trophy'></i> <b>∞</b>",
    checkEvent: GAME_EVENT.ACHIEVEMENT_UNLOCKED,
    checkRequirement: () => Achievements.effectiveCount >= 80,
    position: [0, -1],
    color: nodeColors.achievement,
    effect: () => BEC.D2.pow(Achievements.power.sqrt().minus(1)).clampMax(BEC.E1E6).times(Achievements.power),
    formatEffect: value => formatX(value, 2, 2)
  },
  achievement2: {
    id: 2,
    reqNodes: [1],
    name: "成就之力 2",
    description: "成就增加EP的获取量",
    requirement: () => `完成 ${formatInt(90)} 个成就`,
    symbol: "<i class='fas fa-trophy'></i> <b>Δ</b>",
    checkEvent: GAME_EVENT.ACHIEVEMENT_UNLOCKED,
    checkRequirement: () => Achievements.effectiveCount >= 90,
    position: [0, -2],
    color: nodeColors.achievement
  },
  qolExchange1: {
    id: 3,
    reqNodes: [0],
    name: "无偿交换",
    description: "交换资源时不重置当前交换资源",
    requirement: "在不交换物质的前提下永恒一次",
    symbol: "<i class='fas fa-exchange'></i> <i class='fas fa-dollar'></i>",
    checkEvent: GAME_EVENT.ETERNITY_RESET_BRFORE,
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
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
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
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    checkRequirement: () => false,
    position: [2, 0],
    color: nodeColors.qol
  },
  continuumIPmult: {
    id: 6,
    reqNodes: [0],
    name: "Continuum IP Multiplier",
    description: "Convert Infinity Dimension purchases to Continuum",
    requirement: "TBD",
    symbol: "<b>ᛝ ∞</b> <i class='fas fa-arrow-up'></i>",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    checkRequirement: () => false,
    position: [-1, 0],
    color: nodeColors.continuum
  },
  continuumIPmult2: {
    id: 7,
    reqNodes: [6],
    name: "Increase IP Mult gain",
    description: "Convert Infinity Dimension purchases to Continuum",
    requirement: "TBD",
    symbol: "<b>∞</b> <i class='fas fa-arrow-up'></i> <b>2</b>",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    checkRequirement: () => false,
    position: [-1, -1],
    color: nodeColors.continuum
  },
  continuumEPmult: {
    id: 8,
    reqNodes: [6],
    name: "Continuum EP multiplier",
    description: "Convert Infinity Dimension purchases to Continuum",
    requirement: "TBD",
    symbol: "<b>ᛝ Δ</b> <i class='fas fa-arrow-up'></i>",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    checkRequirement: () => false,
    position: [-2, 0],
    color: nodeColors.continuum
  },
  autoMatter1: {
    id: 9,
    reqNodes: [4],
    name: "Matter",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    checkRequirement: () => false,
    position: [1, 2],
    color: nodeColors.qol
  },
  autoMatter2: {
    id: 10,
    reqNodes: [9],
    name: "Matter 2",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    checkRequirement: () => false,
    position: [1, 3],
    color: nodeColors.qol
  }
}