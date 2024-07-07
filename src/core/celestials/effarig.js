import { BitUpgradeState } from "../game-mechanics/index.js";
import { GameDatabase } from "../secret-formula/game-database.js";

import { BEC } from "../constants.js";

import { Quotes } from "./quotes.js";

export const EFFARIG_STAGES = {
  INFINITY: 1,
  ETERNITY: 2,
  REALITY: 3,
  COMPLETED: 4
};

export const Effarig = {
  displayName: "Effarig",
  possessiveName: "Effarig's",
  initializeRun() {
    clearCelestialRuns();
    player.celestials.effarig.run = true;
    recalculateAllGlyphs();
    Tab.reality.glyphs.show(false);
  },
  get isRunning() {
    return player.celestials.effarig.run;
  },
  get currentStage() {
    if (!EffarigUnlock.infinity.isUnlocked) {
      return EFFARIG_STAGES.INFINITY;
    }
    if (!EffarigUnlock.eternity.isUnlocked) {
      return EFFARIG_STAGES.ETERNITY;
    }
    if (!EffarigUnlock.reality.isUnlocked) {
      return EFFARIG_STAGES.REALITY;
    }
    return EFFARIG_STAGES.COMPLETED;
  },
  get currentStageName() {
    switch (this.currentStage) {
      case EFFARIG_STAGES.INFINITY:
        return "Infinity";
      case EFFARIG_STAGES.ETERNITY:
        return "Eternity";
      case EFFARIG_STAGES.REALITY:
      default:
        return "Reality";
    }
  },
  get eternityCap() {
    return this.isRunning && this.currentStage === EFFARIG_STAGES.ETERNITY ? BEC.E50 : undefined;
  },
  get glyphLevelCap() {
    switch (this.currentStage) {
      case EFFARIG_STAGES.INFINITY:
        return 100;
      case EFFARIG_STAGES.ETERNITY:
        return 1500;
      case EFFARIG_STAGES.REALITY:
      default:
        return 2000;
    }
  },
  get glyphEffectAmount() {
    const genEffectBitmask = Glyphs.activeWithoutCompanion
      .filter(g => generatedTypes.includes(g.type))
      .reduce((prev, curr) => prev | curr.effects, 0);
    const nongenEffectBitmask = Glyphs.activeWithoutCompanion
      .filter(g => !generatedTypes.includes(g.type))
      .reduce((prev, curr) => prev | curr.effects, 0);
    return countValuesFromBitmask(genEffectBitmask) + countValuesFromBitmask(nongenEffectBitmask);
  },
  get shardsGained() {
    if (!TeresaUnlocks.effarig.canBeApplied) return BEC.D0;
    return Currency.eternityPoints.value.log10().div(7500).pow(this.glyphEffectAmount).floor().times
      (AlchemyResource.effarig.effectValue).timesEffectOf(ExtraBonus.extraBonusToRelicShards);
  },
  get maxRarityBoost() {
    return Currency.relicShards.value.plus(10).log10().log10().times(5).toNumberMax(100);
  },
  nerfFactor(power) {
    let c;
    switch (this.currentStage) {
      case EFFARIG_STAGES.INFINITY:
        c = 1500;
        break;
      case EFFARIG_STAGES.ETERNITY:
        c = 29.29;
        break;
      case EFFARIG_STAGES.REALITY:
      default:
        c = 25;
        break;
    }
    return BE.div(1, BE.div(c, power.pLog10().sqrt().plus(c))).times(3);
  },
  get tickDilation() {
    return this.nerfFactor(Currency.timeShards.value).times(0.1).plus(0.7).toNumberMax(1);
  },
  get multDilation() {
    return this.nerfFactor(Currency.infinityPower.value).times(0.25).plus(0.25).toNumberMax(1);
  },
  get tickspeed() {
    const base = Tickspeed.baseValue.reciprocal().log10().plus(3);
    return BE.pow10(base.pow(this.tickDilation)).reciprocal();
  },
  multiplier(mult) {
    const base = new BE(mult).pLog10();
    return BE.pow10(BE.pow(base, this.multDilation));
  },
  get bonusRG() {
    // Will return 0 if Effarig Infinity is uncompleted
    return replicantiCap().pLog10().div(LOG10_MAX_VALUE).minus(1).floor();
  },
  quotes: Quotes.effarig,
  symbol: "Ϙ"
};

class EffarigUnlockState extends BitUpgradeState {
  get bits() { return player.celestials.effarig.unlockBits; }
  set bits(value) { player.celestials.effarig.unlockBits = value; }

  get cost() {
    return this.config.cost;
  }

  get isEffectActive() {
    return !Pelle.isDisabled("effarig");
  }

  purchase() {
    if (this.isUnlocked || !Currency.relicShards.purchase(this.cost)) return;
    this.unlock();
    this.config.onPurchased?.();
  }
}

export const EffarigUnlock = mapGameDataToObject(
  GameDatabase.celestials.effarig.unlocks,
  config => new EffarigUnlockState(config)
);

EventHub.logic.on(GAME_EVENT.TAB_CHANGED, () => {
  if (Tab.celestials.effarig.isOpen) Effarig.quotes.initial.show();
});

EventHub.logic.on(GAME_EVENT.BIG_CRUNCH_BEFORE, () => {
  if (!Effarig.isRunning) return;
  Effarig.quotes.completeInfinity.show();
});

EventHub.logic.on(GAME_EVENT.ETERNITY_RESET_BEFORE, () => {
  if (!Effarig.isRunning) return;
  Effarig.quotes.completeEternity.show();
});
