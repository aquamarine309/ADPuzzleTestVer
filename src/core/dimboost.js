import { BEC } from "./constants.js";

class DimBoostRequirement {
  constructor(tier, amount) {
    this.tier = tier;
    this.amount = amount;
  }

  get isSatisfied() {
    const dimension = AntimatterDimension(this.tier);
    return dimension.totalAmount.gte(this.amount);
  }
}

export class DimBoost {
  static get power() {
    if (NormalChallenge(8).isRunning || LogicChallenge(2).isRunning) {
      return BEC.D1;
    }

    let boost = Effects.max(
      2,
      InfinityUpgrade.dimboostMult,
      InfinityChallenge(7).reward,
      InfinityChallenge(7),
      TimeStudy(81)
    )
      
      .timesEffectsOf(
        TimeStudy(83),
        TimeStudy(231),
        Achievement(117),
        Achievement(142),
        GlyphEffect.dimBoostPower,
        PelleRifts.recursion.milestones[0],
      ).powEffectsOf(
        InfinityUpgrade.dimboostMult.chargedEffect,
        LogicChallenge(7).effects.dimBoostPow,
        Difficulty(2)
      );
    if (GlyphAlteration.isAdded("effarig")) boost = boost.pow(getSecondaryGlyphEffect("effarigforgotten"));
    return boost;
  }

  static multiplierToNDTier(tier) {
    const normalBoostMult = DimBoost.power.pow(this.purchasedBoosts.plus(1 - tier)).clampMin(1);
    const imaginaryBoostMult = DimBoost.power.times(ImaginaryUpgrade(24).effectOrDefault(1))
      .pow(this.imaginaryBoosts).clampMin(1);
    return normalBoostMult.times(imaginaryBoostMult);
  }

  static get maxDimensionsUnlockable() {
    return Math.min(NormalChallenge(10).isRunning ? 6 : 8, Puzzle.maxTier);
  }

  static get canUnlockNewDimension() {
    return DimBoost.purchasedBoosts.plus(4).lt(DimBoost.maxDimensionsUnlockable);
  }

  static get maxBoosts() {
    if (Ra.isRunning) {
      // Ra makes boosting impossible. Note that this function isn't called
      // when giving initial boosts, so the player will still get those.
      return 0;
    }
    if (InfinityChallenge(1).isRunning) {
      // Usually, in Challenge 8, the only boosts that are useful are the first 5
      // (the fifth unlocks sacrifice). In IC1 (Challenge 8 and Challenge 10
      // combined, among other things), only the first 2 are useful
      // (they unlock new dimensions).
      // There's no actual problem with bulk letting the player get
      // more boosts than this; it's just that boosts beyond this are pointless.
      return 2;
    }
    if (NormalChallenge(8).isRunning) {
      // See above. It's important we check for this after checking for IC1 since otherwise
      // this case would trigger when we're in IC1.
      return 5;
    }
    return Infinity;
  }

  static get canBeBought() {
    if (DimBoost.purchasedBoosts.gte(this.maxBoosts)) return false;
    if (player.records.thisInfinity.maxAM.gt(Player.infinityGoal) &&
       (!player.break || Player.isInAntimatterChallenge)) return false;
    return true;
  }

  static get lockText() {
    if (DimBoost.purchasedBoosts.gte(this.maxBoosts)) {
      if (Ra.isRunning) return "Locked (Ra's Reality)";
      if (InfinityChallenge(1).isRunning) return "Locked (Infinity Challenge 1)";
      if (NormalChallenge(8).isRunning) return "Locked (8th Antimatter Dimension Autobuyer Challenge)";
    }
    return null;
  }

  static get requirement() {
    return this.bulkRequirement(1);
  }

  static bulkRequirement(bulk) {
    const targetResets = DimBoost.purchasedBoosts.plus(bulk);
    const tier = targetResets.plus(3).toNumberMax(this.maxDimensionsUnlockable);
    let amount = BEC.D20;
    const discount = Effects.sum(
      TimeStudy(211),
      TimeStudy(222)
    ).toNumber();
    if (tier === 6 && NormalChallenge(10).isRunning) {
      amount = amount.plus(targetResets.minus(3).times(20 - discount).round());
    } else if (tier === 8) {
      amount = amount.plus(targetResets.minus(5).times(15 - discount).round());
    } else if (tier === Puzzle.maxTier) {
      amount = amount.plus(targetResets.minus(1).times(15 - discount).round());
    }
    if (EternityChallenge(5).isRunning) {
      amount = amount.plus(targetResets.minus(1).pow(3)).plus(targetResets.minus(1));
    }

    amount = amount.minus(Effects.sum(InfinityUpgrade.resetBoost));
    if (InfinityChallenge(5).isCompleted) amount = amount.minus(1);

    amount = amount.times(InfinityUpgrade.resetBoost.chargedEffect.effectOrDefault(1));

    amount = amount.round();

    return new DimBoostRequirement(tier, amount);
  }

  static get unlockedByBoost() {
    if (DimBoost.lockText !== null) return DimBoost.lockText;
    const boosts = DimBoost.purchasedBoosts;
    const allNDUnlocked = EternityMilestone.unlockAllND.isReached;

    let newUnlock = "";
    if (!allNDUnlocked && boosts.lt(DimBoost.maxDimensionsUnlockable - 4)) {
      newUnlock = `unlock the ${boosts.plus(5).toNumber()}th Dimension`;
    } else if (boosts.eq(4) && !NormalChallenge(10).isRunning && !EternityChallenge(3).isRunning) {
      newUnlock = "unlock Sacrifice";
    }

    const formattedMultText = `give a ${formatX(DimBoost.power, 2, 1)} multiplier `;
    let dimensionRange = `to the 1st Dimension`;
    if (boosts.gt(0)) dimensionRange = `to Dimensions 1-${BE.min(boosts.plus(1), 8).toNumber()}`;
    if (boosts.gte(DimBoost.maxDimensionsUnlockable - 1)) dimensionRange = `to all Dimensions`;

    let boostEffects;
    if (NormalChallenge(8).isRunning) boostEffects = newUnlock;
    else if (newUnlock === "") boostEffects = `${formattedMultText} ${dimensionRange}`;
    else boostEffects = `${newUnlock} and ${formattedMultText} ${dimensionRange}`;

    if (boostEffects === "") return "Dimension Boosts are currently useless";
    const areDimensionsKept = (Perk.antimatterNoReset.isBought || Achievement(111).canBeApplied) &&
      (!Pelle.isDoomed || PelleUpgrade.dimBoostResetsNothing.isBought);
    if (areDimensionsKept) return boostEffects[0].toUpperCase() + boostEffects.substring(1);
    return `Reset your Dimensions to ${boostEffects}`;
  }

  static get purchasedBoosts() {
    return player.dimensionBoosts.floor();
  }

  static get imaginaryBoosts() {
    return Ra.isRunning ? BEC.D0 : ImaginaryUpgrade(12).effectOrDefault(BEC.D0).times(ImaginaryUpgrade(23).effectOrDefault(1));
  }

  static get totalBoosts() {
    return BE.floor(this.purchasedBoosts.plus(this.imaginaryBoosts));
  }

  static get startingDimensionBoosts() {
    if (InfinityUpgrade.skipResetGalaxy.isBought) return 4;
    if (InfinityUpgrade.skipReset3.isBought) return 3;
    if (InfinityUpgrade.skipReset2.isBought) return 2;
    if (InfinityUpgrade.skipReset1.isBought) return 1;
    return 0;
  }
}

// eslint-disable-next-line max-params
export function softReset(tempBulk, forcedADReset = false, forcedAMReset = false, enteringAntimatterChallenge = false) {
  if (Currency.antimatter.gt(Player.infinityLimit)) return;
  const bulk = BE.min(tempBulk, BE.minus(DimBoost.maxBoosts, player.dimensionBoosts));
  EventHub.dispatch(GAME_EVENT.DIMBOOST_BEFORE, bulk);
  player.dimensionBoosts = BE.max(0, player.dimensionBoosts.plus(bulk));
  resetChallengeStuff();
  const canKeepDimensions = Pelle.isDoomed
    ? PelleUpgrade.dimBoostResetsNothing.canBeApplied
    : Perk.antimatterNoReset.canBeApplied;
  if (forcedADReset || !canKeepDimensions) {
    AntimatterDimensions.reset();
    player.sacrificed = BEC.D0;
    resetTickspeed();
  }
  skipResetsIfPossible(enteringAntimatterChallenge);
  const canKeepAntimatter = Pelle.isDoomed
    ? PelleUpgrade.dimBoostResetsNothing.canBeApplied
    : (Achievement(111).isUnlocked || Perk.antimatterNoReset.canBeApplied);
  if (!forcedAMReset && canKeepAntimatter) {
    Currency.antimatter.bumpTo(Currency.antimatter.startingValue);
  } else {
    Currency.antimatter.reset();
  }
  EventHub.dispatch(GAME_EVENT.DIMBOOST_AFTER, bulk);
}

export function skipResetsIfPossible(enteringAntimatterChallenge) {
  if (enteringAntimatterChallenge || Player.isInAntimatterChallenge || LogicChallenge.isRunning) return;
  if (InfinityUpgrade.skipResetGalaxy.isBought && player.dimensionBoosts.lt(4)) {
    player.dimensionBoosts = BEC.D4;
    if (player.galaxies.eq(0)) player.galaxies = BEC.D1;
  } else if (InfinityUpgrade.skipReset3.isBought && player.dimensionBoosts.lt(3)) player.dimensionBoosts = BEC.D3;
  else if (InfinityUpgrade.skipReset2.isBought && player.dimensionBoosts.lt(2)) player.dimensionBoosts = BEC.D2;
  else if (InfinityUpgrade.skipReset1.isBought && player.dimensionBoosts.lt(1)) player.dimensionBoosts = BEC.D1;
}

export function manualRequestDimensionBoost(bulk) {
  if (Currency.antimatter.gt(Player.infinityLimit) || !DimBoost.requirement.isSatisfied) return;
  if (!DimBoost.canBeBought) return;
  if (GameEnd.creditsEverClosed) return;
  if (player.options.confirmations.dimensionBoost) {
    Modal.dimensionBoost.show({ bulk });
    return;
  }
  requestDimensionBoost(bulk);
}

export function requestDimensionBoost(bulk) {
  if (Currency.antimatter.gt(Player.infinityLimit) || !DimBoost.requirement.isSatisfied) return;
  if (!DimBoost.canBeBought) return;
  Tutorial.turnOffEffect(TUTORIAL_STATE.DIMBOOST);
  if ((BreakInfinityUpgrade.autobuyMaxDimboosts.isBought && (bulk && Autobuyer.dimboost.buyMaxMode)) || NormalChallenge(3).isRunning) maxBuyDimBoosts();
  else maxBuyDimBoosts(LogicUpgrade(8).effectOrDefault(1));
}

function maxBuyDimBoosts(bulk = Infinity) {
  // Boosts that unlock new dims are bought one at a time, unlocking the next dimension
  if (DimBoost.canUnlockNewDimension || bulk === 1) {
    if (DimBoost.requirement.isSatisfied) softReset(1);
    return;
  }
  const req1 = DimBoost.bulkRequirement(1);
  if (!req1.isSatisfied) return;
  const req2 = DimBoost.bulkRequirement(2);
  if (!req2.isSatisfied) {
    softReset(1);
    return;
  }
  // Linearly extrapolate dimboost costs. req1 = a * 1 + b, req2 = a * 2 + b
  // so a = req2 - req1, b = req1 - a = 2 req1 - req2, num = (dims - b) / a
  const increase = req2.amount.minus(req1.amount);
  const dim = AntimatterDimension(req1.tier);
  let maxBoosts = BE.min(bulk,
    BE.floor((dim.totalAmount.minus(req1.amount)).div(increase)).plus(1));
  if (DimBoost.bulkRequirement(maxBoosts).isSatisfied) {
    softReset(maxBoosts);
    return;
  }
  // But in case of EC5 it's not, so do binary search for appropriate boost amount
  let minBoosts = BEC.D2;
  while (maxBoosts.neq(minBoosts.plus(1)) && minBoosts.lte(bulk)) {
    const middle = maxBoosts.plus(minBoosts).div(2).floor();
    if (DimBoost.bulkRequirement(middle).isSatisfied) minBoosts = middle;
    else maxBoosts = middle;
  }
  softReset(BE.min(minBoosts, bulk));
}
