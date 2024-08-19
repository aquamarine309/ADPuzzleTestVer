import { BEC } from "./constants.js";
import FullScreenAnimationHandler from "./full-screen-animation-handler.js";

export function bigCrunchAnimation() {
  FullScreenAnimationHandler.display("a-implode", 2);
}

function handleChallengeCompletion(enteringAntimatterChallenge) {
  const challenge = Player.antimatterChallenge;
  if (!challenge && !NormalChallenge(1).isCompleted) {
    NormalChallenge(1).complete();
  }

  const inLC = LogicChallenge.isRunning;
  if (!challenge && !inLC) return;

  // Clear the IC notification after the first completion (only) so that it can show it again for the next one
  const inIC = InfinityChallenge.isRunning;
  if (inIC && !InfinityChallenge.current.isCompleted) TabNotification.ICUnlock.clearTrigger();
  if (inLC && !enteringAntimatterChallenge) {
    const currentLC = LogicChallenge.current;
    if (currentLC.canComplete) {
      if (!currentLC.isCompleted) {
        currentLC.complete();
      } else {
        EventHub.dispatch(GAME_EVENT.LOGIC_CHALLENGE_COMPLETED, currentLC.id);
      }
      currentLC.updateChallengeTime();
      if (!player.options.retryChallenge) {
        player.challenge.logic.current = 0;
      }
    }
  }

  if (challenge) {
    challenge.complete();
    challenge.updateChallengeTime();
  }

  if (!player.options.retryChallenge) {
    player.challenge.normal.current = 0;
    player.challenge.infinity.current = 0;
  }

}

export function manualBigCrunchResetRequest() {
  if (!Player.canCrunch) return;
  if (GameEnd.creditsEverClosed) return;
  // We show the modal under two conditions - on the first ever infinity (to explain the mechanic) and
  // post-break (to show total IP and infinities gained)
  if (player.options.confirmations.bigCrunch && (!PlayerProgress.infinityUnlocked() || player.break)) {
    Modal.bigCrunch.show();
  } else {
    bigCrunchResetRequest();
  }
}

export function bigCrunchResetRequest(disableAnimation = false) {
  if (!Player.canCrunch) return;
  if (!disableAnimation && player.options.animations.bigCrunch && !FullScreenAnimationHandler.isDisplaying) {
    bigCrunchAnimation();
    setTimeout(bigCrunchReset, 1000);
  } else {
    bigCrunchReset();
  }
}

export function bigCrunchReset(
  forced = false,
  enteringAntimatterChallenge = Player.isInAntimatterChallenge && player.options.retryChallenge
) {
  if (!forced && !Player.canCrunch) return;

  if (Player.canCrunch) {
    EventHub.dispatch(GAME_EVENT.BIG_CRUNCH_BEFORE);
    bigCrunchGiveRewards(enteringAntimatterChallenge);
    if (Pelle.isDoomed) PelleStrikes.infinity.trigger();
  }

  bigCrunchResetValues(enteringAntimatterChallenge);

  GameCache.currentBonus.invalidate();
  EventHub.dispatch(GAME_EVENT.BIG_CRUNCH_AFTER);
}

function bigCrunchGiveRewards(enteringAntimatterChallenge) {
  bigCrunchUpdateStatistics();

  const infinityPoints = gainedInfinityPoints();
  Currency.infinityPoints.add(infinityPoints);
  Currency.infinities.add(gainedInfinities().round());
  ++player.bigCrunches;

  bigCrunchTabChange(!PlayerProgress.infinityUnlocked(), enteringAntimatterChallenge);

  bigCrunchCheckUnlocks();
}

function bigCrunchUpdateStatistics() {
  player.records.bestInfinity.bestIPminEternity =
    player.records.bestInfinity.bestIPminEternity.clampMin(player.records.thisInfinity.bestIPmin);
  player.records.thisInfinity.bestIPmin = BEC.D0;

  player.records.thisEternity.bestInfinitiesPerMs = player.records.thisEternity.bestInfinitiesPerMs.clampMin(
    gainedInfinities().round().dividedBy(Math.clampMin(33, player.records.thisInfinity.realTime))
  );

  const infinityPoints = gainedInfinityPoints();

  addInfinityTime(
    player.records.thisInfinity.time,
    player.records.thisInfinity.realTime,
    infinityPoints,
    gainedInfinities().round()
  );

  player.records.bestInfinity.time =
    BE.min(player.records.bestInfinity.time, player.records.thisInfinity.time);
  player.records.bestInfinity.realTime =
    Math.min(player.records.bestInfinity.realTime, player.records.thisInfinity.realTime);

  player.requirementChecks.reality.noInfinities = false;

  if (!player.requirementChecks.infinity.maxAll) {
    const bestIpPerMsWithoutMaxAll = infinityPoints.dividedBy(Math.clampMin(33, player.records.thisInfinity.realTime));
    player.records.thisEternity.bestIPMsWithoutMaxAll =
      BE.max(bestIpPerMsWithoutMaxAll, player.records.thisEternity.bestIPMsWithoutMaxAll);
  }
}

function bigCrunchTabChange(firstInfinity, enteringAntimatterChallenge) {
  const earlyGame = player.records.bestInfinity.time.gt(60000) && !player.break;
  const inAntimatterChallenge = Player.isInAntimatterChallenge;
  handleChallengeCompletion(enteringAntimatterChallenge);

  if (firstInfinity) {
    Tab.infinity.upgrades.show();
  } else if (earlyGame || (inAntimatterChallenge && !player.options.retryChallenge)) {
    Tab.dimensions.antimatter.show();
  }
}

export function bigCrunchResetValues(enteringAntimatterChallenge) {
  const currentReplicanti = Replicanti.amount;
  const currentReplicantiGalaxies = player.replicanti.galaxies;
  // For unknown reasons, everything but keeping of RGs (including resetting of RGs)
  // is done in the function called below. For now, we're just trying to keep
  // code structure similar to what it was before to avoid new bugs.
  secondSoftReset(enteringAntimatterChallenge);

  let remainingGalaxies = BEC.D0;
  if (Achievement(95).isUnlocked && !Pelle.isDoomed) {
    Replicanti.amount = currentReplicanti;
    remainingGalaxies = remainingGalaxies.add(currentReplicantiGalaxies.min(1));
  }
  if (TimeStudy(33).isBought && !Pelle.isDoomed) {
    remainingGalaxies = remainingGalaxies.add(currentReplicantiGalaxies.div(2).floor());
  }

  if (PelleUpgrade.replicantiGalaxyNoReset.canBeApplied) {
    remainingGalaxies = currentReplicantiGalaxies;
  }
  // I don't think this Math.clampMax is technically needed, but if we add another source
  // of keeping Replicanti Galaxies then it might be.
  player.replicanti.galaxies = BE.clampMax(remainingGalaxies, currentReplicantiGalaxies);
  if (!LogicUpgrade(9).isBought) {
    resetAllResourceExchange();
  }
}

function bigCrunchCheckUnlocks() {
  if (EternityChallenge(4).tryFail()) return;

  if (Effarig.isRunning && !EffarigUnlock.infinity.isUnlocked) {
    EffarigUnlock.infinity.unlock();
    beginProcessReality(getRealityProps(true));
  }
}

export function secondSoftReset(enteringAntimatterChallenge) {
  player.dimensionBoosts = BEC.D0;
  player.galaxies = BEC.D0;
  player.records.thisInfinity.maxAM = BEC.D0;
  Currency.antimatter.reset();
  LC3.reset();
  softReset(0, true, true, enteringAntimatterChallenge);
  InfinityDimensions.resetAmount();
  if (player.replicanti.unl) Replicanti.amount = BEC.D1;
  player.replicanti.galaxies = BEC.D0;
  player.records.thisInfinity.time = BEC.D0;
  player.records.thisInfinity.lastBuyTime = BEC.D0;
  player.records.thisInfinity.realTime = 0;
  player.crunchPunishment.this = player.crunchPunishment.next;
  player.crunchPunishment.next = false;
  Player.resetRequirements("infinity");
  AchievementTimers.marathon2.reset();
}

export function preProductionGenerateIP(diff) {
  if (InfinityUpgrade.ipGen.isBought) {
    const genPeriod = Time.bestInfinity.totalMilliseconds.times(10);
    let genCount;
    if (diff.gte(genPeriod.times(BEC.E300))) {
      genCount = BE.div(diff, genPeriod);
    } else {
      // Partial progress (fractions from 0 to 1) are stored in player.partInfinityPoint
      const partInfinityPoint = diff.div(genPeriod).plus(player.partInfinityPoint);
      genCount = partInfinityPoint.floor();
      player.partInfinityPoint = partInfinityPoint.minus(genCount).toNumber();
    }
    let gainedPerGen = player.records.bestInfinity.time.gte(BE.NUMBER_MAX_VALUE) ? BEC.D0 : InfinityUpgrade.ipGen.effectValue;
    if (Laitela.isRunning) gainedPerGen = dilatedValueOf(gainedPerGen);
    const gainedThisTick = genCount.times(gainedPerGen);
    Currency.infinityPoints.add(gainedThisTick);
  }
  Currency.infinityPoints.add(BreakInfinityUpgrade.ipGen.effectOrDefault(BEC.D0).times(diff.div(60000)));
}
