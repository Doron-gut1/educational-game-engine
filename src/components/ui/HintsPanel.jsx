// src/components/ui/HintsPanel.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../design-system';
import { Button, GlassCard } from '../../design-system/components';

/**
 * רכיב פאנל רמזים - מציג רמזים הדרגתיים עם אפשרות לחשיפה הדרגתית
 */
const HintsPanel = ({ 
  hints = [], 
  maxAvailableHints = 3,
  onHintUsed = () => {},
  className = '' 
}) => {
  const theme = useTheme();
  const [revealedHints, setRevealedHints] = useState([]);
  
  // חשיפת רמז נוסף
  const handleRevealHint = (index) => {
    if (!revealedHints.includes(index) && revealedHints.length < maxAvailableHints) {
      setRevealedHints([...revealedHints, index]);
      onHintUsed(index);
    }
  };
  
  // אם אין רמזים, לא מציגים את הפאנל
  if (!hints || hints.length === 0) {
    return null;
  }
  
  return (
    <GlassCard 
      variant="primary" 
      className={`p-4 ${className}`}
    >
      <h3 className="text-lg font-bold text-blue-800 mb-2">רמזים זמינים</h3>
      
      <div className="space-y-3">
        {hints.map((hint, index) => (
          <div key={index} className="hint-item">
            {revealedHints.includes(index) ? (
              <div className="bg-blue-50 border-r-4 border-blue-400 p-3 rounded-lg">
                <p className="text-blue-900">{hint}</p>
              </div>
            ) : (
              <Button
                variant="outline"
                size="small"
                className="w-full justify-center"
                onClick={() => handleRevealHint(index)}
                disabled={revealedHints.length >= maxAvailableHints}
              >
                <span className="inline-flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  רמז {index + 1}
                </span>
              </Button>
            )}
          </div>
        ))}
      </div>
      
      {revealedHints.length >= maxAvailableHints && revealedHints.length < hints.length && (
        <p className="text-amber-600 text-sm mt-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          אין עוד רמזים זמינים לשלב זה
        </p>
      )}
    </GlassCard>
  );
};

HintsPanel.propTypes = {
  hints: PropTypes.arrayOf(PropTypes.string),
  maxAvailableHints: PropTypes.number,
  onHintUsed: PropTypes.func,
  className: PropTypes.string
};

export default HintsPanel;