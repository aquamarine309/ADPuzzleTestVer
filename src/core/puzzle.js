export const Puzzle = {
  hasDLC(tier) {
    if (!PlayerProgress.infinityUnlocked()) return tier === 1 || player.hasDLC;
    return tier <= this.maxTier;
  },
  get maxTier() {
    if (!PlayerProgress.infinityUnlocked()) return 8;
    return GameCache.maxTier.value;
  },
  get randomDimOrder() {
    return DimBoost.purchasedBoosts.eq(4) && player.galaxies.eq(0) && !PlayerProgress.infinityUnlocked();
  },
  get buttonAch() {
    if (Galaxy.canBeBought && Galaxy.requirement.isSatisfied && !PlayerProgress.infinityUnlocked()) {
      if (player.galaxies.gte(1)) {
        return {
          id: 27,
          text: "The literal meaning",
          clickFn: () => manualRequestGalaxyReset(1, false)
        }
      } else {
        return {
          id: 26,
          text: "What is AG?",
          clickFn: () => GameUI.notify.info("Maybe you need some HELP.")
        }
      }
    }
    return null;
  },
  tryBuyingFirstGalaxy() {
    if (Galaxy.canBeBought && Galaxy.requirement.isSatisfied && !PlayerProgress.infinityUnlocked()) {
      if (player.galaxies.eq(0)) {
        manualRequestGalaxyReset(1, false);
      } else {
        GameUI.notify.error(`Tips: Achievement.`);
      }
    }
  },
  get stableTime() {
    return false;
  }
}