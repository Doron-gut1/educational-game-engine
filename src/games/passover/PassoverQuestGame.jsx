import React, { useState, useEffect } from 'react';
import { GameContainer } from '../../components/layout/GameContainer';
import { GameManager } from '../../components/GameManager';
import { NavigationBar } from '../../components/layout/NavigationBar';
import { LoggerService } from '../../services';
import { DevTools } from '../../components/dev/DevTools';
import passoverQuestConfig from './config';
import passoverCharacters from './characters';

// ייבוא מערכת העיצוב החדשה
import { passoverTheme, useTheme } from '../../design-system';
import { Button, GlassCard } from '../../design-system/components';

/**
 * דף ראשי למשחק פסח - המסע לחירות
 */
export default function PassoverQuestGame() {
  LoggerService.debug("PassoverQuestGame component initialized");
  LoggerService.debug("Config:", passoverQuestConfig);
  LoggerService.debug("Characters:", passoverCharacters);
  LoggerService.debug("Theme:", passoverTheme);
  
  const theme = useTheme(); // שימוש בהוק החדש לקבלת התמה הנוכחית
  const [gameKey, setGameKey] = useState(Date.now()); // מפתח לאיפוס המשחק
  
  // Debug effect to track mount and render
  useEffect(() => {
    LoggerService.debug("PassoverQuestGame mounted/updated");
    LoggerService.debug("Current theme:", theme);
    
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
  }, [theme]);
  
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
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 flex items-center justify-center p-4" dir="rtl">
        <GlassCard variant="dark" className="p-8 max-w-lg">
          <h1 className="text-2xl font-bold mb-4 text-red-400">שגיאה בטעינת המשחק</h1>
          <p className="mb-4 text-white">אירעה שגיאה בעת טעינת משחק פסח:</p>
          <pre className="bg-red-900/30 p-4 rounded-md overflow-auto text-sm mb-4 text-white">
            {error.toString()}
          </pre>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            נסה שוב
          </Button>
        </GlassCard>
      </div>
    );
  }
}