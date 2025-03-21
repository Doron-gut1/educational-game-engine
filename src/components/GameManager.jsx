import React, { useState, useEffect } from 'react';
import { useGameContext } from '../contexts/GameContext';
import { useGameProgress } from '../hooks/useGameProgress';
import { ProgressBar } from './ui/ProgressBar';
import { TemplateManager } from '../core/engine/TemplateManager';
import { IntroCard } from './layout/IntroCard';
import { LoggerService } from '../services';

// ייבוא מערכת העיצוב החדשה
import { Button, ScrollCard as Card } from '../design-system/components';

// מודולי משחק
import { MultiChoiceGame } from '../modules/multiChoice/MultiChoiceGame';
import { DragDropGame } from '../modules/dragAndDrop/DragDropGame';
import { MatchingGame } from '../modules/matching/MatchingGame';
import { FillInBlanksGame } from '../modules/fillInBlanks/FillInBlanksGame';
import { WordSearchGame } from '../modules/wordSearch/WordSearchGame';
import { SortingGame } from '../modules/sorting/SortingGame';

/**
 * מנהל המשחק - רכיב האחראי על תזמון שלבי המשחק והתקדמות
 * @param {Object} props - פרופס הרכיב
 * @param {string} props.templateId - מזהה תבנית המשחק
 * @param {Function} props.onComplete - קולבק בסיום המשחק
 */
export function GameManager({ 
  templateId = "quest_journey",
  onComplete,
  onReset
}) {
  // שימוש ב-state, stateManager ו-stageController החדשים
  const { 
    state, 
    gameConfig, 
    moveToStage, 
    completeStage,
    addScore
  } = useGameContext();
  
  const { currentStage, completedStages, progress, moveToNextStage } = useGameProgress();
  
  const [template, setTemplate] = useState(null);
  const [isIntro, setIsIntro] = useState(true);
  const [isOutro, setIsOutro] = useState(false);
  const [currentStageData, setCurrentStageData] = useState(null);
  const [error, setError] = useState(null);
  const [templateManager] = useState(() => new TemplateManager());
  const [stageMoveFlag, setStageMoveFlag] = useState(false);
  
  // טעינת תבנית המשחק
  useEffect(() => {
    async function loadTemplate() {
      try {
        const loadedTemplate = await templateManager.loadTemplate(templateId);
        setTemplate(loadedTemplate);
        setError(null);
        LoggerService.info(`[GameManager] Template ${templateId} loaded successfully`);
      } catch (error) {
        LoggerService.error("[GameManager] Error loading template:", error);
        setError(`שגיאה בטעינת תבנית המשחק: ${error.message}`);
      }
    }

    loadTemplate();
  }, [templateId, templateManager]);

  // עדכון שלב נוכחי כאשר משתנה
  useEffect(() => {
    if (!gameConfig?.content?.stages || !currentStage) {
      return;
    }

    LoggerService.debug(`[GameManager] Current stage changed to: ${currentStage}`);

    // בדיקה אם מדובר בשלב מבוא
    if (currentStage === 'intro') {
      setIsIntro(true);
      setIsOutro(false);
      setCurrentStageData(gameConfig.content.intro);
      return;
    }

    // בדיקה אם מדובר בשלב סיום
    if (currentStage === 'outro') {
      setIsIntro(false);
      setIsOutro(true);
      setCurrentStageData(gameConfig.content.outro);
      return;
    }

    // מציאת נתוני השלב הנוכחי
    setIsIntro(false);
    setIsOutro(false);
    const stageData = gameConfig.content.stages.find(stage => stage.id === currentStage);
    
    if (stageData) {
      setCurrentStageData(stageData);
    } else {
      LoggerService.warn(`[GameManager] No data found for stage: ${currentStage}`);
      setError(`לא נמצאו נתונים לשלב: ${currentStage}`);
    }
  }, [currentStage, gameConfig]);

  // טיפול בסיום שלב
  const handleStageComplete = (points) => {
    // מניעת קריאות כפולות
    if (stageMoveFlag) {
      LoggerService.debug("[GameManager] Stage transition already in progress, ignoring completion request");
      return;
    }
    
    // מגדירים דגל שמונע קריאות כפולות
    setStageMoveFlag(true);
    
    // הוספת ניקוד אם יש
    if (points > 0) {
      LoggerService.info(`[GameManager] Adding ${points} points to score`);
      addScore(points);
    }
    
    // אם זהו שלב המבוא, עוברים לשלב הראשון
    if (isIntro) {
      if (gameConfig?.content?.stages?.length > 0) {
        const firstStage = gameConfig.content.stages[0].id;
        LoggerService.info(`[GameManager] Moving from intro to first stage: ${firstStage}`);
        moveToStage(firstStage);
      } else {
        LoggerService.warn("[GameManager] No stages found after intro");
      }
      
      // איפוס הדגל לאחר זמן קצר
      setTimeout(() => {
        setStageMoveFlag(false);
      }, 500);
      return;
    }

    // אם זהו שלב הסיום, מסיימים את המשחק
    if (isOutro) {
      if (onComplete) {
        LoggerService.info(`[GameManager] Game completed with score: ${state.score}`);
        onComplete(state.score);
      }
      
      // איפוס הדגל לאחר זמן קצר
      setTimeout(() => {
        setStageMoveFlag(false);
      }, 500);
      return;
    }

    // סימון השלב הנוכחי כמושלם
    if (currentStage) {
      LoggerService.info(`[GameManager] Completing stage: ${currentStage}`);
      completeStage(currentStage, 0); // ניקוד כבר נוסף קודם לכן
    }
    
    // קידום לשלב הבא
    const hasNextStage = moveToNextStage();
    LoggerService.debug(`[GameManager] Has next stage: ${hasNextStage}`);
    
    // אם אין שלב נוסף, עוברים לסיום
    if (!hasNextStage && gameConfig?.content?.outro) {
      LoggerService.info("[GameManager] No more stages, moving to outro");
      moveToStage('outro');
    }
    
    // איפוס הדגל לאחר זמן קצר
    setTimeout(() => {
      setStageMoveFlag(false);
    }, 500);
  };

  // אם יש שגיאה, מציגים אותה
  if (error) {
    return (
      <Card variant="primary" className="p-6 text-center">
        <div className="text-red-500 text-xl font-bold mb-4">שגיאה</div>
        <p className="mb-4">{error}</p>
        {onReset && (
          <Button 
            onClick={onReset} 
            variant="outline" 
            className="mr-2"
          >
            נסה שוב
          </Button>
        )}
      </Card>
    );
  }

  // אם אין תבנית או תוכן, מציגים מסך טעינה
  if (!template || !gameConfig?.content) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="w-12 h-12 border-t-4 border-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p>טוען משחק...</p>
          <p className="text-sm text-gray-500 mt-2">
            {!template ? "טוען תבנית..." : ""}
            {!gameConfig?.content ? "טוען תוכן..." : ""}
          </p>
        </div>
      </div>
    );
  }

  // הצגת מסך מבוא משופר
  if (isIntro) {
    const introData = gameConfig.content.intro;
    
    return (
      <IntroCard 
        introData={introData}
        onStart={() => handleStageComplete(0)}
        characters={gameConfig.characters}
        isLoading={stageMoveFlag}
      />
    );
  }

  // הצגת מסך סיום
  if (isOutro) {
    const outroData = gameConfig.content.outro;
    
    if (!outroData) {
      return (
        <Card variant="primary" className="p-6 text-center">
          <p className="mb-4">נתוני שלב הסיום חסרים</p>
          <Button onClick={() => handleStageComplete(0)}>
            סיים את המשחק
          </Button>
        </Card>
      );
    }
    
    return (
      <Card className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">{outroData.title}</h1>
        {outroData.dialogue && (
          <div className="mb-8 space-y-4">
            {outroData.dialogue.map((line, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-lg">
                  {line.character && (
                    <span className="font-bold mr-2">{line.character}:</span>
                  )}
                  {line.text}
                </p>
              </div>
            ))}
          </div>
        )}
        {outroData.rewards && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">הפרסים שלך:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {outroData.rewards.map((reward, index) => (
                <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="font-bold text-lg">{reward.name}</h3>
                  <p>{reward.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-center space-x-4 rtl:space-x-reverse">
          {outroData.actionButton && (
            <Button 
              onClick={() => handleStageComplete(0)} 
              size="large"
              disabled={stageMoveFlag}
            >
              {outroData.actionButton.text}
            </Button>
          )}
          {onReset && (
            <Button 
              onClick={onReset} 
              variant="outline" 
              size="large"
            >
              שחק שוב
            </Button>
          )}
        </div>
      </Card>
    );
  }

  // הצגת שלב נוכחי
  if (!currentStageData) {
    return (
      <Card variant="primary" className="text-center p-6">
        <p className="text-red-500 font-bold mb-4">שלב לא נמצא</p>
        <p className="text-gray-700 mb-4">לא נמצאו נתונים לשלב הנוכחי: {currentStage}</p>
        {onReset && (
          <Button 
            onClick={onReset} 
            variant="outline"
          >
            התחל מחדש
          </Button>
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* פרטי השלב ופס התקדמות */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">{currentStageData.title}</h2>
          <div className="text-sm text-gray-500">
            שלב {completedStages.length + 1} מתוך {gameConfig.content.stages.length}
          </div>
        </div>
        <ProgressBar 
          value={progress} 
          max={100}
        />
      </div>
      
      {/* תיאור השלב */}
      {currentStageData.description && (
        <p className="text-gray-600 mb-4">{currentStageData.description}</p>
      )}
      
      {/* דיאלוג פתיחה אם יש */}
      {currentStageData.introDialogue && (
        <div className="mb-6 space-y-3 bg-blue-50 p-4 rounded-lg">
          {currentStageData.introDialogue.map((line, index) => (
            <div key={index} className="p-3 bg-white rounded-lg">
              <p>
                {line.character && (
                  <span className="font-bold mr-2">{line.character}:</span>
                )}
                {line.text}
              </p>
            </div>
          ))}
        </div>
      )}
      
      {/* תוכן השלב לפי סוג */}
      <Card className="p-4">
        {renderStageContent(currentStageData, handleStageComplete)}
      </Card>
    </div>
  );
}

/**
 * פונקציה לרינדור תוכן השלב לפי סוג
 * @param {Object} stageData - נתוני השלב
 * @param {Function} onComplete - קולבק בסיום השלב
 */
function renderStageContent(stageData, onComplete) {
  try {
    switch (stageData.type) {
      case 'multi_choice':
        return (
          <MultiChoiceGame 
            questions={stageData.questions || []}
            title={stageData.title}
            sourceReference={stageData.sourceReference}
            learningPopup={stageData.learningPopup}
            onComplete={onComplete}
          />
        );
      
      case 'drag_drop':
        return (
          <DragDropGame 
            items={stageData.items || []}
            dropZones={stageData.dropZones || []}
            title={stageData.title}
            sourceReference={stageData.sourceReference}
            learningPopup={stageData.learningPopup}
            onComplete={onComplete}
          />
        );
      
      case 'matching':
        return (
          <MatchingGame 
            pairs={stageData.pairs || []}
            title={stageData.title}
            instructions={stageData.description}
            shuffleItems={stageData.shuffleItems !== false}
            sourceReference={stageData.sourceReference}
            learningPopup={stageData.learningPopup}
            onComplete={onComplete}
          />
        );
        
      case 'fill_in_blanks':
        return (
          <FillInBlanksGame 
            text={stageData.text || ""}
            blanks={stageData.blanks || {}}
            wordBank={stageData.wordBank || []}
            showWordBank={stageData.showWordBank !== false}
            title={stageData.title}
            sourceReference={stageData.sourceReference}
            learningPopup={stageData.learningPopup}
            onComplete={onComplete}
          />
        );
        
      case 'word_search':
        return (
          <WordSearchGame 
            grid={stageData.grid || []}
            words={stageData.words || []}
            title={stageData.title}
            timeLimit={stageData.timeLimit || 0}
            sourceReference={stageData.sourceReference}
            learningPopup={stageData.learningPopup}
            onComplete={onComplete}
          />
        );
        
      case 'sorting':
        return (
          <SortingGame 
            items={stageData.items || []}
            sortType={stageData.sortType || "chronological"}
            title={stageData.title}
            sourceReference={stageData.sourceReference}
            learningPopup={stageData.learningPopup}
            onComplete={onComplete}
          />
        );
        
      case 'multi_stage':
        // מטפל בשלבים מורכבים המכילים מספר אתגרים
        if (stageData.challenges && stageData.challenges.length > 0) {
          const firstChallenge = stageData.challenges[0];
          return renderStageContent(firstChallenge, onComplete);
        }
        return (
          <div className="text-center p-6 bg-amber-50 rounded-lg">
            <p>שלב מרובה אתגרים אך לא הוגדרו אתגרים</p>
            <Button 
              onClick={() => onComplete(0)} 
              className="mt-4"
            >
              המשך לשלב הבא
            </Button>
          </div>
        );
      
      default:
        LoggerService.warn(`[GameManager] Unsupported stage type: ${stageData.type}`);
        return (
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p>סוג שלב לא נתמך: {stageData.type}</p>
            <Button 
              onClick={() => onComplete(0)} 
              className="mt-4"
            >
              המשך לשלב הבא
            </Button>
          </div>
        );
    }
  } catch (error) {
    LoggerService.error("[GameManager] Error rendering stage:", error);
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg">
        <p className="text-red-500 font-bold mb-4">שגיאה בהצגת השלב</p>
        <p className="mb-4">{error.toString()}</p>
        <Button 
          onClick={() => onComplete(0)} 
          className="mt-4"
        >
          המשך לשלב הבא
        </Button>
      </div>
    );
  }
}