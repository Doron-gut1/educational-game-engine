import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameState } from '../core/engine/GameState';

// קונטקסט המשחק
export const GameContext = createContext(null);

// ספק קונטקסט המשחק
export function GameProvider({ children, gameConfig }) {
  const [gameState] = useState(() => new GameState(gameConfig));
  const [state, setState] = useState(gameState.state);
  
  // עדכון מצב בעת שינויים
  useEffect(() => {
    const unsubscribe = gameState.subscribe(newState => {
      setState(newState);
    });
    
    return unsubscribe;
  }, [gameState]);
  
  useEffect(() => {
    // אתחול המשחק בטעינה
    gameState.initState();
    
    // שמירת מצב בעת עזיבת העמוד
    const handleBeforeUnload = () => {
      gameState.saveState();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [gameState]);
  
  return (
    <GameContext.Provider value={{ 
      state, 
      gameState,
      gameConfig
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