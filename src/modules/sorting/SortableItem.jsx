import React from 'react';

/**
 * פריט הניתן למיון
 * @param {Object} props - פרופס הרכיב
 * @param {string} props.id - מזהה הפריט
 * @param {string|Object} props.content - תוכן הפריט (טקסט או אובייקט עם מידע)
 * @param {string} props.type - סוג התוכן ('text', 'image')
 * @param {function} props.onDragStart - פונקציה בתחילת גרירה
 * @param {function} props.onDragEnd - פונקציה בסיום גרירה
 * @param {string} props.status - סטטוס הפריט ('default', 'correct', 'incorrect')
 * @param {boolean} props.isDragging - האם הפריט נמצא בגרירה
 * @param {boolean} props.isDisabled - האם הפריט מושבת
 */
export function SortableItem({
  id,
  content,
  type = 'text',
  onDragStart,
  onDragEnd,
  status = 'default',
  isDragging = false,
  isDisabled = false,
  className,
  ...props
}) {
  // עיבוד התוכן לפי הסוג
  const renderContent = () => {
    if (type === 'image' || (typeof content === 'object' && content.image)) {
      const imgSrc = typeof content === 'object' ? content.image : content;
      const imgAlt = typeof content === 'object' && content.alt ? content.alt : '';
      
      return (
        <div className="flex items-center">
          <img 
            src={imgSrc} 
            alt={imgAlt} 
            className="w-10 h-10 object-contain mr-2" 
          />
          {typeof content === 'object' && content.text && (
            <span>{content.text}</span>
          )}
        </div>
      );
    }
    
    // ברירת מחדל - טקסט
    return <span>{typeof content === 'object' ? content.text : content}</span>;
  };
  
  // קביעת סגנון לפי סטטוס
  const getStatusClasses = () => {
    switch (status) {
      case 'correct':
        return 'bg-green-50 border-green-500';
      case 'incorrect':
        return 'bg-red-50 border-red-500';
      default:
        return isDragging ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-300 hover:border-gray-400';
    }
  };
  
  // מחליש את הפריט כשהוא בגרירה או מושבת
  const opacityClass = isDragging || isDisabled ? 'opacity-50' : 'opacity-100';
  
  // מגדיר מראה ידית גרירה
  const cursorClass = isDisabled ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing';
  
  return (
    <div
      id={id}
      className={`
        p-3 rounded-lg border-2 transition-all duration-200
        ${getStatusClasses()}
        ${opacityClass}
        ${cursorClass}
        ${className || ''}
      `}
      draggable={!isDisabled}
      onDragStart={(e) => {
        if (isDisabled) return;
        e.dataTransfer.setData('text/plain', id);
        if (onDragStart) onDragStart(id, e);
      }}
      onDragEnd={(e) => {
        if (onDragEnd) onDragEnd(id, e);
      }}
      {...props}
    >
      <div className="flex items-center">
        {/* ידית גרירה דקורטיבית */}
        <div className="flex-shrink-0 ml-1 mr-3">
          <div className="flex flex-col space-y-1">
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
          </div>
        </div>
        
        {/* תוכן הפריט */}
        <div className="flex-grow">
          {renderContent()}
        </div>
        
        {/* אינדיקציה לסטטוס */}
        {status !== 'default' && (
          <div className="flex-shrink-0 mr-1">
            {status === 'correct' ? (
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
        )}
      </div>
    </div>
  );
}