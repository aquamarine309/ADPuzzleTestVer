import { MultiplierTabHelper } from "./helper-functions.js";
import { MultiplierTabIcons } from "./icons.js";

// See index.js for documentation
export const galaxies = {
  // Note: none of the galaxy types use the global multiplier that applies to all of them within multValue, which
  // very slightly reduces performance impact and is okay because it's applied consistently
  antimatter: {
    name: "Antimatter Galaxies",
    displayOverride: () => {
      const num = player.galaxies.plus(GalaxyGenerator.galaxies);
      const mult = MultiplierTabHelper.globalGalaxyMult();
      return `${formatInt(num)}, ${formatX(mult, 2, 2)} strength`;
    },
    multValue: () => BE.pow10(player.galaxies.plus(GalaxyGenerator.galaxies)),
    isActive: true,
    icon: MultiplierTabIcons.ANTIMATTER,
  },
  replicanti: {
    name: "Replicanti Galaxies",
    displayOverride: () => {
      const num = Replicanti.galaxies.total;
      let rg = Replicanti.galaxies.bought;
      rg = rg.times(Effects.sum(TimeStudy(132), TimeStudy(133)).add(1));
      rg = rg.add(Replicanti.galaxies.extra);
      rg = rg.add(BE.min(Replicanti.galaxies.bought, ReplicantiUpgrade.galaxies.value).times
          (Effects.sum(EternityChallenge(8).reward)));
      const mult = rg.div(BE.clampMin(num, 1)).times(MultiplierTabHelper.globalGalaxyMult());
      return `${formatInt(num)}, ${formatX(mult, 2, 2)} strength`;
    },
    multValue: () => {
      let rg = Replicanti.galaxies.bought;
      rg = rg.times(Effects.sum(TimeStudy(132), TimeStudy(133)).add(1));
      rg = rg.add(Replicanti.galaxies.extra);
      rg = rg.add(BE.min(Replicanti.galaxies.bought, ReplicantiUpgrade.galaxies.value).times
          (Effects.sum(EternityChallenge(8).reward)));
      return BE.pow10(rg);
    },
    isActive: () => Replicanti.areUnlocked,
    icon: MultiplierTabIcons.SPECIFIC_GLYPH("replication"),
  },
  tachyon: {
    name: "Tachyon Galaxies",
    displayOverride: () => {
      const num = player.dilation.totalTachyonGalaxies;
      const mult = MultiplierTabHelper.globalGalaxyMult().times
          (BE.max(0, Replicanti.amount.log10().div(1e6).plus(1)).times(AlchemyResource.alternation.effectValue));
      return `${formatInt(num)}, ${formatX(mult, 2, 2)} strength`;
    },
    multValue: () => {
      const num = player.dilation.totalTachyonGalaxies;
      const mult = Replicanti.amount.log10().div(1e6).max(0).times(AlchemyResource.alternation.effectValue).plus(1);
      return BE.pow10(num.times(mult));
    },
    isActive: () => player.dilation.totalTachyonGalaxies.gt(0),
    icon: MultiplierTabIcons.SPECIFIC_GLYPH("dilation"),
  },
  nerfPelle: {
    name: "Doomed Reality",
    displayOverride: () => `All Galaxy strength /${formatInt(2)}`,
    powValue: 0.5,
    isActive: () => Pelle.isDoomed,
    icon: MultiplierTabIcons.PELLE,
  }
};
