import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../ThemeProvider';

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
  const theme = useTheme();
  
  // מיפוי וריאנטים
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
    accent: 'bg-amber-500 hover:bg-amber-600 text-white',
    outline: 'border border-current bg-transparent hover:bg-gray-100',
    outlineWhite: 'border border-white text-white hover:bg-white/10',
    text: 'bg-transparent hover:bg-gray-100',
    passover: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    tubishvat: 'bg-emerald-600 hover:bg-emerald-700 text-white'
  };
  
  // מיפוי גדלים
  const sizeStyles = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2',
    large: 'px-5 py-3 text-lg'
  };
  
  // סגנון נכות
  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  // החלת הסגנון המתאים לפי הווריאנט
  const appliedVariantStyle = variantStyles[variant] || variantStyles.primary;
  
  // החלת הסגנון המתאים לפי הגודל
  const appliedSizeStyle = sizeStyles[size] || sizeStyles.medium;
  
  // החלת קלאסים
  const combinedClasses = `
    rounded-md font-medium transition-all duration-200
    ${appliedVariantStyle}
    ${appliedSizeStyle}
    ${disabledStyle}
    ${className}
  `.trim();
  
  return (
    <button
      ref={ref}
      className={combinedClasses}
      disabled={disabled}
      onClick={onClick}
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
  children: PropTypes.node,
  /**
   * סגנון הכפתור
   */
  variant: PropTypes.oneOf(['primary', 'secondary', 'accent', 'outline', 'outlineWhite', 'text', 'passover', 'tubishvat']),
  /**
   * גודל הכפתור
   */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /**
   * האם הכפתור מושבת
   */
  disabled: PropTypes.bool,
  /**
   * פונקציה שתופעל בלחיצה
   */
  onClick: PropTypes.func,
  /**
   * מחלקת CSS נוספת
   */
  className: PropTypes.string
};

export default Button;