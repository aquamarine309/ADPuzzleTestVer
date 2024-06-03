export const Puzzle = {
  get hasDLC() {
    return player.hasDLC;
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
          text: "Just an Ornament",
          clickFn: () => {}
        }
      }
    }
    return null;
  },
  tryBuyingFirstGalaxy() {
    if (Galaxy.canBeBought && Galaxy.requirement.isSatisfied && !PlayerProgress.infinityUnlocked() && player.galaxies === 0) {
      manualRequestGalaxyReset(1, false);
    }
  }
}