export default {
  name: "InfinityPointsHeader",
  data() {
    return {
      infinityPoints: new BE(),
      isVisible: false
    };
  },
  methods: {
    update() {
      this.infinityPoints.copyFrom(Currency.infinityPoints);
      this.isVisible = PlayerProgress.infinityUnlocked();
    }
  },
  template: `
  <div
    v-show="isVisible"
    class="c-infinity-tab__header"
  >
    You have
    <span class="c-infinity-tab__infinity-points">{{ format(infinityPoints, 2) }}</span>
    {{ pluralize("Infinity Point", infinityPoints) }}.
  </div>
  `
};