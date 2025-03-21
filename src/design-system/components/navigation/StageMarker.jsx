import React from 'react';
import PropTypes from 'prop-types';

/**
 * רכיב סמן שלב - מציג נקודת ציון במפת המסע
 * 
 * @param {Object} props - Props הרכיב
 * @param {Object} props.stage - אובייקט השלב (id, name, icon, shortName)
 * @param {string} props.status - סטטוס השלב (completed, current, accessible, locked)
 * @param {number} props.index - מספר השלב (1, 2, 3, ...)
 * @param {string} props.size - גודל הסמן (small, medium, large)
 * @param {string} props.theme - ערכת הצבעים (default, primary, secondary, accent)
 * @param {boolean} props.animated - האם להוסיף אנימציות
 * @param {Function} props.onClick - פונקציה לטיפול בלחיצה
 * @param {string} props.className - מחלקות CSS נוספות
 */
export const StageMarker = ({ 
  stage,
  status = 'locked',
  index,
  size = 'medium',
  theme = 'primary',
  animated = false,
  onClick,
  className = '',
  ...rest
}) => {
  // גדלי סמן 
  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-10 h-10 text-sm',
    large: 'w-14 h-14 text-base'
  };
  
  // סגנונות לפי סטטוס
  const statusStyles = {
    completed: {
      default: 'bg-gray-500 text-white cursor-pointer',
      primary: 'bg-primary text-white cursor-pointer',
      secondary: 'bg-secondary text-white cursor-pointer',
      accent: 'bg-accent text-white cursor-pointer'
    },
    current: {
      default: 'bg-blue-500 text-white ring-4 ring-blue-200 cursor-pointer',
      primary: 'bg-primary text-white ring-4 ring-primary/30 cursor-pointer',
      secondary: 'bg-secondary text-white ring-4 ring-secondary/30 cursor-pointer',
      accent: 'bg-accent text-white ring-4 ring-accent/30 cursor-pointer'
    },
    accessible: {
      default: 'bg-blue-100 text-blue-800 border border-blue-300 cursor-pointer hover:bg-blue-200',
      primary: 'bg-primaryLight text-primary border border-primary/30 cursor-pointer hover:bg-primaryLight/80',
      secondary: 'bg-secondaryLight text-secondary border border-secondary/30 cursor-pointer hover:bg-secondaryLight/80',
      accent: 'bg-accentLight text-accent border border-accent/30 cursor-pointer hover:bg-accentLight/80'
    },
    locked: {
      default: 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-60',
      primary: 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-60',
      secondary: 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-60',
      accent: 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-60'
    }
  };
  
  // אנימציות לפי סטטוס
  const animations = animated ? {
    completed: '',
    current: 'animate-pulse',
    accessible: '',
    locked: ''
  } : {
    completed: '',
    current: '',
    accessible: '',
    locked: ''
  };
  
  // תוכן הסמן - אייקון או מספר
  const markerContent = stage.icon || (
    <span className="font-bold">{index}</span>
  );
  
  // בניית המחלקות
  const markerClasses = `
    rounded-full
    flex items-center justify-center
    font-medium
    shadow-md
    transition-all duration-300
    ${sizeClasses[size] || sizeClasses.medium}
    ${statusStyles[status]?.[theme] || statusStyles.locked.default}
    ${animations[status] || ''}
    ${className}
  `;
  
  return (
    <div className="flex flex-col items-center gap-1">
      <button 
        className={markerClasses}
        onClick={onClick}
        disabled={status === 'locked'}
        type="button"
        {...rest}
      >
        {markerContent}
      </button>
      
      {/* שם מקוצר של השלב */}
      {stage.shortName && (
        <span className={`text-xs font-medium ${status === 'locked' ? 'text-gray-400' : 'text-gray-700'}`}>
          {stage.shortName}
        </span>
      )}
    </div>
  );
};

StageMarker.propTypes = {
  stage: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    icon: PropTypes.node,
    shortName: PropTypes.string
  }).isRequired,
  status: PropTypes.oneOf(['completed', 'current', 'accessible', 'locked']),
  index: PropTypes.number,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  theme: PropTypes.oneOf(['default', 'primary', 'secondary', 'accent']),
  animated: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};