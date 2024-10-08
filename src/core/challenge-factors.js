import { GameMechanicState } from "./game-mechanics/index.js";
import { BEC } from "./constants.js";
// import { deepmergeAll } from "../utility/deepmerge.js"

class ChallengeFactorState extends GameMechanicState {
  constructor(config) {
    const configCopy = { ...config };
    const effect = config.effect;
    if (effect) {
      configCopy.effect = () => effect(this.level);
    }
    super(configCopy);
    this._cost = new Lazy(() => this.costAt(this.level));
    this._level = new Lazy(() => this.levelAt(Currency.timeCores.value));

    this._cost.invalidateOn(GAME_EVENT.TIME_CORE_CHANGED);
    this._level.invalidateOn(GAME_EVENT.TIME_CORE_CHANGED);
  }

  get baseCost() {
    return this.config.baseCost;
  }

  get costMultiplier() {
    return this.config.costMultiplier;
  }

  get displayLevel() {
    return formatInt(this.level + 1);
  }

  get cost() {
    return this._cost.value;
  }

  get levelCap() {
    return this.config.levelCap ?? Number.MAX_VALUE;
  }

  get levelCapped() {
    return this.level >= this.levelCap;
  }

  // UI only
  costAt(level) {
    if (this.levelCapped) return null;
    return BE.pow(this.costMultiplier, level).times(this.baseCost);
  }

  levelAt(tc) {
    if (this.levelCap === 0 || tc.lt(this.baseCost)) return 0;
    return tc.div(this.baseCost).ln().div(BE.ln(this.costMultiplier)).add(1).floor().toNumberMax(this.levelCap);
  }

  get isActive() {
    return (player.challengeFactorBits & (1 << this.id)) !== 0;
  }

  get isEffectActive() {
    return this.isActive;
  }

  get name() {
    return this.config.name;
  }

  get difficulty() {
    const diff = this.config.difficulty;
    if (typeof diff === "function") return diff(this.level);
    return diff;
  }

  get isPositive() {
    const diff = this.config.difficulty;
    // Currency is not defined.
    if (typeof diff === "function") return diff(0) > 0;
    return diff > 0;
  }

  get level() {
    return this._level.value;
  }

  get description() {
    const effect = this.config.effect ? this.effectValue : 0;
    return this.config.description(effect);
  }
};

export const ChallengeFactor = mapGameDataToObject(
  GameDatabase.logic.challengeFactors,
  config => new ChallengeFactorState(config)
);

export const ChallengeFactors = {
  all: ChallengeFactor.all,

  positiveDifficulties: ChallengeFactor.all.filter(f => f.isPositive),

  negativeDifficulties: ChallengeFactor.all.filter(f => !f.isPositive),

  _current: new Lazy(() => {
    const result = [];
    let bitLeft = player.challengeFactorBits;
    for (const factor of ChallengeFactors.all) {
      if (factor.isActive) {
        result.push(factor);
        bitLeft &= ~(1 << factor.id);
      }
      if (bitLeft === 0) break;
    };
    return result;
  }),

  get current() {
    return this._current.value;
  },

  calculateDifficulty(factors) {
    if (factors.length === 0) return 0;
    return factors.map(f => f.difficulty).sum() / this.current.length;
  },

  get currentDifficulty() {
    return this.calculateDifficulty(this.current);
  },

  tdMultAt(x) {
    return BEC.D2.pow(x.sqrt()).clampMax(BEC.E3).add(x.pow(2).div(25));
  },

  get tdMult() {
    return this.tdMultAt(Currency.timeCores.value);
  },

  get refreshPeriod() {
    // 5 hours
    return 1.8e7 * ReduceRefreshTimeUpgrade.effectValue;
  },

  get canRefresh() {
    return player.logic.refreshTimer === this.refreshPeriod;
  },

  get canRestart() {
    return Player.canEternity; // || gainedTimeCores().gte(this.requirement) || player.refreshChallenge;
  },

  // real diff
  tick(diff) {
    if (!PlayerProgress.eternityUnlocked() || this.canRefresh) return;
    if (player.refreshChallenge) {
      throw new Error(":think:");
    }
    player.logic.refreshTimer = Math.min(diff + player.logic.refreshTimer, this.refreshPeriod);
  },

  get requirement() {
    return GameCache.timeCoresFactor.value.fromChallengeFactor.clampMin(BEC.D0_5).div(BEC.D3).times(Math.clampMax(Math.pow(player.eternitiesBeforeRefresh + 1, 0.8), 100));
  }
}

export function timeCoresFactor() { 
  const ncCount = NormalChallenges.completions;
  const icCount = InfinityChallenges.completions;
  const lcCount = LogicChallenges.completions;

  const fromChallenge = 0.5 * Math.pow(ncCount, 0.2) + 0.5 * Math.pow(icCount, 0.6) + 0.75 * Math.pow(lcCount, 0.8) + 1;

  const totalLP = player.records.thisEternity.maxLP;
  const fromLP = totalLP.log10().pow(0.5).add(1);

  const difficulty = ChallengeFactors.currentDifficulty;
  const fromChallengeFactor = BE.pow(1.1, difficulty);

  const staticDivisor = 1 / 10;

  return { fromChallenge, fromLP, fromChallengeFactor, staticDivisor };
}

export function getGainedTimeCores() {
  return Object.values(GameCache.timeCoresFactor.value).reduce(BE.prodReducer);
}

export function gainedTimeCores() {
  return GameCache.gainedTimeCores.value;
}

function random() {
  if (player.logic.seed === 0) {
    player.logic.seed = player.logic.initialSeed;
  }

  const state = xorshift32Update(player.logic.seed);
  player.logic.seed = state;
  return state * 2.3283064365386963e-10 + 0.5;
}

function randomInArray(array) {
  const idx = Math.floor(random() * array.length);
  const result = array[idx];
  array.splice(idx, 1);
  return result;
}

function randomFactor() {
  let bits = 0;
  let amount = Math.clampMax(Math.floor(-Math.log(1 - random()) / Math.log(1.5)) + 2, ChallengeFactors.all.length);

  let difficulty = 0;

  const all = ChallengeFactors.all.slice();
  const negatives = ChallengeFactors.negativeDifficulties.slice();
  const positives = ChallengeFactors.positiveDifficulties.slice();
  while (amount > 0) {
    let factor;
    if (difficulty < 0 && positives.length > 0) {
      factor = randomInArray(positives);
    } else if (difficulty > 0 && negatives.length > 0) {
      factor = randomInArray(negatives);
    } else if (all.length > 0) {
      factor = randomInArray(all);
    } else {
      throw `[randomFactorError] Too many factors`;
    }

    bits |= (1 << factor.id);
    difficulty += factor.difficulty;
    --amount;
  }
  return bits;
}

export const ChallengeFactorHandler = {
  _comingFactorBits: 0,

  get canRefresh() {
    return player.refreshChallenge;
  },

  updateHandler() {
    if (!this.canRefresh) {
      this._comingFactorBits = player.challengeFactorBits;
    } else {
      this._comingFactorBits = randomFactor();
    }
  },

  updatePlayer() {
    if (this._comingFactorBits === player.challengeFactorBits) return;
    player.challengeFactorBits = this._comingFactorBits
    player.logic.refreshTimer = 0;
    player.refreshChallenge = false;
    ChallengeFactors._current.invalidate();
    HalfRefreshTimeUpgrade.boughtAmount = 0;
    player.eternitiesBeforeRefresh = 0;
    EventHub.dispatch(GAME_EVENT.CHALLENGE_FACTOR_CHANGED);
    this._comingFactorBits = 0;
  }
}

class RefreshTimeUpgradeState extends GameMechanicState {
  constructor() {
    super({});
    this._cost = new Lazy(() => this.costAfterCount(this.boughtAmount));
  }

  costAfterCount(x) {
    throw new NotImplementedError();
  }

  get cost() {
    return this._cost.value;
  }

  /**
   * @abstract
   */
  get boughtAmount() {
    throw new NotImplementedError();
  }

  /**
   * @abstract
   */
  set boughtAmount(value) {
    throw new NotImplementedError();
  }

  get isCustomEffect() { return true; }

  get isAffordable() {
    return Currency.timeCores.gte(this.cost) && this.isAvailableForPurchase;
  }

  purchase() {
    if (!this.isAffordable) return;
    Currency.timeCores.subtract(this.cost);
    this.boughtAmount++;
    this.onPurchased();
  }

  get description() {
    throw new NotImplementedError();
  }

  get isAvailableForPurchase() {
    return true;
  }

  onPurchased() {}
}

class ReduceRefreshTimeUpgradeState extends RefreshTimeUpgradeState {
  costAfterCount(x) {
    return 30 + x * (x + 1) * (2 * x + 1);
  }

  get boughtAmount() {
    return player.logic.upgrades.reduce;
  }

  set boughtAmount(value) {
    player.logic.upgrades.reduce = value;
    this._cost.invalidate();
  }

  get description() {
    return `${formatPercents(0.15)} smaller interval (Permanent)`;
  }

  get effectValue() {
     return Math.pow(0.85, this.boughtAmount);
  }

  get showEffect() { return true; }
}

class HalfRefreshTimeUpgradeState extends RefreshTimeUpgradeState {
  costAfterCount(x) {
    return (5 + x * (x + 1) * (2 * x + 1) / 6) * (ReduceRefreshTimeUpgrade.boughtAmount + 1);
  }

  get boughtAmount() {
    return player.logic.upgrades.half;
  }

  set boughtAmount(value) {
    player.logic.upgrades.half = value;
    this._cost.invalidate();
    HalfRefreshTimeUpgrade._cost.invalidate();
  }

  get description() {
    return `${formatPercents(0.5)} smaller interval`;
  }

  get showEffect() { return false; }

  onPurchased() {
    player.logic.refreshTimer += (ChallengeFactors.refreshPeriod - player.logic.refreshTimer) * 0.5;
  }

  get isAvailableForPurchase() {
    return !ChallengeFactors.canRefresh;
  }
}

export const ReduceRefreshTimeUpgrade = new ReduceRefreshTimeUpgradeState();
export const HalfRefreshTimeUpgrade = new HalfRefreshTimeUpgradeState();