# מנוע משחק מודולרי לפעילויות לימודיות

מערכת ליצירת משחקים חינוכיים אינטראקטיביים עם דגש על תוכן יהודי, מועדים וחגים.

## תוכן עניינים
- [סקירה כללית](#סקירה-כללית)
- [דרישות מערכת והתקנה](#דרישות-מערכת-והתקנה)
- [מבנה הפרויקט](#מבנה-הפרויקט)
- [מערכת משחקים](#מערכת-משחקים)
- [מערכת העיצוב "מסע הדעת"](#מערכת-העיצוב-מסע-הדעת)
- [משחק "המסע לחירות"](#משחק-המסע-לחירות)
- [דיבוג ופתרון בעיות](#דיבוג-ופתרון-בעיות)
- [פיתוח והרחבה](#פיתוח-והרחבה)

## סקירה כללית

מנוע משחק מודולרי המאפשר יצירה מהירה של משחקים חינוכיים אינטראקטיביים לנושאים שונים (חגים, מועדים, נושאי לימוד). המערכת מבוססת על ארכיטקטורת React ומעוצבת עם Tailwind CSS.

**יתרונות המערכת:**
- **מודולריות**: ספריית רכיבים לשימוש חוזר
- **יעילות**: הפחתת זמן הפיתוח לכל משחק חדש
- **גמישות**: התאמה לנושאים שונים עם שינויים מינימליים
- **עיצוב אחיד**: מערכת עיצוב מובנית המותאמת לנושאים שונים

**מצב נוכחי:**
- תשתית המנוע הושלמה ברובה
- פותחו מודולי המשחק הבסיסיים
- פותחה מערכת עיצוב "מסע הדעת" עם ערכות נושא לפסח וט"ו בשבט
- משחק הדגמה "המסע לחירות" לחג הפסח פותח חלקית (4 מתוך 8 שלבים)

## דרישות מערכת והתקנה

### דרישות מקדימות
- Node.js (גרסה 18.0.0 ומעלה)
- npm או yarn

### התקנה והפעלה

```bash
# שיבוט הריפוזיטורי
git clone https://github.com/Doron-gut1/educational-game-engine.git
cd educational-game-engine

# התקנת תלויות
npm install
# או
yarn

# הפעלה בסביבת פיתוח
npm run dev
# או
yarn dev

# בניית גרסת ייצור
npm run build
# או
yarn build
```

## מבנה הפרויקט

```
/src
  /core                  # שכבת הליבה
    /engine              # מנוע המשחק
      GameEngine.jsx     # ניהול המשחק הכללי
      TemplateManager.js # ניהול תבניות משחק
      StoryManager.js    # ניהול עלילה ודמויות
      GameState.js       # ניהול מצב משחק
    /contexts
      GameContext.js     # קונטקסט React לשיתוף מצב המשחק
    /hooks
      useGameProgress.js # ניהול התקדמות
      useScoring.js      # ניהול ניקוד
      useTimer.js        # ניהול זמן
      useHints.js        # ניהול רמזים
  
  /design-system         # מערכת העיצוב "מסע הדעת"
    /themes              # תמות עיצוב
      baseTheme.js       # תמה בסיסית
      passoverTheme.js   # תמה לפסח
      tuBishvatTheme.js  # תמה לט"ו בשבט
    /components          # רכיבי עיצוב
      /buttons           # כפתורים
      /cards             # כרטיסיות
      /navigation        # ניווט וסימון התקדמות
    ThemeProvider.jsx    # ניהול תמות
  
  /components            # רכיבי UI משותפים
    /ui
      Button.jsx
      Card.jsx
      ProgressBar.jsx
      Modal.jsx
      HintsPanel.jsx     # פאנל רמזים
      SourceReference.jsx # הצגת מקורות
      LearningPopup.jsx  # חלון סיכום למידה
    /layout
      GameContainer.jsx
      StageWrapper.jsx
      NavigationBar.jsx
    
  /modules               # מודולי משחק
    /multiChoice         # שאלות רב-ברירה
    /dragAndDrop         # גרירה והשלכה
    /matching            # התאמת זוגות
    /fillInBlanks        # השלמת מילים 
    /wordSearch          # חיפוש מילים
    /sorting             # מיון וסידור
  
  /templates             # תבניות משחק
    questJourney.js      # תבנית מסע משימות
    escapeRoom.js        # תבנית חדר בריחה
    memoryChallenge.js   # תבנית אתגרי זיכרון
    
  /games                 # משחקים ספציפיים
    /passover            # משחק פסח 
      config.js          # הגדרות המשחק
      data.json          # תוכן המשחק
      characters.js      # דמויות במשחק
      PassoverQuestGame.jsx # רכיב ראשי
    
  App.jsx                # נקודת כניסה ראשית
  main.jsx               # הרכבת האפליקציה
```

## מערכת משחקים

### רכיבי ליבה

| רכיב | תפקיד |
|------|-------|
| `GameEngine` | ניהול כללי של המשחק |
| `TemplateManager` | ניהול תבניות משחק |
| `GameState` | ניהול מצב המשחק והתקדמות |
| `GameContext` | העברת מצב המשחק לכל הרכיבים |

### מודולי משחק

| מודול | תיאור | סטטוס |
|-------|-------|-------|
| `MultiChoiceGame` | שאלות עם מספר תשובות אפשריות | הושלם |
| `DragDropGame` | גרירת פריטים למיקום הנכון | הושלם |
| `MatchingGame` | התאמת זוגות של פריטים קשורים | הושלם |
| `FillInBlanksGame` | השלמת מילים חסרות בטקסט | הושלם |
| `WordSearchGame` | מציאת מילים בתוך רשת אותיות | הושלם |
| `SortingGame` | מיון פריטים לפי סדר או קטגוריות | הושלם |

### רכיבים תומכים

| רכיב | תיאור |
|------|-------|
| `HintsPanel` | פאנל לחשיפה הדרגתית של רמזים |
| `SourceReference` | הצגת מקורות ומידע מורחב |
| `LearningPopup` | חלון המוצג בסיום שלב עם סיכום למידה |

## מערכת העיצוב "מסע הדעת"

מערכת עיצוב חדשה המספקת חוויית משתמש אחידה ומותאמת לתכנים חינוכיים תורניים, עם יכולת להתאמה לפי נושא המשחק.

### רכיבי מפתח

| רכיב | תיאור |
|------|-------|
| `ThemeProvider` | ניהול התמה והעברתה לכל רכיבי המערכת |
| `useTheme` | הוק לשימוש קל בערכי התמה הנוכחית |
| `themes` | אוסף תמות מוגדרות מראש לנושאים שונים |

### תמות זמינות

| תמה | תיאור | מצב |
|-----|-------|-----|
| `baseTheme` | תמה בסיסית עם צבעי כחול וזהב | הושלם |
| `passoverTheme` | תמה לחג הפסח עם דגש על כחול-סגול וזהב-חירות | הושלם |
| `tuBishvatTheme` | תמה לט"ו בשבט עם דגש על ירוקים וסגול-פריחה | הושלם |

### רכיבי UI חדשים

| רכיב | תיאור | סטטוס |
|------|-------|-------|
| `Button` | כפתור מעוצב עם מגוון וריאנטים | הושלם |
| `IconButton` | כפתור אייקון | הושלם |
| `ScrollCard` | כרטיסיה בסגנון מגילה | הושלם |
| `GlassCard` | כרטיסיה בסגנון זכוכית | הושלם |
| `JourneyMap` | מפת התקדמות במסע המשחק | הושלם |
| `StageMarker` | סמן שלב במפת המסע | הושלם |

### דוגמת שימוש

```jsx
// יצירת ממשק עם תמה מותאמת
import { ThemeProvider } from './design-system';
import { Button, ScrollCard } from './design-system/components';

function MyComponent() {
  return (
    <ThemeProvider theme="passover">
      <ScrollCard className="p-6">
        <h2 className="text-2xl font-bold mb-4">כותרת המשחק</h2>
        <p className="mb-4">תוכן המשחק...</p>
        <Button variant="primary" size="large">התחל משחק</Button>
      </ScrollCard>
    </ThemeProvider>
  );
}
```

## משחק "המסע לחירות"

משחק הדגמה העוסק בסיפור יציאת מצרים, המבוסס על תבנית "מסע משימות". השחקן משתמש בידע תורני ובמקורות כדי לפתור חידות ואתגרים בדרך לשחזור "מגילת החירות".

### מבנה המשחק
1. **שלב מקדים**: מסע אברהם - "לך לך מארצך" (הושלם)
2. **שלב 1**: ברית בין הבתרים - "הבטחה לדורות" (הושלם)
3. **שלב 2**: השעבוד במצרים - "כור הברזל" (הושלם)
4. **שלב 3**: משה ואהרן - "הנהגה בעת משבר" (הושלם)
5. **שלב 4**: עשר המכות - "יד ה' במצרים" (בפיתוח)
6. **שלב 5**: ליל הסדר הראשון - "והגדת לבנך" (בפיתוח)
7. **שלב 6**: קריעת ים סוף - "בין המיצרים" (בפיתוח)
8. **שלב 7**: מתן תורה - "מחירות פיזית לחירות רוחנית" (בפיתוח)

### דמויות מנחות
- **רבי אלעזר הסופר** - דמות ראשית שמובילה את המסע
- **מרים הנביאה** - דמות עזר שמספקת רמזים והכוונה

## דיבוג ופתרון בעיות

### נקודות דיבוג נפוצות

1. **טעינת תבניות**:
   - בדוק את `TemplateManager.js` ווידא שמתקיימת טעינה נכונה של תבניות
   - וידא את הנתיב הנכון לקבצי תבניות ב-`loadTemplate()`

2. **טעינת תוכן**:
   - בדוק שקובץ `data.json` נטען כראוי בתוך `GameManager`
   - וידא שמבנה ה-JSON תואם למה שהרכיבים מצפים לו

3. **רנדור ראשוני**:
   - בדוק שרכיב `App.jsx` מעביר את הנתונים הנכונים ל-`GameContainer`
   - וידא שה-`GameContext` מאותחל כראוי

4. **בעיות תמה**:
   - וידא שמערכת התמות נטענת כהלכה ב-`ThemeProvider` 
   - בדוק שהקומפוננטות משתמשות ב-`useTheme` כראוי

5. **קוד דיבוג בסיסי**:
   ```javascript
   // הוסף בתחילת App.jsx
   console.log("App initialized");
   
   // הוסף ב-GameContainer
   useEffect(() => {
     console.log("GameContainer mounted, config:", gameConfig);
   }, []);
   
   // הוסף ב-ThemeProvider
   useEffect(() => {
     console.log("ThemeProvider mounted, theme:", theme);
   }, [theme]);
   ```

## פיתוח והרחבה

### כיווני פיתוח אפשריים

1. **השלמת תוכן המשחק**:
   - השלמת הגדרת השלבים החסרים ב-`data.json`
   - הוספת תוכן חינוכי רלוונטי לכל שלב

2. **הרחבת מערכת העיצוב**:
   - הוספת רכיבים נוספים כמו `Feedback`, `Tooltip`, `Confetti`
   - פיתוח תמות נוספות לחגים אחרים (שבועות, סוכות)

3. **שיפור ניהול שלבי multi_stage**:
   - עדכון `GameManager` לתמיכה במעבר בין אתגרים באותו שלב 
   - שיפור ממשק תצוגת ההתקדמות בתוך שלב

4. **מנגנון שמירת התקדמות**:
   - פיתוח `storageService` לשמירה וטעינה של מצב המשחק
   - הוספת ממשק משתמש לבחירת משחק שמור

5. **התאמה אישית לתלמיד**:
   - הוספת מערכת פרופילים בסיסית
   - התאמת רמת קושי אוטומטית בהתאם לביצועים

### הוספת משחק חדש

כדי להוסיף משחק חדש, יש ליצור את הקבצים הבאים:

1. תיקייה חדשה תחת `/src/games/[game_name]`
2. קובץ `config.js` עם הגדרות המשחק
3. קובץ `data.json` עם תוכן השלבים והאתגרים
4. קובץ `characters.js` עם הגדרת הדמויות
5. רכיב ראשי ב-`[GameName]Game.jsx`
6. ערכת עיצוב ייעודית ב-`/src/design-system/themes`
7. עדכון ב-`App.jsx` לכלול את המשחק החדש