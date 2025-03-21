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
      return content.default || content;
    } catch (error) {
      LoggerService.error(`שגיאה בטעינת תוכן משחק ${gameId}:`, error);
      throw error;
    }
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