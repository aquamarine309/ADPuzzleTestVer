import { BEC } from "./constants.js";

export function effectiveBaseGalaxies() {
  // Note that this already includes the "50% more" active path effect
  let replicantiGalaxies = Replicanti.galaxies.bought;
  replicantiGalaxies = replicantiGalaxies.times(Effects.sum(
    TimeStudy(132),
    TimeStudy(133)
  ).plus(1));
  // "extra" galaxies unaffected by the passive/idle boosts come from studies 225/226 and Effarig Infinity
  replicantiGalaxies = replicantiGalaxies.add(Replicanti.galaxies.extra);
  const nonActivePathReplicantiGalaxies = BE.min(Replicanti.galaxies.bought,
    ReplicantiUpgrade.galaxies.value);
  // Effects.sum is intentional here - if EC8 is not completed,
  // this value should not be contributed to total replicanti galaxies
  replicantiGalaxies = replicantiGalaxies.plus(nonActivePathReplicantiGalaxies.times(Effects.sum(EternityChallenge(8).reward)));
  let freeGalaxies = player.dilation.totalTachyonGalaxies;
  freeGalaxies = freeGalaxies.times(BE.max(0, Replicanti.amount.log10().div(1e6)).times(AlchemyResource.alternation.effectValue).plus(1));
  return BE.max(player.galaxies.plus(GalaxyGenerator.galaxies).plus(replicantiGalaxies).plus(freeGalaxies), 0);
}

export function getTickSpeedMultiplier() {
  if (InfinityChallenge(3).isRunning || LogicChallenge(5).isRunning) return BEC.D1;
  if (Ra.isRunning) return BEC.C1D1_1245;
  let galaxies = effectiveBaseGalaxies();
  const effects = Effects.product(
    InfinityUpgrade.galaxyBoost,
    InfinityUpgrade.galaxyBoost.chargedEffect,
    BreakInfinityUpgrade.galaxyBoost,
    TimeStudy(212),
    TimeStudy(232),
    Achievement(86),
    Achievement(178),
    InfinityChallenge(5).reward,
    PelleUpgrade.galaxyPower,
    PelleRifts.decay.milestones[1],
    LogicChallenge(6),
    LogicChallenge(6).reward,
    LogicChallenge(7).effects.galMul
  );
  if (galaxies.lt(3)) {
    // Magic numbers are to retain balancing from before while displaying
    // them now as positive multipliers rather than negative percentages
    let baseMultiplier = 1 / 1.1245;
    if (player.galaxies === 1) baseMultiplier = 1 / 1.11888888;
    if (player.galaxies === 2) baseMultiplier = 1 / 1.11267177;
    if (NormalChallenge(5).isRunning) {
      baseMultiplier = 1 / 1.08;
      if (player.galaxies === 1) baseMultiplier = 1 / 1.07632;
      if (player.galaxies === 2) baseMultiplier = 1 / 1.072;
    }
    const perGalaxy = effects.times(0.02);
    if (Pelle.isDoomed) galaxies = galaxies.times(0.5);

    galaxies = galaxies.times(Pelle.specialGlyphEffect.power);
    return BEC.D0_01.clampMin(BE.minus(baseMultiplier, galaxies.times(perGalaxy)));
  }
  let baseMultiplier = 0.8;
  if (NormalChallenge(5).isRunning) baseMultiplier = 0.83;
  galaxies = galaxies.minus(2);
  galaxies = galaxies.times(effects);
  galaxies = galaxies.times(getAdjustedGlyphEffect("cursedgalaxies"));
  galaxies = galaxies.times(getAdjustedGlyphEffect("realitygalaxies"));
  galaxies = galaxies.times(1 + ImaginaryUpgrade(9).effectOrDefault(0));
  if (Pelle.isDoomed) galaxies = galaxies.times(0.5);

  galaxies = galaxies.times(Pelle.specialGlyphEffect.power);
  const perGalaxy = BEC.D0_965;
  return perGalaxy.pow(galaxies.minus(2)).times(baseMultiplier);
}

export function buyTickSpeed() {
  if (!Tickspeed.isAvailableForPurchase || !Tickspeed.isAffordable) return false;

  if (NormalChallenge(9).isRunning) {
    Tickspeed.multiplySameCosts();
  }
  Tutorial.turnOffEffect(TUTORIAL_STATE.TICKSPEED);
  Currency.antimatter.subtract(Tickspeed.cost);
  player.totalTickBought = player.totalTickBought.plus(1);
  player.records.thisInfinity.lastBuyTime = player.records.thisInfinity.time;
  player.requirementChecks.permanent.singleTickspeed++;
  if (NormalChallenge(2).isRunning) player.chall2Pow = 0;
  GameUI.update();
  return true;
}

export function buyMaxTickSpeed() {
  if (!Tickspeed.isAvailableForPurchase || !Tickspeed.isAffordable) return false;
  let boughtTickspeed = false;

  Tutorial.turnOffEffect(TUTORIAL_STATE.TICKSPEED);
  if (NormalChallenge(9).isRunning) {
    const goal = Player.infinityGoal;
    let cost = Tickspeed.cost;
    while (Currency.antimatter.gt(cost) && cost.lt(goal)) {
      Tickspeed.multiplySameCosts();
      Currency.antimatter.subtract(cost);
      player.totalTickBought = player.totalTickBought.plus(1);
      boughtTickspeed = true;
      cost = Tickspeed.cost;
    }
  } else {
    const purchases = Tickspeed.costScale.getMaxBought(player.totalTickBought, Currency.antimatter.value, BEC.D1, true);
    if (purchases !== null) {
       if (purchases.logPrice.eq(Currency.antimatter.value.log10()) && AntimatterDimension(1).amount.eq(0)) {
        purchases.logPrice = Tickspeed.costScale.calculateCost(purchases.quantity.sub(1));
        purchases.quantity = purchases.quantity.sub(1);
      }
      
      Currency.antimatter.subtract(BE.pow10(purchases.logPrice));
      player.totalTickBought = player.totalTickBought.add(purchases.quantity);
    }
    
    for (
        let i = 0; i < 5 && 
        (Tickspeed.isAffordable && AntimatterDimension(1).amount.gt(0));
        i++
      ) {
        buyTickSpeed();
      }
    
    boughtTickspeed = true;
  }

  if (boughtTickspeed) {
    player.records.thisInfinity.lastBuyTime = player.records.thisInfinity.time;
    if (NormalChallenge(2).isRunning) player.chall2Pow = 0;
  }
  
  if (player.dimensions.antimatter[0].amount.eq(0)) {
    Currency.antimatter.bumpTo(100);
  }
  
  return boughtTickspeed;
}

export function resetTickspeed() {
  player.totalTickBought = BEC.D0;
  player.chall9TickspeedCostBumps = BEC.D0;
}

export const Tickspeed = {

  get isUnlocked() {
    return AntimatterDimension(2).bought.gt(0) || EternityMilestone.unlockAllND.isReached ||
      PlayerProgress.realityUnlocked();
  },

  get isAvailableForPurchase() {
    return this.isUnlocked &&
      !EternityChallenge(9).isRunning &&
      !Laitela.continuumActive &&
      (player.break || this.cost.lt(BE.NUMBER_MAX_VALUE));
  },

  get isAffordable() {
    return Currency.antimatter.gte(this.cost);
  },

  get multiplier() {
    return getTickSpeedMultiplier();
  },

  get current() {
    const tickspeed = Effarig.isRunning
      ? Effarig.tickspeed
      : this.baseValue.powEffectOf(DilationUpgrade.tickspeedPower);
    return player.dilation.active || PelleStrikes.dilation.hasStrike ? dilatedValueOf(tickspeed) : tickspeed;
  },

  get cost() {
    return this.costScale.calculateCost(player.totalTickBought.plus(player.chall9TickspeedCostBumps));
  },

  get costScale() {
    return new ExponentialCostScaling({
      baseCost: BEC.E3,
      baseIncrease: BEC.E1,
      costScale: Player.tickSpeedMultDecrease,
      scalingCostThreshold: BE.NUMBER_MAX_VALUE
    });
  },

  get continuumValue() {
    if (!this.isUnlocked) return BEC.D0;
    return this.costScale.getContinuumValue(Currency.antimatter.value, 1).times(Laitela.matterExtraPurchaseFactor);
  },

  get baseValue() {
    return BEC.E3.timesEffectsOf(
      Achievement(36),
      Achievement(45),
      Achievement(66),
      Achievement(83)
    )
      .times(getTickSpeedMultiplier().pow(this.totalUpgrades));
  },

  get totalUpgrades() {
    let boughtTickspeed;
    if (Laitela.continuumActive) boughtTickspeed = this.continuumValue;
    else boughtTickspeed = player.totalTickBought;
    return boughtTickspeed.plus(player.totalTickGained);
  },

  get perSecond() {
    return BE.divide(1000, this.current);
  },

  multiplySameCosts() {
    for (const dimension of AntimatterDimensions.all) {
      if (dimension.cost.e === this.cost.e) dimension.costBumps = dimension.costBumps.add(1);
    }
  }
};


export const FreeTickspeed = {
  BASE_SOFTCAP: BEC.D3E5,
  GROWTH_RATE: BEC.D6E_6,
  GROWTH_EXP: BEC.D2,
  multToNext: BEC.D1_33,

  get amount() {
    return player.totalTickGained;
  },

  get softcap() {
    let softcap = FreeTickspeed.BASE_SOFTCAP;
    if (Enslaved.has(ENSLAVED_UNLOCKS.FREE_TICKSPEED_SOFTCAP)) {
      softcap = softcap.plus(BEC.E5);
    }
    return softcap;
  },

  fromShards(shards) {
    const tickmult = Effects.min(1.33, TimeStudy(171)).minus(1).times
      (Math.max(getAdjustedGlyphEffect("cursedtickspeed"), 1)).plus(1);
    const logTickmult = BE.log(tickmult);
    const logShards = shards.ln();
    const uncapped = BE.max(0, logShards.div(logTickmult));
    if (uncapped.lte(FreeTickspeed.softcap)) {
      this.multToNext = tickmult;
      return {
        newAmount: BE.ceil(uncapped),
        nextShards: BE.pow(tickmult, BE.ceil(uncapped))
      };
    }
    // Log of (cost - cost up to softcap)
    const priceToCap = FreeTickspeed.softcap.times(logTickmult);
    // In the following we're implicitly applying the function (ln(x) - priceToCap) / logTickmult to all costs,
    // so, for example, if the cost is 1 that means it's actually exp(priceToCap) * tickmult.
    const desiredCost = logShards.minus(priceToCap).div(logTickmult);
    const costFormulaCoefficient = FreeTickspeed.GROWTH_RATE.div(FreeTickspeed.GROWTH_EXP).div(logTickmult);
    // In the following we're implicitly subtracting softcap from bought,
    // so, for example, if bought is 1 that means it's actually softcap + 1.
    // The first term (the big one) is the asymptotically more important term (since FreeTickspeed.GROWTH_EXP > 1),
    // but is small initially. The second term allows us to continue the pre-cap free tickspeed upgrade scaling
    // of tickmult per upgrade.
    const boughtToCost = bought => costFormulaCoefficient.times(BE.pow(
      BE.max(bought, 0), FreeTickspeed.GROWTH_EXP)).plus(bought);
    const derivativeOfBoughtToCost = x => FreeTickspeed.GROWTH_EXP.times(costFormulaCoefficient).times(BE.pow(
      BE.max(x, 0), FreeTickspeed.GROWTH_EXP.minus(1))).add(1);
    const newtonsMethod = bought => bought.minus((boughtToCost(bought).minus(desiredCost)).div(derivativeOfBoughtToCost(bought)));
    let oldApproximation;
    let approximation = BE.min(
      desiredCost,
      desiredCost.div(costFormulaCoefficient).pow(FreeTickspeed.GROWTH_EXP.recip())
    );
    let counter = 0;
    // The bought formula is concave upwards. We start with an over-estimate; when using newton's method,
    // this means that successive iterations are also over-etimates. Thus, we can just check for continued
    // progress with the approximation < oldApproximation check. The counter is a fallback.
    do {
      oldApproximation = approximation;
      approximation = newtonsMethod(approximation);
    } while (approximation < oldApproximation && ++counter < 100);
    const purchases = approximation.floor();
    // This undoes the function we're implicitly applying to costs (the "+ 1") is because we want
    // the cost of the next upgrade.
    const next = BE.exp(priceToCap.plus(boughtToCost(purchases.plus(1)).times(logTickmult)));
    this.multToNext = BE.exp((boughtToCost(purchases.plus(1)).minus(boughtToCost(purchases))).times(logTickmult));
    return {
      newAmount: purchases.plus(FreeTickspeed.softcap),
      nextShards: next,
    };
  }
};
