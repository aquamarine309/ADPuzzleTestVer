import { BEC } from "./constants.js";

export const Continuum = {
  timeDimCostScaingAt: [
    [647.0720676571726, 1991.1639551980525, 7322.145017116015],
    [323.3035470682273, 1150.484396742062, 4627.715573960642],
    [214.96008703619793, 808.487600744309, 3382.46681466133],
    [160.94608945857607, 623.188793823, 2665.2585125978276]
  ],

  timeDimPostE6000: [
    7322.145017116015,
    4627.715573960642,
    3382.46681466133,
    2665.2585125978276,
    832.268054242188,
    688.9137794563559,
    561.8136621264795,
    455.56363240641565
  ],

  isOn(name) {
    switch (name) {
      case "AD":
        return false;
      case "ID":
        return false;
      case "TD":
        return false;
      case "ipMult":
        return false;
      case "epMult":
        return false;
      case "TT":
        return false;
      default:
        throw `Unexpect continuum ${name}`;
    }
  },

  getLinearContinuum(money, baseCost, costMultiplier){
    if (money.lte(baseCost.div(costMultiplier))) return BEC.D0;
    return this.log(money.div(baseCost), costMultiplier).add(1).clampMin(0);
  },

  getLinearCost(boughtAmount, baseCost, costMultiplier) {
    return BE.pow(costMultiplier, boughtAmount).times(baseCost);
  },

  infinityDimContinuum(dim, currency) {
    const money = currency ?? Currency.infinityPoints.value;
    const baseCost = dim.baseCost;
    const costMultiplier = dim.costMultiplier;
    return this.getLinearContinuum(money, baseCost, costMultiplier);
  },

  timeDimContinuum(dim, currency) {
    const tier = dim.tier;
    let money = currency ?? Currency.eternityPoints.value;
    if (PelleRifts.paradox.milestones[0].canBeApplied && tier > 4) {
      money = money.pow(2).times(BEC.E2250);
    }
    const baseCost = dim.baseCost;
    if (tier > 4 && money.lt(BEC.E6000)) {
      return this.getLinearContinuum(
        money,
        baseCost,
        dim.costMultiplier
      );
    }

    if (money.gte(BEC.E6000)) {
      const scaling = TimeDimensions.scalingPast1e6000;
      const base = dim.costMultiplier.times(tier <= 4 ? 2.2 : 1);
      return this.log(money.div(baseCost), base).add(scaling.minus(1).times(Continuum.timeDimPostE6000[tier - 1])).div(scaling);
    }

    const costThresholds = dim._costIncreaseThresholds;
    let bulk = BEC.D0;
    const costMultIncreases = [1, 1.5, 2.2];
    for (let i = 0; i < costThresholds.length; i++) {
      const threshold = costThresholds[i];
      if (money.gt(threshold) && tier < 4) {
        bulk = new BE(Continuum.timeDimCostScaingAt[tier - 1][i]);
        continue;
      };
      const costMult = dim.costMultiplier.times(costMultIncreases[i]);
      const base = this.getLinearCost(bulk, baseCost, costMult);
      if (base.gte(threshold)) continue;
      const amount = this.getLinearContinuum(
        money.clampMax(threshold),
        base,
        costMult
      );
      if (amount.lte(0)) return;
      bulk = bulk.add(amount);
    }

    return bulk;
  },

  ipMultContinuum(currency) {
    const money = currency ?? Currency.infinityPoints.value;
    if (money.lte(1)) return BEC.D0;

    const upgrade = InfinityUpgrade.ipMult;
    const threshold = upgrade.config.costIncreaseThreshold;
    if (money.gte(threshold)) {
      return this.getLinearContinuum(
        money,
        threshold,
        BEC.E10
      ).add(upgrade.purchasesAtIncrease);
    } else {
      return money.log10();
    }
  },

  epMultContinuum(currency) {
    const money = currency ?? Currency.eternityPoints.value;
    if (money.lte(1)) return BEC.D0;
    const multPerUpgrade = [BEC.D50, BEC.E2, BEC.D500, BEC.E3];
    const costThresholds = EternityUpgrade.epMult.costIncreaseThresholds;
    let bulk = BEC.D0;
    // Calculate purchases of each part
    for (let i = 0; i < costThresholds.length; i++) {
      const threshold = costThresholds[i];
      // In the part, cost scaling is linear
      // 500, 2.5e3, 6.25e4 ...
      const amount = this.getLinearContinuum(
        money.clampMax(threshold),
        this.getLinearCost(bulk, BEC.D500, multPerUpgrade[i]),
        multPerUpgrade[i]
      );
      if (amount.lte(0)) break;
      bulk = bulk.add(amount);
      if (money.lt(threshold)) break;
    }

    // The cost above e4000 EP is 1000^((x-1334)^1.2+x)*500,
    // It starts at 1333 purchases
    if (money.gte(BEC.E4000)) {
      // Solve equation: (x-1334)^1.2+x=k
      const k = money.div(500).log10().div(3);
      // When k > 1e90, (x-1334)^2-x is equal to 0
      // so x = k^(1 / 1.2)-1334;
      // n - 1334 is equal to n while n is above e75 [n = k^(1 / 1.2)]
      if (k.gte(BEC.E90)) {
        bulk = k.pow(1 / 1.2);
      } else {
        // Newton's method
        const iterations = 6;
        // f(x)=(x-1334)^1.2+x-k
        // f'(x)=1.2*(x-1334)^0.2+1
        // x=x0-f(x0)/f'(x0)
        for (let i = 0; i < iterations; i++) {
          bulk = bulk.minus(bulk.minus(1334).pow(1.2).add(x).minus(k).div(bulk.minus(1334).pow(0.2).times(1.2).add(1)));
        }
        moneyLeft = moneyLeft.minus(bulk.minus(1334).pow(1.2).add(x)).clampMin(0);
        bulk = bulk.add(1333);
      }
    }
    return bulk;
  },

  ttContinuum(type) {
    const money = type.currency.value;
    const baseCost = type.costBase;
    const costMultiplier = type.costIncrement;
    return this.getLinearContinuum(money, baseCost, costMultiplier);
  },

  log(a, b) {
    return a.ln().div(b.ln());
  }
}