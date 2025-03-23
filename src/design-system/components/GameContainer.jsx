import React from 'react';
import PropTypes from 'prop-types';

/**
 * רכיב מיכל (container) לתוכן המשחק
 */
export const GameContainer = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`container mx-auto p-4 rounded-lg shadow-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

GameContainer.propTypes = {
  /**
   * תוכן המשחק
   */
  children: PropTypes.node,
  /**
   * className נוסף
   */
  className: PropTypes.string
};

export default GameContainer;