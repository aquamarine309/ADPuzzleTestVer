import { BEC } from "../../constants.js";

export const GlyphCombiner = Object.freeze({
  /**
   * @param {BE[]} x
   * @returns {BE}
   */
  add: x => x.reduce(BE.sumReducer, BEC.D0),
  /**
   * @param {BE[]} x
   * @returns {BE}
   */
  multiply: x => x.reduce(BE.prodReducer, BEC.D1),
  /**
   * For exponents, the base value is 1, so when we add two exponents a and b we want to get a + b - 1,
   * so that if a and b are both close to 1 so is their sum. In general, when we add a list x of exponents,
   * we have to add 1 - x.length to the actual sum, so that if all the exponents are close to 1 the result
   * is also close to 1 rather than close to x.length.
   * @param {BE[]} x
   * @returns {BE}
   */
  addExponents: x => x.reduce(BE.sumReducer, new BE(1 - x.length))
});

// Make sure to add your effects to glyph-core.js orderedEffectList
export const glyphEffects = {
  timepow: {
    id: "timepow",
    glyphTypes: ["time"],
    singleDesc: "Time Dimension power +{value}",
    totalDesc: "Time Dimension multipliers ^{value}",
    shortDesc: "TD power +{value}",
    effect: (level, strength) => level.pow(0.32).times(Math.pow(strength, 0.45).div(75)).add(1.01),
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x.sub(1), 3, 3),
    combine: GlyphCombiner.addExponents,
    enabledInDoomed: true,
    isGenerated: true,
  },
  timespeed: {
    id: "timespeed",
    glyphTypes: ["time"],
    singleDesc: "Multiply game speed by {value}",
    totalDesc: "Game runs ×{value} faster",
    genericDesc: "Game speed multiplier",
    shortDesc: "Game speed ×{value}",
    effect: (level, strength) => (GlyphAlteration.isEmpowered("time")
      ? level.pow(0.35).add(1)
      : level.pow(0.3).times(Math.pow(strength, 0.65)).div(20)).add(1),
    formatEffect: x => format(x, 3, 3),
    combine: GlyphCombiner.multiply,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("time"),
    alterationType: ALTERATION_TYPE.EMPOWER,
    enabledInDoomed: true,
    isGenerated: true,
  },
  timeetermult: {
    id: "timeetermult",
    glyphTypes: ["time"],
    singleDesc: "Multiply Eternity gain by {value}",
    totalDesc: "Eternity gain ×{value}",
    genericDesc: "Eternity gain multiplier",
    shortDesc: "Eternities ×{value}",
    effect: (level, strength) => BE.pow((strength.add(3)).times(level), 0.9)
      .times(BE.pow(3, GlyphAlteration.sacrificeBoost("time"))),
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.multiply,
    alteredColor: () => GlyphAlteration.getBoostColor("time"),
    alterationType: ALTERATION_TYPE.BOOST,
    isGenerated: true,
  },
  timeEP: {
    id: "timeEP",
    glyphTypes: ["time"],
    singleDesc: () => (GlyphAlteration.isAdded("time")
      ? "Eternity Point gain \n×{value} [and ^]{value2}"
      : "Multiply Eternity Point gain by {value}"),
    totalDesc: () => (GlyphAlteration.isAdded("time")
      ? "Eternity Point gain ×{value} and ^{value2}"
      : "Eternity Point gain ×{value}"),
    genericDesc: () => (GlyphAlteration.isAdded("time")
      ? "Eternity Point gain multiplier and power"
      : "Eternity Point gain multiplier"),
    shortDesc: () => (GlyphAlteration.isAdded("time")
      ? "EP ×{value} and ^{value2}"
      : "EP ×{value}"),
    effect: (level, strength) => BE.pow(level.times(strength), 3).times(100),
    formatEffect: x => format(x, 2, 3),
    combine: GlyphCombiner.multiply,
    conversion: x => BE.log10(x).div(1000).add(1),
    formatSecondaryEffect: x => format(x, 4, 4),
    alteredColor: () => GlyphAlteration.getAdditionColor("time"),
    alterationType: ALTERATION_TYPE.ADDITION,
    isGenerated: true,
  },
  dilationDT: {
    id: "dilationDT",
    glyphTypes: ["dilation"],
    singleDesc: "Multiply Dilated Time gain by {value}",
    totalDesc: "Dilated Time gain ×{value}",
    shortDesc: "DT ×{value}",
    effect: (level, strength) => (GlyphAlteration.isEmpowered("dilation")
      ? BEC.D1_005.pow(level).times(15)
      : BE.pow(level.times(strength), 1.5).times(2)),
    formatEffect: x => format(x, 2, 1),
    combine: GlyphCombiner.multiply,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("dilation"),
    alterationType: ALTERATION_TYPE.EMPOWER,
    isGenerated: true,
  },
  dilationgalaxyThreshold: {
    id: "dilationgalaxyThreshold",
    glyphTypes: ["dilation"],
    singleDesc: "Tachyon Galaxy threshold multiplier ×{value}",
    genericDesc: "Tachyon Galaxy cost multiplier",
    shortDesc: "TG threshold ×{value}",
    effect: (level, strength) => level.pow(0.17).times(Math.pow(strength, 0.35)).div(100)
      .add(GlyphAlteration.sacrificeBoost("dilation").div(50)).neg().add(1),
    formatEffect: x => format(x, 3, 3),
    alteredColor: () => GlyphAlteration.getBoostColor("dilation"),
    alterationType: ALTERATION_TYPE.BOOST,
    combine: effects => {
      const prod = effects.reduce(BE.prodReducer, BEC.D1);
      return prod.lt(0.4)
        ? { value: BE.pow(prod.neg().add(0.4), 1.7).neg().add(0.4), capped: true }
        : { value: prod, capped: false };
    },
    enabledInDoomed: true,
    isGenerated: true,
  },
  dilationTTgen: {
    // TTgen slowly generates TT, value amount is per second, displayed per hour
    id: "dilationTTgen",
    glyphTypes: ["dilation"],
    singleDesc: () => (GlyphAlteration.isAdded("dilation")
      ? "Generates {value} Time Theorems/hour \n[and multiplies Time Theorem \ngeneration by] {value2}"
      : "Generates {value} Time Theorems per hour"),
    totalDesc: () => (GlyphAlteration.isAdded("dilation")
      ? "Generating {value} Time Theorems/hour and Time Theorem generation ×{value2}"
      : "Generating {value} Time Theorems per hour"),
    genericDesc: () => (GlyphAlteration.isAdded("dilation")
      ? "Time Theorem generation and multiplier"
      : "Time Theorem generation"),
    shortDesc: () => (GlyphAlteration.isAdded("dilation")
      ? "{value} TT/hr and TTgen ×{value2}"
      : "{value} TT/hr"),
    effect: (level, strength) => BE.pow(level.times(strength), 0.5).div(10000),
    /** @type {function(number): string} */
    formatEffect: x => format(x.times(3600), 2, 2),
    combine: GlyphCombiner.add,
    conversion: x => BE.max(BE.pow(x.times(10000), 1.6), 1),
    formatSecondaryEffect: x => format(x, 2, 2),
    alteredColor: () => GlyphAlteration.getAdditionColor("dilation"),
    alterationType: ALTERATION_TYPE.ADDITION,
    isGenerated: true,
  },
  dilationpow: {
    id: "dilationpow",
    glyphTypes: ["dilation"],
    singleDesc: "Antimatter Dimension power +{value} while Dilated",
    totalDesc: "Antimatter Dimension multipliers ^{value} while Dilated",
    genericDesc: "Antimatter Dimensions ^x while Dilated",
    shortDesc: "Dilated AD power +{value}",
    effect: (level, strength) => level.pow(0.7).times(Math.pow(strength, 0.7)).div(25).add(1.1),
    formatEffect: x => format(x, 2, 2),
    formatSingleEffect: x => format(x.sub(1), 2, 2),
    combine: GlyphCombiner.addExponents,
    enabledInDoomed: true,
    isGenerated: true,
  },
  replicationspeed: {
    id: "replicationspeed",
    glyphTypes: ["replication"],
    singleDesc: "Multiply Replication speed by {value}",
    totalDesc: "Replication speed ×{value}",
    genericDesc: "Replication speed multiplier",
    shortDesc: "Replication speed ×{value}",
    effect: (level, strength) => (GlyphAlteration.isEmpowered("replication")
      ? BEC.D1_007.pow(level).times(10)
      : BE.times(level, strength).times(3)),
    formatEffect: x => format(x, 2, 1),
    combine: GlyphCombiner.multiply,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("replication"),
    alterationType: ALTERATION_TYPE.EMPOWER,
    isGenerated: true,
  },
  replicationpow: {
    id: "replicationpow",
    glyphTypes: ["replication"],
    singleDesc: "Replicanti multiplier power +{value}",
    totalDesc: "Replicanti multiplier ^{value}",
    shortDesc: "Replicanti mult. power +{value}",
    effect: (level, strength) => level.pow(0.5).times(strength).div(25)
      .add(GlyphAlteration.sacrificeBoost("replication").times(3)).add(1.1),
    formatEffect: x => format(x, 2, 2),
    formatSingleEffect: x => format(x.sub(1), 2, 2),
    combine: GlyphCombiner.addExponents,
    alteredColor: () => GlyphAlteration.getBoostColor("replication"),
    alterationType: ALTERATION_TYPE.BOOST,
    enabledInDoomed: true,
    isGenerated: true,
  },
  replicationdtgain: {
    id: "replicationdtgain",
    glyphTypes: ["replication"],
    singleDesc: () => (GlyphAlteration.isAdded("replication")
      ? `Multiply Dilated Time \n[and Replicanti speed] by \n+{value} per ${format(BEC.E10000)} replicanti`
      : `Multiply Dilated Time gain by \n+{value} per ${format(BEC.E10000)} replicanti`),
    totalDesc: () => (GlyphAlteration.isAdded("replication")
      ? `Multiply Dilated Time and Replication speed by +{value} per ${format(BEC.E10000)} replicanti`
      : `Multiply Dilated Time gain by +{value} per ${format(BEC.E10000)} replicanti`),
    genericDesc: () => (GlyphAlteration.isAdded("replication")
      ? "Dilated Time+Replicanti mult from replicanti"
      : "Dilated Time gain multiplier from replicanti"),
    shortDesc: () => (GlyphAlteration.isAdded("replication")
      ? `×DT and repl. by +{value} per ${format(BEC.E10000)} replicanti`
      : `×DT by +{value} per ${format(BEC.E10000)} replicanti`),
    effect: (level, strength) => level.pow(0.3).times(Math.pow(strength, 0.65)).times(0.0003),
    formatEffect: x => format(x.times(10000), 2, 2),
    formatSingleEffect: x => format(x.times(10000), 2, 2),
    // It's bad to stack this one additively (N glyphs acts as a DT mult of N) or multiplicatively (the raw number is
    // less than 1), so instead we do a multiplicative stacking relative to the "base" effect of a level 1, 0% glyph.
    // We also introduce a 3x mult per glyph after the first, so that stacking level 1, 0% glyphs still has an effect.
    // This is still just a flat DT mult when stacking multiple glyphs, but at least it's bigger than 2 or 3.
    combine: effects => ({
      value: effects.length === 0 ? BEC.D0 : effects.reduce(BE.prodReducer, BE.pow(0.0001, 1 - effects.length)),
      capped: false
    }),
    conversion: x => x,
    formatSecondaryEffect: x => format(x, 2, 3),
    formatSingleSecondaryEffect: x => format(x, 5, 5),
    alteredColor: () => GlyphAlteration.getAdditionColor("replication"),
    alterationType: ALTERATION_TYPE.ADDITION,
    isGenerated: true,
  },
  replicationglyphlevel: {
    id: "replicationglyphlevel",
    glyphTypes: ["replication"],
    singleDesc: () => `Replicanti factor for Glyph level:\n ^${format(0.4, 1, 1)}
      ➜ ^(${format(0.4, 1, 1)} + {value})`,
    totalDesc: () => `Replicanti factor for Glyph level: ^${format(0.4, 1, 1)}
      ➜ ^(${format(0.4, 1, 1)} + {value})`,
    genericDesc: "Replicanti factor for Glyph level",
    shortDesc: "Replicanti pow. for level +{value}",
    effect: (level, strength) => BE.pow(level.pow(0.25).mul(Math.pow(strength, 0.4)), 0.5).div(50),
    formatEffect: x => format(x, 3, 3),
    combine: effects => {
      let sum = effects.reduce(BE.sumReducer, BEC.D0);
      if (effects.length > 2) sum = sum.times(6).div(effects.length + 4);
      return sum.gt(0.1)
        ? { value: (sum.sub(0.1)).div(5).add(0.1), capped: true }
        : { value: sum, capped: effects.length > 2 };
    },
    enabledInDoomed: true,
    isGenerated: true,
  },
  infinitypow: {
    id: "infinitypow",
    glyphTypes: ["infinity"],
    singleDesc: "Infinity Dimension power +{value}",
    totalDesc: "Infinity Dimension multipliers ^{value}",
    shortDesc: "ID power +{value}",
    effect: (level, strength) => level.pow(0.21).times(Math.pow(strength, 0.4)).div(75)
      .add(GlyphAlteration.sacrificeBoost("infinity").div(50)).add(1.007),
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x.sub(1), 3, 3),
    combine: GlyphCombiner.addExponents,
    alteredColor: () => GlyphAlteration.getBoostColor("infinity"),
    alterationType: ALTERATION_TYPE.BOOST,
    enabledInDoomed: true,
    isGenerated: true,
  },
  infinityrate: {
    id: "infinityrate",
    glyphTypes: ["infinity"],
    singleDesc: () => `Infinity Power conversion rate: \n^${formatInt(7)}
      ➜ ^(${formatInt(7)} + {value})`,
    totalDesc: () => `Infinity Power conversion rate: ^${formatInt(7)}
      ➜ ^(${formatInt(7)} + {value})`,
    genericDesc: "Infinity Power conversion rate",
    shortDesc: "Infinity Power conversion +{value}",
    effect: (level, strength) => level.pow(0.2).times(Math.pow(strength, 0.4)).div(25),
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.add,
    enabledInDoomed: true,
    isGenerated: true,
  },
  infinityIP: {
    id: "infinityIP",
    glyphTypes: ["infinity"],
    singleDesc: () => (GlyphAlteration.isAdded("infinity")
      ? "Infinity Point gain \n×{value} [and ^]{value2}"
      : "Multiply Infinity Point gain by {value}"),
    totalDesc: () => (GlyphAlteration.isAdded("infinity")
      ? "Infinity Point gain ×{value} and ^{value2}"
      : "Infinity Point gain ×{value}"),
    genericDesc: () => (GlyphAlteration.isAdded("infinity")
      ? "Infinity Point gain multiplier and power"
      : "Infinity Point gain multiplier"),
    shortDesc: () => (GlyphAlteration.isAdded("infinity")
      ? "IP ×{value} and ^{value2}"
      : "IP ×{value}"),
    effect: (level, strength) => BE.pow(level.times(strength.add(1)), 6).times(1e4),
    formatEffect: x => format(x, 2, 3),
    combine: GlyphCombiner.multiply,
    // eslint-disable-next-line no-negated-condition
    softcap: value => ((Effarig.eternityCap !== undefined) ? BE.min(value, Effarig.eternityCap) : value),
    conversion: x => BE.log10(x).div(1800).add(1),
    formatSecondaryEffect: x => format(x, 4, 4),
    alteredColor: () => GlyphAlteration.getAdditionColor("infinity"),
    alterationType: ALTERATION_TYPE.ADDITION,
    isGenerated: true,
  },
  infinityinfmult: {
    id: "infinityinfmult",
    glyphTypes: ["infinity"],
    singleDesc: "Multiply Infinity gain by {value}",
    totalDesc: "Infinity gain ×{value}",
    genericDesc: "Infinity gain multiplier",
    shortDesc: "Infinities ×{value}",
    effect: (level, strength) => (GlyphAlteration.isEmpowered("infinity")
      ? BEC.D1_02.pow(level)
      : BE.pow(level.times(strength), 1.5).times(2)),
    formatEffect: x => format(x, 2, 1),
    combine: GlyphCombiner.multiply,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("infinity"),
    alterationType: ALTERATION_TYPE.EMPOWER,
    isGenerated: true,
  },
  powerpow: {
    id: "powerpow",
    glyphTypes: ["power"],
    singleDesc: () => (GlyphAlteration.isAdded("power")
      ? "Antimatter Dimension power +{value}\n[and Antimatter Galaxy cost ×]{value2}"
      : "Antimatter Dimension power +{value}"),
    totalDesc: () => (GlyphAlteration.isAdded("power")
      ? "Antimatter Dimension multipliers ^{value} and Antimatter Galaxy cost ×{value2}"
      : "Antimatter Dimension multipliers ^{value}"),
    genericDesc: () => (GlyphAlteration.isAdded("power")
      ? "Antimatter Dimensions multipliers ^x and Antimatter Galaxy cost multiplier"
      : "Antimatter Dimension multipliers ^x"),
    shortDesc: () => (GlyphAlteration.isAdded("power")
      ? "AD power +{value} and AG cost ×{value2}"
      : "AD power +{value}"),
    effect: (level, strength) => level.pow(0.2).times(Math.pow(strength, 0.4)).div(75).add(1.015),
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x.sub(1), 3, 3),
    combine: GlyphCombiner.addExponents,
    conversion: x => BEC.D2.div(x.add(1)),
    formatSecondaryEffect: x => format(x, 3, 3),
    alteredColor: () => GlyphAlteration.getAdditionColor("power"),
    alterationType: ALTERATION_TYPE.ADDITION,
    enabledInDoomed: true,
    isGenerated: true,
  },
  powermult: {
    id: "powermult",
    glyphTypes: ["power"],
    singleDesc: "Antimatter Dimension multipliers ×{value}",
    shortDesc: "AD ×{value}",
    effect: (level, strength) => (GlyphAlteration.isEmpowered("power")
      ? BEC.D11111.pow(level.times(220))
      : BE.tetrate(level.times(strength).times(10), 2)),
    formatEffect: x => formatPostBreak(x, 2, 0),
    combine: GlyphCombiner.multiply,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("power"),
    alterationType: ALTERATION_TYPE.EMPOWER,
    enabledInDoomed: true,
    isGenerated: true,
  },
  powerdimboost: {
    id: "powerdimboost",
    glyphTypes: ["power"],
    singleDesc: "Dimension Boost multiplier ×{value}",
    genericDesc: "Dimension Boost multiplier",
    shortDesc: "Dimboost mult. ×{value}",
    effect: (level, strength) => BE.pow(level.times(strength), 0.5)
      .times(BE.pow(GlyphAlteration.sacrificeBoost("power").add(1), 3)),
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.multiply,
    alteredColor: () => GlyphAlteration.getBoostColor("power"),
    alterationType: ALTERATION_TYPE.BOOST,
    enabledInDoomed: true,
    isGenerated: true,
  },
  powerbuy10: {
    id: "powerbuy10",
    glyphTypes: ["power"],
    singleDesc: () => `Increase the bonus from buying ${formatInt(10)} Antimatter Dimensions by {value}`,
    totalDesc: () => `Multiplier from "Buy ${formatInt(10)}" ×{value}`,
    genericDesc: () => `"Buy ${formatInt(10)}" bonus increase`,
    shortDesc: () => `AD "Buy ${formatInt(10)}" mult. ×{value}`,
    effect: (level, strength) => level.times(strength).div(12).add(1),
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.addExponents,
    enabledInDoomed: true,
    isGenerated: true,
  },
  effarigrm: {
    id: "effarigrm",
    glyphTypes: ["effarig"],
    singleDesc: "Reality Machine multiplier ×{value}",
    genericDesc: "Reality Machine multiplier",
    shortDesc: "RM ×{value}",
    effect: (level, strength) => (GlyphAlteration.isEmpowered("effarig")
      ? level.pow(1.5)
      : level.pow(0.6).times(strength)),
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.multiply,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("effarig"),
    alterationType: ALTERATION_TYPE.EMPOWER,
    isGenerated: true,
  },
  effarigglyph: {
    id: "effarigglyph",
    glyphTypes: ["effarig"],
    singleDesc: "Glyph Instability starting level +{value}",
    genericDesc: "Glyph Instability delay",
    shortDesc: "Instability delay +{value}",
    effect: (level, strength) => BE.floor(BE.pow(level.times(strength), 0.5).times(10)),
    formatEffect: x => formatInt(x),
    combine: GlyphCombiner.add,
    isGenerated: true,
  },
  effarigblackhole: {
    id: "effarigblackhole",
    glyphTypes: ["effarig"],
    singleDesc: "Game speed power +{value}",
    totalDesc: "Game speed ^{value}",
    genericDesc: "Game speed ^x",
    shortDesc: "Game speed power +{value}",
    effect: (level, strength) => level.pow(0.25).times(Math.pow(strength, 0.4)).div(75).add(1),
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x.sub(1), 3, 3),
    combine: GlyphCombiner.addExponents,
    isGenerated: true,
  },
  effarigachievement: {
    id: "effarigachievement",
    glyphTypes: ["effarig"],
    singleDesc: "Achievement multiplier power +{value}",
    totalDesc: "Achievement multiplier ^{value}",
    genericDesc: "Achievement multiplier ^x",
    shortDesc: "Achievement mult. power +{value}",
    effect: (level, strength) => level.pow(0.4).times(Math.pow(strength, 0.6)).div(60)
      .add(GlyphAlteration.sacrificeBoost("effarig").div(10)).add(1),
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x.sub(1), 3, 3),
    combine: GlyphCombiner.addExponents,
    alteredColor: () => GlyphAlteration.getBoostColor("effarig"),
    alterationType: ALTERATION_TYPE.BOOST,
    isGenerated: true,
  },
  effarigforgotten: {
    id: "effarigforgotten",
    glyphTypes: ["effarig"],
    singleDesc: () => (GlyphAlteration.isAdded("effarig")
      ? `"Buy ${formatInt(10)}" multiplier ^{value} [and\nDimension Boost multiplier ^]{value2}`
      : `Bonus from buying ${formatInt(10)} Dimensions ^{value}`),
    totalDesc: () => (GlyphAlteration.isAdded("effarig")
      ? `Multiplier from "Buy ${formatInt(10)}" ^{value} and Dimension Boost multiplier ^{value2}`
      : `Multiplier from "Buy ${formatInt(10)}" ^{value}`),
    genericDesc: () => (GlyphAlteration.isAdded("effarig")
      ? `"Buy ${formatInt(10)}" and Dimension Boost multipliers ^x`
      : `"Buy ${formatInt(10)}" multiplier ^x`),
    shortDesc: () => (GlyphAlteration.isAdded("effarig")
      ? `Buy ${formatInt(10)} mult. ^{value}, Dimboost mult. ^{value2}`
      : `Buy ${formatInt(10)} mult. ^{value}`),
    effect: (level, strength) => BEC.D2.times(level.pow(0.25)).times(Math.pow(strength, 0.4)).add(1),
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.multiply,
    conversion: x => BE.pow(x, 0.4),
    formatSecondaryEffect: x => format(x, 2, 2),
    alteredColor: () => GlyphAlteration.getAdditionColor("effarig"),
    alterationType: ALTERATION_TYPE.ADDITION,
    isGenerated: true,
  },
  effarigdimensions: {
    id: "effarigdimensions",
    glyphTypes: ["effarig"],
    singleDesc: "All Dimension power +{value}",
    totalDesc: "All Dimension multipliers ^{value}",
    genericDesc: "All Dimension multipliers ^x",
    shortDesc: "All Dimension power +{value}",
    effect: (level, strength) => level.pow(0.25).times(Math.pow(strength, 0.4)).div(500).add(1),
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x.sub(1), 3, 3),
    combine: GlyphCombiner.addExponents,
    isGenerated: true,
  },
  effarigantimatter: {
    id: "effarigantimatter",
    glyphTypes: ["effarig"],
    singleDesc: () => `Antimatter production:\n${formatInt(10)}^x ➜ ${formatInt(10)}^(x^{value})`,
    genericDesc: "Antimatter production exponent power",
    shortDesc: "AM production exponent ^{value}",
    effect: (level, strength) => level.pow(0.25).times(Math.pow(strength, 0.4)).div(5000).add(1),
    formatEffect: x => format(x, 4, 4),
    combine: GlyphCombiner.multiply,
    isGenerated: true,
  },
  timeshardpow: {
    id: "timeshardpow",
    // This gets explicitly added to time glyphs elsewhere (once unlocked)
    glyphTypes: [],
    singleDesc: "Time Shard power +{value}",
    totalDesc: "Time Shard gain ^{value}",
    genericDesc: "Time Shards ^x",
    shortDesc: "Time Shard power +{value}",
    effect: (level, strength) => (strength.div(3.5)).times(level.pow(0.35)).div(400).add(1),
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x.sub(1), 3, 3),
    combine: GlyphCombiner.addExponents,
    enabledInDoomed: true,
    isGenerated: false,
  },
  cursedgalaxies: {
    id: "cursedgalaxies",
    glyphTypes: ["cursed"],
    singleDesc: `All Galaxies are {value} weaker`,
    totalDesc: "All Galaxy strength -{value}",
    shortDesc: "Galaxy Strength -{value}",
    // Multiplies by 0.768 per glyph
    effect: level => level.pow(0.03).recip(),
    formatEffect: x => formatPercents(x.neg().add(1), 2),
    combine: GlyphCombiner.multiply,
    isGenerated: false,
  },
  curseddimensions: {
    id: "curseddimensions",
    glyphTypes: ["cursed"],
    singleDesc: "All Dimension multipliers ^{value}",
    shortDesc: "All Dimensions ^{value}",
    // Multiplies by 0.734 per glyph
    effect: level => level.pow(0.035).recip(),
    formatEffect: x => format(x, 3, 3),
    combine: GlyphCombiner.multiply,
    isGenerated: false,
  },
  cursedtickspeed: {
    id: "cursedtickspeed",
    glyphTypes: ["cursed"],
    singleDesc: "The threshold for Tickspeed Upgrades from Time Dimensions is multiplied by ×{value}",
    totalDesc: "The threshold for Tickspeed Upgrades from Time Dimensions is increased by ×{value}",
    shortDesc: "TD Tickspeed threshold ×{value}",
    // Additive 3.82 per glyph
    effect: level => BE.max(BE.log10(level), 1),
    formatEffect: x => format(x, 3, 3),
    combine: GlyphCombiner.add,
    isGenerated: false,
  },
  cursedEP: {
    id: "cursedEP",
    glyphTypes: ["cursed"],
    singleDesc: "Divide Eternity Point gain by {value}",
    totalDesc: "Eternity Point gain / {value}",
    shortDesc: "EP / {value}",
    // Divides e666.6 per glyph
    effect: level => BE.pow10(level.div(10).neg()),
    formatEffect: x => format(x.reciprocal()),
    combine: GlyphCombiner.multiply,
    isGenerated: false,
  },
  realityglyphlevel: {
    id: "realityglyphlevel",
    glyphTypes: ["reality"],
    singleDesc: "Increase the effective level of equipped basic Glyphs by {value}",
    totalDesc: "Equipped basic Glyph level +{value}",
    shortDesc: "Basic Glyph Level +{value}",
    effect: level => BE.floor(BE.sqrt(BE.mul(level, 90))),
    formatEffect: x => formatInt(x),
    combine: GlyphCombiner.add,
    isGenerated: false,
  },
  realitygalaxies: {
    id: "realitygalaxies",
    glyphTypes: ["reality"],
    singleDesc: "All Galaxies are {value} stronger",
    totalDesc: "All Galaxy strength +{value}",
    shortDesc: "Galaxy Strength +{value}",
    effect: level => BE.pow(level.div(100000), 0.5).add(1),
    formatEffect: x => formatPercents(x.sub(1), 2),
    combine: GlyphCombiner.multiply,
    isGenerated: false,
  },
  realityrow1pow: {
    id: "realityrow1pow",
    glyphTypes: ["reality"],
    singleDesc: "Multiplier from Reality Upgrade Amplifiers ^{value}",
    totalDesc: "Reality Upgrade Amplifier multiplier ^{value}",
    shortDesc: "Amplifier Multiplier ^{value}",
    effect: level => level.div(1.25e5).add(1),
    formatEffect: x => format(x, 3, 3),
    combine: GlyphCombiner.addExponents,
    isGenerated: false,
  },
  realityDTglyph: {
    id: "realityDTglyph",
    glyphTypes: ["reality"],
    singleDesc: () => `Dilated Time factor for Glyph level: \n^${format(1.3, 1, 1)}
      ➜ ^(${format(1.3, 1, 1)} + {value})`,
    totalDesc: () => `Dilated Time factor for Glyph level: ^${format(1.3, 1, 1)}
      ➜ ^(${format(1.3, 1, 1)} + {value})`,
    genericDesc: "Dilated Time factor for Glyph level",
    shortDesc: "DT pow. for level +{value}",
    // You can only get this effect on level 25000 reality glyphs anyway, might as well make it look nice
    effect: level => BE.sqrt(level.div(10)).div(500),
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.add,
    isGenerated: false,
  },
  companiondescription: {
    id: "companiondescription",
    glyphTypes: ["companion"],
    singleDesc: "It does nothing but sit there and cutely smile at you, whisper into your dreams politely, " +
      "and plot the demise of all who stand against you. This one-of-a-kind Glyph will never leave you.",
    totalDesc: "+{value} happiness",
    shortDesc: "Doesn't want to hurt you",
    effect: () => {
      if (Enslaved.isRunning) return 0;
      const cursedCount = Glyphs.active.countWhere(g => g?.type === "cursed");
      if (cursedCount > 0) return Math.pow(0.2 + 0.2 * Math.random(), cursedCount);
      return 0.4 + 0.6 * Math.random();
    },
    formatEffect: x => formatPercents(x, 2, 2),
    combine: GlyphCombiner.add,
    enabledInDoomed: true,
    isGenerated: false,
  },
  companionEP: {
    id: "companionEP",
    glyphTypes: ["companion"],
    singleDesc: "Thanks for your dedication for the game! You reached {value} Eternity Points on your first Reality.",
    shortDesc: "It loves you very, very much",
    totalDesc: () => ((Enslaved.isRunning || Glyphs.active.countWhere(g => g?.type === "cursed")) ? "Help me" : "Yay!"),
    // The EP value for this is entirely encoded in rarity, but level needs to be present to
    // make sure the proper parameter is being used. The actual glyph level shouldn't do anything.
    // eslint-disable-next-line no-unused-vars
    effect: (level, strength) => BE.pow10(BEC.E6.times(strengthToRarity(strength))),
    formatEffect: x => formatPostBreak(x, 2),
    combine: GlyphCombiner.multiply,
    enabledInDoomed: true,
    isGenerated: false,
  },
  logicpow: {
    id: "logicpow",
    glyphTypes: ["logic"],
    singleDesc: "Logic Point power +{value}",
    totalDesc: "Logic Point multiplier ^{value}",
    shortDesc: "LP power +{value}",
    effect: (level, strength) => (GlyphAlteration.isEmpowered("logic")
      ? level.pow(0.3).div(32).add(1)
      : level.pow(0.25).times(Math.pow(strength, 0.4)).div(125).add(1)),
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x.sub(1), 3, 3),
    combine: GlyphCombiner.multiply,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("logic"),
    alterationType: ALTERATION_TYPE.EMPOWER,
    isGenerated: true,
  }
};
