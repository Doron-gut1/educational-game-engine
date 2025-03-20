import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

/**
 * רכיב PopUp להצגת סיכום הלמידה בסיום שלב
 * @param {Object} props - פרופס הרכיב
 * @param {boolean} props.isOpen - האם הפופאפ פתוח
 * @param {Function} props.onClose - פונקציה לסגירת הפופאפ
 * @param {string} props.title - כותרת הפופאפ
 * @param {Array} props.keyPoints - נקודות מרכזיות שנלמדו
 * @param {string} props.mainValue - הערך המרכזי שנלמד
 * @param {Array} props.thinkingPoints - נקודות למחשבה
 * @param {string} props.familyActivity - הצעה לפעילות משפחתית
 * @param {Function} props.onContinue - פונקציה למעבר לשלב הבא
 */
export function LearningPopup({
  isOpen,
  onClose,
  title = "מה למדנו",
  keyPoints = [],
  mainValue = "",
  thinkingPoints = [],
  familyActivity = "",
  onContinue,
  className = ""
}) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={title}
      maxWidth="lg"
      closeOnOverlayClick={false}
      className={className}
      footer={
        <div className="flex justify-end">
          <Button onClick={onContinue || onClose} size="large">המשך למשימה הבאה</Button>
        </div>
      }
    >
      <div className="space-y-6">
        {mainValue && (
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="text-lg font-bold text-indigo-800 mb-2">הערך המרכזי:</h3>
            <p className="text-indigo-700">{mainValue}</p>
          </div>
        )}
        
        {keyPoints.length > 0 && (
          <div>
            <h3 className="text-lg font-bold mb-2">נקודות מרכזיות:</h3>
            <ul className="list-disc list-inside space-y-1 pr-4">
              {keyPoints.map((point, index) => (
                <li key={index} className="text-gray-800">{point}</li>
              ))}
            </ul>
          </div>
        )}
        
        {thinkingPoints.length > 0 && (
          <div className="bg-amber-50 p-4 rounded-lg">
            <h3 className="text-lg font-bold text-amber-800 mb-2">נקודות למחשבה:</h3>
            <ul className="list-disc list-inside space-y-1 pr-4 text-amber-800">
              {thinkingPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        )}
        
        {familyActivity && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-bold text-green-800 mb-2">משימה משפחתית:</h3>
            <p className="text-green-700">{familyActivity}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}