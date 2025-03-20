import { useGameContext } from '../contexts/GameContext';
import { LoggerService } from '../services';

/**
 * הוק לניהול התקדמות במשחק
 * מספק מידע ופונקציות לניהול שלבים והתקדמות
 */
export function useGameProgress() {
  const { 
    state, 
    gameState, 
    gameConfig, 
    moveToStage, 
    completeStage,
    stageController
  } = useGameContext();
  
  // פונקציה משופרת למעבר לשלב הבא
  const moveToNextStage = async () => {
    LoggerService.debug("[useGameProgress] Attempting to move to next stage");
    
    // אם אין תצורת משחק, לא ניתן להמשיך
    if (!gameConfig?.content?.stages) {
      LoggerService.warn("[useGameProgress] Cannot move to next stage: no stages defined");
      return false;
    }
    
    // מציאת האינדקס של השלב הנוכחי
    const currentIndex = gameConfig.content.stages.findIndex(
      stage => stage.id === state.currentStage
    );
    
    LoggerService.debug(`[useGameProgress] Current stage index: ${currentIndex}`);
    
    // אם מצאנו את השלב הנוכחי וקיים שלב הבא
    if (currentIndex >= 0 && currentIndex < gameConfig.content.stages.length - 1) {
      const nextStage = gameConfig.content.stages[currentIndex + 1].id;
      LoggerService.info(`[useGameProgress] Moving to next stage: ${nextStage}`);
      
      // שימוש בפונקציית המעבר המשופרת
      return moveToStage(nextStage);
    } else if (currentIndex === gameConfig.content.stages.length - 1) {
      // אם זה השלב האחרון, עוברים לסיום
      LoggerService.info("[useGameProgress] No more stages, can move to outro");
      return false;
    } else {
      LoggerService.warn(`[useGameProgress] Cannot move to next stage: current stage not found or invalid index: ${currentIndex}`);
      return false;
    }
  };
  
  // פונקציה לבדיקה האם שלב הושלם
  const isStageCompleted = (stageId) => {
    return state.completedStages?.includes(stageId) || false;
  };
  
  // פונקציה לסימון שלב כהושלם
  const markStageCompleted = async (stageId, points = 0) => {
    LoggerService.debug(`[useGameProgress] Marking stage ${stageId} as completed`);
    
    // שימוש בפונקציית סיום שלב עם תמיכה בתשתית החדשה
    return completeStage(stageId, points);
  };
  
  return {
    // מידע על השלב הנוכחי והתקדמות
    currentStage: state.currentStage,
    completedStages: state.completedStages || [],
    progress: state.progress || 0,
    totalStages: gameConfig?.content?.stages?.length || 0,
    
    // פונקציות ניהול התקדמות
    moveToNextStage,
    moveToStage: async (stageId) => {
      LoggerService.debug(`[useGameProgress] Attempting to move to specific stage: ${stageId}`);
      
      // בדיקה שהשלב קיים
      if (!gameConfig?.content?.stages) {
        LoggerService.warn("[useGameProgress] Cannot move to stage: no stages defined");
        return false;
      }
      
      const stageExists = gameConfig.content.stages.some(stage => stage.id === stageId);
      if (stageExists) {
        return moveToStage(stageId);
      } else {
        LoggerService.warn(`[useGameProgress] Cannot move to stage ${stageId}: stage not found`);
        return false;
      }
    },
    
    // בדיקת סטטוס שלבים
    isStageCompleted,
    isCurrentStage: (stageId) => state.currentStage === stageId,
    
    // סימון שלב כהושלם
    markStageCompleted
  };
}