import { GameMechanicState } from "./game-mechanics/index.js";

class LogicNodeState extends GameMechanicState {
  constructor(config) {
    super(config);
    this.registerEvents(config.checkEvent, args => this.tryUnlock(args));
    this._reqNodes = null;
  }

  updateReqNodes() {
    if (this.reqNodes) throw `Logic Node ${this.id} has been initialized.`;
    const reqNodes = this.config.reqNodes
      ? this.config.reqNodes.map(id => LogicTree.getNodeById(id))
      : [];
    this._reqNodes = reqNodes;
  }

  get reqNodes() {
    return this._reqNodes;
  }

  get isAvailable() {
    return this.reqNodes.length === 0 || this.reqNodes.some(x => x.isUnlocked);
  }

  tryUnlock(args) {
    if (this.isUnlocked) return;
    if (!this.isAvailable) return;
    if (!this.config.checkRequirement(args)) return;
    this.unlock();
  }

  unlock() {
    player.logicNodes.add(this.id);
    GameUI.notify.logic(`You've unlocked Logic Node "${this.config.name}"`);
    EventHub.dispatch(GAME_EVENT.LOGIC_NODE_UNLOCKED);
  }

  lock() {
    player.logicNodes.delete(this.id);
  }

  get isUnlocked() {
    return player.logicNodes.has(this.id);
  }

  get isEffectActive() {
    return this.isUnlocked;
  }
}

export const LogicNode = mapGameDataToObject(
  GameDatabase.logic.tree,
  config => new LogicNodeState(config)
);

export const LogicTree = {
  nodes: LogicNode.all,

  getNodeById: null,

  connections: null
}

LogicTree.getNodeById = (function() {
  const idMap = {};
  for (const node of LogicTree.nodes) {
    idMap[node.id] = node;
  }
  return id => idMap[id];
})();

LogicTree.connections = (function() {
  return [
    [33, 32],
    [32, 31],
    [32, 42],
    [33, 43],
    [42, 43],
    [43, 44],
    [43, 53],
    [44, 54],
    [54, 55],
    [33, 23],
    [23, 13],
    [23, 22]
  ].map(c => c.map(x => LogicTree.getNodeById(x)))
})();

// Initialize
LogicTree.nodes.forEach(x => x.updateReqNodes());