import React from 'react';

/**
 * רכיב כרטיס בסיסי במערכת העיצוב
 * 
 * @param {Object} props - פרופס הרכיב
 * @param {React.ReactNode} props.children - תוכן הרכיב
 * @param {string} props.className - קלאסים נוספים
 * @param {Object} props.style - סגנונות נוספים 
 * @param {Function} props.onClick - אירוע לחיצה
 */
export default function Card({ 
  children, 
  className = '', 
  style = {}, 
  onClick = null,
  ...props 
}) {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
      style={style}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
