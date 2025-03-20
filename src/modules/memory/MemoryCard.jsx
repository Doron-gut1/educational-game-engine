import React from 'react';

/**
 * קלף למשחק זיכרון
 * @param {Object} props - פרופס הרכיב
 * @param {string} props.id - מזהה הקלף
 * @param {string} props.frontImage - תמונת חזית הקלף
 * @param {string} props.backImage - תמונת גב הקלף
 * @param {boolean} props.isFlipped - האם הקלף הפוך
 * @param {boolean} props.isMatched - האם הקלף נמצא בהתאמה
 * @param {Function} props.onClick - פונקציה שתופעל בלחיצה על הקלף
 */
export function MemoryCard({
  id,
  frontImage,
  backImage,
  isFlipped = false,
  isMatched = false,
  onClick
}) {
  // אנימציה להפיכת הקלף
  const flipClass = isFlipped ? 'rotate-y-180' : '';
  
  // סטייל לקלף מותאם
  const matchedClass = isMatched ? 'opacity-70' : '';
  
  return (
    <div 
      className={`relative w-full aspect-square perspective-500 ${matchedClass}`}
      onClick={() => !isFlipped && !isMatched && onClick()}
    >
      <div className={`
        relative w-full h-full transition-transform duration-500 transform-style-3d ${flipClass}
      `}>
        {/* חזית הקלף */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-lg overflow-hidden">
          <img 
            src={frontImage} 
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* גב הקלף */}
        <div className="absolute w-full h-full backface-hidden rounded-lg overflow-hidden shadow-md">
          <img 
            src={backImage} 
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}