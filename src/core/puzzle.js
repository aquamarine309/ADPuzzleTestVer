export const Puzzle = {
  hasDLC(tier) {
    if (!PlayerProgress.infinityUnlocked()) return tier === 1 || player.hasDLC;
    return tier <= this.maxTier;
  },
  get maxTier() {
    if (!PlayerProgress.infinityUnlocked()) return 8;
    if (LogicChallenge(7).isRunning) return 1;
    let tier = GameCache.maxTier.value;
    ChallengeFactor.dimensionOverflow.applyEffect(v => tier = Math.min(tier, v));
    return tier;
  },
  get randomDimOrder() {
    return DimBoost.purchasedBoosts.eq(4) && player.galaxies.eq(0) && !PlayerProgress.infinityUnlocked();
  },
  tryBuyingFirstGalaxy() {
    if (Galaxy.canBeBought && Galaxy.requirement.isSatisfied && !PlayerProgress.infinityUnlocked()) {
      if (player.galaxies.eq(0)) {
        manualRequestGalaxyReset(1, false);
      } else {
        GameUI.notify.error(`Tips: Achievement.`);
      }
    }
  }
}