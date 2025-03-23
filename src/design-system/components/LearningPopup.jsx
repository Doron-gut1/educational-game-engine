import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { GlassCard } from './GlassCard';

/**
 * רכיב חלון קופץ להצגת סיכום למידה
 */
export const LearningPopup = ({
  isOpen = false,
  onClose = () => {},
  onContinue = () => {},
  title = "מה למדנו?",
  keyPoints = [],
  mainValue = "",
  thinkingPoints = [],
  familyActivity = "",
  className = '',
  ...props
}) => {
  // אם החלון לא פתוח, לא מציגים כלום
  if (!isOpen) {
    return null;
  }
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
      {...props}
    >
      <div 
        className={`max-w-2xl w-full max-h-[85vh] overflow-auto bg-white rounded-lg shadow-xl ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* כותרת */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white py-4 px-6 rounded-t-lg">
          <h2 className="text-2xl font-bold text-center">{title}</h2>
        </div>
        
        {/* תוכן */}
        <div className="p-6 overflow-auto">
          {/* נקודות מרכזיות */}
          {keyPoints.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">נקודות מרכזיות:</h3>
              <ul className="list-disc marker:text-amber-500 space-y-2 pr-6">
                {keyPoints.map((point, index) => (
                  <li key={index} className="text-gray-700">{point}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* ערך מרכזי */}
          {mainValue && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">הערך המרכזי:</h3>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
                {mainValue}
              </div>
            </div>
          )}
          
          {/* נקודות למחשבה */}
          {thinkingPoints.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">נקודות למחשבה:</h3>
              <ul className="list-disc marker:text-blue-500 space-y-2 pr-6">
                {thinkingPoints.map((point, index) => (
                  <li key={index} className="text-gray-700">{point}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* פעילות משפחתית */}
          {familyActivity && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">פעילות משפחתית:</h3>
              <GlassCard className="p-4" opacity={25}>
                <p className="text-gray-800">{familyActivity}</p>
              </GlassCard>
            </div>
          )}
        </div>
        
        {/* כפתורים */}
        <div className="border-t p-4 flex justify-end space-x-2 space-x-reverse">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors mr-2"
          >
            סגור
          </button>
          
          <button
            onClick={onContinue}
            className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
          >
            המשך לשלב הבא
          </button>
        </div>
      </div>
    </div>
  );
};

LearningPopup.propTypes = {
  /**
   * האם החלון פתוח
   */
  isOpen: PropTypes.bool,
  /**
   * פונקציה לסגירת החלון
   */
  onClose: PropTypes.func,
  /**
   * פונקציה להמשך לשלב הבא
   */
  onContinue: PropTypes.func,
  /**
   * כותרת החלון
   */
  title: PropTypes.string,
  /**
   * נקודות מרכזיות שנלמדו
   */
  keyPoints: PropTypes.arrayOf(PropTypes.string),
  /**
   * הערך המרכזי שנלמד
   */
  mainValue: PropTypes.string,
  /**
   * נקודות למחשבה
   */
  thinkingPoints: PropTypes.arrayOf(PropTypes.string),
  /**
   * פעילות משפחתית מוצעת
   */
  familyActivity: PropTypes.string,
  /**
   * className נוסף
   */
  className: PropTypes.string
};

export default LearningPopup;