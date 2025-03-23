import React from 'react';
import PropTypes from 'prop-types';

/**
 * מפת מסע המציגה את התקדמות המשתמש בשלבי המשחק
 */
export const JourneyMap = ({
  stages = [],
  currentStage = null,
  completedStages = [],
  onStageClick = () => {},
  className = '',
  ...props
}) => {
  // בדיקה אם השלב הושלם
  const isStageCompleted = (stageId) => {
    return completedStages.includes(stageId);
  };
  
  // בדיקה אם השלב נוכחי
  const isCurrentStage = (stageId) => {
    return stageId === currentStage;
  };
  
  // בדיקה אם השלב נעול
  const isLockedStage = (stageId, index) => {
    // השלב הראשון תמיד פתוח
    if (index === 0) return false;
    
    // אם השלב הנוכחי או הושלם, הוא פתוח
    if (isCurrentStage(stageId) || isStageCompleted(stageId)) return false;
    
    // אם השלב הקודם הושלם, השלב הנוכחי פתוח
    const previousStageId = stages[index - 1]?.id;
    if (previousStageId && isStageCompleted(previousStageId)) return false;
    
    // אחרת, השלב נעול
    return true;
  };
  
  // אם אין שלבים, לא מציגים כלום
  if (stages.length === 0) {
    return null;
  }
  
  return (
    <div className={`bg-black/20 backdrop-blur-sm rounded-xl p-4 ${className}`} {...props}>
      <div className="flex flex-wrap justify-between items-center space-x-1 space-x-reverse">
        {stages.map((stage, index) => {
          const isCompleted = isStageCompleted(stage.id);
          const isCurrent = isCurrentStage(stage.id);
          const isLocked = isLockedStage(stage.id, index);
          
          // קביעת סגנון לפי מצב השלב
          const stageClasses = `
            flex flex-col items-center py-2 px-3 rounded-lg transition-all
            ${isCompleted ? 'text-green-100 hover:bg-green-800/40 cursor-pointer' : ''}
            ${isCurrent ? 'text-amber-100 bg-amber-700/50 font-bold' : ''}
            ${isLocked ? 'text-gray-400 opacity-50 cursor-not-allowed' : ''}
            ${!isCompleted && !isCurrent && !isLocked ? 'text-blue-100 hover:bg-blue-800/40 cursor-pointer' : ''}
          `.trim();
          
          return (
            <React.Fragment key={stage.id}>
              {/* שלב במפה */}
              <div
                className={stageClasses}
                onClick={() => !isLocked && onStageClick(stage.id)}
                title={isLocked ? 'השלב נעול' : stage.name}
              >
                {/* מספר שלב */}
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center mb-1
                  ${isCompleted ? 'bg-green-700' : isCurrent ? 'bg-amber-600' : isLocked ? 'bg-gray-700' : 'bg-blue-700'}
                `}>
                  {isCompleted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                
                {/* שם שלב */}
                <span className="text-sm whitespace-nowrap">{stage.shortName || stage.name}</span>
              </div>
              
              {/* קו מחבר בין שלבים */}
              {index < stages.length - 1 && (
                <div className={`
                  hidden md:block h-0.5 flex-grow mx-1
                  ${isCompleted ? 'bg-green-500' : 'bg-gray-600'}
                `} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

JourneyMap.propTypes = {
  /**
   * רשימת השלבים במשחק
   */
  stages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      shortName: PropTypes.string
    })
  ),
  /**
   * מזהה השלב הנוכחי
   */
  currentStage: PropTypes.string,
  /**
   * רשימת מזהי שלבים שהושלמו
   */
  completedStages: PropTypes.arrayOf(PropTypes.string),
  /**
   * פונקציה המופעלת בלחיצה על שלב
   */
  onStageClick: PropTypes.func,
  /**
   * className נוסף
   */
  className: PropTypes.string
};

export default JourneyMap;