import { GameMechanicState } from "./game-mechanics/index.js";
import { BEC } from "./constants.js";

class ResourceExchangeState extends GameMechanicState {
  get currency() {
    return this.config.currency();
  }

  get data() {
    return player.logic.resourceExchange.all[this.id];
  }

  get exchangeRate() {
    return this.data.exchangeRate;
  }

  set exchangeRate(value) {
    this.data.exchangeRate = value;
  }

  get rateType() {
    return this.data.rateType;
  }

  set rateType(value) {
    this.data.rateType = value;
  }

  toggleRateType() {
    switch (this.rateType) {
      case PERCENTS_TYPE.NORMAL:
        this.rateType = PERCENTS_TYPE.LOG;
        break;
      case PERCENTS_TYPE.LOG:
        this.rateType = PERCENTS_TYPE.NORMAL;
        break;
    }
  }

  get valueFn() {
    return this.config.value;
  }

  get min() {
    return this.config.min ?? BEC.D0;
  }

  get isTooSmall() {
    return this.newExchanged.minus(this.exchangedAmount).lt(1e-3);
  }

  get canExchange() {
    return this.isUnlocked && this.currency.gt(this.min) && !this.isTooSmall && PlayerProgress.infinityUnlocked();
  }

  exchange() {
    if (!this.canExchange) return false;
    const leave = this.willLeave;
    this.data.value = this.newExchanged;
    this.currency.value = leave;
    GameCache.logicPoints.invalidate();
    player.records.thisEternity.maxLP = BE.max(player.records.thisEternity.maxLP, GameCache.logicPoints.value);
    return true;
  }

  get willLeave() {
    let result = this.currency.value;
    if (this.rateType === PERCENTS_TYPE.NORMAL) {
      result = result.times(1 - this.exchangeRate);
    }
    if (this.rateType === PERCENTS_TYPE.LOG) {
      result = result.minus(result.pow(this.exchangeRate));
    }
    return result.clampMin(this.min);
  }

  get newExchanged() {
    return this.currency.value.minus(this.willLeave).add(this.exchangedAmount);
  }

  get exchangedAmount() {
    return this.data.value;
  }

  get value() {
    return this.valueFn(this.exchangedAmount).clampMin(1);
  }

  get afterExchangeValue() {
    return this.valueFn(this.newExchanged).clampMin(1);
  }

  get requirementLevel() {
    return this.id + 1;
  }

  get isUnlocked() {
    return player.logic.resourceExchange.unlocked >= this.id;
  }

  get symbol() {
    return this.hasUnlocked ? this.config.symbol : "?";
  }

  get name() {
    return this.config.name;
  }

  get shortName() {
    return this.config.shortName;
  }

  reset() {
    this.data.value = BEC.D0;
    this.exchangeRate = 1;
    this.rateType = PERCENTS_TYPE.NORMAL;
    player.logic.resourceExchange.lastOpenId = 0;
  }

  get hasUnlocked() {
    return this.isUnlocked || (this.id < 5 && PlayerProgress.eternityUnlocked());
  }
}

export const ResourceExchange = mapGameDataToObject(
  GameDatabase.logic.resourceExchange, 
  config => new ResourceExchangeState(config)
);

Object.defineProperty(ResourceExchange, "selected", {
  get: function() {
    return this.all[player.logic.resourceExchange.lastOpenId];
  }
});

export function getLogicPoints() {
  return ResourceExchange.all.map(r => r.value).reduce(BE.prodReducer);
}

class ResourceExchangeUpgradeState extends GameMechanicState {
  constructor() {
    super({});
    this.cachedCost = new Lazy(() => this.costAfterCount(this.boughtAmount));
  }

  get cost() {
    return this.cachedCost.value;
  }

  get isAffordable() {
    return this.currency.gte(this.cost);
  }

  get boughtAmount() {
    return player.logic.resourceExchange.unlocked;
  }

  set boughtAmount(value) {
    player.logic.resourceExchange.unlocked = value;
    this.cachedCost.invalidate();
  }

  get level() {
    return this.boughtAmount + 1;
  }

  get currency() {
    return Currency.logicPoints;
  }

  get isCustomEffect() {
    return true;
  }

  costAfterCount(count) {
    return BE.pow10(1 + 10 * count + Math.pow(20, count) / 15).div(2);
  }

  purchase() {
    if (!this.isAffordable) return;
    this.currency.subtract(this.cost);
    ++this.boughtAmount;
    EventHub.dispatch(GAME_EVENT.EXCHANGE_LEVEL_UP);
  }

  get effectValue() {
    let effectivePoints = GameCache.logicPoints.value;
    if (effectivePoints.gte(BEC.E50)) effectivePoints = BEC.E45.times(effectivePoints.pow(0.1));
    return BEC.E5.pow(
      BE.pow(
        this.boughtAmount + 1,
        effectivePoints.add(1).log10().plus(1).log10().plus(1)
      ).timesEffectsOf(
        ChallengeFactor.logicalFallacy,
        GameElement(3)
      )
    );
  }

  get isEffectActive() {
    return PlayerProgress.infinityUnlocked() &&
      !LogicChallenge(5).isRunning;
  }

  reset() {
    this.boughtAmount = 0;
  }
}

export const ResourceExchangeUpgrade = new ResourceExchangeUpgradeState();

export function resetAllResourceExchange() {
  ResourceExchange.all.forEach(r => r.reset());
  GameCache.logicPoints.invalidate();
}