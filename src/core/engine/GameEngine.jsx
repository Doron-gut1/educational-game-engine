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
  const [theme, setTheme] = useState('base');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // טיפול בטיימאאוט טעינה
  useEffect(() => {
    // טיימר לבדיקת טעינה תקועה
    const timeout = setTimeout(() => {
      if (isLoading) {
        setLoadingTimeout(true);
        LoggerService.warn('[GameEngine] Loading timeout occurred');
      }
    }, 10000); // 10 שניות
    
    return () => clearTimeout(timeout);
  }, [isLoading]);

  // טעינת נתוני המשחק
  useEffect(() => {
    async function loadGame() {
      setIsLoading(true);
      setError(null);
      setLoadingTimeout(false);

      try {
        // טעינה מוקדמת של נכסים חיוניים למשחק (בלי להמתין לסיום)
        LoggerService.info(`[GameEngine] Preloading essential assets for ${gameId}`);
        AssetManager.preloadEssentialAssets(gameId).catch(err => {
          LoggerService.warn('[GameEngine] Assets preload error:', err);
          // לא נפסיק את הטעינה אם יש שגיאה בנכסים
        });
        
        // טעינה במקביל של קונפיגורציה, תוכן ותמה
        const [config, content, themeId] = await Promise.all([
          ContentLoader.loadGameConfig(gameId),
          ContentLoader.loadGameContent(gameId),
          ContentLoader.loadTheme(gameId)
        ]);
        
        setGameConfig(config);
        setGameContent(content);
        setTheme(themeId);
        
        // טעינת דמויות (אם יש) - בנפרד כי הן אופציונליות
        try {
          const chars = await ContentLoader.loadCharacters(gameId);
          setCharacters(chars);
        } catch (charError) {
          // דמויות הן אופציונליות, כך שאם הטעינה נכשלת - לא קריטי
          LoggerService.warn('[GameEngine] Could not load characters:', charError);
          setCharacters({});
        }

        // וידוא שיש תמה תקינה
        if (!themes[themeId]) {
          LoggerService.warn(`[GameEngine] Theme ${themeId} not found, using base theme`);
          setTheme('base');
        }

        // קריאה לקולבק עם כל הנתונים
        if (onGameLoad) {
          onGameLoad({ 
            config, 
            content, 
            characters,
            theme: themeId
          });
        }

      } catch (err) {
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
  }, [gameId, onGameLoad, onError]);

  // פונקציה לניסיון טעינה מחדש
  const handleRetry = () => {
    setIsLoading(true);
    setLoadingTimeout(false);
    setError(null);
    
    // ניקוי המטמון לפני ניסיון טעינה חדש
    AssetManager.clearCache();
    
    // דחייה קלה לפני ניסיון טעינה חדש
    setTimeout(() => {
      const loadFunc = async () => {
        try {
          const [config, content, themeId] = await Promise.all([
            ContentLoader.loadGameConfig(gameId),
            ContentLoader.loadGameContent(gameId),
            ContentLoader.loadTheme(gameId)
          ]);
          
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
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-gray-100 p-4">
        <GlassCard className="p-8 text-center max-w-md">
          <LoadingIndicator 
            type="scroll" 
            size="large" 
            color="primary" 
            text="טוען משחק..." 
          />
          
          {loadingTimeout && (
            <div className="mt-6">
              <p className="text-amber-600 mb-4">הטעינה לוקחת זמן רב מהצפוי.</p>
              <Button 
                onClick={handleRetry}
                variant="primary"
              >
                נסה שוב
              </Button>
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
          <Button 
            onClick={handleRetry}
            variant="primary"
          >
            נסה שוב
          </Button>
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