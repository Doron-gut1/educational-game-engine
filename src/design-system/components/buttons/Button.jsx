import React from 'react';
import PropTypes from 'prop-types';

/**
 * רכיב כפתור מעוצב למערכת העיצוב "מסע הדעת"
 * 
 * @param {Object} props - Props הרכיב
 * @param {ReactNode} props.children - תוכן הכפתור
 * @param {string} props.variant - סגנון הכפתור (primary, secondary, outline, text)
 * @param {string} props.size - גודל הכפתור (small, medium, large)
 * @param {boolean} props.disabled - האם הכפתור מושבת
 * @param {boolean} props.fullWidth - האם הכפתור יתפרס על פני כל הרוחב
 * @param {string} props.animation - אנימציית הכפתור (pulse, glow, none)
 * @param {Function} props.onClick - פונקציית לחיצה
 * @param {string} props.className - מחלקות CSS נוספות
 */
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false,
  fullWidth = false,
  animation = 'none',
  onClick,
  className = '',
  ...rest 
}) => {
  // בסיס מחלקות הכפתור
  const baseClasses = "font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  // מחלקות לפי וריאנט
  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primaryDark active:bg-primaryDark/90 shadow-md hover:shadow-lg focus:ring-primary/50",
    secondary: "bg-secondary text-white hover:bg-secondaryDark active:bg-secondaryDark/90 shadow-md hover:shadow-lg focus:ring-secondary/50",
    accent: "bg-accent text-white hover:bg-accentDark active:bg-accentDark/90 shadow-md hover:shadow-lg focus:ring-accent/50",
    outline: "border-2 border-primary text-primary hover:bg-primaryLight hover:bg-opacity-20 active:bg-primaryLight/30 focus:ring-primary/40",
    text: "text-primary hover:bg-primaryLight hover:bg-opacity-10 active:bg-primaryLight/20 focus:ring-primary/30",
  };
  
  // מחלקות לפי גודל
  const sizeClasses = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2.5 text-base",
    large: "px-6 py-3 text-lg",
  };
  
  // מחלקות למצב מושבת
  const disabledClasses = disabled 
    ? "opacity-50 cursor-not-allowed pointer-events-none" 
    : "cursor-pointer";
  
  // מחלקות לרוחב מלא
  const widthClasses = fullWidth ? "w-full" : "";
  
  // מחלקות לאנימציה
  const animationClasses = {
    none: "",
    pulse: "animate-pulse",
    glow: "animate-glow",
    bounce: "animate-bounce",
    pulseBorder: "animate-pulse-border"
  };
  
  // חיבור כל המחלקות יחד
  const classes = [
    baseClasses,
    variantClasses[variant] || variantClasses.primary,
    sizeClasses[size] || sizeClasses.medium,
    disabledClasses,
    widthClasses,
    animationClasses[animation] || "",
    className
  ].join(" ");
  
  return (
    <button 
      className={classes}
      disabled={disabled}
      onClick={onClick}
      type="button"
      {...rest}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'accent', 'outline', 'text']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  animation: PropTypes.oneOf(['none', 'pulse', 'glow', 'bounce', 'pulseBorder']),
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Button;