import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../hooks/useTheme';

/**
 * רכיב כפתור בסיסי במערכת העיצוב
 */
export const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  className = '',
  ...props
}, ref) => {
  const theme = useTheme() || {};
  
  // מיפוי וריאנטים
  const variantStyles = {
    primary: `bg-blue-600 hover:bg-blue-700 text-white shadow-md`,
    secondary: `bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-sm`,
    outline: `bg-transparent border border-current hover:bg-gray-100 text-blue-600`,
    ghost: `bg-transparent hover:bg-gray-100 text-blue-600`,
    // וריאנטים ספציפיים לנושאים
    passover: `bg-indigo-600 hover:bg-indigo-700 text-white shadow-md`,
    tubishvat: `bg-emerald-600 hover:bg-emerald-700 text-white shadow-md`,
  };
  
  // מיפוי גדלים
  const sizeStyles = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2',
    large: 'px-5 py-3 text-lg'
  };
  
  // סגנון השבתה
  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  // בנייה של class שלם
  const combinedClasses = `
    rounded-md font-medium transition-all duration-200
    ${variantStyles[variant] || variantStyles.primary}
    ${sizeStyles[size] || sizeStyles.medium}
    ${disabledStyle}
    ${className}
  `.trim().replace(/\s+/g, ' '); // ניקוי רווחים מיותרים
  
  return (
    <button 
      ref={ref}
      className={combinedClasses}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

Button.propTypes = {
  /**
   * תוכן הכפתור
   */
  children: PropTypes.node.isRequired,
  /**
   * סגנון הכפתור
   */
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'passover', 'tubishvat']),
  /**
   * גודל הכפתור
   */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /**
   * האם הכפתור מושבת
   */
  disabled: PropTypes.bool,
  /**
   * פונקציה המופעלת בלחיצה
   */
  onClick: PropTypes.func,
  /**
   * className נוסף
   */
  className: PropTypes.string
};

export default Button;