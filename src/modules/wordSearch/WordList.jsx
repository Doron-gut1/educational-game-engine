import React from 'react';

/**
 * רכיב רשימת מילים לחיפוש
 * @param {Object} props - פרופס הרכיב
 * @param {Array} props.words - רשימת המילים לחיפוש
 * @param {Array} props.foundWords - רשימת המילים שכבר נמצאו
 * @param {string} props.title - כותרת הרשימה
 */
export function WordList({
  words = [],
  foundWords = [],
  title = 'מילים לחיפוש',
  className,
  ...props
}) {
  // מיצוי הנתונים בפורמט אחיד
  const normalizedWords = words.map(word => {
    if (typeof word === 'string') {
      return { word, found: false };
    } else {
      return { ...word, found: false };
    }
  });
  
  // סימון מילים שנמצאו
  const wordsWithStatus = normalizedWords.map(wordObj => {
    const found = foundWords.some(foundWord => {
      if (typeof foundWord === 'string') {
        return foundWord === wordObj.word;
      } else {
        return foundWord.word === wordObj.word;
      }
    });
    
    return { ...wordObj, found };
  });
  
  // מיון - מילים שנמצאו בסוף
  const sortedWords = [...wordsWithStatus].sort((a, b) => {
    if (a.found && !b.found) return 1;
    if (!a.found && b.found) return -1;
    return 0;
  });
  
  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className || ''}`} {...props}>
      <h3 className="font-bold text-lg mb-3">{title}</h3>
      
      <div className="space-y-2">
        {sortedWords.map((wordObj, index) => (
          <div 
            key={`word-${index}`}
            className={`
              flex items-center p-2 rounded-md
              ${wordObj.found ? 'bg-green-100' : 'bg-gray-50'}
              transition-colors
            `}
          >
            {/* מילה */}
            <div className="flex-grow font-medium">
              <span className={wordObj.found ? 'line-through text-green-700' : 'text-gray-800'}>
                {wordObj.word}
              </span>
            </div>
            
            {/* סטטוס */}
            <div className="flex-shrink-0 ml-2">
              {wordObj.found ? (
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* סיכום */}
      <div className="mt-4 text-center text-sm text-gray-600">
        {foundWords.length} מתוך {words.length} מילים נמצאו
      </div>
    </div>
  );
}