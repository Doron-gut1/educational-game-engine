// src/modules/sorting/SortingGame.jsx
import React, { useState, useEffect } from 'react';
import { SortableItem } from './SortableItem';
import { SortingContainer } from './SortingContainer';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Button } from '../../design-system/components';
import { useGameContext } from '../../contexts/GameContext';
import { useScoring } from '../../hooks/useScoring';
import { useHints } from '../../hooks/useHints';  // הוק חדש - src/hooks/useHints.js
import { HintsPanel } from '../../components/ui/HintsPanel';  // רכיב חדש - src/components/ui/HintsPanel.jsx
import { SourceReference } from '../../components/ui/SourceReference';  // רכיב חדש - src/components/ui/SourceReference.jsx
import { LearningPopup } from '../../components/ui/LearningPopup';  // רכיב חדש - src/components/ui/LearningPopup.jsx

/**
 * משחק מיון אייטמים לפי סדר או לקטגוריות
 * @param {Object} props - פרופס הרכיב
 * @param {Array} props.games - מערך משחקי מיון
 * @param {Function} props.onComplete - פונקציה שתופעל בסיום המשחק
 * @param {string} props.title - כותרת המשחק
 * @param {number} props.basePoints - נקודות בסיס לכל מיון נכון
 * @param {Array} props.hints - רמזים למשחק
 * @param {Object} props.sourceReference - מקור ורפרנס לשאלות
 * @param {Object} props.learningPopup - מידע לחלון סיכום הלמידה
 */
export function SortingGame({
  games = [],
  onComplete,
  title = 'משחק מיון',
  basePoints = 10,
  hints = [],
  sourceReference = null,
  learningPopup = null
}) {
  const { state } = useGameContext();
  const { addScore } = useScoring();
  
  // מצב המשחק
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [sourceItems, setSourceItems] = useState([]);
  const [targetContainers, setTargetContainers] = useState([]);
  const [draggedItemId, setDraggedItemId] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [correctSorts, setCorrectSorts] = useState(0);
  const [totalSorts, setTotalSorts] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [showLearningPopup, setShowLearningPopup] = useState(false);
  
  // שימוש בהוק רמזים
  const { 
    canRevealHint, 
    revealNextHint, 
    getRevealedHints,
    hintsUsed,
    maxHints
  } = useHints(currentGame?.hints || hints);
  
  // המשחק הנוכחי
  const currentGame = games[currentGameIndex] || null;
  
  // אתחול משחק חדש
  useEffect(() => {
    if (!currentGame) return;
    
    initializeGame(currentGame);
  }, [currentGameIndex, currentGame]);
  
  // אתחול משחק מיון חדש
  const initializeGame = (game) => {
    setIsAnswered(false);
    
    // הגדרת סוג המשחק: לפי סדר (sequence) או לפי קטגוריות (categories)
    const isCategoryGame = game.sortType === 'categories';
    
    // אתחול פריטי המקור
    const items = [...(game.items || [])].map(item => ({
      ...item,
      status: 'default',
      containerId: null
    }));
    
    // ערבוב הפריטים אם נדרש
    if (game.shuffleItems !== false) {
      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
      }
    }
    
    setSourceItems(items);
    
    // אתחול מיכלי היעד
    if (isCategoryGame) {
      // מיכלים לפי קטגוריות
      const containers = (game.categories || []).map(category => ({
        id: category.id,
        title: category.name,
        items: []
      }));
      setTargetContainers(containers);
    } else {
      // מיכל אחד עבור מיון לפי סדר
      setTargetContainers([{
        id: 'sequence',
        title: game.title || 'סדר את הפריטים',
        items: []
      }]);
    }
  };
  
  // טיפול בתחילת גרירה
  const handleDragStart = (itemId) => {
    setDraggedItemId(itemId);
    
    // הסרת הפריט מהמיכל הנוכחי אם יש
    const itemIndex = sourceItems.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
      const item = sourceItems[itemIndex];
      
      // אם הפריט נמצא במיכל יעד, נסיר אותו משם תחילה
      if (item.containerId) {
        removeItemFromContainer(item.id, item.containerId);
      }
    }
  };
  
  // בקשת רמז
  const handleRequestHint = () => {
    revealNextHint();
  };
  
  // הסרת פריט ממיכל יעד
  const removeItemFromContainer = (itemId, containerId) => {
    setTargetContainers(containers => 
      containers.map(container => {
        if (container.id === containerId) {
          return {
            ...container,
            items: container.items.filter(i => i.id !== itemId)
          };
        }
        return container;
      })
    );
    
    // עדכון מצב הפריט במקור
    setSourceItems(items => 
      items.map(item => 
        item.id === itemId ? { ...item, containerId: null } : item
      )
    );
  };
  
  // הוספת פריט למיכל יעד
  const addItemToContainer = (itemId, containerId, position = -1) => {
    // מציאת הפריט במקור
    const itemIndex = sourceItems.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;
    
    const item = sourceItems[itemIndex];
    
    // עדכון מצב הפריט במקור
    const updatedSourceItems = sourceItems.map(i => 
      i.id === itemId ? { ...i, containerId } : i
    );
    setSourceItems(updatedSourceItems);
    
    // הוספת הפריט למיכל היעד
    setTargetContainers(containers => 
      containers.map(container => {
        if (container.id === containerId) {
          const updatedItems = [...container.items];
          
          // הסרת הפריט אם כבר קיים במיכל (למקרה של שינוי מיקום)
          const existingIndex = updatedItems.findIndex(i => i.id === itemId);
          if (existingIndex !== -1) {
            updatedItems.splice(existingIndex, 1);
          }
          
          // הוספת הפריט במיקום הנכון
          if (position >= 0 && position <= updatedItems.length) {
            updatedItems.splice(position, 0, item);
          } else {
            updatedItems.push(item);
          }
          
          return {
            ...container,
            items: updatedItems
          };
        }
        return container;
      })
    );
  };
  
  // טיפול בסגירת חלון הלמידה
  const handleCloseLearningPopup = () => {
    setShowLearningPopup(false);
    if (onComplete) {
      onComplete(totalScore);
    }
  };
  
  // טיפול בבדיקת תשובות
  const handleCheckAnswers = () => {
    if (!currentGame) return;
    
    setIsAnswered(true);
    
    const isCategoryGame = currentGame.sortType === 'categories';
    let score = 0;
    let correct = 0;
    let total = 0;
    
    // עדכון סטטוס כל פריט
    const updatedSourceItems = [...sourceItems];
    
    if (isCategoryGame) {
      // בדיקת מיון לפי קטגוריות
      targetContainers.forEach(container => {
        container.items.forEach(item => {
          const itemIndex = updatedSourceItems.findIndex(i => i.id === item.id);
          if (itemIndex !== -1) {
            const sourceItem = updatedSourceItems[itemIndex];
            const itemCategory = currentGame.items.find(i => i.id === item.id)?.category;
            const isCorrect = itemCategory === container.id;
            
            total++;
            
            if (isCorrect) {
              correct++;
              const points = sourceItem.points || basePoints;
              score += points;
              updatedSourceItems[itemIndex].status = 'correct';
            } else {
              updatedSourceItems[itemIndex].status = 'incorrect';
            }
          }
        });
      });
    } else {
      // בדיקת מיון לפי סדר
      const sequenceContainer = targetContainers.find(c => c.id === 'sequence');
      if (sequenceContainer) {
        sequenceContainer.items.forEach((item, index) => {
          const itemIndex = updatedSourceItems.findIndex(i => i.id === item.id);
          if (itemIndex !== -1) {
            const sourceItem = updatedSourceItems[itemIndex];
            const correctPosition = currentGame.items.find(i => i.id === item.id)?.correctPosition;
            
            // במיון לפי סדר, correctPosition מתחיל מ-1 בד"כ
            const isCorrect = correctPosition === index + 1;
            
            total++;
            
            if (isCorrect) {
              correct++;
              const points = sourceItem.points || basePoints;
              score += points;
              updatedSourceItems[itemIndex].status = 'correct';
            } else {
              updatedSourceItems[itemIndex].status = 'incorrect';
            }
          }
        });
      }
    }
    
    // עדכון מצב המשחק
    setSourceItems(updatedSourceItems);
    setTotalScore(prevScore => prevScore + score);
    setCorrectSorts(prevCorrect => prevCorrect + correct);
    setTotalSorts(prevTotal => prevTotal + total);
    
    // הוספת הניקוד למשחק הכללי
    addScore(score);
  };
  
  // מעבר למשחק הבא
  const handleNextGame = () => {
    if (currentGameIndex < games.length - 1) {
      setCurrentGameIndex(prevIndex => prevIndex + 1);
    } else {
      // אם הוגדר חלון למידה, יש להציג אותו לפני הסיום
      if (learningPopup) {
        setShowLearningPopup(true);
      } else {
        setShowSummary(true);
      }
    }
  };
  
  // סיום המשחק
  const handleComplete = () => {
    if (onComplete) {
      onComplete(totalScore);
    }
  };
  
  // רינדור פריט מקור
  const renderSourceItem = (item) => {
    return (
      <SortableItem
        key={item.id}
        id={item.id}
        content={item.content || item.text}
        type={item.type || 'text'}
        status={item.status}
        isDragging={draggedItemId === item.id}
        isDisabled={isAnswered}
        onDragStart={handleDragStart}
      />
    );
  };
  
  // רינדור פריט במיכל יעד
  const renderTargetItem = (item) => {
    const sourceItem = sourceItems.find(i => i.id === item.id);
    if (!sourceItem) return null;
    
    return (
      <SortableItem
        key={item.id}
        id={item.id}
        content={sourceItem.content || sourceItem.text}
        type={sourceItem.type || 'text'}
        status={sourceItem.status}
        isDragging={draggedItemId === item.id}
        isDisabled={isAnswered}
        onDragStart={handleDragStart}
      />
    );
  };
  
  // אם אין משחקים
  if (!currentGame) {
    return <div>לא נמצאו משחקי מיון</div>;
  }
  
  // הצגת סיכום בסיום המשחק
  if (showSummary) {
    const accuracy = totalSorts > 0 
      ? Math.round((correctSorts / totalSorts) * 100) 
      : 0;
      
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-4">סיכום</h2>
        <p className="text-xl mb-4">צברת {totalScore} נקודות</p>
        <p className="text-lg mb-2">מיינת נכון {correctSorts} מתוך {totalSorts} פריטים</p>
        <p className="text-lg mb-6">דיוק: {accuracy}%</p>
        
        <Button onClick={handleComplete} size="large">סיים</Button>
      </div>
    );
  }
  
  // הגדרת כיוון הצגת הפריטים
  const orientation = currentGame.orientation || 'vertical';
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="text-sm text-gray-500">
          משחק {currentGameIndex + 1} מתוך {games.length}
        </div>
      </div>
      
      <ProgressBar 
        value={currentGameIndex} 
        max={games.length - 1} 
        color="primary" 
      />
      
      {/* תיאור המשחק (אם יש) */}
      {currentGame.description && (
        <p className="text-gray-700 mb-4">{currentGame.description}</p>
      )}
      
      {/* מקור ורפרנס */}
      {(sourceReference || currentGame.sourceReference) && (
        <SourceReference 
          source={currentGame.sourceReference?.source || sourceReference?.source}
          reference={currentGame.sourceReference?.reference || sourceReference?.reference}
          expandable={true}
          initiallyExpanded={false}
          className="mb-4"
        />
      )}
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-6">
          {/* מיכלי היעד */}
          <div className="space-y-4">
            {targetContainers.map(container => (
              <SortingContainer
                key={container.id}
                id={container.id}
                title={container.title}
                items={container.items}
                orientation={orientation}
                status={isAnswered ? 
                  (container.items.some(item => 
                    sourceItems.find(i => i.id === item.id)?.status === 'incorrect'
                  ) ? 'incorrect' : 'default') 
                  : 'default'
                }
                isDropDisabled={isAnswered}
                onItemAdded={(itemId, position) => addItemToContainer(itemId, container.id, position)}
                renderItem={renderTargetItem}
              />
            ))}
          </div>
          
          {/* פריטי המקור */}
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-2">פריטים למיון</h3>
            <div className={`
              grid grid-cols-1 ${orientation === 'horizontal' ? 'sm:grid-cols-2 md:grid-cols-3' : ''} 
              gap-2
            `}>
              {sourceItems
                .filter(item => !item.containerId)
                .map(item => renderSourceItem(item))
              }
            </div>
          </div>
          
          {/* פאנל רמזים */}
          <HintsPanel 
            hints={currentGame.hints || hints}
            revealedHints={getRevealedHints()}
            canRevealMore={canRevealHint()}
            onRequestHint={handleRequestHint}
            hintsUsed={hintsUsed}
            maxHints={maxHints}
          />
          
          {/* כפתור בדיקה */}
          {!isAnswered && (
            <div className="flex justify-end mt-6">
              <Button 
                onClick={handleCheckAnswers}
                disabled={targetContainers.every(c => c.items.length === 0)}
              >
                בדוק תשובות
              </Button>
            </div>
          )}
          
          {/* כפתור למעבר למשחק הבא */}
          {isAnswered && (
            <div className="flex justify-end mt-6">
              <Button onClick={handleNextGame}>
                {currentGameIndex < games.length - 1 ? 'המשחק הבא' : 'סיום'}
              </Button>
            </div>
          )}
        </div>
      </div>
      
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