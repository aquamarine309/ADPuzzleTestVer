import { BitPurchasableMechanicState } from "./game-mechanics/index.js";

class LogicUpgradeState extends BitPurchasableMechanicState {
  constructor(config) {
    super(config);
    this.registerEvents(config.checkEvent, () => this.tryUnlock());
  }
  
  get requirement() {
    return typeof this.config.requirement === "function" ? this.config.requirement() : this.config.requirement;
  }
  
  get currency() {
    return Currency.logicPoints;
  }
  
  get name() {
    return this.config.name;
  }
  
  get bitIndex() {
    return this.id;
  }

  get bits() {
    return player.logic.upgradeBits;
  }

  set bits(value) {
    player.logic.upgradeBits = value;
  }
  
  get isAvailableForPurchase() {
    return (player.logic.upgReqs & (1 << this.id)) !== 0;
  }

  get isPossible() {
    return this.config.hasFailed ? !this.config.hasFailed() : true;
  }
  
  tryUnlock() {
    const logicUnlocked = PlayerProgress.infinityUnlocked();
    if (!logicUnlocked || this.isAvailableForPurchase || !this.config.checkRequirement()) return;
    player.logic.upgReqs |= (1 << this.id);
    GameUI.notify.success(`You've unlocked a Logic Upgrade: ${this.config.name}`);
    this.hasPlayerLock = false;
  }
  
  onPurchased() {
    const id = this.id;
    if (id < 7) {
      GameCache.maxTier.invalidate();
    }
  }
}

LogicUpgradeState.index = mapGameData(
  GameDatabase.logic.upgrades,
  config => new LogicUpgradeState(config)
);

export const LogicUpgrade = id => LogicUpgradeState.index[id];

export const LogicUpgrades = {
  /**
   * @type {LogicUpgradeState[]}
   */
  all: LogicUpgradeState.index.compact()
};