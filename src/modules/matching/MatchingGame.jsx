// src/modules/matching/MatchingGame.jsx
import React, { useState, useEffect } from 'react';
import { MatchCard } from './MatchCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useScoring } from '../../hooks/useScoring';
import { useHints } from '../../hooks/useHints';  // הוק חדש - src/hooks/useHints.js
import HintsPanel from '../../components/ui/HintsPanel';  // רכיב חדש - תיקון אופן הייבוא
import SourceReference from '../../components/ui/SourceReference';  // רכיב חדש - תיקון אופן הייבוא
import LearningPopup from '../../components/ui/LearningPopup';  // רכיב חדש - תיקון אופן הייבוא

// ייבוא מערכת העיצוב החדשה
import { Button } from '../../design-system/components';

/**
 * משחק התאמה בין פריטים
 * @param {Object} props - פרופס הרכיב
 * @param {Array} props.pairs - זוגות להתאמה
 * @param {Function} props.onComplete - פונקציה שתופעל בסיום המשחק
 * @param {string} props.title - כותרת המשחק
 * @param {string} props.instructions - הוראות המשחק
 * @param {boolean} props.shuffleItems - האם לערבב את הפריטים
 * @param {number} props.basePoints - נקודות בסיס למציאת זוג
 * @param {Array} props.hints - רמזים למשחק
 * @param {Object} props.sourceReference - מקור ורפרנס לשאלות
 * @param {Object} props.learningPopup - מידע לחלון סיכום הלמידה
 */
export function MatchingGame({
  pairs = [],
  onComplete,
  title = 'משחק התאמה',
  instructions = 'חברו בין הפריטים המתאימים',
  shuffleItems = true,
  basePoints = 10,
  hints = [],
  sourceReference = null,
  learningPopup = null
}) {
  const { addScore } = useScoring();
  
  // שומרים את הפריטים בצורה נפרדת לאחר פיצול הזוגות
  const [items1, setItems1] = useState([]);
  const [items2, setItems2] = useState([]);
  
  // מצב היחידות
  const [selectedItem1, setSelectedItem1] = useState(null); // מהצד השמאלי
  const [selectedItem2, setSelectedItem2] = useState(null); // מהצד הימני
  const [matchedPairs, setMatchedPairs] = useState([]);
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
  
  // פיצול הזוגות לשתי רשימות נפרדות
  useEffect(() => {
    const left = pairs.map(pair => ({
      id: `left-${pair.id}`,
      content: pair.item1,
      pairId: pair.id
    }));
    
    const right = pairs.map(pair => ({
      id: `right-${pair.id}`,
      content: pair.item2,
      pairId: pair.id
    }));
    
    // ערבוב אם נדרש
    if (shuffleItems) {
      setItems1([...left].sort(() => Math.random() - 0.5));
      setItems2([...right].sort(() => Math.random() - 0.5));
    } else {
      setItems1(left);
      setItems2(right);
    }
  }, [pairs, shuffleItems]);
  
  // בקשת רמז
  const handleRequestHint = () => {
    revealNextHint();
  };
  
  // בחירת פריט מהצד השמאלי
  const handleSelectItem1 = (itemId) => {
    // אם הפריט כבר מותאם, לא עושים כלום
    if (matchedPairs.includes(items1.find(item => item.id === itemId)?.pairId)) {
      return;
    }
    
    setSelectedItem1(itemId);
    
    // אם יש כבר בחירה מהצד השני, בודקים התאמה
    if (selectedItem2) {
      checkMatch(itemId, selectedItem2);
    }
  };
  
  // בחירת פריט מהצד הימני
  const handleSelectItem2 = (itemId) => {
    // אם הפריט כבר מותאם, לא עושים כלום
    if (matchedPairs.includes(items2.find(item => item.id === itemId)?.pairId)) {
      return;
    }
    
    setSelectedItem2(itemId);
    
    // אם יש כבר בחירה מהצד השני, בודקים התאמה
    if (selectedItem1) {
      checkMatch(selectedItem1, itemId);
    }
  };
  
  // טיפול בסגירת חלון הלמידה
  const handleCloseLearningPopup = () => {
    setShowLearningPopup(false);
    if (onComplete) {
      onComplete(score);
    }
  };
  
  // בדיקת התאמה בין שני פריטים שנבחרו
  const checkMatch = (id1, id2) => {
    const item1 = items1.find(item => item.id === id1);
    const item2 = items2.find(item => item.id === id2);
    
    if (item1 && item2 && item1.pairId === item2.pairId) {
      // התאמה מוצלחת
      setMatchedPairs(prev => [...prev, item1.pairId]);
      
      // הוספת ניקוד
      const pair = pairs.find(p => p.id === item1.pairId);
      const points = pair.points || basePoints;
      setScore(prev => prev + points);
      addScore(points);
      
      // איפוס בחירות
      setSelectedItem1(null);
      setSelectedItem2(null);
      
      // בדיקה אם המשחק הסתיים
      if (matchedPairs.length + 1 === pairs.length) {
        setIsComplete(true);
        
        // אם הוגדר חלון למידה, יש להציג אותו לפני הסיום
        if (learningPopup) {
          setTimeout(() => {
            setShowLearningPopup(true);
          }, 1000);
        } else if (onComplete) {
          setTimeout(() => {
            onComplete(score + points);
          }, 1500);
        }
      }
    } else {
      // התאמה לא מוצלחת, איפוס לאחר השהייה
      setTimeout(() => {
        setSelectedItem1(null);
        setSelectedItem2(null);
      }, 1000);
    }
  };
  
  // בדיקה אם פריט מסוים מותאם
  const isPairMatched = (pairId) => {
    return matchedPairs.includes(pairId);
  };
  
  // סיום המשחק
  const handleComplete = () => {
    if (learningPopup) {
      setShowLearningPopup(true);
    } else if (onComplete) {
      onComplete(score);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="text-sm text-gray-500">
          {matchedPairs.length} מתוך {pairs.length} זוגות
        </div>
      </div>
      
      {instructions && (
        <p className="text-gray-600">{instructions}</p>
      )}
      
      <ProgressBar 
        value={matchedPairs.length} 
        max={pairs.length} 
        color="primary" 
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* טור שמאלי */}
        <div className="space-y-3">
          {items1.map(item => (
            <MatchCard
              key={item.id}
              id={item.id}
              content={item.content}
              isSelected={selectedItem1 === item.id}
              isMatched={isPairMatched(item.pairId)}
              onClick={() => handleSelectItem1(item.id)}
            />
          ))}
        </div>
        
        {/* טור ימני */}
        <div className="space-y-3">
          {items2.map(item => (
            <MatchCard
              key={item.id}
              id={item.id}
              content={item.content}
              isSelected={selectedItem2 === item.id}
              isMatched={isPairMatched(item.pairId)}
              onClick={() => handleSelectItem2(item.id)}
            />
          ))}
        </div>
      </div>
      
      {/* פאנל רמזים */}
      <HintsPanel 
        hints={hints}
        revealedHints={getRevealedHints()}
        canRevealMore={canRevealHint()}
        onRequestHint={handleRequestHint}
        hintsUsed={hintsUsed}
        maxHints={maxHints}
      />
      
      {isComplete && (
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <h3 className="text-xl font-bold text-green-800 mb-2">כל הכבוד! סיימת את המשחק.</h3>
          <p className="mb-4">צברת {score} נקודות</p>
          
          {!showLearningPopup && (
            <Button onClick={handleComplete} size="medium">סיים</Button>
          )}
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