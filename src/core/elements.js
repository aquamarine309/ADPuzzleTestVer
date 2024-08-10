import { GameMechanicState } from "./game-mechanics/index.js";

export const GameElements = {
  _activeTypes: new Set(),
  
  get active() {
    return player.elements;
  },
  
  get activeTypes() {
    return this._activeTypes;
  },
  
  isActive(type) {
    return this.activeTypes.has(type);
  },
  
  tick(diff) {
    if (this.active.size === 0) return;
    // Real time
    this.active.forEach(element => {
      if (element.time <= diff) {
        this.active.delete(element);
        this.activeTypes.delete(element.type);
      } else {
        element.time -= diff;
      }
    });
  },
  
  add(element) {
    if (this.isActive(element.type)) {
      this.active.forEach(el => {
        if (element.type === el.type) {
          el.time = Math.max(element.time, el.time);
        }
      });
    } else {
      this.active.add(element);
      this.activeTypes.add(element.type);
      GameUI.notify.info(`You have got Element "${ElementEffects[element.type].name}" for ${timeDisplayShort(element.time)}!`);
    }
    ElementEffects[element.type].config.start?.();
  },
  
  updateActiveTypes() {
    this.activeTypes.clear();
    for (const element of this.active) {
      this.activeTypes.add(element.type);
    }
  },
  
  getElement(type) {
    return this.active.find(el => el.type === type);
  },
  
  addRandomElement(time) {
    const type = ElementEffects.all.randomElement().id;
    this.add({ type, time });
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