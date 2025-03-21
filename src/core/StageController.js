import { LoggerService } from '../services/loggerService';

/**
 * בקר שלבים - אחראי על מעברים בין שלבים
 */
export class StageController {
  /**
   * יוצר בקר שלבים חדש
   * @param {Object} stateManager - מנהל המצב של המשחק
   */
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.transitionInProgress = false;
    this.transitionTimeout = null;
    this.history = [];
    
    LoggerService.debug("StageController initialized");
  }
  
  /**
   * מעבר לשלב חדש עם מניעת מעברים כפולים
   * @param {string} stageId - מזהה השלב החדש
   * @param {Object} data - נתונים נוספים לשלב
   * @returns {Promise<boolean>} האם המעבר הצליח
   */
  async transitionToStage(stageId, data = {}) {
    // אם מעבר כבר מתבצע - מנע מעבר נוסף
    if (this.transitionInProgress) {
      LoggerService.warn("Stage transition already in progress. Ignoring request.");
      return false;
    }
    
    // מצב הנוכחי נשמר בהיסטוריה
    const currentStage = this.stateManager.state.currentStage;
    if (currentStage) {
      this.history.push(currentStage);
    }
    
    // סימון שמעבר מתבצע
    this.transitionInProgress = true;
    LoggerService.info(`Transitioning to stage: ${stageId}`);
    
    try {
      // עדכון מצב המשחק
      this.stateManager.setState({ 
        currentStage: stageId,
        stageData: data,
        transitioning: true 
      });
      
      // אם יש מעבר אנימציה, תן לו להתבצע
      await this.waitForTransition();
      
      // סימון שהמעבר הסתיים
      this.stateManager.setState({ transitioning: false });
      
      return true;
    } catch (error) {
      LoggerService.error("Error during stage transition:", error);
      return false;
    } finally {
      // ניקוי פלאגים גם אם יש שגיאה
      this.transitionInProgress = false;
      if (this.transitionTimeout) {
        clearTimeout(this.transitionTimeout);
        this.transitionTimeout = null;
      }
    }
  }
  
  /**
   * המתנה לסיום אנימציית מעבר
   * @returns {Promise} הבטחה שתסתיים לאחר השלמת האנימציה
   */
  waitForTransition() {
    return new Promise(resolve => {
      // הגדרת timeout מקסימלי למעבר (500 מילישניות)
      this.transitionTimeout = setTimeout(() => {
        resolve();
      }, 500);
    });
  }
  
  /**
   * חזרה לשלב קודם
   * @returns {boolean} האם החזרה הצליחה
   */
  goBack() {
    if (this.history.length > 0) {
      const previousStage = this.history.pop();
      this.transitionToStage(previousStage);
      return true;
    }
    return false;
  }
  
  /**
   * פונקציה לטיפול בהשלמת שלב
   * @param {string} stageId - מזהה השלב שהושלם
   * @param {number} score - ניקוד שהושג בשלב
   */
  completeStage(stageId, score = 0) {
    const { completedStages = [] } = this.stateManager.state;
    
    // וידוא שהשלב לא הושלם כבר
    if (!completedStages.includes(stageId)) {
      LoggerService.info(`Stage completed: ${stageId} with score ${score}`);
      
      this.stateManager.setState({
        completedStages: [...completedStages, stageId],
        score: (this.stateManager.state.score || 0) + score,
      });
    }
  }
  
  /**
   * ניקוי משאבים לפני סיום
   */
  dispose() {
    LoggerService.debug("StageController disposing resources");
    
    // ניקוי כל המשאבים שהבקר משתמש בהם
    if (this.transitionTimeout) {
      clearTimeout(this.transitionTimeout);
      this.transitionTimeout = null;
    }
    
    // איפוס ההיסטוריה
    this.history = [];
    this.transitionInProgress = false;
  }
}