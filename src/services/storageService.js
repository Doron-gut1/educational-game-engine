/**
 * שירות לשמירת נתונים לוקלים
 */
export const StorageService = {
  /**
   * שמירת נתונים ב-localStorage
   * @param {string} key - מפתח לשמירה
   * @param {any} data - המידע לשמירה
   */
  save: (key, data) => {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
      return true;
    } catch (error) {
      console.error(`Error saving data for key ${key}:`, error);
      return false;
    }
  },

  /**
   * קריאת נתונים מ-localStorage
   * @param {string} key - מפתח לקריאה
   * @param {any} defaultValue - ערך ברירת מחדל אם המפתח לא קיים
   * @returns {any} - המידע שנשמר
   */
  load: (key, defaultValue = null) => {
    try {
      const serializedData = localStorage.getItem(key);
      if (serializedData === null) {
        return defaultValue;
      }
      return JSON.parse(serializedData);
    } catch (error) {
      console.error(`Error loading data for key ${key}:`, error);
      return defaultValue;
    }
  },

  /**
   * מחיקת נתונים מ-localStorage
   * @param {string} key - מפתח למחיקה
   */
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing data for key ${key}:`, error);
      return false;
    }
  },

  /**
   * בדיקה אם מפתח קיים ב-localStorage
   * @param {string} key - המפתח לבדיקה
   * @returns {boolean} - האם המפתח קיים
   */
  exists: (key) => {
    return localStorage.getItem(key) !== null;
  },

  /**
   * קבלת מפתח ייחודי למשחק ספציפי
   * @param {string} gameId - מזהה המשחק
   * @param {string} suffix - סיומת אופציונלית
   * @returns {string} - מפתח מלא
   */
  getGameKey: (gameId, suffix = 'state') => {
    return `game_${gameId}_${suffix}`;
  }
};