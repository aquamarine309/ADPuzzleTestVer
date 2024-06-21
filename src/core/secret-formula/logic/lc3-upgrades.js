import { BEC } from "../../constants.js";

const formatCost = c => format(c, 2);

const rebuyable = config => {
  const { id, purpose, cost, effect, formatEffect, bulk, cappedAmount } = config;
  return {
    id,
    description: () => `Boost ${purpose}`,
    cost: (x = player.lc3Rebuyables[id]) => cost(x),
    formatCost,
    effect: (x = player.lc3Rebuyables[id]) => effect(x),
    formatEffect,
    bulk,
    cappedAmount
  };
};

export const lc3Upgrades = {
  adMult: rebuyable({
    id: "adMult",
    purpose: "Antimatter Dimensions",
    cost: x => BE.pow10(BE.pow(5, x.plus(1)).times(10)),
    effect: x => BE.pow10(BE.pow(x.add(1).ln(), 1.3)),
    formatEffect: x => formatX(x, 2, 3),
    bulk: x => x.log10().div(10).log(5).minus(1)
  }),
  adPow: rebuyable({
    id: "adPow",
    purpose: "Antimatter Dimensions",
    cost: x => BE.pow10(BE.pow(5, x.plus(1)).pow(2.5)),
    effect: x => x.add(1).ln().times(0.02).add(1),
    formatEffect: x => formatPow(x, 2, 3),
    bulk: x => x.log10().pow(0.4).log(5).minus(1),
    cappedAmount: 128
  }),
  cpMult: rebuyable({
    id: "cpMult",
    purpose: "Challenge Power",
    cost: x => BE.pow10(BEC.D2.pow(x).div(2)),
    effect: x => BEC.D2.pow(BE.pow(1.2, x.plus(BE.pow(2, x.div(4)).div(BEC.E5)))),
    formatEffect: x => formatX(x, 2, 2),
    bulk: x => x.log10().times(2).log(2),
    cappedAmount: 210
  }),
  cpPow: rebuyable({
    id: "cpPow",
    purpose: "Challenge Power",
    cost: x => BE.pow10(BEC.D2.pow(BE.pow(1.45, x))),
    effect: x => BEC.D2.pow(x.pow(10).div(BEC.E10).plus(x.pow(1.4)).plus(x)),
    formatEffect: x => formatPow(x, 2, 2),
    bulk: x => x.log10().log2().log(1.45)
  }),
  cpBaseAD: rebuyable({
    id: "cpBaseAD",
    purpose: "CP based on AD",
    cost: x => BE.pow10(BE.pow10(x.times(9))),
    effect: x => Currency.antimatter.value.plus(1).log10().pow(x.pow(10).times(5).plus(BE.pow(2, x).div(BEC.E15))),
    formatEffect: x => formatX(x, 2, 2),
    bulk: x => x.log10().log10().div(9)
  })
}