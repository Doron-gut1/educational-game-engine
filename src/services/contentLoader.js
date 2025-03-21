import { LoggerService } from './loggerService';
import { themes } from '../design-system/themes';

/**
 * שירות לטעינת תוכן משחק - גרסה משודרגת
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
   */
  static processAssetPaths(obj, gameId) {
    if (!obj || typeof obj !== 'object') return;
    
    for (const key in obj) {
      const value = obj[key];
      
      // עיבוד רקורסיבי למערכים ואובייקטים
      if (value && typeof value === 'object') {
        this.processAssetPaths(value, gameId);
        continue;
      }
      
      // בדיקה אם זהו נתיב לנכס
      if (typeof value === 'string' && this.isAssetPath(key, value)) {
        obj[key] = this.normalizeAssetPath(value, key, gameId);
      }
    }
  }

  /**
   * בדיקה אם מדובר בנתיב לנכס לפי מאפיינים ידועים
   */
  static isAssetPath(key, value) {
    // מפתחות שמרמזים על נכסים גרפיים
    const assetKeyIndicators = ['background', 'image', 'avatar', 'icon', 'src', 'logo', 'photo'];
    // סיומות של קבצי מדיה
    const mediaExtensions = ['.jpg', '.jpeg', '.png', '.svg', '.gif', '.mp3', '.wav', '.mp4', '.pdf'];
    
    // בדיקה אם המפתח מרמז על נכס
    const keyIndicatesAsset = assetKeyIndicators.some(indicator => 
      key.toLowerCase().includes(indicator.toLowerCase())
    );
    
    // בדיקה אם הערך עצמו נראה כמו נתיב לקובץ מדיה
    const valueHasMediaExtension = mediaExtensions.some(ext => 
      value.toLowerCase().endsWith(ext)
    );
    
    return keyIndicatesAsset || valueHasMediaExtension;
  }

  /**
   * נרמול נתיב נכס: המרה לנתיב מלא ותקין
   */
  static normalizeAssetPath(path, key, gameId) {
    // אם כבר נתיב מלא, להשאיר כמו שהוא
    if (path.startsWith('/') || path.startsWith('http')) {
      return path;
    }
    
    // זיהוי סוג הנכס לפי המפתח
    let assetType = 'images'; // ברירת מחדל
    
    if (key.includes('background')) {
      assetType = 'backgrounds';
    } else if (key.includes('audio') || key.includes('sound')) {
      assetType = 'audio';
    } else if (key.includes('character') || key.includes('avatar')) {
      assetType = 'characters';
    } else if (key.includes('item') || key.includes('object')) {
      assetType = 'items';
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
      return characters.default || characters;
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