import React from 'react';
import PropTypes from 'prop-types';

/**
 * רכיב כפתור אייקון - כפתור שמציג אייקון בלבד
 * 
 * @param {Object} props - Props הרכיב
 * @param {ReactNode} props.icon - האייקון להצגה (רכיב React)
 * @param {string} props.variant - סגנון הכפתור (primary, secondary, outline, text)
 * @param {string} props.size - גודל הכפתור (small, medium, large)
 * @param {boolean} props.disabled - האם הכפתור מושבת
 * @param {boolean} props.rounded - האם הכפתור עגול לחלוטין
 * @param {string} props.tooltip - טקסט שיוצג בעת ריחוף
 * @param {string} props.animation - אנימציית הכפתור (pulse, glow, none)
 * @param {Function} props.onClick - פונקציית לחיצה
 * @param {string} props.className - מחלקות CSS נוספות
 */
const IconButton = ({ 
  icon, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false,
  rounded = true,
  tooltip,
  animation = 'none',
  onClick,
  className = '',
  ...rest 
}) => {
  // בסיס מחלקות הכפתור
  const baseClasses = "flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  // מחלקות לפי וריאנט
  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primaryDark active:bg-primaryDark/90 shadow-sm hover:shadow focus:ring-primary/50",
    secondary: "bg-secondary text-white hover:bg-secondaryDark active:bg-secondaryDark/90 shadow-sm hover:shadow focus:ring-secondary/50",
    accent: "bg-accent text-white hover:bg-accentDark active:bg-accentDark/90 shadow-sm hover:shadow focus:ring-accent/50",
    outline: "border-2 border-primary text-primary hover:bg-primaryLight hover:bg-opacity-20 active:bg-primaryLight/30 focus:ring-primary/40",
    text: "text-primary hover:bg-primaryLight hover:bg-opacity-10 active:bg-primaryLight/20 focus:ring-primary/30",
    glass: "bg-white/30 backdrop-blur-md text-primary border border-white/40 hover:bg-white/40 active:bg-white/50 focus:ring-white/40",
  };
  
  // מחלקות לפי גודל
  const sizeClasses = {
    small: "p-1.5 text-sm",
    medium: "p-2 text-base",
    large: "p-3 text-lg",
  };
  
  // גדלי אייקון לפי גודל הכפתור
  const iconSizeClasses = {
    small: "w-4 h-4",
    medium: "w-5 h-5",
    large: "w-6 h-6",
  };
  
  // מחלקות לעיגול/פינות
  const shapeClasses = rounded 
    ? "rounded-full" 
    : "rounded-md";
  
  // מחלקות למצב מושבת
  const disabledClasses = disabled 
    ? "opacity-50 cursor-not-allowed pointer-events-none" 
    : "cursor-pointer";
  
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
    shapeClasses,
    disabledClasses,
    animationClasses[animation] || "",
    className
  ].join(" ");
  
  // יצירת עטיפה לאייקון כדי להבטיח גודל מתאים
  const wrappedIcon = React.cloneElement(icon, {
    className: `${iconSizeClasses[size]} ${icon.props.className || ''}`
  });
  
  // הוספת tooltip אם ניתן
  const buttonWithTooltip = tooltip ? (
    <div className="relative group">
      <button 
        className={classes}
        disabled={disabled}
        onClick={onClick}
        type="button"
        {...rest}
      >
        {wrappedIcon}
      </button>
      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        {tooltip}
      </div>
    </div>
  ) : (
    <button 
      className={classes}
      disabled={disabled}
      onClick={onClick}
      type="button"
      {...rest}
    >
      {wrappedIcon}
    </button>
  );
  
  return buttonWithTooltip;
};

IconButton.propTypes = {
  icon: PropTypes.element.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'accent', 'outline', 'text', 'glass']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  rounded: PropTypes.bool,
  tooltip: PropTypes.string,
  animation: PropTypes.oneOf(['none', 'pulse', 'glow', 'bounce', 'pulseBorder']),
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default IconButton;