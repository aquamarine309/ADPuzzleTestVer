import { BEC } from "../../constants.js";

const nodeColors = {
  normal: {
    baseColor: "var(--color-logic)",
    bgColor: "#7ce4ab"
  },
  eternity: {
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
// 你还是去测试挑战因子(元素周期表)吧
// awa
// (Tester only)

export const logicTree = {
  start: {
    id: 0,
    name: "离开新手村",
    description: "增加难度",
    requirement: "达到永恒",
    symbol: "<i class='fas fa-graduation-cap'></i>",
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    checkRequirement: () => true,
    position: [0, 0],
    color: nodeColors.normal,
    effect: 0.5
  },
  timeStable: {
    id: 1,
    reqNodes: [0],
    name: "时间稳定器",
    description: "时间变得更加稳定并略微增强",
    requirement: () => `在 C3 外达到 ${format(BEC.E75)} 反物质`,
    symbol: "<i class='fas fa-clock'></i><i class='fas fa-wrench'></i>",
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    checkRequirement: () => Currency.antimatter.gte(BEC.E75) && !NormalChallenge(3).isRunning,
    position: [0, -1],
    color: nodeColors.eternity,
    formatEffect: value => formatX(value, 2, 2)
  },
  timePower: {
    id: 2,
    reqNodes: [1],
    name: "时间增幅器",
    description: () => `基础时间增幅 ${formatX(1.18, 0, 2)}`,
    requirement: () => `在不游玩小游戏的情况下通关LC3`,
    effect: 1.18,
    symbol: "<i class='fas fa-clock'></i><i class='fas fa-rocket'></i>",
    checkEvent: GAME_EVENT.LOGIC_CHALLENGE_COMPLETED,
    checkRequirement: ([id]) => id === 3 && !LC3.game.isCompleted,
    position: [0, -2],
    color: nodeColors.eternity
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
    name: "莱特拉失业第一天",
    description: "解锁IP倍增连续统",
    requirement: "没想好",
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
  },
  matterNoReset: {
    id: 11,
    reqNodes: [1],
    name: "无需贵物",
    description: "维度提升不重置物质 (反物质过少时不一定生效)",
    requirement: () => `达到 ${formatPostBreak(BEC.E5000)} 物质`,
    symbol: "<i class='fas fa-hourglass-half'></i> <i class='fas fa-ban'></i>",
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    checkRequirement: () => Currency.matter.gte(BEC.E5000),
    position: [1, -1],
    color: nodeColors.qol
  },
}