import { LoggerService } from './loggerService';
import { themes } from '../design-system/themes';
import { AssetManager } from './assetManager';

/**
 * שירות לטעינת תוכן משחק - גרסה משופרת 2.0
 * עם תמיכה טובה יותר בנתיבי נכסים
 */
export class ContentLoader {
  /**
   * טעינת כל הנתונים הדרושים למשחק
   * @param {string} gameId - מזהה המשחק
   * @returns {Promise<Object>} - כל נתוני המשחק
   */
  static async loadGame(gameId) {
    LoggerService.info(`טוען משחק: ${gameId}`);
    
    try {
      // טעינה מקבילה של כל הנתונים
      const [config, content, characters, theme] = await Promise.all([
        this.loadGameConfig(gameId),
        this.loadGameContent(gameId),
        this.loadCharacters(gameId),
        this.loadTheme(gameId)
      ]);
      
      // שילוב כל הנתונים לאובייקט אחד
      const gameData = {
        ...config,
        content,
        characters,
        theme
      };
      
      LoggerService.info(`משחק נטען בהצלחה: ${gameId}`);
      return gameData;
    } catch (error) {
      LoggerService.error(`שגיאה בטעינת משחק ${gameId}:`, error);
      throw new Error(`שגיאה בטעינת משחק: ${error.message}`);
    }
  }

  /**
   * טעינת הגדרות משחק ספציפי
   * @param {string} gameId - מזהה המשחק
   * @returns {Promise<Object>} - קונפיגורציית המשחק
   */
  static async loadGameConfig(gameId) {
    try {
      const config = await import(`../games/${gameId}/config.js`);
      return config.default || config;
    } catch (error) {
      LoggerService.error(`שגיאה בטעינת קונפיגורציית משחק ${gameId}:`, error);
      throw error;
    }
  }

  /**
   * טעינת תוכן משחק ספציפי
   * @param {string} gameId - מזהה המשחק
   * @returns {Promise<Object>} - תוכן המשחק
   */
  static async loadGameContent(gameId) {
    try {
      const content = await import(`../games/${gameId}/data.json`);
      // עיבוד התוכן: נרמול נתיבי נכסים
      const processedContent = await this.processContent(content.default || content, gameId);
      return processedContent;
    } catch (error) {
      LoggerService.error(`שגיאה בטעינת תוכן משחק ${gameId}:`, error);
      throw error;
    }
  }

  /**
   * עיבוד התוכן ונרמול כל הנתיבים
   */
  static async processContent(content, gameId) {
    // יצירת עותק עמוק של התוכן למניעת שינוי המקור
    const processedContent = JSON.parse(JSON.stringify(content));
    
    // עיבוד רקורסיבי של נתיבי נכסים
    this.processAssetPaths(processedContent, gameId);
    
    return processedContent;
  }

  /**
   * עיבוד רקורסיבי של נתיבי נכסים בתוכן
   * גירסה משופרת לטיפול בסוגים שונים של מבני נתונים
   */
  static processAssetPaths(obj, gameId, parentKey = '') {
    if (!obj || typeof obj !== 'object') return;
    
    // לוגיקה שונה למערכים ואובייקטים
    if (Array.isArray(obj)) {
      // עיבוד כל איברי המערך
      for (let i = 0; i < obj.length; i++) {
        const item = obj[i];
        
        if (typeof item === 'object' && item !== null) {
          // רקורסיה לאובייקטים פנימיים
          this.processAssetPaths(item, gameId, parentKey);
        } else if (typeof item === 'string' && this.isAssetPath('', item)) {
          // עיבוד מחרוזת שנראית כמו נתיב
          obj[i] = this.normalizeAssetPath(item, parentKey, gameId);
        }
      }
    } else {
      // עיבוד של אובייקט
      for (const key in obj) {
        const value = obj[key];
        
        if (value && typeof value === 'object') {
          // רקורסיה לאובייקטים פנימיים
          this.processAssetPaths(value, gameId, key);
        } else if (typeof value === 'string' && this.isAssetPath(key, value)) {
          // בדיקה אם זהו נתיב לנכס
          obj[key] = this.normalizeAssetPath(value, key, gameId);
        }
      }
    }
  }

  /**
   * בדיקה אם מדובר בנתיב לנכס לפי מאפיינים ידועים
   * תמיכה בסוגים רבים יותר של נכסים
   */
  static isAssetPath(key, value) {
    // אם זה נתיב חיצוני מלא או נתיב עם / בהתחלה - זה כבר נתיב
    if (value.startsWith('/') || value.startsWith('http')) {
      return true;
    }
    
    // מפתחות שמרמזים על נכסים גרפיים - רשימה מורחבת
    const assetKeyIndicators = [
      'background', 'image', 'avatar', 'icon', 'src', 'logo', 'photo', 
      'thumbnail', 'picture', 'banner', 'cover', 'graphic', 'img',
      'sound', 'audio', 'music', 'voice',
      'video', 'clip', 'movie'
    ];
    
    // סיומות של קבצי מדיה - רשימה מורחבת
    const mediaExtensions = [
      '.jpg', '.jpeg', '.png', '.svg', '.gif', '.webp', '.bmp', '.ico',
      '.mp3', '.wav', '.ogg', '.m4a', '.aac',
      '.mp4', '.webm', '.mov', '.avi',
      '.pdf', '.json', '.md'
    ];
    
    // בדיקה אם המפתח מרמז על נכס
    const keyIndicatesAsset = assetKeyIndicators.some(indicator => 
      key.toLowerCase().includes(indicator.toLowerCase())
    );
    
    // בדיקה אם הערך עצמו נראה כמו נתיב לקובץ מדיה
    const valueHasMediaExtension = mediaExtensions.some(ext => 
      value.toLowerCase().endsWith(ext)
    );
    
    // בדיקה אם הערך מכיל / שמרמז על נתיב (אבל לא בהתחלה)
    const valueContainsPathSeparator = value.includes('/') && !value.startsWith('/');
    
    return keyIndicatesAsset || valueHasMediaExtension || valueContainsPathSeparator;
  }

  /**
   * נרמול נתיב נכס: המרה לנתיב מלא ותקין
   * גרסה משופרת עם יכולת טיפול בסוגים רבים יותר
   */
  static normalizeAssetPath(path, key, gameId) {
    // אם כבר נתיב מלא או חיצוני, להשאיר כמו שהוא
    if (path.startsWith('/') || path.startsWith('http')) {
      return path;
    }
    
    // אם הנתיב כולל נתיב חלקי, ננסה לחלץ ממנו את סוג הנכס
    if (path.includes('/')) {
      const segments = path.split('/');
      const possibleAssetType = segments[0].toLowerCase();
      
      // בדיקה אם זה סוג נכס מוכר
      const validAssetTypes = Object.values(AssetManager.assetTypes);
      
      if (validAssetTypes.includes(possibleAssetType)) {
        // מצאנו סוג נכס בנתיב עצמו
        const assetType = possibleAssetType;
        const relativePath = segments.slice(1).join('/');
        return `/assets/games/${gameId}/${assetType}/${relativePath}`;
      }
    }
    
    // זיהוי סוג הנכס לפי המפתח ותוכן הקובץ
    let assetType = 'images'; // ברירת מחדל
    
    // זיהוי לפי מפתח
    if (key.includes('background')) {
      assetType = 'backgrounds';
    } else if (key.includes('audio') || key.includes('sound') || 
               path.endsWith('.mp3') || path.endsWith('.wav') || path.endsWith('.ogg')) {
      assetType = 'audio';
    } else if (key.includes('character') || key.includes('avatar')) {
      assetType = 'characters';
    } else if (key.includes('item') || key.includes('object')) {
      assetType = 'items';
    } else if (key.includes('icon') || path.endsWith('.svg') && path.includes('icon')) {
      assetType = 'icons';
    }
    
    // יצירת נתיב מלא
    return `/assets/games/${gameId}/${assetType}/${path}`;
  }

  /**
   * טעינת הגדרות דמויות עבור משחק
   * @param {string} gameId - מזהה המשחק
   * @returns {Promise<Object>} - הגדרות הדמויות
   */
  static async loadCharacters(gameId) {
    try {
      const characters = await import(`../games/${gameId}/characters.js`);
      const processed = characters.default || characters;
      
      // עיבוד נתיבי נכסים בדמויות
      Object.values(processed).forEach(character => {
        if (character.avatar && typeof character.avatar === 'string') {
          character.avatar = this.normalizeAssetPath(
            character.avatar, 
            'avatar',
            gameId
          );
        }
      });
      
      return processed;
    } catch (error) {
      LoggerService.warn(`לא נמצאו דמויות למשחק ${gameId}:`, error);
      return {}; // דמויות אינן חובה, לכן אם אין - מחזירים אובייקט ריק
    }
  }
  
  /**
   * טעינת הגדרות תמה
   * @param {string} gameId - מזהה המשחק
   * @returns {Promise<Object|string>} - הגדרות התמה או שם התמה
   */
  static async loadTheme(gameId) {
    try {
      // בדיקה אם קיימת תמה מתאימה במערכת התמות החדשה
      const themeName = gameId.toLowerCase();
      if (themes[themeName]) {
        LoggerService.info(`נמצאה תמה ${themeName} במערכת התמות החדשה`);
        return themeName;
      }
      
      // במידה ולא נמצאה תמה ספציפית, החזר את התמה הבסיסית
      LoggerService.info(`לא נמצאה תמה ספציפית ל-${gameId}, משתמש בתמה בסיסית`);
      return "base";
    } catch (error) {
      LoggerService.error("שגיאה בטעינת תמה:", error);
      return "base"; // ברירת מחדל במקרה של שגיאה
    }
  }

  /**
   * בדיקה אם משחק קיים במערכת
   * @param {string} gameId - מזהה המשחק
   * @returns {Promise<boolean>} - האם המשחק קיים
   */
  static async doesGameExist(gameId) {
    try {
      await this.loadGameConfig(gameId);
      return true;
    } catch (error) {
      return false;
    }
  }
}