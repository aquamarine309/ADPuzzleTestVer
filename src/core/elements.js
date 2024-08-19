import { SetPurchasableMechanicState } from "./game-mechanics/index.js";

class GameElementState extends SetPurchasableMechanicState {
  get currency() {
    return Currency.antimatter;
  }

  get set() {
    return player.elements;
  }

  onPurchased() {
    this.config.onPurchased?.();
  }
};

export const GameElement = GameElementState.createAccessor(GameDatabase.logic.elements);

export const GameElements = {
  all: GameElement.index.compact(),

  get selected() {
    return GameElement(player.lastSelectedElementId);
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
  EventHub.dispatch(GAME_EVENT.APPLY_EL2_AFTER);
}