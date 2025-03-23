import React from 'react';

/**
 * רכיב מעקב התקדמות במשחק - מציג פס התקדמות וסטטיסטיקות משחק
 * 
 * @param {Object} props
 * @param {number} props.current - ערך נוכחי 
 * @param {number} props.max - ערך מקסימלי
 * @param {string} props.label - תווית להצגה
 * @param {string} props.className - מחלקות CSS נוספות
 */
export default function ProgressTracker({ 
  current = 0, 
  max = 100, 
  label = 'התקדמות', 
  className = '',
  ...props 
}) {
  // חישוב אחוז ההתקדמות
  const percentage = Math.min(Math.max(Math.round((current / max) * 100), 0), 100);
  
  return (
    <div className={`bg-white bg-opacity-90 p-3 rounded-lg shadow ${className}`} {...props}>
      <div className="flex justify-between items-center mb-1">
        <h4 className="text-sm font-medium text-gray-700">{label}</h4>
        <div className="text-sm text-gray-500">{percentage}%</div>
      </div>
      
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
