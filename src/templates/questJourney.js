/**
 * תבנית משחק מסע משימות
 * משחק עם נרטיב עלילתי ושלבים לינאריים 
 */
export const questJourneyTemplate = {
  id: "quest_journey",
  name: "מסע משימות",
  description: "תבנית משחק למסע הרפתקאות עם משימות בדרך",
  structure: {
    intro: {
      required: true,
      type: "story_intro"
    },
    stages: {
      required: true,
      minCount: 3,
      maxCount: 10,
      allowedTypes: [
        "multi_choice", "drag_drop", "matching", 
        "memory", "sorting", "puzzle", "word_search", 
        "fill_in_blanks"
      ]
    },
    boss_challenge: {
      required: true,
      type: "combined_challenge"
    },
    outro: {
      required: true,
      type: "story_conclusion"
    }
  },
  progression: {
    type: "linear", // או "branching", "open_world"
    allowSkippingStages: false,
    requireCompletionForProgress: true
  },
  scoring: {
    basePoints: 10,
    timeBonusEnabled: true,
    streakBonusEnabled: true,
    negativePoints: false
  },
  difficulty: {
    levels: ["easy", "medium", "hard"],
    adjustsOptions: true,
    adjustsTimer: true,
    adjustsHints: true
  },
  storytelling: {
    characterEnabled: true,
    narrativeStyle: "quest",
    rewardsCollectionEnabled: true
  },
  defaultSettings: {
    timerEnabled: true,
    hintsEnabled: true,
    soundEnabled: true,
    animationsEnabled: true
  }
};