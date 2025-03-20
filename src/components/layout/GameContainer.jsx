import React, { useEffect, useState } from 'react';
import { GameProvider } from '../../contexts/GameContext';
import { useTheme } from '../../hooks/useTheme';
import { ContentLoader } from '../../services/contentLoader';

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
  
  const [loadedConfig, setLoadedConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use the theme from context or theme override
  const theme = themeOverride || useTheme();
  
  // טעינת תוכן המשחק
  useEffect(() => {
    async function loadContent() {
      if (!gameConfig || !gameConfig.id) {
        console.error("Missing gameConfig or gameConfig.id");
        setError("חסרה קונפיגורציית משחק");
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        console.log(`Loading content for game: ${gameConfig.id}`);
        
        // טעינת תוכן המשחק
        const content = await ContentLoader.loadGameContent(gameConfig.id);
        console.log("Content loaded successfully:", content);
        
        // שילוב התוכן עם הקונפיגורציה
        const configWithContent = {
          ...gameConfig,
          content
        };
        
        console.log("Complete config with content:", configWithContent);
        setLoadedConfig(configWithContent);
        setError(null);
      } catch (err) {
        console.error('Error loading game content:', err);
        setError(`שגיאה בטעינת תוכן המשחק: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadContent();
  }, [gameConfig]);
  
  // Debug to log props and check for issues
  useEffect(() => {
    console.log("GameContainer mounted with:", {
      gameConfig: loadedConfig || gameConfig,
      initialState,
      mediaAssets,
      characters
    });
    
    // Check for required properties in gameConfig
    const config = loadedConfig || gameConfig;
    if (config) {
      if (!config.id) {
        console.warn("gameConfig.id is missing");
      }
      
      if (!config.template) {
        console.warn("gameConfig.template is missing");
      }
      
      if (!config.content) {
        console.warn("gameConfig.content is missing");
      }
      
      if (config.content && !config.content.stages) {
        console.warn("gameConfig.content.stages is missing");
      }
    }
    
    // Check if theme exists
    if (!theme) {
      console.error("Theme is missing");
    }
    
  }, [loadedConfig, gameConfig, initialState, mediaAssets, characters, theme]);
  
  // הצגת טעינה
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="w-12 h-12 border-t-4 border-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p>טוען תוכן משחק...</p>
        </div>
      </div>
    );
  }
  
  // הצגת שגיאה אם יש
  if (error) {
    return (
      <div className="p-6 bg-red-100 text-red-700 rounded-lg max-w-lg mx-auto mt-10">
        <h3 className="text-xl font-bold mb-2">שגיאה בטעינת משחק</h3>
        <p>{error}</p>
      </div>
    );
  }
  
  // בדיקה שיש קונפיגורציית משחק
  if (!loadedConfig && !gameConfig) {
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
  
  const configToUse = loadedConfig || gameConfig;
  
  console.log("GameContainer rendering with GameProvider");
  try {
    return (
      <GameProvider 
        gameConfig={configToUse}
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