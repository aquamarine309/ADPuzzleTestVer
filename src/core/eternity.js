import { GameMechanicState, SetPurchasableMechanicState } from "./game-mechanics/index.js";
import { BEC } from "./constants.js";
import FullScreenAnimationHandler from "./full-screen-animation-handler.js";

function giveEternityRewards(auto) {
  player.records.bestEternity.time = BE.min(player.records.thisEternity.time, player.records.bestEternity.time);
  Currency.eternityPoints.add(gainedEternityPoints());

  const newEternities = gainedEternities();

  if (Currency.eternities.eq(0) && newEternities.lte(10)) {
    Tab.dimensions.time.show();
  }

  Currency.eternities.add(newEternities);
  ++player.bigEternities;

  if (EternityChallenge.isRunning) {
    const challenge = EternityChallenge.current;
    challenge.addCompletion(false);
    if (Perk.studyECBulk.isBought) {
      let completionCount = 0;
      while (!challenge.isFullyCompleted && challenge.canBeCompleted) {
        challenge.addCompletion(false);
        completionCount++;
      }
      AutomatorData.lastECCompletionCount = completionCount;
      if (Enslaved.isRunning && completionCount > 5) EnslavedProgress.ec1.giveProgress();
    }
    player.challenge.eternity.requirementBits &= ~(1 << challenge.id);
    respecTimeStudies(auto);
  }

  addEternityTime(
    player.records.thisEternity.time,
    player.records.thisEternity.realTime,
    gainedEternityPoints(),
    newEternities
  );

  player.records.thisReality.bestEternitiesPerMs = player.records.thisReality.bestEternitiesPerMs.clampMin(
    newEternities.div(Math.clampMin(33, player.records.thisEternity.realTime))
  );
  player.records.bestEternity.bestEPminReality =
    player.records.bestEternity.bestEPminReality.max(player.records.thisEternity.bestEPmin);

  Currency.infinitiesBanked.value = Currency.infinitiesBanked.value.plusEffectsOf(
    Achievement(131).effects.bankedInfinitiesGain,
    TimeStudy(191)
  );

  if (Effarig.isRunning && !EffarigUnlock.eternity.isUnlocked) {
    EffarigUnlock.eternity.unlock();
    beginProcessReality(getRealityProps(true));
  }
}

export function eternityAnimation() {
  FullScreenAnimationHandler.display("a-eternify", 3);
}

export function eternityResetRequest() {
  if (!Player.canEternity) return;
  if (GameEnd.creditsEverClosed) return;
  askEternityConfirmation();
}

export function eternity(force, auto, specialConditions = {}) {
  if (specialConditions.switchingDilation && !Player.canEternity) {
    // eslint-disable-next-line no-param-reassign
    force = true;
  }
  // We define this variable so we can use it in checking whether to give
  // the secret achievement for respec without studies.
  // Annoyingly, we need to check for studies right here; giveEternityRewards removes studies if we're in an EC,
  // so doing the check later doesn't give us the initial state of having studies or not.
  const noStudies = player.timestudy.studies.length === 0;
  
  ChallengeFactorHandler.updateHandler();
  
  if (!force) {
    if (!Player.canEternity) return false;
    if (RealityUpgrade(10).isLockingMechanics) {
      RealityUpgrade(10).tryShowWarningModal();
      return false;
    }
    if (RealityUpgrade(12).isLockingMechanics && EternityChallenge(1).isRunning) {
      RealityUpgrade(12).tryShowWarningModal();
      return false;
    }
    EventHub.dispatch(GAME_EVENT.ETERNITY_RESET_BEFORE);
    giveEternityRewards(auto);
    player.requirementChecks.reality.noEternities = false;
  }
  
  Currency.timeCores.add(gainedTimeCores());

  if (player.dilation.active) rewardTP();

  // This needs to be after the dilation check for the "can gain TP" check in rewardTP to be correct.
  if (force) {
    player.challenge.eternity.current = 0;
  }
  
  initializeChallengeCompletions();
  initializeResourcesAfterEternity();

  if (!EternityMilestone.keepAutobuyers.isReached && !(Pelle.isDoomed && PelleUpgrade.keepAutobuyers.canBeApplied)) {
    // Fix infinity because it can only break after big crunch autobuyer interval is maxed
    player.break = false;
  }

  player.challenge.eternity.current = 0;
  if (!specialConditions.enteringEC && !Pelle.isDoomed) {
    player.dilation.active = false;
  }
  resetInfinityRuns();
  InfinityDimensions.fullReset();
  Replicanti.reset();
  resetChallengeStuff();
  AntimatterDimensions.reset();
  LogicUpgrades.reset();

  if (!specialConditions.enteringEC && player.respec) {
    if (noStudies) {
      SecretAchievement(34).unlock();
    }
    respecTimeStudies(auto);
    player.respec = false;
  }

  Currency.infinityPoints.reset();
  InfinityDimensions.resetAmount();
  player.records.thisInfinity.bestIPmin = BEC.D0;
  player.records.bestInfinity.bestIPminEternity = BEC.D0;
  player.records.thisEternity.bestEPmin = BEC.D0;
  player.records.thisEternity.maxLP = BEC.D1;
  player.records.thisEternity.bestInfinitiesPerMs = BEC.D0;
  player.records.thisEternity.bestIPMsWithoutMaxAll = BEC.D0;
  resetTimeDimensions();
  resetTickspeed();
  playerInfinityUpgradesOnReset();
  AchievementTimers.marathon2.reset();
  applyEU1();
  player.records.thisInfinity.maxAM = BEC.D0;
  player.records.thisEternity.maxAM = BEC.D0;
  Currency.antimatter.reset();
  ECTimeStudyState.invalidateCachedRequirements();
  resetAllResourceExchange();
  ResourceExchangeUpgrade.reset();

  PelleStrikes.eternity.trigger();
  
  GameCache.currentBonus.invalidate();
  ChallengeFactorHandler.updatePlayer();
  
  EventHub.dispatch(GAME_EVENT.ETERNITY_RESET_AFTER);
  return true;
}

// eslint-disable-next-line no-empty-function
export function animateAndEternity(callback) {
  if (!Player.canEternity) return false;
  const hasAnimation = !FullScreenAnimationHandler.isDisplaying &&
    !RealityUpgrade(10).isLockingMechanics &&
    !(RealityUpgrade(12).isLockingMechanics && EternityChallenge(1).isRunning) &&
    ((player.dilation.active && player.options.animations.dilation) ||
    (!player.dilation.active && player.options.animations.eternity));

  if (hasAnimation) {
    if (player.dilation.active) {
      animateAndUndilate(callback);
    } else {
      eternityAnimation();
      setTimeout(() => {
        eternity();
        if (callback) callback();
      }, 2250);
    }
  } else {
    eternity();
    if (callback) callback();
  }
  return hasAnimation;
}

export function initializeChallengeCompletions(isReality) {
  NormalChallenges.clearCompletions();
  if (!PelleUpgrade.keepInfinityChallenges.canBeApplied) InfinityChallenges.clearCompletions();
  LogicChallenges.clearCompletions();
  if (!isReality && EternityMilestone.keepAutobuyers.isReached || Pelle.isDoomed) {
    NormalChallenges.completeAll();
  }
  if (Achievement(133).isUnlocked && !Pelle.isDoomed) InfinityChallenges.completeAll();
  player.challenge.normal.current = 0;
  player.challenge.infinity.current = 0;
  if (player.challenge.logic.current === 10) GameCache.dimensionMultDecrease.invalidate();
  player.challenge.logic.current = 0;
}

export function initializeResourcesAfterEternity() {
  player.sacrificed = BEC.D0;
  Currency.infinities.reset();
  player.bigCrunches = 0;
  player.records.bestInfinity.time = BE.NUMBER_MAX_VALUE;
  player.records.bestInfinity.realTime = Number.MAX_VALUE;
  player.records.thisInfinity.time = BEC.D0;
  player.records.thisInfinity.lastBuyTime = BEC.D0;
  player.records.thisInfinity.realTime = 0;
  player.dimensionBoosts = (EternityMilestone.keepInfinityUpgrades.isReached) ? BEC.D4 : BEC.D0;
  player.galaxies = (EternityMilestone.keepInfinityUpgrades.isReached) ? BEC.D1 : BEC.D0;
  player.partInfinityPoint = 0;
  player.partInfinitied = 0;
  player.IPMultPurchases = BEC.D0;
  Currency.infinityPower.reset();
  Currency.timeShards.reset();
  player.records.thisEternity.time = BEC.D0;
  player.records.thisEternity.realTime = 0;
  player.totalTickGained = BEC.D0;
  player.eterc8ids = 50;
  player.eterc8repl = 40;
  Player.resetRequirements("eternity");
}

export function applyEU1() {
  if (player.eternityUpgrades.size < 3 && Perk.autounlockEU1.canBeApplied) {
    for (const id of [1, 2, 3]) player.eternityUpgrades.add(id);
  }
}

// We want this to be checked before any EP-related autobuyers trigger, but we need to call this from the autobuyer
// code since those run asynchronously from gameLoop
export function applyEU2() {
  if (player.eternityUpgrades.size < 6 && Perk.autounlockEU2.canBeApplied) {
    const secondRow = EternityUpgrade.all.filter(u => u.id > 3);
    for (const upgrade of secondRow) {
      if (player.eternityPoints.gte(upgrade.cost / 1e10)) player.eternityUpgrades.add(upgrade.id);
    }
  }
}

function askEternityConfirmation() {
  if (player.dilation.active && player.options.confirmations.dilation) {
    Modal.exitDilation.show();
  } else if (player.options.confirmations.eternity) {
    Modal.eternity.show();
  } else {
    animateAndEternity();
  }
}

export function gainedEternities() {
  return Pelle.isDisabled("eternityMults")
    ? new BE(1)
    : new BE(getAdjustedGlyphEffect("timeetermult"))
      .timesEffectsOf(RealityUpgrade(3), Achievement(113))
      .pow(AlchemyResource.eternity.effectValue);
}

export class EternityMilestoneState {
  constructor(config) {
    this.config = config;
  }

  get isReached() {
    if (Pelle.isDoomed && this.config.givenByPelle) {
      return this.config.givenByPelle();
    }
    return Currency.eternities.gte(this.config.eternities);
  }
}
export const EternityMilestone = mapGameDataToObject(
  GameDatabase.eternity.milestones,
  config => (config.isBaseResource
    ? new EternityMilestoneState(config)
    : new EternityMilestoneState(config))
);

class EternityUpgradeState extends SetPurchasableMechanicState {
  get currency() {
    return Currency.eternityPoints;
  }

  get set() {
    return player.eternityUpgrades;
  }
}

class EPMultiplierState extends GameMechanicState {
  constructor() {
    super({});
    this.cachedCost = new Lazy(() => this.costAfterCount(player.epmultUpgrades));
    this.cachedEffectValue = new Lazy(() => BEC.D5.pow(player.epmultUpgrades));
  }

  get isAffordable() {
    return !Pelle.isDoomed && Currency.eternityPoints.gte(this.cost);
  }

  get cost() {
    return this.cachedCost.value;
  }

  get boughtAmount() {
    return player.epmultUpgrades;
  }

  set boughtAmount(value) {
    // Reality resets will make this bump amount negative, causing it to visually appear as 0 even when it isn't.
    // A dev migration fixes bad autobuyer states and this change ensures it doesn't happen again
    const diff = BE.clampMin(value.minus(player.epmultUpgrades), 0);
    player.epmultUpgrades = value;
    this.cachedCost.invalidate();
    this.cachedEffectValue.invalidate();
    Autobuyer.eternity.bumpAmount(BEC.D5.pow(diff));
  }

  get isCustomEffect() {
    return true;
  }

  get effectValue() {
    return this.cachedEffectValue.value;
  }

  purchase() {
    if (!this.isAffordable) return false;
    Currency.eternityPoints.subtract(this.cost);
    this.boughtAmount = this.boughtAmount.plus(1);
    return true;
  }

  buyMax(auto) {
    if (!this.isAffordable) return false;
    if (RealityUpgrade(15).isLockingMechanics) {
      if (!auto) RealityUpgrade(15).tryShowWarningModal();
      return false;
    }
    /* const bulk = bulkBuyBinarySearch(Currency.eternityPoints.value, {
      costFunction: this.costAfterCount,
      cumulative: true,
      firstCost: this.cost,
    }, this.boughtAmount); */
    const multPerUpgrade = [BEC.D50, BEC.E2, BEC.D500, BEC.E3];
    let moneyLeft = Currency.eternityPoints.value;
    const costThresholds = EternityUpgrade.epMult.costIncreaseThresholds;
    let bulk = BEC.D0;
    // Calculate purchases of each part
    for (let i = 0; i < costThresholds.length; i++) {
      const threshold = costThresholds[i];
      // Check if this part has been purchased
      if (BE.pow(multPerUpgrade[i], this.boughtAmount).times(500).gt(threshold)) continue;
      // In the part, cost scaling is linear
      // 500, 2.5e3, 6.25e4 ...
      const scaling = new LinearCostScaling(
        moneyLeft.clampMax(threshold),
        BE.pow(multPerUpgrade[i], this.boughtAmount.add(bulk)).times(500),
        multPerUpgrade[i]
      );
      // If cost is not affordable in this part, it is also affordable in next parts.
      if (scaling.purchases.lte(0) || moneyLeft.lt(scaling.totalCost)) break;

      moneyLeft = moneyLeft.sub(scaling.totalCost);
      bulk = bulk.add(scaling.purchases);
      if (moneyLeft.lt(threshold)) break;
    }
    
    // The cost above e4000 EP is 1000^((x-1334)^1.2+x)*500,
    // It starts at 1333 purchases
    const totalAmount = this.boughtAmount.add(bulk);
    if (totalAmount.gte(1333)) {
      // Solve equation: (x-1334)^1.2+x=k
      const k = moneyLeft.div(500).log(1e3);
      // When k > 1e90, (x-1334)^2-x is equal to 0
      // so x = k^(1 / 1.2)-1334;
      // n - 1334 is equal to n while n is above e75 [n = k^(1 / 1.2)]
      if (k.gte(BEC.E90)) {
        bulk = k.pow(1 / 1.2);
      } else {
        // Newton's method
        const iterations = 6;
        // f(x)=(x-1334)^1.2+x-k
        // f'(x)=1.2*(x-1334)^0.2+1
        // x=x0-f(x0)/f'(x0)
        for (let i = 0; i < iterations; i++) {
          bulk = bulk.minus(bulk.minus(1334).pow(1.2).add(x).minus(k).div(bulk.minus(1334).pow(0.2).times(1.2).add(1)));
        }
        moneyLeft = moneyLeft.minus(bulk.minus(1334).pow(1.2).add(x)).clampMin(0);
        // bulk should subtract the bought amount baecause
        // it will be added to purchases
        bulk = bulk.add(1333).minus(this.boughtAmount).floor();
      }
    }
    
    if (bulk.lte(0)) return false;
    Currency.eternityPoints.value = moneyLeft;
    this.boughtAmount = this.boughtAmount.plus(bulk);
    return true;
  }

  reset() {
    this.boughtAmount = BEC.D0;
  }

  get costIncreaseThresholds() {
    return [BEC.E100, BE.NUMBER_MAX_VALUE, BEC.E1300, BEC.E4000];
  }

  costAfterCount(count) {
    const costThresholds = EternityUpgrade.epMult.costIncreaseThresholds;
    const multPerUpgrade = [BEC.D50, BEC.E2, BEC.D500, BEC.E3];
    for (let i = 0; i < costThresholds.length; i++) {
      const cost = BE.pow(multPerUpgrade[i], count).times(500);
      if (cost.lt(costThresholds[i])) return cost;
    }
    return BEC.E3.pow(count.minus(1334).clampMin(0).pow(1.2).plus(count)).times(500);
  }
}

export const EternityUpgrade = mapGameDataToObject(
  GameDatabase.eternity.upgrades,
  config => new EternityUpgradeState(config)
);

EternityUpgrade.epMult = new EPMultiplierState();
