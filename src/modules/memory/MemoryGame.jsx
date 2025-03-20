import React, { useState, useEffect } from 'react';
import { MemoryCard } from './MemoryCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Button } from '../../components/ui/Button';
import { useScoring } from '../../hooks/useScoring';
import { useTimer } from '../../hooks/useTimer';

/**
 * משחק זיכרון - מציאת זוגות של קלפים מתאימים
 * @param {Object} props - פרופס הרכיב
 * @param {Array} props.pairs - מערך זוגות הקלפים
 * @param {Function} props.onComplete - פונקציה שתופעל בסיום המשחק
 * @param {string} props.title - כותרת המשחק
 * @param {Object} props.gridSize - גודל הרשת (rows, cols)
 * @param {number} props.timeLimit - מגבלת זמן בשניות (אופציונלי)
 * @param {number} props.basePoints - נקודות בסיס לזוג מתאים
 * @param {string} props.backImage - תמונת גב הקלף המשותפת
 */
export function MemoryGame({
  pairs = [],
  onComplete,
  title = 'משחק זיכרון',
  gridSize = { rows: 4, cols: 4 },
  timeLimit = 0, // 0 אומר ללא הגבלת זמן
  basePoints = 10,
  backImage = '/assets/shared/ui/card-back.png'
}) {
  const { addScore } = useScoring();
  
  // מצב קלפים
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isCheckingMatch, setIsCheckingMatch] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  
  // טיימר אם מוגדר זמן
  const timer = useTimer({
    initialTime: timeLimit > 0 ? timeLimit : 60,
    isCountdown: timeLimit > 0,
    autoStart: false,
    onTimeUp: () => {
      if (timeLimit > 0) {
        finishGame();
      }
    }
  });
  
  // אתחול המשחק ויצירת הקלפים
  useEffect(() => {
    if (pairs.length === 0) return;
    
    // יצירת זוגות של קלפים
    const gameCards = [];
    
    pairs.forEach((pair, index) => {
      // הוספת שני קלפים לכל זוג
      gameCards.push({
        id: `card-${index}-1`,
        pairId: pair.id,
        front: pair.front,
        back: pair.back || backImage,
        isFlipped: false,
        isMatched: false
      });
      
      gameCards.push({
        id: `card-${index}-2`,
        pairId: pair.id,
        front: pair.front,
        back: pair.back || backImage,
        isFlipped: false,
        isMatched: false
      });
    });
    
    // ערבוב הקלפים
    const shuffledCards = shuffleArray(gameCards);
    setCards(shuffledCards);
    
    // רשת שאינה תואמת את המספר הנדרש
    if (gridSize.rows * gridSize.cols < shuffledCards.length) {
      console.warn('Grid size is too small for the number of cards');
    }
  }, [pairs, backImage, gridSize]);
  
  // פונקציה לערבוב מערך
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  // טיפול בלחיצה על קלף
  const handleCardClick = (cardId) => {
    // אם אנחנו באמצע בדיקת התאמה או שיש כבר 2 קלפים הפוכים, לא נעשה כלום
    if (isCheckingMatch || flippedCards.length >= 2) return;
    
    // בדיקה שהקלף לא הפוך כבר ולא מצא זוג
    const clickedCard = cards.find(card => card.id === cardId);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;
    
    // הפיכת הקלף
    setCards(currentCards => 
      currentCards.map(card => 
        card.id === cardId ? { ...card, isFlipped: true } : card
      )
    );
    
    // התחלת המשחק והטיימר אם זו הקליק הראשונה
    if (!gameStarted) {
      setGameStarted(true);
      if (timeLimit > 0) {
        timer.start();
      }
    }
    
    // הוספה לרשימת הקלפים ההפוכים
    setFlippedCards(prev => [...prev, cardId]);
    
    // אם יש שני קלפים הפוכים, בדיקת התאמה
    if (flippedCards.length === 1) {
      setMoves(moves + 1);
      const firstCardId = flippedCards[0];
      const firstCard = cards.find(card => card.id === firstCardId);
      
      // בדיקה אם יש התאמה
      if (firstCard && firstCard.pairId === clickedCard.pairId) {
        // התאמה!
        const pairId = firstCard.pairId;
        setMatchedPairs(prev => [...prev, pairId]);
        
        // עדכון הקלפים
        setCards(currentCards => 
          currentCards.map(card => 
            card.pairId === pairId ? { ...card, isMatched: true } : card
          )
        );
        
        // הוספת ניקוד
        const points = pairs.find(p => p.id === pairId)?.points || basePoints;
        setTotalScore(prev => prev + points);
        addScore(points);
        
        // ניקוי הקלפים ההפוכים
        setFlippedCards([]);
        
        // בדיקה אם סיימנו את כל הזוגות
        if (matchedPairs.length + 1 === pairs.length) {
          // בונוס זמן אם יש טיימר
          if (timeLimit > 0 && timer.time > 0) {
            const timeBonus = calculateTimeBonus(timeLimit, timer.time);
            if (timeBonus > 0) {
              setTotalScore(prev => prev + timeBonus);
              addScore(timeBonus);
            }
          }
          
          // סיום המשחק לאחר השהייה קצרה
          setTimeout(() => {
            finishGame();
          }, 1000);
        }
      } else {
        // אין התאמה - הפיכת הקלפים בחזרה לאחר השהייה
        setIsCheckingMatch(true);
        setTimeout(() => {
          setCards(currentCards => 
            currentCards.map(card => 
              (card.id === firstCardId || card.id === cardId) && !card.isMatched
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
          setIsCheckingMatch(false);
        }, 1000);
      }
    }
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
    const totalPairs = pairs.length;
    const foundPairs = matchedPairs.length;
    const remainingTime = timer.time;
    const efficiency = moves > 0 ? Math.round((foundPairs * 2 / moves) * 100) : 0;
    
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-4">סיכום</h2>
        <p className="text-xl mb-4">צברת {totalScore} נקודות</p>
        <p className="text-lg mb-2">מצאת {foundPairs} זוגות מתוך {totalPairs}</p>
        <p className="text-lg mb-2">מספר מהלכים: {moves}</p>
        <p className="text-lg mb-6">יעילות: {efficiency}%</p>
        
        {timeLimit > 0 && (
          <p className="text-lg mb-6">זמן שנשאר: {timer.formattedTime}</p>
        )}
        
        <Button onClick={handleComplete} size="large">סיים</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">מהלכים: {moves}</div>
          
          {timeLimit > 0 && (
            <div className="text-xl font-bold">
              {timer.formattedTime}
            </div>
          )}
        </div>
      </div>
      
      <ProgressBar 
        value={matchedPairs.length} 
        max={pairs.length} 
        color="primary" 
        showValue={true}
        label={`${matchedPairs.length} מתוך ${pairs.length} זוגות`}
      />
      
      <div 
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`
        }}
      >
        {cards.map(card => (
          <MemoryCard
            key={card.id}
            id={card.id}
            frontImage={card.front}
            backImage={card.back}
            isFlipped={card.isFlipped || card.isMatched}
            isMatched={card.isMatched}
            onClick={() => handleCardClick(card.id)}
          />
        ))}
      </div>
    </div>
  );
}