export default {
  name: "NewGame",
  data() {
    return {
      opacity: 0,
      visible: false,
      hasMoreCosmetics: false,
      selectedSetName: "",
    };
  },
  computed: {
    style() {
      return {
        opacity: this.opacity,
        visibility: this.visible ? "visible" : "hidden",
      };
    }
  },
  methods: {
    update() {
      this.visible = GameEnd.endState > END_STATE_MARKERS.SHOW_NEW_GAME && !GameEnd.removeAdditionalEnd;
      this.opacity = (GameEnd.endState - END_STATE_MARKERS.SHOW_NEW_GAME) * 2;
      this.hasMoreCosmetics = GlyphAppearanceHandler.lockedSets.length > 0;
      this.selectedSetName = GlyphAppearanceHandler.chosenFromModal?.name ?? "None (will choose randomly)";
    },
    startNewGame() {
      NG.startNewGame();
    },
    openSelectionModal() {
      Modal.cosmeticSetChoice.show();
    }
  },
  template: `
  <div
    class="c-new-game-container"
    :style="style"
    data-v-new-game
  >
    <h2>
      Reset the entire game, but keep Automator Scripts, Study Presets, Secret Themes, Secret Achievements, Options,
      and Companion Glyph.
    </h2>
    <h3>You can use the button in the top-right to view the game as it is right now.</h3>
    <div
      class="c-new-game-button-container"
      data-v-new-game
    >
      <button
        class="c-new-game-button"
        @click="startNewGame"
        data-v-new-game
      >
        Start over?
      </button>
    </div>
    <br>
    <h3 v-if="hasMoreCosmetics">
      For completing the game, you also unlock a new cosmetic set of your choice for Glyphs. These are freely
      modifiable once you reach Reality again, but are purely visual and offer no gameplay bonuses.
      <br>
      <button
        class="c-new-game-button"
        @click="openSelectionModal"
        data-v-new-game
      >
        Choose Cosmetic Set
      </button>
      <br>
      <br>
      Selected Set: {{ selectedSetName }}
    </h3>
    <h3 v-else>
      You have unlocked all Glyph cosmetic sets!
    </h3>
    <br>
    <h3>
      You can also import "speedrun" to start the game again with additional tracking for speedrunning purposes.
    </h3>
  </div>
  `
};