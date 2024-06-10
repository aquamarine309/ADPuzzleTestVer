import { GameMechanicState } from "./game-mechanics/index.js";
import { DC } from "./constants.js";

class ResourceExchangeState extends GameMechanicState {
  get currency() {
    return this.config.currency();
  }
  
  get data() {
    return player.logic.resourceExchange.all[this.id];
  }
  
  get exchangeRate() {
    return 1;
  }
  
  get valueFn() {
    return this.config.value;
  }
  
  get min() {
    return this.config.min ?? DC.D0;
  }
  
  get isTooSmall() {
    return this.newExchanged.minus(this.exchangedAmount).lt(1e-3);
  }
  
  get canExchange() {
    return this.isUnlocked && this.currency.gt(this.min) && !this.isTooSmall;
  }
  
  exchange() {
    if (!this.canExchange) return false;
    const leave = this.willLeave;
    this.data.value = this.newExchanged;
    this.currency.value = leave;
    GameCache.logicPoints.invalidate();
    return true;
  }
  
  get willLeave() {
    return this.currency.value.times(1 - this.exchangeRate).clampMin(this.min);
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
    return this.isUnlocked ? this.config.symbol : "?";
  }
  
  get name() {
    return this.config.name;
  }
  
  get shortName() {
    return this.config.shortName;
  }
  
  reset() {
    this.data.value = DC.D0;
  }
}

export const ResourceExchange = mapGameDataToObject(
  GameDatabase.logic.resourceExchange, 
  config => new ResourceExchangeState(config)
);

export function getLogicPoints() {
  return ResourceExchange.all.map(r => r.value).reduce(Decimal.prodReducer);
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
    return Decimal.pow10(1 + 10 * count + (Math.pow(20, count)) / 15).div(2);
  }
  
  purchase() {
    if (!this.isAffordable) return;
    this.currency.subtract(this.cost);
    ++this.boughtAmount;
  }
  
  get effectValue() {
    return DC.E5.pow(Math.pow(this.boughtAmount + 1, Math.log10(GameCache.logicPoints.value.add(1).log10() + 1) + 1));
  }
  
  get isEffectActive() {
    return PlayerProgress.infinityUnlocked();
  }
}

export const ResourceExchangeUpgrade = new ResourceExchangeUpgradeState();

export function resetAllResourceExchange() {
  ResourceExchange.all.forEach(r => r.reset());
  GameCache.logicPoints.invalidate();
}