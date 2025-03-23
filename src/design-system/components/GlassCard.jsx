import React from 'react';
import PropTypes from 'prop-types';
import { Card } from './Card';

/**
 * רכיב כרטיסייה עם אפקט זכוכית (glassmorphism)
 */
export const GlassCard = React.forwardRef(({
  children,
  variant = 'translucent',
  opacity = 85,
  blur = 8,
  borderOpacity = 20,
  className = '',
  style = {},
  ...props
}, ref) => {
  // בנייה של סגנון אפקט הזכוכית
  const glassStyle = {
    backgroundColor: `rgba(255, 255, 255, ${opacity / 100})`,
    backdropFilter: `blur(${blur}px)`,
    borderWidth: '1px',
    borderColor: `rgba(255, 255, 255, ${borderOpacity / 100})`,
    ...style
  };
  
  // בנייה של className מותאם
  const combinedClassName = `backdrop-blur relative ${className}`;
  
  return (
    <Card
      ref={ref}
      variant="translucent"
      className={combinedClassName}
      style={glassStyle}
      {...props}
    >
      {children}
    </Card>
  );
});

GlassCard.displayName = 'GlassCard';

GlassCard.propTypes = {
  /**
   * תוכן הכרטיסייה
   */
  children: PropTypes.node,
  /**
   * אחוז האטימות של הרקע (0-100)
   */
  opacity: PropTypes.number,
  /**
   * עוצמת אפקט הבלור (בפיקסלים)
   */
  blur: PropTypes.number,
  /**
   * אחוז האטימות של הגבול (0-100)
   */
  borderOpacity: PropTypes.number,
  /**
   * className נוסף
   */
  className: PropTypes.string,
  /**
   * סגנון מותאם אישית
   */
  style: PropTypes.object
};

export default GlassCard;