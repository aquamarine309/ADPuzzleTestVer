// import { LogicTree } from "../../../core/logic-tree.js";
import LogicNodeComponent from "./LogicNodeComponent.js";
import LogicNodeConnection from "./LogicNodeConnection.js";
import BlobNode from "./BlobNode.js";

export default {
  name: "LogicTreeTab",
  components: {
    LogicNodeComponent,
    LogicNodeConnection,
    BlobNode
  },
  data() {
    return {
      updatedKey: 0
    }
  },
  computed: {
    nodes() {
      return LogicTree.nodes.filter(x => x.isAvailable);
    },
    connections() {
      return LogicTree.connections.filter(c => c.some(x => x.isUnlocked));
    },
    containerSize: () => 800,
    nodeRadius: () => 90,
    bgText() {
      const count = 36;
      return Array.range(0, count).map(() => {
        const x = this.containerSize * Math.random();
        const y = this.containerSize * Math.random();
        return {
          x, y,
          fontSize: 40 + 80 * Math.random(),
          rotate: `rotate(${Math.random() * 360}, ${x}, ${y})`
        }
      });
    }
  },
  created() {
    this.on$(GAME_EVENT.LOGIC_NODE_UNLOCKED, () => {
      this.$recompute("nodes");
      this.$recompute("connections");
      this.updatedKey++;
    });
  },
  template: `
  <div>
    <div class="c-logic-tree-layout">
      <div class="c-logic-node-container">
        <LogicNodeComponent
          v-for="node in nodes"
          :node="node"
          :node-radius="nodeRadius"
          :container-size="containerSize"
          :key="node.id + 'node' + updatedKey"
        />
        <BlobNode
          :node-radius="nodeRadius"
          :container-size="containerSize"
          :key="'blob-node' + updatedKey"
        />
      </div>
      <svg
        ref="svg"
        class="c-logic-tree-svg"
      >
        <text
          v-for="info in bgText"
          :x="info.x"
          :y="info.y"
          :font-size="info.fontSize"
          :transform="info.rotate"
          class="c-logic-tree-bg-text"
        >
          Δ
        </text>
        <LogicNodeConnection
          v-for="(connection, idx) in connections"
          :connection="connection"
          :node-radius="nodeRadius"
          :container-size="containerSize"
          :key="idx + 'connection' + updatedKey"
        />
      </svg>
    </div>
  </div>
  `
}