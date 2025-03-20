import { useGameContext } from '../contexts/GameContext';

/**
 * הוק לניהול ניקוד במשחק
 */
export function useScoring() {
  const { state, gameState } = useGameContext();
  
  return {
    // ניקוד נוכחי
    score: state.score,
    
    // הוספת ניקוד
    addScore: (points) => gameState.addScore(points),
    
    // איפוס ניקוד
    resetScore: () => {
      gameState.state.score = 0;
      gameState.notifyListeners();
    },
    
    // חישוב בונוס לפי זמן
    calculateTimeBonus: (maxTimeSeconds, timeUsedSeconds) => {
      if (!state.settings.timerEnabled) return 0;
      if (timeUsedSeconds >= maxTimeSeconds) return 0;
      
      const timeRatio = 1 - (timeUsedSeconds / maxTimeSeconds);
      return Math.round(maxTimeSeconds * timeRatio * 0.5); // בונוס של עד 50% מהניקוד המקסימלי
    },
    
    // חישוב בונוס לפי דיוק
    calculateAccuracyBonus: (correctAnswers, totalAttempts) => {
      if (totalAttempts === 0) return 0;
      
      const accuracy = correctAnswers / totalAttempts;
      return Math.round(correctAnswers * accuracy * 2); // בונוס על דיוק
    }
  };
}