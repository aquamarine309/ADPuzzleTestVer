import { BEC } from "./constants.js";
import { GameMechanicState, RebuyableMechanicState } from "./game-mechanics/index.js";

class LogicChallengeRewardState extends GameMechanicState {
  constructor(config, challenge) {
    super(config);
    this._challenge = challenge;
  }

  get isEffectActive() {
    return this._challenge.isCompleted;
  }
}

class LogicChallengeState extends GameMechanicState {
  constructor(config) {
    super(config);
    this._reward = new LogicChallengeRewardState(config.reward, this);
  }

  get isUnlocked() {
    if (this.id === 1) return LogicUpgrade(10).isBought;
    return LogicChallenge(this.id - 1).isCompleted;
  }

  get isRunning() {
    return player.challenge.logic.current === this.id;
  }

  requestStart() {
    if (!this.isUnlocked) return;
    if (GameEnd.creditsEverClosed) return;
    this.start();
  }

  start() {
    if (!this.isUnlocked || this.isRunning) return;
    // Forces big crunch reset but ensures IP gain, if any.
    bigCrunchReset(true, true);
    player.challenge.logic.current = this.id;
    if (!Enslaved.isRunning) Tab.dimensions.antimatter.show();
  }

  get isCompleted() {
    return (player.challenge.logic.completedBits & (1 << this.id)) !== 0;
  }

  complete() {
    player.challenge.logic.completedBits |= 1 << this.id;
    EventHub.dispatch(GAME_EVENT.LOGIC_CHALLENGE_COMPLETED);
  }

  get isEffectActive() {
    return this.isRunning;
  }
  
  get canComplete() {
    return Currency.antimatter.gte(this.goal);
  }

  /**
   * @return {LogicChallengeRewardState}
   */
  get reward() {
    return this._reward;
  }

  get isQuickResettable() {
    return this.config.isQuickResettable ?? false;
  }

  get goal() {
    return this.config.goal;
  }

  updateChallengeTime() {
    const bestTimes = player.challenge.logic.bestTimes;
    if (bestTimes[this.id - 1].lte(player.records.thisInfinity.time)) {
      return;
    }
    player.challenge.logic.bestTimes[this.id - 1] = player.records.thisInfinity.time;
    GameCache.logicChallengeTimeSum.invalidate();
  }

  exit() {
    player.challenge.logic.current = 0;
    bigCrunchReset(true, false);
    if (!Enslaved.isRunning) Tab.dimensions.antimatter.show();
  }
}

/**
 * @param {number} id
 * @return {LogicChallengeState}
 */
export const LogicChallenge = LogicChallengeState.createAccessor(GameDatabase.challenges.logic);

/**
 * @returns {LogicChallengeState}
 */
Object.defineProperty(LogicChallenge, "current", {
  get: () => (player.challenge.logic.current > 0
    ? LogicChallenge(player.challenge.logic.current)
    : undefined),
});

Object.defineProperty(LogicChallenge, "isRunning", {
  get: () => LogicChallenge.current !== undefined,
});

export const LogicChallenges = {
  /**
   * @type {LogicChallengeState[]}
   */
  all: LogicChallenge.index.compact(),
  completeAll() {
    for (const challenge of LogicChallenges.all) challenge.complete();
  },
  clearCompletions() {
    player.challenge.logic.completedBits = 0;
  },
  /**
   * @returns {LogicChallengeState[]}
   */
  get completed() {
    return LogicChallenges.all.filter(lc => lc.isCompleted);
  }
};

class LC3UpgradeState extends RebuyableMechanicState {

  get currency() {
    return Currency.challengePower;
  }

  get boughtAmount() {
    return player.lc3Rebuyables[this.id];
  }

  set boughtAmount(value) {
    player.lc3Rebuyables[this.id] = value;
  }

  get isCustomEffect() { return true; }

  get effectValue() {
    return this.config.effect(this.effectiveAmount);
  }
  
  buyMax(auto) {
    if (!this.isAffordable) return false;
    if (this.iscCapped) return false;
    const bulk = this.config.bulk(this.currency.value).add(1).floor()
                .clampMax(this.cappedAmount);
    if (bulk.lte(this.boughtAmount)) return false;
    this.currency.subtract(this.config.cost(bulk.minus(1)));
    this.boughtAmount = bulk;
    return true;
  }
  
  get cappedAmount() {
    return this.config.cappedAmount ?? BE.MAX_VALUE;
  }
  
  get effectiveAmount() {
    const base = this.boughtAmount.clampMax(this.cappedAmount);
    if (this.id === "cpPow" && LC3.game.isCompleted) {
      return base.times(LC3Upgrade.adMult.effectValue.log10().pow(1.91));
    }
    return base;
  }
  
  get isCapped() {
    return this.boughtAmount.gte(this.cappedAmount);
  }
  
  get isAffordable() {
    return this.currency.gt(this.cost);
  }
}

export const LC3Upgrade = mapGameDataToObject(
  GameDatabase.logic.lc3Upgs,
  config => new LC3UpgradeState(config)
);

export const LC3 = {
  get challenge() {
    return LogicChallenge(3);
  },

  get isRunning() {
    return this.challenge.isUnlocked && this.challenge.isRunning;
  },
  
  get cpPerSecond() {
    if (!this.isRunning) return BEC.D1;
    const base1 = LC3Upgrade.cpMult.effectValue;
    const base2 = LC3Upgrade.cpBaseAD.effectValue;
    const pow = LC3Upgrade.cpPow.effectValue;
    return base1.times(base2).pow(pow);
  },
  
  tick(diff) {
    if (!this.isRunning) return;
    Currency.challengePower.multiply(this.cpPerSecond.pow(diff.div(1e4)));
  },
  
  get helpThreshold() {
    return BEC.E430;
  },
  
  reset() {
    if (this.isRunning) return;
    Currency.challengePower.reset();
    player.lc3Game.state = GAME_STATE.NOT_COMPLETE;
    player.lc3Game.rows = null;
    player.lc3Game.curremtRow = 0;
    LC3Upgrade.all.forEach(u => u.boughtAmount = BEC.D0);
  },
  
  game: {
    get state() {
      return player.lc3Game.state;
    },
    
    get isRunning() {
      return this.state === GAME_STATE.NOT_COMPLETE;
    },
    
    get isCompleted() {
      return this.state === GAME_STATE.COMPLETED;
    },
    
    get isFailed() {
      return this.state === GAME_STATE.FAILED;
    }
  }
}