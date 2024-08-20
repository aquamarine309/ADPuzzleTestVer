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
    name: "Hard Puzzle",
    description: () => `Antimatter Dimensions multiplier ${formatPow(0.5, 0, 1)}. But something becomes powerful`,
    requirement: "Complete your first Eternity",
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
    name: "Time Stabler",
    description: "Time become stable and a bit stronger",
    requirement: () => `Reach ${format(BEC.E75)} antimatter out of C3`,
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
    name: "Time Amplifier",
    description: () => `Basic stable time multiplier ${formatX(1.18, 0, 2)}`,
    requirement: () => `Complete LC3 without completing LC3 mini-game`,
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
    name: "Free Exchange",
    description: "Exchange no longer spends your resource",
    requirement: "Eternity without exchanging matter",
    symbol: "<i class='fas fa-exchange'></i> <i class='fas fa-dollar'></i>",
    checkEvent: GAME_EVENT.ETERNITY_RESET_BRFORE,
    checkRequirement: () => player.requirementChecks.eternity.noMatter,
    position: [1, 0],
    color: nodeColors.qol
  },
  qolExchange2: {
    id: 4,
    reqNodes: [3],
    name: "Auto-exchange",
    description: "Unlock Exchange Autobuyer",
    requirement: "TBD",
    symbol: "<i class='fas fa-exchange'></i> <i class='fas fa-gears'></i>",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    checkRequirement: () => false,
    position: [1, 1],
    color: nodeColors.qol
  },
  qolChallenge1: {
    id: 5,
    reqNodes: [3],
    name: "Boring Game",
    description: "The reward of LC3 mini-game is always effective",
    requirement: "TBD",
    symbol: "<i class='fas fa-puzzle-piece'></i> <b>&times;</b>",
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
    checkRequirement: () => false,
    position: [2, 0],
    color: nodeColors.qol
  },
  continuumIPmult: {
    id: 6,
    reqNodes: [0],
    name: "Lai'tela: ?",
    description: "Unlock IP multiplier upgrade continuum",
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
    position: [2, 1],
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
    name: "No Matter Required",
    description: "Dimboost no longer matter (doesn't work when antimatter is not enough)",
    requirement: () => `Reach ${formatPostBreak(BEC.E5000)} matter`,
    symbol: "<i class='fas fa-hourglass-half'></i> <i class='fas fa-ban'></i>",
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    checkRequirement: () => Currency.matter.gte(BEC.E5000),
    position: [1, -1],
    color: nodeColors.qol
  },
}