/**
 * בקר שלבים (StageController)
 * אחראי על מעברים בטוחים בין שלבי המשחק, מונע לולאות אינסופיות
 * ומאפשר זרימת משחק חלקה ומבוקרת.
 */
import { LoggerService } from './loggerService';

export class StageController {
  /**
   * יוצר בקר שלבים חדש
   * @param {Object} stateManager - מנהל המצב לשימוש
   */
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.transitioning = false;
    this.transitionTimeoutId = null;
    this.transitionHistory = []; // היסטוריית מעברים לאיתור לולאות
    
    LoggerService.debug('[StageController] Initialized');
  }
  
  /**
   * מעבר לשלב חדש תוך מניעת מעברים כפולים
   * @param {string} stageId - מזהה השלב החדש
   * @param {Object} data - נתונים נלווים למעבר
   * @returns {Promise<boolean>} האם המעבר הצליח
   */
  async transitionToStage(stageId, data = {}) {
    // מניעת מעברים כפולים או מהירים מדי
    if (this.transitioning) {
      LoggerService.warn('[StageController] Transition already in progress, ignoring request to', stageId);
      return false;
    }
    
    // בדיקה אם זה המצב הנוכחי
    const currentState = this.stateManager.getState();
    if (currentState.currentStage === stageId) {
      LoggerService.warn('[StageController] Already in stage', stageId);
      return false;
    }
    
    // זיהוי לולאות אפשריות
    this.transitionHistory.push({
      from: currentState.currentStage,
      to: stageId,
      timestamp: Date.now()
    });
    
    // בדיקת לולאה - אם יש 3 מעברים זהים תוך 2 שניות
    const recentTransitions = this.transitionHistory.slice(-10);
    const similarTransitions = recentTransitions.filter(t => 
      t.from === currentState.currentStage && 
      t.to === stageId && 
      Date.now() - t.timestamp < 2000
    );
    
    if (similarTransitions.length >= 3) {
      LoggerService.error(
        '[StageController] Possible infinite loop detected in transitions between',
        currentState.currentStage,
        'and',
        stageId
      );
      return false;
    }
    
    // סימון שמעבר בתהליך
    this.transitioning = true;
    LoggerService.info(`[StageController] Transitioning from ${currentState.currentStage} to ${stageId}`);
    
    try {
      // עדכון המצב
      await this.stateManager.setState({
        previousStage: currentState.currentStage,
        currentStage: stageId,
        stageData: data,
        lastTransitionTime: Date.now()
      });
      
      // החזרת הדגל לאחר זמן קצר כדי לאפשר לאנימציות להסתיים
      this.transitionTimeoutId = setTimeout(() => {
        this.transitioning = false;
        LoggerService.debug('[StageController] Transition completed, ready for next transition');
      }, 300); // זמן המתנה סביר לאנימציות
      
      return true;
    } catch (error) {
      this.transitioning = false;
      LoggerService.error('[StageController] Error during transition:', error);
      return false;
    }
  }
  
  /**
   * המתנה לסיום מעבר בתהליך
   * @returns {Promise<void>}
   */
  waitForTransition() {
    return new Promise(resolve => {
      const check = () => {
        if (!this.transitioning) {
          resolve();
        } else {
          setTimeout(check, 50);
        }
      };
      check();
    });
  }
  
  /**
   * חזרה לשלב הקודם
   * @returns {Promise<boolean>}
   */
  async goBack() {
    const currentState = this.stateManager.getState();
    if (!currentState.previousStage) {
      LoggerService.warn('[StageController] No previous stage to go back to');
      return false;
    }
    
    return this.transitionToStage(currentState.previousStage);
  }
  
  /**
   * סימון שלב כמושלם
   * @param {string} stageId - מזהה השלב המושלם
   * @param {number} score - ניקוד השלב
   * @returns {Promise<boolean>}
   */
  async completeStage(stageId, score = 0) {
    const currentState = this.stateManager.getState();
    
    // וידוא שזה אכן השלב הנוכחי
    if (currentState.currentStage !== stageId) {
      LoggerService.warn(`[StageController] Cannot complete stage ${stageId} - not the current stage`);
      return false;
    }
    
    try {
      // קבלת העתק של השלבים המושלמים
      const completedStages = [
        ...(currentState.completedStages || [])
      ];
      
      // הוספת השלב לרשימת המושלמים (אם לא קיים כבר)
      if (!completedStages.includes(stageId)) {
        completedStages.push(stageId);
      }
      
      // חישוב התקדמות
      const progress = this.calculateProgress(completedStages);
      
      // עדכון המצב
      await this.stateManager.setState({
        completedStages,
        score: (currentState.score || 0) + score,
        progress
      });
      
      LoggerService.info(`[StageController] Stage ${stageId} completed with score ${score}`);
      return true;
    } catch (error) {
      LoggerService.error('[StageController] Error completing stage:', error);
      return false;
    }
  }
  
  /**
   * חישוב אחוז ההתקדמות
   * @param {Array} completedStages - רשימת שלבים שהושלמו
   * @returns {number} אחוז ההתקדמות (0-100)
   */
  calculateProgress(completedStages) {
    const currentState = this.stateManager.getState();
    const totalStages = currentState.gameConfig?.stages?.length || 0;
    
    if (totalStages === 0) return 0;
    
    return Math.round((completedStages.length / totalStages) * 100);
  }
  
  /**
   * ניקוי משאבים
   */
  dispose() {
    if (this.transitionTimeoutId) {
      clearTimeout(this.transitionTimeoutId);
    }
    
    this.transitioning = false;
    this.transitionHistory = [];
    
    LoggerService.debug('[StageController] Disposed');
  }
}
