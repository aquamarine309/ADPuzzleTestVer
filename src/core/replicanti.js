import { BEC } from "./constants.js";

// Slowdown parameters for replicanti growth, interval will increase by scaleFactor for every scaleLog10
// OoM past the cap (default is 308.25 (log10 of 1.8e308), 1.2, Number.MAX_VALUE)
export const ReplicantiGrowth = {
  get scaleLog10() {
    return Math.log10(Number.MAX_VALUE);
  },
  get scaleFactor() {
    if (PelleStrikes.eternity.hasStrike && Replicanti.amount.gte(BEC.E2000)) return 10;
    if (Pelle.isDoomed) return 2;
    const factor = Effects.min(Infinity, TimeStudy(40), TimeStudy(192)).toNumber();
    return AlchemyResource.cardinality.effectValue * factor;
  }
};

// Internal function to add RGs; called both from within the fast replicanti code and from the function
// used externally. Only called in cases of automatic RG and does not actually modify replicanti amount
function addReplicantiGalaxies(newGalaxies) {
  if (newGalaxies.gt(0)) {
    player.replicanti.galaxies = player.replicanti.galaxies.add(newGalaxies);
    player.requirementChecks.eternity.noRG = false;
    const keepResources = Pelle.isDoomed
      ? PelleUpgrade.replicantiGalaxyEM40.canBeApplied
      : EternityMilestone.replicantiNoReset.isReached;
    if (!keepResources) {
      player.dimensionBoosts = BEC.D0;
      softReset(0, true, true);
    }
  }
}

// Function called externally for gaining RGs, which adjusts replicanti amount before calling the function
// which actually adds the RG. Called externally both automatically and manually
export function replicantiGalaxy(auto) {
  if (RealityUpgrade(6).isLockingMechanics) {
    if (!auto) RealityUpgrade(6).tryShowWarningModal();
    return;
  }
  if (!Replicanti.galaxies.canBuyMore) return;
  const galaxyGain = Replicanti.galaxies.gain;
  if (galaxyGain.lt(1)) return;
  player.replicanti.timer = BEC.D0;
  Replicanti.amount = Achievement(126).isUnlocked && !Pelle.isDoomed
    ? BE.pow10(Replicanti.amount.log10().sub(galaxyGain.mul(LOG10_MAX_VALUE)))
    : new BE(1);
  addReplicantiGalaxies(galaxyGain);
}

// Only called on manual RG requests
export function replicantiGalaxyRequest() {
  if (!Replicanti.galaxies.canBuyMore) return;
  if (RealityUpgrade(6).isLockingMechanics) RealityUpgrade(6).tryShowWarningModal();
  else if (player.options.confirmations.replicantiGalaxy) Modal.replicantiGalaxy.show();
  else replicantiGalaxy(false);
}

// Produces replicanti quickly below e308, will auto-bulk-RG if production is fast enough
// Returns the remaining unused gain factor
function fastReplicantiBelow308(log10GainFactor, isAutobuyerActive) {
  const shouldBuyRG = isAutobuyerActive && !RealityUpgrade(6).isLockingMechanics;
  // More than e308 galaxies per tick causes the game to die, and I don't think it's worth the performance hit of
  // BEifying the entire calculation.  And yes, this can and does actually happen super-lategame.
  const uncappedAmount = BEC.E1.pow(log10GainFactor.plus(Replicanti.amount.log10()));
  // Checking for uncapped equaling zero is because BE.pow returns zero for overflow for some reason
  if (log10GainFactor.gt(Number.MAX_VALUE) || uncappedAmount.eq(0)) {
    if (shouldBuyRG) {
      addReplicantiGalaxies(Replicanti.galaxies.max.sub(player.replicanti.galaxies));
    }
    Replicanti.amount = replicantiCap();
    // Basically we've used nothing.
    return log10GainFactor;
  }

  if (!shouldBuyRG) {
    const remainingGain = log10GainFactor.minus(replicantiCap().log10().sub(Replicanti.amount.log10())).clampMin(0);
    Replicanti.amount = BE.min(uncappedAmount, replicantiCap());
    return remainingGain;
  }

  const gainNeededPerRG = BE.NUMBER_MAX_VALUE.log10();
  const replicantiExponent = log10GainFactor.add(Replicanti.amount.log10());
  const toBuy = BE.floor(BE.min(replicantiExponent.div(gainNeededPerRG),
    Replicanti.galaxies.max.sub(player.replicanti.galaxies)));
  const maxUsedGain = gainNeededPerRG.times(toBuy).add(replicantiCap().log10()).sub(Replicanti.amount.log10());
  const remainingGain = log10GainFactor.minus(maxUsedGain).clampMin(0);
  Replicanti.amount = BE.pow10(replicantiExponent.sub(gainNeededPerRG.times(toBuy)))
    .clampMax(replicantiCap());
  addReplicantiGalaxies(toBuy);
  return remainingGain;
}

// When the amount is exactly the cap, there are two cases: the player can go
// over cap (in which case interval should be as if over cap) or the player
// has just crunched and is still at cap due to "Is this safe?" reward
// (in which case interval should be as if not over cap). This is why we have
// the overCapOverride parameter, to tell us which case we are in.
export function getReplicantiInterval(overCapOverride, intervalIn) {
  let interval = new BE(intervalIn || player.replicanti.interval);
  const amount = Replicanti.amount;
  const overCap = overCapOverride === undefined ? amount.gt(replicantiCap()) : overCapOverride;
  if ((TimeStudy(133).isBought && !Achievement(138).isUnlocked) || overCap) {
    interval = interval.times(10);
  }

  if (overCap) {
    let increases = amount.log10().sub(replicantiCap().log10()).div(ReplicantiGrowth.scaleLog10);
    if (PelleStrikes.eternity.hasStrike && amount.gte(BEC.E2000)) {
      // The above code assumes in this case there's 10x scaling for every 1e308 increase;
      // in fact, before e2000 it's only 2x.
      increases = increases.sub(BE.log10(5).times(BEC.E2000.sub(replicantiCap()).log10())
        .div(ReplicantiGrowth.scaleLog10));
    }
    interval = interval.times(BE.pow(ReplicantiGrowth.scaleFactor, increases));
  }

  interval = interval.divide(totalReplicantiSpeedMult(overCap));

  if (V.isRunning) {
    // This is a boost if interval < 1, but that only happens in EC12
    // and handling it would make the replicanti code a lot more complicated.
    interval = interval.pow(2);
  }
  return interval;
}

// This only counts the "external" multipliers - that is, it doesn't count any speed changes due to being over the cap.
// These multipliers are separated out largely for two reasons - more "dynamic" multipliers (such as overcap scaling
// and celestial nerfs) interact very weirdly and the game balance relies on this behavior, and we also use this same
// value in the multiplier tab too
export function totalReplicantiSpeedMult(overCap) {
  let totalMult = BEC.D1;

  // These are the only effects active in Pelle - the function shortcuts everything else if we're in Pelle
  totalMult = totalMult.times(PelleRifts.decay.effectValue);
  totalMult = totalMult.times(Pelle.specialGlyphEffect.replication);
  if (Pelle.isDisabled("replicantiIntervalMult")) return totalMult;

  const preCelestialEffects = Effects.product(
    TimeStudy(62),
    TimeStudy(213),
    RealityUpgrade(2),
    RealityUpgrade(6),
    RealityUpgrade(23),
  );
  totalMult = totalMult.times(preCelestialEffects);
  if (Replicanti.autoreplicateUnlocked) {
    totalMult = totalMult.times(ReplicantiBoost.boost);
  }
  if (TimeStudy(132).isBought) {
    totalMult = totalMult.times(Perk.studyPassive.isBought ? 3 : 1.5);
  }

  if (!overCap && Achievement(134).isUnlocked) {
    totalMult = totalMult.times(2);
  }
  totalMult = totalMult.times(getAdjustedGlyphEffect("replicationspeed"));
  if (GlyphAlteration.isAdded("replication")) {
    totalMult = totalMult
      .times(Replicanti.amount.log10().mul(getSecondaryGlyphEffect("replicationdtgain")).clampMin(1));
  }
  totalMult = totalMult.timesEffectsOf(AlchemyResource.replication, Ra.unlocks.continuousTTBoost.effects.replicanti);

  return totalMult.clampMin(1);
}

export function replicantiCap() {
  return EffarigUnlock.infinity.canBeApplied
    ? Currency.infinitiesTotal.value
      .pow(TimeStudy(31).isBought ? 120 : 30)
      .clampMin(1)
      .times(BE.NUMBER_MAX_VALUE)
    : BE.NUMBER_MAX_VALUE;
}

// eslint-disable-next-line complexity
export function replicantiLoop(diff, auto = true) {
  if (!player.replicanti.unl) return;
  if (diff) {
    player.replicanti.cooldownTime = player.replicanti.cooldownTime.minus(diff);
  }
  if (!auto) player.replicanti.cooldownTime = getReplicantiInterval(false);
  if (auto && !Replicanti.autoreplicateUnlocked) return;
  const replicantiBeforeLoop = Replicanti.amount;
  PerformanceStats.start("Replicanti");
  EventHub.dispatch(GAME_EVENT.REPLICANTI_TICK_BEFORE);
  // This gets the pre-cap interval (above the cap we recalculate the interval).
  const interval = getReplicantiInterval(false);
  const isUncapped = Replicanti.isUncapped;
  const areRGsBeingBought = Replicanti.galaxies.areBeingBought;

  // Figure out how many ticks to calculate for and roll over any leftover time to the next tick. The rollover
  // calculation is skipped if there's more than 100 replicanti ticks per game tick to reduce round-off problems.
  let tickCount = auto ? diff.add(player.replicanti.timer).div(interval) : ReplicantiBoost.boost;
  if (tickCount.lt(100) || !auto) player.replicanti.timer = tickCount.minus(tickCount.floor()).times(interval);
  else player.replicanti.timer = BEC.D0;
  tickCount = tickCount.floor();

  const singleTickAvg = Replicanti.amount.times(player.replicanti.chance);
  // Note that code inside this conditional won't necessarily run every game tick; when game ticks are slower than
  // replicanti ticks, then tickCount will look like [0, 0, 0, 1, 0, 0, ...] on successive game ticks
  if (tickCount.gte(100) || (singleTickAvg.gte(10) && tickCount.gte(1))) {
    // Fast gain: If we're doing a very large number of ticks or each tick produces a lot, then continuous growth
    // every replicanti tick is a good approximation and less intensive than distribution samples. This path will
    // always happen above 1000 replicanti due to how singleTickAvg is calculated, so the over-cap math is only
    // present on this path
    let postScale = BE.log10(ReplicantiGrowth.scaleFactor).div(ReplicantiGrowth.scaleLog10);
    if (V.isRunning) {
      postScale = postScale.mul(2);
    }

    // Note that remainingGain is in log10 terms.
    let remainingGain = tickCount.times(player.replicanti.chance.add(1).ln()).times(LOG10_E);
    // It is intended to be possible for both of the below conditionals to trigger.
    if (!isUncapped || Replicanti.amount.lte(replicantiCap())) {
      // Some of the gain is "used up" below e308, but if replicanti are uncapped
      // then some may be "left over" for increasing replicanti beyond their cap.
      remainingGain = fastReplicantiBelow308(remainingGain, areRGsBeingBought);
    }
    if (isUncapped && Replicanti.amount.gte(replicantiCap()) && remainingGain.gt(0)) {
      // Recalculate the interval (it may have increased due to additional replicanti, or,
      // far less importantly, decreased due to Reality Upgrade 6 and additional RG).
      // Don't worry here about the lack of e2000 scaling in Pelle on the first tick
      // (with replicanti still under e2000) causing a huge replicanti jump;
      // there's code later to stop replicanti from increasing by more than e308
      // in a single tick in Pelle.
      const intervalRatio = getReplicantiInterval(true).div(interval);
      remainingGain = remainingGain.div(intervalRatio);
      Replicanti.amount = remainingGain.div(LOG10_E).times(postScale).plus(1).ln().div(postScale)
        .add(Replicanti.amount.clampMin(1).ln()).exp();
    }
  } else if (tickCount.gt(1)) {
    // Multiple ticks but "slow" gain: This happens at low replicanti chance and amount with a fast interval, which
    // can happen often in early cel7. In this case we "batch" ticks together as full doubling events and then draw
    // from a Poisson distribution for how many times to do that. Any leftover ticks are used as binomial samples
    const batchTicks = player.replicanti.chance.add(1).log(2).mul(tickCount).floor();
    const binomialTicks = tickCount.sub(batchTicks.div(player.replicanti.chance.add(1).log(2)));

    Replicanti.amount = Replicanti.amount.times(BEC.D2.pow(poissonDistribution(batchTicks)));
    for (let t = 0; t < binomialTicks.floor().toNumber(); t++) {
      const reproduced = binomialDistribution(Replicanti.amount, player.replicanti.chance);
      Replicanti.amount = Replicanti.amount.plus(reproduced);
    }

    // The batching might use partial ticks; we add the rest back to the timer so it gets used next loop
    const leftover = binomialTicks.sub(binomialTicks.floor());
    player.replicanti.timer = player.replicanti.timer.add(interval.times(leftover));
  } else if (tickCount.eq(1)) {
    // Single tick: Take a single binomial sample to properly simulate replicanti growth with randomness
    const reproduced = binomialDistribution(Replicanti.amount, player.replicanti.chance);
    Replicanti.amount = Replicanti.amount.plus(reproduced);
  }

  if (!isUncapped) Replicanti.amount = BE.min(replicantiCap(), Replicanti.amount);

  if (Pelle.isDoomed && Replicanti.amount.log10().minus(replicantiBeforeLoop.log10()).gt(308)) {
    Replicanti.amount = replicantiBeforeLoop.times(1e308);
  }

  if (areRGsBeingBought && Replicanti.amount.gte(BE.NUMBER_MAX_VALUE)) {
    const buyer = Autobuyer.replicantiGalaxy;
    const isAuto = buyer.canTick && buyer.isEnabled;
    // There might be a manual and auto tick simultaneously; pass auto === true iff the autobuyer is ticking and
    // we aren't attempting to manually buy RG, because this controls modals appearing or not
    replicantiGalaxy(isAuto && !Replicanti.galaxies.isPlayerHoldingR);
  }
  player.records.thisReality.maxReplicanti = player.records.thisReality.maxReplicanti
    .clampMin(Replicanti.amount);
  EventHub.dispatch(GAME_EVENT.REPLICANTI_TICK_AFTER);
  PerformanceStats.end();
}

export function replicantiMult() {
  return Replicanti.amount.clampMin(1).log2().pow(2)
    .plusEffectOf(TimeStudy(21))
    .timesEffectOf(TimeStudy(102))
    .clampMin(1)
    .pow(getAdjustedGlyphEffect("replicationpow"));
}

/** @abstract */
class ReplicantiUpgradeState {
  /** @abstract */
  get id() { throw new NotImplementedError(); }
  /** @abstract */
  get value() { throw new NotImplementedError(); }

  /** @abstract */
  set value(value) { throw new NotImplementedError(); }

  /** @abstract */
  get nextValue() { throw new NotImplementedError(); }

  /** @abstract */
  get cost() { throw new NotImplementedError(); }
  /** @abstract */
  set cost(value) { throw new Error("Use baseCost to set cost"); }

  /** @abstract */
  get costIncrease() { throw new NotImplementedError(); }

  get baseCost() { return this.cost; }
  /** @abstract */
  set baseCost(value) { throw new NotImplementedError(); }

  get cap() { return undefined; }
  get isCapped() { return false; }

  /** @abstract */
  get autobuyerMilestone() { throw new NotImplementedError(); }

  get canBeBought() {
    return !this.isCapped && Currency.infinityPoints.gte(this.cost) && player.eterc8repl !== 0;
  }

  purchase() {
    if (!this.canBeBought) return;
    Currency.infinityPoints.subtract(this.cost);
    this.baseCost = BE.times(this.baseCost, this.costIncrease);
    this.value = this.nextValue;
    if (EternityChallenge(8).isRunning) player.eterc8repl--;
    GameUI.update();
  }

  autobuyerTick() {
    while (this.canBeBought) {
      this.purchase();
    }
  }
}

export const ReplicantiUpgrade = {
  chance: new class ReplicantiChanceUpgrade extends ReplicantiUpgradeState {
    get id() { return 1; }

    get value() { return player.replicanti.chance; }
    set value(value) { player.replicanti.chance = value; }

    get nextValue() {
      return this.nearestPercent(this.value.add(0.01));
    }

    get cost() {
      return player.replicanti.chanceCost.dividedByEffectsOf(
        PelleRifts.vacuum.milestones[1],
        LogicChallenge(4).reward
      );
    }

    get baseCost() { return player.replicanti.chanceCost; }
    set baseCost(value) { player.replicanti.chanceCost = value; }

    get costIncrease() { return 1e15; }

    get cap() {
      // Chance never goes over 100%.
      return BEC.D1;
    }

    get isCapped() {
      return this.nearestPercent(this.value).gte(this.cap);
    }

    get autobuyerMilestone() {
      return EternityMilestone.autobuyerReplicantiChance;
    }

    autobuyerTick() {
      // Fixed price increase of 1e15; so total cost for N upgrades is:
      // cost + cost * 1e15 + cost * 1e30 + ... + cost * 1e15^(N-1) == cost * (1e15^N - 1) / (1e15 - 1)
      // N = log(IP * (1e15 - 1) / cost + 1) / log(1e15)
      let N = Currency.infinityPoints.value.times(this.costIncrease - 1)
        .dividedBy(this.cost).plus(1).log(this.costIncrease);
      N = BE.round(BE.min(N.floor().div(100).add(this.value), this.cap).sub(this.value).mul(100));
      if (N.lte(0)) return;
      const totalCost = this.cost.times(BE.pow(this.costIncrease, N).minus(1).dividedBy(this.costIncrease - 1));
      Currency.infinityPoints.subtract(totalCost);
      this.baseCost = this.baseCost.times(BE.pow(this.costIncrease, N));
      this.value = this.nearestPercent(N.div(100).add(this.value));
    }

    // Rounding errors suck
    nearestPercent(x) {
      return BE.mul(x, 100).round().div(100);
    }
  }(),
  interval: new class ReplicantiIntervalUpgrade extends ReplicantiUpgradeState {
    get id() { return 2; }

    get value() { return player.replicanti.interval; }
    set value(value) { player.replicanti.interval = value; }

    get nextValue() {
      return BE.max(this.value.times(0.9), this.cap);
    }

    get cost() {
      return player.replicanti.intervalCost.dividedByEffectsOf(
        PelleRifts.vacuum.milestones[1],
        LogicChallenge(4).reward
      );
    }

    get baseCost() { return player.replicanti.intervalCost; }
    set baseCost(value) { player.replicanti.intervalCost = value; }

    get costIncrease() { return 1e10; }

    get cap() {
      return Effects.min(50, TimeStudy(22));
    }

    get isCapped() {
      return this.value.lte(this.cap);
    }

    get autobuyerMilestone() {
      return EternityMilestone.autobuyerReplicantiInterval;
    }

    applyModifiers(value) {
      return getReplicantiInterval(undefined, value);
    }
  }(),
  galaxies: new class ReplicantiGalaxiesUpgrade extends ReplicantiUpgradeState {
    get id() { return 3; }

    get value() { return player.replicanti.boughtGalaxyCap; }
    set value(value) { player.replicanti.boughtGalaxyCap = value; }

    get nextValue() {
      return this.value.add(1);
    }

    get cost() {
      return this.baseCost.dividedByEffectsOf(
        TimeStudy(233),
        PelleRifts.vacuum.milestones[1],
        LogicChallenge(4).reward
      );
    }

    get baseCost() { return player.replicanti.galCost; }
    set baseCost(value) { player.replicanti.galCost = value; }

    get distantRGStart() {
      return BEC.E2.plusEffectOf(GlyphSacrifice.replication);
    }

    get remoteRGStart() {
      return BEC.E3.plusEffectOf(GlyphSacrifice.replication);
    }

    get costIncrease() {
      const galaxies = this.value;
      let increase = EternityChallenge(6).isRunning
        ? BEC.E2.pow(galaxies).times(BEC.E2)
        : BEC.E5.pow(galaxies).times(BEC.E25);
      if (galaxies.gte(this.distantRGStart)) {
        increase = increase.times(BEC.E50.pow(galaxies.sub(this.distantRGStart).add(5)));
      }
      if (galaxies.gte(this.remoteRGStart)) {
        increase = increase.times(BEC.E5.pow(BE.pow(galaxies.sub(this.remoteRGStart).add(1), 2)));
      }
      return increase;
    }

    get autobuyerMilestone() {
      return EternityMilestone.autobuyerReplicantiMaxGalaxies;
    }

    get extra() {
      return BEC.D0.plusEffectOf(TimeStudy(131)).clampMin(0).plus(PelleRifts.decay.milestones[2].effectOrDefault(0));
    }

    bulkPurchaseCalc() {
      // Copypasted constants
      const logBase = new BE(170);
      const logBaseIncrease = EternityChallenge(6).isRunning ? BEC.D2 : new BE(25);
      const logCostScaling = EternityChallenge(6).isRunning ? BEC.D2 : BEC.D5;
      const distantReplicatedGalaxyStart = Effects.sum(GlyphSacrifice.replication).add(100);
      const remoteReplicatedGalaxyStart = Effects.sum(GlyphSacrifice.replication).add(1000);
      const logDistantScaling = new BE(50);
      const logRemoteScaling = BEC.D5;

      const cur = Currency.infinityPoints.value.times(TimeStudy(233).effectOrDefault(1)).log10();

      if (logBase.gt(cur)) return;
      let a = logCostScaling.div(2);
      let b = logBaseIncrease.sub(logCostScaling.div(2));
      let c = logBase.sub(cur);
      if (decimalQuadraticSolution(a, b, c).floor().lte(distantReplicatedGalaxyStart)) {
        // eslint-disable-next-line consistent-return
        return decimalQuadraticSolution(a, b, c).floor();
      }
      a = logCostScaling.add(logDistantScaling).div(2);
      // eslint-disable-next-line max-len
      b = logBaseIncrease.sub(logCostScaling.div(2)).sub(logDistantScaling.times(distantReplicatedGalaxyStart)).add(logDistantScaling.times(4.5));
      // eslint-disable-next-line max-len
      c = cur.neg().add(170).add(distantReplicatedGalaxyStart.pow(2).times(logDistantScaling).div(2)).sub(distantReplicatedGalaxyStart.times(4.5).times(logDistantScaling));
      if (decimalQuadraticSolution(a, b, c).floor().lte(remoteReplicatedGalaxyStart)) {
        // eslint-disable-next-line consistent-return
        return decimalQuadraticSolution(a, b, c).floor();
      }
      a = logRemoteScaling.div(3);

      b = logCostScaling.div(2).add(logDistantScaling.div(2)).sub(logRemoteScaling.mul(remoteReplicatedGalaxyStart))
        .add(logRemoteScaling.div(2));

      c = logBaseIncrease.sub(logCostScaling.div(2)).sub(distantReplicatedGalaxyStart.times(logDistantScaling))
        .add(logDistantScaling.times(4.5)).add(remoteReplicatedGalaxyStart.mul(logRemoteScaling));

      const d = cur.neg().add(170).add(distantReplicatedGalaxyStart.pow(2).mul(logDistantScaling).div(2))
        .sub(distantReplicatedGalaxyStart.mul(4.5).mul(logDistantScaling))
        .sub(logRemoteScaling.pow(3).mul(remoteReplicatedGalaxyStart).div(3))
        .add(logRemoteScaling.pow(2).mul(remoteReplicatedGalaxyStart).div(2))
        .sub(logRemoteScaling.mul(remoteReplicatedGalaxyStart).div(6));

      // eslint-disable-next-line consistent-return
      return decimalCubicSolution(a, b, c, d, false).floor();
    }

    autobuyerTick() {
      // This isn't a hot enough autobuyer to worry about doing an actual inverse.
      const bulk = this.bulkPurchaseCalc();
      if (!bulk || bulk.floor().sub(this.value).lte(0)) return;
      Currency.infinityPoints.subtract(this.baseCostAfterCount(this.value).sub(1));
      this.value = this.value.add(bulk);
      this.baseCost = this.baseCostAfterCount(this.value);
    }

    baseCostAfterCount(count) {
      const logBase = new BE(170);
      const logBaseIncrease = EternityChallenge(6).isRunning ? 2 : 25;
      const logCostScaling = EternityChallenge(6).isRunning ? 2 : 5;
      const distantReplicatedGalaxyStart = Effects.sum(GlyphSacrifice.replication).add(100);
      const remoteReplicatedGalaxyStart = Effects.sum(GlyphSacrifice.replication).add(1000);
      let logCost = logBase.add(count.times(logBaseIncrease))
        .add((count.times(count.sub(1)).div(2)).times(logCostScaling));
      if (count.gt(distantReplicatedGalaxyStart)) {
        const logDistantScaling = new BE(50);
        // When distant scaling kicks in, the price increase jumps by a few extra steps.
        // So, the difference between successive scales goes 5, 5, 5, 255, 55, 55, ...
        const numDistant = count.sub(distantReplicatedGalaxyStart);
        logCost = logCost.add(logDistantScaling.times(numDistant).times(numDistant.add(9)).div(2));
      }
      if (count.gt(remoteReplicatedGalaxyStart)) {
        const logRemoteScaling = BEC.D5;
        const numRemote = count.sub(remoteReplicatedGalaxyStart);
        // The formula x * (x + 1) * (2 * x + 1) / 6 is the sum of the first n squares.
        logCost = logCost.add(logRemoteScaling.times(numRemote).times(numRemote.add(1))
          .times(numRemote.times(2).add(1)).div(6));
      }
      return BE.pow10(logCost);
    }
  }(),
};

export const Replicanti = {
  get areUnlocked() {
    return player.replicanti.unl;
  },
  reset(force = false) {
    const unlocked = force ? false : EternityMilestone.unlockReplicanti.isReached;
    player.replicanti = {
      unl: unlocked,
      amount: unlocked ? BEC.D1 : BEC.D0,
      timer: BEC.D0,
      chance: BEC.D0_01,
      chanceCost: BEC.E150,
      interval: BEC.E3,
      intervalCost: BEC.E140,
      boughtGalaxyCap: BEC.D0,
      galaxies: BEC.D0,
      galCost: BEC.E170,
      cooldownTime: BEC.E3
    };
  },
  unlock(freeUnlock = false) {
    if (player.replicanti.unl) return;
    if (freeUnlock || LC3.isCompleted) {
      player.replicanti.unl = true;
      player.replicanti.timer = BEC.D0;
      Replicanti.amount = BEC.D1;
    }
  },
  get amount() {
    return BE.fromBE(player.replicanti.amount);
  },
  set amount(value) {
    player.replicanti.amount = value;
  },
  get chance() {
    return ReplicantiUpgrade.chance.value;
  },
  galaxies: {
    isPlayerHoldingR: false,
    get bought() {
      return player.replicanti.galaxies;
    },
    get extra() {
      return BE.floor(Effarig.bonusRG.add(Effects.sum(
        TimeStudy(225),
        TimeStudy(226)
      )).times(TimeStudy(303).effectOrDefault(1)));
    },
    get total() {
      return this.bought.add(this.extra);
    },
    get max() {
      return ReplicantiUpgrade.galaxies.value.add(ReplicantiUpgrade.galaxies.extra);
    },
    get canBuyMore() {
      if (!Replicanti.amount.gte(BE.NUMBER_MAX_VALUE)) return false;
      return this.bought.lt(this.max);
    },
    get areBeingBought() {
      const buyer = Autobuyer.replicantiGalaxy;
      // If the confirmation is enabled, we presume the player wants to confirm each Replicanti Galaxy purchase
      return (buyer.canTick && buyer.isEnabled) ||
        (!player.options.confirmations.replicantiGalaxy && this.isPlayerHoldingR);
    },
    get gain() {
      if (!this.canBuyMore) return BEC.D0;
      if (Achievement(126).isUnlocked) {
        const maxGain = Replicanti.galaxies.max.sub(player.replicanti.galaxies);
        const logReplicanti = Replicanti.amount.log10();
        return logReplicanti.div(LOG10_MAX_VALUE).floor().clampMax(maxGain);
      }
      return BEC.D1;
    },
  },
  get isUncapped() {
    return TimeStudy(40).isBought || PelleRifts.vacuum.milestones[1].canBeApplied;
  },
  get autoreplicateUnlocked() {
    return LogicChallenge(7).isCompleted;
  },
  get cooldownTime() {
    return player.replicanti.cooldownTime;
  }
};

export const ReplicantiBoost = {
  get amount() {
    return player.replicanti.boosts;
  },
  set amount(value) {
    player.replicanti.boosts = value;
  },
  get boost() {
    return BE.pow(this.amount + 1, 2).times(BE.pow(2, this.amount));
  },
  get cost() {
    const costs = [128, 1e10, 1e100, 1e308];
    if (this.amount <= 3) {
      return new BE(costs[this.amount]);
    } else {
      return BEC.E308.pow(BE.pow(this.amount - 2, 2));
    }
  },
  purchase() {
    if (Replicanti.amount.lt(this.cost)) return;
    ++this.amount;
  }
}