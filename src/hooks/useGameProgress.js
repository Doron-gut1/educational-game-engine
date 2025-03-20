import { useGameContext } from '../contexts/GameContext';

/**
 * הוק לניהול התקדמות במשחק
 * מספק מידע ופונקציות לניהול שלבים והתקדמות
 */
export function useGameProgress() {
  const { state, gameState, gameConfig } = useGameContext();
  
  return {
    // מידע על השלב הנוכחי והתקדמות
    currentStage: state.currentStage,
    completedStages: state.completedStages,
    progress: state.progress,
    totalStages: gameConfig?.stages?.length || 0,
    
    // פונקציות ניהול התקדמות
    moveToNextStage: () => gameState.moveToNextStage(),
    moveToStage: (stageId) => {
      // מעבר לשלב ספציפי
      if (!gameConfig?.stages) return false;
      
      const stageExists = gameConfig.stages.some(stage => stage.id === stageId);
      if (stageExists) {
        gameState.state.currentStage = stageId;
        gameState.notifyListeners();
        return true;
      }
      return false;
    },
    
    // בדיקת סטטוס שלבים
    isStageCompleted: (stageId) => state.completedStages.includes(stageId),
    isCurrentStage: (stageId) => state.currentStage === stageId,
    
    // סימון שלב כהושלם
    markStageCompleted: (stageId) => {
      if (!state.completedStages.includes(stageId)) {
        gameState.state.completedStages.push(stageId);
        gameState.state.progress = 
          (gameState.state.completedStages.length / gameConfig?.stages?.length) * 100 || 0;
        gameState.notifyListeners();
      }
    }
  };
}