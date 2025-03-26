import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LoggerService, AssetManager } from '../services';
import { GameEngine } from '../core/engine/GameEngine';
import { useGameContext } from '../contexts/GameContext';

// רכיבי משחק מודולריים
import { MultiChoiceGame } from '../modules/multiChoice/MultiChoiceGame';
import { DragDropGame } from '../modules/dragAndDrop/DragDropGame';
import { MatchingGame } from '../modules/matching/MatchingGame';
// מודולים נוספים יתווספו בהמשך

// ייבוא מערכת העיצוב החדשה
import { ThemeProvider } from '../design-system/ThemeProvider';

// רכיבי מערכת עיצוב
import { 
  Button, 
  GlassCard,
  ScrollCard,
  JourneyMap,
  LoadingIndicator,
  PageContainer,
  GameContainer,
  StageHeading
} from '../design-system/components';

export function GamePage() {
  console.log("GamePage rendering, gameId:", useParams().gameId);

  const { gameId } = useParams();
  const navigate = useNavigate();
  
  const [gameData, setGameData] = useState(null);
  const [currentStage, setCurrentStage] = useState(null);
  const [completedStages, setCompletedStages] = useState([]);
  const [error, setError] = useState(null);
  const [backgroundPath, setBackgroundPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [debugInfo, setDebugInfo] = useState({});
  
  // הוספת useEffect לדיבוג
  useEffect(() => {
    console.log("GamePage mounted with gameId:", gameId);
    
    // התערבות מוקדמת לבדיקה אם קובץ data.json קיים
    const checkDataJsonExists = async () => {
      try {
        const response = await fetch(`/data.json`);
        console.log("Global data.json exists:", response.ok);
      } catch (err) {
        console.log("Error checking global data.json:", err);
      }
      
      try {
        const response = await fetch(`/assets/games/${gameId}/data.json`);
        console.log(`Game data.json for ${gameId} exists:`, response.ok);
      } catch (err) {
        console.log(`Error checking game data.json for ${gameId}:`, err);
      }
    };
    
    checkDataJsonExists();
    
    // בדיקת קיום תיקיות חיוניות
    const checkEssentialFolders = async () => {
      const foldersToCheck = [
        `/assets/games/${gameId}/backgrounds`,
        `/assets/shared/placeholders`
      ];
      
      const results = {};
      
      for (const folder of foldersToCheck) {
        try {
          // ננסה לטעון קובץ דמיוני מהתיקייה כדי לבדוק אם יש תשובת 404
          const response = await fetch(`${folder}/check.txt`);
          results[folder] = response.status !== 404 ? "Possibly exists" : "404 - Not Found";
        } catch (err) {
          results[folder] = `Error: ${err.message}`;
        }
      }
      
      console.log("Essential folders check:", results);
      setDebugInfo(prev => ({ ...prev, folderCheck: results }));
    };
    
    checkEssentialFolders();
    
    return () => {
      console.log("GamePage unmounting");
    };
  }, [gameId]);
  
  // טיפול בסיום משחק
  const handleGameComplete = useCallback((finalScore) => {
    LoggerService.info(`Game completed with score: ${finalScore}`);
    // אפשרות להצגת חלון סיכום או ניווט לדף הבית
    navigate('/');
  }, [navigate]);
  
  // טיפול בשגיאת טעינה
  const handleLoadError = useCallback((error) => {
    LoggerService.error('Error loading game:', error);
    console.error("Game loading error:", error);
    setDebugInfo(prev => ({ ...prev, loadError: error.message || String(error) }));
    setError('שגיאה בטעינת המשחק: ' + (error.message || 'לא ידוע'));
    setLoading(false);
  }, []);
  
  // איפוס טיימאאוט הטעינה - למקרה שהטעינה תקועה
  useEffect(() => {
    // טיימר לבדיקת טעינה תקועה
    const timeout = setTimeout(() => {
      if (loading) {
        setLoadingTimeout(true);
        LoggerService.warn('Loading timeout occurred');
        console.warn("Loading timeout occurred");
      }
    }, 10000); // 10 שניות
    
    return () => clearTimeout(timeout);
  }, [loading]);
  
  // טיפול בטעינת משחק
  const handleGameLoad = useCallback((data) => {
    console.log("Game data loaded:", data);
    setDebugInfo(prev => ({ ...prev, gameDataLoaded: true, gameId }));
    
    try {
      setGameData(data);
      
      // עדכון רקע ראשוני
      if (gameId && data?.content?.stages) {
        const initialStage = data.content.stages[0];
        console.log("Initial stage:", initialStage);
        
        if (initialStage) {
          setCurrentStage(initialStage);
          setDebugInfo(prev => ({ 
            ...prev, 
            initialStage: initialStage.id, 
            stageType: initialStage.type 
          }));
          
          // עדכון רקע אם קיים
          if (initialStage.background) {
            const bgPath = AssetManager.getAssetPath(gameId, initialStage.background, 'backgrounds');
            console.log("Setting background from stage:", bgPath);
            setBackgroundPath(bgPath);
          } else {
            // אם אין רקע ספציפי לשלב, לקחת את רקע ברירת המחדל של המשחק
            const defaultBgPath = AssetManager.getAssetPath(gameId, 'scroll_background.jpg', 'backgrounds');
            console.log("Using default background:", defaultBgPath);
            setBackgroundPath(defaultBgPath);
          }
        }
      }
      
      // טעינה מקדימה של נכסים
      if (gameId) {
        console.log("Preloading essential assets for:", gameId);
        AssetManager.preloadEssentialAssets(gameId).catch(err => {
          console.warn("Assets preload failed:", err);
          LoggerService.warn("טעינה מוקדמת של נכסים נכשלה:", err);
          setDebugInfo(prev => ({ ...prev, assetsPreloadError: err.message }));
          // ממשיכים למרות השגיאה כדי לאפשר למשחק לפעול
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error processing game data:", error);
      LoggerService.error('Error processing game data:', error);
      setError('שגיאה בעיבוד נתוני המשחק');
      setDebugInfo(prev => ({ ...prev, processingError: error.message }));
      setLoading(false);
    }
  }, [gameId]);
  
  // טיפול בשינוי שלב נוכחי
  useEffect(() => {
    if (currentStage?.background && gameId) {
      const bgPath = AssetManager.getAssetPath(gameId, currentStage.background, 'backgrounds');
      console.log("Checking background:", bgPath);
      
      // בדיקה אם הרקע קיים
      fetch(bgPath, { method: 'HEAD' })
        .then(response => {
          console.log("Background check response:", response.status);
          if (response.ok) {
            setBackgroundPath(bgPath);
          } else {
            // אם הרקע לא נמצא, שימוש ברקע ברירת מחדל
            LoggerService.warn(`Background not found: ${bgPath}, using default`);
            const defaultBg = AssetManager.getAssetPath(gameId, 'scroll_background.jpg', 'backgrounds');
            console.log("Using default background instead:", defaultBg);
            setBackgroundPath(defaultBg);
          }
        })
        .catch((err) => {
          // במקרה של שגיאת רשת, שימוש ברקע ברירת מחדל
          console.error("Background check failed:", err);
          LoggerService.warn(`Failed to check background: ${bgPath}, using default`);
          const defaultBg = AssetManager.getAssetPath(gameId, 'scroll_background.jpg', 'backgrounds');
          setBackgroundPath(defaultBg);
        });
    }
  }, [currentStage, gameId]);
  
  // טיפול בהשלמת שלב
  const handleStageComplete = useCallback((stageId, score) => {
    LoggerService.info(`Stage ${stageId} completed with score: ${score}`);
    
    // עדכון רשימת השלבים שהושלמו
    setCompletedStages(prev => {
      if (prev.includes(stageId)) {
        return prev;
      }
      return [...prev, stageId];
    });
    
    // מעבר לשלב הבא
    setGameData(prevData => {
      if (prevData && prevData.content.stages) {
        const currentIndex = prevData.content.stages.findIndex(s => s.id === stageId);
        
        if (currentIndex >= 0 && currentIndex < prevData.content.stages.length - 1) {
          // עדכון השלב הנוכחי
          const nextStage = prevData.content.stages[currentIndex + 1];
          setCurrentStage(nextStage);
          return prevData;
        } else {
          // סיום המשחק
          handleGameComplete(score);
          return prevData;
        }
      }
      return prevData;
    });
  }, [handleGameComplete]);
  
  // רנדור רכיב המשחק לפי סוג - עם useMemo למניעת רינדורים מיותרים
  const gameModuleComponent = useMemo(() => {
    if (!currentStage) return null;
    
    console.log("Rendering game module for stage type:", currentStage.type);
    
    switch (currentStage.type) {
      case 'multi_choice':
        return (
          <MultiChoiceGame
            questions={currentStage.questions}
            title={currentStage.title}
            onComplete={(score) => handleStageComplete(currentStage.id, score)}
            basePoints={currentStage.basePoints || 10}
            sourceReference={currentStage.sourceReference}
            learningPopup={currentStage.learningPopup}
          />
        );
      case 'drag_drop':
        return (
          <DragDropGame
            items={currentStage.items}
            dropZones={currentStage.dropZones}
            title={currentStage.title}
            onComplete={(score) => handleStageComplete(currentStage.id, score)}
            basePoints={currentStage.basePoints || 15}
            sourceReference={currentStage.sourceReference}
            learningPopup={currentStage.learningPopup}
          />
        );
      case 'matching':
        return (
          <MatchingGame
            pairs={currentStage.pairs}
            title={currentStage.title}
            onComplete={(score) => handleStageComplete(currentStage.id, score)}
            basePoints={currentStage.basePoints || 15}
            sourceReference={currentStage.sourceReference}
            learningPopup={currentStage.learningPopup}
          />
        );
      case 'multi_stage':
        // טיפול במשחק מרובה-שלבים
        const currentChallenge = currentStage.challenges?.[0];
        console.log("multi_stage challenges:", currentStage.challenges);
        
        if (!currentChallenge) {
          console.error("No challenges found for multi_stage!");
          return <div>שגיאה: לא נמצאו אתגרים בשלב זה</div>;
        }

        // החזרת הרכיב המתאים לסוג האתגר
        switch (currentChallenge.type) {
          case 'multi_choice':
            return (
              <MultiChoiceGame
                questions={currentChallenge.questions}
                title={currentChallenge.title}
                onComplete={(score) => handleStageComplete(currentStage.id, score)}
                basePoints={currentChallenge.basePoints || 10}
                sourceReference={currentChallenge.sourceReference}
                learningPopup={currentStage.learningPopup}
              />
            );
          case 'drag_drop':
            return (
              <DragDropGame
                items={currentChallenge.items}
                dropZones={currentChallenge.dropZones}
                title={currentChallenge.title}
                onComplete={(score) => handleStageComplete(currentStage.id, score)}
                basePoints={currentChallenge.basePoints || 15}
                sourceReference={currentChallenge.sourceReference}
                learningPopup={currentStage.learningPopup}
              />
            );
          case 'matching':
            return (
              <MatchingGame
                pairs={currentChallenge.pairs}
                title={currentChallenge.title}
                onComplete={(score) => handleStageComplete(currentStage.id, score)}
                basePoints={currentChallenge.basePoints || 15}
                sourceReference={currentChallenge.sourceReference}
                learningPopup={currentStage.learningPopup}
              />
            );
          default:
            return <div>סוג אתגר לא נתמך: {currentChallenge.type}</div>;
        }
      
      case 'story_intro':
      case 'story_conclusion':
        return (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">{currentStage.title}</h2>
            <p className="mb-4">{currentStage.description}</p>
            <Button 
              variant="primary" 
              className="mt-4"
              onClick={() => handleStageComplete(currentStage.id, 100)}
            >
              המשך ➔
            </Button>
          </div>
        );
      
      default:
        return <div>סוג משחק לא נתמך: {currentStage.type}</div>;
    }
  }, [currentStage, handleStageComplete]);
  
  // רנדור רקע דינמי
  const getBackgroundStyle = useCallback(() => {
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
  }, [backgroundPath]);
  
  // מיפוי שלבים למפת מסע
  const stagesForJourneyMap = useMemo(() => {
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
  }, [gameData]);
  
  // ניסיון נוסף במקרה של תקיעה
  const handleRetryLoading = () => {
    // איפוס מצב הטעינה
    setLoading(true);
    setLoadingTimeout(false);
    setError(null);
    
    // ניסיון לטעון את המשחק מחדש
    window.location.reload();
  };
  
  // טיפול בשגיאות תמונה
  const handleImageError = useCallback((e) => {
    if (!e || !e.target) return;
    
    console.log("Image load error:", e.target.src);
    
    // מניעת לולאות אינסופיות
    e.target.onerror = null;
    
    // שימוש בתמונת ברירת מחדל
    e.target.src = '/assets/shared/placeholders/image_placeholder.svg';
    
    LoggerService.warn(`Failed to load image: ${e.target.src}, using default placeholder`);
  }, []);
  
  // בחירת נושא לפי משחק
  const getTheme = useCallback(() => {
    if (gameData?.theme) {
      return gameData.theme;
    }
    
    // ברירת מחדל לפי מזהה המשחק
    return gameId || 'base';
  }, [gameData, gameId]);
  
  return (
    <ThemeProvider theme={getTheme()}>
      <div
        className="min-h-screen flex flex-col"
        style={getBackgroundStyle()}
      >
        {error ? (
          <GlassCard className="mx-auto mt-16 p-8 max-w-lg text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">שגיאה</h2>
            <p className="mb-6">{error}</p>
            <Button
              onClick={() => navigate('/')}
              variant="secondary"
              className="mb-4"
            >
              חזרה לדף הבית
            </Button>
            
            <Button 
              onClick={handleRetryLoading}
              variant="primary"
            >
              נסה שוב
            </Button>
          </GlassCard>
        ) : loading || !gameData ? (
          <div className="flex h-screen items-center justify-center">
            <GlassCard className="p-10 text-center">
              <LoadingIndicator 
                type="spinner" 
                size="large" 
                color="accent" 
                text="טוען משחק..." 
              />
              
              {loadingTimeout && (
                <div className="mt-6">
                  <p className="text-amber-600 mb-4">הטעינה לוקחת זמן רב מהצפוי.</p>
                  <Button 
                    onClick={handleRetryLoading}
                    variant="primary"
                  >
                    נסה שוב
                  </Button>
                </div>
              )}
            </GlassCard>
          </div>
        ) : (
          // חלק משחק פעיל
          <GameEngine
            gameId={gameId}
            onGameLoad={handleGameLoad}
            onError={handleLoadError}
          >
            <PageContainer className="flex flex-col min-h-screen">
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
              
              {gameData.content?.stages && stagesForJourneyMap.length > 0 && (
                <div className="container mx-auto my-4 px-4">
                  <JourneyMap 
                    stages={stagesForJourneyMap}
                    currentStage={currentStage?.id}
                    completedStages={completedStages}
                    onStageClick={(stageId) => {
                      // מעבר לשלב רק אם כבר הושלם
                      if (completedStages.includes(stageId)) {
                        const allStages = [
                          ...(gameData.content.stages || []),
                          gameData.content.intro,
                          gameData.content.outro
                        ].filter(Boolean);
                        
                        const stage = allStages.find(s => s?.id === stageId);
                        
                        if (stage) {
                          setCurrentStage(stage);
                        }
                      }
                    }}
                  />
                </div>
              )}
              
              <main className="container mx-auto p-4 pt-6 flex-grow">
                <GameContainer>
                  {currentStage && (
                    <>
                      <StageHeading className="mb-6">
                        {currentStage.title}
                      </StageHeading>
                      
                      {currentStage.description && (
                        <p className="mb-6 text-gray-700">{currentStage.description}</p>
                      )}
                      
                      {/* הצגת דמות מדברת אם יש */}
                      {currentStage.character && currentStage.introDialogue && (
                        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                          {currentStage.introDialogue.map((dialogue, index) => (
                            <div key={index} className="mb-3 last:mb-0">
                              <strong className="text-amber-800">{dialogue.character}: </strong>
                              <span>{dialogue.text}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* רכיב המשחק הדינמי */}
                      {gameModuleComponent}
                    </>
                  )}
                </GameContainer>
              </main>
              
              <footer className="bg-black bg-opacity-50 p-4 text-center text-blue-300 text-sm border-t border-white/10">
                &copy; {gameData.name} - משחק אינטראקטיבי
              </footer>
            </PageContainer>
          </GameEngine>
        )}
        
        {/* פאנל דיבוג */}
        {process.env.NODE_ENV !== "production" && (
          <div className="fixed bottom-4 left-4 bg-white bg-opacity-90 p-3 rounded shadow-md text-xs z-50 max-w-sm">
            <details>
              <summary className="font-bold cursor-pointer mb-1">DEBUG INFO (GamePage)</summary>
              <div className="space-y-1">
                <div>Game ID: {gameId || "none"}</div>
                <div>Loading: {loading ? "yes" : "no"}</div>
                <div>Timeout: {loadingTimeout ? "yes" : "no"}</div>
                <div>Error: {error || "none"}</div>
                <div>Current Stage: {currentStage?.id || "none"}</div>
                <div>Background: {backgroundPath || "none"}</div>
                <div className="overflow-auto max-h-32">
                  <pre className="text-xs">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </div>
              </div>
            </details>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}

// הוספת ייצוא ברירת מחדל כדי שיתאים ל-import ב-App.jsx
export default GamePage;