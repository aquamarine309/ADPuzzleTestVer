export const elements = {
  freeze: {
    id: "freeze",
    name: "Freeze",
    description: "游戏速度大幅下降",
    effect: 0.1
  },
  vertigo: {
    id: "vertigo",
    name: "Dimension Lock",
    description: "禁止购买反物质维度",
  },
  tabLock: {
    id: "tabLock",
    name: "Tab Lock",
    description: "禁止切换Tab"
  },
  noAchievement: {
    id: "noAchievement",
    name: "Achievement Lock",
    description: () => `成就的加成永远为${formatX(1)}`
  },
  reduceAntimatter: {
    id: "reduceAntimatter",
    name: "Reduce Antimatter",
    description: "每秒反物质数量减半"
  }
}