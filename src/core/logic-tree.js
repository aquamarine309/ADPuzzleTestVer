import { GameMechanicState } from "./game-mechanics/index.js";

class LogicNodeState extends GameMechanicState {
  constructor(config) {
    super(config);
    this.registerEvents(config.checkEvent, args => this.tryUnlock(args));
    this._reqNodes = null;
  }

  updateReqNodes() {
    if (this.reqNodes) throw `Logic Node ${this.id} is already initialized.`;
    const reqNodes = this.config.reqNodes
      ? this.config.reqNodes.map(id => LogicTree.getNodeById(id))
      : [];
    this._reqNodes = reqNodes;
  }
  
  get reqNodes() {
    return this._reqNodes;
  }
  
  get isAvailable() {
    return this.id === 0 || this.reqNodes.some(x => x.isUnlocked);
  }

  tryUnlock(args) {
    if (this.isUnlocked) return;
    if (!this.isAvailable) return;
    if (!this.config.checkRequirement(args)) return;
    this.unlock();
  }

  unlock() {
    player.logicNodes.add(this.id);
    GameUI.notify.logic(`You've unlocked Logic Node "${this.name}"`);
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
  const LN = LogicTree.getNodeById;
  return [
    [LN(0), LN(1)]
  ]
})();

// Initialize
LogicTree.nodes.forEach(x => x.updateReqNodes());