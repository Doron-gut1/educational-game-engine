import React from 'react';

/**
 * רכיב כותרת עם תמיכה ברמות שונות
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - תוכן הכותרת
 * @param {number} props.level - רמת הכותרת (1-6)
 * @param {string} props.className - מחלקות CSS נוספות
 */
export default function Heading({ 
  children, 
  level = 1, 
  className = '', 
  ...props 
}) {
  const validLevel = Math.min(Math.max(parseInt(level), 1), 6);
  const HeadingTag = `h${validLevel}`;
  
  // מחלקות ברירת מחדל לפי רמת הכותרת
  const defaultClasses = {
    1: 'text-3xl font-bold',
    2: 'text-2xl font-bold',
    3: 'text-xl font-bold',
    4: 'text-lg font-semibold',
    5: 'text-base font-semibold',
    6: 'text-sm font-semibold'
  };
  
  const combinedClassName = `${defaultClasses[validLevel]} ${className}`;
  
  return (
    <HeadingTag className={combinedClassName} {...props}>
      {children}
    </HeadingTag>
  );
}
