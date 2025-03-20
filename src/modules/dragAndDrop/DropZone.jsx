import React from 'react';
import { useDrop } from 'react-dnd';

/**
 * אזור השלכה לפריטים
 * @param {Object} props - פרופס הרכיב
 * @param {string} props.id - מזהה האזור
 * @param {string} props.label - תווית האזור
 * @param {Function} props.onItemDrop - פונקציה שתופעל בעת השלכת פריט
 * @param {string} props.droppedItem - מזהה הפריט שהושלך
 * @param {Array} props.items - כל הפריטים האפשריים
 * @param {boolean|null} props.isCorrect - האם הפריט מושלך נכון (null אם אין פידבק)
 */
export function DropZone({ 
  id, 
  label, 
  onItemDrop,
  droppedItem,
  items = [],
  isCorrect = null
}) {
  // הגדרת האזור כאזור השלכה
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'ITEM',
    drop: (item) => onItemDrop(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));
  
  // מציאת פרטים על הפריט המושלך
  const droppedItemData = items.find(item => item.id === droppedItem);
  
  // חישוב סטיילים בהתאם למצב
  let bgClass = '';
  let borderClass = '';
  
  if (isCorrect === true) {
    bgClass = 'bg-green-50';
    borderClass = 'border-green-500';
  } else if (isCorrect === false) {
    bgClass = 'bg-red-50';
    borderClass = 'border-red-500';
  } else if (isOver && canDrop) {
    bgClass = 'bg-blue-50';
    borderClass = 'border-blue-500';
  } else if (droppedItem) {
    bgClass = 'bg-gray-50';
    borderClass = 'border-gray-400';
  } else {
    bgClass = 'bg-gray-50';
    borderClass = 'border-dashed border-gray-300';
  }
  
  return (
    <div
      ref={drop}
      className={`
        p-4 rounded-lg border-2 ${borderClass} ${bgClass}
        transition-all duration-200 min-h-[100px]
        flex flex-col items-center justify-center
      `}
    >
      {/* כותרת האזור */}
      <div className="font-semibold mb-2">{label}</div>
      
      {/* פריט מושלך אם יש */}
      {droppedItemData ? (
        <div className="p-2 rounded-lg bg-white border border-gray-200 w-full text-center">
          {droppedItemData.type === 'image' ? (
            <img 
              src={droppedItemData.content || droppedItemData.image} 
              alt="" 
              className="w-16 h-16 object-contain mx-auto"
            />
          ) : (
            <p>{droppedItemData.content || droppedItemData.text}</p>
          )}
        </div>
      ) : (
        // הנחיה כאשר אין פריט
        <p className="text-gray-400 text-sm text-center">גרור פריט לכאן</p>
      )}
      
      {/* אינדיקטור נכונות */}
      {isCorrect !== null && droppedItem && (
        <div className="mt-2">
          {isCorrect ? (
            <svg className="w-6 h-6 text-green-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-red-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
      )}
    </div>
  );
}