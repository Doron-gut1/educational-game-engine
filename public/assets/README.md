# נכסי מדיה למערכת העיצוב "מסע הדעת"

קובץ זה מפרט את המבנה והתכולה הנדרשת בתיקיית הנכסים עבור מערכת העיצוב "מסע הדעת".

## מבנה תיקיות

יש להשלים את מבנה התיקיות הבא:

```
/public
  /assets
    /games
      /passover           # נכסים ספציפיים למשחק פסח
        /backgrounds      # תמונות רקע
        /characters       # דמויות
        /icons            # אייקונים
        /ui               # אלמנטי ממשק ספציפיים
      /tubishvat          # נכסים ספציפיים למשחק ט"ו בשבט
        /backgrounds
        /characters
        /icons
        /ui
    /shared              # נכסים משותפים לכל המשחקים
      /ui                # אלמנטי ממשק כלליים
      /effects           # אפקטים ויזואליים
```

## רשימת נכסים דרושים

### נכסי רקע (backgrounds)
מיקום: `/public/assets/games/passover/backgrounds/`

| שם קובץ | תיאור | סוג קובץ |
|---------|-------|-----------|
| `scroll_background.jpg` | טקסטורת מגילה/קלף | JPG |
| `desert_background.jpg` | רקע מדבר/מצרים | JPG |
| `egypt_background.jpg` | נוף מצרי עתיק | JPG |
| `red_sea_background.jpg` | ים סוף | JPG |
| `sinai_background.jpg` | הר סיני | JPG |
| `intro_background.jpg` | רקע למסך פתיחה | JPG |

### דמויות (characters)
מיקום: `/public/assets/games/passover/characters/`

| שם קובץ | תיאור | סוג קובץ |
|---------|-------|-----------|
| `rabbi_elazar.png` | רבי אלעזר הסופר | PNG (שקוף) |
| `miriam.png` | מרים הנביאה | PNG (שקוף) |
| `moses.png` | משה רבנו | PNG (שקוף) |
| `pharaoh.png` | פרעה | PNG (שקוף) |

### אייקונים (icons)
מיקום: `/public/assets/games/passover/icons/`

| שם קובץ | תיאור | סוג קובץ |
|---------|-------|-----------|
| `scroll.svg` | מגילה | SVG |
| `egypt.svg` | מצרים | SVG |
| `sea.svg` | ים | SVG |
| `mountain.svg` | הר סיני | SVG |
| `matzah.svg` | מצה | SVG |
| `seder_plate.svg` | קערת סדר | SVG |
| `plagues.svg` | עשר המכות | SVG |
| `torah.svg` | ספר תורה | SVG |

### אלמנטי ממשק (ui)
מיקום: `/public/assets/shared/ui/`

| שם קובץ | תיאור | סוג קובץ |
|---------|-------|-----------|
| `hint_icon.svg` | אייקון רמז | SVG |
| `book_icon.svg` | אייקון ספר/מקור | SVG |
| `star_icon.svg` | אייקון כוכב | SVG |
| `question_icon.svg` | אייקון שאלה | SVG |
| `close_icon.svg` | אייקון סגירה | SVG |
| `back_icon.svg` | אייקון חזרה | SVG |
| `forward_icon.svg` | אייקון קדימה | SVG |
| `medal_gold.svg` | מדליית זהב | SVG |
| `medal_silver.svg` | מדליית כסף | SVG |
| `medal_bronze.svg` | מדליית ארד | SVG |

### אפקטים (effects)
מיקום: `/public/assets/shared/effects/`

| שם קובץ | תיאור | סוג קובץ |
|---------|-------|-----------|
| `confetti.json` | אנימציית קונפטי | Lottie JSON |
| `success.json` | אנימציית הצלחה | Lottie JSON |
| `scroll_reveal.json` | אנימציית פתיחת מגילה | Lottie JSON |
| `sparkles.json` | אנימציית ניצוצות | Lottie JSON |

## מקורות מומלצים להשגת נכסים

1. **אתרי נכסים חינמיים**:
   - [Freepik](https://www.freepik.com/) - מגוון רחב של איורים ותמונות
   - [Unsplash](https://unsplash.com/) - תמונות איכותיות חינמיות לשימוש חופשי
   - [Pixabay](https://pixabay.com/) - תמונות, וקטורים ואיורים חינמיים
   - [Flaticon](https://www.flaticon.com/) - אייקונים חינמיים בסגנונות שונים

2. **אתרי נכסים ספציפיים ליהדות**:
   - [Sefaria](https://www.sefaria.org/) - תכנים יהודיים חינמיים לשימוש חופשי
   - [Hebrew Typography](https://alefalefalef.co.il/) - פונטים עבריים ואלמנטים גרפיים

3. **ליצירת אייקונים ואלמנטים מותאמים אישית**:
   - [Figma](https://www.figma.com/) - כלי עיצוב גרפי מקוון
   - [Inkscape](https://inkscape.org/) - תוכנת וקטורים חינמית ליצירת SVG
   - [Adobe Illustrator](https://www.adobe.com/products/illustrator.html) - תוכנת וקטורים מקצועית (בתשלום)

4. **ליצירת אנימציות**:
   - [LottieFiles](https://lottiefiles.com/) - אנימציות Lottie מוכנות וכלי יצירה
   - [GIF Maker](https://ezgif.com/) - יצירת אנימציות GIF מתמונות

## הערות חשובות

- יש להקפיד על זכויות יוצרים ושימוש בנכסים מורשים בלבד
- מומלץ לשמור על גודל קבצים סביר - תמונות JPG עד 300KB, PNG עד 500KB, SVG עד 50KB
- יש להתאים את סגנון העיצוב של כל הנכסים לשפה העיצובית של "מסע הדעת" - צבעים כחולים וזהובים, סגנון עתיק/מסורתי עם מראה מודרני