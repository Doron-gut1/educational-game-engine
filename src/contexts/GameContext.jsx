import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { LoggerService } from '../services/loggerService';
import { StateManager } from '../core/StateManager';
import { StageController } from '../core/StageController';

// קונטקסט המשחק
export const GameContext = createContext(null);

/**
 * ספק קונטקסט המשחק - מספק גישה למצב המשחק ופונקציות שליטה
 * גרסה מעודכנת שמשתמשת אך ורק בארכיטקטורה החדשה
 */
export function GameProvider({ children, gameConfig, initialState = {} }) {
  LoggerService.debug("[GameContext] Initializing GameProvider");
  
  // דגל לוידוא שהאתחול קורה רק פעם אחת - מנגנון למניעת לולאות אינסופיות
  const isInitialized = useRef(false);
  
  // יצירת מופעים של השירותים החדשים
  const [stateManager] = useState(() => {
    LoggerService.debug("[GameContext] Creating StateManager");
    return new StateManager(initialState);
  });
  
  const [stageController] = useState(() => {
    LoggerService.debug("[GameContext] Creating StageController");
    return new StageController(stateManager);
  });
  
  // מצב המשחק העדכני - מופץ למאזינים
  const [state, setState] = useState(stateManager.getState());
  
  // הרשמה לשינויים במצב המשחק
  useEffect(() => {
    LoggerService.debug('[GameContext] Subscribing to StateManager');
    
    const unsubscribe = stateManager.subscribe('gameContext', newState => {
      setState(newState);
    });
    
    return () => {
      LoggerService.debug('[GameContext] Unsubscribing from StateManager');
      unsubscribe();
    };
  }, [stateManager]);
  
  // אתחול המשחק בטעינה - מתבצע רק פעם אחת
  useEffect(() => {
    // בדיקה האם האתחול כבר התרחש - מונע לולאה אינסופית
    if (isInitialized.current) {
      return;
    }
    
    // וידוא שיש תצורת משחק תקינה
    if (!gameConfig) {
      LoggerService.warn('[GameContext] No game config provided');
      return;
    }
    
    LoggerService.info('[GameContext] Initializing game state');
    
    // אתחול המצב
    stateManager.resetState({
      gameConfig, // שמירת תצורת המשחק במצב
      currentStage: gameConfig?.stages?.[0]?.id || null,
      completedStages: [],
      score: 0,
      progress: 0,
      difficulty: gameConfig?.difficulty || 'medium',
      startTime: new Date(),
      endTime: null,
      ...initialState // שילוב מצב התחלתי אם הועבר
    });
    
    // סימון שהאתחול כבר התרחש - למניעת לולאה אינסופית
    isInitialized.current = true;
    
    LoggerService.debug('[GameContext] State initialized successfully');
  }, [gameConfig, stateManager, initialState]);
  
  // טיפול באירועי מחזור חיים בנפרד מאתחול המצב
  useEffect(() => {
    // פונקציה לשמירת מצב בעת עזיבת העמוד
    const handleBeforeUnload = () => {
      LoggerService.debug('[GameContext] Saving state before unload');
      
      // יישום שמירה - יש להוסיף מנגנון שמירה
      try {
        const currentState = stateManager.getState();
        if (gameConfig?.id) {
          localStorage.setItem(
            `game_${gameConfig.id}_state`,
            JSON.stringify(currentState)
          );
        }
      } catch (e) {
        LoggerService.error('Failed to save game state:', e);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [stateManager, gameConfig]);
  
  // פונקציות עזר שחושפות את פונקציונליות המנגנון
  
  // מעבר לשלב אחר
  const moveToStage = (stageId) => {
    LoggerService.info(`[GameContext] Moving to stage: ${stageId}`);
    return stageController.transitionToStage(stageId);
  };
  
  // סימון שלב כהושלם והוספת ניקוד
  const completeStage = (stageId, score = 0) => {
    LoggerService.info(`[GameContext] Completing stage: ${stageId} with score: ${score}`);
    return stageController.completeStage(stageId, score);
  };
  
  // איפוס המשחק
  const resetGame = () => {
    LoggerService.info('[GameContext] Resetting game');
    stateManager.resetState({
      gameConfig,
      currentStage: gameConfig?.stages?.[0]?.id || null,
      completedStages: [],
      score: 0,
      progress: 0,
      startTime: new Date(),
      endTime: null,
      difficulty: gameConfig?.difficulty || 'medium'
    });
  };
  
  // פונקציית עזר להוספת ניקוד
  const addScore = (points) => {
    LoggerService.info(`[GameContext] Adding ${points} points to score`);
    stateManager.setState({
      score: (state.score || 0) + points
    });
  };
  
  // פונקציית עזר לשינוי רמת קושי
  const setDifficulty = (difficulty) => {
    LoggerService.info(`[GameContext] Setting difficulty to: ${difficulty}`);
    stateManager.setState({ difficulty });
  };
  
  // חזרה לשלב הקודם (אם אפשר)
  const goBack = () => {
    LoggerService.info('[GameContext] Attempting to go back to previous stage');
    return stageController.goBack();
  };
  
  // חישוב התקדמות
  const calculateProgress = () => {
    if (!gameConfig?.stages?.length) return 0;
    
    const totalStages = gameConfig.stages.length;
    const completedCount = state.completedStages?.length || 0;
    const progress = Math.floor((completedCount / totalStages) * 100);
    
    stateManager.setState({ progress });
    return progress;
  };
  
  return (
    <GameContext.Provider value={{ 
      state, 
      gameConfig,
      // חשיפת שירותים 
      stateManager,
      stageController,
      // פונקציות עזר
      moveToStage,
      completeStage,
      resetGame,
      addScore,
      setDifficulty,
      goBack,
      calculateProgress
    }}>
      {children}
    </GameContext.Provider>
  );
}

// הוק לשימוש בקונטקסט המשחק
export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}