import React, { useState, useEffect } from 'react';
import { GameContainer } from '../../components/layout/GameContainer';
import { GameManager } from '../../components/GameManager';
import { NavigationBar } from '../../components/layout/NavigationBar';
import { LoggerService } from '../../services';
import { DevTools } from '../../components/dev/DevTools';
import passoverQuestConfig from './config';
import passoverCharacters from './characters';

// ייבוא מערכת העיצוב החדשה
import { useTheme } from '../../design-system';
import { Button, GlassCard, ScrollCard, JourneyMap } from '../../design-system/components';

/**
 * דף ראשי למשחק פסח - המסע לחירות
 */
export default function PassoverQuestGame() {
  LoggerService.debug("PassoverQuestGame component initialized");
  LoggerService.debug("Config:", passoverQuestConfig);
  LoggerService.debug("Characters:", passoverCharacters);
  
  const theme = useTheme(); // שימוש בהוק החדש לקבלת התמה הנוכחית
  const [gameKey, setGameKey] = useState(Date.now()); // מפתח לאיפוס המשחק
  const [currentStage, setCurrentStage] = useState('intro');
  const [completedStages, setCompletedStages] = useState([]);
  
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
    setCurrentStage('intro');
    setCompletedStages([]);
  };
  
  // מעבר לשלב הבא
  const handleStageComplete = (stageId) => {
    LoggerService.info(`Stage ${stageId} completed`);
    // עדכון רשימת השלבים שהושלמו
    setCompletedStages(prev => [...prev, stageId]);
    
    // חישוב השלב הבא לפי הסדר ב-config
    const stageIndex = passoverQuestConfig.stages.findIndex(stage => stage.id === stageId);
    if (stageIndex >= 0 && stageIndex < passoverQuestConfig.stages.length - 1) {
      const nextStage = passoverQuestConfig.stages[stageIndex + 1].id;
      setCurrentStage(nextStage);
    } else if (stageId === passoverQuestConfig.stages[passoverQuestConfig.stages.length - 1].id) {
      // אם זה השלב האחרון, עבור לסיום
      setCurrentStage('outro');
    }
  };
  
  // סיום המשחק
  const handleComplete = (score) => {
    LoggerService.info("המשחק הסתיים, הניקוד הסופי:", score);
    // כאן ניתן להוסיף פעולות נוספות בסיום המשחק
  };
  
  // דוגמה לשלבים (יש להחליף עם נתונים אמיתיים מה-config)
  const stages = [
    { id: 'intro', name: 'פתיחה', shortName: 'פתיחה' },
    { id: 'stage1', name: 'מסע אברהם', shortName: 'אברהם' },
    { id: 'stage2', name: 'שעבוד מצרים', shortName: 'שעבוד' },
    { id: 'stage3', name: 'המכות', shortName: 'מכות' },
    { id: 'stage4', name: 'ליל הסדר', shortName: 'סדר' },
    { id: 'stage5', name: 'קריעת ים סוף', shortName: 'ים סוף' },
    { id: 'outro', name: 'סיום', shortName: 'סיום' },
  ];
  
  LoggerService.debug("PassoverQuestGame render");
  try {
    return (
      <GameContainer 
        gameConfig={passoverQuestConfig}
        characters={passoverCharacters}
        key={gameKey}
      >
        <div className="bg-gradient-to-b from-blue-900 to-blue-800 min-h-screen">
          <header className="p-4 border-b border-blue-700">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">המסע לחירות</h1>
              <Button 
                variant="outline" 
                size="small"
                onClick={handleReset}
              >
                התחל מחדש
              </Button>
            </div>
          </header>
          
          {/* מפת מסע */}
          <div className="container mx-auto my-4 px-4">
            <JourneyMap 
              stages={stages}
              currentStage={currentStage}
              completedStages={completedStages}
              onStageClick={(stageId) => {
                // מעבר לשלב רק אם כבר הושלם
                if (completedStages.includes(stageId)) {
                  setCurrentStage(stageId);
                }
              }}
            />
          </div>
          
          <main className="container mx-auto p-4">
            <ScrollCard className="mb-6">
              {/* כאן יוצג תוכן השלב הנוכחי */}
              <GameManager
                templateId={passoverQuestConfig.template}
                onComplete={handleComplete}
                onStageComplete={handleStageComplete}
                currentStage={currentStage}
              />
            </ScrollCard>
          </main>
          
          <footer className="p-4 text-center text-blue-300 text-sm border-t border-blue-700">
            &copy; המסע לחירות - משחק פסח אינטראקטיבי
          </footer>
        </div>
        
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