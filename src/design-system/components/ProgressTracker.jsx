import React from 'react';
import PropTypes from 'prop-types';

/**
 * רכיב למעקב אחר התקדמות במשחק או בפעילות
 */
export const ProgressTracker = ({
  stages = [],
  currentStage = null,
  completedStages = [],
  onStageClick,
  className = '',
  variant = 'default',
  ...props
}) => {
  // מעקב האם תחנה הושלמה
  const isCompleted = (stageId) => {
    return completedStages.includes(stageId);
  };

  // האם זו התחנה הנוכחית
  const isCurrent = (stageId) => {
    return currentStage === stageId;
  };

  // סגנונות שונים של מעקב התקדמות
  const variantStyles = {
    default: {
      container: 'flex justify-between items-center',
      stageContainer: 'flex flex-col items-center',
      stage: 'w-6 h-6 rounded-full flex items-center justify-center text-xs',
      stageCurrent: 'bg-blue-500 text-white',
      stageCompleted: 'bg-green-500 text-white',
      stagePending: 'bg-gray-300 text-gray-700',
      line: 'h-1 flex-grow mx-1',
      lineCompleted: 'bg-green-500',
      linePending: 'bg-gray-300',
      label: 'text-xs mt-1 text-center'
    },
    scrolls: {
      container: 'flex justify-between items-center',
      stageContainer: 'flex flex-col items-center',
      stage: 'w-8 h-8 rounded-full flex items-center justify-center text-xs border-2',
      stageCurrent: 'bg-amber-100 border-amber-600 text-amber-800',
      stageCompleted: 'bg-amber-500 border-amber-700 text-white',
      stagePending: 'bg-gray-100 border-gray-300 text-gray-500',
      line: 'h-1 flex-grow mx-2',
      lineCompleted: 'bg-amber-500',
      linePending: 'bg-gray-300',
      label: 'text-xs mt-2 text-center max-w-[70px] line-clamp-1'
    },
    passover: {
      container: 'flex justify-between items-center',
      stageContainer: 'flex flex-col items-center',
      stage: 'w-8 h-8 rounded-full flex items-center justify-center text-xs border-2',
      stageCurrent: 'bg-indigo-100 border-indigo-600 text-indigo-800',
      stageCompleted: 'bg-indigo-500 border-indigo-700 text-white',
      stagePending: 'bg-gray-100 border-gray-300 text-gray-500',
      line: 'h-1 flex-grow mx-2',
      lineCompleted: 'bg-indigo-500',
      linePending: 'bg-gray-300',
      label: 'text-xs mt-2 text-center max-w-[70px] line-clamp-1'
    }
  };

  // בחירת סגנון
  const styles = variantStyles[variant] || variantStyles.default;

  return (
    <div className={`${styles.container} ${className}`} {...props}>
      {stages.map((stage, index) => (
        <React.Fragment key={stage.id || index}>
          {/* תחנה במסע */}
          <div className={styles.stageContainer}>
            <div
              className={`
                ${styles.stage}
                ${isCurrent(stage.id) ? styles.stageCurrent : ''}
                ${isCompleted(stage.id) ? styles.stageCompleted : ''}
                ${!isCurrent(stage.id) && !isCompleted(stage.id) ? styles.stagePending : ''}
                ${onStageClick && (isCompleted(stage.id) || isCurrent(stage.id)) ? 'cursor-pointer' : ''}
              `}
              onClick={() => {
                if (onStageClick && (isCompleted(stage.id) || isCurrent(stage.id))) {
                  onStageClick(stage.id);
                }
              }}
            >
              {isCompleted(stage.id) ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            {stage.name && <div className={styles.label}>{stage.shortName || stage.name}</div>}
          </div>

          {/* קו מקשר בין התחנות */}
          {index < stages.length - 1 && (
            <div 
              className={`
                ${styles.line}
                ${isCompleted(stage.id) ? styles.lineCompleted : styles.linePending}
              `}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

ProgressTracker.propTypes = {
  /**
   * רשימת שלבים/תחנות
   */
  stages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
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
   * פונקציה שתופעל בלחיצה על שלב
   */
  onStageClick: PropTypes.func,
  /**
   * מחלקת CSS נוספת
   */
  className: PropTypes.string,
  /**
   * סגנון עיצובי
   */
  variant: PropTypes.oneOf(['default', 'scrolls', 'passover'])
};

export default ProgressTracker;