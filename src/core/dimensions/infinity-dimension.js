import { BEC } from "../constants.js";

import { DimensionState } from "./dimension.js";

export function infinityDimensionCommonMultiplier() {
  let mult = new BE(1)
    .timesEffectsOf(
      Achievement(75),
      TimeStudy(82),
      TimeStudy(92),
      TimeStudy(162),
      InfinityChallenge(1).reward,
      InfinityChallenge(6).reward,
      EternityChallenge(4).reward,
      EternityChallenge(9).reward,
      EternityUpgrade.idMultEP,
      EternityUpgrade.idMultEternities,
      EternityUpgrade.idMultICRecords,
      AlchemyResource.dimensionality,
      ImaginaryUpgrade(8),
      PelleRifts.recursion.milestones[1]
    );

  if (Replicanti.areUnlocked && Replicanti.amount.gt(1)) {
    mult = mult.times(replicantiMult());
  }

  return mult;
}

export function toggleAllInfDims() {
  const areEnabled = Autobuyer.infinityDimension(1).isActive;
  for (let i = 1; i < 9; i++) {
    Autobuyer.infinityDimension(i).isActive = !areEnabled;
  }
}

class InfinityDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.dimensions.infinity, tier);
    const UNLOCK_REQUIREMENTS = [
      undefined,
      BEC.E1100,
      BEC.E1900,
      BEC.E2400,
      BEC.E10500,
      BEC.E30000,
      BEC.E45000,
      BEC.E54000,
      BEC.E60000,
    ];
    this._unlockRequirement = UNLOCK_REQUIREMENTS[tier];
    const COST_MULTS = [null, 1e3, 1e6, 1e8, 1e10, 1e15, 1e20, 1e25, 1e30];
    this._costMultiplier = new BE(COST_MULTS[tier]);
    const POWER_MULTS = [null, 50, 30, 10, 5, 5, 5, 5, 5];
    this._powerMultiplier = new BE(POWER_MULTS[tier]);
    const BASE_COSTS = [null, 1e8, 1e9, 1e10, 1e20, 1e140, 1e200, 1e250, 1e280];
    this._baseCost = new BE(BASE_COSTS[tier]);
    this.ipRequirement = BASE_COSTS[1];
  }

  /** @returns {BE} */
  get cost() { return this.data.cost; }
  /** @param {BE} value */
  set cost(value) { this.data.cost = value; }

  get baseAmount() {
    return this.data.baseAmount;
  }

  set baseAmount(value) {
    this.data.baseAmount = value;
  }
  
  get continuumAmount() {
    if (!Continuum.isOn("ID")) return BEC.D0;
    return Continuum.infinityDimContinuum(this);
  }
  
  get totalPurchases() {
    if (Continuum.isOn("ID")) return this.continuumAmount;
    return this.purchases;
  }
  
  get totalAmount() {
    return this.amount.max(this.continuumAmount);
  }

  get isUnlocked() {
    return this.data.isUnlocked;
  }

  set isUnlocked(value) {
    this.data.isUnlocked = value;
  }

  get amRequirement() {
    return this._unlockRequirement;
  }

  get antimatterRequirementReached() {
    return player.records.thisEternity.maxAM.gte(this.amRequirement);
  }

  get hasIPUnlock() {
    return this.tier === 1 && !PlayerProgress.eternityUnlocked();
  }

  get ipRequirementReached() {
    return !this.hasIPUnlock || Currency.infinityPoints.value.gte(this.ipRequirement);
  }

  get canUnlock() {
    return (Perk.bypassIDAntimatter.canBeApplied || this.antimatterRequirementReached) &&
      this.ipRequirementReached;
  }

  get isAvailableForPurchase() {
    return InfinityDimensions.canBuy() && this.isUnlocked && this.isAffordable && !this.isCapped;
  }

  get isAffordable() {
    return Currency.infinityPoints.gte(this.cost);
  }

  get rateOfChange() {
    const tier = this.tier;
    let toGain = BEC.D0;
    if (tier === 8) {
      // We need a extra 10x here (since ID8 production is per-second and
      // other ID production is per-10-seconds).
      EternityChallenge(7).reward.applyEffect(v => toGain = v.times(10));
      if (EternityChallenge(7).isRunning) EternityChallenge(7).applyEffect(v => toGain = v.times(10));
    } else {
      toGain = InfinityDimension(tier + 1).productionPerSecond;
    }
    const current = BE.max(this.amount, 1);
    return toGain.times(10).dividedBy(current).times(getGameSpeedupForDisplay());
  }

  get productionPerSecond() {
    if (EternityChallenge(2).isRunning || EternityChallenge(10).isRunning ||
      (Laitela.isRunning && this.tier > Laitela.maxAllowedDimension)) {
      return BEC.D0;
    }
    let production = this.totalAmount;
    if (EternityChallenge(11).isRunning) {
      return production;
    }
    if (EternityChallenge(7).isRunning) {
      production = production.times(Tickspeed.perSecond);
    }
    if (LogicChallenge(5).isRunning) {
      production = production.times(LogicChallenge(5).effectValue);
    }
    return production.times(this.multiplier);
  }

  get multiplier() {
    const tier = this.tier;
    if (EternityChallenge(11).isRunning) return BEC.D1;
    let mult = GameCache.infinityDimensionCommonMultiplier.value
      .timesEffectsOf(
        tier === 1 ? Achievement(94) : null,
        tier === 4 ? TimeStudy(72) : null,
        tier === 1 ? EternityChallenge(2).reward : null
      );
    mult = mult.times(BE.pow(this.powerMultiplier, this.totalPurchases));


    if (tier === 1) {
      mult = mult.times(PelleRifts.decay.milestones[0].effectOrDefault(1));
    }


    mult = mult.pow(getAdjustedGlyphEffect("infinitypow"));
    mult = mult.pow(getAdjustedGlyphEffect("effarigdimensions"));
    mult = mult.pow(getAdjustedGlyphEffect("curseddimensions"));
    mult = mult.powEffectOf(AlchemyResource.infinity);
    mult = mult.pow(Ra.momentumValue);
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

    if (PelleStrikes.powerGalaxies.hasStrike) {
      mult = mult.pow(0.5);
    }

    return mult;
  }

  get isProducing() {
    const tier = this.tier;
    if (EternityChallenge(2).isRunning ||
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
    let costMult = this._costMultiplier;
    EternityChallenge(12).reward.applyEffect(v => costMult = Math.pow(costMult, v));
    return costMult;
  }

  get powerMultiplier() {
    return new BE(this._powerMultiplier)
      .timesEffectsOf(this._tier === 8 ? GlyphSacrifice.infinity : null)
      .pow(ImaginaryUpgrade(14).effectOrDefault(1));
  }

  get purchases() {
    // Because each ID purchase gives 10 IDs
    return this.data.baseAmount.div(10);
  }

  get purchaseCap() {
    if (Enslaved.isRunning) {
      return BEC.D1;
    }
    return InfinityDimensions.capIncrease.plus(this.tier === 8
      ? Number.MAX_VALUE
      : InfinityDimensions.HARDCAP_PURCHASES);
  }

  get isCapped() {
    return this.totalPurchases.gte(this.purchaseCap);
  }

  get hardcapIPAmount() {
    return this._baseCost.times(BE.pow(this.costMultiplier, this.purchaseCap));
  }

  resetAmount() {
    this.amount = new BE(this.baseAmount);
  }

  fullReset() {
    this.cost = new BE(this.baseCost);
    this.amount = BEC.D0;
    this.bought = BEC.D0;
    this.baseAmount = BEC.D0;
    this.isUnlocked = false;
  }

  unlock() {
    if (this.isUnlocked) return true;
    if (!this.canUnlock) return false;
    this.isUnlocked = true;
    EventHub.dispatch(GAME_EVENT.INFINITY_DIMENSION_UNLOCKED, this.tier);
    if (this.tier === 1 && !PlayerProgress.eternityUnlocked()) {
      Tab.dimensions.infinity.show();
    }
    return true;
  }

  // Only ever called from manual actions
  buySingle() {
    if (!this.isUnlocked) return this.unlock();
    if (!this.isAvailableForPurchase) return false;
    if (ImaginaryUpgrade(15).isLockingMechanics) {
      const lockString = this.tier === 1
        ? "purchase a 1st Infinity Dimension"
        : "purchase a Dimension which will produce 1st IDs";
      ImaginaryUpgrade(15).tryShowWarningModal(lockString);
      return false;
    }

    Currency.infinityPoints.purchase(this.cost);
    this.cost = BE.round(this.cost.times(this.costMultiplier));
    // Because each ID purchase gives 10 IDs
    this.amount = this.amount.plus(10);
    this.baseAmount = this.baseAmount.plus(10);

    if (EternityChallenge(8).isRunning) {
      player.eterc8ids -= 1;
    }

    return true;
  }

  buyMax(auto) {
    if (!this.isAvailableForPurchase) return false;
    if (ImaginaryUpgrade(15).isLockingMechanics) {
      const lockString = this.tier === 1
        ? "purchase a 1st Infinity Dimension"
        : "purchase a Dimension which will produce 1st IDs";
      if (!auto) ImaginaryUpgrade(15).tryShowWarningModal(lockString);
      return false;
    }

    let purchasesUntilHardcap = this.purchaseCap.minus(this.totalPurchases);
    if (EternityChallenge(8).isRunning) {
      purchasesUntilHardcap = BE.clampMax(purchasesUntilHardcap, player.eterc8ids);
    }

    const costScaling = new LinearCostScaling(
      Currency.infinityPoints.value,
      this.cost,
      this.costMultiplier,
      purchasesUntilHardcap
    );

    if (costScaling.purchases.lte(0)) return false;

    Currency.infinityPoints.purchase(costScaling.totalCost);
    this.cost = this.cost.times(costScaling.totalCostMultiplier);
    // Because each ID purchase gives 10 IDs
    this.amount = this.amount.plus(costScaling.purchases.times(10));
    this.baseAmount = this.baseAmount.plus(costScaling.purchases.times(10));

    if (EternityChallenge(8).isRunning) {
      player.eterc8ids -= costScaling.purchases;
    }
    return true;
  }
}

/**
 * @function
 * @param {number} tier
 * @return {InfinityDimensionState}
 */
export const InfinityDimension = InfinityDimensionState.createAccessor();

export const InfinityDimensions = {
  /**
   * @type {InfinityDimensionState[]}
   */
  all: InfinityDimension.index.compact(),
  HARDCAP_PURCHASES: BEC.D2E6,

  unlockNext() {
    if (InfinityDimension(8).isUnlocked) return;
    this.next().unlock();
  },

  next() {
    if (InfinityDimension(8).isUnlocked)
      throw "All Infinity Dimensions are unlocked";
    return this.all.first(dim => !dim.isUnlocked);
  },

  resetAmount() {
    Currency.infinityPower.reset();
    for (const dimension of InfinityDimensions.all) {
      dimension.resetAmount();
    }
  },

  fullReset() {
    for (const dimension of InfinityDimensions.all) {
      dimension.fullReset();
    }
  },

  get capIncrease() {
    return BE.floor(Tesseracts.capIncrease());
  },

  get totalDimCap() {
    return this.HARDCAP_PURCHASES.plus(this.capIncrease);
  },

  canBuy() {
    return !EternityChallenge(2).isRunning &&
      !EternityChallenge(10).isRunning &&
      (!EternityChallenge(8).isRunning || player.eterc8ids > 0) && !Continuum.isOn("ID");
  },

  canAutobuy() {
    return this.canBuy() && !EternityChallenge(8).isRunning;
  },

  tick(diff) {
    for (let tier = 8; tier > 1; tier--) {
      InfinityDimension(tier).produceDimensions(InfinityDimension(tier - 1), diff.div(10));
    }

    if (EternityChallenge(7).isRunning) {
      if (!NormalChallenge(10).isRunning) {
        InfinityDimension(1).produceDimensions(AntimatterDimension(7), diff);
      }
    } else {
      InfinityDimension(1).produceCurrency(Currency.infinityPower, diff);
    }

    player.requirementChecks.reality.maxID1 = player.requirementChecks.reality.maxID1
      .clampMin(InfinityDimension(1).amount);
  },

  tryAutoUnlock() {
    if (!EternityMilestone.autoUnlockID.isReached || InfinityDimension(8).isUnlocked) return;
    for (const dimension of this.all) {
      // If we cannot unlock this one, we can't unlock the rest, either
      if (!dimension.unlock()) break;
    }
  },

  // Called from "Max All" UI buttons and nowhere else
  buyMax() {
    // Try to unlock dimensions
    const unlockedDimensions = this.all.filter(dimension => dimension.unlock());

    // Try to buy single from the highest affordable new dimensions
    unlockedDimensions.slice().reverse().forEach(dimension => {
      if (dimension.purchases.eq(0)) dimension.buySingle();
    });

    // Try to buy max from the lowest dimension (since lower dimensions have bigger multiplier per purchase)
    unlockedDimensions.forEach(dimension => dimension.buyMax(false));
  },

  get powerConversionRate() {
    let base = 7;
    const multiplier = PelleRifts.paradox.milestones[2].effectOrDefault(1);
    if (LogicChallenge(5).isRunning) {
      base = 4;
    } else if (LogicChallenge(4).isRunning) {
      base = 2;
    }
    return getAdjustedGlyphEffect("infinityrate").add(base).plusEffectsOf(PelleUpgrade.infConversion, InfinityChallenge(11).reward).times(multiplier);
  }
};
