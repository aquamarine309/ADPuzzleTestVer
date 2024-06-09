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
    return DimBoost.purchasedBoosts === 4 && player.galaxies === 0 && !PlayerProgress.infinityUnlocked();
  },
  get buttonAch() {
    if (Galaxy.canBeBought && Galaxy.requirement.isSatisfied && !PlayerProgress.infinityUnlocked()) {
      if (player.galaxies >= 1) {
        return {
          id: 27,
          text: "There is no galaxy",
          clickFn: () => manualRequestGalaxyReset(1, false)
        }
      } else {
        return {
          id: 26,
          text: "What is AG?",
          clickFn: () => GameUI.notify.info("Maybe you need some help.")
        }
      }
    }
    return null;
  },
  tryBuyingFirstGalaxy() {
    if (Galaxy.canBeBought && Galaxy.requirement.isSatisfied && !PlayerProgress.infinityUnlocked()) {
      if (player.galaxies === 0) {
        manualRequestGalaxyReset(1, false);
      } else {
        GameUI.notify.error(`"Buy ${formatInt(2)} galaxies" is not here.`);
      }
    }
  },
  get showCrunch() {
    return player.showCrunchFormat.this && Math.random() > 0.5;
  },
  get stableTime() {
    return false;
  }
}