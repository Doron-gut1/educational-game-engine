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
  // בשלב זה נשאר עם המנגנון הישן לאחורה-תאימות
  const useNewServices = false;
  
  // עדכון מצב בעת שינויים - מנגנון ישן
  useEffect(() => {
    LoggerService.debug('[GameContext] Subscribing to legacy GameState');
    const unsubscribe = gameState.subscribe(newState => {
      setState(newState);
      
      // עדכון StateManager החדש במצב העדכני (סנכרון)
      if (useNewServices) {
        stateManager.setState(newState, null);
      }
    });
    
    return unsubscribe;
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
      // אתחול באמצעות השירותים החדשים
      stateManager.resetState({
        ...gameState.state,
        currentStage: gameConfig?.stages?.[0]?.id || null,
        completedStages: [],
        score: 0,
        progress: 0,
        startTime: new Date(),
        endTime: null
      });
    } else {
      // אתחול באמצעות המנגנון הישן
      gameState.initState();
    }
    
    // שמירת מצב בעת עזיבת העמוד
    const handleBeforeUnload = () => {
      LoggerService.debug('[GameContext] Saving state before unload');
      gameState.saveState();
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
        endTime: null
      });
    } else {
      gameState.initState();
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
      resetGame
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