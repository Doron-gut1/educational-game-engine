import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * רכיב כרטיס בסגנון מגילה עתיקה
 * 
 * @param {Object} props - Props הרכיב
 * @param {ReactNode} props.children - תוכן הכרטיס
 * @param {string} props.variant - וריאנט צבע (default, primary, secondary, accent)
 * @param {boolean} props.animated - האם יש אנימציית פתיחה
 * @param {boolean} props.open - האם המגילה פתוחה
 * @param {boolean} props.decorative - האם להוסיף עיטורים
 * @param {string} props.className - מחלקות CSS נוספות
 */
const ScrollCard = ({ 
  children, 
  variant = 'default',
  animated = true,
  open = true,
  decorative = true,
  className = '',
  ...rest 
}) => {
  const [isUnfolded, setIsUnfolded] = useState(!animated || open);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState('auto');
  
  // מדידת גובה התוכן בטעינה
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(`${contentRef.current.scrollHeight}px`);
    }
  }, [children]);
  
  // טיפול בפתיחה/סגירה
  useEffect(() => {
    if (animated) {
      setIsUnfolded(open);
    }
  }, [open, animated]);
  
  // וריאנטים צבעוניים
  const variantClasses = {
    default: "bg-gradient-to-b from-amber-50 to-amber-100 border border-amber-200",
    primary: "bg-gradient-to-b from-blue-50 to-blue-100 border border-blue-200",
    secondary: "bg-gradient-to-b from-green-50 to-green-100 border border-green-200",
    accent: "bg-gradient-to-b from-amber-100 to-amber-200 border border-amber-300",
    transparent: "bg-white/40 backdrop-blur-sm border border-white/60"
  };
  
  // בסיס מחלקות עיצוב המגילה
  const scrollClasses = `
    relative 
    overflow-hidden 
    rounded-lg 
    shadow-md
    transition-all 
    duration-500
    ${variantClasses[variant] || variantClasses.default}
    ${isUnfolded ? '' : 'h-0 opacity-0'}
    ${className}
  `;
  
  // CSS משתנים עבור אנימציית הפתיחה והגובה הדינמי
  const scrollStyle = {
    '--content-height': contentHeight,
    height: isUnfolded ? contentHeight : 0,
  };
  
  // הוספת קישוטי המגילה העליון והתחתון
  const decorationElements = decorative ? (
    <>
      <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-amber-200 to-transparent z-10"></div>
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-amber-200 to-transparent z-10"></div>
    </>
  ) : null;
  
  return (
    <div 
      className={scrollClasses}
      style={scrollStyle}
      {...rest}
    >
      {decorationElements}
      
      <div 
        ref={contentRef}
        className={`p-6 ${decorative ? 'pt-8 pb-8' : 'p-4'}`}
      >
        {children}
      </div>
    </div>
  );
};

ScrollCard.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'accent', 'transparent']),
  animated: PropTypes.bool,
  open: PropTypes.bool,
  decorative: PropTypes.bool,
  className: PropTypes.string,
};

export default ScrollCard;