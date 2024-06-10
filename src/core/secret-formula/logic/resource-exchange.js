import { DC } from "../../constants.js";

export const resourceExchange = {
  "antimatter": {
    id: 0,
    name: "Antimatter",
    symbol: "Ω",
    currency: () => Currency.antimatter,
    value: value => value.pow(0.05).times(value.add(1).log10()).times(0.1).add(1),
    min: DC.E1
  },
  "infinityPoints": {
    id: 1,
    name: "Infinity Points",
    symbol: "∞",
    currency: () => Currency.infinityPoints,
    value: value => value.pow(0.08).times(2).add(1)
  },
  "matter": {
    id: 2,
    name: "Matter",
    symbol: "π",
    currency: () => Currency.matter,
    value: value => value.pow(0.04).times(0.1).add(1)
  },
  "infinityPower": {
    id: 3,
    name: "Infinity Power",
    symbol: "Χ",
    currency: () => Currency.infinityPower,
    value: value => value.pow(0.05).times(1.25).add(1)
  },
  "replicanti": {
    id: 4,
    name: "Replicanti",
    symbol: "Ξ",
    currency: () => Currency.replicanti,
    value: value => value.pow(0.1).times(10).add(1)
  },
  "eternityPoints": {
    id: 5,
    name: "Eternity Points",
    symbol: "Δ",
    currency: () => Currency.eternityPoints,
    value: value => value.pow(0.1).times(100).add(1)
  }
}