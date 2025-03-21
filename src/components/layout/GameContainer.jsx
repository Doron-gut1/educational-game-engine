import React, { useEffect, useState, useRef } from 'react';
import { GameProvider } from '../../contexts/GameContext';
import { ContentLoader } from '../../services/contentLoader';
import { LoggerService } from '../../services/loggerService';

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
  theme,
  children,
  className,
  ...props
}) {
  LoggerService.debug("GameContainer component initialized");
  
  // מניעת עדכונים כפולים וטעינות חוזרות של תוכן
  const contentLoadedRef = useRef(false);
  
  const [loadedConfig, setLoadedConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // טעינת תוכן המשחק - פעם אחת בלבד
  useEffect(() => {
    // מניעת טעינה חוזרת אם כבר טענו תוכן בהצלחה
    if (contentLoadedRef.current || loadedConfig) {
      return;
    }
    
    async function loadContent() {
      if (!gameConfig || !gameConfig.id) {
        LoggerService.error("Missing gameConfig or gameConfig.id");
        setError("חסרה קונפיגורציית משחק");
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        LoggerService.info(`Loading content for game: ${gameConfig.id}`);
        
        // טעינת תוכן המשחק
        const content = await ContentLoader.loadGameContent(gameConfig.id);
        LoggerService.debug("Content loaded successfully");
        
        // שילוב התוכן עם הקונפיגורציה
        const configWithContent = {
          ...gameConfig,
          content
        };
        
        contentLoadedRef.current = true;
        setLoadedConfig(configWithContent);
        setError(null);
      } catch (err) {
        LoggerService.error('Error loading game content:', err);
        setError(`שגיאה בטעינת תוכן המשחק: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadContent();
  }, [gameConfig, loadedConfig]);
  
  // Debug to log props and check for issues - רק פעם אחת כשהמשחק נטען
  useEffect(() => {
    if (!loadedConfig) return;
    
    LoggerService.debug("GameContainer content ready");
    
    // Check for required properties in gameConfig
    const config = loadedConfig || gameConfig;
    if (config) {
      if (!config.id) {
        LoggerService.warn("gameConfig.id is missing");
      }
      
      if (!config.template) {
        LoggerService.warn("gameConfig.template is missing");
      }
      
      if (!config.content) {
        LoggerService.warn("gameConfig.content is missing");
      }
      
      if (config.content && !config.content.stages) {
        LoggerService.warn("gameConfig.content.stages is missing");
      }
    }
    
    // Check if theme exists
    if (!theme) {
      LoggerService.warn("Theme override is missing, will use default theme");
    }
    
  }, [loadedConfig, theme]);
  
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
    LoggerService.error("Missing gameConfig in GameContainer");
    return (
      <div className="p-6 bg-red-100 text-red-700 rounded-lg max-w-lg mx-auto mt-10">
        <h3 className="text-xl font-bold mb-2">שגיאה: לא נמצאה קונפיגורציית משחק</h3>
        <p>וודא שהועבר אובייקט gameConfig תקין לרכיב GameContainer</p>
      </div>
    );
  }
  
  const configToUse = loadedConfig || gameConfig;
  
  LoggerService.debug("GameContainer rendering with GameProvider");
  try {
    return (
      <GameProvider 
        gameConfig={configToUse}
        initialState={initialState}
      >
        <div 
          className={`min-h-screen flex flex-col ${className || ''}`}
          dir="rtl"
          {...props}
        >
          {children}
        </div>
      </GameProvider>
    );
  } catch (error) {
    LoggerService.error("Error in GameContainer render:", error);
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