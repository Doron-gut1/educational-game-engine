/**
 * שירות משוב למשתמש - ניהול הודעות ומשובים ויזואליים
 */
export const FeedbackService = {
  // סוגי משוב
  FEEDBACK_TYPES: {
    SUCCESS: 'success',  // הצלחה - ירוק
    ERROR: 'error',      // שגיאה - אדום
    INFO: 'info',        // מידע - כחול
    WARNING: 'warning'   // אזהרה - צהוב
  },
  
  listeners: [],
  
  /**
   * הצגת משוב למשתמש
   * @param {string} message - תוכן ההודעה
   * @param {string} type - סוג המשוב (success, error, info, warning)
   * @param {number} duration - משך זמן הצגה במילישניות
   * @param {Object} options - אפשרויות נוספות
   * @returns {number} מזהה המשוב להתייחסות עתידית
   */
  show(message, type = 'info', duration = 3000, options = {}) {
    const feedback = {
      id: Date.now(),
      message,
      type,
      duration,
      ...options
    };
    
    // שליחת המשוב לכל המאזינים
    this.notifyListeners(feedback);
    
    // החזרת ID להפניה עתידית (למשל, כדי למחוק את ההודעה)
    return feedback.id;
  },
  
  // קיצורים לסוגי משוב נפוצים
  success(message, duration, options) {
    return this.show(message, this.FEEDBACK_TYPES.SUCCESS, duration, options);
  },
  
  error(message, duration, options) {
    return this.show(message, this.FEEDBACK_TYPES.ERROR, duration, options);
  },
  
  info(message, duration, options) {
    return this.show(message, this.FEEDBACK_TYPES.INFO, duration, options);
  },
  
  warning(message, duration, options) {
    return this.show(message, this.FEEDBACK_TYPES.WARNING, duration, options);
  },
  
  /**
   * הוספת מאזין למשוב
   * @param {Function} listener - פונקציית קולבק שתופעל כשיש משוב חדש
   * @returns {Function} פונקציה להסרת המאזין
   */
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  },
  
  /**
   * עדכון כל המאזינים
   * @param {Object} feedback - אובייקט המשוב
   */
  notifyListeners(feedback) {
    this.listeners.forEach(listener => listener(feedback));
  }
};