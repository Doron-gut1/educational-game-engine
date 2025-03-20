import React, { useState, useEffect, useRef } from 'react';

/**
 * רכיב רשת אותיות לחיפוש מילים
 * @param {Object} props - פרופס הרכיב
 * @param {Array<Array<string>>} props.grid - מטריצת אותיות (שורות ועמודות)
 * @param {Array} props.words - רשימת המילים לחיפוש
 * @param {Array} props.foundWords - רשימת המילים שכבר נמצאו
 * @param {Function} props.onWordFound - פונקציה שתופעל כאשר מילה נמצאה
 * @param {boolean} props.isDisabled - האם רשת האותיות מושבתת
 */
export function WordGrid({
  grid = [],
  words = [],
  foundWords = [],
  onWordFound,
  isDisabled = false,
  className,
  ...props
}) {
  // מצב פנימי של הרכיב
  const [startCell, setStartCell] = useState(null);
  const [currentCell, setCurrentCell] = useState(null);
  const [dragLine, setDragLine] = useState(null);
  const [selectedCells, setSelectedCells] = useState([]);
  const gridRef = useRef(null);
  const cellRefs = useRef({});
  
  // איפוס בחירה בעת שינוי רשת האותיות
  useEffect(() => {
    resetSelection();
  }, [grid]);
  
  // איפוס הבחירה הנוכחית
  const resetSelection = () => {
    setStartCell(null);
    setCurrentCell(null);
    setDragLine(null);
    setSelectedCells([]);
  };
  
  // חישוב מיקום יחסי לאלמנט
  const getRelativePosition = (element, clientX, clientY) => {
    if (!element) return { x: 0, y: 0 };
    
    const rect = element.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };
  
  // טיפול בלחיצה על תא
  const handleCellMouseDown = (rowIndex, colIndex, e) => {
    if (isDisabled) return;
    
    // שמירת התא ההתחלתי
    setStartCell({ row: rowIndex, col: colIndex });
    setCurrentCell({ row: rowIndex, col: colIndex });
    setSelectedCells([{ row: rowIndex, col: colIndex }]);
    
    // חישוב הקו המתיחה ההתחלתי
    const gridElement = gridRef.current;
    if (!gridElement) return;
    
    const startPos = getRelativePosition(
      cellRefs.current[`${rowIndex}-${colIndex}`],
      e.clientX,
      e.clientY
    );
    
    const cellPos = getRelativePosition(
      cellRefs.current[`${rowIndex}-${colIndex}`],
      e.clientX,
      e.clientY
    );
    
    setDragLine({
      startX: cellPos.x,
      startY: cellPos.y,
      endX: startPos.x,
      endY: startPos.y
    });
  };
  
  // טיפול בתנועת העכבר מעל הרשת
  const handleGridMouseMove = (e) => {
    if (isDisabled || !startCell) return;
    
    const gridElement = gridRef.current;
    if (!gridElement) return;
    
    // חישוב המיקום הנוכחי
    const mousePos = getRelativePosition(gridElement, e.clientX, e.clientY);
    
    // מציאת התא הקרוב ביותר
    let closestCell = null;
    let minDistance = Infinity;
    
    // בדיקת המרחק לכל תא
    Object.entries(cellRefs.current).forEach(([key, cellElement]) => {
      const [rowIndex, colIndex] = key.split('-').map(Number);
      const cellPos = getRelativePosition(cellElement, e.clientX, e.clientY);
      const cellCenter = {
        x: cellElement.offsetWidth / 2,
        y: cellElement.offsetHeight / 2
      };
      
      // חישוב מרחק בין מיקום העכבר למרכז התא
      const distance = Math.sqrt(
        Math.pow(cellPos.x - cellCenter.x, 2) + 
        Math.pow(cellPos.y - cellCenter.y, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestCell = { row: rowIndex, col: colIndex };
      }
    });
    
    if (closestCell && 
        (closestCell.row !== currentCell?.row || closestCell.col !== currentCell?.col)) {
      // בדיקה שהתנועה היא בקו ישר (אופקי, אנכי או אלכסוני)
      if (isValidLineMovement(startCell, closestCell)) {
        setCurrentCell(closestCell);
        
        // עדכון התאים שנבחרו
        const newSelectedCells = getCellsInLine(startCell, closestCell);
        setSelectedCells(newSelectedCells);
        
        // עדכון קו המתיחה
        const startCellElement = cellRefs.current[`${startCell.row}-${startCell.col}`];
        const endCellElement = cellRefs.current[`${closestCell.row}-${closestCell.col}`];
        
        if (startCellElement && endCellElement) {
          const startCellPos = getRelativePosition(
            startCellElement, 
            startCellElement.getBoundingClientRect().left + startCellElement.offsetWidth / 2,
            startCellElement.getBoundingClientRect().top + startCellElement.offsetHeight / 2
          );
          
          const endCellPos = getRelativePosition(
            endCellElement,
            endCellElement.getBoundingClientRect().left + endCellElement.offsetWidth / 2,
            endCellElement.getBoundingClientRect().top + endCellElement.offsetHeight / 2
          );
          
          setDragLine({
            startX: startCellPos.x,
            startY: startCellPos.y,
            endX: mousePos.x,
            endY: mousePos.y
          });
        }
      }
    } else if (dragLine) {
      // עדכון רק קצה הקו אם לא זוהה תא חדש
      setDragLine({
        ...dragLine,
        endX: mousePos.x,
        endY: mousePos.y
      });
    }
  };
  
  // טיפול בשחרור לחיצת העכבר
  const handleGridMouseUp = () => {
    if (isDisabled || !startCell || !currentCell) {
      resetSelection();
      return;
    }
    
    // בדיקה אם נבחרה מילה
    const selectedWord = getSelectedWord();
    
    // בדיקה אם המילה נמצאת ברשימת המילים
    if (selectedWord && isValidWord(selectedWord)) {
      // בדיקה שהמילה עוד לא נמצאה
      if (!foundWords.includes(selectedWord) && onWordFound) {
        onWordFound(selectedWord, selectedCells);
      }
    }
    
    resetSelection();
  };
  
  // בדיקה אם התנועה בין שני תאים היא בקו ישר (אופקי, אנכי או אלכסוני)
  const isValidLineMovement = (start, end) => {
    // תנועה אופקית
    if (start.row === end.row) return true;
    
    // תנועה אנכית
    if (start.col === end.col) return true;
    
    // תנועה אלכסונית
    const rowDiff = Math.abs(end.row - start.row);
    const colDiff = Math.abs(end.col - start.col);
    
    return rowDiff === colDiff;
  };
  
  // קבלת רשימת כל התאים בקו ישר בין שני תאים
  const getCellsInLine = (start, end) => {
    const cells = [];
    
    const rowDiff = end.row - start.row;
    const colDiff = end.col - start.col;
    
    // חישוב כיוון התנועה
    const rowStep = rowDiff === 0 ? 0 : rowDiff > 0 ? 1 : -1;
    const colStep = colDiff === 0 ? 0 : colDiff > 0 ? 1 : -1;
    
    // מספר הצעדים בקו
    const steps = Math.max(
      Math.abs(rowDiff),
      Math.abs(colDiff)
    );
    
    // הוספת כל התאים בקו
    for (let i = 0; i <= steps; i++) {
      const row = start.row + i * rowStep;
      const col = start.col + i * colStep;
      cells.push({ row, col });
    }
    
    return cells;
  };
  
  // קבלת המילה שנבחרה
  const getSelectedWord = () => {
    if (!selectedCells.length) return '';
    
    return selectedCells.map(cell => 
      grid[cell.row]?.[cell.col] || ''
    ).join('');
  };
  
  // בדיקה אם המילה נמצאת ברשימת המילים
  const isValidWord = (word) => {
    // בדיקה רגילה
    if (words.includes(word)) return true;
    
    // בדיקת מילה הפוכה
    const reversedWord = word.split('').reverse().join('');
    if (words.includes(reversedWord)) return true;
    
    // בדיקה אם המילה נמצאת ברשימת אובייקטים
    const wordStrings = words
      .filter(w => typeof w === 'object')
      .map(w => w.word || '');
    
    return wordStrings.includes(word) || wordStrings.includes(reversedWord);
  };
  
  // קבלת המחלקות עבור תא
  const getCellClass = (rowIndex, colIndex) => {
    // בדיקה אם התא הנוכחי נמצא בבחירה
    const isSelected = selectedCells.some(
      cell => cell.row === rowIndex && cell.col === colIndex
    );
    
    // בדיקה אם התא הנוכחי נמצא במילה שנמצאה
    let isPartOfFoundWord = false;
    
    for (const word of foundWords) {
      const wordString = typeof word === 'object' ? word.word : word;
      const wordCells = typeof word === 'object' ? word.cells : [];
      
      if (wordCells.some(cell => cell.row === rowIndex && cell.col === colIndex)) {
        isPartOfFoundWord = true;
        break;
      }
    }
    
    if (isSelected) {
      return 'bg-blue-200 text-blue-800';
    } else if (isPartOfFoundWord) {
      return 'bg-green-200 text-green-800';
    } else {
      return 'bg-white hover:bg-gray-100';
    }
  };
  
  // רינדור הרשת
  return (
    <div 
      ref={gridRef}
      className={`relative select-none ${className || ''}`}
      onMouseMove={handleGridMouseMove}
      onMouseUp={handleGridMouseUp}
      onMouseLeave={handleGridMouseUp}
      {...props}
    >
      <div className="grid grid-flow-row gap-1" 
        style={{ 
          gridTemplateColumns: `repeat(${grid[0]?.length || 0}, 1fr)`,
          gridTemplateRows: `repeat(${grid.length || 0}, 1fr)`
        }}
      >
        {grid.map((row, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {row.map((letter, colIndex) => (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                ref={el => { cellRefs.current[`${rowIndex}-${colIndex}`] = el; }}
                className={`
                  flex items-center justify-center w-10 h-10 rounded-md
                  font-bold text-lg transition-colors cursor-pointer
                  ${getCellClass(rowIndex, colIndex)}
                  ${isDisabled ? 'cursor-default' : 'cursor-pointer'}
                `}
                onMouseDown={e => handleCellMouseDown(rowIndex, colIndex, e)}
              >
                {letter}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
      
      {/* קו בחירה */}
      {dragLine && !isDisabled && (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <line
            x1={dragLine.startX}
            y1={dragLine.startY}
            x2={dragLine.endX}
            y2={dragLine.endY}
            strokeWidth="4"
            stroke="#4299e1"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>
      )}
    </div>
  );
}