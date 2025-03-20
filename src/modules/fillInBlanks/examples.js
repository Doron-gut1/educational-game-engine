/**
 * דוגמאות נתונים למודול השלמת מילים
 */

// דוגמה פשוטה של השלמת פסוק
export const singleTextExample = {
  text: "ארץ חיטה ו[blank1] ו[blank2] ותאנה ורימון ארץ [blank3] שמן ודבש",
  description: "השלימו את המילים החסרות בפסוק המתאר את שבעת המינים",
  blanks: {
    "blank1": { answer: "שעורה", caseSensitive: false },
    "blank2": { answer: "גפן", caseSensitive: false },
    "blank3": { answer: "זית", caseSensitive: false }
  },
  wordBank: ["שעורה", "גפן", "זית", "תפוח", "אגס"],
  showWordBank: true
};

// דוגמה של השלמת פסוק עם רמות קושי שונות
export const textWithDifficultyExample = {
  text: "משה רבנו הנהיג את בני ישראל ביציאת [blank1] והוליך אותם במשך [blank2] שנה במדבר עד הגיעם לארץ [blank3].",
  description: "השלימו את המילים החסרות בפסוק העוסק ביציאת מצרים",
  blanks: {
    "blank1": { answer: "מצרים", caseSensitive: false },
    "blank2": { answer: "ארבעים", caseSensitive: false, acceptAlternatives: ["40"] },
    "blank3": { answer: "ישראל", caseSensitive: false, acceptAlternatives: ["כנען", "הקודש"] }
  },
  wordBank: ["מצרים", "ארבעים", "ישראל", "שלושים", "צרפת"],
  showWordBank: true,
  // הגדרות רמות קושי
  difficulty: {
    easy: {
      // ברמה קלה מציגים את כל מאגר המילים
      wordBank: ["מצרים", "ארבעים", "ישראל", "שלושים", "צרפת"],
      showWordBank: true
    },
    medium: {
      // ברמה בינונית פחות מילים במאגר
      wordBank: ["מצרים", "ארבעים", "ישראל"],
      showWordBank: true
    },
    hard: {
      // ברמה קשה אין מאגר מילים בכלל
      wordBank: [],
      showWordBank: false
    }
  }
};

// דוגמה של מספר טקסטים למשחק שלם
export const multipleTextsExample = [
  {
    text: "דוד המלך היה בנו של [blank1] והיה המלך ה[blank2] של ישראל.",
    blanks: {
      "blank1": { answer: "ישי", caseSensitive: false },
      "blank2": { answer: "שני", caseSensitive: false, acceptAlternatives: ["2"] }
    },
    wordBank: ["ישי", "שני", "שאול", "שלישי", "אברהם"],
    showWordBank: true
  },
  {
    text: "ירושלים היא [blank1] ישראל והיא העיר הקדושה ביותר ל[blank2].",
    blanks: {
      "blank1": { answer: "בירת", caseSensitive: false },
      "blank2": { answer: "יהודים", caseSensitive: false, acceptAlternatives: ["יהדות", "עם היהודי"] }
    },
    wordBank: ["בירת", "יהודים", "מרכז", "משכן", "עיר הקודש"],
    showWordBank: true
  },
  {
    text: "חג ה[blank1] הוא חג החירות בו אנו מציינים את יציאת [blank2]. בליל הסדר אנו אוכלים [blank3] ומרור.",
    blanks: {
      "blank1": { answer: "פסח", caseSensitive: false },
      "blank2": { answer: "מצרים", caseSensitive: false },
      "blank3": { answer: "מצה", caseSensitive: false, acceptAlternatives: ["מצות"] }
    },
    wordBank: ["פסח", "מצרים", "מצה", "סוכות", "שבועות"],
    showWordBank: true
  }
];

/**
 * דוגמת שימוש בקומפוננטה:
 * 
 * // שימוש בדוגמה פשוטה
 * <FillInBlanksGame
 *   texts={[singleTextExample]}
 *   title="השלמת פסוקים"
 *   onComplete={(score) => console.log(`המשחק הסתיים עם ${score} נקודות`)}
 * />
 * 
 * // שימוש במספר טקסטים
 * <FillInBlanksGame
 *   texts={multipleTextsExample}
 *   title="חידון ידע כללי"
 *   basePoints={20}
 *   onComplete={handleGameComplete}
 * />
 */