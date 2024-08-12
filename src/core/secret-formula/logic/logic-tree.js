export const logicTree = {
  resetEternity: {
    desription: "You can restart the Eternity when gained Time Cores reach the requirement",
    requirement: "First is always free",
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    checkRequirement: () => true,
    position: [0, 0]
  },
  achievement1: {
    description: "Achievements affect logic point gain with a small power",
    requirement: `Complete ${formatInt(80)} Achievement`,
    checkEvent: GAME_EVENT.ACHIEVEMENT_UNLOCKED,
    checkRequirement: Achievements.effectiveCount >= 80,
    position: [-1, 0],
    
  }
}