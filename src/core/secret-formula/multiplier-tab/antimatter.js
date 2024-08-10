import { MultiplierTabIcons } from "./icons.js";
import { MultiplierTabHelper } from "./helper-functions.js";
import { BEC } from "../../constants.js";

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
    isActive: () => getAdjustedGlyphEffect("effarigantimatter").gt(1) && AntimatterDimension(1).isProducing,
    icon: MultiplierTabIcons.SPECIFIC_GLYPH("effarig"),
  },
  lc3AM: {
    name: "Logic Challenge 3",
    multValue: () => {
      return LC3Upgrade.adMult.effectValue.pow(MultiplierTabHelper.activeDimCount("AD"));
    },
    powValue: () => {
      return LC3Upgrade.adPow.effectValue;
    },
    isActive: () => LC3.isRunning,
    icon: MultiplierTabIcons.CHALLENGE("logic")
  },
  lc7AM: {
    name: "Logic Challenge 7",
    powValue: () => {
      const ad1 = AntimatterDimension(1);
      const baseProd = ad1.totalAmount.times(ad1.multiplier).times(Tickspeed.perSecond);
      return baseProd.log10().pow(LogicChallenge(7).effects.amPow.effectValue - 1);
    },
    isActive: () => LogicChallenge(7).canBeApplied,
    icon: MultiplierTabIcons.CHALLENGE("logic")
  }
};
