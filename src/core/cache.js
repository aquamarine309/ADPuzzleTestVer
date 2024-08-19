class Lazy {
  constructor(getValue) {
    this._getValue = getValue;
    Lazy.registerLazy(this);
  }

  static get registrar() {
    if (Lazy._registrar === undefined) {
      Lazy._registrar = [];
    }
    return Lazy._registrar;
  }

  static registerLazy(object) {
    Lazy.registrar.push(object);
  }

  static invalidateAll() {
    for (const obj of Lazy.registrar) {
      obj.invalidate();
    }
  }

  get value() {
    if (this._value === undefined) {
      this._value = this._getValue();
    }
    return this._value;
  }

  invalidate() {
    this._value = undefined;
  }

  /**
   * @return {Lazy}
   */
  invalidateOn(...events) {
    for (const event of events) {
      EventHub.logic.on(event, () => this.invalidate());
    }
    return this;
  }
}
window.Lazy = Lazy;

export const GameCache = {
  worstChallengeTime: new Lazy(() => player.challenge.normal.bestTimes.reduce(BE.maxReducer)),

  bestRunIPPM: new Lazy(() =>
    player.records.recentInfinities
      .map(run => ratePerMinute(run[2], run[0]))
      .reduce(BE.maxReducer)
  ),

  averageRealTimePerEternity: new Lazy(() => player.records.recentEternities
    .map(run => run[1])
    .reduce(BE.sumReducer).div(1000 * player.records.recentEternities.length)),

  tickSpeedMultDecrease: new Lazy(() => new BE(10).minusEffectsOf(
    BreakInfinityUpgrade.tickspeedCostMult,
    EternityChallenge(11).reward
  )),

  dimensionMultDecrease: new Lazy(() => new BE(10).minusEffectsOf(
    BreakInfinityUpgrade.dimCostMult,
    EternityChallenge(6).reward
  ).plusEffectOf(InfinityChallenge(10))),

  timeStudies: new Lazy(() => NormalTimeStudyState.studies
    .map(s => player.timestudy.studies.includes(s.id))),

  currentStudyTree: new Lazy(() => new TimeStudyTree(TimeStudyTree.currentStudies)),

  achievementPeriod: new Lazy(() => TimeSpan.fromMinutes(30 - Effects.sum(
    Perk.achievementGroup1,
    Perk.achievementGroup2,
    Perk.achievementGroup3,
    Perk.achievementGroup4
  ).toNumber()).totalMilliseconds.toNumber()),

  buyablePerks: new Lazy(() => Perks.all.filter(p => p.canBeBought)),

  // Cached because it needs to be checked upon any change to antimatter, but that's a hot path and we want to keep
  // unnecessary repetitive calculations and accessing to a minimum
  cheapestAntimatterAutobuyer: new Lazy(() => Autobuyer.antimatterDimension.zeroIndexed.concat(Autobuyer.tickspeed)
    .filter(ab => !(ab.isBought || ab.isUnlocked))
    .map(ab => ab.antimatterCost.toNumber())
    .min()
  ),

  // The effect is defined in antimatter_dimensions.js because that's where the non-cached
  // code originally lived.
  antimatterDimensionCommonMultiplier: new Lazy(() => antimatterDimensionCommonMultiplier()),

  // 0 will cause a crash if invoked; this way the tier can be used as an index
  antimatterDimensionFinalMultipliers: Array.range(0, 9)
    .map(tier => new Lazy(() => getDimensionFinalMultiplierUncached(tier))),

  infinityDimensionCommonMultiplier: new Lazy(() => infinityDimensionCommonMultiplier()),

  timeDimensionCommonMultiplier: new Lazy(() => timeDimensionCommonMultiplier()),

  glyphInventorySpace: new Lazy(() => Glyphs.freeInventorySpace),

  glyphEffects: new Lazy(() => orderedEffectList.mapToObject(k => k, k => getAdjustedGlyphEffectUncached(k))),

  staticGlyphWeights: new Lazy(() => staticGlyphWeights()),

  logTotalGlyphSacrifice: new Lazy(() => GlyphSacrificeHandler.logTotalSacrifice),

  totalIPMult: new Lazy(() => totalIPMult()),

  challengeTimeSum: new Lazy(() => player.challenge.normal.bestTimes.reduce(BE.sumReducer)),

  infinityChallengeTimeSum: new Lazy(() => player.challenge.infinity.bestTimes.reduce(BE.sumReducer)),

  logicChallengeTimeSum: new Lazy(() => player.challenge.logic.bestTimes.reduce(BE.sumReducer)),

  logicPoints: new Lazy(() => getLogicPoints()),

  maxTier: new Lazy(() => 1 + Effects.sum(...Array.range(1, 7).map(id => LogicUpgrade(id))).toNumber()),

  currentBonus: new Lazy(() => {
    for (let i = ExtraBonus.all.length - 1; i >= 0; i--) {
      if (ExtraBonus.all[i].isUnlocked) {
        return ExtraBonus.all[i];
      }
    }
  }),

  timeCoresFactor: new Lazy(() => timeCoresFactor()),

  gainedTimeCores: new Lazy(() => getGainedTimeCores())
};

EventHub.logic.on(GAME_EVENT.GLYPHS_CHANGED, () => {
  GameCache.glyphInventorySpace.invalidate();
  GameCache.glyphEffects.invalidate();
  GameCache.staticGlyphWeights.invalidate();
}, GameCache.glyphEffects);

GameCache.antimatterDimensionFinalMultipliers.invalidate = function() {
  for (const x of this) x.invalidate();
};
