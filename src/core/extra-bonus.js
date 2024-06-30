import { GameMechanicState } from "./game-mechanics/index.js";

class ExtraBonusState extends GameMechanicState {
  get isUnlocked() {
    return this.config.isUnlocked();
  }
  
  get isEffectActive() {
    return ExtraBonus.current.id === this.id && ExtraBonus.isEffectActive && !Pelle.isDoomed && LogicChallenge(5).isCompleted;
  }
  
  get description() {
    return this.config.description(this.effectValue);
  }
}

export const ExtraBonus = mapGameDataToObject(
  GameDatabase.extraBonus,
  config => new ExtraBonusState(config)
);

Object.defineProperty(ExtraBonus, "current", {
  get: function() { return GameCache.currentBonus.value; }
});

Object.defineProperty(ExtraBonus, "isEffectActive", {
  get: function() { return player.extraBonusTimeLeft.gt(0); }
})

Object.defineProperty(ExtraBonus, "tick", {
  // Real Diff
  value: function(diff) {
    if (player.extraBonusTimeLeft.lte(0)) return;
    player.extraBonusTimeLeft = player.extraBonusTimeLeft.minus(diff).clampMin(0);
  }
});