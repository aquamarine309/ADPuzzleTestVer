import { BEC } from "../constants.js";

import { DimensionState } from "./dimension.js";

export function buySingleTimeDimension(tier, auto = false) {
  const dim = TimeDimension(tier);
  if (tier > 4) {
    if (!TimeStudy.timeDimension(tier).isBought) return false;
    if (RealityUpgrade(13).isLockingMechanics && Currency.eternityPoints.gte(dim.cost)) {
      if (!auto) RealityUpgrade(13).tryShowWarningModal();
      return false;
    }
  }
  if (Currency.eternityPoints.lt(dim.cost)) return false;
  if (Enslaved.isRunning && dim.bought.gt(0)) return false;
  if (ImaginaryUpgrade(15).isLockingMechanics && EternityChallenge(7).completions > 0) {
    if (!auto) {
      ImaginaryUpgrade(15).tryShowWarningModal(`purchase a Time Dimension,
        which will produce Infinity Dimensions through EC7`);
    }
    return false;
  }

  Currency.eternityPoints.subtract(dim.cost);
  dim.amount = dim.amount.plus(1);
  dim.bought = dim.bought.plus(1);
  dim.cost = dim.nextCost(dim.bought);
  return true;
}

export function resetTimeDimensions() {
  for (const dim of TimeDimensions.all) dim.amount = new BE(dim.bought);
  updateTimeDimensionCosts();
}

export function fullResetTimeDimensions() {
  for (const dim of TimeDimensions.all) {
    dim.cost = new BE(dim.baseCost);
    dim.amount = BEC.D0;
    dim.bought = BEC.D0;
  }
}

export function toggleAllTimeDims() {
  const areEnabled = Autobuyer.timeDimension(1).isActive;
  for (let i = 1; i < 9; i++) {
    Autobuyer.timeDimension(i).isActive = !areEnabled;
  }
}

export function buyMaxTimeDimension(tier, portionToSpend = 1, isMaxAll = false) {
  const canSpend = Currency.eternityPoints.value.times(portionToSpend);
  const dim = TimeDimension(tier);
  if (canSpend.lt(dim.cost)) return false;
  if (tier > 4) {
    if (!TimeStudy.timeDimension(tier).isBought) return false;
    if (RealityUpgrade(13).isLockingMechanics) {
      if (!isMaxAll) RealityUpgrade(13).tryShowWarningModal();
      return false;
    }
  }
  if (ImaginaryUpgrade(15).isLockingMechanics && EternityChallenge(7).completions > 0) {
    if (!isMaxAll) {
      ImaginaryUpgrade(15).tryShowWarningModal(`purchase a Time Dimension,
        which will produce Infinity Dimensions through EC7`);
    }
    return false;
  }
  if (Enslaved.isRunning) return buySingleTimeDimension(tier);
  /* const bulk = bulkBuyBinarySearch(canSpend, {
    costFunction: bought => dim.nextCost(bought),
    cumulative: true,
    firstCost: dim.cost,
  }, dim.bought); */
  let moneyLeft = canSpend;
  let bulk = BEC.D0;
  if (PelleRifts.paradox.milestones[0].canBeApplied && tier > 4) {
    moneyLeft = canSpend.pow(2).times(BEC.E2250);
  }
  if (tier > 4 && moneyLeft.lt(BEC.E6000)) {
    const scaling = new LinearCostScaling(
      moneyLeft,
      dim.baseCost,
      dim.costMultiplier
    );
    
    if (scaling.purchases.lte(0) || moneyLeft.lt(scaling.totalCost)) return;
    moneyLeft = moneyLeft.sub(scaling.totalCost);
    bulk = scaling.purchases;
  } else {
      const costThresholds = dim._costIncreaseThresholds;
      // Calculate purchases of each part
      const costMultIncreases = [1, 1.5, 2.2];
      for (let i = 0; i < costThresholds.length; i++) {
        const threshold = costThresholds[i];
        const costMult = dim.costMultiplier.times(costMultIncreases[i]);
        // Check if this part has been purchased
        if (BE.pow(costMult, dim.bought).times(dim.baseCost).gt(threshold)) continue;
        const scaling = new LinearCostScaling(
          moneyLeft.clampMax(threshold),
          BE.pow(costMult, dim.bought.add(bulk)).times(dim.baseCost),
          costMult
        );
        if (scaling.purchases.lte(0) || moneyLeft.lt(scaling.totalCost)) break;
        moneyLeft = moneyLeft.sub(scaling.totalCost);
        bulk = bulk.add(scaling.purchases);
        if (moneyLeft.lt(threshold)) break;
      }
    }
  
    const totalAmount = dim.bought.add(bulk);
    if (totalAmount.add(1).gte(dim.e6000ScalingAmount)) {
    const scaling = TimeDimensions.scalingPast1e6000;
    const base = dim.costMultiplier.times(tier <= 4 ? 2.2 : 1);
    bulk = moneyLeft.log(base).add(scaling.minus(1).times(dim.e6000ScalingAmount)).div(scaling).minus(dim.bought).floor();
  }
  
  Currency.eternityPoints.value = moneyLeft;
  dim.amount = dim.amount.plus(bulk);
  dim.bought = dim.bought.plus(bulk);
  dim.cost = dim.nextCost(dim.bought);
  return true;
}

export function maxAllTimeDimensions() {
  // Try to buy single from the highest affordable new dimensions
  for (let i = 8; i > 0 && TimeDimension(i).bought.eq(0); i--) {
    buySingleTimeDimension(i, true);
  }

  // Buy everything costing less than 1% of initial EP
  for (let i = 8; i > 0; i--) {
    buyMaxTimeDimension(i, 0.01, true);
  }

  // Loop buying the cheapest dimension possible; explicit infinite loops make me nervous
  const tierCheck = tier => (RealityUpgrade(13).isLockingMechanics ? tier < 5 : true);
  const purchasableDimensions = TimeDimensions.all.filter(d => d.isUnlocked && tierCheck(d.tier));
  for (let stop = 0; stop < 1000; stop++) {
    const cheapestDim = purchasableDimensions.reduce((a, b) => (b.cost.gte(a.cost) ? a : b));
    if (!buySingleTimeDimension(cheapestDim.tier, true)) break;
  }
}

export function timeDimensionCommonMultiplier() {
  let mult = ChallengeFactors.tdMult
    .timesEffectsOf(
      Achievement(105),
      Achievement(128),
      TimeStudy(93),
      TimeStudy(103),
      TimeStudy(151),
      TimeStudy(221),
      TimeStudy(301),
      EternityChallenge(1).reward,
      EternityChallenge(10).reward,
      EternityUpgrade.tdMultAchs,
      EternityUpgrade.tdMultTheorems,
      EternityUpgrade.tdMultRealTime,
      Replicanti.areUnlocked && Replicanti.amount.gt(1) ? DilationUpgrade.tdMultReplicanti : null,
      Pelle.isDoomed ? null : RealityUpgrade(22),
      AlchemyResource.dimensionality,
      PelleRifts.chaos
    );

  if (EternityChallenge(9).isRunning) {
    mult = mult.times(
      BE.pow(
        BE.clampMin(Currency.infinityPower.value.pow(InfinityDimensions.powerConversionRate.div(7)).log2(), 1),
        4)
        .clampMin(1));
  }
  return mult;
}

export function updateTimeDimensionCosts() {
  for (let i = 1; i <= 8; i++) {
    const dim = TimeDimension(i);
    dim.cost = dim.nextCost(dim.bought);
  }
}

class TimeDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.dimensions.time, tier);
    const BASE_COSTS = [null, BEC.D1, BEC.D5, BEC.E2, BEC.E3, BEC.E2350, BEC.E2650, BEC.E3000, BEC.E3350];
    this._baseCost = BASE_COSTS[tier];
    const COST_MULTS = [null, 3, 9, 27, 81, 24300, 72900, 218700, 656100];
    this._costMultiplier = new BE(COST_MULTS[tier]);
    const E6000_SCALING_AMOUNTS = [null, 7322, 4627, 3382, 2665, 833, 689, 562, 456];
    this._e6000ScalingAmount = new BE(E6000_SCALING_AMOUNTS[tier]);
    const COST_THRESHOLDS = [BE.NUMBER_MAX_VALUE, BEC.E1300, BEC.E6000];
    this._costIncreaseThresholds = COST_THRESHOLDS;
  }

  /** @returns {BE} */
  get cost() {
    return this.data.cost;
  }

  /** @param {BE} value */
  set cost(value) { this.data.cost = value; }

  nextCost(bought) {
    if (this._tier > 4 && bought.lt(this.e6000ScalingAmount)) {
      const cost = BE.pow(this.costMultiplier, bought).times(this.baseCost);
      if (PelleRifts.paradox.milestones[0].canBeApplied) {
        return cost.div(BEC.E2250).pow(0.5);
      }
      return cost;
    }

    const costMultIncreases = [1, 1.5, 2.2];
    for (let i = 0; i < this._costIncreaseThresholds.length; i++) {
      const cost = BE.pow(this.costMultiplier.times(costMultIncreases[i]), bought).times(this.baseCost);
      if (cost.lt(this._costIncreaseThresholds[i])) return cost;
    }

    let base = this.costMultiplier;
    if (this._tier <= 4) base = base.times(2.2);
    const exponent = this.e6000ScalingAmount.plus(bought.minus(this.e6000ScalingAmount).times(TimeDimensions.scalingPast1e6000));
    const cost = BE.pow(base, exponent).times(this.baseCost);

    if (PelleRifts.paradox.milestones[0].canBeApplied && this._tier > 4) {
      return cost.div(BEC.E2250).pow(0.5);
    }
    return cost;
  }
  
  get continuumAmount() {
    if (!Continuum.isOn("TD")) return BEC.D0;
    return Continuum.timeDimContinuum(this);
  }
  
  get totalBought() {
    if (Continuum.isOn("TD")) return this.continuumAmount;
    return this.bought;
  }
  
  get totalAmount() {
    return this.amount.max(this.continuumAmount);
  }

  get isUnlocked() {
    return this._tier < 5 || TimeStudy.timeDimension(this._tier).isBought;
  }

  get isAvailableForPurchase() {
    return this.isAffordable;
  }

  get isAffordable() {
    return Currency.eternityPoints.gte(this.cost);
  }

  get multiplier() {
    const tier = this._tier;

    if (EternityChallenge(11).isRunning) return BEC.D1;
    let mult = GameCache.timeDimensionCommonMultiplier.value
      .timesEffectsOf(
        tier === 1 ? TimeStudy(11) : null,
        tier === 3 ? TimeStudy(73) : null,
        tier === 4 ? TimeStudy(227) : null
      );

    const dim = TimeDimension(tier);
    const bought = tier === 8 ? BE.clampMax(dim.totalBought, 1e8) : dim.totalBought;
    mult = mult.times(BE.pow(dim.powerMultiplier, bought));

    mult = mult.pow(getAdjustedGlyphEffect("timepow"));
    mult = mult.pow(getAdjustedGlyphEffect("effarigdimensions"));
    mult = mult.pow(getAdjustedGlyphEffect("curseddimensions"));
    mult = mult.powEffectOf(AlchemyResource.time);
    mult = mult.pow(Ra.momentumValue);
    mult = mult.pow(ImaginaryUpgrade(11).effectOrDefault(1));
    mult = mult.powEffectOf(PelleRifts.paradox);
    mult = mult.powEffectOf(LogicChallenge(7).effects.dimPow);

    if (player.dilation.active || PelleStrikes.dilation.hasStrike) {
      mult = dilatedValueOf(mult);
    }

    if (Effarig.isRunning) {
      mult = Effarig.multiplier(mult);
    } else if (V.isRunning) {
      mult = mult.pow(0.5);
    }

    return mult;
  }

  get productionPerSecond() {
    if (EternityChallenge(1).isRunning || EternityChallenge(10).isRunning ||
    (Laitela.isRunning && this.tier > Laitela.maxAllowedDimension)) {
      return BEC.D0;
    }
    if (EternityChallenge(11).isRunning) {
      return this.amount;
    }
    let production = this.amount.times(this.multiplier);
    if (EternityChallenge(7).isRunning) {
      production = production.times(Tickspeed.perSecond);
    }
    if (this._tier === 1 && !EternityChallenge(7).isRunning) {
      production = production.pow(getAdjustedGlyphEffect("timeshardpow"));
    }
    return production;
  }

  get rateOfChange() {
    const tier = this._tier;
    if (tier === 8) {
      return BEC.D0;
    }
    const toGain = TimeDimension(tier + 1).productionPerSecond;
    const current = BE.max(this.amount, 1);
    return toGain.times(10).dividedBy(current).times(getGameSpeedupForDisplay());
  }

  get isProducing() {
    const tier = this.tier;
    if (EternityChallenge(1).isRunning ||
      EternityChallenge(10).isRunning ||
      (Laitela.isRunning && tier > Laitela.maxAllowedDimension)) {
      return false;
    }
    return this.amount.gt(0);
  }

  get baseCost() {
    return this._baseCost;
  }

  get costMultiplier() {
    return this._costMultiplier;
  }

  get powerMultiplier() {
    return BEC.D4
      .timesEffectsOf(this._tier === 8 ? GlyphSacrifice.time : null)
      .pow(ImaginaryUpgrade(14).effectOrDefault(1));
  }

  get e6000ScalingAmount() {
    return this._e6000ScalingAmount;
  }

  get costIncreaseThresholds() {
    return this._costIncreaseThresholds;
  }

  get requirementReached() {
    return this._tier < 5 ||
      (TimeStudy.timeDimension(this._tier).isAffordable && TimeStudy.timeDimension(this._tier - 1).isBought);
  }

  tryUnlock() {
    if (this.isUnlocked) return;
    TimeStudy.timeDimension(this._tier).purchase();
  }
}

/**
 * @function
 * @param {number} tier
 * @return {TimeDimensionState}
 */
export const TimeDimension = TimeDimensionState.createAccessor();

export const TimeDimensions = {
  /**
   * @type {TimeDimensionState[]}
   */
  all: TimeDimension.index.compact(),

  get scalingPast1e6000() {
    return BEC.D4;
  },

  tick(diff) {
    for (let tier = 8; tier > 1; tier--) {
      TimeDimension(tier).produceDimensions(TimeDimension(tier - 1), diff.div(10));
    }

    if (EternityChallenge(7).isRunning) {
      TimeDimension(1).produceDimensions(InfinityDimension(8), diff);
    } else {
      TimeDimension(1).produceCurrency(Currency.timeShards, diff);
    }

    EternityChallenge(7).reward.applyEffect(production => {
      InfinityDimension(8).amount = InfinityDimension(8).amount.plus(production.times(diff.div(1000)));
    });
  }
};

export function tryUnlockTimeDimensions() {
  if (TimeDimension(8).isUnlocked) return;
  for (let tier = 5; tier <= 8; ++tier) {
    if (TimeDimension(tier).isUnlocked) continue;
    TimeDimension(tier).tryUnlock();
  }
}
