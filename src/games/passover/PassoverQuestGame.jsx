import React, { useState, useEffect } from 'react';
import { GameContainer } from '../../components/layout/GameContainer';
import { GameManager } from '../../components/GameManager';
import { NavigationBar } from '../../components/layout/NavigationBar';
import { LoggerService } from '../../services';
import { DevTools } from '../../components/dev/DevTools';
import passoverQuestConfig from './config';
import passoverCharacters from './characters';
import passoverTheme from '../../themes/passoverTheme';

/**
 * דף ראשי למשחק פסח - המסע לחירות
 */
export default function PassoverQuestGame() {
  LoggerService.debug("PassoverQuestGame component initialized");
  LoggerService.debug("Config:", passoverQuestConfig);
  LoggerService.debug("Characters:", passoverCharacters);
  LoggerService.debug("Theme:", passoverTheme);
  
  const [gameKey, setGameKey] = useState(Date.now()); // מפתח לאיפוס המשחק
  
  // Debug effect to track mount and render
  useEffect(() => {
    LoggerService.debug("PassoverQuestGame mounted/updated");
    
    // Check all required objects and properties
    if (!passoverQuestConfig) {
      LoggerService.error("passoverQuestConfig is missing");
    }
    
    if (!passoverQuestConfig.template) {
      LoggerService.error("passoverQuestConfig.template is missing");
    }
    
    if (!passoverCharacters) {
      LoggerService.error("passoverCharacters is missing");
    }
    
    if (!passoverTheme) {
      LoggerService.error("passoverTheme is missing");
    }
  }, []);
  
  // איפוס המשחק
  const handleReset = () => {
    LoggerService.info("Game reset requested");
    setGameKey(Date.now());
  };
  
  // סיום המשחק
  const handleComplete = (score) => {
    LoggerService.info("המשחק הסתיים, הניקוד הסופי:", score);
    // כאן ניתן להוסיף פעולות נוספות בסיום המשחק
  };
  
  LoggerService.debug("PassoverQuestGame render");
  try {
    return (
      <GameContainer 
        gameConfig={passoverQuestConfig}
        characters={passoverCharacters}
        theme={passoverTheme}
        key={gameKey}
      >
        <NavigationBar 
          onReset={handleReset} 
          allowSkipping={false}
          showAllStages={false}
        />
        
        <main className="flex-grow p-4">
          <GameManager
            templateId={passoverQuestConfig.template}
            onComplete={handleComplete}
            onReset={handleReset}
          />
        </main>
        
        <footer className="p-4 text-center text-gray-500 text-sm">
          &copy; המסע לחירות - משחק פסח אינטראקטיבי
        </footer>
        
        {/* הוספת DevTools למשחק */}
        <DevTools />
      </GameContainer>
    );
  } catch (error) {
    LoggerService.error("Error rendering PassoverQuestGame:", error);
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg">
          <h1 className="text-2xl font-bold mb-4 text-red-600">שגיאה בטעינת המשחק</h1>
          <p className="mb-4">אירעה שגיאה בעת טעינת משחק פסח:</p>
          <pre className="bg-red-50 p-4 rounded-md overflow-auto text-sm mb-4">
            {error.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            נסה שוב
          </button>
        </div>
      </div>
    );
  }
}