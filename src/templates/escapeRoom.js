/**
 * תבנית משחק חדר בריחה
 * מתאים למשחקים עם חידות ופאזלים, עם שילוב סיפורי ותחושת דחיפות
 */
export const escapeRoomTemplate = {
  id: "escape_room",
  name: "חדר בריחה",
  description: "תבנית משחק המדמה חדר בריחה עם חידות שיש לפתור",
  structure: {
    intro: { 
      required: true, 
      type: "scenario_intro" 
    },
    puzzles: {
      required: true,
      minCount: 3,
      maxCount: 15,
      allowedTypes: [
        "multi_choice", "drag_drop", "matching", "puzzle",
        "fill_in_blanks", "code_breaking", "lock_puzzle"
      ]
    },
    final_challenge: { 
      required: true, 
      type: "final_puzzle" 
    },
    outro: { 
      required: true, 
      type: "victory" 
    }
  },
  progression: {
    type: "semi_linear", // מאפשר לפתור חלק מהחידות במקביל
    allowSkippingStages: false,
    requireCompletionForProgress: true,
    dependencyGraph: true // מאפשר להגדיר תלויות בין חידות
  },
  scoring: {
    basePoints: 0, // בחדר בריחה אין ניקוד אלא רק הצלחה
    timeTracking: true, // מעקב אחר זמן כולל
    hintPenalty: true, // שימוש ברמזים מפחית מהציון הסופי
  },
  difficulty: {
    levels: ["easy", "medium", "hard"],
    adjustsHints: true,
    adjustsPuzzleComplexity: true
  },
  storytelling: {
    immersiveEnvironment: true,
    scenarioBackground: true,
    timedNarrative: true
  },
  defaultSettings: {
    timerEnabled: true,
    timerVisible: true,
    hintsEnabled: true,
    soundEnabled: true,
    ambientSounds: true
  }
};

/**
 * פונקציה ליצירת תבנית חדר בריחה מותאם אישית
 * @param {Object} options אפשרויות להתאמה
 * @returns {Object} תבנית חדר בריחה מותאם
 */
export function createEscapeRoom(options = {}) {
  return {
    ...escapeRoomTemplate,
    ...options,
    // מיזוג הגדרות ברמה עמוקה יותר
    structure: {
      ...escapeRoomTemplate.structure,
      ...options.structure
    },
    progression: {
      ...escapeRoomTemplate.progression,
      ...options.progression
    },
    scoring: {
      ...escapeRoomTemplate.scoring,
      ...options.scoring
    },
    difficulty: {
      ...escapeRoomTemplate.difficulty,
      ...options.difficulty
    },
    storytelling: {
      ...escapeRoomTemplate.storytelling,
      ...options.storytelling
    },
    defaultSettings: {
      ...escapeRoomTemplate.defaultSettings,
      ...options.defaultSettings
    }
  };
}

export default escapeRoomTemplate;