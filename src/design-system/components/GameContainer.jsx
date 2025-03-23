import React from 'react';
import PropTypes from 'prop-types';
import { Card } from './Card';

/**
 * רכיב מיכל לאזור משחק
 */
export const GameContainer = ({
  children,
  variant = 'default',
  padding = 'medium',
  shadow = 'medium',
  className = '',
  style = {},
  ...props
}) => {
  // מיפוי גדלי ריפוד
  const paddingSizes = {
    none: 'p-0',
    small: 'p-2',
    medium: 'p-4',
    large: 'p-6',
    xlarge: 'p-8'
  };
  
  // משתמש בבסיס של Card עם הוספת אפיונים שונים
  return (
    <Card
      variant={variant}
      shadow={shadow}
      className={`rounded-xl ${paddingSizes[padding]} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </Card>
  );
};

GameContainer.propTypes = {
  /**
   * תוכן אזור המשחק
   */
  children: PropTypes.node,
  /**
   * סגנון הכרטיסייה
   */
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'accent', 'translucent', 'passover', 'tubishvat']),
  /**
   * גודל הריפוד הפנימי
   */
  padding: PropTypes.oneOf(['none', 'small', 'medium', 'large', 'xlarge']),
  /**
   * עוצמת הצל
   */
  shadow: PropTypes.oneOf(['none', 'small', 'medium', 'large']),
  /**
   * className נוסף
   */
  className: PropTypes.string,
  /**
   * סגנון מותאם אישית
   */
  style: PropTypes.object
};

export default GameContainer;