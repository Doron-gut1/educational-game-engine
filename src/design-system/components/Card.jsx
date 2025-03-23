import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../hooks/useTheme';

/**
 * רכיב כרטיסייה בסיסי במערכת העיצוב
 */
export const Card = React.forwardRef(({
  children,
  variant = 'default',
  shadow = 'medium',
  hoverable = false,
  className = '',
  style = {},
  ...props
}, ref) => {
  const theme = useTheme();
  
  // מיפוי וריאנטים
  const variantStyles = {
    default: 'bg-white',
    primary: `bg-${theme.colors?.primaryLight || 'blue-100'}`,
    secondary: `bg-${theme.colors?.secondaryLight || 'gray-100'}`,
    accent: `bg-${theme.colors?.accentLight || 'amber-100'}`,
    translucent: 'bg-white bg-opacity-80 backdrop-filter backdrop-blur-md',
    // וריאנטים לפי חגים
    passover: 'bg-gradient-to-br from-blue-50 to-indigo-100 border border-indigo-200',
    tubishvat: 'bg-gradient-to-br from-green-50 to-emerald-100 border border-emerald-200'
  };
  
  // מיפוי צללים
  const shadowStyles = {
    none: '',
    small: 'shadow',
    medium: 'shadow-md',
    large: 'shadow-lg'
  };
  
  // אפקט הרחפה (hover)
  const hoverStyles = hoverable
    ? 'transition-transform duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer'
    : '';
  
  // בניית קלאסים
  const combinedClasses = `
    rounded-lg overflow-hidden
    ${variantStyles[variant] || variantStyles.default}
    ${shadowStyles[shadow] || shadowStyles.medium}
    ${hoverStyles}
    ${className}
  `.trim().replace(/\s+/g, ' '); // ניקוי רווחים מיותרים
  
  return (
    <div
      ref={ref}
      className={combinedClasses}
      style={{
        ...style,
        // הוספת גרדיאנט כברירת מחדל אם לא מוגדר עיצוב מותאם
        background: style.background || (
          variant === 'passover' 
            ? 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)' 
            : variant === 'tubishvat'
              ? 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)'
              : undefined
        )
      }}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

Card.propTypes = {
  /**
   * תוכן הכרטיסייה
   */
  children: PropTypes.node,
  /**
   * סגנון הכרטיסייה
   */
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'accent', 'translucent', 'passover', 'tubishvat']),
  /**
   * עוצמת הצל
   */
  shadow: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
  /**
   * האם להפעיל אפקט הרחפה
   */
  hoverable: PropTypes.bool,
  /**
   * className נוסף
   */
  className: PropTypes.string,
  /**
   * סגנון מותאם אישית
   */
  style: PropTypes.object
};

export default Card;