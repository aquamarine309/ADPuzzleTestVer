import { BEC } from "../../constants.js";

export const elements = [
  {
    id: 1,
    name: "H",
    fullName: "Hydrogen",
    position: [0, 0],
    type: ELEMENT_TYPE.NON_METALLIC,
    description: () => `Infinity Upgrades are automatically purchased
        at ${formatInt(1)} IP less than their original price.`,
    cost: BEC.E256
  },
  {
    id: 2,
    name: "He",
    position: [0, 17],
    type: ELEMENT_TYPE.NOBLE_GAS,
    description: "Improve the effects of challenges.",
    cost: BEC.E820
  },
  {
    id: 3,
    name: "Li",
    position: [1, 0],
    type: ELEMENT_TYPE.METALLIC,
    description: () => `Logic Point multiplier ${formatPow(1.8, 0, 1)}.`,
    effect: 1.8,
    cost: BEC.E4000
  },
  {
    id: 4,
    name: "Be",
    position: [1, 1],
    type: ELEMENT_TYPE.METALLIC,
    description: "Reduce the goal of Logic Challenge.",
    cost: BEC.E13200
  },
  {
    id: 5,
    name: "Be",
    position: [1, 12],
    type: ELEMENT_TYPE.NON_METALLIC,
    cost: BEC.EE404
  },
  {
    id: 6,
    name: "C",
    position: [1, 13],
    type: ELEMENT_TYPE.NON_METALLIC,
    cost: BEC.EE404
  },
  {
    id: 7,
    name: "N",
    position: [1, 14],
    type: ELEMENT_TYPE.NON_METALLIC,
    cost: BEC.EE404
  },
  {
    id: 8,
    name: "O",
    position: [1, 15],
    type: ELEMENT_TYPE.NON_METALLIC,
    cost: BEC.EE404
  },
  {
    id: 9,
    name: "F",
    position: [1, 16],
    type: ELEMENT_TYPE.NON_METALLIC,
    cost: BEC.EE404
  },
  {
    id: 10,
    name: "Ne",
    position: [1, 17],
    type: ELEMENT_TYPE.NOBLE_GAS,
    cost: BEC.EE404
  },
  {
    id: 11,
    name: "Na",
    position: [2, 0],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 12,
    name: "Mg",
    position: [2, 1],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 13,
    name: "Al",
    position: [2, 12],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 14,
    name: "Si",
    position: [2, 13],
    type: ELEMENT_TYPE.NON_METALLIC,
    cost: BEC.EE404
  },
  {
    id: 15,
    name: "P",
    position: [2, 14],
    type: ELEMENT_TYPE.NON_METALLIC,
    cost: BEC.EE404
  },
  {
    id: 16,
    name: "S",
    position: [2, 15],
    type: ELEMENT_TYPE.NON_METALLIC,
    cost: BEC.EE404
  },
  {
    id: 17,
    name: "Cl",
    position: [2, 16],
    type: ELEMENT_TYPE.NON_METALLIC,
    cost: BEC.EE404
  },
  {
    id: 18,
    name: "Ar",
    position: [2, 17],
    type: ELEMENT_TYPE.NOBLE_GAS,
    cost: BEC.EE404
  },
  {
    id: 19,
    name: "K",
    position: [3, 0],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 20,
    name: "Ca",
    position: [3, 1],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 21,
    name: "Sc",
    position: [3, 2],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 22,
    name: "Ti",
    position: [3, 3],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 23,
    name: "V",
    position: [3, 4],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 24,
    name: "Cr",
    position: [3, 5],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 25,
    name: "Mn",
    position: [3, 6],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 26,
    name: "Fe",
    position: [3, 7],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 27,
    name: "Co",
    position: [3, 8],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 28,
    name: "Ni",
    position: [3, 9],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 29,
    name: "Cu",
    position: [3, 10],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 30,
    name: "Zn",
    position: [3, 11],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 31,
    name: "Ga",
    position: [3, 12],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 32,
    name: "Ge",
    position: [3, 13],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 33,
    name: "As",
    position: [3, 14],
    type: ELEMENT_TYPE.NON_METALLIC,
    cost: BEC.EE404
  },
  {
    id: 34,
    name: "Se",
    position: [3, 15],
    type: ELEMENT_TYPE.NON_METALLIC,
    cost: BEC.EE404
  },
  {
    id: 35,
    name: "Br",
    position: [3, 16],
    type: ELEMENT_TYPE.NON_METALLIC,
    cost: BEC.EE404
  },
  {
    id: 36,
    name: "Kr",
    position: [3, 17],
    type: ELEMENT_TYPE.NOBLE_GAS,
    cost: BEC.EE404
  },
  {
    id: 37,
    name: "Rb",
    position: [4, 0],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 38,
    name: "Sr",
    position: [4, 1],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 39,
    name: "Y",
    position: [4, 2],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 40,
    name: "Zr",
    position: [4, 3],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 41,
    name: "Nb",
    position: [4, 4],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 42,
    name: "Mo",
    position: [4, 5],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 43,
    name: "Tc",
    position: [4, 6],
    radioactive: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 44,
    name: "Ru",
    position: [4, 7],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 45,
    name: "Rh",
    position: [4, 8],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 46,
    name: "Pd",
    position: [4, 9],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 47,
    name: "Ag",
    position: [4, 10],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 48,
    name: "Cd",
    position: [4, 11],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 49,
    name: "In",
    position: [4, 12],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 50,
    name: "Sn",
    position: [4, 13],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 51,
    name: "Sb",
    position: [4, 14],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 52,
    name: "Te",
    position: [4, 15],
    type: ELEMENT_TYPE.NON_METALLIC,
    cost: BEC.EE404
  },
  {
    id: 53,
    name: "I",
    position: [4, 16],
    type: ELEMENT_TYPE.NON_METALLIC,
    cost: BEC.EE404
  },
  {
    id: 54,
    name: "Xe",
    position: [4, 17],
    type: ELEMENT_TYPE.NOBLE_GAS,
    cost: BEC.EE404
  },
  {
    id: 55,
    name: "Cs",
    position: [5, 0],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 56,
    name: "Ba",
    position: [5, 1],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 57,
    name: "La",
    position: [5, 2],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 58,
    name: "Ce",
    position: [8, 3],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 59,
    name: "Pr",
    position: [8, 4],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 60,
    name: "Nd",
    position: [8, 5],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 61,
    name: "Pm",
    position: [8, 6],
    radioactive: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 62,
    name: "Sm",
    position: [8, 7],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 63,
    name: "Eu",
    position: [8, 8],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 64,
    name: "Gd",
    position: [8, 9],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 65,
    name: "Tb",
    position: [8, 10],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 66,
    name: "Dy",
    position: [8, 11],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 67,
    name: "Ho",
    position: [8, 12],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 68,
    name: "Er",
    position: [8, 13],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 69,
    name: "Tm",
    position: [8, 14],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 70,
    name: "Yb",
    position: [8, 15],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 71,
    name: "Lu",
    position: [8, 16],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 72,
    name: "Hf",
    position: [5, 3],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 73,
    name: "Ta",
    position: [5, 4],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 74,
    name: "W",
    position: [5, 5],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 75,
    name: "Re",
    position: [5, 6],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 76,
    name: "Os",
    position: [5, 7],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 77,
    name: "Ir",
    position: [5, 8],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 78,
    name: "Pt",
    position: [5, 9],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 79,
    name: "Au",
    position: [5, 10],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 80,
    name: "Hg",
    position: [5, 11],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 81,
    name: "Tl",
    position: [5, 12],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 82,
    name: "Pb",
    position: [5, 13],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 83,
    name: "Bi",
    position: [5, 14],
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 84,
    name: "Po",
    position: [5, 15],
    radioactive: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 85,
    name: "At",
    position: [5, 16],
    radioactive: true,
    type: ELEMENT_TYPE.NON_METALLIC,
    cost: BEC.EE404
  },
  {
    id: 86,
    name: "Rn",
    position: [5, 17],
    radioactive: true,
    type: ELEMENT_TYPE.NOBLE_GAS,
    cost: BEC.EE404
  },
  {
    id: 87,
    name: "Fr",
    position: [6, 0],
    radioactive: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 88,
    name: "Ra",
    position: [6, 1],
    radioactive: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 89,
    name: "Ac",
    position: [6, 2],
    radioactive: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 90,
    name: "Th",
    position: [9, 3],
    radioactive: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 91,
    name: "Pa",
    position: [9, 4],
    radioactive: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 92,
    name: "U",
    position: [9, 5],
    radioactive: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 93,
    name: "Np",
    position: [9, 6],
    radioactive: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 94,
    name: "Pu",
    position: [9, 7],
    radioactive: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 95,
    name: "Am",
    position: [9, 8],
    radioactive: true,
    artificial: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 96,
    name: "Cm",
    position: [9, 9],
    radioactive: true,
    artificial: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 97,
    name: "Bk",
    position: [9, 10],
    radioactive: true,
    artificial: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 98,
    name: "Cf",
    position: [9, 11],
    radioactive: true,
    artificial: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 99,
    name: "Es",
    position: [9, 12],
    radioactive: true,
    artificial: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 100,
    name: "Fm",
    position: [9, 13],
    radioactive: true,
    artificial: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 101,
    name: "Md",
    position: [9, 14],
    radioactive: true,
    artificial: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 102,
    name: "No",
    position: [9, 15],
    radioactive: true,
    artificial: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 103,
    name: "Lr",
    position: [9, 16],
    radioactive: true,
    artificial: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 104,
    name: "Rf",
    position: [6, 3],
    radioactive: true,
    artificial: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 105,
    name: "Db",
    position: [6, 4],
    radioactive: true,
    artificial: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 106,
    name: "Sg",
    position: [6, 5],
    radioactive: true,
    artificial: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 107,
    name: "Bh",
    position: [6, 6],
    radioactive: true,
    artificial: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 108,
    name: "Hs",
    position: [6, 7],
    radioactive: true,
    artificial: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 109,
    name: "Mt",
    position: [6, 8],
    radioactive: true,
    artificial: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 110,
    name: "Ds",
    position: [6, 9],
    radioactive: true,
    artificial: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 111,
    name: "Rg",
    position: [6, 10],
    radioactive: true,
    artificial: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 112,
    name: "Cn",
    position: [6, 11],
    radioactive: true,
    artificial: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 113,
    name: "Nh",
    position: [6, 12],
    radioactive: true,
    artificial: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 114,
    name: "Fl",
    position: [6, 13],
    radioactive: true,
    artificial: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 115,
    name: "Mc",
    position: [6, 14],
    radioactive: true,
    artificial: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 116,
    name: "Lv",
    position: [6, 15],
    radioactive: true,
    artificial: true,
    type: ELEMENT_TYPE.METALLIC,
    cost: BEC.EE404
  },
  {
    id: 117,
    name: "Ts",
    position: [6, 16],
    radioactive: true,
    artificial: true,
    type: ELEMENT_TYPE.NON_METALLIC,
    cost: BEC.EE404
  },
  {
    id: 118,
    name: "Og",
    position: [6, 17],
    radioactive: true,
    artificial: true,
    type: ELEMENT_TYPE.NOBLE_GAS,
    cost: BEC.EE404
  },
]