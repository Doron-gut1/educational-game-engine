import React, { useState } from 'react';
import { Card } from './Card';

/**
 * רכיב להצגת מקורות וציטוטים
 * @param {Object} props - פרופס הרכיב
 * @param {string} props.source - הציטוט או המקור העיקרי
 * @param {string} props.reference - הרחבה או הסבר על המקור
 * @param {boolean} props.expandable - האם המקור ניתן להרחבה
 * @param {boolean} props.initiallyExpanded - האם להציג את ההרחבה מלכתחילה
 * @param {string} props.className - קלאסים נוספים
 */
export function SourceReference({
  source,
  reference,
  expandable = true,
  initiallyExpanded = false,
  className = ""
}) {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  
  if (!source) return null;
  
  return (
    <Card 
      variant="translucent" 
      className={`p-3 border-r-4 border-amber-500 ${className}`}
    >
      <div>
        <div className="text-sm text-amber-800 font-semibold mb-1">מקור:</div>
        <p className="text-gray-800 text-right leading-relaxed">{source}</p>
        
        {reference && expandable && (
          <div className="mt-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-amber-600 hover:text-amber-800 flex items-center"
            >
              {isExpanded ? 'הסתר הרחבה' : 'הרחב מקור'}
              <svg 
                className={`w-4 h-4 mr-1 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isExpanded && (
              <div className="mt-2 p-3 bg-amber-50 rounded-md text-gray-800 leading-relaxed">
                {reference}
              </div>
            )}
          </div>
        )}
        
        {reference && !expandable && (
          <div className="mt-2 p-3 bg-amber-50 rounded-md text-gray-800 leading-relaxed">
            {reference}
          </div>
        )}
      </div>
    </Card>
  );
}