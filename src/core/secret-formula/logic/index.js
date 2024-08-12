import { challengeFactors } from "./challenge-factors.js";
import { elements } from "./elements.js";
import { lc3Upgrades } from "./lc3-upgrades.js";
import { logicTree } from "./logic-tree.js";
import { logicUpgrades } from "./logic-upgrades.js";
import { resourceExchange } from "./resource-exchange.js";

export const logic = {
  resourceExchange,
  upgrades: logicUpgrades,
  lc3Upgs: lc3Upgrades,
  challengeFactors,
  elements,
  tree: logicTree
};