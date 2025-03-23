import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../ThemeProvider';

/**
 * רכיב כותרת במערכת העיצוב
 */
export const Heading = ({
  children,
  level = 2,
  className = '',
  ...props
}) => {
  const theme = useTheme() || {};
  
  // מיפוי רמות כותרת לתגיות HTML מתאימות
  const HeadingTag = `h${level}`;
  
  // סגנון ברירת מחדל לפי רמת כותרת
  const defaultStyles = {
    1: 'text-4xl font-bold mb-4',
    2: 'text-3xl font-bold mb-3',
    3: 'text-2xl font-semibold mb-2',
    4: 'text-xl font-semibold mb-2',
    5: 'text-lg font-medium mb-1',
    6: 'text-base font-medium mb-1'
  };
  
  // שילוב סגנונות
  const combinedClasses = `${defaultStyles[level] || defaultStyles[2]} ${className}`;
  
  return (
    <HeadingTag className={combinedClasses} {...props}>
      {children}
    </HeadingTag>
  );
};

Heading.propTypes = {
  /**
   * תוכן הכותרת
   */
  children: PropTypes.node.isRequired,
  /**
   * רמת הכותרת (1-6)
   */
  level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  /**
   * className נוסף
   */
  className: PropTypes.string
};

export default Heading;