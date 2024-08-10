import { GameMechanicState } from "./game-mechanics/index.js";

export const GameElements = {
  
  get data() {
    return player.elements;
  },
  
  isActive(type) {
    return this.getTime(type) > 0;
  },
  
  tick(diff) {
    // Real time
    for (let el in this.data) {
      const time = this.getTime(el);
      if (time === 0) continue;
      
      if (time <= diff) {
        this.data[el] = 0;
      } else {
        this.data[el] -= diff;
      }
    }
  },
  
  add(type, duration) {
    const effect = ElementEffects[type];
    if (this.isActive(type)) {
      this.data[type] = Math.max(this.getTime(type), duration);
    } else {
      this.data[type] = duration;
      GameUI.notify.info(`You have got Element "${effect.name}" for ${timeDisplayShort(duration)}!`);
    }
    effect.config.start?.();
  },
  
  getTime(type) {
    return this.data[type];
  },
  
  addRandomElement(duration) {
    const type = ElementEffects.all.randomElement().id;
    this.add(type, duration);
  }
}

class ElementEffectState extends GameMechanicState {
  get isEffectActive() {
    return GameElements.isActive(this.id);
  }
  
  get symbol() {
    return this.config.symbol;
  }
  
  get name() {
    return this.config.name;
  }
};

export const ElementEffects = mapGameDataToObject(
  GameDatabase.logic.elements,
  config => new ElementEffectState(config)
);