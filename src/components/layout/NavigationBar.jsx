import React from 'react';
import { useGameProgress } from '../../hooks/useGameProgress';
import { Button } from '../ui/Button';

/**
 * סרגל ניווט בין שלבי המשחק
 * @param {Object} props - פרופס הרכיב
 * @param {Function} props.onReset - פונקציה שתופעל בעת איפוס המשחק
 * @param {boolean} props.showAllStages - האם להציג את כל השלבים (גם אלו שלא הושלמו)
 * @param {boolean} props.allowSkipping - האם לאפשר דילוג לשלבים
 */
export function NavigationBar({ 
  onReset, 
  showAllStages = false,
  allowSkipping = false,
  className
}) {
  const { 
    currentStage, 
    completedStages, 
    moveToStage, 
    isStageCompleted, 
    gameConfig 
  } = useGameProgress();

  // נושא מספר בעיה: אם gameConfig.stages לא קיים
  if (!gameConfig?.stages) {
    return null;
  }

  // מפה בין מזהה שלב למידע עליו
  const stagesMap = gameConfig.stages.reduce((acc, stage) => {
    acc[stage.id] = stage;
    return acc;
  }, {});

  // פונקציה למעבר לשלב
  const handleStageSelect = (stageId) => {
    // בדיקה אם מותר לדלג או אם השלב הושלם
    const isCompleted = isStageCompleted(stageId);
    if (allowSkipping || isCompleted) {
      moveToStage(stageId);
    }
  };

  // פונקציה לאיפוס המשחק
  const handleReset = () => {
    if (window.confirm('האם אתה בטוח שברצונך להתחיל מחדש? כל ההתקדמות תימחק')) {
      if (onReset) onReset();
    }
  };

  return (
    <div className={`bg-white shadow-md p-4 sticky top-0 z-40 ${className || ''}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          {/* כפתורי ניווט לשלבים */}
          <div className="flex flex-wrap gap-2">
            {gameConfig.stages.map((stage) => {
              // בודק אם השלב הושלם
              const isCompleted = completedStages.includes(stage.id);
              // בודק אם השלב נוכחי
              const isCurrent = currentStage === stage.id;
              // בודק אם להציג את השלב
              const shouldShow = showAllStages || isCompleted || isCurrent;
              
              if (!shouldShow) return null;

              return (
                <Button
                  key={stage.id}
                  onClick={() => handleStageSelect(stage.id)}
                  variant={isCurrent ? 'primary' : isCompleted ? 'outline' : 'secondary'}
                  size="small"
                  disabled={!allowSkipping && !isCompleted && !isCurrent}
                >
                  {stage.title || `שלב ${stage.id}`}
                  {isCompleted && ' ✓'}
                </Button>
              );
            })}
          </div>

          {/* כפתור איפוס */}
          {onReset && (
            <Button
              onClick={handleReset}
              variant="text"
              size="small"
              className="text-red-600 hover:bg-red-50"
            >
              התחל מחדש
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}