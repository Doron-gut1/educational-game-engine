import React from 'react';
import { useTheme } from '../ThemeProvider';

/**
 * רכיב כותרת של שלב במשחק
 * @param {Object} props - פרופס הרכיב
 * @param {string} props.className - מחלקות CSS נוספות
 * @param {React.ReactNode} props.children - תוכן הכותרת
 * @param {string} props.icon - אייקון אופציונלי לכותרת
 * @param {string} props.level - רמת כותרת (h1-h6)
 */
export function StageHeading({ 
  className = '', 
  children, 
  icon,
  level = '2', 
  ...props 
}) {
  const theme = useTheme();
  
  // המרת רמת הכותרת למספר
  const headingLevel = parseInt(level, 10) || 2;
  // וידוא שהרמה בטווח חוקי (1-6)
  const safeLevel = Math.min(Math.max(headingLevel, 1), 6);
  
  // קביעת מחלקות בסיסיות לפי רמת הכותרת
  const baseClasses = {
    1: 'text-4xl font-bold',
    2: 'text-3xl font-bold',
    3: 'text-2xl font-semibold',
    4: 'text-xl font-semibold',
    5: 'text-lg font-medium',
    6: 'text-base font-medium'
  };
  
  // בניית מחלקות מלאות
  const classes = `${baseClasses[safeLevel]} text-gray-800 border-b pb-2 ${className}`;
  
  // הגדרת הרכיב לפי רמת הכותרת
  const HeadingTag = `h${safeLevel}`;
  
  return (
    <HeadingTag className={classes} {...props}>
      {icon && (
        <span className="mr-2 inline-block">
          {icon}
        </span>
      )}
      {children}
    </HeadingTag>
  );
}