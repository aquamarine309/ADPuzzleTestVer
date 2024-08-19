export default {
  name: "BigCrunchButton",
  data() {
    return {
      isVisible: false,
      gainedIP: new BE(0),
      currentIPRate: new BE(0),
      peakIPRate: new BE(0),
      peakIPRateVal: new BE(0),
      currentIP: new BE(0),
      tesseractAffordable: false,
      canCrunch: false,
      infinityGoal: new BE(0),
      inAntimatterChallenge: false,
      hover: false,
      headerTextColored: true,
      creditsClosed: false,
      showIPRate: false,
      inLogicChallenge: false,
      canCompleteLC: false,
      lcGoal: new BE(0)
    };
  },
  computed: {
    buttonClassObject() {
      return {
        "o-infinity-button--unavailable": !this.canCrunch,
        "o-pelle-disabled-pointer": this.creditsClosed
      };
    },
    // Show IP/min below this threshold, color the IP number above it
    rateThreshold: () => 5e13,
    amountStyle() {
      if (!this.headerTextColored || this.currentIP.lt(this.rateThreshold)) return {
        "transition-duration": "0s"
      };
      if (this.hover) return {
        color: "black",
        "transition-duration": "0.2s"
      };

      // Dynamically generate red-text-green based on the CSS entry for text color, returning a raw 6-digit hex color
      // code. stepRGB is an array specifying the three RGB codes, which are then interpolated between in order to
      // generate the final color; only ratios between 0.9-1.1 give a color gradient
      const textHexCode = getComputedStyle(document.body).getPropertyValue("--color-text").split("#")[1];
      const stepRGB = [
        [255, 0, 0],
        [
          parseInt(textHexCode.substring(0, 2), 16),
          parseInt(textHexCode.substring(2, 4), 16),
          parseInt(textHexCode.substring(4), 16)
        ],
        [0, 255, 0]
      ];
      const ratio = this.gainedIP.log10().div(this.currentIP.log10()).clampMax(1.1).toNumber();
      const interFn = index => {
        if (ratio < 0.9) return stepRGB[0][index];
        if (ratio < 1) {
          const r = 10 * (ratio - 0.9);
          return Math.round(stepRGB[0][index] * (1 - r) + stepRGB[1][index] * r);
        }
        if (ratio < 1.1) {
          const r = 10 * (ratio - 1);
          return Math.round(stepRGB[1][index] * (1 - r) + stepRGB[2][index] * r);
        }
        return stepRGB[2][index];
      };
      const rgb = [interFn(0), interFn(1), interFn(2)];
      return {
        color: `rgb(${rgb.join(",")})`,
        "transition-duration": "0.2s"
      };
    },
  },
  methods: {
    update() {
      this.isVisible = player.break;
      this.tesseractAffordable = Tesseracts.canBuyTesseract;
      if (!this.isVisible) return;
      this.canCrunch = Player.canCrunch;
      this.infinityGoal.copyFrom(Player.infinityGoal);
      this.inAntimatterChallenge = Player.isInAntimatterChallenge;
      this.inLogicChallenge = LogicChallenge.isRunning;
      this.canCompleteLC = this.inLogicChallenge && LogicChallenge.current.canComplete;
      if (this.inLogicChallenge) {
        this.lcGoal = LogicChallenge.current.goal;
      }
      this.headerTextColored = player.options.headerTextColored;
      this.creditsClosed = GameEnd.creditsEverClosed;

      const gainedIP = gainedInfinityPoints();
      this.currentIP.copyFrom(Currency.infinityPoints);
      this.gainedIP.copyFrom(gainedIP);
      this.currentIPRate.copyFrom(gainedIP.dividedBy(BE.clampMin(0.0005, Time.thisInfinityRealTime.totalMinutes)));
      this.peakIPRate.copyFrom(player.records.thisInfinity.bestIPmin);
      this.peakIPRateVal.copyFrom(player.records.thisInfinity.bestIPminVal);
      this.showIPRate = this.peakIPRate.lte(this.rateThreshold);
    },
    switchToInfinity() {
      Tab.dimensions.infinity.show(true);
    },
    crunch() {
      if (!Player.canCrunch) return;
      manualBigCrunchResetRequest();
    }
  },
  template: `
  <button
    v-if="isVisible && !tesseractAffordable"
    :class="buttonClassObject"
    class="o-prestige-button o-infinity-button"
    @click="crunch"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <!-- Cannot Crunch -->
    <template v-if="!canCrunch">
      Reach {{ format(infinityGoal, 2, 2) }}
      <br>
      antimatter
    </template>

    <!-- Can Crunch in challenge -->
    <template v-else-if="inAntimatterChallenge || canCompleteLC">
      Big Crunch to
      <br>
      complete the challenge
    </template>

    <template v-else-if="inLogicChallenge">
      Cannot gain IP
      <br>
      in Logic Challenge
      <br>
      Reach {{ format(lcGoal, 2, 2) }}
      <br>
      antimatter
    </template>

    <!-- Can Crunch -->
    <template v-else>
      <div v-if="!showIPRate" />
      <b>
        Big Crunch for
        <span :style="amountStyle">{{ format(gainedIP, 2) }}</span>
        <span v-if="showIPRate"> IP</span>
        <span v-else> Infinity {{ pluralize("Point", gainedIP) }}</span>
      </b>
      <template v-if="showIPRate">
        <br>
        Current: {{ format(currentIPRate, 2) }} IP/min
        <br>
        Peak: {{ format(peakIPRate, 2) }} IP/min
        <br>
        at {{ format(peakIPRateVal, 2) }} IP
      </template>
      <div v-else />
    </template>
  </button>

  <button
    v-else-if="tesseractAffordable"
    class="o-prestige-button c-game-header__tesseract-available"
    :class="{ 'o-pelle-disabled-pointer': creditsClosed }"
    @click="switchToInfinity"
  >
    <b>
      You have enough Infinity Points to buy a Tesseract
    </b>
  </button>
  `
};