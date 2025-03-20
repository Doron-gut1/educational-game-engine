import React from 'react';
import { Card } from '../../components/ui/Card';

/**
 * כרטיס פריט להתאמה
 * @param {Object} props - פרופס הרכיב
 * @param {string} props.id - מזהה הכרטיס
 * @param {Object} props.content - תוכן הכרטיס (טקסט או תמונה)
 * @param {boolean} props.isSelected - האם הכרטיס נבחר
 * @param {boolean} props.isMatched - האם הכרטיס הותאם כבר
 * @param {Function} props.onClick - פונקציה שתופעל בלחיצה על הכרטיס
 */
export function MatchCard({ 
  id, 
  content, 
  isSelected = false, 
  isMatched = false, 
  onClick,
  className,
  ...props 
}) {
  // בחירת סטייל בהתאם למצב
  let cardStyle = {};
  let cardClass = '';
  
  if (isMatched) {
    cardClass = 'bg-green-50 border-2 border-green-500';
  } else if (isSelected) {
    cardClass = 'bg-blue-50 border-2 border-blue-500';
  } else {
    cardClass = 'bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50';
  }
  
  // הצגת התוכן בהתאם לסוג
  const renderContent = () => {
    if (!content) return null;
    
    // אם יש הגדרה מפורשת של סוג
    if (content.type) {
      switch (content.type) {
        case 'image':
          return (
            <div className="flex justify-center">
              <img 
                src={content.content} 
                alt=""
                className="max-h-32 max-w-full object-contain"
              />
            </div>
          );
        case 'text':
        default:
          return <p className="text-gray-900">{content.content}</p>;
      }
    }
    
    // אם יש תמונה ישירות
    if (content.image) {
      return (
        <div className="flex justify-center">
          <img 
            src={content.image} 
            alt=""
            className="max-h-32 max-w-full object-contain"
          />
        </div>
      );
    }
    
    // ברירת מחדל - טקסט
    return <p className="text-gray-900">{content.text || content}</p>;
  };
  
  return (
    <div 
      className={`${cardClass} rounded-lg p-4 transition-all cursor-pointer ${isMatched ? 'cursor-default' : ''} ${className || ''}`}
      onClick={!isMatched ? onClick : undefined}
      style={cardStyle}
      {...props}
    >
      <div className="flex items-center min-h-[60px]">
        {renderContent()}
        
        {isMatched && (
          <div className="absolute top-2 right-2">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}