import React, { useState, useEffect } from 'react';
import { GameProvider } from '../../contexts/GameContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { defaultTheme } from '../../themes/defaultTheme';
import { ContentLoader } from '../../services/contentLoader';

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
  const [theme, setTheme] = useState(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // טעינת נתוני המשחק
  useEffect(() => {
    async function loadGame() {
      setIsLoading(true);
      setError(null);

      try {
        // טעינת קונפיגורציה
        const config = await ContentLoader.loadGameConfig(gameId);
        setGameConfig(config);

        // טעינת תוכן המשחק
        const content = await ContentLoader.loadGameContent(gameId);
        setGameContent(content);

        // טעינת דמויות (אם יש)
        try {
          const chars = await ContentLoader.loadCharacters(gameId);
          setCharacters(chars);
        } catch (charError) {
          // דמויות הן אופציונליות, כך שאם הטעינה נכשלת - לא קריטי
          console.warn('Could not load characters:', charError);
          setCharacters({});
        }

        // טעינת ערכת נושא אם מוגדרת במשחק
        if (config.theme) {
          try {
            const themeModule = await import(`../../themes/${config.theme}Theme.js`);
            const themeData = themeModule.default || themeModule;
            setTheme(themeData);
          } catch (themeError) {
            console.warn(`Could not load theme ${config.theme}:`, themeError);
            // נשאר עם ערכת ברירת מחדל
          }
        }

        // קריאה לקולבק עם כל הנתונים
        if (onGameLoad) {
          onGameLoad({ config, content, characters });
        }

      } catch (err) {
        console.error('Error loading game:', err);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-8 text-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">טוען משחק...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-8 text-center text-red-600">
          <h2 className="text-2xl font-bold mb-4">שגיאה בטעינת המשחק</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!gameConfig || !gameContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-8 text-center">
          <p className="text-lg">נא לבחור משחק לטעינה.</p>
        </div>
      </div>
    );
  }

  // הכנת נתונים מלאים למשחק
  const gameData = {
    ...gameConfig,
    content: gameContent,
    characters: characters
  };

  return (
    <ThemeProvider initialTheme={theme}>
      <GameProvider gameConfig={gameData}>
        {children}
      </GameProvider>
    </ThemeProvider>
  );
}