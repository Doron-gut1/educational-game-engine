// src/modules/dragAndDrop/DragDropGame.jsx
import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DraggableItem } from './DraggableItem';
import { DropZone } from './DropZone';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useScoring } from '../../hooks/useScoring';
import { useHints } from '../../hooks/useHints';  // הוק חדש - src/hooks/useHints.js
import HintsPanel from '../../components/ui/HintsPanel';  // רכיב חדש - שינוי מהייבוא הקודם
import SourceReference from '../../components/ui/SourceReference';  // רכיב חדש - שינוי מהייבוא הקודם
import LearningPopup from '../../components/ui/LearningPopup';  // רכיב חדש - שינוי מהייבוא הקודם

// ייבוא מערכת העיצוב החדשה
import { Button } from '../../design-system/components';

/**
 * משחק גרירה והשלכה
 * @param {Object} props - פרופס הרכיב
 * @param {Array} props.items - פריטים לגרירה
 * @param {Array} props.dropZones - אזורי יעד להשלכה
 * @param {Function} props.onComplete - פונקציה שתופעל בסיום המשחק
 * @param {string} props.title - כותרת המשחק
 * @param {number} props.basePoints - נקודות בסיס להתאמה נכונה
 * @param {Array} props.hints - רמזים למשחק
 * @param {Object} props.sourceReference - מקור ורפרנס לשאלות
 * @param {Object} props.learningPopup - מידע לחלון סיכום הלמידה
 */
export function DragDropGame({
  items = [],
  dropZones = [],
  onComplete,
  title = 'גרור ושדך',
  description = '',
  basePoints = 10,
  showFeedbackImmediately = true,
  hints = [],
  sourceReference = null,
  learningPopup = null
}) {
  const { addScore } = useScoring();
  
  // מצב פריטים שהושלכו
  const [droppedItems, setDroppedItems] = useState({});
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showLearningPopup, setShowLearningPopup] = useState(false);
  
  // שימוש בהוק רמזים
  const { 
    canRevealHint, 
    revealNextHint, 
    getRevealedHints,
    hintsUsed,
    maxHints
  } = useHints(hints);
  
  // סופר פריטים שהושלכו
  const countDroppedItems = Object.keys(droppedItems).length;
  
  // בדיקה אם כל הפריטים הושלכו
  const allItemsDropped = countDroppedItems === items.length;
  
  // טיפול בהשלכת פריט
  const handleItemDrop = (itemId, dropZoneId) => {
    // בדיקה אם הפריט כבר מושלך
    const existingDropZone = Object.entries(droppedItems).find(
      ([_, zoneItem]) => zoneItem === itemId
    )?.[0];
    
    // אם הפריט כבר באזור הזה, אין צורך לעשות כלום
    if (existingDropZone === dropZoneId) return;
    
    // אם הפריט באזור אחר, מסירים אותו משם
    if (existingDropZone) {
      const newDroppedItems = { ...droppedItems };
      delete newDroppedItems[existingDropZone];
      setDroppedItems(newDroppedItems);
    }
    
    // אם יש פריט אחר באזור היעד, מחליפים ביניהם
    const itemInTargetZone = droppedItems[dropZoneId];
    
    setDroppedItems(prev => {
      const newDroppedItems = { ...prev };
      newDroppedItems[dropZoneId] = itemId;
      return newDroppedItems;
    });
    
    // בדיקת נכונות מיידית אם הגדרת
    if (showFeedbackImmediately) {
      setFeedbackVisible(true);
    }
    
    // בדיקה אם כל הפריטים הושלכו
    if (countDroppedItems + 1 === items.length && !existingDropZone) {
      setFeedbackVisible(true);
    }
  };
  
  // שחרור פריט מאזור השלכה
  const handleItemRelease = (itemId) => {
    // מציאת האזור שהפריט נמצא בו
    const dropZoneId = Object.entries(droppedItems).find(
      ([_, id]) => id === itemId
    )?.[0];
    
    // אם נמצא, מסירים אותו
    if (dropZoneId) {
      setDroppedItems(prev => {
        const newDroppedItems = { ...prev };
        delete newDroppedItems[dropZoneId];
        return newDroppedItems;
      });
    }
  };
  
  // בקשת רמז
  const handleRequestHint = () => {
    revealNextHint();
  };
  
  // בדיקת תוצאות
  const checkResults = () => {
    let correctCount = 0;
    let totalPoints = 0;
    
    // בדיקת כל השלכה
    Object.entries(droppedItems).forEach(([dropZoneId, itemId]) => {
      const item = items.find(item => item.id === itemId);
      if (item && item.category === dropZoneId) {
        correctCount++;
        const points = item.points || basePoints;
        totalPoints += points;
      }
    });
    
    // הוספת ניקוד
    addScore(totalPoints);
    setScore(totalPoints);
    setShowResults(true);
    
    // אם הכל נכון וקיים חלון למידה, יש להציג אותו לפני הסיום
    if (correctCount === items.length) {
      if (learningPopup) {
        setShowLearningPopup(true);
      } else if (onComplete) {
        // אחרת, מסיימים ישירות
        setTimeout(() => {
          onComplete(totalPoints);
        }, 2000);
      }
    }
  };

  // טיפול בסגירת חלון הלמידה
  const handleCloseLearningPopup = () => {
    setShowLearningPopup(false);
    if (onComplete) {
      onComplete(score);
    }
  };
  
  // בדיקה אם פריט מושלך נכון
  const isItemCorrectlyDropped = (itemId) => {
    if (!feedbackVisible) return null;
    
    const item = items.find(item => item.id === itemId);
    const dropZoneId = Object.entries(droppedItems).find(
      ([_, id]) => id === itemId
    )?.[0];
    
    if (!item || !dropZoneId) return null;
    
    return item.category === dropZoneId;
  };
  
  // רינדור תוצאות
  if (showResults) {
    const correctCount = items.reduce((count, item) => {
      const dropZoneId = Object.entries(droppedItems).find(
        ([_, id]) => id === item.id
      )?.[0];
      
      return count + (item.category === dropZoneId ? 1 : 0);
    }, 0);
    
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-4">סיכום</h2>
        <p className="text-xl mb-4">צברת {score} נקודות</p>
        <p className="text-lg mb-6">השלכת נכון {correctCount} מתוך {items.length} פריטים</p>
        
        <Button onClick={() => {
          if (learningPopup) {
            setShowLearningPopup(true);
          } else if (onComplete) {
            onComplete(score);
          }
        }} size="large">סיים</Button>
      </div>
    );
  }
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <div className="text-sm text-gray-500">
            {countDroppedItems} מתוך {items.length} פריטים
          </div>
        </div>
        
        {description && (
          <p className="text-gray-600">{description}</p>
        )}
        
        <ProgressBar 
          value={countDroppedItems} 
          max={items.length} 
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
          {/* אזורי השלכה */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">יעדים</h3>
            {dropZones.map(zone => (
              <DropZone
                key={zone.id}
                id={zone.id}
                label={zone.label}
                onItemDrop={(itemId) => handleItemDrop(itemId, zone.id)}
                droppedItem={droppedItems[zone.id]}
                items={items}
                isCorrect={feedbackVisible ? 
                  (droppedItems[zone.id] ? isItemCorrectlyDropped(droppedItems[zone.id]) : null) : 
                  null
                }
              />
            ))}
          </div>
          
          {/* פריטים לגרירה */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">פריטים</h3>
            <div className="bg-gray-50 p-4 rounded-lg min-h-[200px] flex flex-wrap gap-3">
              {items.map(item => {
                // בדיקה אם הפריט כבר מושלך
                const isDropped = Object.values(droppedItems).includes(item.id);
                const isCorrect = isItemCorrectlyDropped(item.id);
                
                return isDropped ? null : (
                  <DraggableItem
                    key={item.id}
                    id={item.id}
                    type={item.type || 'text'}
                    content={item.content || item.text}
                    isCorrect={isCorrect}
                  />
                );
              })}
            </div>
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
        
        {/* כפתור בדיקה */}
        {!showFeedbackImmediately && allItemsDropped && (
          <div className="flex justify-center mt-4">
            <Button onClick={checkResults} size="large">בדוק תוצאות</Button>
          </div>
        )}
        
        {/* כפתור סיום */}
        {feedbackVisible && (
          <div className="flex justify-center mt-4">
            <Button onClick={checkResults} size="large">הצג תוצאות</Button>
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
    </DndProvider>
  );
}