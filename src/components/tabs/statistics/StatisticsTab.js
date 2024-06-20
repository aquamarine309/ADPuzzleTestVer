import { MatterScale } from "./matter-scale.js";
import PrimaryButton from "../../PrimaryButton.js";

export default {
  name: "StatisticsTab",
  components: {
    PrimaryButton
  },
  data() {
    return {
      isDoomed: false,
      realTimeDoomed: TimeSpan.zero,
      totalAntimatter: new BE(0),
      realTimePlayed: TimeSpan.zero,
      timeSinceCreation: 0,
      uniqueNews: 0,
      totalNews: 0,
      secretAchievementCount: 0,
      infinity: {
        isUnlocked: false,
        count: new BE(0),
        banked: new BE(0),
        projectedBanked: new BE(0),
        bankRate: new BE(0),
        hasBest: false,
        best: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        bestRate: new BE(0),
      },
      eternity: {
        isUnlocked: false,
        count: new BE(0),
        hasBest: false,
        best: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        bestRate: new BE(0),
      },
      reality: {
        isUnlocked: false,
        count: new BE(0),
        best: TimeSpan.zero,
        bestReal: TimeSpan.zero,
        this: TimeSpan.zero,
        thisReal: TimeSpan.zero,
        totalTimePlayed: TimeSpan.zero,
        bestRate: new BE(0),
        bestRarity: 0,
      },
      matterScale: [],
      lastMatterTime: 0,
      paperclips: 0,
      fullTimePlayed: 0,
    };
  },
  computed: {
    // These are here to avoid extra spaces in-game pre-reality and to get around codefactor 120-char limits in the
    // HTML template due to the fact that adding a linebreak also adds a space
    infinityCountString() {
      const num = this.infinity.count;
      return num.gt(0)
        ? `${this.formatBEAmount(num)} ${pluralize("Infinity", num.floor())}`
        : "no Infinities";
    },
    eternityCountString() {
      const num = this.eternity.count;
      return num.gt(0)
        ? `${this.formatBEAmount(num)} ${pluralize("Eternity", num.floor())}`
        : "no Eternities";
    },
    fullGameCompletions() {
      return player.records.fullGameCompletions;
    },
    startDate() {
      return Time.toDateTimeString(player.records.gameCreatedTime);
    },
    saveAge() {
      return TimeSpan.fromMilliseconds(this.timeSinceCreation);
    },
  },
  methods: {
    update() {
      const records = player.records;
      this.totalAntimatter.copyFrom(records.totalAntimatter);
      this.realTimePlayed.setFrom(records.realTimePlayed.toBE());
      this.fullTimePlayed = TimeSpan.fromMilliseconds(records.previousRunRealTime + records.realTimePlayed);
      this.uniqueNews = NewsHandler.uniqueTickersSeen;
      this.totalNews = player.news.totalSeen;
      this.secretAchievementCount = SecretAchievements.all.filter(a => a.isUnlocked).length;
      this.timeSinceCreation = Date.now() - player.records.gameCreatedTime;

      const progress = PlayerProgress.current;
      const isInfinityUnlocked = progress.isInfinityUnlocked;
      const infinity = this.infinity;
      const bestInfinity = records.bestInfinity;
      infinity.isUnlocked = isInfinityUnlocked;
      if (isInfinityUnlocked) {
        infinity.count.copyFrom(Currency.infinities);
        infinity.banked.copyFrom(Currency.infinitiesBanked);
        infinity.projectedBanked = new BE(0).plusEffectsOf(
          Achievement(131).effects.bankedInfinitiesGain,
          TimeStudy(191)
        );
        infinity.bankRate = infinity.projectedBanked.div(BE.clampMin(33, records.thisEternity.time)).times(60000);
        infinity.hasBest = bestInfinity.time.lt(999999999999);
        infinity.best.setFrom(bestInfinity.time);
        infinity.this.setFrom(records.thisInfinity.time);
        infinity.bestRate.copyFrom(bestInfinity.bestIPminEternity);
      }

      const isEternityUnlocked = progress.isEternityUnlocked;
      const eternity = this.eternity;
      const bestEternity = records.bestEternity;
      eternity.isUnlocked = isEternityUnlocked;
      if (isEternityUnlocked) {
        eternity.count.copyFrom(Currency.eternities);
        eternity.hasBest = bestEternity.time.lt(999999999999);
        eternity.best.setFrom(bestEternity.time);
        eternity.this.setFrom(records.thisEternity.time);
        eternity.bestRate.copyFrom(bestEternity.bestEPminReality);
      }

      const isRealityUnlocked = progress.isRealityUnlocked;
      const reality = this.reality;
      const bestReality = records.bestReality;
      reality.isUnlocked = isRealityUnlocked;

      if (isRealityUnlocked) {
        reality.count.copyFrom(Currency.realities);
        reality.best.setFrom(bestReality.time);
        reality.bestReal.setFrom(bestReality.realTime.toBE());
        reality.this.setFrom(records.thisReality.time);
        reality.totalTimePlayed.setFrom(records.totalTimePlayed);
        // Real time tracking is only a thing once reality is unlocked:
        infinity.thisReal.setFrom(records.thisInfinity.realTime.toBE());
        infinity.bankRate = infinity.projectedBanked.div(BE.clampMin(33, records.thisEternity.realTime)).times(60000);
        eternity.thisReal.setFrom(records.thisEternity.realTime.toBE());
        reality.thisReal.setFrom(records.thisReality.realTime.toBE());
        reality.bestRate.copyFrom(bestReality.RMmin);
        reality.bestRarity = Math.max(strengthToRarity(bestReality.glyphStrength), 0);
      }
      this.updateMatterScale();

      this.isDoomed = Pelle.isDoomed;
      this.realTimeDoomed.setFrom(player.records.realTimeDoomed.toBE());
      this.paperclips = player.news.specialTickerData.paperclips;
    },
    formatBEAmount(value) {
      return value.gt(1e9) ? format(value, 3) : formatInt(Math.floor(value.toNumber()));
    },
    // Only updates once per second to reduce jitter
    updateMatterScale() {
      if (Date.now() - this.lastMatterTime > 1000) {
        this.matterScale = MatterScale.estimate(Currency.antimatter.value);
        this.lastMatterTime = Date.now();
      }
    },
    realityClassObject() {
      return {
        "c-stats-tab-title": true,
        "c-stats-tab-reality": !this.isDoomed,
        "c-stats-tab-doomed": this.isDoomed,
      };
    }
  },
  template: `
  <div
    class="c-stats-tab"
    data-v-statistics-tab
  >
    <div>
      <div
        class="c-stats-tab-title c-stats-tab-general"
        data-v-statistics-tab
      >
        General
      </div>
      <div
        class="c-stats-tab-general"
        data-v-statistics-tab
      >
        <div>You have made a total of {{ format(totalAntimatter, 2, 1) }} antimatter.</div>
        <div>You have played for {{ realTimePlayed }}. (real time)</div>
        <div v-if="reality.isUnlocked">
          Your existence has spanned {{ reality.totalTimePlayed }} of time. (game time)
        </div>
        <div>
          Your save was created on {{ startDate }} ({{ saveAge }} ago)
        </div>
        <br>
        <div>
          You have seen {{ quantifyInt("news message", totalNews) }} in total.
        </div>
        <div>
          You have seen {{ quantifyInt("unique news message", uniqueNews) }}.
        </div>
        <div>
          You have unlocked {{ quantifyInt("Secret Achievement", secretAchievementCount) }}.
        </div>
        <div v-if="paperclips">
          You have {{ quantifyInt("useless paperclip", paperclips) }}.
        </div>
        <div v-if="fullGameCompletions">
          <br>
          <b>
            You have completed the entire game {{ quantifyInt("time", fullGameCompletions) }}.
            <br>
            You have played for {{ fullTimePlayed }} across all playthroughs.
          </b>
        </div>
      </div>
      <div>
        <br>
        <div
          class="c-matter-scale-container c-stats-tab-general"
          data-v-statistics-tab
        >
          <div
            v-for="(line, i) in matterScale"
            :key="i"
          >
            {{ line }}
          </div>
          <br v-if="matterScale.length < 2">
          <br v-if="matterScale.length < 3">
        </div>
      </div>
      <br>
    </div>
    <div
      v-if="infinity.isUnlocked"
      class="c-stats-tab-subheader c-stats-tab-general"
      data-v-statistics-tab
    >
      <div
        class="c-stats-tab-title c-stats-tab-infinity"
        data-v-statistics-tab
      >
        Infinity
      </div>
      <div>
        You have {{ infinityCountString }}<span v-if="eternity.isUnlocked"> this Eternity</span>.
      </div>
      <div v-if="infinity.banked.gt(0)">
        You have {{ formatBEAmount(infinity.banked.floor()) }}
        {{ pluralize("Banked Infinity", infinity.banked.floor()) }}.
      </div>
      <div v-if="infinity.hasBest">
        Your fastest Infinity was {{ infinity.best.toStringShort() }}.
      </div>
      <div v-else>
        You have no fastest Infinity<span v-if="eternity.isUnlocked"> this Eternity</span>.
      </div>
      <div>
        You have spent {{ infinity.this.toStringShort() }} in this Infinity.
        <span v-if="reality.isUnlocked">
          ({{ infinity.thisReal.toStringShort() }} real time)
        </span>
      </div>
      <div>
        Your best Infinity Points per minute
        <span v-if="eternity.count.gt(0)">this Eternity </span>
        is {{ format(infinity.bestRate, 2, 2) }}.
      </div>
      <br>
    </div>
    <div
      v-if="eternity.isUnlocked"
      class="c-stats-tab-subheader c-stats-tab-general"
      data-v-statistics-tab
    >
      <div
        class="c-stats-tab-title c-stats-tab-eternity"
        data-v-statistics-tab
      >
        Eternity
      </div>
      <div>
        You have {{ eternityCountString }}<span v-if="reality.isUnlocked"> this Reality</span>.
      </div>
      <div v-if="infinity.projectedBanked.gt(0)">
        You will gain {{ formatBEAmount(infinity.projectedBanked.floor()) }}
        {{ pluralize("Banked Infinity", infinity.projectedBanked.floor()) }} on Eternity
        ({{ formatBEAmount(infinity.bankRate) }} per minute).
      </div>
      <div v-else-if="infinity.banked.gt(0)">
        You will gain no Banked Infinities on Eternity.
      </div>
      <div v-if="eternity.hasBest">
        Your fastest Eternity was {{ eternity.best.toStringShort() }}.
      </div>
      <div v-else>
        You have no fastest Eternity<span v-if="reality.isUnlocked"> this Reality</span>.
      </div>
      <div>
        You have spent {{ eternity.this.toStringShort() }} in this Eternity.
        <span v-if="reality.isUnlocked">
          ({{ eternity.thisReal.toStringShort() }} real time)
        </span>
      </div>
      <div>
        Your best Eternity Points per minute
        <span v-if="reality.isUnlocked">this Reality </span>
        is {{ format(eternity.bestRate, 2, 2) }}.
      </div>
      <br>
    </div>
    <div
      v-if="reality.isUnlocked"
      class="c-stats-tab-subheader c-stats-tab-general"
      data-v-statistics-tab
    >
      <div
        :class="realityClassObject()"
        data-v-statistics-tab
      >
        {{ isDoomed ? "Doomed Reality" : "Reality" }}
      </div>
      <div>You have {{ quantifyInt("Reality", reality.count) }}.</div>
      <div>Your fastest game-time Reality was {{ reality.best.toStringShort() }}.</div>
      <div>Your fastest real-time Reality was {{ reality.bestReal.toStringShort() }}.</div>
      <div
        :class="{ 'c-stats-tab-doomed' : isDoomed }"
        data-v-statistics-tab
      >
        You have spent {{ reality.this.toStringShort() }}
        in this {{ isDoomed ? "Armageddon" : "Reality" }}.
        ({{ reality.thisReal.toStringShort() }} real time)
      </div>
      <div
        v-if="isDoomed"
        class="c-stats-tab-doomed"
        data-v-statistics-tab
      >
        You have been Doomed for {{ realTimeDoomed.toStringShort() }}, real time.
      </div>
      <div>
        Your best Reality Machines per minute is {{ format(reality.bestRate, 2, 2) }}.
      </div>
      <div>Your best Glyph rarity is {{ formatRarity(reality.bestRarity) }}.</div>
      <br>
    </div>
  </div>
  `
};