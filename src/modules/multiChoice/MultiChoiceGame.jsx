import React, { useState, useEffect } from 'react';
import { QuestionCard } from './QuestionCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Button } from '../../components/ui/Button';
import { useGameContext } from '../../contexts/GameContext';
import { useScoring } from '../../hooks/useScoring';
import { useHints } from '../../hooks/useHints';  // הוק חדש
import { HintsPanel } from '../../components/ui/HintsPanel';  // רכיב חדש
import { SourceReference } from '../../components/ui/SourceReference';  // רכיב חדש
import { LearningPopup } from '../../components/ui/LearningPopup';  // רכיב חדש

/**
 * משחק שאלות רב-ברירה
 * @param {Object} props - פרופס הרכיב
 * @param {Array} props.questions - רשימת שאלות
 * @param {Function} props.onComplete - פונקציה שתופעל בסיום המשחק
 * @param {string} props.title - כותרת המשחק
 * @param {number} props.basePoints - נקודות בסיס לתשובה נכונה
 * @param {Object} props.sourceReference - מקור ורפרנס לשאלות
 * @param {Object} props.learningPopup - מידע לחלון סיכום הלמידה
 */
export function MultiChoiceGame({ 
  questions = [], 
  onComplete, 
  title = 'שאלות רב-ברירה',
  basePoints = 10,
  sourceReference = null,
  learningPopup = null
}) {
  const { state } = useGameContext();
  const { addScore } = useScoring();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [showLearningPopup, setShowLearningPopup] = useState(false);
  
  const currentQuestion = questions[currentQuestionIndex] || null;
  
  // שימוש בהוק רמזים
  const { 
    canRevealHint, 
    revealNextHint, 
    getRevealedHints,
    hintsUsed,
    maxHints,
    resetHints
  } = useHints(currentQuestion?.hints || []);
  
  // איפוס בעת שינוי שאלה
  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    resetHints();
  }, [currentQuestionIndex, resetHints]);
  
  // פילטור אופציות לפי רמת קושי
  const getFilteredOptions = () => {
    if (!currentQuestion) return [];
    
    // בדיקה אם יש הגדרות ספציפיות לרמת קושי
    if (currentQuestion.difficulty && 
        currentQuestion.difficulty[state.difficulty]) {
      
      const difficultyConfig = currentQuestion.difficulty[state.difficulty];
      
      // אם יש רשימת אופציות ספציפית
      if (difficultyConfig.options) {
        const optionIds = difficultyConfig.options;
        let filteredOptions = currentQuestion.options.filter(option => 
          optionIds.includes(option.id)
        );
        
        // אם יש אופציות נוספות לרמות קשות
        if (difficultyConfig.additionalOptions) {
          filteredOptions = [...filteredOptions, ...difficultyConfig.additionalOptions];
        }
        
        return filteredOptions;
      }
    }
    
    // ברירת מחדל - החזרת כל האופציות
    return currentQuestion.options;
  };
  
  const handleOptionSelect = (optionId) => {
    if (isAnswered) return;
    
    setSelectedOption(optionId);
    
    const selectedOption = currentQuestion.options.find(opt => opt.id === optionId);
    const correct = selectedOption?.correct || false;
    
    setIsAnswered(true);
    setIsCorrect(correct);
    
    if (correct) {
      const points = currentQuestion.points || basePoints;
      setTotalScore(prev => prev + points);
      addScore(points);
    }
    
    setAnsweredQuestions(prev => prev + 1);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // אם הוגדר חלון למידה, יש להציג אותו לפני הסיום
      if (learningPopup) {
        setShowLearningPopup(true);
      } else {
        setShowSummary(true);
      }
    }
  };
  
  const handleRequestHint = () => {
    revealNextHint();
  };
  
  const handleCloseLearningPopup = () => {
    setShowLearningPopup(false);
    setShowSummary(true);
  };
  
  const handleComplete = () => {
    if (onComplete) {
      onComplete(totalScore);
    }
  };
  
  if (!currentQuestion) {
    return <div>לא נמצאו שאלות</div>;
  }
  
  if (showSummary) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-4">סיכום</h2>
        <p className="text-xl mb-4">צברת {totalScore} נקודות</p>
        <p className="text-lg mb-6">ענית נכון על {totalScore / basePoints} מתוך {questions.length} שאלות</p>
        
        <Button onClick={handleComplete} size="large">סיים</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="text-sm text-gray-500">שאלה {currentQuestionIndex + 1} מתוך {questions.length}</div>
      </div>
      
      <ProgressBar 
        value={currentQuestionIndex} 
        max={questions.length - 1} 
        color="primary" 
      />
      
      {/* מקור ורפרנס */}
      {(sourceReference || currentQuestion.sourceReference) && (
        <SourceReference 
          source={currentQuestion.sourceReference?.source || sourceReference?.source}
          reference={currentQuestion.sourceReference?.reference || sourceReference?.reference}
          expandable={true}
          initiallyExpanded={false}
          className="mb-4"
        />
      )}
      
      <QuestionCard
        question={currentQuestion}
        options={getFilteredOptions()}
        selectedOption={selectedOption}
        isAnswered={isAnswered}
        isCorrect={isCorrect}
        onOptionSelect={handleOptionSelect}
      />
      
      {/* פאנל רמזים */}
      <HintsPanel 
        hints={currentQuestion.hints || []}
        revealedHints={getRevealedHints()}
        canRevealMore={canRevealHint()}
        onRequestHint={handleRequestHint}
        hintsUsed={hintsUsed}
        maxHints={maxHints}
      />
      
      {isAnswered && (
        <div className="flex justify-end mt-4">
          <Button onClick={handleNextQuestion}>
            {currentQuestionIndex < questions.length - 1 ? 'השאלה הבאה' : 'סיים'}
          </Button>
        </div>
      )}
      
      {/* חלון סיכום למידה */}
      {learningPopup && (
        <LearningPopup
          isOpen={showLearningPopup}
          onClose={handleCloseLearningPopup}
          onContinue={handleCloseLearningPopup}
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