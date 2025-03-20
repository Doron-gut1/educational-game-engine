import React, { useEffect } from 'react';
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
  theme: themeOverride,
  children,
  className,
  ...props
}) {
  console.log("GameContainer component initialized");
  
  // Use the theme from context or theme override
  const theme = themeOverride || useTheme();
  
  // Debug to log props and check for issues
  useEffect(() => {
    console.log("GameContainer mounted with:", {
      gameConfig,
      initialState,
      mediaAssets,
      characters
    });
    
    // Check for required properties in gameConfig
    if (gameConfig) {
      if (!gameConfig.id) {
        console.warn("gameConfig.id is missing");
      }
      
      if (!gameConfig.template) {
        console.warn("gameConfig.template is missing");
      }
      
      if (!gameConfig.content) {
        console.warn("gameConfig.content is missing");
      }
      
      if (gameConfig.content && !gameConfig.content.stages) {
        console.warn("gameConfig.content.stages is missing");
      }
    }
    
    // Check if theme exists
    if (!theme) {
      console.error("Theme is missing");
    }
    
  }, [gameConfig, initialState, mediaAssets, characters, theme]);
  
  // בדיקה שיש קונפיגורציית משחק
  if (!gameConfig) {
    console.error("Missing gameConfig in GameContainer");
    return (
      <div className="p-6 bg-red-100 text-red-700 rounded-lg max-w-lg mx-auto mt-10">
        <h3 className="text-xl font-bold mb-2">שגיאה: לא נמצאה קונפיגורציית משחק</h3>
        <p>וודא שהועבר אובייקט gameConfig תקין לרכיב GameContainer</p>
        <div className="mt-4 text-gray-600 p-3 bg-gray-100 rounded">
          <pre className="overflow-auto text-sm">
            props: {JSON.stringify({ gameConfig, initialState, mediaAssets, characters }, null, 2)}
          </pre>
        </div>
      </div>
    );
  }
  
  // בדיקה שיש תמה
  if (!theme) {
    console.error("Missing theme in GameContainer");
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        שגיאה: לא נמצאה ערכת עיצוב (theme)
      </div>
    );
  }
  
  console.log("GameContainer rendering with GameProvider");
  try {
    return (
      <GameProvider 
        gameConfig={gameConfig}
        initialState={initialState}
        mediaAssets={mediaAssets}
        characters={characters}
      >
        <div 
          className={`
            min-h-screen ${theme.gradients?.background || 'bg-gray-100'}
            flex flex-col ${className || ''}
          `}
          dir="rtl"
          {...props}
        >
          {children}
        </div>
      </GameProvider>
    );
  } catch (error) {
    console.error("Error in GameContainer render:", error);
    return (
      <div className="p-6 bg-red-100 text-red-700 rounded-lg max-w-lg mx-auto mt-10">
        <h3 className="text-xl font-bold mb-2">שגיאה ברנדור GameContainer</h3>
        <p className="mb-3">{error.toString()}</p>
        <pre className="overflow-auto text-sm p-3 bg-gray-100 rounded">
          {error.stack}
        </pre>
      </div>
    );
  }
}