// src/components/ui/LearningPopup.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../design-system';
import { Button, ScrollCard } from '../../design-system/components';

/**
 * חלון קופץ של "מה למדנו" המוצג בסיום שלב
 */
const LearningPopup = ({
  isOpen = false,
  title = "מה למדנו בשלב זה?",
  mainValue = "",
  keyPoints = [],
  reflectionPoints = [],
  onClose = () => {},
  className = ""
}) => {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();
  
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      // מוסיף השהיה קטנה לאנימציית סגירה
      const timer = setTimeout(() => {
        setVisible(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  if (!visible) {
    return null;
  }
  
  // אנימציית כניסה לחלון הקופץ
  const popupClass = `
    fixed inset-0 z-50 flex items-center justify-center p-4
    ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    transition-opacity duration-300
    ${className}
  `;
  
  return (
    <div className={popupClass}>
      {/* רקע מטושטש */}
      <div 
        className="absolute inset-0 bg-blue-900/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* תוכן החלון */}
      <div className="relative z-10 max-w-2xl w-full">
        <ScrollCard 
          variant="primary" 
          animated={true}
          decorative={true}
          className="p-6"
        >
          <button 
            onClick={onClose}
            className="absolute left-6 top-6 text-blue-500 hover:text-blue-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="text-center mb-6">
            <div className="inline-block bg-amber-100 border-2 border-amber-300 rounded-lg px-4 py-1 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline ml-1 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-amber-800">סיכום שלב</span>
            </div>
            <h2 className="text-2xl font-bold text-blue-800">{title}</h2>
          </div>
          
          {mainValue && (
            <div className="mb-6 p-4 bg-blue-50 border-r-4 border-blue-400 rounded-lg">
              <h3 className="font-bold text-lg text-blue-800 mb-2">הערך המרכזי:</h3>
              <p className="text-blue-700 text-lg">{mainValue}</p>
            </div>
          )}
          
          {keyPoints.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-lg text-blue-800 mb-2">נקודות מפתח:</h3>
              <ul className="space-y-2">
                {keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-amber-500 ml-2">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {reflectionPoints.length > 0 && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h3 className="font-bold text-lg text-amber-800 mb-2">נקודות למחשבה:</h3>
              <ul className="space-y-2">
                {reflectionPoints.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-amber-500 ml-2">•</span>
                    <span className="text-amber-900">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="text-center mt-6">
            <Button 
              variant="primary" 
              size="large"
              onClick={onClose}
            >
              המשך למשימה הבאה
            </Button>
          </div>
        </ScrollCard>
      </div>
    </div>
  );
};

LearningPopup.propTypes = {
  isOpen: PropTypes.bool,
  title: PropTypes.string,
  mainValue: PropTypes.string,
  keyPoints: PropTypes.arrayOf(PropTypes.string),
  reflectionPoints: PropTypes.arrayOf(PropTypes.string),
  onClose: PropTypes.func,
  className: PropTypes.string
};

export default LearningPopup;