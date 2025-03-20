/**
 * דוגמאות נתונים למודול חיפוש מילים
 */

// דוגמה פשוטה עם רשת מוגדרת מראש
export const pesachWordSearchExample = {
  title: "חיפוש מילים - פסח",
  description: "מצאו את כל המילים הקשורות לחג הפסח",
  grid: [
    ["מ", "צ", "ה", "ג", "ד", "י", "א", "ט", "ו"],
    ["ר", "י", "ג", "פ", "ס", "ח", "פ", "י", "ש"],
    ["ו", "צ", "ד", "ס", "צ", "ר", "י", "ק", "נ"],
    ["ר", "י", "ה", "מ", "ר", "ו", "ק", "ו", "י"],
    ["מ", "א", "ג", "ר", "י", "מ", "ו", "מ", "ס"],
    ["י", "ת", "ד", "י", "מ", "ן", "מ", "ן", "ן"],
    ["ם", "מ", "ה", "ם", "ם", "ן", "ן", "מ", "ט"],
    ["ש", "צ", "ה", "כ", "ו", "ס", "ו", "ת", "ו"],
    ["י", "ד", "ח", "מ", "ץ", "ם", "מ", "ל", "ב"]
  ],
  words: [
    "פסח",
    "מצה",
    "מרור",
    "מצרים",
    "חמץ",
    "קומן",
    "גדיא",
    "כוסות"
  ]
};

// דוגמה מורכבת יותר עם ייצור אוטומטי של הרשת
export const tuBishvatWordSearchExample = {
  title: "חיפוש מילים - ט\"ו בשבט",
  description: "מצאו את כל המילים הקשורות לחג האילנות",
  wordList: [
    "אילן",
    "פרי",
    "עץ",
    "שתיל",
    "שקדיה",
    "הדר",
    "תמר",
    "גפן",
    "זית",
    "רימון"
  ],
  gridSize: { rows: 10, cols: 10 },
  directions: ["horizontal", "vertical", "diagonal"],
  difficulty: {
    easy: {
      wordList: [
        "אילן",
        "פרי",
        "עץ",
        "שתיל",
        "זית"
      ],
      gridSize: { rows: 8, cols: 8 },
      directions: ["horizontal", "vertical"] // בלי אלכסוני
    },
    medium: {
      wordList: [
        "אילן",
        "פרי",
        "עץ",
        "שתיל",
        "שקדיה",
        "הדר",
        "זית"
      ],
      gridSize: { rows: 9, cols: 9 },
      directions: ["horizontal", "vertical", "diagonal"]
    },
    hard: {
      wordList: [
        "אילן",
        "פרי",
        "עץ",
        "שתיל",
        "שקדיה",
        "הדר",
        "תמר",
        "גפן",
        "זית",
        "רימון"
      ],
      gridSize: { rows: 10, cols: 10 },
      directions: ["horizontal", "vertical", "diagonal"]
    }
  }
};

// דוגמה לחיפוש מילים עם הגבלת זמן
export const timedWordSearchExample = {
  title: "חיפוש מילים בזמן מוגבל",
  description: "מצאו כמה שיותר מילים בזמן מוגבל",
  wordList: [
    "ראש",
    "שנה",
    "תפוח",
    "דבש",
    "רימון",
    "שופר",
    "תשליך",
    "סליחות",
    "מחילה",
    "תקיעה",
    "תרועה",
    "שברים"
  ],
  gridSize: { rows: 12, cols: 12 },
  directions: ["horizontal", "vertical", "diagonal"],
  timeLimit: 120, // 2 דקות
};

// דוגמה לשימוש במספר תצרפים
export const multipleWordSearchExample = [
  pesachWordSearchExample,
  {
    ...tuBishvatWordSearchExample,
    title: "חיפוש מילים - ט\"ו בשבט (חלק ב')",
    wordList: [
      "נטיעות",
      "קק\"ל",
      "פרחים",
      "סביבה",
      "צמיחה",
      "לבלוב",
      "ירוק",
      "נבט",
      "סדר"
    ]
  }
];

/**
 * דוגמת שימוש בקומפוננטה:
 * 
 * // שימוש בתצרף יחיד
 * <WordSearchGame
 *   puzzles={[pesachWordSearchExample]}
 *   title="חיפוש מילים לפסח"
 *   onComplete={(score) => console.log(`המשחק הסתיים עם ${score} נקודות`)}
 * />
 * 
 * // שימוש במספר תצרפים
 * <WordSearchGame
 *   puzzles={multipleWordSearchExample}
 *   title="משחקי חיפוש מילים"
 *   basePoints={20}
 *   onComplete={handleGameComplete}
 * />
 */