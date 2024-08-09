import ResourceCircleNode from "./ResourceCircleNode.js";

const resourceExchangeLayout = {
  edge: 40,
  layoutRadius: 18,
  get center() {
    return this.edge / 2;
  },
  getPosition(index, amount) {
    const center = this.center;
    const layoutRadius = this.layoutRadius;
    const nodeRadius = this.nodeRadius;
    const rate = index / amount;
    return {
      x: center + layoutRadius * Math.sin(rate * Math.PI * 2),
      y: center - layoutRadius * Math.cos(rate * Math.PI * 2)
    }
  }
};

function getPositionStyle(x, y) {
  return {
    left: `${x}rem`,
    top: `${y}rem`
  }
};

export default {
  name: "ResourceExchangeLayout",
  components: {
    ResourceCircleNode
  },
  data() {
    return {
      offset: 0
    }
  },
  computed: {
    resources: () => ResourceExchange.all,
    amount() {
      return this.resources.length;
    },
    center: () => resourceExchangeLayout.center,
    layoutRadius: () => resourceExchangeLayout.layoutRadius,
    circleRadius() {
      return `${this.layoutRadius / this.center * 50}%`;
    },
    centerStyle() {
      return getPositionStyle(this.center, this.center);
    },
  },
  created() {
    // Just update line style
    this.on$(GAME_EVENT.EXCHANGE_LEVEL_UP, () => this.$recompute("circleRadius"));
  },
  methods: {
    getPosition(index) {
      const pos = resourceExchangeLayout.getPosition(index, this.amount);
      return getPositionStyle(pos.x, pos.y);
    },
    getPositionPercents(index) {
      const pos = resourceExchangeLayout.getPosition(index, this.amount);
      return {
        x: `${pos.x / this.center * 50}%`,
        y: `${pos.y / this.center * 50}%`
      }
    },
    emitToggle(id) {
      this.$emit("toggle", id);
    },
    lineClass(resource) {
      return {
        "c-resource-exchange-line": true,
        "c-resource-exchange-line--seen": resource.hasUnlocked && !resource.isUnlocked,
        "c-resource-exchange-line--unlocked": resource.isUnlocked
      }
    },
    startRotate() {
      this.offset = (this.offset + 1) % this.amount;
    }
  },
  template: `
  <div class="l-resource-exchange-layout">
    <svg class="l-resource-exchange-orbit-canvas">
      <circle
        class="c-resource-exchange-line"
        cx="50%"
        cy="50%"
        :r="circleRadius"
      />
      <line
        v-for="resource in resources"
        :class="lineClass(resource)"
        x1="50%"
        y1="50%"
        :x2="getPositionPercents(resource.id + offset).x"
        :y2="getPositionPercents(resource.id + offset).y"
      />
    </svg>
    <ResourceCircleNode
      v-for="resource in resources"
      :key="resource.id"
      :resource="resource"
      :style="getPosition(resource.id + offset)"
      @click.native="emitToggle(resource.id)"
    />
    <div
      class="o-resource-circle-node"
      :style="centerStyle"
      @click="startRotate"
    >
      <i class="fas fa-compress-arrows-alt" />
    </div>
  </div>
  `
}