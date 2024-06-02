export default {
  name: "AutomatorDataTransferSingleEntry",
  props: {
    script: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      presets: [],
      constants: [],
      hidePresets: true,
      hideConstants: true,
    };
  },
  computed: {
    presetData: () => player.timestudy.presets,
    constantData: () => player.reality.automator.constants,
    hasPresets() {
      return (this.presets?.length ?? 0) !== 0;
    },
    hasConstants() {
      return (this.constants?.length ?? 0) !== 0;
    },
  },
  methods: {
    update() {
      this.presets = AutomatorBackend.getUsedPresets(this.script.id);
      this.constants = AutomatorBackend.getUsedConstants(this.script.id);
    },
    iconClass(state) {
      return state ? "far fa-plus-square" : "far fa-minus-square";
    },
    exportData(id) {
      const toExport = AutomatorBackend.exportFullScriptData(id);
      if (toExport) {
        copyToClipboard(toExport);
        GameUI.notify.automator(`Exported all data associated with "${this.script.name}" to your clipboard`, 6000);
      } else {
        GameUI.notify.error("Could not export data from blank Automator script!");
      }
    }
  },
  template: `
  <div class="l-entry-padding">
    <button
      v-tooltip="'Export Full Script Data'"
      class="l-button-margin fas fa-file-export"
      @click="exportData(script.id)"
      data-v-automator-data-transfer-single-entry
    />
    <b>Script name: {{ script.name }}</b>
    <br>
    <span v-if="hasPresets">
      <span
        :class="iconClass(hidePresets)"
        @click="hidePresets = !hidePresets"
        data-v-automator-data-transfer-single-entry
      />
      References {{ quantifyInt("recognized study preset", presets.length) }}
      <span v-if="!hidePresets">
        <div
          v-for="id in presets"
          :key="id"
        >
          <span v-if="presetData[id].name">"{{ presetData[id].name }}" (slot {{ id + 1 }}):</span>
          <span v-else>Preset slot {{ id + 1 }}:</span>
          <br>
          <div
            class="l-value-padding"
            data-v-automator-data-transfer-single-entry
          >
            <span v-if="presetData[id].studies">{{ presetData[id].studies }}</span>
            <i v-else>Empty Study Preset</i>
          </div>
        </div>
      </span>
    </span>
    <span v-else>
      Does not reference any study presets.
    </span>
    <br>
    <span v-if="hasConstants">
      <span
        :class="iconClass(hideConstants)"
        @click="hideConstants = !hideConstants"
        data-v-automator-data-transfer-single-entry
      />
      References {{ quantifyInt("defined constant", constants.length) }}
      <span v-if="!hideConstants">
        <div
          v-for="name in constants"
          :key="name"
        >
          "{{ name }}":
          <br>
          <div
            class="l-value-padding"
            data-v-automator-data-transfer-single-entry
          >
            {{ constantData[name] }}
          </div>
        </div>
      </span>
    </span>
    <span v-else>
      Does not reference any defined constants.
    </span>
  </div>
  `
};