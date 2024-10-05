import { SetPurchasableMechanicState } from "./game-mechanics/index.js";

class GameElementState extends SetPurchasableMechanicState {
  get currency() {
    return Currency.antimatter;
  }

  get set() {
    return player.elements;
  }

  onPurchased() {
    GameElements._speedPower.invalidate();
    this.config.onPurchased?.();
  }

  get isNonMetallic() {
    return this.config.type === ELEMENT_TYPE.NON_METALLIC;
  }

  get isMetallic() {
    return this.config.type === ELEMENT_TYPE.METALLIC;
  }

  get isInert() {
    return this.config.type === ELEMENT_TYPE.INERT;
  }
};

export const GameElement = GameElementState.createAccessor(GameDatabase.logic.elements);

export const GameElements = {
  all: GameElement.index.compact(),

  get selected() {
    return GameElement(player.lastSelectedElementId);
  },

  get nonMetallicElements() {
    return GameElements.all.filter(el => el.isNonMetallic);
  },

  get metallicElements() {
    return GameElements.all.filter(el => el.isMetallic);
  },
  
  get inertElements() {
    return GameElements.all.filter(el => el.isInert);
  },

  _speedPower: new Lazy(() => {
    const nonMetallics = GameElements.nonMetallicElements.countWhere(el => el.isBought);
    const metallics = GameElements.metallicElements.countWhere(el => el.isBought);
    return (1 - 0.15 * Math.sqrt(nonMetallics)) * (1 + 0.5 * metallics);
  }),

  get speedPower() {
    return GameElements._speedPower.value;
  },
  
  clearAll() {
    player.elements = new Set();
  }
}

export function applyEL1() {
  if (!GameElement(1).canBeApplied || player.infinityUpgrades.size >= 17) return;
  for (const infU of InfinityUpgrade.all) {
    if (infU.id === "ipMult") continue;
    if (Currency.infinityPoints.gte(infU.cost - 1)) {
      player.infinityUpgrades.add(infU.id);
    }
  }
  EventHub.dispatch(GAME_EVENT.APPLY_EL1_AFTER);
}