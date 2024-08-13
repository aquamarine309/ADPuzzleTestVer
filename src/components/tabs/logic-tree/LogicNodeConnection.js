export default {
  name: "LogicNodeConnection",
  props: {
    connection: {
      type: Array,
      required: true
    },
    containerSize: {
      type: Number,
      required: true
    },
    nodeRadius: {
      type: Number,
      required: true
    }
  },
  computed: {
    startP() {
      return this.connection[0].config.position;
    },
    endP() {
      return this.connection[1].config.position;
    },
    divisor() {
      return 100 * this.nodeRadius / this.containerSize;
    },
    isAllUnlocked() {
      return this.connection.every(x => x.isUnlocked);
    },
    classObject() {
      return {
        "c-logic-tree-connection": true,
        "c-logic-tree-connection--locked": !this.isAllUnlocked
      }
    }
  },
  methods: {
    T(x) {
      return `${50 + x * this.divisor}%`;
    }
  }, 
  template: `
  <line
    :class="classObject"
    :x1="T(startP[0])"
    :y1="T(startP[1])"
    :x2="T(endP[0])"
    :y2="T(endP[1])"
  />
  `
}