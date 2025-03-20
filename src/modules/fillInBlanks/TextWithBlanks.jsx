import React, { useState, useEffect } from 'react';

/**
 * רכיב להצגת טקסט עם חללים למילוי
 * @param {Object} props - פרופס הרכיב
 * @param {string} props.text - טקסט עם סימוני חללים למילוי [blank1], [blank2], וכו'
 * @param {Object} props.blanks - מידע על חללים למילוי {blank1: {answer:"תשובה", ...}, ...}
 * @param {Array} props.wordBank - מאגר מילים לבחירה (אופציונלי)
 * @param {boolean} props.showWordBank - האם להציג את מאגר המילים
 * @param {boolean} props.isAnswered - האם התשובות הוגשו לבדיקה
 * @param {Function} props.onBlankChange - פונקציה שתופעל בשינוי תוכן חלל
 * @param {Function} props.onSubmit - פונקציה שתופעל בהגשת התשובות
 */
export function TextWithBlanks({
  text = '',
  blanks = {},
  wordBank = [],
  showWordBank = true,
  isAnswered = false,
  onBlankChange,
  onSubmit
}) {
  // מצב פנימי של תשובות המשתמש
  const [userAnswers, setUserAnswers] = useState({});
  // מילים שכבר נבחרו ממאגר המילים
  const [selectedWords, setSelectedWords] = useState([]);
  
  // איפוס תשובות בעת שינוי הטקסט
  useEffect(() => {
    setUserAnswers({});
    setSelectedWords([]);
  }, [text, blanks]);
  
  // מציאת כל הזיהויים של חללי מילוי בטקסט
  const findBlanks = (text) => {
    const regex = /\[(.*?)\]/g;
    let match;
    const blankPositions = [];
    
    while ((match = regex.exec(text)) !== null) {
      blankPositions.push({
        id: match[1],
        start: match.index,
        end: match.index + match[0].length
      });
    }
    
    return blankPositions;
  };
  
  // עדכון תשובה לחלל
  const handleBlankChange = (blankId, value) => {
    const newAnswers = { ...userAnswers, [blankId]: value };
    setUserAnswers(newAnswers);
    
    if (onBlankChange) {
      onBlankChange(blankId, value, newAnswers);
    }
  };
  
  // בחירת מילה ממאגר המילים
  const handleWordSelect = (word, blankId) => {
    // עדכון רשימת המילים שנבחרו
    if (!selectedWords.includes(word)) {
      setSelectedWords([...selectedWords, word]);
    }
    
    // עדכון התשובה בחלל המתאים
    handleBlankChange(blankId, word);
  };
  
  // בדיקה אם מילה כבר נבחרה
  const isWordSelected = (word) => {
    return selectedWords.includes(word);
  };
  
  // הגשת התשובות לבדיקה
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(userAnswers);
    }
  };
  
  // רינדור הטקסט עם החללים
  const renderTextWithBlanks = () => {
    const blankPositions = findBlanks(text);
    if (blankPositions.length === 0) return text;
    
    let lastIndex = 0;
    const elements = [];
    
    blankPositions.forEach((blank, index) => {
      // הוספת הטקסט שלפני החלל
      if (blank.start > lastIndex) {
        elements.push(
          <span key={`text-${index}`}>
            {text.substring(lastIndex, blank.start)}
          </span>
        );
      }
      
      // הוספת החלל
      const blankId = blank.id;
      const answer = userAnswers[blankId] || '';
      const isCorrect = isAnswered ? 
        isAnswerCorrect(blankId, answer) : null;
      
      elements.push(
        <span key={`blank-${blankId}`} className="inline-block mx-1">
          <input
            type="text"
            value={answer}
            onChange={(e) => handleBlankChange(blankId, e.target.value)}
            className={`
              border-b-2 px-1 text-center min-w-[80px] focus:outline-none
              ${isAnswered 
                ? (isCorrect 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-red-500 bg-red-50')
                : 'border-gray-400 focus:border-blue-500'}
            `}
            placeholder="..."
            disabled={isAnswered}
          />
          {isAnswered && (
            <span className="mr-1">
              {isCorrect ? (
                <span className="text-green-600 text-xs">✓</span>
              ) : (
                <span className="text-red-600 text-xs">✗</span>
              )}
            </span>
          )}
        </span>
      );
      
      lastIndex = blank.end;
    });
    
    // הוספת הטקסט שאחרי החלל האחרון
    if (lastIndex < text.length) {
      elements.push(
        <span key="text-last">
          {text.substring(lastIndex)}
        </span>
      );
    }
    
    return <div className="text-lg leading-relaxed">{elements}</div>;
  };
  
  // בדיקה אם תשובה נכונה
  const isAnswerCorrect = (blankId, userAnswer) => {
    const blankInfo = blanks[blankId];
    if (!blankInfo) return false;
    
    const correctAnswer = blankInfo.answer;
    const caseSensitive = blankInfo.caseSensitive || false;
    
    // בדיקת תשובה מדויקת
    if (caseSensitive) {
      if (userAnswer === correctAnswer) return true;
    } else {
      if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) return true;
    }
    
    // בדיקת תשובות אלטרנטיביות
    if (blankInfo.acceptAlternatives && Array.isArray(blankInfo.acceptAlternatives)) {
      return blankInfo.acceptAlternatives.some(alt => 
        caseSensitive ? alt === userAnswer : alt.toLowerCase() === userAnswer.toLowerCase()
      );
    }
    
    return false;
  };
  
  return (
    <div className="space-y-6">
      {/* הטקסט עם החללים */}
      {renderTextWithBlanks()}
      
      {/* מאגר מילים */}
      {showWordBank && wordBank.length > 0 && !isAnswered && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">בחר מילה:</h3>
          <div className="flex flex-wrap gap-2">
            {wordBank.map((word, index) => (
              <button
                key={`word-${index}`}
                className={`
                  py-1 px-3 rounded-lg text-sm
                  ${isWordSelected(word) 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer'}
                `}
                onClick={() => {
                  // מציאת החלל הראשון שעדיין ריק
                  const emptyBlankId = Object.keys(blanks).find(
                    blankId => !userAnswers[blankId]
                  );
                  if (emptyBlankId && !isWordSelected(word)) {
                    handleWordSelect(word, emptyBlankId);
                  }
                }}
                disabled={isWordSelected(word)}
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* כפתור הגשה */}
      {!isAnswered && (
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            בדוק תשובות
          </button>
        </div>
      )}
    </div>
  );
}