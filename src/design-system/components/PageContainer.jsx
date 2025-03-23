import React from 'react';
import PropTypes from 'prop-types';

/**
 * רכיב מיכל לכל דף במערכת
 */
export const PageContainer = ({
  children,
  className = '',
  style = {},
  fluid = false,
  maxWidth = 'max-w-7xl',
  ...props
}) => {
  // בדיקה האם להשתמש ברוחב מקסימלי או במסך מלא
  const containerClass = fluid ? 'w-full' : `mx-auto ${maxWidth}`;
  
  return (
    <div
      className={`min-h-screen ${className}`}
      style={style}
      {...props}
    >
      <div className={`px-4 ${containerClass}`}>
        {children}
      </div>
    </div>
  );
};

PageContainer.propTypes = {
  /**
   * תוכן הדף
   */
  children: PropTypes.node,
  /**
   * className נוסף
   */
  className: PropTypes.string,
  /**
   * סגנון מותאם אישית
   */
  style: PropTypes.object,
  /**
   * האם להשתמש ברוחב מלא ללא הגבלה
   */
  fluid: PropTypes.bool,
  /**
   * הגבלת רוחב מקסימלי (כשfluid = false)
   */
  maxWidth: PropTypes.string
};

export default PageContainer;