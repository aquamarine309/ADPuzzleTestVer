import GameSpeedDisplay from "../GameSpeedDisplay.js";

export default {
  name: "HeaderTickspeedInfo",
  components: {
    GameSpeedDisplay
  },
  data() {
    return {
      mult: new BE(0),
      tickspeed: new BE(0),
      galaxyCount: new BE(0),
      purchasedTickspeed: new BE(0),
      freeTickspeed: new BE(0),
      lc5Running: false
    };
  },
  computed: {
    tickspeedDisplay() {
      return `Total Tickspeed: ${format(this.tickspeed, 2, 3)} / sec`;
    },
    perUpgrade() {
      if (InfinityChallenge(3).isRunning) return `Tickspeed upgrades give
        ${formatX(this.galaxyCount.times(0.005).plus(1.05), 3, 3)} to all ADs`;
      if (this.lc5Running) return "Invalid for ADs";
      return `ADs produce ${formatX(this.mult.reciprocal(), 2, 3)} faster per Tickspeed upgrade`;
    },
  },
  methods: {
    update() {
      this.mult.copyFrom(Tickspeed.multiplier);
      this.tickspeed.copyFrom(Tickspeed.perSecond);
      this.galaxyCount.copyFrom(player.galaxies);
      this.purchasedTickspeed.copyFrom(player.totalTickBought);
      this.freeTickspeed.copyFrom(FreeTickspeed.amount);
      this.lc5Running = LogicChallenge(5).isRunning;
    },
  },
  template: `
  <div>
    <br>
    {{ perUpgrade }}
    <br>
    {{ tickspeedDisplay }}
    <br>
    <GameSpeedDisplay />
  </div>
  `
};