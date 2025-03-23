import React from 'react';
import PropTypes from 'prop-types';

/**
 * רכיב מפת מסע - גרסה מפוארת של ProgressTracker
 * מציג מסע התקדמות בצורה ויזואלית יותר
 */
export const JourneyMap = ({
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

  // האם התחנה פעילה/ניתנת ללחיצה
  const isActive = (stageId) => {
    return isCompleted(stageId) || isCurrent(stageId);
  };

  // סגנונות שונים של מפת מסע
  const variantStyles = {
    default: {
      container: 'relative p-4 bg-blue-50 rounded-lg shadow-inner',
      path: 'absolute top-1/2 left-0 right-0 h-2 bg-gray-300 -translate-y-1/2',
      pathCompleted: 'bg-blue-500',
      stageContainer: 'relative z-10',
      stageWrapper: 'flex flex-col items-center',
      stage: 'w-12 h-12 rounded-full flex items-center justify-center text-lg border-4',
      stageCurrent: 'bg-blue-100 border-blue-600 text-blue-800',
      stageCompleted: 'bg-blue-500 border-blue-700 text-white',
      stagePending: 'bg-gray-100 border-gray-300 text-gray-500',
      stageActive: 'cursor-pointer transform hover:scale-110 transition-transform',
      stageInactive: 'opacity-60',
      checkmark: 'text-white',
      label: 'mt-2 text-sm font-medium text-center max-w-[100px]'
    },
    scrolls: {
      container: 'relative p-4 bg-amber-50/70 rounded-lg shadow-inner border border-amber-200',
      path: 'absolute top-1/2 left-0 right-0 h-3 bg-amber-100 border-t border-b border-amber-200 -translate-y-1/2',
      pathCompleted: 'bg-amber-300 border-amber-400',
      stageContainer: 'relative z-10',
      stageWrapper: 'flex flex-col items-center',
      stage: 'w-14 h-14 rounded-full flex items-center justify-center text-lg border-4',
      stageCurrent: 'bg-amber-100 border-amber-600 text-amber-800 shadow-lg',
      stageCompleted: 'bg-amber-500 border-amber-700 text-white',
      stagePending: 'bg-amber-50 border-amber-200 text-amber-300',
      stageActive: 'cursor-pointer transform hover:scale-110 transition-transform',
      stageInactive: 'opacity-70',
      checkmark: 'text-white',
      label: 'mt-2 text-sm font-medium text-center max-w-[100px] text-amber-900'
    },
    passover: {
      container: 'relative p-4 bg-indigo-50/70 rounded-lg shadow-inner border border-indigo-200',
      path: 'absolute top-1/2 left-0 right-0 h-3 bg-indigo-100 border-t border-b border-indigo-200 -translate-y-1/2',
      pathCompleted: 'bg-indigo-300 border-indigo-400',
      stageContainer: 'relative z-10',
      stageWrapper: 'flex flex-col items-center',
      stage: 'w-14 h-14 rounded-full flex items-center justify-center text-lg border-4',
      stageCurrent: 'bg-indigo-100 border-indigo-600 text-indigo-800 shadow-lg',
      stageCompleted: 'bg-indigo-500 border-indigo-700 text-white',
      stagePending: 'bg-indigo-50 border-indigo-200 text-indigo-300',
      stageActive: 'cursor-pointer transform hover:scale-110 transition-transform',
      stageInactive: 'opacity-70',
      checkmark: 'text-white',
      label: 'mt-2 text-sm font-medium text-center max-w-[100px] text-indigo-900'
    }
  };

  // בחירת סגנון
  const styles = variantStyles[variant] || variantStyles.default;

  return (
    <div className={`${styles.container} ${className}`} {...props}>
      {/* מסלול הרקע */}
      <div className={styles.path}></div>
      
      {/* מסלול ההתקדמות המושלם */}
      {completedStages.length > 0 && (
        <div 
          className={`${styles.path} ${styles.pathCompleted}`} 
          style={{ 
            width: `${Math.min(100, (completedStages.length / (stages.length - 1)) * 100)}%`,
            transition: 'width 0.5s ease-in-out'
          }}
        ></div>
      )}
      
      {/* תחנות המסע */}
      <div className="flex justify-between">
        {stages.map((stage, index) => (
          <div key={stage.id || index} className={styles.stageContainer}>
            <div className={styles.stageWrapper}>
              <div
                className={`
                  ${styles.stage}
                  ${isCurrent(stage.id) ? styles.stageCurrent : ''}
                  ${isCompleted(stage.id) ? styles.stageCompleted : ''}
                  ${!isCurrent(stage.id) && !isCompleted(stage.id) ? styles.stagePending : ''}
                  ${isActive(stage.id) && onStageClick ? styles.stageActive : styles.stageInactive}
                  transition-all duration-300
                `}
                onClick={() => {
                  if (onStageClick && isActive(stage.id)) {
                    onStageClick(stage.id);
                  }
                }}
              >
                {isCompleted(stage.id) ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${styles.checkmark}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              {stage.name && <div className={styles.label}>{stage.shortName || stage.name}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

JourneyMap.propTypes = {
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

export default JourneyMap;