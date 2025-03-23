import React from 'react';
import PropTypes from 'prop-types';

/**
 * רכיב אינדיקטור טעינה לשימוש בזמן טעינת תוכן
 */
export const LoadingIndicator = ({ 
  type = 'spinner',
  size = 'medium',
  color = 'primary',
  text = 'טוען...',
  showText = true,
  className = '',
  ...props
}) => {
  // מיפוי גדלים
  const sizeMap = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };
  
  // מיפוי צבעים
  const colorMap = {
    primary: 'border-blue-500',
    secondary: 'border-gray-400',
    accent: 'border-amber-500',
    white: 'border-white',
    passover: 'border-indigo-500',
    tubishvat: 'border-emerald-500'
  };
  
  // מיפוי גודל טקסט
  const textSizeMap = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };
  
  // בחירת סוג האינדיקטור
  const renderIndicator = () => {
    switch(type) {
      case 'spinner':
        return (
          <div 
            className={`${sizeMap[size]} rounded-full border-t-2 border-b-2 ${colorMap[color]} animate-spin`}
          ></div>
        );
        
      case 'dots':
        return (
          <div className="flex space-x-2">
            <div className={`${size === 'small' ? 'w-2 h-2' : size === 'large' ? 'w-4 h-4' : 'w-3 h-3'} ${color === 'white' ? 'bg-white' : `bg-${color}-500`} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
            <div className={`${size === 'small' ? 'w-2 h-2' : size === 'large' ? 'w-4 h-4' : 'w-3 h-3'} ${color === 'white' ? 'bg-white' : `bg-${color}-500`} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
            <div className={`${size === 'small' ? 'w-2 h-2' : size === 'large' ? 'w-4 h-4' : 'w-3 h-3'} ${color === 'white' ? 'bg-white' : `bg-${color}-500`} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
          </div>
        );
        
      case 'scroll':
        // אנימציית מגילת ספר
        return (
          <div 
            className={`${sizeMap[size]} bg-amber-100 border border-amber-800 rounded shadow-inner relative overflow-hidden animate-pulse`}
          >
            <div className="absolute top-0 left-0 w-full h-1/3 border-b border-amber-800/30"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/3 border-t border-amber-800/30"></div>
          </div>
        );
        
      default:
        return (
          <div 
            className={`${sizeMap[size]} rounded-full border-t-2 border-b-2 ${colorMap[color]} animate-spin`}
          ></div>
        );
    }
  };
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`} {...props}>
      {renderIndicator()}
      
      {showText && (
        <div className={`mt-4 ${textSizeMap[size]} ${color === 'white' ? 'text-white' : 'text-gray-700'}`}>
          {text}
        </div>
      )}
    </div>
  );
};

LoadingIndicator.propTypes = {
  /**
   * סוג האינדיקטור
   */
  type: PropTypes.oneOf(['spinner', 'dots', 'scroll']),
  /**
   * גודל האינדיקטור
   */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /**
   * צבע האינדיקטור
   */
  color: PropTypes.oneOf(['primary', 'secondary', 'accent', 'white', 'passover', 'tubishvat']),
  /**
   * טקסט להצגה
   */
  text: PropTypes.string,
  /**
   * האם להציג טקסט
   */
  showText: PropTypes.bool,
  /**
   * className נוסף
   */
  className: PropTypes.string
};

export default LoadingIndicator;