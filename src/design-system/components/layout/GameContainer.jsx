import React from 'react';

/**
 * רכיב מיכל למשחק ספציפי
 * אזור העטוף בעיצוב המשחק והמיועד לתכני המשחק
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - תוכן המיכל
 * @param {string} props.className - מחלקות CSS נוספות
 */
export default function GameContainer({ 
  children, 
  className = '', 
  ...props 
}) {
  return (
    <div 
      className={`bg-white bg-opacity-95 backdrop-blur-md p-8 rounded-lg shadow-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
