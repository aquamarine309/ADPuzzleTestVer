export const sidebarResources = [
  // Note: ID 0 is interpreted in the Vue component as "the largest unlocked ID" - do not use ID 0
  {
    id: 1,
    optionName: "Blob",
    isAvailable: () => Themes.available().map(t => t.name).includes("S11"),
    // This is a dummy value to prevent vue errors
    value: () => new BE(1),
    formatValue: () => "\uE010",
    formatClass: "o-sidebar-currency--antimatter",
  },
  {
    id: 2,
    optionName: "Antimatter",
    isAvailable: () => true,
    value: () => Currency.antimatter.value,
    formatValue: x => format(x, 2, 1),
    formatClass: "o-sidebar-currency--antimatter",
  },
  {
    id: 3,
    optionName: "Infinity Points",
    isAvailable: () => PlayerProgress.infinityUnlocked(),
    value: () => Currency.infinityPoints.value.floor(),
    formatValue: x => format(x, 2),
    formatClass: "o-sidebar-currency--infinity",
  },
  {
    id: 4,
    optionName: "Logic Points",
    isAvailable: () => PlayerProgress.infinityUnlocked(),
    value: () => Currency.logicPoints,
    formatValue: x => format(x, 2),
    formatClass: "o-sidebar-currency--logic",
  },
  {
    id: 5,
    optionName: "Replicanti",
    isAvailable: () => Replicanti.areUnlocked || PlayerProgress.eternityUnlocked(),
    value: () => Replicanti.amount,
    formatValue: x => format(x, 2),
    formatClass: "o-sidebar-currency--replicanti",
  },
  {
    id: 6,
    optionName: "Eternity Points",
    isAvailable: () => PlayerProgress.eternityUnlocked(),
    value: () => Currency.eternityPoints.value.floor(),
    formatValue: x => format(x, 2),
    formatClass: "o-sidebar-currency--eternity",
  },
  {
    id: 7,
    optionName: "Total TT",
    isAvailable: () => PlayerProgress.eternityUnlocked(),
    value: () => player.timestudy.theorem.plus(TimeTheorems.calculateTimeStudiesCost()),
    formatValue: x => format(x, 2),
    formatClass: "o-sidebar-currency--eternity",
  },
  {
    id: 8,
    optionName: "Tachyon Particles",
    isAvailable: () => PlayerProgress.dilationUnlocked() || PlayerProgress.realityUnlocked(),
    value: () => Currency.tachyonParticles.value,
    formatValue: x => format(x, 2),
    formatClass: "o-sidebar-currency--dilation",
  },
  {
    id: 9,
    optionName: "Dilated Time",
    isAvailable: () => PlayerProgress.dilationUnlocked() || PlayerProgress.realityUnlocked(),
    value: () => Currency.dilatedTime.value,
    formatValue: x => format(x, 2),
    formatClass: "o-sidebar-currency--dilation",
  },
  {
    id: 10,
    optionName: "Reality Machines",
    isAvailable: () => PlayerProgress.realityUnlocked(),
    value: () => Currency.realityMachines.value,
    formatValue: x => format(x, 2),
    formatClass: "o-sidebar-currency--reality",
  },
  {
    id: 11,
    optionName: "Relic Shards",
    isAvailable: () => TeresaUnlocks.effarig.isUnlocked,
    value: () => new BE(Currency.relicShards.value),
    formatValue: x => format(x, 2),
    formatClass: "o-sidebar-currency--effarig",
  },
  {
    id: 12,
    optionName: "Imaginary Machines",
    isAvailable: () => MachineHandler.isIMUnlocked,
    value: () => new BE(Currency.imaginaryMachines.value),
    formatValue: x => format(x, 2),
    formatClass: "o-sidebar-currency--reality",
  },
  {
    id: 13,
    optionName: "All Machines",
    resourceName: "Machines",
    isAvailable: () => MachineHandler.isIMUnlocked,
    // This is a dummy value to prevent vue errors
    value: () => Currency.realityMachines.value,
    formatValue: () => formatMachines(Currency.realityMachines.value, Currency.imaginaryMachines.value),
    formatClass: "o-sidebar-currency--reality",
  },
  {
    id: 14,
    optionName: "Dark Matter",
    isAvailable: () => Laitela.isUnlocked,
    value: () => Currency.darkMatter,
    formatValue: x => format(x, 2),
    formatClass: "o-sidebar-currency--laitela",
  },
  {
    id: 15,
    optionName: "Dark Energy",
    isAvailable: () => Laitela.isUnlocked,
    value: () => new BE(Currency.darkEnergy.value),
    formatValue: x => format(x, 2, 2),
    formatClass: "o-sidebar-currency--laitela",
  },
  {
    id: 16,
    optionName: "Singularities",
    isAvailable: () => Laitela.isUnlocked,
    value: () => new BE(Currency.singularities.value),
    formatValue: x => format(x, 2),
    formatClass: "o-sidebar-currency--laitela",
  },
  {
    id: 17,
    optionName: "Reality Shards",
    isAvailable: () => Pelle.isDoomed,
    value: () => Currency.realityShards,
    formatValue: x => format(x, 2),
    formatClass: "o-sidebar-currency--pelle",
  },
];
