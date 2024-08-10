import { BEC } from "../../constants.js";

export const glyphSacrifice = {
  "power": {
    id: "power",
    effect: added => {
      if (Pelle.isDisabled("glyphsac")) return BEC.D0;
      const sac = player.reality.glyphs.sac.power.add(added ?? 0);
      const capped = sac.clampMax(GlyphSacrificeHandler.maxSacrificeForEffects);
      const base = capped.add(1).log10().div(GlyphSacrificeHandler.maxSacrificeForEffects.log10());
      return base.pow(1.2).times(750).floor();
    },
    description: amount => {
      const sacCap = GlyphSacrificeHandler.maxSacrificeForEffects;
      const nextDistantGalaxy = BE.pow10(amount.add(1).div(750).pow(1 / 1.2).times(Math.log10(sacCap))).minus(1);
      const nextGalaxyText = amount.lt(750)
        ? ` (next at ${format(nextDistantGalaxy, 2, 2)})`
        : "";
      return `Distant Galaxy scaling starts ${formatInt(amount)} later${nextGalaxyText}`;
    },
    cap: () => GlyphSacrificeHandler.maxSacrificeForEffects
  },
  "infinity": {
    id: "infinity",
    effect: added => {
      if (Pelle.isDisabled("glyphsac")) return BEC.D1;
      const sac = player.reality.glyphs.sac.infinity.add(added ?? 0);
      const capped = sac.clampMax(GlyphSacrificeHandler.maxSacrificeForEffects);
      return capped.pow(0.2).add(1).div(100).log10().add(1);
    },
    description: amount => `${formatX(amount, 2, 2)} bigger multiplier when buying 8th Infinity Dimension`,
    cap: () => GlyphSacrificeHandler.maxSacrificeForEffects
  },
  "time": {
    id: "time",
    effect: added => {
      if (Pelle.isDisabled("glyphsac")) return BEC.D1;
      const sac = player.reality.glyphs.sac.time.add(added ?? 0);
      const capped = sac.clampMax(GlyphSacrificeHandler.maxSacrificeForEffects);
      return capped.pow(0.2).div(100).add(1).pow(2);
    },
    description: amount => `${formatX(amount, 2, 2)} bigger multiplier when buying 8th Time Dimension`,
    cap: () => GlyphSacrificeHandler.maxSacrificeForEffects
  },
  "replication": {
    id: "replication",
    effect: added => {
      if (Pelle.isDisabled("glyphsac")) return BEC.D0;
      const sac = player.reality.glyphs.sac.replication.add(added ?? 0);
      const capped = sac.clampMax(GlyphSacrificeHandler.maxSacrificeForEffects);
      const base = capped.add(1).div(GlyphSacrificeHandler.maxSacrificeForEffects.log10());
      return base.pow(1.2).times(1500).floor();
    },
    description: amount => {
      const sacCap = GlyphSacrificeHandler.maxSacrificeForEffects;
      const nextDistantGalaxy = BE.pow10(amount.add(1).div(1500).pow(1 / 1.2).times(sacCap.log10())).minus(1);
      const nextGalaxyText = amount.lt(1500)
        ? ` (next at ${format(nextDistantGalaxy, 2, 2)})`
        : "";
      return `Replicanti Galaxy scaling starts ${formatInt(amount)} later${nextGalaxyText}`;
    },
    cap: () => GlyphSacrificeHandler.maxSacrificeForEffects
  },
  "dilation": {
    id: "dilation",
    effect: added => {
      if (Pelle.isDisabled("glyphsac")) return BEC.D1;
      const sac = player.reality.glyphs.sac.dilation.add(added ?? 0);
      const capped = sac.clampMax(GlyphSacrificeHandler.maxSacrificeForEffects);
      const exponent = capped.add(1).log10().div
        (GlyphSacrificeHandler.maxSacrificeForEffects.log10()).pow(0.1).times(0.32);
      return capped.clampMin(1).pow(exponent);
    },
    description: amount => `Multiply Tachyon Particle gain by ${formatX(amount, 2, 2)}`,
    cap: () => GlyphSacrificeHandler.maxSacrificeForEffects
  },
  "effarig": {
    id: "effarig",
    effect: added => {
      if (Pelle.isDisabled("glyphsac")) return BEC.D0;
      const sac = player.reality.glyphs.sac.effarig.add(added ?? 0);
      // This doesn't use the GlyphSacrificeHandler cap because it hits its cap (+100%) earlier
      const capped = sac.clampMax(BEC.E70);
      return capped.div(BEC.E20).add(1).log10().times(2);
    },
    description: amount => `+${formatPercents(amount.div(100), 2)} additional Glyph rarity`,
    cap: () => BEC.E70
  },
  "logic": {
    id: "logic",
    effect: added => {
      if (Pelle.isDisabled("glyphsac")) return BEC.D1;
      const sac = player.reality.glyphs.sac.logic.add(added ?? 0);
      return sac.pow(0.2).times(5).add(1);
    },
    description: amount => `Multiply Time Core gain by ${formatX(amount, 2, 3)}`,
    cap: () => GlyphSacrificeHandler.maxSacrificeForEffects
  },
  "reality": {
    id: "reality",
    effect: added => {
      if (Pelle.isDisabled("glyphsac")) return BEC.D0;
      const sac = player.reality.glyphs.sac.reality.add(added ?? 0);
      // This cap is only feasibly reached with the imaginary upgrade, but we still want to cap it at a nice number
      return sac.sqrt().div(15).add(1).toNumberMax(100);
    },
    description: amount => `Multiply Memory Chunk gain by ${formatX(amount, 2, 3)}`,
    cap: () => GlyphSacrificeHandler.maxSacrificeForEffects
  }
};
