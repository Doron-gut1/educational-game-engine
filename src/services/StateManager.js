/**
 * מנהל מצב מאובטח (StateManager)
 * מנהל את מצב המשחק בצורה בטוחה המונעת מצבי מירוץ (race conditions)
 * ומאפשרת ניטור ותיעוד של שינויי מצב.
 */
import { LoggerService } from './loggerService';

export class StateManager {
  /**
   * יוצר מנהל מצב חדש
   * @param {Object} initialState - מצב התחלתי
   */
  constructor(initialState = {}) {
    this.state = { ...initialState };
    this.listeners = [];
    this.locked = false;
    this.pendingUpdates = [];
    this.updateId = 0;
    
    LoggerService.debug('StateManager created with initial state:', initialState);
  }
  
  /**
   * עדכון מצב בצורה מאובטחת המונעת מצבי מירוץ
   * @param {Object} updates - שינויים למצב
   * @param {Function} callback - קולבק אופציונלי לאחר העדכון
   * @returns {number} מזהה העדכון
   */
  setState(updates, callback) {
    const updateId = ++this.updateId;
    LoggerService.debug(`[StateManager] Update #${updateId} requested:`, updates);
    
    // אם המצב נעול, נוסיף לתור העדכונים
    if (this.locked) {
      LoggerService.debug(`[StateManager] Update #${updateId} queued (state locked)`);
      this.pendingUpdates.push({ updates, callback, id: updateId });
      return updateId;
    }
    
    // נעילת המצב בזמן העדכון
    this.locked = true;
    
    try {
      // עדכון המצב
      this.state = { ...this.state, ...updates };
      LoggerService.debug(`[StateManager] Update #${updateId} applied`);
      
      // שחרור הנעילה
      this.locked = false;
      
      // עדכון המאזינים
      this.notifyListeners();
      
      // הפעלת קולבק אם יש
      if (callback) callback(this.state);
      
      // בדיקה אם יש עדכונים בתור
      this.processPendingUpdates();
      
      return updateId;
    } catch (error) {
      // שחרור הנעילה במקרה של שגיאה
      this.locked = false;
      LoggerService.error(`[StateManager] Error in update #${updateId}:`, error);
      throw error;
    }
  }
  
  /**
   * עיבוד עדכונים בתור ההמתנה
   */
  processPendingUpdates() {
    if (this.pendingUpdates.length > 0 && !this.locked) {
      const nextUpdate = this.pendingUpdates.shift();
      LoggerService.debug(`[StateManager] Processing queued update #${nextUpdate.id}`);
      this.setState(nextUpdate.updates, nextUpdate.callback);
    }
  }
  
  /**
   * הוספת מאזין לשינויי מצב
   * @param {string} id - מזהה המאזין
   * @param {Function} listener - פונקצית מאזין
   * @returns {Function} פונקציה להסרת המאזין
   */
  subscribe(id, listener) {
    const listenerObject = {
      id: id || `listener_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      callback: listener
    };
    
    this.listeners.push(listenerObject);
    LoggerService.debug(`[StateManager] Listener ${listenerObject.id} subscribed`);
    
    return () => {
      this.listeners = this.listeners.filter(l => l.id !== listenerObject.id);
      LoggerService.debug(`[StateManager] Listener ${listenerObject.id} unsubscribed`);
    };
  }
  
  /**
   * עדכון כל המאזינים
   */
  notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener.callback(this.state);
      } catch (error) {
        LoggerService.error(`[StateManager] Error notifying listener ${listener.id}:`, error);
      }
    });
    
    LoggerService.debug(`[StateManager] Notified ${this.listeners.length} listeners`);
  }
  
  /**
   * איפוס המצב לערך התחלתי חדש
   * @param {Object} initialState - מצב התחלתי חדש
   */
  resetState(initialState = {}) {
    LoggerService.info(`[StateManager] Resetting state`);
    this.setState(initialState);
  }
  
  /**
   * קבלת העתק של המצב הנוכחי
   * @returns {Object} העתק של המצב
   */
  getState() {
    return { ...this.state };
  }
}
