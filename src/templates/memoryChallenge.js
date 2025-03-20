/**
 * תבנית משחק אתגר זיכרון
 * משחק המתמקד בלמידה וזכירה
 */
export const memoryChallengeTemplate = {
  id: "memory_challenge",
  name: "אתגר זיכרון",
  description: "תבנית משחק המתמקדת באתגרי זיכרון ולמידה",
  structure: {
    intro: { required: true, type: "learning_session" },
    practice: {
      required: true,
      minCount: 1,
      maxCount: 5,
      allowedTypes: ["practice_round", "guided_practice"]
    },
    challenges: {
      required: true,
      minCount: 3,
      maxCount: 10,
      allowedTypes: [
        "memory", "multi_choice", "fill_in_blanks", 
        "word_search", "matching"
      ]
    },
    assessment: { required: true, type: "final_test" },
    outro: { required: true, type: "results" }
  },
  progression: {
    type: "stepwise", // התקדמות רק אחרי השלמת כל שלב בהצלחה
    minimumSuccessRate: 70, // אחוז הצלחה מינימלי לכל שלב
    adaptiveDifficulty: true // רמת קושי משתנה לפי הצלחה קודמת
  },
  scoring: {
    basePoints: 10,
    accuracyBonus: true, // בונוס על דיוק גבוה
    speedBonus: true, // בונוס על מהירות תגובה
    totalScoreVisible: true
  },
  difficulty: {
    levels: ["easy", "medium", "hard", "expert"],
    adjustsComplexity: true,
    adjustsTimeLimit: true,
    adjustsRepetition: true // רמות קלות יותר כוללות חזרות רבות יותר
  },
  storytelling: {
    characterEnabled: false, // פחות דגש על עלילה
    learningFocused: true, // דגש על תהליך למידה
    progressVisualizer: true // ויזואליזציה של ההתקדמות
  },
  defaultSettings: {
    timerEnabled: true,
    hintsEnabled: true,
    reviewEnabled: true, // אפשרות לחזור על חומר שנלמד
    showCorrectAnswers: true
  }
};