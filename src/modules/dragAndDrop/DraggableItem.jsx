import React from 'react';
import { useDrag } from 'react-dnd';

/**
 * פריט הניתן לגרירה
 * @param {Object} props - פרופס הרכיב
 * @param {string} props.id - מזהה הפריט
 * @param {string} props.type - סוג הפריט (text, image)
 * @param {string} props.content - תוכן הפריט
 * @param {boolean|null} props.isCorrect - האם הפריט מושלך נכון (null אם אין פידבק)
 */
export function DraggableItem({ 
  id, 
  type = 'text', 
  content,
  isCorrect = null
}) {
  // הגדרת הפריט כגריר עם אובייקט המכיל את ה-ID
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ITEM',
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  
  // חישוב סטיילים בהתאם למצב
  let bgClass = '';
  let borderClass = '';
  
  if (isCorrect === true) {
    bgClass = 'bg-green-50';
    borderClass = 'border-green-500';
  } else if (isCorrect === false) {
    bgClass = 'bg-red-50';
    borderClass = 'border-red-500';
  } else {
    bgClass = isDragging ? 'bg-blue-50' : 'bg-white';
    borderClass = isDragging ? 'border-blue-500' : 'border-gray-200';
  }
  
  return (
    <div
      ref={drag}
      className={`
        p-3 rounded-lg border-2 ${borderClass} ${bgClass}
        transition-all duration-200 cursor-grab
        ${isDragging ? 'opacity-50' : 'opacity-100'}
      `}
    >
      {type === 'image' ? (
        <img 
          src={content} 
          alt="" 
          className="w-20 h-20 object-contain mx-auto"
        />
      ) : (
        <p className="text-gray-900">{content}</p>
      )}
    </div>
  );
}