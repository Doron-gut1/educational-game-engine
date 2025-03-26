import React, { useState, useEffect } from 'react';
import { GameProvider } from '../../contexts/GameContext';
import { ThemeProvider } from '../../design-system/ThemeProvider';
import { themes } from '../../design-system/themes';
import { ContentLoader } from '../../services/contentLoader';
import { AssetManager } from '../../services/assetManager';
import { LoggerService } from '../../services/loggerService';
import { LoadingIndicator, GlassCard, Button } from '../../design-system/components';

/**
 * רכיב מנוע המשחק - אחראי לטעינת המשחק והגדרותיו
 * @param {Object} props - פרופס הרכיב
 * @param {string} props.gameId - מזהה המשחק לטעינה
 * @param {Function} props.onGameLoad - קולבק בעת טעינת המשחק
 * @param {Function} props.onError - קולבק בעת שגיאה
 */
export function GameEngine({ 
  gameId,
  onGameLoad,
  onError,
  children 
}) {
  const [gameConfig, setGameConfig] = useState(null);
  const [gameContent, setGameContent] = useState(null);
  const [characters, setCharacters] = useState({});
  const [theme, setTheme] = useState('default');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // לוג לקונסולה לדיבוג
  console.log("GameEngine initialized with gameId:", gameId);

  // טיפול בטיימאאוט טעינה - זמן קצר יותר (7 שניות במקום 10)
  useEffect(() => {
    // הגדרת טיימרים מדורגים לבדיקת התקדמות הטעינה
    const halfTimeout = setTimeout(() => {
      if (isLoading) {
        // עדכון התקדמות ל-50% אחרי 3 שניות
        setLoadingProgress(50);
      }
    }, 3000); // 3 שניות
    
    // טיימר לבדיקת טעינה תקועה
    const fullTimeout = setTimeout(() => {
      if (isLoading) {
        setLoadingTimeout(true);
        LoggerService.warn('[GameEngine] Loading timeout occurred');
        console.warn('[GameEngine] Loading timeout occurred');
      }
    }, 7000); // 7 שניות
    
    return () => {
      clearTimeout(halfTimeout);
      clearTimeout(fullTimeout);
    };
  }, [isLoading]);

  // טעינת נתוני המשחק
  useEffect(() => {
    async function loadGame() {
      setIsLoading(true);
      setError(null);
      setLoadingTimeout(false);
      setLoadingProgress(10); // התחלנו טעינה

      try {
        console.log(`[GameEngine] Starting to load game: ${gameId}`);
        
        // טעינה מוקדמת של נכסים חיוניים למשחק (בלי להמתין לסיום)
        LoggerService.info(`[GameEngine] Preloading essential assets for ${gameId}`);
        AssetManager.preloadEssentialAssets(gameId).catch(err => {
          LoggerService.warn('[GameEngine] Assets preload error:', err);
          console.warn('[GameEngine] Assets preload error:', err);
          // לא נפסיק את הטעינה אם יש שגיאה בנכסים
        });
        
        setLoadingProgress(30); // התקדמנו בטעינה
        
        // טעינה במקביל של קונפיגורציה ותוכן
        console.log(`[GameEngine] Loading game configuration and content`);
        const [config, content] = await Promise.all([
          ContentLoader.loadGameConfig(gameId),
          ContentLoader.loadGameContent(gameId)
        ]);
        
        setLoadingProgress(60); // התקדמות נוספת
        
        console.log(`[GameEngine] Game config loaded:`, config);
        setGameConfig(config);
        setGameContent(content);
        
        // טעינת התמה - עם אפשרות גיבוי אם יש שגיאה
        try {
          const themeId = await ContentLoader.loadTheme(gameId);
          console.log(`[GameEngine] Theme loaded:`, themeId);
          
          // וידוא שיש תמה תקינה
          if (!themes[themeId]) {
            LoggerService.warn(`[GameEngine] Theme ${themeId} not found, using default theme`);
            console.warn(`[GameEngine] Theme ${themeId} not found, using default theme`);
            setTheme('default');
          } else {
            setTheme(themeId);
          }
        } catch (themeError) {
          LoggerService.warn('[GameEngine] Could not load theme:', themeError);
          console.warn('[GameEngine] Could not load theme:', themeError);
          setTheme('default');
        }
        
        setLoadingProgress(80); // התקדמות נוספת
        
        // טעינת דמויות (אם יש) - בנפרד כי הן אופציונליות
        try {
          const chars = await ContentLoader.loadCharacters(gameId);
          console.log(`[GameEngine] Characters loaded:`, Object.keys(chars).length);
          setCharacters(chars);
        } catch (charError) {
          // דמויות הן אופציונליות, כך שאם הטעינה נכשלת - לא קריטי
          console.warn('[GameEngine] Could not load characters:', charError);
          LoggerService.warn('[GameEngine] Could not load characters:', charError);
          setCharacters({});
        }

        setLoadingProgress(100); // סיימנו את הטעינה
        
        // קריאה לקולבק עם כל הנתונים
        if (onGameLoad) {
          console.log(`[GameEngine] Calling onGameLoad callback`);
          
          // אם הטיימאאוט כבר התרחש, נדלג על הקולבק
          if (!loadingTimeout) {
            onGameLoad({ 
              config, 
              content, 
              characters,
              theme: theme
            });
          }
        }

      } catch (err) {
        console.error('[GameEngine] Error loading game:', err);
        LoggerService.error('[GameEngine] Error loading game:', err);
        setError(err.message || 'Failed to load game');
        if (onError) {
          onError(err);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (gameId) {
      loadGame();
    }
  }, [gameId, onGameLoad, onError, loadingTimeout]);

  // פונקציה לניסיון טעינה מחדש
  const handleRetry = () => {
    console.log(`[GameEngine] Retrying to load game: ${gameId}`);
    setIsLoading(true);
    setLoadingTimeout(false);
    setError(null);
    setLoadingProgress(0);
    
    // ניקוי המטמון לפני ניסיון טעינה חדש
    AssetManager.clearCache();
    
    // דחייה קלה לפני ניסיון טעינה חדש
    setTimeout(() => {
      const loadFunc = async () => {
        try {
          setLoadingProgress(20);
          
          const [config, content, themeId] = await Promise.all([
            ContentLoader.loadGameConfig(gameId),
            ContentLoader.loadGameContent(gameId),
            ContentLoader.loadTheme(gameId)
          ]);
          
          setLoadingProgress(70);
          
          setGameConfig(config);
          setGameContent(content);
          setTheme(themeId);
          
          // טעינת דמויות
          try {
            const chars = await ContentLoader.loadCharacters(gameId);
            setCharacters(chars);
          } catch (e) {
            setCharacters({});
          }
          
          setLoadingProgress(100);
          
          if (onGameLoad) {
            onGameLoad({ config, content, characters, theme: themeId });
          }
          
        } catch (err) {
          LoggerService.error('[GameEngine] Retry failed:', err);
          setError(err.message || 'Failed to load game');
          if (onError) {
            onError(err);
          }
        } finally {
          setIsLoading(false);
        }
      };
      
      loadFunc();
    }, 300);
  };

  // צפייה בגמול משחק גם בלי נתונים מלאים
  const handleForceStart = () => {
    // שימוש בנתונים מינימליים אם אין נתונים מלאים
    const minimalConfig = gameConfig || {
      id: gameId,
      name: gameId,
      template: 'questJourney',
      theme: 'default'
    };
    
    const minimalContent = gameContent || {
      intro: {
        title: "התחלת המשחק",
        description: "התחלנו את המשחק במצב משאבים מינימליים"
      },
      stages: []
    };
    
    const gameData = {
      ...minimalConfig,
      id: gameId,
      content: minimalContent,
      characters: characters || {},
      theme: theme || 'default'
    };
    
    console.log("[GameEngine] Starting game with minimal data:", gameData);
    
    if (onGameLoad) {
      onGameLoad(gameData);
    }
    
    setGameConfig(minimalConfig);
    setGameContent(minimalContent);
    setIsLoading(false);
    setLoadingTimeout(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-gray-100 p-4">
        <GlassCard className="p-8 text-center max-w-md">
          <LoadingIndicator 
            type="spinner" 
            size="large" 
            color="primary" 
            text={`טוען משחק... ${loadingProgress}%`} 
          />
          
          {loadingTimeout && (
            <div className="mt-6">
              <p className="text-amber-600 mb-2">הטעינה לוקחת זמן רב מהצפוי.</p>
              <div className="flex flex-col md:flex-row gap-3 mt-4 justify-center">
                <Button 
                  onClick={handleRetry}
                  variant="primary"
                  className="flex-1"
                >
                  נסה שוב
                </Button>
                
                <Button 
                  onClick={handleForceStart}
                  variant="secondary"
                  className="flex-1"
                >
                  התחל בכל זאת
                </Button>
              </div>
            </div>
          )}
          
          {/* דיבוג */}
          {process.env.NODE_ENV !== "production" && (
            <div className="mt-4 p-2 bg-gray-100 rounded text-left text-xs opacity-75">
              <div>Debug: Loading game "{gameId}"</div>
              <div>Timeout triggered: {loadingTimeout ? "yes" : "no"}</div>
              <div>Progress: {loadingProgress}%</div>
            </div>
          )}
        </GlassCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-gray-100 p-4">
        <GlassCard className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-700 mb-4">שגיאה בטעינת המשחק</h2>
          <p className="mb-6">{error}</p>
          
          <div className="flex flex-col md:flex-row gap-3 mt-4 justify-center">
            <Button 
              onClick={handleRetry}
              variant="primary"
              className="flex-1"
            >
              נסה שוב
            </Button>
            
            <Button 
              onClick={handleForceStart}
              variant="secondary"
              className="flex-1"
            >
              התחל בכל זאת
            </Button>
          </div>
          
          {/* דיבוג */}
          {process.env.NODE_ENV !== "production" && (
            <div className="mt-4 p-2 bg-gray-100 rounded text-left text-xs opacity-75">
              <div>Debug: Error loading game "{gameId}"</div>
              <div>Error: {error}</div>
            </div>
          )}
        </GlassCard>
      </div>
    );
  }

  if (!gameConfig || !gameContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-gray-100 p-4">
        <GlassCard className="p-8 text-center max-w-md">
          <p className="text-lg mb-4">אנא בחר משחק לטעינה</p>
          <Button onClick={() => window.location.href = '/'}>
            לדף הבית
          </Button>
        </GlassCard>
      </div>
    );
  }

  // הכנת נתונים מלאים למשחק
  const gameData = {
    ...gameConfig,
    id: gameId, // וידוא שה-ID תמיד קיים
    content: gameContent,
    characters: characters,
    theme: theme
  };

  return (
    <ThemeProvider theme={theme}>
      <GameProvider gameConfig={gameData}>
        {children}
      </GameProvider>
    </ThemeProvider>
  );
}