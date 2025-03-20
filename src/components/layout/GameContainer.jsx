import React from 'react';
import { GameProvider } from '../../contexts/GameContext';
import { useTheme } from '../../hooks/useTheme';

/**
 * מכיל משחק שלם עם עטיפת קונטקסט
 * @param {Object} props - פרופס הרכיב
 * @param {Object} props.gameConfig - קונפיגורציית המשחק
 * @param {Object} props.initialState - מצב התחלתי (אופציונלי)
 * @param {Object} props.mediaAssets - נכסי מדיה (אופציונלי)
 * @param {Object} props.characters - דמויות (אופציונלי)
 * @param {ReactNode} props.children - תוכן המשחק
 */
export function GameContainer({ 
  gameConfig, 
  initialState, 
  mediaAssets,
  characters,
  children,
  className,
  ...props
}) {
  const theme = useTheme();
  
  // בדיקה שיש קונפיגורציית משחק
  if (!gameConfig) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        שגיאה: לא נמצאה קונפיגורציית משחק
      </div>
    );
  }
  
  return (
    <GameProvider 
      gameConfig={gameConfig}
      initialState={initialState}
      mediaAssets={mediaAssets}
      characters={characters}
    >
      <div 
        className={`
          min-h-screen ${theme.gradients.background}
          flex flex-col ${className || ''}
        `}
        dir="rtl"
        {...props}
      >
        {children}
      </div>
    </GameProvider>
  );
}