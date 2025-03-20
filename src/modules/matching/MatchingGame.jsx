import React, { useState, useEffect } from 'react';
import { MatchCard } from './MatchCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Button } from '../../components/ui/Button';
import { useScoring } from '../../hooks/useScoring';
import { useTimer } from '../../hooks/useTimer';

/**
 * משחק התאמות בין פריטים
 * @param {Object} props - פרופס הרכיב
 * @param {Array} props.pairs - זוגות להתאמה
 * @param {Function} props.onComplete - פונקציה שתופעל בסיום המשחק
 * @param {string} props.title - כותרת המשחק
 * @param {string} props.description - תיאור המשחק
 * @param {boolean} props.shuffleItems - האם לערבב את הפריטים
 * @param {number} props.basePoints - נקודות בסיס לזוג מתאים
 * @param {number} props.timeLimit - מגבלת זמן בשניות (אופציונלי)
 */
export function MatchingGame({
  pairs = [],
  onComplete,
  title = 'משחק התאמות',
  description = 'התאם את הפריטים המתאימים',
  shuffleItems = true,
  basePoints = 10,
  timeLimit = 0 // 0 משמעו ללא מגבלת זמן
}) {
  const { addScore } = useScoring();
  
  // הכנת הפריטים
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  
  // מצב המשחק
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  
  // טיימר אם מוגדר זמן
  const timer = useTimer({
    initialTime: timeLimit > 0 ? timeLimit : 60,
    isCountdown: timeLimit > 0,
    autoStart: timeLimit > 0,
    onTimeUp: () => {
      if (timeLimit > 0) {
        finishGame();
      }
    }
  });
  
  // הכנת הפריטים
  useEffect(() => {
    if (pairs.length === 0) return;
    
    // יצירת מערך של פריטים משמאל
    const left = pairs.map(pair => ({
      id: `left-${pair.id}`,
      pairId: pair.id,
      ...pair.item1
    }));
    
    // יצירת מערך של פריטים מימין
    const right = pairs.map(pair => ({
      id: `right-${pair.id}`,
      pairId: pair.id,
      ...pair.item2
    }));
    
    // ערבוב הפריטים אם נדרש
    if (shuffleItems) {
      setLeftItems(shuffleArray([...left]));
      setRightItems(shuffleArray([...right]));
    } else {
      setLeftItems(left);
      setRightItems(right);
    }
  }, [pairs, shuffleItems]);
  
  // פונקציה לערבוב מערך
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  // בחירת פריט משמאל
  const handleLeftSelect = (itemId) => {
    // אם הפריט כבר נמצא בזוג מתאים, אין לאפשר בחירה
    const isAlreadyMatched = matchedPairs.some(match => 
      match.leftId === itemId || match.rightId === selectedRight
    );
    
    if (isAlreadyMatched) return;
    
    setSelectedLeft(itemId);
    
    // אם יש גם פריט מימין, בדיקת התאמה
    if (selectedRight) {
      checkMatch(itemId, selectedRight);
    }
  };
  
  // בחירת פריט מימין
  const handleRightSelect = (itemId) => {
    // אם הפריט כבר נמצא בזוג מתאים, אין לאפשר בחירה
    const isAlreadyMatched = matchedPairs.some(match => 
      match.rightId === itemId || match.leftId === selectedLeft
    );
    
    if (isAlreadyMatched) return;
    
    setSelectedRight(itemId);
    
    // אם יש גם פריט משמאל, בדיקת התאמה
    if (selectedLeft) {
      checkMatch(selectedLeft, itemId);
    }
  };
  
  // בדיקת התאמה בין שני פריטים
  const checkMatch = (leftId, rightId) => {
    setAttempts(prev => prev + 1);
    
    const leftItem = leftItems.find(item => item.id === leftId);
    const rightItem = rightItems.find(item => item.id === rightId);
    
    // בדיקה אם ה-pairId תואם
    const isMatch = leftItem && rightItem && leftItem.pairId === rightItem.pairId;
    
    if (isMatch) {
      // הוספת הזוג לרשימת ההתאמות
      setMatchedPairs(prev => [
        ...prev,
        { leftId, rightId, pairId: leftItem.pairId }
      ]);
      
      // הוספת ניקוד
      const points = pairs.find(p => p.id === leftItem.pairId)?.points || basePoints;
      setTotalScore(prev => prev + points);
      addScore(points);
      
      // בדיקה אם סיימנו את כל הזוגות
      if (matchedPairs.length + 1 === pairs.length) {
        // אם יש טיימר, הוספת בונוס זמן
        if (timeLimit > 0) {
          const timeBonus = calculateTimeBonus(timeLimit, timer.time);
          if (timeBonus > 0) {
            setTotalScore(prev => prev + timeBonus);
            addScore(timeBonus);
          }
        }
        
        // השהייה קצרה לפני הצגת הסיכום
        setTimeout(() => {
          finishGame();
        }, 1000);
      }
    }
    
    // ניקוי הבחירות
    setSelectedLeft(null);
    setSelectedRight(null);
  };
  
  // חישוב בונוס זמן
  const calculateTimeBonus = (maxTime, remainingTime) => {
    // בונוס יחסי לזמן שנשאר
    return Math.round((remainingTime / maxTime) * basePoints * pairs.length * 0.5);
  };
  
  // סיום המשחק
  const finishGame = () => {
    if (timer.isRunning) {
      timer.stop();
    }
    setShowSummary(true);
  };
  
  // השלמת המשחק
  const handleComplete = () => {
    if (onComplete) {
      onComplete(totalScore);
    }
  };
  
  // הצגת מסך סיכום
  if (showSummary) {
    const successRate = attempts > 0 ? Math.round((matchedPairs.length / attempts) * 100) : 0;
    
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-4">סיכום</h2>
        <p className="text-xl mb-4">צברת {totalScore} נקודות</p>
        <p className="text-lg mb-2">מצאת {matchedPairs.length} זוגות מתוך {pairs.length}</p>
        <p className="text-lg mb-6">אחוז הצלחה: {successRate}%</p>
        
        {timeLimit > 0 && (
          <p className="text-lg mb-6">זמן שנותר: {timer.formattedTime}</p>
        )}
        
        <Button onClick={handleComplete} size="large">סיים</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          {description && <p className="text-gray-600">{description}</p>}
        </div>
        
        {timeLimit > 0 && (
          <div className="text-xl font-bold">
            {timer.formattedTime}
          </div>
        )}
      </div>
      
      <ProgressBar 
        value={matchedPairs.length} 
        max={pairs.length} 
        color="primary" 
        showValue={true}
        label={`${matchedPairs.length} מתוך ${pairs.length} זוגות`}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* עמודה שמאלית */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">פריטים</h3>
          <div className="space-y-2">
            {leftItems.map(item => {
              const isMatched = matchedPairs.some(match => match.leftId === item.id);
              const isSelected = selectedLeft === item.id;
              
              return (
                <MatchCard
                  key={item.id}
                  item={item}
                  isMatched={isMatched}
                  isSelected={isSelected}
                  onClick={() => !isMatched && handleLeftSelect(item.id)}
                />
              );
            })}
          </div>
        </div>
        
        {/* עמודה ימנית */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">התאמות</h3>
          <div className="space-y-2">
            {rightItems.map(item => {
              const isMatched = matchedPairs.some(match => match.rightId === item.id);
              const isSelected = selectedRight === item.id;
              
              return (
                <MatchCard
                  key={item.id}
                  item={item}
                  isMatched={isMatched}
                  isSelected={isSelected}
                  onClick={() => !isMatched && handleRightSelect(item.id)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}