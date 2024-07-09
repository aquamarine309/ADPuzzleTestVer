import { GameMechanicState } from "./game-mechanics/index.js";
import { BEC } from "./constants.js";

class DifficultyState extends GameMechanicState {
  get isActive() {
    return player.logic.difficulty >= this.id;
  }
  
  start() {
    player.logic.difficulty = this.id;
  }
  
  exit() {
    player.logic.difficulty = 0;
  }
  
  get isEffectActive() {
    return this.isActive;
  }
};

export const Difficulty = DifficultyState.createAccessor(GameDatabase.logic.difficulties);

Object.defineProperty(Difficulty, "isRunning", {
  get: function() {
    return player.logic.difficulty > 0;
  }
});

Object.defineProperty(Difficulty, "current", {
  get: function() {
    return Difficulty(player.logic.difficulty);
  }
});

export const Difficulties = {
  all: Difficulty.index.compact(),
  
  get maxDifficulty() {
    return this.all.length;
  }
};

class DifficultyRNGState {
  get seed() {
    return player.logic.seed;
  }
  
  set seed(value) {
    player.logic.seed = value;
  }
  
  random() {
    if (this.seed === 0) {
      this.seed = player.logic.initialSeed;
    }
    const state = xorshift32Update(this.seed);
    this.seed = state;
    return state / Math.pow(2, 32) + 0.5;
  }
}

export const DifficultyRNG = new DifficultyRNGState();

// Each difficulty has their chance. For example,
// There are 5 difficulties
// The chance ratio is 5 : 4 : 3 : 2 : 1
// It means that the chance of Difficulty 1 is 5/15=1/3
export function randomDifficulty() {
  const state = DifficultyRNG.random();
  const max = Difficulties.maxDifficulty;
  // 1 + 2 + 3 + ... + max = max * (max + 1) / 2
  const pieces = max * (max + 1) / 2;
  
  // Solve a quadratic equation:
  // ((2 * max + 1 - x) * x) / 2 = state * pieces
  const b = -(2 * max + 1);
  const c = 2 * state * pieces;
  
  // The choice of the smaller real root is needed here
  // In general, there can be no imaginary solution
  // So I don't judge the root case
  const index = Math.ceil((-b - Math.sqrt(b ** 2 - 4 * c)) / 2);
  
  Difficulty(index).start();
  return index;
}