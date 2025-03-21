import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GameEngine } from '../core/engine/GameEngine';
import { LoggerService, AssetManager } from '../services';

// רכיבי משחק מותאמים לפי סוג
import { MultiChoiceGame } from '../modules/multiChoice/MultiChoiceGame';
import { DragDropGame } from '../modules/dragAndDrop/DragDropGame';
import { MatchingGame } from '../modules/matching/MatchingGame';
// יש לייבא מודולים נוספים בהתאם לצורך

// רכיבי מערכת עיצוב
import { 
  Button, 
  ScrollCard,
  GlassCard,
  JourneyMap,
  PageContainer
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
          const bgPath = initialStage.background.startsWith('/') 
            ? initialStage.background 
            : `/assets/games/${gameId}/backgrounds/${initialStage.background}`;
            
          setBackgroundPath(bgPath);
        }
      }
    }
  };
  
  // טיפול בשינוי שלב נוכחי
  useEffect(() => {
    if (currentStage?.background && gameId) {
      const bgPath = currentStage.background.startsWith('/') 
        ? currentStage.background 
        : `/assets/games/${gameId}/backgrounds/${currentStage.background}`;
        
      setBackgroundPath(bgPath);
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
    const stages = [
      { id: 'intro', name: 'פתיחה', shortName: 'פתיחה' }
    ];
    
    // הוספת השלבים
    gameData.content.stages.forEach(stage => {
      stages.push({
        id: stage.id,
        name: stage.title || `שלב ${stages.length}`,
        shortName: stage.shortTitle || stage.title || `שלב ${stages.length}`
      });
    });
    
    // שלב סיום
    stages.push({ id: 'outro', name: 'סיום', shortName: 'סיום' });
    
    return stages;
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
          <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">שגיאה</h2>
            <p>{error}</p>
            <Button
              onClick={() => navigate('/')}
              className="mt-6"
            >
              חזרה לדף הבית
            </Button>
          </div>
        ) : !gameData ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <header className="bg-black bg-opacity-50 p-4 border-b border-white/10 sticky top-0 z-10">
              <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">{gameData.name}</h1>
                <Button 
                  onClick={() => navigate('/')}
                  variant="outline"
                  size="small"
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