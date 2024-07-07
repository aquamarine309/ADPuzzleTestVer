import { BEC } from "../../constants.js";

export const MultiplierTabHelper = {
  // Helper method for counting enabled dimensions
  activeDimCount(type) {
    switch (type) {
      case "AD":
        // Technically not 100% correct, but within EC7 any AD8 production is going to be irrelevant compared to AD7
        // and making the UI behave as if it's inactive produces a better look overall
        return Math.clamp(AntimatterDimensions.all.filter(ad => ad.isProducing).length,
          1, EternityChallenge(7).isRunning ? 7 : 8);
      case "ID":
        return InfinityDimensions.all.filter(id => id.isProducing).length;
      case "TD":
        return TimeDimensions.all.filter(td => td.isProducing).length;
      default:
        throw new Error("Unrecognized Dimension type in Multiplier tab GameDB entry");
    }
  },

  // Helper method for galaxy strength multipliers affecting all galaxy types (this is used a large number of times)
  globalGalaxyMult() {
    return BEC.D1.timesEffectsOf(
      InfinityUpgrade.galaxyBoost,
      InfinityUpgrade.galaxyBoost.chargedEffect,
      BreakInfinityUpgrade.galaxyBoost,
      TimeStudy(212),
      TimeStudy(232),
      Achievement(86),
      Achievement(178),
      InfinityChallenge(5).reward,
      PelleUpgrade.galaxyPower,
      PelleRifts.decay.milestones[1],
      LogicChallenge(6),
      LogicChallenge(6).reward,
      LogicChallenge(7).effects.galMul,
      InfinityChallenge(9),
      InfinityChallenge(11)
    ).times(Pelle.specialGlyphEffect.power);
  },

  // Helper method for galaxies and tickspeed, broken up as contributions of tickspeed*log(perGalaxy) and galaxyCount to
  // their product, which is proportional to log(tickspeed)
  decomposeTickspeed() {
    let effectiveCount = effectiveBaseGalaxies();
    const effects = this.globalGalaxyMult();

    let galFrac, tickFrac;
    if (effectiveCount.lt(3)) {
      let baseMult = 1.1245;
      if (player.galaxies === 1) baseMult = 1.11888888;
      if (player.galaxies === 2) baseMult = 1.11267177;
      if (NormalChallenge(5).isRunning) {
        baseMult = 1.08;
        if (player.galaxies === 1) baseMult = 1.07632;
        if (player.galaxies === 2) baseMult = 1.072;
      }
      // This is needed for numerical consistency with the other conditional case
      baseMult /= 0.965 ** 2;
      const logBase = Math.log10(baseMult);

      const perGalaxy = effects.times(0.02);
      effectiveCount = effectiveCount.times(Pelle.specialGlyphEffect.power);

      tickFrac = Tickspeed.totalUpgrades.times(logBase);
      galFrac = BE.max(0.01, BE.minus(1 / baseMult, effectiveCount.times(perGalaxy))).log10().neg().div(logBase);
    } else {
      effectiveCount = effectiveCount.minus(2);
      effectiveCount = effectiveCount.times(effects);
      effectiveCount = effectiveCount.times(getAdjustedGlyphEffect("realitygalaxies") * (1 + ImaginaryUpgrade(9).effectOrDefault(0)));
      effectiveCount = effectiveCount.times(Pelle.specialGlyphEffect.power);

      // These all need to be framed as INCREASING x/sec tick rate (ie. all multipliers > 1, all logs > 0)
      const baseMult = 0.965 ** 2 / (NormalChallenge(5).isRunning ? 0.83 : 0.8);
      const logBase = Math.log10(baseMult);
      const logPerGalaxy = BEC.D0_965.log10().neg();

      tickFrac = Tickspeed.totalUpgrades.times(logBase);
      galFrac = effectiveCount.div(logBase).times(logPerGalaxy).plus(1);
    }

    // Artificially inflate the galaxy portion in order to make the breakdown closer to 50/50 in common situations
    galFrac = galFrac.times(3);

    // Calculate what proportion base tickspeed takes out of the entire tickspeed multiplier
    const base = BEC.D1.dividedByEffectsOf(
      Achievement(36),
      Achievement(45),
      Achievement(66),
      Achievement(83)
    );
    let baseFrac = base.log10().div(Tickspeed.perSecond.log10());

    // We want to make sure to zero out components in some edge cases
    if (base.eq(1)) baseFrac = BEC.D0;
    if (effectiveCount.eq(0)) galFrac = BEC.D0;

    // Normalize the sum by splitting tickspeed and galaxies across what's leftover besides the base value. These three
    // values must be scaled so that they sum to 1 and none are negative
    let factor = BE.minus(1, baseFrac).div(tickFrac.plus(galFrac));
    // The actual base tickspeed calculation multiplies things in a different order, which can lead to precision issues
    // when no tickspeed upgrades have been bought if we don't explicitly set this to zero
    if (Tickspeed.totalUpgrades.eq(0)) factor = BEC.D0;
    return {
      base: baseFrac,
      tickspeed: tickFrac.times(factor),
      galaxies: galFrac.times(factor),
    };
  },

  // Helper method to check for whether an achievement affects a particular dimension or not. Format of dimStr is
  // expected to be a three-character string "XXN", eg. "AD3" or "TD2"
  achievementDimCheck(ach, dimStr) {
    switch (ach) {
      case 23:
        return dimStr === "AD8";
      case 28:
      case 31:
      case 68:
      case 71:
        return dimStr === "AD1";
      case 94:
        return dimStr === "ID1";
      case 34:
        return dimStr.substr(0, 2) === "AD" && Number(dimStr.charAt(2)) !== 8;
      case 64:
        return dimStr.substr(0, 2) === "AD" && Number(dimStr.charAt(2)) <= 4;
      default:
        return true;
    }
  },

  // Helper method to check for whether a time study affects a particular dimension or not, see achievementDimCheck()
  timeStudyDimCheck(ts, dimStr) {
    switch (ts) {
      case 11:
        return dimStr === "TD1";
      case 71:
        return dimStr.substr(0, 2) === "AD" && Number(dimStr.charAt(2)) !== 8;
      case 72:
        return dimStr === "ID4";
      case 73:
        return dimStr === "TD3";
      case 214:
        return dimStr === "AD8";
      case 227:
        return dimStr === "TD4";
      case 234:
        return dimStr === "AD1";
      default:
        return true;
    }
  },

  // Helper method to check for whether an IC reward affects a particular dimension or not, see achievementDimCheck()
  ICDimCheck(ic, dimStr) {
    switch (ic) {
      case 1:
      case 6:
        return dimStr.substr(0, 2) === "ID";
      case 3:
      case 4:
        return dimStr.substr(0, 2) === "AD";
      case 8:
        return dimStr.substr(0, 2) === "AD" && Number(dimStr.charAt(2)) > 1 && Number(dimStr.charAt(2)) < 8;
      default:
        return false;
    }
  },

  // Helper method to check for whether an EC reward affects a particular dimension or not, see achievementDimCheck()
  ECDimCheck(ec, dimStr) {
    switch (ec) {
      case 1:
      case 10:
        return dimStr.substr(0, 2) === "TD";
      case 2:
        return dimStr === "ID1";
      case 4:
      case 9:
        return dimStr.substr(0, 2) === "ID";
      case 7:
        return dimStr === "ID8";
      default:
        return false;
    }
  },

  // Helper method to check for whether an LC reward affects a particular dimension or not, see achievementDimCheck()
  LCDimCheck(lc, dimStr) {
    switch (lc) {
      case 5:
        return dimStr.substr(0, 2) === "ID";
      case 7:
        return dimStr.substr(0, 2) === "ID" || dimStr.substr(0, 2) === "TD";
      default:
        return false;
    }
  },

  blackHoleSpeeds() {
    const currBH = BlackHoles.list
      .filter(bh => bh.isUnlocked)
      .map(bh => (bh.isActive ? bh.power : BEC.D1))
      .reduce((x, y) => x.times(y), BEC.D1);

    // Calculate an average black hole speedup factor
    const bh1 = BlackHole(1);
    const bh2 = BlackHole(2);
    const avgBH = bh1.isUnlocked ? bh1.dutyCycle.times(bh1.power.minus(1)) : BEC.D0.add(1).add
        (bh2.isUnlocked ? bh1.dutyCycle.times(bh2.dutyCycle).times(bh1.power).times(bh2.power.minus(1)) : BEC.D0);

    return {
      current: currBH,
      average: avgBH
    };
  },

  pluralizeDimensions(dims) {
    return dims === 1 ? "Dimension\xa0" : "Dimensions";
  },

  // All of the following NC12-related functions are to make the parsing within the GameDB entry easier in terms of
  // which set of Dimensions are actually producing within NC12 - in nearly every case, one of the odd/even sets will
  // produce significantly more than the other, so we simply assume the larger one is active and the other isn't
  // ADPuzzle rebalanced C12 pow to ADs
  // 2nd:        ^7.5
  // 4th:        ^5.0
  // 6th:        ^2.5
  evenDimNC12Production() {
    const nc12Pow = tier => ([2, 4, 6].includes(tier) ? 9 - tier * 1.25 : 0);
    const maxTier = Math.clampMin(2 * Math.floor(MultiplierTabHelper.activeDimCount("AD") / 2), 2);
    return AntimatterDimensions.all
      .filter(ad => ad.isProducing && ad.tier % 2 === 0)
      .map(ad => ad.multiplier.times(ad.amount.pow(nc12Pow(ad.tier))))
      .reduce((x, y) => x.times(y), BEC.D1)
      .times(AntimatterDimension(maxTier).totalAmount);
  },

  oddDimNC12Production() {
    const maxTier = Math.clampMin(2 * Math.floor(MultiplierTabHelper.activeDimCount("AD") / 2 - 0.5) + 1, 1);
    return AntimatterDimensions.all
      .filter(ad => ad.isProducing && ad.tier % 2 === 1)
      .map(ad => ad.multiplier)
      .reduce((x, y) => x.times(y), BEC.D1)
      .times(AntimatterDimension(maxTier).totalAmount);
  },

  actualNC12Production() {
    return BE.max(this.evenDimNC12Production(), this.oddDimNC12Production());
  },

  multInNC12(dim) {
    const nc12Pow = tier => ([2, 4, 6].includes(tier) ? 9 - tier * 1.25 : 0);
    const ad = AntimatterDimension(dim);
    return ad.isProducing ? ad.multiplier.times(ad.totalAmount.pow(nc12Pow(dim))) : BEC.D1;
  },

  isNC12ProducingEven() {
    return this.evenDimNC12Production().gt(this.oddDimNC12Production());
  }
};
