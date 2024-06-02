export default {
  name: "StdStoreRow",
  props: {
    amount: {
      type: Number,
      required: true
    },
    cost: {
      type: Number,
      required: true
    }
  },
  methods: {
    purchase() {
      GameUI.notify.error("I heard you want to buy STD?");
    }
  },
  template: `
  <div class="c-modal-store-btn-container">
    <div class="o-modal-store-label">
      {{ amount }} STDs
    </div>
    <button
      class="o-modal-store-btn"
      @click="purchase"
    >
      $<span>{{ cost }}</span>
    </button>
  </div>
  `
};