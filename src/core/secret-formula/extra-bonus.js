// Copy from Android version (AD bonus)

export const extraBonus = {
  extraBonusToAD: {
    id: "extraBonusToAD",
    // ×2 (Android) ➜ ×(AM^0.002)
    effect: () => Currency.antimatter.value.pow(0.002).clampMin(2),
    isUnlocked: () => true,
    description: value => `Antimatter Dimensions are multiplied by ${formatX(value, 2, 2)}`
  },
  extraBonusToIP: {
    id: "extraBonusToIP",
    // ^0.01 (Android) ➜ ^0.05
    effect: () => Currency.infinityPoints.value.pow(0.05).clampMin(2),
    // Actual Big Crunch count
    isUnlocked: () => player.bigCrunches >= 10,
    description: value => `IP gain is multiplied by ${formatX(value, 2, 2)}`
  },
  extraBonusToEP: {
    id: "extraBonusToEP",
    // ^0.01 (Android) ➜ ^0.05
    effect: () => Currency.eternityPoints.value.pow(0.05).clamp(1.5, 1e10),
    // Actual Eternity count
    isUnlocked: () => player.bigEternities >= 10,
    description: value => `EP gain is multiplied by ${formatX(value, 2, 2)}`
  },
  extraBonusToDT: {
    id: "extraBonusToDT",
    effect: 2,
    isUnlocked: () => TimeStudy.dilation.isBought,
    description: value => `Dilated Time gain is multiplied by ${formatX(value, 2, 2)}`
  },
  extraBonusToGamespeed: {
    id: "extraBonusToGamespeed",
    effect: 2,
    isUnlocked: () => TimeStudy.reality.isBought,
    description: value => `Game Speed is multiplied by ${formatX(value, 2, 2)}`
  },
  extraBonusToRM: {
    id: "extraBonusToRM",
    effect: 2,
    isUnlocked: () => Teresa.isUnlocked,
    description: value => `RM gain is multiplied by ${formatX(value, 2, 2)}`
  },
  extraBonusToRelicShards: {
    id: "extraBonusToRelicShards",
    effect: 2,
    isUnlocked: () => Effarig.isUnlocked,
    description: value => `Relic Shard gain is multiplied by ${formatX(value, 2, 2)}`
  },
  extraBonusToRarity: {
    id: "extraBonusToRarity",
    effect: 5,
    isUnlocked: () => Enslaved.isUnlocked,
    description: value => `Glyph rarity is increased by +${formatRarity(5)}`
  },
  extraBonusToMemories: {
    id: "extraBonusToMemories",
    effect: 2,
    isUnlocked: () => Ra.isUnlocked,
    description: value => `Memory gain is multiplied by ${formatX(value, 2, 2)}`
  },
  extraBonusToDE: {
    id: "extraBonusToDE",
    effect: 2,
    isUnlocked: () => Laitela.isUnlocked,
    description: value => `Dark Energy gain is multiplied by ${formatX(value, 2, 2)}`
  }
}