import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GameEngine } from '../core/engine/GameEngine';
import { LoggerService, AssetManager } from '../services';

// רכיבי משחק מותאמים לפי סוג
import { MultiChoiceGame } from '../modules/multiChoice/MultiChoiceGame';
import { DragDropGame } from '../modules/dragAndDrop/DragDropGame';
import { MatchingGame } from '../modules/matching/MatchingGame';
// יש לייבא מודולים נוספים בהתאם לצורך

// ייבוא מערכת העיצוב החדשה
import { ThemeProvider } from '../design-system/ThemeProvider';

// רכיבי מערכת עיצוב
import { 
  Button, 
  ScrollCard,
  GlassCard,
  JourneyMap,
  ProgressTracker,
  PageContainer,
  GameContainer
} from '../design-system/components';

export function GamePage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  
  const [gameData, setGameData] = useState(null);
  const [currentStage, setCurrentStage] = useState(null);
  const [completedStages, setCompletedStages] = useState([]);
  const [error, setError] = useState(null);
  const [backgroundPath, setBackgroundPath] = useState(null);
  
  // טיפול בסיום משחק
  const handleGameComplete = (finalScore) => {
    LoggerService.info(`Game completed with score: ${finalScore}`);
    // אפשרות להצגת חלון סיכום או ניווט לדף הבית
    navigate('/');
  };
  
  // טיפול בשגיאת טעינה
  const handleLoadError = (error) => {
    LoggerService.error('Error loading game:', error);
    setError('שגיאה בטעינת המשחק');
  };
  
  // טיפול בטעינת משחק
  const handleGameLoad = (data) => {
    setGameData(data);
    
    // עדכון רקע ראשוני
    if (gameId && data?.content?.stages) {
      const initialStage = data.content.stages[0];
      
      if (initialStage) {
        setCurrentStage(initialStage);
        
        // עדכון רקע אם קיים
        if (initialStage.background) {
          setBackgroundPath(AssetManager.getAssetPath(gameId, initialStage.background, 'backgrounds'));
        } else {
          // אם אין רקע ספציפי לשלב, לקחת את רקע ברירת המחדל של המשחק
          setBackgroundPath(AssetManager.getAssetPath(gameId, 'scroll_background.jpg', 'backgrounds'));
        }
      }
    }
    
    // טעינה מקדימה של נכסים
    if (gameId) {
      AssetManager.preloadEssentialAssets(gameId).catch(err => {
        LoggerService.warn("טעינה מוקדמת של נכסים נכשלה:", err);
        // ממשיכים למרות השגיאה כדי לאפשר למשחק לפעול
      });
    }
  };
  
  // טיפול בשינוי שלב נוכחי
  useEffect(() => {
    if (currentStage?.background && gameId) {
      setBackgroundPath(AssetManager.getAssetPath(gameId, currentStage.background, 'backgrounds'));
    }
  }, [currentStage, gameId]);
  
  // טיפול בהשלמת שלב
  const handleStageComplete = (stageId, score) => {
    LoggerService.info(`Stage ${stageId} completed with score: ${score}`);
    
    // עדכון רשימת השלבים שהושלמו
    if (!completedStages.includes(stageId)) {
      setCompletedStages(prev => [...prev, stageId]);
    }
    
    // מעבר לשלב הבא
    if (gameData && gameData.content.stages) {
      const currentIndex = gameData.content.stages.findIndex(s => s.id === stageId);
      
      if (currentIndex >= 0 && currentIndex < gameData.content.stages.length - 1) {
        setCurrentStage(gameData.content.stages[currentIndex + 1]);
      } else {
        // סיום המשחק
        handleGameComplete(score);
      }
    }
  };
  
  // רנדור רכיב המשחק לפי סוג
  const renderGameModule = (stage) => {
    if (!stage) return null;
    
    switch (stage.type) {
      case 'multi_choice':
        return (
          <MultiChoiceGame
            questions={stage.questions}
            title={stage.title}
            onComplete={(score) => handleStageComplete(stage.id, score)}
            basePoints={stage.basePoints || 10}
            sourceReference={stage.sourceReference}
            learningPopup={stage.learningPopup}
          />
        );
      case 'drag_drop':
        return (
          <DragDropGame
            items={stage.items}
            dropZones={stage.dropZones}
            title={stage.title}
            onComplete={(score) => handleStageComplete(stage.id, score)}
            basePoints={stage.basePoints || 15}
            sourceReference={stage.sourceReference}
            learningPopup={stage.learningPopup}
          />
        );
      case 'matching':
        return (
          <MatchingGame
            pairs={stage.pairs}
            title={stage.title}
            onComplete={(score) => handleStageComplete(stage.id, score)}
            basePoints={stage.basePoints || 15}
            sourceReference={stage.sourceReference}
            learningPopup={stage.learningPopup}
          />
        );
      // חובה לטפל בסוגים נוספים בהתאם לצורך
        
      default:
        return <div>סוג משחק לא נתמך: {stage.type}</div>;
    }
  };
  
  // רנדור רקע דינמי
  const getBackgroundStyle = () => {
    if (backgroundPath) {
      return {
        backgroundImage: `url(${backgroundPath})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    }
    
    // רקע ברירת מחדל אם אין רקע ספציפי
    return {
      backgroundImage: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)'
    };
  };
  
  // מיפוי שלבים למפת מסע
  const getStagesForJourneyMap = () => {
    if (!gameData || !gameData.content || !gameData.content.stages) {
      return [];
    }
    
    // שלב פתיחה
    const stages = [];
    
    // אם יש שלב פתיחה, נוסיף אותו
    if (gameData.content.intro) {
      stages.push({ id: 'intro', name: 'פתיחה', shortName: 'פתיחה' });
    }
    
    // הוספת השלבים
    gameData.content.stages.forEach((stage, index) => {
      stages.push({
        id: stage.id,
        name: stage.title || `שלב ${index + 1}`,
        shortName: stage.shortTitle || stage.title || `שלב ${index + 1}`
      });
    });
    
    // אם יש שלב סיום, נוסיף אותו
    if (gameData.content.outro) {
      stages.push({ id: 'outro', name: 'סיום', shortName: 'סיום' });
    }
    
    return stages;
  };
  
  // טיפול בשגיאות תמונה
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = '/assets/shared/placeholders/loading_placeholder.svg';
  };
  
  return (
    <GameEngine
      gameId={gameId}
      onGameLoad={handleGameLoad}
      onError={handleLoadError}
    >
      <PageContainer 
        className="min-h-screen"
        style={getBackgroundStyle()}
      >
        {error ? (
          <GlassCard className="mx-auto mt-16 p-8 max-w-lg text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">שגיאה</h2>
            <p className="mb-6">{error}</p>
            <Button
              onClick={() => navigate('/')}
              variant="secondary"
            >
              חזרה לדף הבית
            </Button>
          </GlassCard>
        ) : !gameData ? (
          <div className="flex h-screen items-center justify-center">
            <div className="text-center">
              <div className="loading-scroll animate-pulse-soft">
                <img 
                  src="/assets/shared/placeholders/loading_placeholder.svg" 
                  alt="טוען..." 
                  className="w-20 h-20 mx-auto"
                  onError={handleImageError}
                />
              </div>
              <p className="mt-4 text-white">טוען משחק...</p>
            </div>
          </div>
        ) : (
          <>
            <header className="bg-black bg-opacity-50 p-4 border-b border-white/10 sticky top-0 z-10">
              <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">{gameData.name}</h1>
                <Button 
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="border-white text-white hover:bg-white/20"
                >
                  חזרה לדף הבית
                </Button>
              </div>
            </header>
            
            {gameData.content.stages && (
              <div className="container mx-auto my-4 px-4">
                <JourneyMap 
                  stages={getStagesForJourneyMap()}
                  currentStage={currentStage?.id}
                  completedStages={completedStages}
                  onStageClick={(stageId) => {
                    // מעבר לשלב רק אם כבר הושלם
                    if (completedStages.includes(stageId)) {
                      const stage = [
                        ...gameData.content.stages,
                        gameData.content.intro,
                        gameData.content.outro
                      ].find(s => s?.id === stageId);
                      
                      if (stage) {
                        setCurrentStage(stage);
                      }
                    }
                  }}
                />
              </div>
            )}
            
            <main className="container mx-auto p-4 pt-6">
              <ScrollCard className="bg-white/95 backdrop-blur-md">
                {currentStage && (
                  <>
                    <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
                      {currentStage.title}
                    </h2>
                    
                    {renderGameModule(currentStage)}
                  </>
                )}
              </ScrollCard>
            </main>
            
            <footer className="bg-black bg-opacity-50 p-4 text-center text-blue-300 text-sm border-t border-white/10 mt-auto">
              &copy; {gameData.name} - משחק אינטראקטיבי
            </footer>
          </>
        )}
      </PageContainer>
    </GameEngine>
  );
}

export default GamePage;