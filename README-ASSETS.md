# מדריך ניהול נכסים במשחק

מסמך זה מתאר את מבנה תיקיות הנכסים ואת האופן שבו יש לנהל קבצי מדיה במנוע המשחק החינוכי.

## מבנה תיקיות מומלץ

```
/public
  /assets
    /games
      /{gameId}           # ספציפי למשחק מסוים
        /backgrounds      # תמונות רקע
        /characters       # דמויות
        /items            # חפצים ותמונות
        /audio            # קבצי אודיו
        
    /themes              # נכסים משותפים לפי תמה
      /{themeId}         # למשל: passover-theme
        /patterns        # דפוסים ורקעים
        /decorations     # עיטורים
        
    /shared              # נכסים משותפים לכל המערכת
      /ui                # אלמנטי ממשק
      /effects           # אפקטים ואנימציות
      /icons             # אייקונים
```

## קבצים נדרשים לכל משחק

לכל משחק בתיקיית `public/assets/games/{gameId}/` יש לכלול:

### /backgrounds
- **thumbnail.jpg** - תמונה ממוזערת למשחק, בגודל של כ-400x250 פיקסלים
- **scroll_background.jpg** (או תמונת רקע מתאימה אחרת)
- תמונות רקע נוספות לכל שלב במשחק

### /characters
- תמונות של דמויות המופיעות במשחק

### /items
- תמונות של חפצים הקשורים למשחק 

## התמונות הנדרשות עבור פסח

```
/public/assets/games/passover/
  /backgrounds/
    thumbnail.jpg           # תמונה ממוזערת לדף הבית
    scroll_background.jpg   # רקע מגילה
    intro_background.jpg    # רקע פתיחה
    desert_background.jpg   
    egypt_background.jpg
    red_sea_background.jpg
    sinai_background.jpg
  
  /characters/
    rabbi_elazar.png        # דמות רבי אלעזר
    miriam.png              # דמות מרים הנביאה
  
  /items/
    afikoman.png            # אפיקומן
```

## התמונות הנדרשות עבור ט"ו בשבט

```
/public/assets/games/tubishvat/
  /backgrounds/
    thumbnail.jpg           # תמונה ממוזערת לדף הבית
    forest_background.jpg   # רקע יער
    planting_background.jpg # רקע נטיעות
  
  /characters/
    forest_keeper.png       # דמות שומר היער
    wise_olive.png          # דמות הזית החכם
  
  /items/
    watering_can.png        # כלי השקיה
    golden_seed.png         # זרע הזהב
```

## תמונות משותפות

```
/public/assets/shared/ui/
  default-thumbnail.jpg     # תמונה ממוזערת ברירת מחדל
  placeholder.svg           # תמונת ממלא מקום
```

## הנחיות להוספת תמונות

1. **פורמטים מומלצים**:
   - עבור תמונות רקע: JPG בדחיסה טובה (איכות 80-85%)
   - עבור דמויות וחפצים: PNG עם שקיפות
   - עבור אייקונים: SVG

2. **גדלים מומלצים**:
   - תמונות רקע: 1920x1080 פיקסלים
   - תמונות ממוזערות: 400x250 פיקסלים
   - דמויות: 512x512 פיקסלים

3. **שמות קבצים**:
   - השתמשו בשמות קבצים באנגלית בלבד
   - השתמשו באותיות קטנות, במקום רווחים השתמשו בקו תחתון (_)
   - הימנעו מתווים מיוחדים ואותיות לא-אנגליות

4. **אופטימיזציה**:
   - הקפידו לדחוס תמונות לפני העלאתם (כלים כמו [TinyPNG](https://tinypng.com/))
   - לא לעלות תמונות בגודל מעל 500KB אם אפשר

## שימוש בנכסים בקוד

אין צורך להזין נתיבים מלאים ב-JSON. המערכת תטפל בנרמול הנתיבים באופן אוטומטי:

```json
{
  "background": "forest_background.jpg",
  "character": "forest_keeper.png"
}
```

המערכת תנרמל את הנתיבים ל:

```
/assets/games/tubishvat/backgrounds/forest_background.jpg
/assets/games/tubishvat/characters/forest_keeper.png
```

### שימוש בשירות AssetManager

במקרה שיש צורך בגישה ישירה לנכסים מהקוד:

```javascript
import { AssetManager } from '../services/assetManager';

// קבלת נתיב מלא לנכס
const imagePath = AssetManager.getAssetPath('passover', 'rabbi_elazar.png', 'characters');

// טעינה מוקדמת של נכסי מדיה
await AssetManager.preloadEssentialAssets('passover');

// קבלת נכס מוטמן או טעינתו במידת הצורך
const image = await AssetManager.getAsset('passover', 'scroll_background.jpg', 'backgrounds');
```