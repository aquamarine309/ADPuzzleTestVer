import { BEC } from "../../constants.js";

import { MultiplierTabHelper } from "./helper-functions.js";
import { MultiplierTabIcons } from "./icons.js";

// See index.js for documentation
export const tickspeed = {
  total: {
    name: "Total Tickspeed",
    displayOverride: () => {
      const tickRate = Tickspeed.perSecond;
      const activeDims = MultiplierTabHelper.activeDimCount("AD");
      const dimString = MultiplierTabHelper.pluralizeDimensions(activeDims);
      return `${format(tickRate, 2, 2)}/sec on ${formatInt(activeDims)} ${dimString}
        ➜ ${formatX(tickRate.pow(activeDims), 2, 2)}`;
    },
    // This is necessary to make multValue entries from the other props scale properly, which are also all pow10
    // due to the multiplier tab splitting up entries logarithmically
    fakeValue: BEC.E100,
    multValue: () => Tickspeed.perSecond.pow(MultiplierTabHelper.activeDimCount("AD")),
    // No point in showing this breakdown at all unless both components are nonzero; however they will always be nonzero
    // due to the way the calculation works, so we have to manually hide it here
    isActive: () => Tickspeed.perSecond.gt(1) && effectiveBaseGalaxies().gt(0),
    dilationEffect: () => (Effarig.isRunning ? Effarig.tickDilation : 1),
    overlay: ["<i class='fa-solid fa-clock' />"],
    icon: MultiplierTabIcons.TICKSPEED,
  },
  base: {
    name: "Base Tickspeed from Achievements",
    displayOverride: () => {
      const val = BEC.D1.dividedByEffectsOf(
        Achievement(36),
        Achievement(45),
        Achievement(66),
        Achievement(83)
      );
      return `${format(val, 2, 2)}/sec`;
    },
    multValue: () => new BE.pow10(MultiplierTabHelper.decomposeTickspeed().base.times(100)),
    isActive: () => [36, 45, 66, 83].some(a => Achievement(a).canBeApplied),
    icon: MultiplierTabIcons.ACHIEVEMENT,
  },
  upgrades: {
    name: "Tickspeed Upgrades",
    displayOverride: () => `${formatInt(Tickspeed.totalUpgrades)} Total`,
    multValue: () => new BE.pow10(MultiplierTabHelper.decomposeTickspeed().tickspeed.times(100)),
    isActive: true,
    icon: MultiplierTabIcons.PURCHASE("AD"),
  },
  galaxies: {
    name: "Galaxies",
    displayOverride: () => {
      const ag = player.galaxies.plus(GalaxyGenerator.galaxies);
      const rg = Replicanti.galaxies.total;
      const tg = player.dilation.totalTachyonGalaxies;
      return `${formatInt(ag.add(rg).add(tg))} Total`;
    },
    multValue: () => new BE.pow10(MultiplierTabHelper.decomposeTickspeed().galaxies.times(100)),
    isActive: true,
    icon: MultiplierTabIcons.GALAXY,
  },
  pelleTickspeedPow: {
    name: "Tickspeed Dilation Upgrade",
    powValue: () => DilationUpgrade.tickspeedPower.effectValue,
    isActive: () => DilationUpgrade.tickspeedPower.canBeApplied,
    icon: MultiplierTabIcons.UPGRADE("dilation"),
  },
};

export const tickspeedUpgrades = {
  purchased: {
    name: "Purchased Tickspeed Upgrades",
    displayOverride: () => (Laitela.continuumActive
      ? formatFloat(Tickspeed.continuumValue, 2, 2)
      : formatInt(player.totalTickBought)),
    multValue: () => BE.pow10(Laitela.continuumActive ? Tickspeed.continuumValue : player.totalTickBought),
    isActive: () => true,
    icon: MultiplierTabIcons.PURCHASE("AD"),
  },
  free: {
    name: "Tickspeed Upgrades from TD",
    displayOverride: () => formatInt(player.totalTickGained),
    multValue: () => BE.pow10(player.totalTickGained),
    isActive: () => Currency.timeShards.gt(0),
    icon: MultiplierTabIcons.SPECIFIC_GLYPH("time"),
  }
};
