import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useGameContext } from '../../contexts/GameContext';
import { useScoring } from '../../hooks/useScoring';
import { useHints } from '../../hooks/useHints';

// ייבוא מערכת העיצוב החדשה
import { 
  Button, 
  Card, 
  HintsPanel, 
  SourceReference, 
  LearningPopup,
  ProgressTracker
} from '../../design-system/components';

/**
 * רכיב משחק גרירה והשלכה
 * @param {Object} props - פרופס הרכיב
 * @param {Array} props.items - פריטים לגרירה
 * @param {Array} props.dropZones - אזורי יעד להשלכה
 * @param {Function} props.onComplete - פונקציה שתופעל בסיום המשחק
 * @param {string} props.title - כותרת המשחק
 * @param {number} props.basePoints - נקודות בסיס
 * @param {Object} props.sourceReference - מקור ורפרנס 
 * @param {Object} props.learningPopup - חלון סיכום למידה
 */
export function DragDropGame({
  items = [],
  dropZones = [],
  onComplete,
  title = 'גרירה והשלכה',
  basePoints = 15,
  sourceReference = null,
  learningPopup = null
}) {
  const { state, getAssetPath, handleImageError } = useGameContext();
  const { addScore } = useScoring();
  
  // מצב המשחק
  const [availableItems, setAvailableItems] = useState([]);
  const [zones, setZones] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showLearningPopup, setShowLearningPopup] = useState(false);
  
  // שימוש בהוק הרמזים
  const { 
    canRevealHint, 
    revealNextHint, 
    getRevealedHints,
    hintsUsed,
    maxHints
  } = useHints([...(items || []), ...(dropZones || [])].flatMap(item => item.hints || []));
  
  // אתחול הפריטים והאזורים
  useEffect(() => {
    // עיבוד הפריטים לגרירה - כולל תמונות אם יש
    const processedItems = items.map(item => ({
      ...item,
      image: item.image ? getAssetPath(item.image, 'images') : null
    }));
    
    // עיבוד אזורי היעד - כולל תמונות אם יש
    const processedZones = dropZones.map(zone => ({
      ...zone,
      image: zone.image ? getAssetPath(zone.image, 'images') : null,
      items: [] // מאתחל את הפריטים באזור כמערך ריק
    }));
    
    setAvailableItems(processedItems);
    setZones(processedZones);
  }, [items, dropZones, getAssetPath]);
  
  // טיפול בגרירה והשלכה
  const handleDragEnd = (result) => {
    const { source, destination } = result;
    
    // אם אין יעד או היעד זהה למקור - לא קרה שינוי
    if (!destination || (source.droppableId === destination.droppableId && 
                        source.index === destination.index)) {
      return;
    }
    
    // העתקת מצב נוכחי
    let newAvailable = [...availableItems];
    let newZones = [...zones];
    
    // גרירה ממאגר הפריטים הזמינים
    if (source.droppableId === 'available') {
      // העתקת הפריט
      const [draggedItem] = newAvailable.splice(source.index, 1);
      
      // הוספה לאזור היעד
      const targetZoneIndex = newZones.findIndex(z => z.id === destination.droppableId);
      if (targetZoneIndex >= 0) {
        newZones[targetZoneIndex].items.splice(destination.index, 0, draggedItem);
      }
    }
    // גרירה מאזור אחד לאזור אחר
    else if (destination.droppableId !== source.droppableId) {
      // מציאת אזור המקור והיעד
      const sourceZoneIndex = newZones.findIndex(z => z.id === source.droppableId);
      const targetZoneIndex = newZones.findIndex(z => z.id === destination.droppableId);
      
      if (sourceZoneIndex >= 0 && targetZoneIndex >= 0) {
        // העברת הפריט בין האזורים
        const [draggedItem] = newZones[sourceZoneIndex].items.splice(source.index, 1);
        newZones[targetZoneIndex].items.splice(destination.index, 0, draggedItem);
      }
    }
    // סידור מחדש באותו אזור
    else {
      const zoneIndex = newZones.findIndex(z => z.id === source.droppableId);
      if (zoneIndex >= 0) {
        // סידור מחדש בתוך האזור
        const [draggedItem] = newZones[zoneIndex].items.splice(source.index, 1);
        newZones[zoneIndex].items.splice(destination.index, 0, draggedItem);
      }
    }
    
    // עדכון המצב
    setAvailableItems(newAvailable);
    setZones(newZones);
    
    // בדיקה האם המשחק הושלם (כל הפריטים במקום)
    if (newAvailable.length === 0) {
      // בדיקת נכונות: האם כל פריט נמצא באזור הנכון
      const isAllCorrect = newZones.every(zone => {
        // בדיקה שכל הפריטים באזור אכן שייכים אליו
        return zone.items.every(item => item.correctZone === zone.id);
      });
      
      if (isAllCorrect) {
        // חישוב ניקוד
        const finalScore = basePoints - (hintsUsed * 2); // הורדת נקודות על שימוש ברמזים
        setScore(finalScore);
        addScore(finalScore);
        setIsCorrect(true);
      } else {
        setIsCorrect(false);
      }
      
      setIsComplete(true);
      setShowFeedback(true);
    }
  };
  
  // לחיצה על כפתור ההמשך
  const handleContinue = () => {
    // אם יש חלון סיכום למידה, הצג אותו
    if (learningPopup && isCorrect) {
      setShowLearningPopup(true);
    } else {
      // אחרת, סיום המשחק
      if (onComplete) {
        onComplete(score);
      }
    }
  };
  
  // סגירת חלון הלמידה וסיום המשחק
  const handleCloseLearningPopup = () => {
    setShowLearningPopup(false);
    if (onComplete) {
      onComplete(score);
    }
  };
  
  // בקשת רמז
  const handleRequestHint = () => {
    revealNextHint();
  };
  
  // ניסיון מחדש
  const handleReset = () => {
    // איפוס המשחק
    const processedItems = items.map(item => ({
      ...item,
      image: item.image ? getAssetPath(item.image, 'images') : null
    }));
    
    const processedZones = dropZones.map(zone => ({
      ...zone,
      image: zone.image ? getAssetPath(zone.image, 'images') : null,
      items: []
    }));
    
    setAvailableItems(processedItems);
    setZones(processedZones);
    setIsComplete(false);
    setIsCorrect(false);
    setShowFeedback(false);
    setScore(0);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      
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
      
      <DragDropContext onDragEnd={handleDragEnd}>
        {/* אזור הפריטים הזמינים */}
        <Droppable droppableId="available" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`p-4 min-h-16 rounded border-2 ${
                snapshot.isDraggingOver ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
              } flex flex-wrap gap-4 mb-6`}
            >
              {availableItems.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`p-3 rounded border cursor-pointer ${
                        snapshot.isDragging ? 'bg-blue-100 shadow-lg' : 'bg-white'
                      }`}
                    >
                      {item.image ? (
                        <div className="flex flex-col items-center text-center">
                          <img 
                            src={item.image} 
                            alt={item.text || "פריט"} 
                            className="h-16 w-auto object-contain mb-2" 
                            onError={handleImageError}
                          />
                          <span>{item.text}</span>
                        </div>
                      ) : (
                        <span>{item.text}</span>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {availableItems.length === 0 && !isComplete && (
                <div className="text-gray-500 p-2">גרור את כל הפריטים לאזורים המתאימים</div>
              )}
            </div>
          )}
        </Droppable>
        
        {/* אזורי היעד */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {zones.map((zone) => (
            <Card key={zone.id} className="relative overflow-hidden">
              <h3 className="text-lg font-bold mb-2">{zone.title}</h3>
              {zone.image && (
                <img 
                  src={zone.image} 
                  alt={zone.title || "אזור"} 
                  className="h-32 w-full object-cover mb-3 rounded" 
                  onError={handleImageError}
                />
              )}
              
              <Droppable droppableId={zone.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-24 p-3 rounded border-2 ${
                      snapshot.isDraggingOver ? 'border-green-300 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    {zone.items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 rounded border mb-2 last:mb-0 ${
                              snapshot.isDragging ? 'bg-blue-100 shadow-lg' : 'bg-white'
                            }`}
                          >
                            {item.image ? (
                              <div className="flex flex-col items-center text-center">
                                <img 
                                  src={item.image} 
                                  alt={item.text || "פריט"} 
                                  className="h-16 w-auto object-contain mb-2" 
                                  onError={handleImageError}
                                />
                                <span>{item.text}</span>
                              </div>
                            ) : (
                              <span>{item.text}</span>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {zone.items.length === 0 && (
                      <div className="text-gray-400 p-2">גרור פריטים לכאן</div>
                    )}
                  </div>
                )}
              </Droppable>
            </Card>
          ))}
        </div>
      </DragDropContext>
      
      {/* פאנל רמזים */}
      <HintsPanel 
        hints={getRevealedHints()}
        canRevealMore={canRevealHint()}
        onRequestHint={handleRequestHint}
        hintsUsed={hintsUsed}
        maxHints={maxHints}
      />
      
      {/* משוב על המצב הנוכחי */}
      {showFeedback && (
        <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-100' : 'bg-red-100'} mb-4`}>
          <h3 className={`text-lg font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'} mb-2`}>
            {isCorrect ? 'כל הכבוד!' : 'לא בדיוק...'}
          </h3>
          <p className="mb-4">
            {isCorrect
              ? `השלמת את המשימה בהצלחה! צברת ${score} נקודות.`
              : 'לא כל הפריטים נמצאים באזור הנכון. נסה שוב!'}
          </p>
          
          <div className="flex justify-end space-x-3 rtl:space-x-reverse">
            {!isCorrect && (
              <Button onClick={handleReset} variant="secondary">
                נסה שוב
              </Button>
            )}
            <Button onClick={handleContinue}>
              {isCorrect ? 'המשך' : 'סיים בכל זאת'}
            </Button>
          </div>
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