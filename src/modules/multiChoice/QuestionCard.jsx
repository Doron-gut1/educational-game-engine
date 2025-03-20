import React from 'react';
import { Card } from '../../components/ui/Card';

/**
 * כרטיס שאלה עם אופציות לבחירה
 * @param {Object} props - פרופס הרכיב
 * @param {Object} props.question - מידע השאלה
 * @param {Array} props.options - אופציות התשובה
 * @param {string} props.selectedOption - האופציה שנבחרה
 * @param {boolean} props.isAnswered - האם נענתה תשובה
 * @param {boolean} props.isCorrect - האם התשובה נכונה
 * @param {Function} props.onOptionSelect - פונקציה שתופעל בבחירת אופציה
 */
export function QuestionCard({
  question,
  options = [],
  selectedOption,
  isAnswered,
  isCorrect,
  onOptionSelect
}) {
  if (!question) return null;
  
  return (
    <Card shadow="medium" className="overflow-hidden">
      <div className="p-6">
        {/* תמונת שאלה (אם יש) */}
        {question.image && (
          <div className="mb-4 flex justify-center">
            <img 
              src={question.image} 
              alt="תמונת שאלה" 
              className="max-h-64 rounded-lg"
            />
          </div>
        )}
        
        {/* טקסט השאלה */}
        <h3 className="text-xl font-bold mb-4">{question.text}</h3>
        
        {/* סווג דוגמה (אם יש) */}
        {question.example && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-700">{question.example}</p>
          </div>
        )}
        
        {/* אופציות תשובה */}
        <div className="space-y-3 mt-6">
          {options.map((option) => {
            // חישוב סטיילים בהתאם למצב
            const isSelected = selectedOption === option.id;
            let bgColorClass = 'bg-white hover:bg-gray-50';
            let borderColorClass = 'border-gray-200';
            
            if (isAnswered) {
              if (option.correct) {
                bgColorClass = 'bg-green-50';
                borderColorClass = 'border-green-500';
              } else if (isSelected) {
                bgColorClass = 'bg-red-50';
                borderColorClass = 'border-red-500';
              }
            } else if (isSelected) {
              bgColorClass = 'bg-blue-50';
              borderColorClass = 'border-blue-500';
            }
            
            return (
              <div 
                key={option.id}
                onClick={() => !isAnswered && onOptionSelect(option.id)}
                className={`
                  p-4 rounded-lg border-2 ${borderColorClass} ${bgColorClass}
                  transition-all duration-200 cursor-pointer
                `}
              >
                <div className="flex items-center">
                  {/* תמונת אופציה אם יש */}
                  {option.image && (
                    <div className="ml-3 flex-shrink-0">
                      <img 
                        src={option.image} 
                        alt="" 
                        className="w-12 h-12 object-contain rounded"
                      />
                    </div>
                  )}
                  
                  {/* טקסט האופציה */}
                  <div className="flex-grow">
                    <p className="text-gray-900">{option.text}</p>
                  </div>
                  
                  {/* מסמן אם נבחר */}
                  {isSelected && (
                    <div className="ml-3 flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* הסבר תשובה */}
      {isAnswered && question.explanation && (
        <div className={`p-4 ${isCorrect ? 'bg-green-50' : 'bg-red-50'} border-t`}>
          <div className="flex items-center mb-2">
            {isCorrect ? (
              <>
                <svg className="w-5 h-5 text-green-600 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-bold text-green-800">כל הכבוד!</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 text-red-600 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-bold text-red-800">לא ממש נכון</span>
              </>
            )}
          </div>
          <p className="text-gray-700">{question.explanation}</p>
        </div>
      )}
    </Card>
  );
}