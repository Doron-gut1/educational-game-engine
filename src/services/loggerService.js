/**
 * שירות לוגים חכם - מחליף את console.log הרגיל
 * מאפשר ניהול רמות לוג שונות והפעלה/כיבוי בסביבות שונות
 */
export const LoggerService = {
  // רמות לוג שונות
  LOG_LEVELS: {
    DEBUG: 0, // פרטים מורחבים לפיתוח
    INFO: 1,  // מידע כללי
    WARN: 2,  // אזהרות
    ERROR: 3, // שגיאות קריטיות
  },
  
  // הגדר רמת לוג נוכחית (בסביבת פיתוח - הכל, בייצור - רק שגיאות)
  currentLevel: import.meta.env.MODE === 'production' ? 3 : 0,
  
  debug(message, ...data) {
    if (this.currentLevel <= this.LOG_LEVELS.DEBUG) {
      console.debug(`[DEBUG] ${message}`, ...data);
    }
  },
  
  info(message, ...data) {
    if (this.currentLevel <= this.LOG_LEVELS.INFO) {
      console.info(`[INFO] ${message}`, ...data);
    }
  },
  
  warn(message, ...data) {
    if (this.currentLevel <= this.LOG_LEVELS.WARN) {
      console.warn(`[WARN] ${message}`, ...data);
    }
  },
  
  error(message, ...data) {
    if (this.currentLevel <= this.LOG_LEVELS.ERROR) {
      console.error(`[ERROR] ${message}`, ...data);
    }
  },
  
  // ניתן להגדיר רמת לוג דינמית
  setLogLevel(level) {
    this.currentLevel = level;
  }
};