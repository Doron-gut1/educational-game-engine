import React, { useState, useEffect } from 'react';
import { useGameContext } from '../contexts/GameContext';
import { useGameProgress } from '../hooks/useGameProgress';
import { Button } from './ui/Button';
import { ProgressBar } from './ui/ProgressBar';
import { TemplateManager } from '../core/engine/TemplateManager';

// מודולי משחק
import { MultiChoiceGame } from '../modules/multiChoice/MultiChoiceGame';
import { DragDropGame } from '../modules/dragAndDrop/DragDropGame';

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
  const { gameState, state, gameConfig } = useGameContext();
  const { currentStage, completedStages, progress, moveToNextStage } = useGameProgress();
  
  const [template, setTemplate] = useState(null);
  const [isIntro, setIsIntro] = useState(true);
  const [isOutro, setIsOutro] = useState(false);
  const [currentStageData, setCurrentStageData] = useState(null);

  // טעינת תבנית המשחק
  useEffect(() => {
    async function loadTemplate() {
      try {
        const loadedTemplate = await TemplateManager.loadTemplate(templateId);
        setTemplate(loadedTemplate);
      } catch (error) {
        console.error("Failed to load template:", error);
      }
    }

    loadTemplate();
  }, [templateId]);

  // עדכון שלב נוכחי כאשר משתנה
  useEffect(() => {
    if (!gameConfig?.content?.stages || !currentStage) {
      return;
    }

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
    setCurrentStageData(stageData);
  }, [currentStage, gameConfig]);

  // טיפול בסיום שלב
  const handleStageComplete = (points) => {
    // אם זהו שלב המבוא, עוברים לשלב הראשון
    if (isIntro) {
      if (gameConfig?.content?.stages?.length > 0) {
        const firstStage = gameConfig.content.stages[0].id;
        gameState.state.currentStage = firstStage;
        gameState.notifyListeners();
      }
      return;
    }

    // אם זהו שלב הסיום, מסיימים את המשחק
    if (isOutro) {
      if (onComplete) {
        onComplete(state.score);
      }
      return;
    }

    // קידום לשלב הבא
    const hasNextStage = moveToNextStage();
    
    // אם אין שלב נוסף, עוברים לסיום
    if (!hasNextStage && gameConfig?.content?.outro) {
      gameState.state.currentStage = 'outro';
      gameState.notifyListeners();
    }
  };

  // אם אין תבנית או תוכן, מציגים מסך טעינה
  if (!template || !gameConfig?.content) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="w-12 h-12 border-t-4 border-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p>טוען משחק...</p>
        </div>
      </div>
    );
  }

  // הצגת מסך מבוא
  if (isIntro) {
    const introData = gameConfig.content.intro;
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">{introData.title}</h1>
        {introData.dialogue && (
          <div className="mb-8 space-y-4">
            {introData.dialogue.map((line, index) => (
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
        <div className="text-center">
          <Button 
            onClick={() => handleStageComplete(0)} 
            size="large"
          >
            {introData.actionButton?.text || 'התחל במשחק'}
          </Button>
        </div>
      </div>
    );
  }

  // הצגת מסך סיום
  if (isOutro) {
    const outroData = gameConfig.content.outro;
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
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
      </div>
    );
  }

  // הצגת שלב נוכחי
  if (!currentStageData) {
    return (
      <div className="text-center p-6">
        <p className="text-red-500">שלב לא נמצא</p>
      </div>
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
      
      {/* תוכן השלב לפי סוג */}
      {renderStageContent(currentStageData, handleStageComplete)}
    </div>
  );
}

/**
 * פונקציה לרינדור תוכן השלב לפי סוג
 * @param {Object} stageData - נתוני השלב
 * @param {Function} onComplete - קולבק בסיום השלב
 */
function renderStageContent(stageData, onComplete) {
  switch (stageData.type) {
    case 'multi_choice':
      return (
        <MultiChoiceGame 
          questions={stageData.questions || []}
          title={stageData.title}
          onComplete={onComplete}
        />
      );
    
    case 'drag_drop':
      return (
        <DragDropGame 
          items={stageData.items || []}
          dropZones={stageData.dropZones || []}
          title={stageData.title}
          onComplete={onComplete}
        />
      );
    
    // יש להוסיף כאן טיפול בסוגי משחק נוספים...
    
    default:
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
}