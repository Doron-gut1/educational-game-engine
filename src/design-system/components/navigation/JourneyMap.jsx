import React from 'react';
import PropTypes from 'prop-types';
import { StageMarker } from './StageMarker';

/**
 * רכיב מפת מסע - מציג את מסלול ההתקדמות במשחק
 * 
 * @param {Object} props - Props הרכיב
 * @param {Array} props.stages - רשימת השלבים במשחק
 * @param {string} props.currentStage - מזהה השלב הנוכחי
 * @param {Array} props.completedStages - רשימת מזהי שלבים שהושלמו
 * @param {Function} props.onStageClick - פונקציה לטיפול בלחיצה על שלב
 * @param {string} props.layout - פריסת המפה (horizontal, vertical)
 * @param {string} props.size - גודל המפה (small, medium, large)
 * @param {string} props.pathStyle - סגנון הנתיב (solid, dashed, dotted)
 * @param {string} props.theme - ערכת הצבעים (default, primary, secondary, accent)
 * @param {boolean} props.animated - האם להוסיף אנימציות
 * @param {string} props.className - מחלקות CSS נוספות
 */
const JourneyMap = ({ 
  stages = [],
  currentStage = '',
  completedStages = [],
  onStageClick,
  layout = 'horizontal',
  size = 'medium',
  pathStyle = 'solid',
  theme = 'primary',
  animated = true,
  className = '',
  ...rest
}) => {
  // בדיקה האם שלב נגיש
  const isStageAccessible = (stageId, index) => {
    // השלב הנוכחי או שלב שכבר הושלם תמיד נגיש
    if (stageId === currentStage || completedStages.includes(stageId)) {
      return true;
    }
    
    // אם זה השלב הראשון, הוא תמיד נגיש
    if (index === 0) {
      return true;
    }
    
    // אחרת, השלב נגיש רק אם השלב הקודם לו הושלם
    const previousStageId = stages[index - 1]?.id;
    return previousStageId && completedStages.includes(previousStageId);
  };
  
  // בדיקת סטטוס שלב
  const getStageStatus = (stageId, index) => {
    if (stageId === currentStage) {
      return 'current';
    }
    if (completedStages.includes(stageId)) {
      return 'completed';
    }
    return isStageAccessible(stageId, index) ? 'accessible' : 'locked';
  };
  
  // מחלקות לכיוון הפריסה
  const layoutClasses = {
    horizontal: 'flex flex-row items-center justify-between',
    vertical: 'flex flex-col items-center space-y-8'
  };
  
  // מחלקות לגודל המפה
  const sizeClasses = {
    small: layout === 'horizontal' ? 'h-16' : 'w-16',
    medium: layout === 'horizontal' ? 'h-20' : 'w-20',
    large: layout === 'horizontal' ? 'h-24' : 'w-24'
  };
  
  // מחלקות לסגנון הנתיב
  const pathStyles = {
    solid: 'border-0',
    dashed: 'border-dashed',
    dotted: 'border-dotted'
  };
  
  // צבעים לפי התמה
  const themeColors = {
    default: {
      completed: 'bg-gray-500',
      current: 'bg-blue-500',
      accessible: 'bg-gray-300',
      locked: 'bg-gray-200'
    },
    primary: {
      completed: 'bg-primary',
      current: 'bg-primary shadow-lg shadow-primary/30',
      accessible: 'bg-primaryLight',
      locked: 'bg-gray-200'
    },
    secondary: {
      completed: 'bg-secondary',
      current: 'bg-secondary shadow-lg shadow-secondary/30',
      accessible: 'bg-secondaryLight',
      locked: 'bg-gray-200'
    },
    accent: {
      completed: 'bg-accent',
      current: 'bg-accent shadow-lg shadow-accent/30',
      accessible: 'bg-accentLight',
      locked: 'bg-gray-200'
    }
  };
  
  // בניית כיתוב CSS למסלול
  const getPathStyle = (fromStatus, toStatus) => {
    let baseStyle = `
      ${layout === 'horizontal' ? 'w-full h-1' : 'w-1 h-full'}
      transition-all duration-500
      ${pathStyles[pathStyle]}
    `;
    
    // אם שני השלבים מושלמים או הנוכחי, הנתיב מלא
    if (fromStatus === 'completed' && ['completed', 'current'].includes(toStatus)) {
      return `${baseStyle} ${themeColors[theme].completed}`;
    }
    
    // אם השלב הראשון הושלם והשני נגיש, הנתיב בצבע עמום
    if (fromStatus === 'completed' && toStatus === 'accessible') {
      return `${baseStyle} ${themeColors[theme].accessible}`;
    }
    
    // בכל מקרה אחר, הנתיב אפור
    return `${baseStyle} bg-gray-200`;
  };
  
  return (
    <div 
      className={`${layoutClasses[layout]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {stages.map((stage, index) => (
        <React.Fragment key={stage.id}>
          {/* סמן שלב */}
          <StageMarker
            stage={stage}
            status={getStageStatus(stage.id, index)}
            index={index + 1}
            size={size}
            theme={theme}
            onClick={() => isStageAccessible(stage.id, index) && onStageClick?.(stage.id)}
            animated={animated && stage.id === currentStage}
          />
          
          {/* נתיב מחבר (חוץ מהאחרון) */}
          {index < stages.length - 1 && (
            <div 
              className={getPathStyle(
                getStageStatus(stage.id, index),
                getStageStatus(stages[index + 1].id, index + 1)
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

JourneyMap.propTypes = {
  stages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      icon: PropTypes.node,
      shortName: PropTypes.string
    })
  ).isRequired,
  currentStage: PropTypes.string,
  completedStages: PropTypes.arrayOf(PropTypes.string),
  onStageClick: PropTypes.func,
  layout: PropTypes.oneOf(['horizontal', 'vertical']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  pathStyle: PropTypes.oneOf(['solid', 'dashed', 'dotted']),
  theme: PropTypes.oneOf(['default', 'primary', 'secondary', 'accent']),
  animated: PropTypes.bool,
  className: PropTypes.string,
};

export default JourneyMap;