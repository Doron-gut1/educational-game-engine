import React from 'react';
import { useTheme } from '../../hooks/useTheme';

/**
 * רכיב כפתור עם עיצוב מותאם
 * @param {Object} props - פרופס הרכיב
 * @param {ReactNode} props.children - תוכן הכפתור
 * @param {string} props.variant - וריאנט עיצובי (primary, secondary, outline, text)
 * @param {string} props.size - גודל הכפתור (small, medium, large)
 * @param {boolean} props.disabled - האם הכפתור מושבת
 * @param {Function} props.onClick - פונקציית קליק
 * @param {string} props.className - מחלקות CSS נוספות
 */
export function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false,
  onClick,
  className,
  ...props 
}) {
  const theme = useTheme();
  
  // מחלקות בסיסיות
  const baseClasses = "flex items-center justify-center gap-2 rounded-lg font-bold transition-all";
  
  // מחלקות לפי וריאנט
  const variantClasses = {
    primary: `bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800`,
    secondary: `bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700`,
    outline: `border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100`,
    text: `text-blue-600 hover:bg-blue-50 hover:bg-opacity-50 active:bg-blue-100`
  };
  
  // מחלקות לפי גודל
  const sizeClasses = {
    small: "px-3 py-1 text-sm",
    medium: "px-4 py-2",
    large: "px-6 py-3 text-lg"
  };
  
  // מחלקות לפי מצב
  const disabledClasses = disabled 
    ? "opacity-50 cursor-not-allowed pointer-events-none" 
    : "cursor-pointer";
  
  // חיבור כל המחלקות
  const combinedClasses = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    ${disabledClasses}
    ${className || ''}
  `;
  
  return (
    <button 
      className={combinedClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}