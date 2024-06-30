import { BEC } from "../constants.js";

import { DimensionState } from "./dimension.js";

// Multiplier applied to all Antimatter Dimensions, regardless of tier. This is cached using a Lazy
// and invalidated every update.
export function antimatterDimensionCommonMultiplier() {
  let multiplier = BEC.D1;

  multiplier = multiplier.times(Achievements.power);
  multiplier = multiplier.times(ShopPurchase.dimPurchases.currentMult);
  multiplier = multiplier.times(ShopPurchase.unlockDLC.currentMult);

  if (!EternityChallenge(9).isRunning && !LogicChallenge(4).isRunning) {
    multiplier = multiplier.times(Currency.infinityPower.value.pow(InfinityDimensions.powerConversionRate).max(1));
  }
  multiplier = multiplier.timesEffectsOf(
    BreakInfinityUpgrade.totalAMMult,
    BreakInfinityUpgrade.currentAMMult,
    BreakInfinityUpgrade.achievementMult,
    BreakInfinityUpgrade.slowestChallengeMult,
    InfinityUpgrade.totalTimeMult,
    InfinityUpgrade.thisInfinityTimeMult,
    Achievement(26),
    Achievement(48),
    Achievement(56),
    Achievement(65),
    Achievement(72),
    Achievement(73),
    Achievement(74),
    Achievement(76),
    Achievement(84),
    Achievement(91),
    Achievement(92),
    TimeStudy(91),
    TimeStudy(101),
    TimeStudy(161),
    TimeStudy(193),
    InfinityChallenge(3),
    InfinityChallenge(3).reward,
    InfinityChallenge(8),
    EternityChallenge(10),
    AlchemyResource.dimensionality,
    PelleUpgrade.antimatterDimensionMult,
    ResourceExchangeUpgrade,
    ExtraBonus.extraBonusToAD
  );

  multiplier = multiplier.dividedByEffectOf(InfinityChallenge(6));
  multiplier = multiplier.times(getAdjustedGlyphEffect("powermult"));
  multiplier = multiplier.times(Currency.realityMachines.value.powEffectOf(AlchemyResource.force));

  if (Pelle.isDoomed) multiplier = multiplier.dividedBy(10);

  return multiplier;
}

export function getDimensionFinalMultiplierUncached(tier) {
  if (tier < 1 || tier > 8) throw new Error(`Invalid Antimatter Dimension tier ${tier}`);
  if (LogicChallenge(3).isRunning) return BEC.D1;
  if (NormalChallenge(10).isRunning && tier > 6) return BEC.D1;
  if (EternityChallenge(11).isRunning) {
    return Currency.infinityPower.value.pow(
      InfinityDimensions.powerConversionRate
    ).max(1).times(DimBoost.multiplierToNDTier(tier));
  }

  let multiplier = BEC.D1;

  multiplier = applyNDMultipliers(multiplier, tier);
  multiplier = applyNDPowers(multiplier, tier);

  const glyphDilationPowMultiplier = getAdjustedGlyphEffect("dilationpow");
  if (player.dilation.active || PelleStrikes.dilation.hasStrike) {
    multiplier = dilatedValueOf(multiplier.pow(glyphDilationPowMultiplier));
  } else if (Enslaved.isRunning) {
    multiplier = dilatedValueOf(multiplier);
  }
  multiplier = multiplier.timesEffectOf(DilationUpgrade.ndMultDT);

  if (Effarig.isRunning) {
    multiplier = Effarig.multiplier(multiplier);
  } else if (V.isRunning) {
    multiplier = multiplier.pow(0.5);
  }

  // This power effect goes intentionally after all the nerf effects and shouldn't be moved before them
  if (AlchemyResource.inflation.isUnlocked && multiplier.gte(AlchemyResource.inflation.effectValue)) {
    multiplier = multiplier.pow(1.05);
  }

  return multiplier;
}

function applyNDMultipliers(mult, tier) {
  let multiplier = mult.times(GameCache.antimatterDimensionCommonMultiplier.value);

  let buy10Value;
  if (Laitela.continuumActive) {
    buy10Value = AntimatterDimension(tier).continuumValue;
  } else {
    buy10Value = AntimatterDimension(tier).bought.div(10).floor();
  }

  multiplier = multiplier.times(BE.pow(AntimatterDimensions.buyTenMultiplier, buy10Value));
  multiplier = multiplier.times(DimBoost.multiplierToNDTier(tier));

  let infinitiedMult = BEC.D1.timesEffectsOf(
    AntimatterDimension(tier).infinityUpgrade,
    BreakInfinityUpgrade.infinitiedMult
  );
  infinitiedMult = infinitiedMult.pow(TimeStudy(31).effectOrDefault(1));
  multiplier = multiplier.times(infinitiedMult);

  if (tier === 1) {
    multiplier = multiplier
      .timesEffectsOf(
        InfinityUpgrade.unspentIPMult,
        InfinityUpgrade.unspentIPMult.chargedEffect,
        Achievement(28),
        Achievement(31),
        Achievement(68),
        Achievement(71),
        TimeStudy(234)
      );
  }
  if (tier === 8) {
    multiplier = multiplier.times(Sacrifice.totalBoost);
  }

  multiplier = multiplier.timesEffectsOf(
    tier === 8 ? Achievement(23) : null,
    tier < 8 ? Achievement(34) : null,
    tier <= 4 ? Achievement(64) : null,
    tier < 8 ? TimeStudy(71) : null,
    tier === 8 ? TimeStudy(214) : null,
    tier > 1 && tier < 8 ? InfinityChallenge(8).reward : null
  );
  if (Achievement(43).isUnlocked) {
    multiplier = multiplier.times(1 + tier / 100);
  }

  multiplier = multiplier.clampMin(1);

  return multiplier;
}

function applyNDPowers(mult, tier) {
  let multiplier = mult;
  const glyphPowMultiplier = getAdjustedGlyphEffect("powerpow");
  const glyphEffarigPowMultiplier = getAdjustedGlyphEffect("effarigdimensions");

  if (InfinityChallenge(4).isRunning && player.postC4Tier !== tier) {
    multiplier = multiplier.pow(InfinityChallenge(4).effectValue);
  }
  if (InfinityChallenge(4).isCompleted) {
    multiplier = multiplier.pow(InfinityChallenge(4).reward.effectValue);
  }

  multiplier = multiplier.pow(glyphPowMultiplier * glyphEffarigPowMultiplier);

  multiplier = multiplier
    .powEffectsOf(
      AntimatterDimension(tier).infinityUpgrade.chargedEffect,
      InfinityUpgrade.totalTimeMult.chargedEffect,
      InfinityUpgrade.thisInfinityTimeMult.chargedEffect,
      AlchemyResource.power,
      Achievement(183),
      PelleRifts.paradox,
      LogicChallenge(1).effects.dimensionPow,
      LogicChallenge(7).effects.dimPow,
      LogicChallenge(8)
    );

  multiplier = multiplier.pow(getAdjustedGlyphEffect("curseddimensions"));

  multiplier = multiplier.pow(VUnlocks.adPow.effectOrDefault(1));
  
  multiplier = multiplier.pow(Ra.momentumValue);

  if (PelleStrikes.infinity.hasStrike) {
    multiplier = multiplier.pow(0.5);
  }


  return multiplier;
}

function onBuyDimension(tier) {
  if (tier === 1) Tutorial.turnOffEffect(TUTORIAL_STATE.DIM1);
  if (tier === 2) Tutorial.turnOffEffect(TUTORIAL_STATE.DIM2);
  Achievement(10 + tier).unlock();
  Achievement(23).tryUnlock();

  if (player.speedrun.isActive && !player.speedrun.hasStarted) Speedrun.startTimer();

  if (NormalChallenge(2).isRunning) player.chall2Pow = 0;
  if (NormalChallenge(4).isRunning || InfinityChallenge(1).isRunning) {
    AntimatterDimensions.resetAmountUpToTier(tier - 1);
  }

  player.postC4Tier = tier;
  player.records.thisInfinity.lastBuyTime = player.records.thisInfinity.time;
  if (tier !== 8) player.requirementChecks.eternity.onlyAD8 = false;
  if (tier !== 1) player.requirementChecks.eternity.onlyAD1 = false;
  if (tier === 8) player.requirementChecks.infinity.noAD8 = false;
  if (tier === 1) player.requirementChecks.eternity.noAD1 = false;
}

export function buyOneDimension(tier) {
  const dimension = AntimatterDimension(tier);
  if (Laitela.continuumActive || !dimension.isAvailableForPurchase || !dimension.isAffordable) return false;

  const cost = dimension.cost;
  
  if (!Puzzle.hasDLC(tier)) return false;
  if (tier === 8 && Enslaved.isRunning && AntimatterDimension(8).bought.gte(1)) return false;

  dimension.currencyAmount = dimension.currencyAmount.minus(cost);

  if (dimension.boughtBefore10.eq(9)) {
    dimension.challengeCostBump();
  }

  dimension.amount = dimension.amount.plus(1);
  dimension.bought = dimension.bought.plus(1);

  if (tier === 1) {
    Achievement(28).tryUnlock();
  }

  onBuyDimension(tier);

  return true;
}

export function buyManyDimension(tier) {
  const dimension = AntimatterDimension(tier);
  if (Laitela.continuumActive || !dimension.isAvailableForPurchase || !dimension.isAffordableUntil10) return false;
  const cost = dimension.costUntil10;
  if (!Puzzle.hasDLC(tier)) return false;
  if (tier === 8 && Enslaved.isRunning) return buyOneDimension(8);

  dimension.currencyAmount = dimension.currencyAmount.minus(cost);
  dimension.challengeCostBump();
  dimension.amount = dimension.amount.plus(dimension.remainingUntil10);
  dimension.bought = dimension.bought.plus(dimension.remainingUntil10);

  onBuyDimension(tier);

  return true;
}

export function buyAsManyAsYouCanBuy(tier) {
  const dimension = AntimatterDimension(tier);
  if (Laitela.continuumActive || !dimension.isAvailableForPurchase || !dimension.isAffordable) return false;
  const howMany = dimension.howManyCanBuy;
  const cost = dimension.cost.times(howMany);

  if (!Puzzle.hasDLC(tier)) return false;
  if (tier === 8 && Enslaved.isRunning) return buyOneDimension(8);

  dimension.currencyAmount = dimension.currencyAmount.minus(cost);
  dimension.challengeCostBump();
  dimension.amount = dimension.amount.plus(howMany);
  dimension.bought = dimension.bought.plus(howMany);

  onBuyDimension(tier);

  return true;
}

// This function doesn't do cost checking as challenges generally modify costs, it just buys and updates dimensions
function buyUntilTen(tier) {
  if (Laitela.continuumActive) return;
  const dimension = AntimatterDimension(tier);
  dimension.challengeCostBump();
  dimension.amount = dimension.amount.plus(dimension.remainingUntil10).round();
  dimension.bought = dimension.bought.add(dimension.remainingUntil10);
  onBuyDimension(tier);
}

export function maxAll() {
  if (Laitela.continuumActive) return;

  player.requirementChecks.infinity.maxAll = true;

  for (let tier = 1; tier < 9; tier++) {
    buyMaxDimension(tier);
  }

  // Do this here because tickspeed might not have been unlocked before
  // (and maxAll might have unlocked it by buying dimensions).
  buyMaxTickSpeed();
}

export function buyMaxDimension(tier, bulk = Infinity) {
  const dimension = AntimatterDimension(tier);
  if (Laitela.continuumActive || !dimension.isAvailableForPurchase || !dimension.isAffordableUntil10) return;
  const cost = dimension.costUntil10;
  let bulkLeft = new BE(bulk);
  const goal = Player.infinityGoal;
  if (dimension.cost.gt(goal) && Player.isInAntimatterChallenge) return;
  
  if (!Puzzle.hasDLC(tier)) return false;
  if (tier === 8 && Enslaved.isRunning) {
    buyOneDimension(8);
    return;
  }

  // Buy any remaining until 10 before attempting to bulk-buy
  if (dimension.currencyAmount.gte(cost)) {
    dimension.currencyAmount = dimension.currencyAmount.minus(cost);
    buyUntilTen(tier);
    bulkLeft = bulkLeft.minus(1);
  }

  if (bulkLeft.lte(0)) return;

  // Buy in a while loop in order to properly trigger abnormal price increases
  if (NormalChallenge(9).isRunning || InfinityChallenge(5).isRunning) {
    while (dimension.isAffordableUntil10 && dimension.cost.lt(goal) && bulkLeft.gt(0)) {
      // We can use dimension.currencyAmount or Currency.antimatter here, they're the same,
      // but it seems safest to use dimension.currencyAmount for consistency.
      dimension.currencyAmount = dimension.currencyAmount.minus(dimension.costUntil10);
      buyUntilTen(tier);
      bulkLeft = bulkLeft.minus(1);
    }
    return;
  }

  // This is the bulk-buy math, explicitly ignored if abnormal cost increases are active
  const maxBought = dimension.costScale.getMaxBought(
    dimension.bought.div(10).floor().add(dimension.costBumps), dimension.currencyAmount, BEC.E1
  );
  if (maxBought === null) {
    return;
  }
  let buying = maxBought.quantity;
  if (buying.gt(bulkLeft)) buying = bulkLeft.times(10);
  dimension.amount = dimension.amount.plus(buying).round();
  dimension.bought = dimension.bought.plus(buying);
  dimension.currencyAmount = dimension.currencyAmount.minus(BE.pow10(maxBought.logPrice));
}

class AntimatterDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.dimensions.antimatter, tier);
    const BASE_COSTS = [null, 10, 100, 1e4, 1e6, 1e9, 1e13, 1e18, 1e24];
    this._baseCost = new BE(BASE_COSTS[tier]);
    const BASE_COST_MULTIPLIERS = [null, 1e3, 1e4, 1e5, 1e6, 1e8, 1e10, 1e12, 1e15];
    this._baseCostMultiplier = new BE(BASE_COST_MULTIPLIERS[tier]);
    const C6_BASE_COSTS = [null, 10, 100, 100, 500, 2500, 2e4, 2e5, 4e6];
    this._c6BaseCost = new BE(C6_BASE_COSTS[tier]);
    const C6_BASE_COST_MULTIPLIERS = [null, 1e3, 5e3, 1e4, 1.2e4, 1.8e4, 2.6e4, 3.2e4, 4.2e4];
    this._c6BaseCostMultiplier = new BE(C6_BASE_COST_MULTIPLIERS[tier]);
  }

  /**
   * @returns {ExponentialCostScaling}
   */
  get costScale() {
    return new ExponentialCostScaling({
      baseCost: NormalChallenge(6).isRunning ? this._c6BaseCost : this._baseCost,
      baseIncrease: NormalChallenge(6).isRunning ? this._c6BaseCostMultiplier : this._baseCostMultiplier,
      costScale: Player.dimensionMultDecrease,
      scalingCostThreshold: BE.NUMBER_MAX_VALUE
    });
  }

  /**
   * @returns {BE}
   */
  get cost() {
    return this.costScale.calculateCost(this.bought.div(10).floor().add(this.costBumps));
  }

  /** @returns {number} */
  get costBumps() { return this.data.costBumps; }
  /** @param {number} value */
  set costBumps(value) { this.data.costBumps = value; }

  /**
   * @returns {number}
   */
  get boughtBefore10() {
    return this.bought.minus(this.bought.div(10).floor().times(10));
  }

  /**
   * @returns {number}
   */
  get remainingUntil10() {
    return BE.minus(10, this.boughtBefore10);
  }

  /**
   * @returns {BE}
   */
  get costUntil10() {
    return this.cost.times(this.remainingUntil10);
  }

  get howManyCanBuy() {
    const ratio = this.currencyAmount.dividedBy(this.cost);
    return BE.floor(BE.max(BE.min(ratio, this.remainingUntil10), 0));
  }

  /**
   * @returns {InfinityUpgrade}
   */
  get infinityUpgrade() {
    switch (this.tier) {
      case 1:
      case 8:
        return InfinityUpgrade.dim18mult;
      case 2:
      case 7:
        return InfinityUpgrade.dim27mult;
      case 3:
      case 6:
        return InfinityUpgrade.dim36mult;
      case 4:
      case 5:
        return InfinityUpgrade.dim45mult;
    }
    return false;
  }

  /**
   * @returns {BE}
   */
  get rateOfChange() {
    const tier = this.tier;
    if (tier === 8 ||
      (tier > 3 && EternityChallenge(3).isRunning) ||
      (tier > 6 && NormalChallenge(12).isRunning)) {
      return BEC.D0;
    }

    let toGain;
    if (tier === 7 && EternityChallenge(7).isRunning) {
      toGain = InfinityDimension(1).productionPerSecond.times(10);
    } else if (NormalChallenge(12).isRunning) {
      toGain = AntimatterDimension(tier + 2).productionPerSecond;
    } else {
      toGain = AntimatterDimension(tier + 1).productionPerSecond;
    }
    return toGain.times(10).dividedBy(this.amount.max(1)).times(getGameSpeedupForDisplay());
  }

  /**
   * @returns {boolean}
   */
  get isProducing() {
    const tier = this.tier;
    if ((EternityChallenge(3).isRunning && tier > 4) ||
      (NormalChallenge(10).isRunning && tier > 6) ||
      (Laitela.isRunning && tier > Laitela.maxAllowedDimension) ||
      Currency.antimatter.gt(Player.infinityLimit)) {
      return false;
    }
    return this.totalAmount.gt(0);
  }

  /**
   * @returns {BE}
   */
  get currencyAmount() {
    return this.tier >= 3 && NormalChallenge(6).isRunning
      ? AntimatterDimension(this.tier - 2).amount
      : Currency.antimatter.value;
  }

  /**
   * @param {BE} value
   */
  set currencyAmount(value) {
    if (this.tier >= 3 && NormalChallenge(6).isRunning) AntimatterDimension(this.tier - 2).amount = value;
    else Currency.antimatter.value = value;
  }

  /**
   * @returns {number}
   */
  get continuumValue() {
    if (!this.isAvailableForPurchase) return BEC.D0;
    // Nameless limits dim 8 purchases to 1 only
    // Continuum should be no different
    if (!this.hasDLC) return BEC.D0;
    if (this.tier === 8 && Enslaved.isRunning) return BEC.D1;
    // It's safe to use dimension.currencyAmount because this is
    // a dimension-only method (so don't just copy it over to tickspeed).
    // We need to use dimension.currencyAmount here because of different costs in NC6.
    const contVal = this.costScale.getContinuumValue(this.currencyAmount, BEC.E1);
    return contVal ? contVal.times(Laitela.matterExtraPurchaseFactor) : BEC.D0;
  }

  /**
   * @returns {number}
   */
  get continuumAmount() {
    if (!Laitela.continuumActive) return BEC.D0;
    return this.continuumValue.times(10).floor();
  }

  /**
   * Continuum doesn't continually update dimension amount because that would require making the code
   * significantly messier to handle it properly. Instead an effective amount is calculated here, which
   * is only used for production and checking for boost/galaxy. Doesn't affect achievements.
   * Taking the max is kind of a hack but it seems to work in all cases. Obviously it works if
   * continuum isn't unlocked. If the dimension is being produced and the continuum is unlocked,
   * the dimension will be being produced in large numbers (since the save is endgame), so the amount
   * will be larger than the continuum and so the continuum is insignificant, which is fine.
   * If the dimension isn't being produced, the continuum will be at least the amount, so
   * the continuum will be used and that's fine. Note that when continuum is first unlocked,
   * both 8d amount and 8d continuum will be nonzero until the next infinity, so taking the sum
   * doesn't work.
   * @param {BE} value
   */
  get totalAmount() {
    const amount = this.amount.max(this.continuumAmount);
    if (LogicChallenge(1).isRunning && !this.isHighest) return amount.times(this.multiplier);
    return amount;
  }

  /**
    * @returns {boolean}
    */
  get isAffordable() {
    if (Laitela.continuumActive) return false;
    if (!player.break && this.cost.gt(BE.NUMBER_MAX_VALUE)) return false;
    return this.cost.lte(this.currencyAmount);
  }
  
  get hasDLC() {
    return Puzzle.hasDLC(this.tier);
  }

  /**
   * @returns {boolean}
   */
  get isAffordableUntil10() {
    if (!player.break && this.cost.gt(BE.NUMBER_MAX_VALUE)) return false;
    return this.costUntil10.lte(this.currencyAmount);
  }

  get isAvailableForPurchase() {
    if (!EternityMilestone.unlockAllND.isReached && DimBoost.totalBoosts.plus(4).lt(this.tier)) return false;
    const hasPrevTier = this.tier === 1 || AntimatterDimension(this.tier - 1).totalAmount.gt(0);
    if (!EternityMilestone.unlockAllND.isReached && !hasPrevTier) return false;
    return this.tier < 7 || !NormalChallenge(10).isRunning;
  }

  reset() {
    this.amount = BEC.D0;
    this.bought = BEC.D0;
    this.costBumps = BEC.D0;
  }

  resetAmount() {
    this.amount = BEC.D0;
  }

  challengeCostBump() {
    if (InfinityChallenge(5).isRunning) this.multiplyIC5Costs();
    else if (NormalChallenge(9).isRunning) this.multiplySameCosts();
  }

  multiplySameCosts() {
    for (const dimension of AntimatterDimensions.all.filter(dim => dim.tier !== this.tier)) {
      if (dimension.cost.log10().floor().eq(this.cost.log10().floor())) {
        dimension.costBumps = dimension.costBumps.add(1);
      }
    }
    if (Tickspeed.cost.log10().floor().eq(this.cost)) player.chall9TickspeedCostBumps = player.chall9TickspeedCostBumps.plus(1);
  }

  multiplyIC5Costs() {
    for (const dimension of AntimatterDimensions.all.filter(dim => dim.tier !== this.tier)) {
      if (this.tier <= 4 && dimension.cost.lt(this.cost)) {
        dimension.costBumps = dimension.costBumps.plus(1);
      } else if (this.tier >= 5 && dimension.cost.gt(this.cost)) {
        dimension.costBumps = dimension.costBumps.plus(1);
      }
    }
  }

  get multiplier() {
    return GameCache.antimatterDimensionFinalMultipliers[this.tier].value;
  }

  get cappedProductionInNormalChallenges() {
    const postBreak = (player.break && !(NormalChallenge.isRunning && !NormalChallenge.current.isBroken)) ||
      InfinityChallenge.isRunning ||
      Enslaved.isRunning;
    return postBreak ? Player.infinityLimit : BEC.E315;
  }

  get productionPerSecond() {
    const tier = this.tier;
    if (Laitela.isRunning && tier > Laitela.maxAllowedDimension) return BEC.D0;
    let amount = this.totalAmount;
    if (NormalChallenge(12).isRunning) {
      if (tier === 2) amount = amount.pow(7.5);
      if (tier === 4) amount = amount.pow(5);
      if (tier === 6) amount = amount.pow(2.5);
    }
    let production = amount.times(Tickspeed.perSecond);
    if (!LogicChallenge(1).isRunning || this.isHighest) {
      production = production.times(this.multiplier);
    }
    if (NormalChallenge(2).isRunning) {
      production = production.times(player.chall2Pow);
    }
    if (LC3.isRunning) {
      production = production.times(LC3Upgrade.adMult.effectValue);
      production = production.pow(LC3Upgrade.adPow.effectValue);
    }
    if (tier === 1) {
      if (NormalChallenge(3).isRunning) {
        production = production.times(player.chall3Pow);
      }
      if (production.gt(10)) {
        const log10 = production.log10();
        production = BE.pow10(log10.pow(
          getAdjustedGlyphEffect("effarigantimatter") *
          LogicChallenge(7).effects.amPow.effectOrDefault(1)
        ));
      }
    }
    
    production = production.min(this.cappedProductionInNormalChallenges);
    return production;
  }
  
  get isHighest() {
    return DimBoost.maxDimensionsUnlockable === this.tier;
  }
}

/**
 * @function
 * @param {number} tier
 * @return {AntimatterDimensionState}
 */
export const AntimatterDimension = AntimatterDimensionState.createAccessor();

export const AntimatterDimensions = {
  /**
   * @type {AntimatterDimensionState[]}
   */
  all: AntimatterDimension.index.compact(),

  reset() {
    for (const dimension of AntimatterDimensions.all) {
      dimension.reset();
    }
    GameCache.dimensionMultDecrease.invalidate();
  },

  resetAmountUpToTier(maxTier) {
    for (const dimension of AntimatterDimensions.all.slice(0, maxTier)) {
      dimension.resetAmount();
    }
  },

  get buyTenMultiplier() {
    if (NormalChallenge(7).isRunning) return BEC.D7.min(DimBoost.totalBoosts.times(0.3).plus(1));
    
    if (LogicChallenge(1).isRunning) {
      return LogicChallenge(1).effects.
            buyTenMultiplier.effectValue;
    }

    let mult = BEC.D2.plusEffectsOf(
      Achievement(141).effects.buyTenMult,
      EternityChallenge(3).reward
    );

    mult = mult.timesEffectsOf(
      InfinityUpgrade.buy10Mult,
      Achievement(58)
    ).times(getAdjustedGlyphEffect("powerbuy10"));

    mult = mult.pow(
      getAdjustedGlyphEffect("effarigforgotten")
    ).powEffectOf(InfinityUpgrade.buy10Mult.chargedEffect);
    mult = mult.pow(ImaginaryUpgrade(14).effectOrDefault(1));

    return mult;
  },

  tick(diff) {
    // Stop producing antimatter at Big Crunch goal because all the game elements
    // are hidden when pre-break Big Crunch button is on screen.
    const hasBigCrunchGoal = !player.break || Player.isInAntimatterChallenge;
    if (Currency.antimatter.gt(Player.infinityLimit)) return;
    if (hasBigCrunchGoal && Currency.antimatter.gte(Player.infinityGoal)) return;

    let maxTierProduced = EternityChallenge(3).isRunning ? 3 : 7;
    let nextTierOffset = 1;
    if (NormalChallenge(12).isRunning) {
      maxTierProduced--;
      nextTierOffset++;
    }
    for (let tier = maxTierProduced; tier >= 1; --tier) {
      AntimatterDimension(tier + nextTierOffset).produceDimensions(AntimatterDimension(tier), diff.div(10));
    }
    if (AntimatterDimension(1).amount.gt(0)) {
      player.requirementChecks.eternity.noAD1 = false;
    }
    AntimatterDimension(1).produceCurrency(Currency.antimatter, diff);
    
    if (NormalChallenge(12).isRunning) {
      AntimatterDimension(2).produceCurrency(Currency.antimatter, diff);
    }
    // Production may overshoot the goal on the final tick of the challenge
    if (Currency.antimatter.gt(Player.infinityLimit)) Currency.antimatter.dropTo(Player.infinityLimit);
    if (hasBigCrunchGoal) Currency.antimatter.dropTo(Player.infinityGoal);
  }
};
