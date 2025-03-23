import React from 'react';
import PropTypes from 'prop-types';
import { Card } from './Card';

/**
 * רכיב כרטיסייה בעיצוב מגילה עתיקה
 */
export const ScrollCard = React.forwardRef(({
  children,
  scrollType = 'paper',
  worn = true,
  shadow = 'large',
  className = '',
  style = {},
  ...props
}, ref) => {
  // מיפוי סוגי מגילות
  const scrollStyles = {
    paper: {
      background: 'linear-gradient(to right, #f3e7d3 0%, #f9f2e3 40%, #f9f2e3 60%, #f3e7d3 100%)',
      borderColor: '#d4bc94',
      textColor: '#5c4c3a'
    },
    parchment: {
      background: 'linear-gradient(to right, #e8dabe 0%, #f5f0d9 40%, #f5f0d9 60%, #e8dabe 100%)',
      borderColor: '#c4b590',
      textColor: '#4e4937'
    },
    stone: {
      background: 'linear-gradient(to right, #dddbd9 0%, #f0f0f0 40%, #f0f0f0 60%, #dddbd9 100%)',
      borderColor: '#b8b5b3',
      textColor: '#494745'
    }
  };
  
  // סגנון נבחר
  const selectedStyle = scrollStyles[scrollType] || scrollStyles.paper;
  
  // אפקט בלאי וישן, אם מופעל
  const wornEffect = worn ? {
    backgroundImage: `
      radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.3) 0%, rgba(0, 0, 0, 0) 75%), 
      radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.2) 0%, rgba(0, 0, 0, 0) 70%),
      ${selectedStyle.background}
    `,
    boxShadow: 'inset 0 0 20px rgba(143, 124, 100, 0.2)'
  } : {
    backgroundImage: selectedStyle.background
  };
  
  // הוספת אפקט "קצוות מגילה"
  const scrollEdges = {
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '0',
      bottom: '0',
      left: '0',
      width: '15px',
      background: 'linear-gradient(to right, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0))',
      borderRight: `1px solid ${selectedStyle.borderColor}`
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '0',
      bottom: '0',
      right: '0',
      width: '15px',
      background: 'linear-gradient(to left, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0))',
      borderLeft: `1px solid ${selectedStyle.borderColor}`
    }
  };
  
  // סגנון משולב
  const combinedStyle = {
    ...wornEffect,
    color: selectedStyle.textColor,
    borderColor: selectedStyle.borderColor,
    borderWidth: '1px',
    borderStyle: 'solid',
    ...style
  };
  
  return (
    <Card
      ref={ref}
      shadow={shadow}
      className={`relative overflow-hidden ${className}`}
      style={combinedStyle}
      {...props}
    >
      {/* דימוי קצוות המגילה */}
      <div className="absolute top-0 bottom-0 left-0 w-4" 
        style={{ 
          background: 'linear-gradient(to right, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0))',
          borderRight: `1px solid ${selectedStyle.borderColor}` 
        }} 
      />
      <div className="absolute top-0 bottom-0 right-0 w-4" 
        style={{ 
          background: 'linear-gradient(to left, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0))',
          borderLeft: `1px solid ${selectedStyle.borderColor}` 
        }} 
      />
      
      {/* תוכן הכרטיסייה */}
      <div className="p-1">
        {children}
      </div>
    </Card>
  );
});

ScrollCard.displayName = 'ScrollCard';

ScrollCard.propTypes = {
  /**
   * תוכן הכרטיסייה
   */
  children: PropTypes.node,
  /**
   * סוג המגילה
   */
  scrollType: PropTypes.oneOf(['paper', 'parchment', 'stone']),
  /**
   * האם להפעיל אפקט בלאי וישן
   */
  worn: PropTypes.bool,
  /**
   * עוצמת הצל
   */
  shadow: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
  /**
   * className נוסף
   */
  className: PropTypes.string,
  /**
   * סגנון מותאם אישית
   */
  style: PropTypes.object
};

export default ScrollCard;