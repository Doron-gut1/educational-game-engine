import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card } from './Card';

/**
 * רכיב להצגת רמזים לחידות ושאלות
 */
export const HintsPanel = ({
  hints = [],
  revealedHints = [],
  canRevealMore = true,
  onRequestHint = () => {},
  hintsUsed = 0,
  maxHints = 3,
  className = '',
  ...props
}) => {
  const [expanded, setExpanded] = useState(false);
  
  // בדיקה אם יש רמזים נגלים
  const hasRevealedHints = revealedHints.length > 0;
  
  // בדיקה אם יש יותר רמזים שניתן לחשוף
  const hasMoreHints = canRevealMore && revealedHints.length < hints.length && hintsUsed < maxHints;
  
  // פתיחה/סגירה של האקורדיון
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  // מבקש רמז נוסף
  const handleRequestHint = () => {
    if (canRevealMore) {
      onRequestHint();
    }
  };
  
  // אם אין רמזים בכלל, לא מציגים את הרכיב
  if (hints.length === 0) {
    return null;
  }
  
  return (
    <div className={`border rounded-md ${className}`} {...props}>
      {/* כותרת הפאנל */}
      <button
        onClick={toggleExpanded}
        className="w-full p-3 flex justify-between items-center bg-blue-50 hover:bg-blue-100 transition-colors text-right"
      >
        <div className="flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 text-blue-500 transition-transform ${expanded ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        <div className="font-bold text-blue-700">
          רמזים {hasRevealedHints ? `(${revealedHints.length}/${hints.length})` : ''}
        </div>
      </button>
      
      {/* תוכן הפאנל */}
      {expanded && (
        <div className="p-4 border-t">
          {/* רמזים שנגלו */}
          {hasRevealedHints ? (
            <div className="space-y-3">
              {revealedHints.map((hint, index) => (
                <Card key={index} className="p-3 bg-blue-50">
                  <p className="text-sm text-blue-800">
                    <span className="font-bold">רמז {index + 1}: </span>
                    {hint}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 mb-3">אין עדיין רמזים שנגלו.</p>
          )}
          
          {/* כפתור לבקשת רמז נוסף */}
          {hasMoreHints && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleRequestHint}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                גלה רמז {revealedHints.length + 1}
                <span className="text-xs mr-2">
                  ({maxHints - hintsUsed} רמזים נותרו)
                </span>
              </button>
            </div>
          )}
          
          {/* אם נגמרו הרמזים */}
          {!hasMoreHints && revealedHints.length < hints.length && (
            <div className="mt-4 text-center text-amber-600 text-sm">
              השתמשת בכל הרמזים הזמינים בשלב זה.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

HintsPanel.propTypes = {
  /**
   * רשימת כל הרמזים האפשריים
   */
  hints: PropTypes.arrayOf(PropTypes.string),
  /**
   * רשימת הרמזים שכבר נגלו
   */
  revealedHints: PropTypes.arrayOf(PropTypes.string),
  /**
   * האם ניתן לחשוף רמזים נוספים
   */
  canRevealMore: PropTypes.bool,
  /**
   * פונקציה שמופעלת כשהמשתמש מבקש רמז נוסף
   */
  onRequestHint: PropTypes.func,
  /**
   * מספר הרמזים שכבר השתמשו בהם
   */
  hintsUsed: PropTypes.number,
  /**
   * מספר הרמזים המקסימלי שניתן להשתמש
   */
  maxHints: PropTypes.number,
  /**
   * className נוסף
   */
  className: PropTypes.string
};

export default HintsPanel;