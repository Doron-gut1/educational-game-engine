# ליבת מנוע המשחק

תיקייה זו מכילה את רכיבי הליבה של מנוע המשחק המודולרי, שאחראים על ניהול מצב, ניהול שלבים, ניהול תבניות ושאר פונקציונליות מרכזית.

## רכיבים מרכזיים

### StateManager

מנהל מצב מאובטח המונע מצבי מירוץ (race conditions) ולולאות עדכון אינסופיות. אחראי על:
- ניהול מצב המשחק באופן אטומי
- הודעה למאזינים על שינויים
- ניהול תור עדכונים ומניעת התנגשויות
- שמירת וטעינת מצב

### StageController

בקר שלבים המטפל במעברים בין שלבים ומניעת לולאות אינסופיות. אחראי על:
- מעבר בטוח בין שלבים
- מעקב אחר היסטוריית מעברים וזיהוי לולאות
- סימון שלבים שהושלמו
- ניהול התקדמות במשחק

### engine

תיקיית משנה המכילה רכיבי מנוע נוספים:
- **GameEngine** - מנוע המשחק הראשי
- **TemplateManager** - ניהול תבניות משחק
- **StoryManager** - ניהול עלילה ודמויות
- **AssetManager** - ניהול נכסים ותכנים

## שינויים בארכיטקטורה

הארכיטקטורה עודכנה כדי לשפר את יציבות המערכת, למנוע בעיות כמו לולאות עדכון אינסופיות, ולייעל את תהליך הפיתוח:

1. **מיקום רכיבי ליבה** - הועברו מתיקיית `services` לתיקיית `core`
2. **שיפור ניהול המצב** - מניעת עדכונים כפולים ולולאות עדכון אינסופיות
3. **הפרדת אחריות** - הפרדה ברורה בין ניהול מצב, ניהול שלבים ואינטראקציה עם המשתמש
4. **ניהול תלויות** - טיפול נכון בתלויות ב-React hooks

## דוגמת שימוש

```jsx
// יצירת מנהל מצב ובקר שלבים
const stateManager = new StateManager(initialState);
const stageController = new StageController(stateManager);

// עדכון מצב
stateManager.setState({ score: 100 });

// מעבר לשלב חדש
stageController.transitionToStage('stage2');

// סימון שלב כמושלם
stageController.completeStage('stage1', 50); // 50 נקודות
```

## שימוש ב-GameContext

קונטקסט המשחק (`GameContext`) הוא הדרך המומלצת לגשת לרכיבי הליבה מתוך רכיבי React:

```jsx
import { useGameContext } from '../contexts/GameContext';

function GameComponent() {
  const { state, stateManager, stageController, moveToStage, addScore } = useGameContext();
  
  // השתמש ב-state כדי לקרוא את מצב המשחק
  console.log(state.score);
  
  // השתמש בפונקציות עזר כדי לבצע פעולות נפוצות
  moveToStage('nextStage');
  addScore(10);
  
  // שימוש ישיר בשירותים
  stateManager.setState({ difficulty: 'hard' });
  stageController.completeStage('currentStage');
}
```
