export const challengeFactors = {
  elementImbalance: {
    id: 0,
    name: "元素异常",
    description: "挑战中达到目标的50%时随机获得一个负面元素，持续5s",
    symbol: "<i class='fas fa-flask'></i>",
    color: "#a6c3e5",
    type: CHALLENGE_FACTOR_TYPE.NERF,
    difficulty: 10
  },
  dimensionOverflow: {
    id: 1,
    name: "维度溢出",
    description: "只能解锁前三个维度",
    symbol: "<i class='fas fa-cubes'></i>",
    color: "#6e9e15",
    type: CHALLENGE_FACTOR_TYPE.DISABLED,
    difficulty: 20,
    effect: 3
  },
  logicalFallacy: {
    id: 2,
    name: "逻辑谬误",
    description: "降低Logic Points提供的倍数",
    symbol: "<i class='fas fa-plus-circle'></i>",
    color: "#63e6c4",
    type: CHALLENGE_FACTOR_TYPE.NERF,
    effect: 0.8,
    difficulty: 10
  },
  inexpensiveUpgrade: {
    id: 3,
    name: "升级促销",
    description: "Logic Upgrade 20%更便宜",
    symbol: "<i class='fas fa-unlock'></i>",
    color: "#c48665",
    type: CHALLENGE_FACTOR_TYPE.IMPROVE,
    effect: 0.8,
    difficulty: -15
  },
  luckyFactor: {
    id: 4,
    name: "幸运因子",
    description: "变得更加幸运",
    symbol: "<i class='fas fa-diamond'></i>",
    color: "#99ccff",
    type: CHALLENGE_FACTOR_TYPE.IMPROVE,
    difficulty: 30
  },
  tabNerf: {
    id: 5,
    name: "减速慢行",
    description: "切换Tab时有概率获得随机负面元素",
    symbol: "<i class='fas fa-tags'></i>",
    color: "#93e388",
    type: CHALLENGE_FACTOR_TYPE.NERF,
    effect: 0.15,
    difficulty: 20
  },
  timewall: {
    id: 6,
    name: "大时间墙",
    description: "增加免费计数频率提升的价格增速",
    symbol: "Δ",
    color: "#c23df3",
    type: CHALLENGE_FACTOR_TYPE.NERF,
    effect: 1.2,
    difficulty: 20
  },
  replicanti: {
    id: 7,
    name: "复读机",
    description: "复制速度×11",
    symbol: "Ξ",
    color: "#03a9f4",
    type: CHALLENGE_FACTOR_TYPE.IMPROVE,
    difficulty: -20,
    effect: 11
  }
};