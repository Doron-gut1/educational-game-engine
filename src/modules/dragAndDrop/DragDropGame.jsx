import React, { useState, useEffect } from 'react';
// ייבוא react-beautiful-dnd נמחק - נשתמש בפתרון חלופי פשוט יותר
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
 * רכיב משחק גרירה והשלכה - גרסה פשוטה ללא ספריית react-beautiful-dnd
 * @param {Object} props - פרופס הרכיב
 * @param {Array} props.items - פריטים 
 * @param {Array} props.dropZones - אזורי יעד
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
  title = 'משחק התאמה',
  basePoints = 15,
  sourceReference = null,
  learningPopup = null
}) {
  const { state, getAssetPath, handleImageError } = useGameContext();
  const { addScore } = useScoring();
  
  // מצב המשחק - גרסה פשוטה יותר לטובת הדגמה
  const [availableItems, setAvailableItems] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
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
    // עיבוד הפריטים לשימוש - כולל תמונות אם יש
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
  
  // בחירת פריט להזזה
  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };
  
  // השלכת פריט לאזור יעד
  const handleDropToZone = (zone) => {
    if (!selectedItem) return;
    
    // העתקת מצב נוכחי
    const newAvailable = [...availableItems];
    const newZones = [...zones];
    
    // הסרת הפריט מהפריטים הזמינים
    const itemIndex = newAvailable.findIndex(i => i.id === selectedItem.id);
    if (itemIndex !== -1) {
      const [draggedItem] = newAvailable.splice(itemIndex, 1);
      
      // הוספה לאזור היעד
      const targetZoneIndex = newZones.findIndex(z => z.id === zone.id);
      if (targetZoneIndex >= 0) {
        newZones[targetZoneIndex].items.push(draggedItem);
      }
    } else {
      // הפריט כבר נמצא באחד האזורים - העברה בין אזורים
      let foundInZone = false;
      
      for (let i = 0; i < newZones.length; i++) {
        const itemIndexInZone = newZones[i].items.findIndex(item => item.id === selectedItem.id);
        
        if (itemIndexInZone !== -1) {
          const [draggedItem] = newZones[i].items.splice(itemIndexInZone, 1);
          
          // הוספה לאזור היעד החדש
          const targetZoneIndex = newZones.findIndex(z => z.id === zone.id);
          if (targetZoneIndex >= 0) {
            newZones[targetZoneIndex].items.push(draggedItem);
          }
          
          foundInZone = true;
          break;
        }
      }
      
      if (!foundInZone) {
        // לא נמצא בשום מקום - מצב שגוי
        console.error('Item not found in any zone:', selectedItem);
      }
    }
    
    // ניקוי הבחירה
    setSelectedItem(null);
    
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
  
  // החזרת פריט לרשימת הפריטים הזמינים
  const handleReturnToAvailable = (item) => {
    // העתקת מצב נוכחי
    const newAvailable = [...availableItems];
    const newZones = [...zones];
    
    // מציאת האזור שבו נמצא הפריט
    let foundInZone = false;
    
    for (let i = 0; i < newZones.length; i++) {
      const itemIndexInZone = newZones[i].items.findIndex(zoneItem => zoneItem.id === item.id);
      
      if (itemIndexInZone !== -1) {
        const [draggedItem] = newZones[i].items.splice(itemIndexInZone, 1);
        
        // החזרה לרשימת הפריטים הזמינים
        newAvailable.push(draggedItem);
        
        foundInZone = true;
        break;
      }
    }
    
    if (!foundInZone) {
      console.error('Item not found in any zone:', item);
    }
    
    // עדכון המצב
    setAvailableItems(newAvailable);
    setZones(newZones);
    setSelectedItem(null);
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
      
      {/* התקדמות - כמה פריטים מוקמו */}
      <ProgressTracker 
        stages={items.map((item, idx) => ({ id: item.id, title: `פריט ${idx+1}` }))}
        currentStageId={null}
        completedStages={items.map(item => item.id).filter(itemId => 
          !availableItems.some(availItem => availItem.id === itemId)
        )}
        compact={true}
      />
      
      {/* אזור הפריטים הזמינים */}
      <div className="p-4 min-h-16 rounded border-2 border-gray-200 flex flex-wrap gap-4 mb-6">
        {availableItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleSelectItem(item)}
            className={`p-3 rounded border cursor-pointer ${
              selectedItem && selectedItem.id === item.id ? 'bg-blue-100 shadow-lg' : 'bg-white'
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
        ))}
        {availableItems.length === 0 && !isComplete && (
          <div className="text-gray-500 p-2">גרור את כל הפריטים לאזורים המתאימים</div>
        )}
      </div>
      
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
            
            <div 
              className={`min-h-24 p-3 rounded border-2 ${
                selectedItem ? 'border-green-300 bg-green-50' : 'border-gray-200'
              }`}
              onClick={() => selectedItem && handleDropToZone(zone)}
            >
              {zone.items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded border mb-2 last:mb-0 bg-white cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectItem(item);
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    handleReturnToAvailable(item);
                  }}
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
              ))}
              {zone.items.length === 0 && (
                <div className="text-gray-400 p-2">
                  {selectedItem ? 'לחץ כאן כדי להניח את הפריט' : 'לחץ על פריט ואז על אזור זה כדי להניחו'}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      
      {/* הוראות שימוש */}
      <div className="bg-blue-50 p-3 rounded-lg text-sm">
        <p><strong>הוראות:</strong> לחץ על פריט כדי לבחור אותו, ואז לחץ על האזור המתאים כדי להניח אותו שם.</p>
        <p>לחיצה כפולה על פריט שכבר מוקם תחזיר אותו לרשימת הפריטים הזמינים.</p>
      </div>
      
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