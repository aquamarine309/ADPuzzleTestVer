import { AutomatorPanels } from "../components/tabs/automator/AutomatorDocs.js";
import { GlyphInfoVue } from "../components/modals/options/SelectGlyphInfoDropdown.js";

import { AUTOMATOR_MODE, AUTOMATOR_TYPE } from "./automator/automator-backend.js";
import { BEC } from "./constants.js";
import { deepmergeAll } from "../utility/deepmerge.js";
import { GlyphTypes } from "./glyph-effects.js";
import { DEV } from "../env.js";

// This is actually reassigned when importing saves
// eslint-disable-next-line prefer-const
window.player = {
  antimatter: BEC.E1,
  dimensions: {
    antimatter: Array.range(0, 8).map(() => ({
      bought: BEC.D0,
      costBumps: BEC.D0,
      amount: BEC.D0
    })),
    infinity: Array.range(0, 8).map(tier => ({
      isUnlocked: false,
      bought: BEC.D0,
      amount: BEC.D0,
      cost: [BEC.E8, BEC.E9, BEC.E10, BEC.E20, BEC.E140, BEC.E200, BEC.E250, BEC.E280][tier],
      baseAmount: BEC.D0
    })),
    time: Array.range(0, 8).map(tier => ({
      cost: [BEC.D1, BEC.D5, BEC.E2, BEC.E3, BEC.E2350, BEC.E2650, BEC.E3000, BEC.E3350][tier],
      amount: BEC.D0,
      bought: BEC.D0
    }))
  },
  challengePower: BEC.D0,
  lc3Rebuyables: {
    adMult: BEC.D0,
    adPow: BEC.D0,
    cpMult: BEC.D0,
    cpPow: BEC.D0,
    cpBaseAD: BEC.D0
  },
  lc3Game: {
    stage: GAME_STAGE.NOT_COMPLETE,
    rows: null,
    question: "",
    currentRow: 0,
    options: {
      maxResult: 9,
      minResult: 1,
      maxLength: 10,
      minLength: 6,
      row: 6
    }
  },
  elements: new Set(),
  challengeFactorBits: 0,
  eternitiesBeforeRefresh: 0,
  buyUntil10: true,
  hasDLC: false,
  refreshChallenge: false,
  shop: {
    totalSTD: 0,
    spentSTD: 0
  },
  logic: {
    resourceExchange: {
      all: Array.range(0, 8).map(() => ({
        value: BEC.D0,
        exchangeRate: 1,
        rateType: PERCENTS_TYPE.NORMAL
      })),
      unlocked: 0,
      lastOpenId: 0
    },
    spentPoints: BEC.D0,
    upgradeBits: 0,
    upgReqs: 0,
    initialSeed: Math.floor(Math.random() * Date.now()) + 1,
    seed: 0,
    refreshTimer: 0,
    upgrades: {
      reduce: 0,
      half: 0
    }
  },
  extraBonusTimeLeft: BEC.D0,
  timeCores: BEC.D0,
  crunchPunishment: {
    this: false,
    next: false
  },
  sacrificed: BEC.D0,
  achievementBits: Array.repeat(0, 17),
  secretAchievementBits: Array.repeat(0, 4),
  infinityUpgrades: new Set(),
  infinityRebuyables: [BEC.D0, BEC.D0, BEC.D0],
  challenge: {
    normal: {
      current: 0,
      bestTimes: Array.range(0, 11).map(() => BE.NUMBER_MAX_VALUE),
      completedBits: 0,
    },
    logic: {
      current: 0,
      bestTimes: Array.range(0, 8).map(() => BE.NUMBER_MAX_VALUE),
      completedBits: 0,
    },
    infinity: {
      current: 0,
      bestTimes: Array.range(0, 12).map(() => BE.NUMBER_MAX_VALUE),
      completedBits: 0,
    },
    eternity: {
      current: 0,
      unlocked: 0,
      requirementBits: 0,
    }
  },
  auto: {
    autobuyersOn: true,
    disableContinuum: false,
    reality: {
      mode: 0,
      rm: BEC.D1,
      glyph: 0,
      time: 0,
      shard: 0,
      isActive: false
    },
    eternity: {
      mode: 0,
      amount: BEC.D1,
      increaseWithMult: true,
      time: 1,
      xHighest: BEC.D1,
      isActive: false
    },
    bigCrunch: {
      cost: 1,
      interval: 150000,
      mode: 0,
      amount: BEC.D1,
      increaseWithMult: true,
      time: 1,
      xHighest: BEC.D1,
      isActive: true,
      lastTick: 0
    },
    galaxy: {
      cost: 1,
      interval: 20000,
      limitGalaxies: false,
      maxGalaxies: BEC.D1,
      buyMax: false,
      buyMaxInterval: 0,
      isActive: true,
      lastTick: 0
    },
    dimBoost: {
      cost: 1,
      interval: 4000,
      limitDimBoosts: false,
      maxDimBoosts: BEC.D1,
      limitUntilGalaxies: false,
      galaxies: BEC.D1,
      buyMaxInterval: 0,
      isActive: true,
      lastTick: 0,
      buyMaxMode: true
    },
    tickspeed: {
      isUnlocked: false,
      cost: 1,
      interval: 500,
      mode: AUTOBUYER_MODE.BUY_SINGLE,
      isActive: true,
      lastTick: 0,
      isBought: false
    },
    sacrifice: {
      multiplier: BEC.D2,
      isActive: true
    },
    antimatterDims: {
      all: Array.range(0, 8).map(tier => ({
        isUnlocked: false,
        cost: 1,
        interval: [500, 600, 700, 800, 900, 1000, 1100, 1200][tier],
        bulk: 1,
        mode: AUTOBUYER_MODE.BUY_10,
        isActive: true,
        lastTick: 0,
        isBought: false
      })),
      isActive: true,
    },
    infinityDims: {
      all: Array.range(0, 8).map(() => ({
        isActive: false,
        lastTick: 0,
      })),
      isActive: true,
    },
    timeDims: {
      all: Array.range(0, 8).map(() => ({
        isActive: false,
        lastTick: 0,
      })),
      isActive: true,
    },
    replicantiGalaxies: {
      isActive: false,
    },
    replicantiUpgrades: {
      all: Array.range(0, 3).map(() => ({
        isActive: false,
        lastTick: 0,
      })),
      isActive: true,
    },
    timeTheorems: {
      isActive: false,
    },
    dilationUpgrades: {
      all: Array.range(0, 3).map(() => ({
        isActive: false,
        lastTick: 0,
      })),
      isActive: true,
    },
    blackHolePower: {
      all: Array.range(0, 2).map(() => ({
        isActive: false,
      })),
      isActive: true,
    },
    realityUpgrades: {
      all: Array.range(0, 5).map(() => ({
        isActive: false,
      })),
      isActive: true,
    },
    imaginaryUpgrades: {
      all: Array.range(0, 10).map(() => ({
        isActive: false,
      })),
      isActive: true,
    },
    darkMatterDims: {
      isActive: false,
      lastTick: 0,
    },
    ascension: {
      isActive: false,
      lastTick: 0,
    },
    annihilation: {
      isActive: false,
      multiplier: 1.05,
    },
    singularity: { isActive: false },
    ipMultBuyer: { isActive: false, },
    epMultBuyer: { isActive: false, },
  },
  infinityPoints: BEC.D0,
  infinities: BEC.D0,
  infinitiesBanked: BEC.D0,
  dimensionBoosts: BEC.D0,
  galaxies: BEC.D0,
  news: {
    // This is properly handled in NewsHandler.addSeenNews which adds properties as needed
    seen: {},
    specialTickerData: {
      uselessNewsClicks: 0,
      paperclips: 0,
      newsQueuePosition: 1000,
      eiffelTowerChapter: 0
    },
    totalSeen: 0,
  },
  lastUpdate: new Date().getTime(),
  backupTimer: 0,
  chall2Pow: 1,
  chall3Pow: BEC.D0_01,
  matter: BEC.D1,
  chall9TickspeedCostBumps: BEC.D0,
  chall8TotalSacrifice: BEC.D1,
  ic2Count: 0,
  partInfinityPoint: 0,
  partInfinitied: 0,
  break: false,
  secretUnlocks: {
    themes: new Set(),
    viewSecretTS: false,
    cancerAchievements: false,
  },
  shownRuns: {
    Reality: true,
    Eternity: true,
    Infinity: true
  },
  requirementChecks: {
    infinity: {
      maxAll: false,
      noSacrifice: true,
      noAD8: true,
    },
    eternity: {
      onlyAD1: true,
      onlyAD8: true,
      noAD1: true,
      noRG: true,
    },
    reality: {
      noAM: true,
      noTriads: true,
      noPurchasedTT: true,
      noInfinities: true,
      noEternities: true,
      noContinuum: true,
      maxID1: BEC.D0,
      maxStudies: 0,
      maxGlyphs: 0,
      slowestBH: 1,
    },
    permanent: {
      emojiGalaxies: BEC.D0,
      singleTickspeed: 0,
      perkTreeDragging: 0
    }
  },
  records: {
    gameCreatedTime: Date.now(),
    totalTimePlayed: BEC.D0,
    timePlayedAtBHUnlock: BE.NUMBER_MAX_VALUE,
    realTimePlayed: 0,
    realTimeDoomed: 0,
    fullGameCompletions: 0,
    previousRunRealTime: 0,
    totalAntimatter: BEC.E1,
    recentInfinities: Array.range(0, 10).map(() =>
      [BE.NUMBER_MAX_VALUE, Number.MAX_VALUE, BEC.D1, BEC.D1, ""]),
    recentEternities: Array.range(0, 10).map(() =>
      [BE.NUMBER_MAX_VALUE, Number.MAX_VALUE, BEC.D1, BEC.D1, "", BEC.D0]),
    recentRealities: Array.range(0, 10).map(() =>
      [BE.NUMBER_MAX_VALUE, Number.MAX_VALUE, BEC.D1, 1, "", 0, 0]),
    thisInfinity: {
      time: BEC.D0,
      realTime: 0,
      lastBuyTime: BEC.D0,
      maxAM: BEC.D0,
      bestIPmin: BEC.D0,
      bestIPminVal: BEC.D0,
    },
    bestInfinity: {
      time: BE.NUMBER_MAX_VALUE,
      realTime: Number.MAX_VALUE,
      bestIPminEternity: BEC.D0,
      bestIPminReality: BEC.D0,
    },
    thisEternity: {
      time: BEC.D0,
      realTime: 0,
      maxAM: BEC.D0,
      maxIP: BEC.D0,
      bestIPMsWithoutMaxAll: BEC.D0,
      bestEPmin: BEC.D0,
      bestEPminVal: BEC.D0,
      bestInfinitiesPerMs: BEC.D0,
      maxLP: BEC.D1
    },
    bestEternity: {
      time: BE.NUMBER_MAX_VALUE,
      realTime: Number.MAX_VALUE,
      bestEPminReality: BEC.D0,
    },
    thisReality: {
      time: BE.NUMBER_MAX_VALUE,
      realTime: 0,
      maxAM: BEC.D0,
      maxIP: BEC.D0,
      maxEP: BEC.D0,
      bestEternitiesPerMs: BEC.D0,
      maxReplicanti: BEC.D0,
      maxDT: BEC.D0,
      bestRSmin: BE.NUMBER_MAX_VALUE,
      bestRSminVal: BE.NUMBER_MAX_VALUE,
    },
    bestReality: {
      time: BE.NUMBER_MAX_VALUE,
      realTime: Number.MAX_VALUE,
      glyphStrength: 0,
      RM: BEC.D0,
      RMSet: [],
      RMmin: BEC.D0,
      RMminSet: [],
      glyphLevel: BEC.D0,
      glyphLevelSet: [],
      bestEP: BEC.D0,
      bestEPSet: [],
      speedSet: [],
      iMCapSet: [],
      laitelaSet: [],
    },
  },
  speedrun: {
    isUnlocked: false,
    isActive: false,
    isSegmented: false,
    usedSTD: false,
    hasStarted: false,
    hideInfo: false,
    displayAllMilestones: false,
    startDate: 0,
    name: "",
    offlineTimeUsed: 0,
    // One spot for every entry in GameDatabase.speedrunMilestones (note: 1-indexed)
    records: Array.repeat(0, 26),
    achievementTimes: {},
    seedSelection: SPEEDRUN_SEED_STATE.FIXED,
    initialSeed: 0,
    previousRuns: {}
  },
  IPMultPurchases: BEC.D0,
  version: 68,
  bigCrunches: 0,
  bigEternities: 0,
  infinityPower: BEC.D1,
  postC4Tier: 0,
  eternityPoints: BEC.D0,
  eternities: BEC.D0,
  eternityUpgrades: new Set(),
  epmultUpgrades: BEC.D0,
  timeShards: BEC.D0,
  totalTickGained: BEC.D0,
  totalTickBought: BEC.D0,
  replicanti: {
    unl: false,
    amount: BEC.D0,
    chance: BEC.D0_01,
    chanceCost: BEC.E150,
    interval: BEC.E3,
    intervalCost: BEC.E140,
    boughtGalaxyCap: BEC.D0,
    galaxies: BEC.D0,
    galCost: BEC.E170,
    cooldownTime: BEC.E3,
    boosts: 0
  },
  timestudy: {
    theorem: BEC.D0,
    maxTheorem: BEC.D0,
    amBought: BEC.D0,
    ipBought: BEC.D0,
    epBought: BEC.D0,
    studies: [],
    shopMinimized: false,
    preferredPaths: [[], 0],
    presets: new Array(6).fill({
      name: "",
      studies: "",
    }),
  },
  eternityChalls: {},
  respec: false,
  eterc8ids: 50,
  eterc8repl: 40,
  dilation: {
    studies: [],
    active: false,
    tachyonParticles: BEC.D0,
    dilatedTime: BEC.D0,
    nextThreshold: BEC.E3,
    baseTachyonGalaxies: BEC.D0,
    totalTachyonGalaxies: BEC.D0,
    upgrades: new Set(),
    rebuyables: {
      1: BEC.D0,
      2: BEC.D0,
      3: BEC.D0,
      11: BEC.D0,
      12: BEC.D0,
      13: BEC.D0,
    },
    lastEP: BEC.DM1,
  },
  realities: BEC.D0,
  partSimulatedReality: BEC.D0,
  reality: {
    realityMachines: BEC.D0,
    maxRM: BEC.D0,
    imaginaryMachines: BEC.D0,
    iMCap: BEC.D0,
    glyphs: {
      active: [],
      inventory: [],
      sac: {
        power: BEC.D0,
        infinity: BEC.D0,
        time: BEC.D0,
        replication: BEC.D0,
        dilation: BEC.D0,
        effarig: BEC.D0,
        reality: BEC.D0,
        logic: BEC.D0
      },
      undo: [],
      sets: new Array(7).fill({
        name: "",
        glyphs: [],
      }),
      protectedRows: 2,
      filter: {
        select: AUTO_GLYPH_SCORE.LOWEST_SACRIFICE,
        trash: AUTO_GLYPH_REJECT.SACRIFICE,
        simple: 0,
        types: GlyphTypes.list
          .filter(t => ALCHEMY_BASIC_GLYPH_TYPES.includes(t.id))
          .mapToObject(t => t.id, t => ({
            rarity: 0,
            score: 0,
            effectCount: 0,
            specifiedMask: 0,
            effectScores: Array.repeat(0, t.effects.length),
          })),
      },
      createdRealityGlyph: false,
      cosmetics: {
        active: false,
        glowNotification: false,
        unlockedFromNG: [],
        symbolMap: {},
        colorMap: {},
      }
    },
    initialSeed: Math.floor(Date.now() * Math.random() + 1),
    // The seed value should get set from initialSeed upon unlocking reality, but we set it to 1 as a fallback in
    // case somehow it doesn't get set properly. Do not change this to 0, as a seed of 0 causes the game to hang
    seed: 1,
    secondGaussian: 1e6,
    musicSeed: Math.floor(Date.now() * Math.random() + 0xBCDDECCB),
    musicSecondGaussian: 1e6,
    rebuyables: {
      1: BEC.D0,
      2: BEC.D0,
      3: BEC.D0,
      4: BEC.D0,
      5: BEC.D0,
    },
    upgradeBits: 0,
    upgReqs: 0,
    imaginaryUpgradeBits: 0,
    imaginaryUpgReqs: 0,
    imaginaryRebuyables: {
      1: BEC.D0,
      2: BEC.D0,
      3: BEC.D0,
      4: BEC.D0,
      5: BEC.D0,
      6: BEC.D0,
      7: BEC.D0,
      8: BEC.D0,
      9: BEC.D0,
      10: BEC.D0,
    },
    reqLock: {
      reality: 0,
      imaginary: 0,
    },
    perks: new Set(),
    respec: false,
    showGlyphSacrifice: false,
    showSidebarPanel: GLYPH_SIDEBAR_MODE.INVENTORY_MANAGEMENT,
    autoSort: 0,
    autoCollapse: false,
    autoAutoClean: false,
    applyFilterToPurge: false,
    moveGlyphsOnProtection: false,
    perkPoints: BEC.D1,
    unlockedEC: 0,
    autoEC: true,
    lastAutoEC: 0,
    partEternitied: BEC.D0,
    autoAchieve: true,
    gainedAutoAchievements: true,
    automator: {
      state: {
        mode: AUTOMATOR_MODE.STOP,
        topLevelScript: 0,
        editorScript: 0,
        repeat: true,
        forceRestart: true,
        followExecution: true,
        stack: [],
      },
      scripts: {
      },
      constants: {},
      constantSortOrder: [],
      execTimer: 0,
      type: AUTOMATOR_TYPE.TEXT,
      forceUnlock: false,
      currentInfoPane: AutomatorPanels.INTRO_PAGE,
    },
    achTimer: 0,
    hasCheckedFilter: false,
  },
  blackHole: Array.range(0, 2).map(id => ({
    id,
    intervalUpgrades: BEC.D0,
    powerUpgrades: BEC.D0,
    durationUpgrades: BEC.D0,
    phase: 0,
    active: false,
    unlocked: false,
    activations: 0,
  })),
  blackHolePause: false,
  blackHoleAutoPauseMode: 0,
  blackHolePauseTime: 0,
  blackHoleNegative: 1,
  celestials: {
    teresa: {
      pouredAmount: 0,
      quoteBits: 0,
      unlockBits: 0,
      run: false,
      bestRunAM: BEC.D1,
      bestAMSet: [],
      perkShop: Array.repeat(BEC.D0, 5),
      lastRepeatedMachines: BEC.D0
    },
    effarig: {
      relicShards: BEC.D0,
      unlockBits: 0,
      run: false,
      quoteBits: 0,
      glyphWeights: {
        ep: 25,
        repl: 25,
        dt: 25,
        eternities: 25
      },
      autoAdjustGlyphWeights: false,
    },
    enslaved: {
      isStoring: false,
      stored: BEC.D0,
      isStoringReal: false,
      storedReal: 0,
      autoStoreReal: false,
      isAutoReleasing: false,
      quoteBits: 0,
      unlocks: [],
      run: false,
      completed: false,
      tesseracts: 0,
      hasSecretStudy: false,
      feltEternity: false,
      progressBits: 0,
      hintBits: 0,
      hintUnlockProgress: 0,
      glyphHintsGiven: 0,
      zeroHintTime: 0
    },
    v: {
      unlockBits: 0,
      run: false,
      quoteBits: 0,
      runUnlocks: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      goalReductionSteps: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      STSpent: 0,
      runGlyphs: [[], [], [], [], [], [], [], [], []],
      // The -10 is for glyph count, as glyph count for V is stored internally as a negative number
      runRecords: [-10, 0, 0, 0, 0, 0, 0, 0, 0],
      wantsFlipped: true,
    },
    ra: {
      pets: {
        teresa: {
          level: 1,
          memories: 0,
          memoryChunks: 0,
          memoryUpgrades: 0,
          chunkUpgrades: 0
        },
        effarig: {
          level: 1,
          memories: 0,
          memoryChunks: 0,
          memoryUpgrades: 0,
          chunkUpgrades: 0
        },
        enslaved: {
          level: 1,
          memories: 0,
          memoryChunks: 0,
          memoryUpgrades: 0,
          chunkUpgrades: 0
        },
        v: {
          level: 1,
          memories: 0,
          memoryChunks: 0,
          memoryUpgrades: 0,
          chunkUpgrades: 0
        }
      },
      alchemy: Array.repeat(0, 21)
        .map(() => ({
          amount: 0,
          reaction: false
        })),
      highestRefinementValue: {
        power: 0,
        infinity: 0,
        time: 0,
        replication: 0,
        dilation: 0,
        effarig: 0
      },
      quoteBits: 0,
      momentumTime: 0,
      unlockBits: 0,
      run: false,
      charged: new Set(),
      disCharge: false,
      peakGamespeed: BEC.D1,
      petWithRemembrance: ""
    },
    laitela: {
      darkMatter: BEC.D0,
      maxDarkMatter: BEC.D0,
      run: false,
      quoteBits: 0,
      dimensions: Array.range(0, 4).map(() =>
        ({
          amount: BEC.D0,
          intervalUpgrades: 0,
          powerDMUpgrades: 0,
          powerDEUpgrades: 0,
          timeSinceLastUpdate: 0,
          ascensionCount: 0
        })),
      entropy: 0,
      thisCompletion: 3600,
      fastestCompletion: 3600,
      difficultyTier: 0,
      upgrades: {},
      darkMatterMult: BEC.D0,
      darkEnergy: BEC.D0,
      singularitySorting: {
        displayResource: 0,
        sortResource: 0,
        showCompleted: 0,
        sortOrder: 0,
      },
      singularities: BEC.D0,
      singularityCapIncreases: 0,
      lastCheckedMilestones: 0,
      milestoneGlow: true,
    },
    pelle: {
      doomed: false,
      upgrades: new Set(),
      remnants: BEC.D0,
      realityShards: BEC.D0,
      records: {
        totalAntimatter: BEC.D0,
        totalInfinityPoints: BEC.D0,
        totalEternityPoints: BEC.D0,
      },
      rebuyables: {
        antimatterDimensionMult: BEC.D0,
        timeSpeedMult: BEC.D0,
        glyphLevels: BEC.D0,
        infConversion: BEC.D0,
        galaxyPower: BEC.D0,
        galaxyGeneratorAdditive: BEC.D0,
        galaxyGeneratorMultiplicative: BEC.D0,
        galaxyGeneratorAntimatterMult: BEC.D0,
        galaxyGeneratorIPMult: BEC.D0,
        galaxyGeneratorEPMult: BEC.D0,
      },
      rifts: {
        vacuum: {
          fill: BEC.D0,
          active: false,
          reducedTo: 1
        },
        decay: {
          fill: BEC.D0,
          active: false,
          percentageSpent: 0,
          reducedTo: 1
        },
        chaos: {
          fill: 0,
          active: false,
          reducedTo: 1
        },
        recursion: {
          fill: BEC.D0,
          active: false,
          reducedTo: 1
        },
        paradox: {
          fill: BEC.D0,
          active: false,
          reducedTo: 1
        }
      },
      progressBits: 0,
      galaxyGenerator: {
        unlocked: false,
        spentGalaxies: BEC.D0,
        generatedGalaxies: BEC.D0,
        phase: 0,
        sacrificeActive: false
      },
      quoteBits: 0,
      collapsed: {
        upgrades: false,
        rifts: false,
        galaxies: false
      },
      showBought: false,
    }
  },
  isGameEnd: false,
  tabNotifications: new Set(),
  triggeredTabNotificationBits: 0,
  tutorialState: 0,
  tutorialActive: true,
  options: {
    news: {
      enabled: true,
      repeatBuffer: 40,
      AIChance: 0,
      speed: 1,
      includeAnimated: true,
    },
    notation: "Mixed scientific",
    notationDigits: {
      comma: 5,
      notation: 9
    },
    tester: false,
    sidebarResourceID: 0,
    retryChallenge: false,
    retryCelestial: false,
    showAllChallenges: false,
    cloudEnabled: true,
    hideGoogleName: false,
    showCloudModal: true,
    forceCloudOverwrite: false,
    syncSaveIntervals: true,
    hotkeys: true,
    themeClassic: "Normal",
    themeModern: "Normal",
    updateRate: 33,
    newUI: true,
    offlineProgress: true,
    loadBackupWithoutOffline: false,
    automaticTabSwitching: true,
    respecIntoProtected: false,
    offlineTicks: 1e5,
    hibernationCatchup: true,
    statTabResources: 0,
    multiplierTab: {
      currTab: 0,
      showAltGroup: false,
      replacePowers: false,
    },
    hideChallengeFactor: false,
    autosaveInterval: 30000,
    showTimeSinceSave: true,
    saveFileName: "",
    exportedFileCount: 0,
    hideCompletedAchievementRows: false,
    glyphTextColors: true,
    headerTextColored: false,
    showNewGlyphIcon: true,
    showUnequippedGlyphIcon: true,
    highContrastRarity: false,
    swapGlyphColors: false,
    hideAlterationEffects: false,
    ignoreGlyphEffects: true,
    ignoreGlyphLevel: true,
    ignoreGlyphRarity: true,
    glyphBG: GLYPH_BG_SETTING.AUTO,
    glyphBorders: true,
    showHintText: {
      showPercentage: true,
      achievements: true,
      achievementUnlockStates: true,
      challenges: true,
      studies: true,
      glyphEffectDots: true,
      realityUpgrades: true,
      logicUpgrades: true,
      resourceExchange: true,
      perks: true,
      alchemy: true,
      glyphInfoType: GlyphInfoVue.types.NONE,
      showGlyphInfoByDefault: false,
    },
    animations: {
      bigCrunch: true,
      eternity: true,
      dilation: true,
      tachyonParticles: true,
      reality: true,
      background: true,
      blobSnowflakes: 16
    },
    confirmations: {
      armageddon: true,
      sacrifice: true,
      challenges: true,
      exitChallenge: true,
      eternity: true,
      dilation: true,
      resetReality: true,
      glyphReplace: true,
      glyphSacrifice: true,
      autoClean: true,
      sacrificeAll: true,
      glyphSelection: true,
      glyphUndo: true,
      deleteGlyphSetSave: true,
      glyphRefine: true,
      bigCrunch: true,
      replicantiGalaxy: true,
      antimatterGalaxy: true,
      dimensionBoost: true,
      switchAutomatorMode: true,
      respecIAP: true
    },
    awayProgress: {
      antimatter: true,
      dimensionBoosts: true,
      antimatterGalaxies: true,
      infinities: true,
      infinityPoints: true,
      replicanti: true,
      replicantiGalaxies: true,
      eternities: true,
      eternityPoints: true,
      tachyonParticles: true,
      dilatedTime: true,
      tachyonGalaxies: true,
      timeTheorems: true,
      achievementCount: true,
      realities: true,
      realityMachines: true,
      imaginaryMachines: true,
      relicShards: true,
      darkMatter: true,
      darkEnergy: true,
      singularities: true,
      celestialMemories: true,
      blackHole: true,
      realityShards: true
    },
    hiddenTabBits: 0,
    hiddenSubtabBits: [...Array.repeat(0, 10), 1, 0],
    lastOpenTab: 0,
    lastOpenSubtab: Array.repeat(0, 11),
    perkLayout: 0,
    perkPhysicsEnabled: true,
    automatorEvents: {
      newestFirst: false,
      timestampType: 0,
      maxEntries: 200,
      clearOnReality: true,
      clearOnRestart: true,
    },
    invertTTgenDisplay: false,
    autoRealityForFilter: false,
  },
  IAP: {
    enabled: false,
    checkoutSession: {
      id: false,
    }
  },
};

export const Player = {
  defaultStart: deepmergeAll([{}, player]),

  get isInMatterChallenge() {
    return NormalChallenge(11).isRunning || InfinityChallenge(6).isRunning;
  },

  get isInAntimatterChallenge() {
    return NormalChallenge.isRunning || InfinityChallenge.isRunning;
  },

  get antimatterChallenge() {
    return NormalChallenge.current || InfinityChallenge.current;
  },

  get isInAnyChallenge() {
    return this.isInAntimatterChallenge || EternityChallenge.isRunning || LogicChallenge.isRunning;
  },

  get anyChallenge() {
    return this.antimatterChallenge || EternityChallenge.current || LogicChallenge.current;
  },

  get canCrunch() {
    if (NormalChallenge.isRunning && NormalChallenge.current.isBroken) return false;
    const challenge = NormalChallenge.current || InfinityChallenge.current;
    const goal = challenge === undefined ? BE.NUMBER_MAX_VALUE : challenge.goal;
    return player.records.thisInfinity.maxAM.gte(goal);
  },

  get canEternity() {
    if (!DEV && !player.options.tester) return false;
    return player.records.thisEternity.maxIP.gte(Player.eternityGoal);
  },

  get bestRunIPPM() {
    return GameCache.bestRunIPPM.value;
  },

  get averageRealTimePerEternity() {
    return GameCache.averageRealTimePerEternity.value;
  },

  get tickSpeedMultDecrease() {
    return GameCache.tickSpeedMultDecrease.value;
  },

  get dimensionMultDecrease() {
    return GameCache.dimensionMultDecrease.value;
  },

  get infinityGoal() {
    const challenge = NormalChallenge.current || InfinityChallenge.current;
    return challenge === undefined ? BE.NUMBER_MAX_VALUE : challenge.goal;
  },

  get infinityLimit() {
    const antimatterChallenge = NormalChallenge.current || InfinityChallenge.current;
    if (antimatterChallenge) return antimatterChallenge.goal;
    const logicChallenge = LogicChallenge.current;
    if (logicChallenge) return logicChallenge.goal;
    return BE.MAX_VALUE;
  },

  get eternityGoal() {
    return EternityChallenge.isRunning
      ? EternityChallenge.current.currentGoal
      : requiredIPForEP(1);
  },

  get automatorUnlocked() {
    return AutomatorPoints.totalPoints >= AutomatorPoints.pointsForAutomator || player.reality.automator.forceUnlock;
  },

  resetRequirements(key) {
    const glyphCount = player.requirementChecks.reality.maxGlyphs;
    // This switch case intentionally falls through because every lower layer should be reset as well
    switch (key) {
      case "reality":
        player.requirementChecks.reality = {
          noAM: true,
          noTriads: true,
          noPurchasedTT: true,
          // Note that these two checks below are only used in row 2, which is in principle always before the "flow"
          // upgrades in row 3 which passively generate infinities/eternities. These upgrades won't cause a lockout
          // as these requirements are only invalidated on manual infinities or eternities.
          noInfinities: true,
          noEternities: true,
          noContinuum: player.auto.disableContinuum,
          maxID1: BEC.D0,
          maxStudies: 0,
          // This only gets set to the correct value when Glyphs.updateMaxGlyphCount is called, which always happens
          // before this part of the code is reached in the Reality reset. Nevertheless, we want to keep its old value.
          maxGlyphs: glyphCount,
          slowestBH: BlackHoles.areNegative ? player.blackHoleNegative : 1,
        };
      // eslint-disable-next-line no-fallthrough
      case "eternity":
        player.requirementChecks.eternity = {
          onlyAD1: true,
          onlyAD8: true,
          noAD1: true,
          noRG: true,
        };
      // eslint-disable-next-line no-fallthrough
      case "infinity":
        player.requirementChecks.infinity = {
          maxAll: false,
          noSacrifice: true,
          noAD8: true,
        };
        break;
      default:
        throw Error("Unrecognized prestige layer for requirement reset");
    }
  }
};

export function guardFromNaNValues(obj) {
  function isObject(ob) {
    return ob !== null && typeof ob === "object" && !(ob instanceof BE);
  }

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

    if (key === "automator") continue;

    let value = obj[key];
    if (isObject(value)) {
      guardFromNaNValues(value);
      continue;
    }

    if (typeof value === "number") {
      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: () => value,
        set: function guardedSetter(newValue) {
          if (newValue === null || newValue === undefined) {
            throw new Error("null/undefined player property assignment");
          }
          if (typeof newValue !== "number") {
            throw new Error("Non-Number assignment to Number player property");
          }
          if (!isFinite(newValue)) {
            throw new Error("NaN player property assignment");
          }
          value = newValue;
        }
      });
    }

    if (value instanceof BE) {
      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: () => value,
        set: function guardedSetter(newValue) {
          if (newValue === null || newValue === undefined) {
            throw new Error("null/undefined player property assignment");
          }
          if (!(newValue instanceof BE)) {
            throw new Error("Non-BE assignment to BE player property");
          }
          if (!isFinite(newValue.mag) || !isFinite(newValue.layer) || !isFinite(newValue.sign)) {
            throw new Error("NaN player property assignment");
          }
          value = newValue;
        }
      });
    }
  }
}
