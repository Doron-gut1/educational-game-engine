import React from 'react';
import { useTheme } from '../../hooks/useTheme';

/**
 * רכיב כרטיס - מסגרת עם עיצוב אחיד לתוכן
 * @param {Object} props - פרופס הרכיב
 * @param {ReactNode} props.children - תוכן הכרטיס
 * @param {string} props.variant - וריאנט עיצובי (default, primary, secondary, translucent)
 * @param {string} props.shadow - רמת צל (none, small, medium, large)
 * @param {boolean} props.hoverable - אם להוסיף אפקט hover
 * @param {string} props.className - מחלקות CSS נוספות
 */
export function Card({
  children,
  variant = 'default',
  shadow = 'medium',
  hoverable = false,
  className,
  ...props
}) {
  const theme = useTheme();
  
  // מחלקות בסיסיות
  const baseClasses = "rounded-lg overflow-hidden";
  
  // מחלקות לפי וריאנט
  const variantClasses = {
    default: "bg-white",
    primary: `bg-blue-50 border border-blue-100`,
    secondary: `bg-amber-50 border border-amber-100`,
    translucent: "bg-white bg-opacity-80 backdrop-filter backdrop-blur-md"
  };
  
  // מחלקות צל
  const shadowClasses = {
    none: "",
    small: "shadow",
    medium: "shadow-md",
    large: "shadow-lg"
  };
  
  // מחלקות hover
  const hoverClasses = hoverable 
    ? `transition-transform transform hover:scale-[1.02] hover:shadow-lg cursor-pointer` 
    : '';
  
  // חיבור כל המחלקות
  const combinedClasses = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${shadowClasses[shadow]}
    ${hoverClasses}
    ${className || ''}
  `;
  
  return (
    <div 
      className={combinedClasses}
      {...props}
    >
      {children}
    </div>
  );
}