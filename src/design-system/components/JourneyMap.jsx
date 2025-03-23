import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../hooks/useTheme';

/**
 * רכיב מפת מסע להצגת התקדמות בשלבי המשחק
 */
export const JourneyMap = ({
  stages = [],
  currentStage = '',
  completedStages = [],
  onStageClick,
  className = '',
  ...props
}) => {
  const theme = useTheme() || {};
  
  if (!stages.length) return null;
  
  return (
    <div className={`bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-lg p-4 shadow ${className}`} {...props}>
      <h3 className="text-lg font-bold mb-4 text-gray-800 text-center">מפת המסע</h3>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 relative">
        {/* קו מקשר */}
        <div className="hidden md:block absolute top-1/2 left-4 right-4 h-1 bg-gray-300 -z-10"></div>
        
        {stages.map((stage, index) => {
          const isCompleted = completedStages.includes(stage.id);
          const isCurrent = stage.id === currentStage;
          const canClick = isCompleted || isCurrent;
          
          // קביעת צבעים לפי סטטוס
          let bgColor = 'bg-gray-200';
          let textColor = 'text-gray-500';
          let borderColor = 'border-gray-400';
          
          if (isCompleted) {
            bgColor = 'bg-green-100';
            textColor = 'text-green-800';
            borderColor = 'border-green-500';
          } else if (isCurrent) {
            bgColor = 'bg-blue-100';
            textColor = 'text-blue-800';
            borderColor = 'border-blue-500';
          }
          
          return (
            <div 
              key={stage.id} 
              className={`relative flex flex-col items-center group ${canClick ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              onClick={canClick ? () => onStageClick?.(stage.id) : undefined}
            >
              {/* עיגול מספר */}
              <div 
                className={`w-10 h-10 rounded-full ${bgColor} ${textColor} border-2 ${borderColor} flex items-center justify-center mb-2`}
              >
                {index + 1}
              </div>
              
              {/* שם השלב */}
              <div className={`text-sm ${textColor} font-medium`}>
                {stage.shortName || stage.name}
              </div>
              
              {/* פופאפ בהרחפה */}
              {canClick && (
                <div className="absolute bottom-full mb-2 w-max max-w-xs p-2 bg-white shadow-lg rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                  {stage.name}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

JourneyMap.propTypes = {
  /**
   * רשימת שלבים להצגה
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
   * רשימת שלבים שהושלמו
   */
  completedStages: PropTypes.arrayOf(PropTypes.string),
  /**
   * פונקציה לטיפול בלחיצה על שלב
   */
  onStageClick: PropTypes.func,
  /**
   * className נוסף
   */
  className: PropTypes.string
};

export default JourneyMap;