import { LoggerService } from '../services/loggerService';

/**
 * מנהל מצב משחק מתקדם - ניהול מרכזי של מצב המשחק
 */
export class StateManager {
  /**
   * יוצר מנהל מצב חדש
   * @param {Object} initialState - מצב התחלתי
   */
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = new Map();
    this.transactionInProgress = false;
    this.transactionQueue = [];
    
    LoggerService.debug("StateManager initialized", initialState);
  }
  
  /**
   * עדכון מצב מאובטח מפני עדכונים מקבילים
   * @param {Object} updates - עדכונים למצב
   * @param {Function} callback - קולבק אופציונלי לאחר העדכון
   */
  setState(updates, callback) {
    if (this.transactionInProgress) {
      // אם כבר יש עדכון בתהליך, הוסף לתור
      LoggerService.debug("Transaction in progress, queueing update:", updates);
      this.transactionQueue.push({ updates, callback });
      return;
    }
    
    this.transactionInProgress = true;
    
    // עדכון המצב
    this.state = { ...this.state, ...updates };
    LoggerService.debug("State updated:", updates);
    
    // הודעה למאזינים
    this.notifyListeners();
    
    // סיום העסקה
    this.transactionInProgress = false;
    
    // הפעלת קולבק אם צריך
    if (callback) callback(this.state);
    
    // אם יש עדכונים בתור, המשך לעדכון הבא
    if (this.transactionQueue.length > 0) {
      const nextTransaction = this.transactionQueue.shift();
      this.setState(nextTransaction.updates, nextTransaction.callback);
    }
  }
  
  /**
   * הוספת מאזין למצב
   * @param {string} id - מזהה ייחודי למאזין
   * @param {Function} listener - פונקציה שתיקרא כאשר המצב משתנה
   * @returns {Function} פונקציה להסרת המאזין
   */
  subscribe(id, listener) {
    if (!this.listeners.has(id)) {
      this.listeners.set(id, listener);
      LoggerService.debug(`Listener added: ${id}`);
    }
    
    // החזרת פונקציית ניקוי
    return () => {
      this.listeners.delete(id);
      LoggerService.debug(`Listener removed: ${id}`);
    };
  }
  
  /**
   * עדכון כל המאזינים
   */
  notifyListeners() {
    LoggerService.debug(`Notifying ${this.listeners.size} listeners`);
    this.listeners.forEach((listener, id) => {
      try {
        listener(this.state);
      } catch (error) {
        LoggerService.error(`Error in listener ${id}:`, error);
      }
    });
  }
  
  /**
   * איפוס המצב
   * @param {Object} initialState - מצב חדש לאיפוס
   */
  resetState(initialState = {}) {
    this.state = initialState;
    LoggerService.info("State reset to:", initialState);
    this.notifyListeners();
  }
  
  /**
   * קבלת העתק של המצב הנוכחי
   * @returns {Object} עותק של המצב הנוכחי
   */
  getState() {
    return { ...this.state };
  }
}