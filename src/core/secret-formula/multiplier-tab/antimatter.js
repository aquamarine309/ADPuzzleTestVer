import { MultiplierTabIcons } from "./icons.js";

// See index.js for documentation
export const AM = {
  total: {
    name: "Antimatter Production",
    displayOverride: () => `${format(Currency.antimatter.productionPerSecond, 2, 2)}/sec`,
    multValue: () => new BE(Currency.antimatter.productionPerSecond).clampMin(1),
    isActive: true,
    overlay: ["<i class='fas fa-atom' />"],
  },
  effarigAM: {
    name: "Glyph Effect - Effarig Antimatter Production",
    powValue: () => {
      const ad1 = AntimatterDimension(1);
      const baseProd = ad1.totalAmount.times(ad1.multiplier).times(Tickspeed.perSecond);
      return baseProd.log10().pow(getAdjustedGlyphEffect("effarigantimatter").minus(1));
    },
    isActive: () => getAdjustedGlyphEffect("effarigantimatter") > 1 && AntimatterDimension(1).isProducing,
    icon: MultiplierTabIcons.SPECIFIC_GLYPH("effarig"),
  }
};
