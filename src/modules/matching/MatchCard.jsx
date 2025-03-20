import React from 'react';

/**
 * כרטיס למשחק התאמה
 * @param {Object} props - פרופס הרכיב
 * @param {Object} props.item - פריט להצגה
 * @param {boolean} props.isMatched - האם הפריט הותאם
 * @param {boolean} props.isSelected - האם הפריט נבחר
 * @param {Function} props.onClick - פונקציה שתופעל בלחיצה
 */
export function MatchCard({
  item,
  isMatched = false,
  isSelected = false,
  onClick
}) {
  if (!item) return null;
  
  // החלטה על סוג התוכן להציג (טקסט או תמונה)
  const content = item.content || item.text;
  const type = item.type || (typeof content === 'string' ? 'text' : 'image');
  const imageUrl = type === 'image' ? content : item.image;
  
  // חישוב סטיילים בהתאם למצב
  let bgClass = 'bg-white';
  let borderClass = 'border-gray-200';
  
  if (isMatched) {
    bgClass = 'bg-green-50';
    borderClass = 'border-green-500';
  } else if (isSelected) {
    bgClass = 'bg-blue-50';
    borderClass = 'border-blue-500';
  }
  
  return (
    <div 
      onClick={onClick}
      className={`
        p-4 rounded-lg border-2 ${borderClass} ${bgClass}
        transition-all duration-200 
        ${isMatched ? 'opacity-75' : 'hover:shadow-md cursor-pointer'}
      `}
    >
      {type === 'image' ? (
        <div className="flex justify-center">
          <img src={imageUrl} alt="" className="h-20 object-contain" />
        </div>
      ) : (
        <p className="text-gray-900">{content}</p>
      )}
      
      {/* אינדיקטור מצב */}
      {(isMatched || isSelected) && (
        <div className="mt-2 flex justify-end">
          {isMatched ? (
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </span>
          ) : (
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
          )}
        </div>
      )}
    </div>
  );
}