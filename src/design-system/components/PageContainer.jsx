import React from 'react';
import PropTypes from 'prop-types';

/**
 * רכיב מיכל (container) לדף שלם
 */
export const PageContainer = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`min-h-screen w-full ${className}`}
      {...props}
    >
      {children}
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
  className: PropTypes.string
};

export default PageContainer;