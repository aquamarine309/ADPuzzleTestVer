export const elements = {
  freeze: {
    id: "freeze",
    name: "冻结",
    description: "游戏速度大幅下降",
    effect: 0.1
  },
  vertigo: {
    id: "vertigo",
    name: "维度锁",
    description: "禁止购买反物质维度",
  },
  tabLock: {
    id: "tabLock",
    name: "Tab锁",
    description: "禁止切换Tab"
  },
  noAchievement: {
    id: "noAchievement",
    name: "成就感消失",
    description: () => `成就的加成永远为${formatX(1)}`
  },
  reduceAntimatter: {
    id: "reduceAntimatter",
    name: "中毒",
    description: "每秒反物质数量减半",
    effect: 0.5
  }
}