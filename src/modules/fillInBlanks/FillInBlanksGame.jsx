import React, { useState, useEffect } from 'react';
import { TextWithBlanks } from './TextWithBlanks';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Button } from '../../components/ui/Button';
import { useGameContext } from '../../contexts/GameContext';
import { useScoring } from '../../hooks/useScoring';

/**
 * משחק השלמת מילים בטקסט
 * @param {Object} props - פרופס הרכיב
 * @param {Array} props.texts - מערך עם טקסטים להשלמה
 * @param {Function} props.onComplete - פונקציה שתופעל בסיום המשחק
 * @param {string} props.title - כותרת המשחק
 * @param {number} props.basePoints - נקודות בסיס לכל השלמה נכונה
 */
export function FillInBlanksGame({
  texts = [],
  onComplete,
  title = 'השלמת מילים',
  basePoints = 10
}) {
  const { state } = useGameContext();
  const { addScore } = useScoring();
  
  // מצב המשחק
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isAnswered, setIsAnswered] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  
  // הטקסט הנוכחי
  const currentText = texts[currentTextIndex] || null;
  
  // איפוס תשובות בעת מעבר לטקסט חדש
  useEffect(() => {
    setUserAnswers({});
    setIsAnswered(false);
  }, [currentTextIndex]);
  
  // התאמת רמת הקושי
  const getCurrentTextWithDifficulty = () => {
    if (!currentText) return null;
    
    // בדיקה אם יש הגדרות רמת קושי ספציפיות
    if (currentText.difficulty && 
        currentText.difficulty[state.difficulty]) {
      
      const difficultyConfig = currentText.difficulty[state.difficulty];
      
      // שילוב הגדרות הבסיס עם הגדרות רמת הקושי
      return {
        ...currentText,
        wordBank: difficultyConfig.wordBank || currentText.wordBank,
        showWordBank: difficultyConfig.showWordBank !== undefined 
          ? difficultyConfig.showWordBank 
          : currentText.showWordBank
      };
    }
    
    return currentText;
  };
  
  // טיפול בשינוי תשובות
  const handleBlankChange = (blankId, value, newAnswers) => {
    setUserAnswers(newAnswers);
  };
  
  // הגשת תשובות לבדיקה
  const handleSubmit = (answers) => {
    setUserAnswers(answers);
    setIsAnswered(true);
    
    // בדיקת התשובות ומתן ניקוד
    let correct = 0;
    let total = 0;
    let score = 0;
    
    const textWithDifficulty = getCurrentTextWithDifficulty();
    const blanks = textWithDifficulty?.blanks || {};
    
    // בדיקת כל תשובה
    Object.entries(blanks).forEach(([blankId, blankInfo]) => {
      total++;
      
      const userAnswer = answers[blankId] || '';
      const correctAnswer = blankInfo.answer;
      const caseSensitive = blankInfo.caseSensitive || false;
      
      let isCorrect = false;
      
      // בדיקת תשובה מדויקת
      if (caseSensitive) {
        isCorrect = userAnswer === correctAnswer;
      } else {
        isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
      }
      
      // בדיקת תשובות אלטרנטיביות
      if (!isCorrect && blankInfo.acceptAlternatives && Array.isArray(blankInfo.acceptAlternatives)) {
        isCorrect = blankInfo.acceptAlternatives.some(alt => 
          caseSensitive ? alt === userAnswer : alt.toLowerCase() === userAnswer.toLowerCase()
        );
      }
      
      if (isCorrect) {
        correct++;
        const points = blankInfo.points || basePoints;
        score += points;
      }
    });
    
    // עדכון הניקוד
    setTotalScore(prevScore => prevScore + score);
    setCorrectAnswers(prevCorrect => prevCorrect + correct);
    setTotalAnswers(prevTotal => prevTotal + total);
    
    // הוספת הניקוד למשחק הכללי
    addScore(score);
  };
  
  // מעבר לטקסט הבא
  const handleNextText = () => {
    if (currentTextIndex < texts.length - 1) {
      setCurrentTextIndex(prevIndex => prevIndex + 1);
    } else {
      setShowSummary(true);
    }
  };
  
  // סיום המשחק
  const handleComplete = () => {
    if (onComplete) {
      onComplete(totalScore);
    }
  };
  
  // אם אין טקסטים
  if (!currentText) {
    return <div>לא נמצאו טקסטים להשלמה</div>;
  }
  
  // הצגת סיכום בסיום המשחק
  if (showSummary) {
    const accuracy = totalAnswers > 0 
      ? Math.round((correctAnswers / totalAnswers) * 100) 
      : 0;
      
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-4">סיכום</h2>
        <p className="text-xl mb-4">צברת {totalScore} נקודות</p>
        <p className="text-lg mb-2">השלמת נכון {correctAnswers} מתוך {totalAnswers} מילים</p>
        <p className="text-lg mb-6">דיוק: {accuracy}%</p>
        
        <Button onClick={handleComplete} size="large">סיים</Button>
      </div>
    );
  }
  
  // רינדור המשחק
  const textWithDifficulty = getCurrentTextWithDifficulty();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="text-sm text-gray-500">
          טקסט {currentTextIndex + 1} מתוך {texts.length}
        </div>
      </div>
      
      <ProgressBar 
        value={currentTextIndex} 
        max={texts.length - 1} 
        color="primary" 
      />
      
      {/* תיאור הטקסט (אם יש) */}
      {textWithDifficulty.description && (
        <p className="text-gray-700 mb-4">{textWithDifficulty.description}</p>
      )}
      
      {/* רכיב הטקסט עם חללים להשלמה */}
      <div className="bg-white p-6 rounded-lg shadow">
        <TextWithBlanks
          text={textWithDifficulty.text}
          blanks={textWithDifficulty.blanks}
          wordBank={textWithDifficulty.wordBank || []}
          showWordBank={textWithDifficulty.showWordBank !== false}
          isAnswered={isAnswered}
          onBlankChange={handleBlankChange}
          onSubmit={handleSubmit}
        />
      </div>
      
      {/* כפתור למעבר לטקסט הבא */}
      {isAnswered && (
        <div className="flex justify-end mt-4">
          <Button onClick={handleNextText}>
            {currentTextIndex < texts.length - 1 ? 'הטקסט הבא' : 'סיים'}
          </Button>
        </div>
      )}
    </div>
  );
}