import { BEC } from "./constants.js";

/**
 * @abstract
 */
export class TimeTheoremPurchaseType {
  /**
  * @abstract
  */
  get amount() { throw new NotImplementedError(); }

  /**
  * @abstract
  */
  set amount(value) { throw new NotImplementedError(); }

  add(amount) { this.amount = this.amount.plus(amount); }

  /**
  * @abstract
  */
  get currency() { throw new NotImplementedError(); }

  get cost() { return this.costBase.times(this.costIncrement.pow(this.amount)); }

  /**
   * @abstract
   */
  get costBase() { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  get costIncrement() { throw new NotImplementedError(); }

  get bulkPossible() {
    if (Perk.ttFree.canBeApplied) {
      return this.currency.value.divide(this.cost).log10().div(this.costIncrement.log10()).plus(1).floor();
    }
    return BE.affordGeometricSeries(this.currency.value, this.cost, this.costIncrement, 0);
  }

  // Note: This is actually just the cost of the largest term of the geometric series. If buying EP without the
  // perk that makes them free, this will be incorrect, but the EP object already overrides this anyway
  bulkCost(amount) {
    return this.cost.times(this.costIncrement.pow(amount.minus(1)));
  }

  purchase(bulk) {
    if (!this.canAfford) return false;
    let purchased = false;
    const amount = this.bulkPossible;
    const buyFn = cost => (Perk.ttFree.canBeApplied ? this.currency.gte(cost) : this.currency.purchase(cost));
    // This will sometimes buy one too few for EP, so we just have to buy 1 after.
    if (bulk && buyFn(this.bulkCost(amount))) {
      // Currency.timeTheorems.add(amount);
      this.add(amount);
      purchased = true;
    }
    if (buyFn(this.cost)) {
      // Currency.timeTheorems.add(1);
      this.add(1);
      purchased = true;
    }
    if (purchased) player.requirementChecks.reality.noPurchasedTT = false;
    if (TimeTheorems.totalPurchased().gt(114)) PelleStrikes.ECs.trigger();
    return purchased;
  }

  get canAfford() {
    return this.currency.gte(this.cost) && !player.eternities.eq(0) && !Continuum.isOn("TT");
  }

  reset() {
    this.amount = BEC.D0;
  }

  get continuumValue() {
    if (!Continuum.isOn("TT")) return BEC.D0;
    return Continuum.ttContinuum(this);
  }

  get totalAmount() {
    return this.amount.max(this.continuumValue);
  }
}

TimeTheoremPurchaseType.am = new class extends TimeTheoremPurchaseType {
  get amount() { return player.timestudy.amBought; }
  set amount(value) { player.timestudy.amBought = value; }

  get currency() { return Currency.antimatter; }
  get costBase() { return BEC.E20000; }
  get costIncrement() { return BEC.E20000; }
}();

TimeTheoremPurchaseType.ip = new class extends TimeTheoremPurchaseType {
  get amount() { return player.timestudy.ipBought; }
  set amount(value) { player.timestudy.ipBought = value; }

  get currency() { return Currency.infinityPoints; }
  get costBase() { return BEC.D1; }
  get costIncrement() { return BEC.E100; }
}();

TimeTheoremPurchaseType.ep = new class extends TimeTheoremPurchaseType {
  get amount() { return player.timestudy.epBought; }
  set amount(value) { player.timestudy.epBought = value; }

  get currency() { return Currency.eternityPoints; }
  get costBase() { return BEC.D1; }
  get costIncrement() { return BEC.D2; }

  bulkCost(amount) {
    if (Perk.ttFree.canBeApplied) return this.cost.times(this.costIncrement.pow(amount.minus(1)));
    return this.costIncrement.pow(amount.plus(this.amount)).subtract(this.cost);
  }
}();

TimeTheoremPurchaseType.tc = new class extends TimeTheoremPurchaseType {
  get amount() { return player.timestudy.tcBought; }
  set amount(value) { player.timestudy.tcBought = value; }

  get currency() { return Currency.timeCores; }
  get costBase() { return BEC.D1; }
  get costIncrement() { return BEC.D2; }
}();

export const TimeTheorems = {
  checkForBuying(auto) {
    if (PlayerProgress.realityUnlocked() || TimeDimension(1).bought) return true;
    if (!auto) Modal.message.show(`You need to buy at least ${formatInt(1)} Time Dimension before you can purchase
      Time Theorems.`, { closeEvent: GAME_EVENT.REALITY_RESET_AFTER });
    return false;
  },

  buyOne(auto = false, type) {
    if (!this.checkForBuying(auto)) return 0;
    if (!TimeTheoremPurchaseType[type].purchase(false)) return 0;
    return 1;
  },

  // This is only called via automation and there's no manual use-case, so we assume auto is true and simplify a bit
  buyOneOfEach() {
    if (!this.checkForBuying(true)) return 1;
    const ttAM = this.buyOne(true, "am");
    const ttIP = this.buyOne(true, "ip");
    const ttEP = this.buyOne(true, "ep");
    const ttTC = this.buyOne(true, "tc");
    return ttAM + ttIP + ttEP + ttTC;
  },

  buyMax(auto = false) {
    if (!this.checkForBuying(auto)) return BEC.D0;
    const ttAM = TimeTheoremPurchaseType.am.purchase(true);
    const ttIP = TimeTheoremPurchaseType.ip.purchase(true);
    const ttEP = TimeTheoremPurchaseType.ep.purchase(true);
    const ttTC = TimeTheoremPurchaseType.ep.purchase(true);
    return ttAM + ttIP + ttEP + ttTC;
  },

  get totalValue() {
    return TimeTheoremPurchaseType.am.totalAmount.plus
          (TimeTheoremPurchaseType.ip.totalAmount).plus
          (TimeTheoremPurchaseType.ep.totalAmount).plus
          (TimeTheoremPurchaseType.tc.totalAmount);
  },

  totalPurchased() {
    return TimeTheoremPurchaseType.am.amount.plus
      (TimeTheoremPurchaseType.ip.amount).plus
      (TimeTheoremPurchaseType.ep.amount).plus
      (TimeTheoremPurchaseType.tc.amount)
  },

  calculateTimeStudiesCost() {
    let totalCost = TimeStudy.boughtNormalTS()
      .map(ts => ts.cost)
      .reduce(Number.sumReducer, 0);
    const ecStudy = TimeStudy.eternityChallenge.current();
    if (ecStudy !== undefined) {
      totalCost += ecStudy.cost;
    }
    if (Enslaved.isRunning && player.celestials.enslaved.hasSecretStudy) totalCost -= 100;
    return totalCost;
  }
};
