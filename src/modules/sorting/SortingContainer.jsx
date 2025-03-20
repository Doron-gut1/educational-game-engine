import React, { useState } from 'react';

/**
 * מיכל למיון והנחת פריטים
 * @param {Object} props - פרופס הרכיב
 * @param {string} props.id - מזהה המיכל
 * @param {string} props.title - כותרת המיכל
 * @param {Array} props.items - פריטים שכבר נמצאים במיכל
 * @param {function} props.onItemAdded - פונקציה שתופעל בהוספת פריט
 * @param {function} props.onItemRemoved - פונקציה שתופעל בהסרת פריט
 * @param {function} props.onItemsReordered - פונקציה שתופעל בשינוי סדר הפריטים
 * @param {function} props.renderItem - פונקציה לרינדור פריט
 * @param {boolean} props.isDropDisabled - האם השלכה למיכל זה מושבתת
 * @param {string} props.orientation - כיוון הצגת הפריטים ('vertical', 'horizontal')
 * @param {string} props.status - סטטוס המיכל ('default', 'active', 'correct', 'incorrect')
 */
export function SortingContainer({
  id,
  title,
  items = [],
  onItemAdded,
  onItemRemoved,
  onItemsReordered,
  renderItem,
  isDropDisabled = false,
  orientation = 'vertical',
  status = 'default',
  className,
  children,
  ...props
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState(-1);
  
  // טיפול בגרירת פריט מעל המיכל
  const handleDragOver = (e) => {
    e.preventDefault();
    if (isDropDisabled) return;
    
    setIsDragOver(true);
    
    // מציאת האינדקס שמעליו מרחפים
    if (items.length > 0) {
      const container = e.currentTarget;
      const containerRect = container.getBoundingClientRect();
      
      // חישוב האינדקס המתאים להשלכה בהתאם לאוריינטציה
      let targetIndex = 0;
      
      if (orientation === 'horizontal') {
        const mouseX = e.clientX - containerRect.left;
        const itemWidth = containerRect.width / (items.length + 1);
        targetIndex = Math.floor(mouseX / itemWidth);
      } else {
        const mouseY = e.clientY - containerRect.top;
        const itemHeight = containerRect.height / (items.length + 1);
        targetIndex = Math.floor(mouseY / itemHeight);
      }
      
      // הגבלת האינדקס לגבולות המערך
      targetIndex = Math.max(0, Math.min(items.length, targetIndex));
      setDragOverIndex(targetIndex);
    } else {
      setDragOverIndex(0);
    }
  };
  
  // טיפול ביציאה מאזור הגרירה
  const handleDragLeave = () => {
    setIsDragOver(false);
    setDragOverIndex(-1);
  };
  
  // טיפול בהשלכת פריט
  const handleDrop = (e) => {
    e.preventDefault();
    if (isDropDisabled) return;
    
    setIsDragOver(false);
    
    // קבלת מזהה הפריט המושלך
    const itemId = e.dataTransfer.getData('text/plain');
    if (!itemId) return;
    
    if (onItemAdded) {
      onItemAdded(itemId, dragOverIndex);
    }
    
    setDragOverIndex(-1);
  };

  // הגדרת סגנון בהתאם לסטטוס
  const getContainerClasses = () => {
    let statusClasses = '';
    
    switch (status) {
      case 'active':
        statusClasses = 'border-blue-400 bg-blue-50';
        break;
      case 'correct':
        statusClasses = 'border-green-400 bg-green-50';
        break;
      case 'incorrect':
        statusClasses = 'border-red-400 bg-red-50';
        break;
      default:
        statusClasses = isDragOver 
          ? 'border-blue-400 bg-blue-50' 
          : 'border-gray-300 bg-gray-50';
    }
    
    // כיוון הצגת הפריטים
    const orientationClass = orientation === 'horizontal' 
      ? 'flex-row' 
      : 'flex-col';
    
    return `
      p-4 rounded-lg border-2 transition-all
      min-h-[100px] ${statusClasses} ${orientationClass} ${className || ''}
      ${isDropDisabled ? 'cursor-not-allowed' : 'cursor-default'}
    `;
  };
  
  // רינדור אינדיקטור למיקום השלכה
  const renderDropIndicator = (index) => {
    if (dragOverIndex !== index || !isDragOver) return null;
    
    return (
      <div className={`
        ${orientation === 'horizontal' ? 'w-1 h-full my-1' : 'h-1 w-full mx-1'} 
        bg-blue-500 rounded-full
      `} />
    );
  };
  
  return (
    <div className="space-y-2">
      {/* כותרת המיכל */}
      {title && (
        <h3 className="font-semibold text-lg">{title}</h3>
      )}
      
      {/* המיכל עצמו */}
      <div
        id={id}
        className={getContainerClasses()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        {...props}
      >
        {/* פריטים שכבר במיכל */}
        {items.length > 0 ? (
          <div className={`
            flex ${orientation === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col'} 
            gap-2 w-full
          `}>
            {items.map((item, index) => (
              <React.Fragment key={item.id || index}>
                {/* אינדיקטור להשלכה לפני הפריט */}
                {renderDropIndicator(index)}
                
                {/* הפריט עצמו */}
                {renderItem ? renderItem(item, index) : (
                  <div className="p-2 bg-white rounded border border-gray-300">
                    {typeof item === 'object' ? item.content : item}
                  </div>
                )}
                
                {/* אינדיקטור להשלכה אחרי הפריט האחרון */}
                {index === items.length - 1 && renderDropIndicator(items.length)}
              </React.Fragment>
            ))}
          </div>
        ) : (
          // כשאין פריטים
          <div className="flex items-center justify-center h-full w-full text-gray-400">
            {isDragOver ? (
              <span>שחרר כאן</span>
            ) : (
              <span>גרור פריטים לכאן</span>
            )}
          </div>
        )}
        
        {/* תוכן נוסף */}
        {children}
      </div>
    </div>
  );
}