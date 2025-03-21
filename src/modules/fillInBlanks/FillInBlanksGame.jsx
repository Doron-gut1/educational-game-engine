import React, { useState } from 'react';
import { TextWithBlanks } from './TextWithBlanks';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useScoring } from '../../hooks/useScoring';
import { useHints } from '../../hooks/useHints';  // הוק חדש
import  HintsPanel  from '../../components/ui/HintsPanel';  // רכיב חדש
import  SourceReference  from '../../components/ui/SourceReference';  // רכיב חדש
import  LearningPopup  from '../../components/ui/LearningPopup';  // רכיב חדש

// ייבוא מערכת העיצוב החדשה
import { Button, ScrollCard as Card } from '../../design-system/components';

/**
 * משחק השלמת מילים בטקסט
 * @param {Object} props - פרופס של הרכיב
 * @param {string} props.text - הטקסט עם חללים למילוי
 * @param {Object} props.blanks - מילון של החללים והתשובות הנכונות
 * @param {Array} props.wordBank - בנק מילים לבחירה
 * @param {boolean} props.showWordBank - האם להציג את בנק המילים
 * @param {Function} props.onComplete - פונקציה שתופעל בסיום המשחק
 * @param {number} props.basePoints - נקודות בסיס להשלמה נכונה
 * @param {Object} props.sourceReference - מקור ורפרנס לשאלות
 * @param {Object} props.learningPopup - מידע לחלון סיכום הלמידה
 */
export function FillInBlanksGame({
  text = '',
  blanks = {},
  wordBank = [],
  showWordBank = true,
  title = 'השלם את החסר',
  description = 'השלם את המילים החסרות בטקסט',
  onComplete,
  basePoints = 10,
  hints = [],
  sourceReference = null,
  learningPopup = null
}) {
  const { addScore } = useScoring();
  const [filledValues, setFilledValues] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [results, setResults] = useState({});
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showLearningPopup, setShowLearningPopup] = useState(false);
  
  // שימוש בהוק רמזים
  const { 
    canRevealHint, 
    revealNextHint, 
    getRevealedHints,
    hintsUsed,
    maxHints
  } = useHints(hints);
  
  // עדכון מילה שהושלמה
  const handleFillBlank = (blankId, value) => {
    setFilledValues(prev => ({
      ...prev,
      [blankId]: value
    }));
    
    // אם יש כבר תוצאות, לנקות אותן כי משהו השתנה
    if (isChecked) {
      setIsChecked(false);
      setResults({});
    }
  };
  
  // בדיקת תשובות
  const checkAnswers = () => {
    const newResults = {};
    let correct = 0;
    let points = 0;
    
    Object.entries(blanks).forEach(([blankId, blankInfo]) => {
      const userAnswer = filledValues[blankId] || '';
      const correctAnswer = blankInfo.answer || '';
      const caseSensitive = blankInfo.caseSensitive || false;
      const acceptAlternatives = blankInfo.acceptAlternatives || [];
      
      let isCorrect = false;
      
      // בדיקת תשובה נכונה - גם בתוספת עם חלופות
      if (caseSensitive) {
        isCorrect = userAnswer === correctAnswer || acceptAlternatives.includes(userAnswer);
      } else {
        isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase() ||
                   acceptAlternatives.some(alt => alt.toLowerCase() === userAnswer.toLowerCase());
      }
      
      newResults[blankId] = isCorrect;
      
      if (isCorrect) {
        correct++;
        points += basePoints;
      }
    });
    
    setResults(newResults);
    setIsChecked(true);
    setScore(points);
    
    // אם הכל נכון, מסמן כהושלם
    const allCorrect = Object.values(newResults).every(result => result === true);
    if (allCorrect) {
      setIsComplete(true);
      addScore(points);
    }
  };
  
  // בקשת רמז
  const handleRequestHint = () => {
    revealNextHint();
  };
  
  // סיום המשחק
  const handleComplete = () => {
    // אם הוגדר חלון למידה, יש להציג אותו לפני הסיום
    if (learningPopup && !showLearningPopup) {
      setShowLearningPopup(true);
    } else if (onComplete) {
      onComplete(score);
    }
  };
  
  // חישוב אחוז השלמה
  const calculateCompletion = () => {
    const totalBlanks = Object.keys(blanks).length;
    const filledBlanks = Object.keys(filledValues).length;
    return (filledBlanks / totalBlanks) * 100;
  };
  
  // חישוב אחוז הצלחה
  const calculateSuccessRate = () => {
    if (!isChecked) return 0;
    
    const totalBlanks = Object.keys(blanks).length;
    const correctBlanks = Object.values(results).filter(res => res === true).length;
    return (correctBlanks / totalBlanks) * 100;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{title}</h2>
        {isChecked && (
          <div className="text-sm text-gray-500">
            {calculateSuccessRate().toFixed(0)}% נכון
          </div>
        )}
      </div>
      
      {description && (
        <p className="text-gray-600">{description}</p>
      )}
      
      <ProgressBar 
        value={calculateCompletion()} 
        max={100} 
        color={isChecked ? calculateSuccessRate() === 100 ? "success" : "warning" : "primary"}
      />
      
      {/* מקור ורפרנס */}
      {sourceReference && (
        <SourceReference 
          source={sourceReference.source}
          reference={sourceReference.reference}
          expandable={true}
          initiallyExpanded={false}
          className="mb-4"
        />
      )}
      
      <Card className="p-6">
        <TextWithBlanks
          text={text}
          blanks={blanks}
          filledValues={filledValues}
          onFill={handleFillBlank}
          wordBank={wordBank}
          showWordBank={showWordBank}
          results={isChecked ? results : null}
          isChecked={isChecked}
        />
      </Card>
      
      {/* פאנל רמזים */}
      <HintsPanel 
        hints={hints}
        revealedHints={getRevealedHints()}
        canRevealMore={canRevealHint()}
        onRequestHint={handleRequestHint}
        hintsUsed={hintsUsed}
        maxHints={maxHints}
      />
      
      <div className="flex justify-end space-x-4 space-x-reverse">
        {!isChecked && (
          <Button onClick={checkAnswers} disabled={Object.keys(filledValues).length === 0}>
            בדוק תשובות
          </Button>
        )}
        
        {isChecked && (
          <Button 
            onClick={handleComplete} 
            variant={isComplete ? "primary" : "outline"}
          >
            {isComplete ? "סיים" : "נסה שוב"}
          </Button>
        )}
      </div>
      
      {/* חלון סיכום למידה */}
      {learningPopup && (
        <LearningPopup
          isOpen={showLearningPopup}
          onClose={() => {
            setShowLearningPopup(false);
            if (onComplete) onComplete(score);
          }}
          onContinue={() => {
            setShowLearningPopup(false);
            if (onComplete) onComplete(score);
          }}
          title={learningPopup.title || "מה למדנו?"}
          keyPoints={learningPopup.keyPoints || []}
          mainValue={learningPopup.mainValue || ""}
          thinkingPoints={learningPopup.thinkingPoints || []}
          familyActivity={learningPopup.familyActivity || ""}
        />
      )}
    </div>
  );
}