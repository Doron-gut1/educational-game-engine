import React from 'react';
import { Button } from '../../design-system/components';
import { Card } from './Card';

/**
 * רכיב להצגת רמזים בצורה מדורגת
 * @param {Object} props - פרופס הרכיב
 * @param {Array} props.hints - מערך כל הרמזים האפשריים
 * @param {Function} props.onRequestHint - פונקציה לבקשת רמז נוסף
 * @param {Array} props.revealedHints - מערך הרמזים שכבר נחשפו
 * @param {boolean} props.canRevealMore - האם ניתן לחשוף רמזים נוספים
 * @param {number} props.hintsUsed - מספר הרמזים שנחשפו
 * @param {number} props.maxHints - מספר הרמזים המקסימלי לרמת הקושי הנוכחית
 */
export function HintsPanel({ 
  hints = [], 
  onRequestHint, 
  revealedHints = [], 
  canRevealMore = true,
  hintsUsed = 0,
  maxHints = 3,
  className = ''
}) {
  // אם אין רמזים בכלל, לא מציג את הפאנל
  if (hints.length === 0) {
    return null;
  }
  
  return (
    <div className={`mt-4 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">רמזים</h3>
        <span className="text-sm text-gray-500">
          {hintsUsed} מתוך {maxHints} רמזים
        </span>
      </div>
      
      {revealedHints.length > 0 && (
        <div className="space-y-2 mb-3">
          {revealedHints.map((hint, index) => (
            <Card key={index} variant="primary" className="p-3 bg-indigo-50">
              <div className="flex items-start">
                <div className="flex-shrink-0 ml-2 mt-1">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium">
                    {index + 1}
                  </span>
                </div>
                <div className="text-indigo-900">{hint}</div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {canRevealMore ? (
        <Button 
          onClick={onRequestHint} 
          variant="outline" 
          size="small" 
          className="w-full bg-white hover:bg-indigo-50"
        >
          גלה רמז {hintsUsed + 1}
        </Button>
      ) : revealedHints.length === 0 ? (
        <p className="text-sm text-gray-500 text-center">אין רמזים זמינים ברמת קושי זו</p>
      ) : (
        <p className="text-sm text-gray-500 text-center">כל הרמזים נחשפו</p>
      )}
    </div>
  );
}