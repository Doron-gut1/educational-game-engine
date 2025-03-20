/**
 * דוגמאות נתונים למודול המיון
 */

// דוגמה למשחק מיון לפי קטגוריות: מיון מאכלים לחמץ ולא חמץ
export const pesachCategoriesExample = {
  title: "מיון מאכלים לפסח",
  description: "גרור את המאכלים למיכל המתאים - חמץ או לא חמץ",
  sortType: "categories",
  categories: [
    { id: "chametz", name: "חמץ" },
    { id: "not_chametz", name: "לא חמץ" }
  ],
  items: [
    { id: "item1", content: "לחם", category: "chametz" },
    { id: "item2", content: "מצה", category: "not_chametz" },
    { id: "item3", content: "פיתה", category: "chametz" },
    { id: "item4", content: "ביצה", category: "not_chametz" },
    { id: "item5", content: "עוגה", category: "chametz" },
    { id: "item6", content: "תפוח", category: "not_chametz" },
    { id: "item7", content: "פסטה", category: "chametz" },
    { id: "item8", content: "בשר", category: "not_chametz" },
    { id: "item9", content: "קרקר", category: "chametz" }
  ],
  shuffleItems: true,
  orientation: "vertical"
};

// דוגמה למשחק מיון לפי קטגוריות עם תמונות
export const fruitsAndVegetablesExample = {
  title: "מיון פירות וירקות",
  description: "גרור את הפירות והירקות למיכל המתאים",
  sortType: "categories",
  categories: [
    { id: "fruits", name: "פירות" },
    { id: "vegetables", name: "ירקות" }
  ],
  items: [
    { 
      id: "item1", 
      content: { 
        text: "תפוח", 
        image: "/assets/games/_shared/fruits/apple.png" 
      }, 
      type: "image",
      category: "fruits" 
    },
    { 
      id: "item2", 
      content: { 
        text: "גזר", 
        image: "/assets/games/_shared/vegetables/carrot.png" 
      }, 
      type: "image",
      category: "vegetables" 
    },
    { 
      id: "item3", 
      content: { 
        text: "בננה", 
        image: "/assets/games/_shared/fruits/banana.png" 
      }, 
      type: "image",
      category: "fruits" 
    },
    { 
      id: "item4", 
      content: { 
        text: "עגבנייה", 
        image: "/assets/games/_shared/vegetables/tomato.png" 
      }, 
      type: "image",
      category: "vegetables" 
    }
  ],
  shuffleItems: true,
  orientation: "horizontal"
};

// דוגמה למשחק מיון לפי סדר: אירועי יציאת מצרים
export const exodusSequenceExample = {
  title: "סדר אירועי יציאת מצרים",
  description: "סדר את האירועים לפי הסדר הכרונולוגי הנכון",
  sortType: "sequence",
  items: [
    { id: "item1", content: "משה מוציא את בני ישראל ממצרים", correctPosition: 3 },
    { id: "item2", content: "עשר המכות", correctPosition: 2 },
    { id: "item3", content: "קריעת ים סוף", correctPosition: 4 },
    { id: "item4", content: "משה בתיבה", correctPosition: 1 },
    { id: "item5", content: "קבלת התורה בהר סיני", correctPosition: 5 }
  ],
  shuffleItems: true,
  orientation: "vertical"
};

// דוגמה למשחק עם רמות קושי שונות
export const holidaysSequenceWithDifficulty = {
  title: "סדר חגי ישראל",
  description: "סדר את חגי ישראל לפי הסדר בלוח השנה העברי, החל מראש השנה",
  sortType: "sequence",
  items: [
    { id: "item1", content: "ראש השנה", correctPosition: 1 },
    { id: "item2", content: "יום כיפור", correctPosition: 2 },
    { id: "item3", content: "סוכות", correctPosition: 3 },
    { id: "item4", content: "שמחת תורה", correctPosition: 4 },
    { id: "item5", content: "חנוכה", correctPosition: 5 },
    { id: "item6", content: "ט\"ו בשבט", correctPosition: 6 },
    { id: "item7", content: "פורים", correctPosition: 7 },
    { id: "item8", content: "פסח", correctPosition: 8 },
    { id: "item9", content: "יום העצמאות", correctPosition: 9 },
    { id: "item10", content: "ל\"ג בעומר", correctPosition: 10 },
    { id: "item11", content: "שבועות", correctPosition: 11 },
    { id: "item12", content: "תשעה באב", correctPosition: 12 }
  ],
  shuffleItems: true,
  orientation: "vertical",
  // הגדרות לרמות קושי שונות
  difficulty: {
    easy: {
      // ברמה קלה רק 6 חגים עיקריים
      items: [
        { id: "item1", content: "ראש השנה", correctPosition: 1 },
        { id: "item2", content: "יום כיפור", correctPosition: 2 },
        { id: "item3", content: "סוכות", correctPosition: 3 },
        { id: "item5", content: "חנוכה", correctPosition: 4 },
        { id: "item7", content: "פורים", correctPosition: 5 },
        { id: "item8", content: "פסח", correctPosition: 6 }
      ]
    },
    medium: {
      // ברמה בינונית 9 חגים
      items: [
        { id: "item1", content: "ראש השנה", correctPosition: 1 },
        { id: "item2", content: "יום כיפור", correctPosition: 2 },
        { id: "item3", content: "סוכות", correctPosition: 3 },
        { id: "item5", content: "חנוכה", correctPosition: 4 },
        { id: "item6", content: "ט\"ו בשבט", correctPosition: 5 },
        { id: "item7", content: "פורים", correctPosition: 6 },
        { id: "item8", content: "פסח", correctPosition: 7 },
        { id: "item10", content: "ל\"ג בעומר", correctPosition: 8 },
        { id: "item11", content: "שבועות", correctPosition: 9 }
      ]
    },
    hard: {
      // ברמה קשה כל 12 החגים
      items: [
        { id: "item1", content: "ראש השנה", correctPosition: 1 },
        { id: "item2", content: "יום כיפור", correctPosition: 2 },
        { id: "item3", content: "סוכות", correctPosition: 3 },
        { id: "item4", content: "שמחת תורה", correctPosition: 4 },
        { id: "item5", content: "חנוכה", correctPosition: 5 },
        { id: "item6", content: "ט\"ו בשבט", correctPosition: 6 },
        { id: "item7", content: "פורים", correctPosition: 7 },
        { id: "item8", content: "פסח", correctPosition: 8 },
        { id: "item9", content: "יום העצמאות", correctPosition: 9 },
        { id: "item10", content: "ל\"ג בעומר", correctPosition: 10 },
        { id: "item11", content: "שבועות", correctPosition: 11 },
        { id: "item12", content: "תשעה באב", correctPosition: 12 }
      ]
    }
  }
};

// דוגמה למשחק משולב של מספר משחקי מיון
export const mixedSortingGamesExample = [
  pesachCategoriesExample,
  exodusSequenceExample
];

/**
 * דוגמת שימוש בקומפוננטה:
 * 
 * // שימוש במשחק מיון קטגוריות יחיד
 * <SortingGame
 *   games={[pesachCategoriesExample]}
 *   title="מיון מאכלים לפסח"
 *   onComplete={(score) => console.log(`המשחק הסתיים עם ${score} נקודות`)}
 * />
 * 
 * // שימוש במשחק מיון סדר יחיד
 * <SortingGame
 *   games={[exodusSequenceExample]}
 *   title="סדר אירועי יציאת מצרים"
 *   basePoints={20}
 *   onComplete={handleGameComplete}
 * />
 * 
 * // שימוש במספר משחקי מיון
 * <SortingGame
 *   games={mixedSortingGamesExample}
 *   title="משחקי מיון לפסח"
 *   onComplete={handleGameComplete}
 * />
 */