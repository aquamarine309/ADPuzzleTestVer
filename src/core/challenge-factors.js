import { GameMechanicState } from "./game-mechanics/index.js";
import { BEC } from "./constants.js";

class ChallengeFactorState extends GameMechanicState {
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
    return this.config.difficulty;
  }
};

export const ChallengeFactor = mapGameDataToObject(
  GameDatabase.logic.challengeFactors,
  config => new ChallengeFactorState(config)
);

export const ChallengeFactors = {
  all: ChallengeFactor.all,
  
  positiveDifficulties: ChallengeFactor.all.filter(f => f.difficulty > 0),
  
  negativeDifficulties: ChallengeFactor.all.filter(f => f.difficulty < 0),
  
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
    return BEC.D2.pow(x.div(4)).add(1);
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
  
  // real diff
  tick(diff) {
    if (!PlayerProgress.eternityUnlocked() || this.canRefresh) return;
    if (player.refreshChallenge) {
      throw `What are you doing???`;
    }
    player.logic.refreshTimer = Math.min(diff + player.logic.refreshTimer, this.refreshPeriod);
  },
  
  get requirement() {
    return GameCache.timeCoresFactor.value.fromChallengeFactor.div(BEC.D3).times(Math.clampMax(Math.pow(player.eternitiesBeforeRefresh + 1, 0.8), 100));
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
  const fromChallengeFactor = BE.pow(1.25, Math.abs(difficulty));
  
  const staticDivisor = 1 / 10;
  
  return { fromChallenge, fromLP, fromChallengeFactor, staticDivisor };
}

export function gainedTimeCores() {
  return Object.values(GameCache.timeCoresFactor.value).reduce(BE.prodReducer);
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
    return !PlayerProgress.eternityUnlocked() || player.refreshChallenge;
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
  
  get boughtAmount() {
    throw new NotImplementedError();
  }
  
  set boughtAmount(value) {
    throw new NotImplementedError();
  }
  
  get isCustomEffect() { return true; }
  
  get isAffordable() {
    return Currency.timeCores.gte(this.cost);
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
    return `${formatPercents(0.2)} smaller interval (Permanent)`;
  }
  
  get effectValue() {
     return Math.pow(0.8, this.boughtAmount);
  }
  
  get showEffect() { return true; }
}

class HalfRefreshTimeUpgradeState extends RefreshTimeUpgradeState {
  costAfterCount(x) {
    return 5 + x * (x + 1) * (2 * x + 1) / 6;
  }
  
  get boughtAmount() {
    return player.logic.upgrades.half;
  }
  
  set boughtAmount(value) {
    player.logic.upgrades.half = value;
    this._cost.invalidate();
  }
  
  get description() {
    return `${formatPercents(0.6)} smaller interval`;
  }
  
  get showEffect() { return false; }
  
  onPurchased() {
    player.logic.refreshTimer += (ChallengeFactors.refreshPeriod - player.logic.refreshTimer) * 0.6;
  }
}

export const ReduceRefreshTimeUpgrade = new ReduceRefreshTimeUpgradeState();
export const HalfRefreshTimeUpgrade = new HalfRefreshTimeUpgradeState();