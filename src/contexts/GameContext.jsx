import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameState } from '../core/engine/GameState';
import { StateManager, StageController, LoggerService } from '../services';

// קונטקסט המשחק
export const GameContext = createContext(null);

// ספק קונטקסט המשחק
export function GameProvider({ children, gameConfig }) {
  // יצירת מופע GameState לאחורה-תאימות
  const [gameState] = useState(() => new GameState(gameConfig));
  const [state, setState] = useState(gameState.state);
  
  // יצירת מופעים של השירותים החדשים
  const [stateManager] = useState(() => new StateManager(gameState.state));
  const [stageController] = useState(() => new StageController(stateManager));
  
  // דגל המציין אם משתמשים במנגנון החדש או הישן
  // מעבר למנגנון החדש
  const useNewServices = true;
  
  LoggerService.info(`[GameContext] Using ${useNewServices ? 'new' : 'legacy'} state management system`);
  
  // עדכון מצב בעת שינויים - מנגנון ישן
  useEffect(() => {
    if (!useNewServices) {
      LoggerService.debug('[GameContext] Subscribing to legacy GameState');
      const unsubscribe = gameState.subscribe(newState => {
        setState(newState);
        
        // עדכון StateManager החדש במצב העדכני (סנכרון)
        if (useNewServices) {
          stateManager.setState(newState, null);
        }
      });
      
      return unsubscribe;
    }
  }, [gameState, stateManager, useNewServices]);
  
  // עדכון מצב בעת שינויים - מנגנון חדש
  useEffect(() => {
    if (useNewServices) {
      LoggerService.debug('[GameContext] Subscribing to new StateManager');
      const unsubscribe = stateManager.subscribe('gameContext', newState => {
        setState(newState);
        
        // עדכון מנגנון ישן במצב העדכני (סנכרון)
        // כדי לשמור על תאימות לאחור
        Object.assign(gameState.state, newState);
        gameState.notifyListeners();
      });
      
      return unsubscribe;
    }
  }, [stateManager, gameState, useNewServices]);
  
  useEffect(() => {
    LoggerService.info('[GameContext] Initializing game');
    
    // אתחול המשחק בטעינה
    if (useNewServices) {
      // וידוא שיש תצורת משחק תקינה
      if (!gameConfig) {
        LoggerService.warn('[GameContext] No game config provided');
        return;
      }
      
      // אתחול באמצעות השירותים החדשים
      stateManager.resetState({
        ...gameState.state,
        gameConfig, // שמירת תצורת המשחק במצב
        currentStage: gameConfig?.stages?.[0]?.id || null,
        completedStages: [],
        score: 0,
        progress: 0,
        startTime: new Date(),
        endTime: null
      });
      
      LoggerService.debug('[GameContext] State initialized with new services');
    } else {
      // אתחול באמצעות המנגנון הישן
      gameState.initState();
      LoggerService.debug('[GameContext] State initialized with legacy system');
    }
    
    // שמירת מצב בעת עזיבת העמוד
    const handleBeforeUnload = () => {
      LoggerService.debug('[GameContext] Saving state before unload');
      
      if (useNewServices) {
        // TODO: יש להוסיף מנגנון שמירה לשירותים החדשים
      } else {
        gameState.saveState();
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      if (useNewServices) {
        stageController.dispose();
      }
    };
  }, [gameState, stateManager, stageController, gameConfig, useNewServices]);
  
  // הוספת פונקציות עזר עם תמיכה בשני המנגנונים
  const moveToStage = (stageId) => {
    LoggerService.info(`[GameContext] Moving to stage: ${stageId}`);
    
    if (useNewServices) {
      return stageController.transitionToStage(stageId);
    } else {
      // מימוש פשוט לניסיון להעביר לשלב
      gameState.state.currentStage = stageId;
      gameState.notifyListeners();
      return true;
    }
  };
  
  const completeStage = (stageId, score = 0) => {
    LoggerService.info(`[GameContext] Completing stage: ${stageId} with score: ${score}`);
    
    if (useNewServices) {
      return stageController.completeStage(stageId, score);
    } else {
      // התאמה למנגנון הישן
      if (!gameState.state.completedStages.includes(stageId)) {
        gameState.state.completedStages.push(stageId);
      }
      gameState.addScore(score);
      gameState.notifyListeners();
      return true;
    }
  };
  
  const resetGame = () => {
    LoggerService.info('[GameContext] Resetting game');
    
    if (useNewServices) {
      stateManager.resetState({
        currentStage: gameConfig?.stages?.[0]?.id || null,
        completedStages: [],
        score: 0,
        progress: 0,
        startTime: new Date(),
        endTime: null,
        gameConfig // שמירת תצורת המשחק
      });
    } else {
      gameState.initState();
    }
  };
  
  // פונקציית עזר להוספת ניקוד
  const addScore = (points) => {
    LoggerService.info(`[GameContext] Adding ${points} points to score`);
    
    if (useNewServices) {
      stateManager.setState({
        score: (state.score || 0) + points
      });
    } else {
      gameState.addScore(points);
    }
  };
  
  // פונקציית עזר לשינוי רמת קושי
  const setDifficulty = (difficulty) => {
    LoggerService.info(`[GameContext] Setting difficulty to: ${difficulty}`);
    
    if (useNewServices) {
      stateManager.setState({ difficulty });
    } else {
      gameState.setDifficulty(difficulty);
    }
  };
  
  return (
    <GameContext.Provider value={{ 
      state, 
      gameState,
      gameConfig,
      // חשיפת שירותים חדשים
      stateManager,
      stageController,
      // פונקציות עזר
      moveToStage,
      completeStage,
      resetGame,
      addScore,
      setDifficulty
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