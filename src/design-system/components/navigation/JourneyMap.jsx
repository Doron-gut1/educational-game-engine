import React from 'react';

/**
 * רכיב מפת מסע - מציג את שלבי המשחק עם חיווי על ההתקדמות
 * 
 * @param {Object} props
 * @param {Array} props.stages - רשימת השלבים במסע
 * @param {string} props.currentStage - מזהה השלב הנוכחי
 * @param {Array} props.completedStages - מזהי השלבים שהושלמו
 * @param {Function} props.onStageClick - פונקציה שתופעל בלחיצה על שלב
 * @param {string} props.className - מחלקות CSS נוספות
 */
export default function JourneyMap({ 
  stages = [], 
  currentStage = null, 
  completedStages = [],
  onStageClick = () => {},
  className = '', 
  ...props 
}) {
  if (!stages || stages.length === 0) {
    return null;
  }
  
  return (
    <div className={`bg-white bg-opacity-85 border border-amber-200 p-4 rounded-lg shadow-lg ${className}`} {...props}>
      <h3 className="text-center font-bold text-amber-800 mb-4">מסע הלמידה</h3>
      
      <div className="flex overflow-x-auto pb-2">
        <div className="flex space-x-2 rtl:space-x-reverse min-w-full">
          {stages.map((stage, index) => {
            const isActive = stage.id === currentStage;
            const isCompleted = completedStages.includes(stage.id);
            const canClick = isCompleted || isActive;
            
            let stageClass = "flex flex-col items-center space-y-2 p-2 min-w-[80px] transition-all duration-300 ";
            
            if (isActive) {
              stageClass += "text-blue-700 font-bold scale-110 ";
            } else if (isCompleted) {
              stageClass += "text-green-600 ";
            } else {
              stageClass += "text-gray-400 ";
            }
            
            if (canClick) {
              stageClass += "cursor-pointer hover:bg-amber-50 hover:scale-105 rounded-lg ";
            } else {
              stageClass += "opacity-50 ";
            }
            
            return (
              <div 
                key={stage.id}
                className={stageClass}
                onClick={() => canClick && onStageClick(stage.id)}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-white 
                  ${isActive ? 'bg-blue-600 ring-4 ring-blue-200' : 
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}>
                  {isCompleted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : index + 1}
                </div>
                <span className="text-xs text-center font-medium">
                  {stage.shortName || stage.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* קו עם חיצים המחבר בין השלבים */}
      <div className="relative h-0.5 bg-gray-200 -mt-10 mx-4">
        <div 
          className="absolute top-0 h-0.5 bg-gradient-to-r from-green-500 to-blue-500" 
          style={{
            width: `${calculateCompletionWidth(stages, completedStages, currentStage)}%`,
            transition: 'width 0.5s ease-in-out'
          }}
        />
      </div>
    </div>
  );
}

// פונקציית עזר לחישוב אחוז ההתקדמות
function calculateCompletionWidth(stages, completedStages, currentStage) {
  if (!stages || stages.length === 0) return 0;
  
  const totalStages = stages.length;
  let completedWidth = (completedStages.length / totalStages) * 100;
  
  // אם יש שלב פעיל שאינו מושלם, נוסיף חצי ממשקל השלב
  if (currentStage && !completedStages.includes(currentStage)) {
    const stageIndex = stages.findIndex(s => s.id === currentStage);
    if (stageIndex !== -1) {
      const stageWeight = 100 / totalStages;
      completedWidth += stageWeight * 0.5;
    }
  }
  
  return Math.min(completedWidth, 100); // מקסימום 100%
}
