// src/modules/wordSearch/WordSearchGame.jsx
import React, { useState, useEffect } from 'react';
import { WordGrid } from './WordGrid';
import { WordList } from './WordList';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Button } from '../../design-system/components';
import { useGameContext } from '../../contexts/GameContext';
import { useScoring } from '../../hooks/useScoring';
import { useTimer } from '../../hooks/useTimer';
import { useHints } from '../../hooks/useHints';  // הוק חדש - src/hooks/useHints.js
import { HintsPanel } from '../../components/ui/HintsPanel';  // רכיב חדש - src/components/ui/HintsPanel.jsx
import { SourceReference } from '../../components/ui/SourceReference';  // רכיב חדש - src/components/ui/SourceReference.jsx
import { LearningPopup } from '../../components/ui/LearningPopup';  // רכיב חדש - src/components/ui/LearningPopup.jsx

/**
 * משחק חיפוש מילים
 * @param {Object} props - פרופס הרכיב
 * @param {Array} props.puzzles - מערך תצרפי חיפוש מילים
 * @param {Function} props.onComplete - פונקציה שתופעל בסיום המשחק
 * @param {string} props.title - כותרת המשחק
 * @param {number} props.basePoints - נקודות בסיס לכל מילה שנמצאה
 * @param {Array} props.hints - רמזים למשחק
 * @param {Object} props.sourceReference - מקור ורפרנס לשאלות
 * @param {Object} props.learningPopup - מידע לחלון סיכום הלמידה
 */
export function WordSearchGame({
  puzzles = [],
  onComplete,
  title = 'חיפוש מילים',
  basePoints = 10,
  hints = [],
  sourceReference = null,
  learningPopup = null
}) {
  const { state } = useGameContext();
  const { addScore } = useScoring();
  
  // מצב המשחק
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [grid, setGrid] = useState([]);
  const [words, setWords] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [showLearningPopup, setShowLearningPopup] = useState(false);
  
  // התצרף הנוכחי
  const currentPuzzle = puzzles[currentPuzzleIndex] || null;
  
  // שימוש בהוק רמזים
  const { 
    canRevealHint, 
    revealNextHint, 
    getRevealedHints,
    hintsUsed,
    maxHints
  } = useHints(currentPuzzle?.hints || hints);
  
  // טיימר למשחק (אם מוגדר)
  const hasTimeLimit = currentPuzzle?.timeLimit > 0;
  const timer = useTimer({
    initialTime: hasTimeLimit ? currentPuzzle.timeLimit : 60,
    isCountdown: hasTimeLimit,
    autoStart: hasTimeLimit,
    onTimeUp: () => {
      if (hasTimeLimit) {
        finishPuzzle();
      }
    }
  });
  
  // אתחול תצרף חדש
  useEffect(() => {
    if (!currentPuzzle) return;
    
    initializePuzzle(currentPuzzle);
  }, [currentPuzzleIndex, currentPuzzle]);
  
  // בקשת רמז
  const handleRequestHint = () => {
    revealNextHint();
  };
  
  // אתחול תצרף
  const initializePuzzle = (puzzle) => {
    setFoundWords([]);
    setIsComplete(false);
    
    // התאמה לפי רמת קושי
    const puzzleWithDifficulty = getPuzzleForDifficulty(puzzle);
    
    // אתחול הרשת
    if (puzzleWithDifficulty.grid) {
      setGrid(puzzleWithDifficulty.grid);
    } else if (puzzleWithDifficulty.wordList && puzzleWithDifficulty.gridSize) {
      // ייצור רשת אוטומטי
      setGrid(generateWordSearchGrid(
        puzzleWithDifficulty.wordList,
        puzzleWithDifficulty.gridSize.rows,
        puzzleWithDifficulty.gridSize.cols,
        puzzleWithDifficulty.directions
      ));
    } else {
      setGrid([]);
    }
    
    // אתחול רשימת המילים
    setWords(
      puzzleWithDifficulty.words || 
      puzzleWithDifficulty.wordList || 
      []
    );
    
    // הפעלת טיימר אם יש
    if (hasTimeLimit) {
      timer.reset();
      timer.start();
    }
  };
  
  // קבלת גרסת התצרף המתאימה לרמת הקושי
  const getPuzzleForDifficulty = (puzzle) => {
    const currentDifficulty = state.difficulty;
    
    if (puzzle.difficulty && puzzle.difficulty[currentDifficulty]) {
      return {
        ...puzzle,
        ...puzzle.difficulty[currentDifficulty]
      };
    }
    
    return puzzle;
  };
  
  // טיפול בסגירת חלון הלמידה
  const handleCloseLearningPopup = () => {
    setShowLearningPopup(false);
    if (onComplete) {
      onComplete(totalScore);
    }
  };
  
  // פונקציה לייצור רשת אוטומטית לחיפוש מילים
  const generateWordSearchGrid = (wordList, rows = 10, cols = 10, allowedDirections = ['horizontal', 'vertical', 'diagonal']) => {
    // יצירת רשת ריקה
    const grid = Array(rows).fill().map(() => Array(cols).fill(''));
    
    // מיפוי כיוונים אפשריים
    const directions = [];
    if (allowedDirections.includes('horizontal')) {
      directions.push({ rowDir: 0, colDir: 1 }); // ימינה
      directions.push({ rowDir: 0, colDir: -1 }); // שמאלה
    }
    if (allowedDirections.includes('vertical')) {
      directions.push({ rowDir: 1, colDir: 0 }); // למטה
      directions.push({ rowDir: -1, colDir: 0 }); // למעלה
    }
    if (allowedDirections.includes('diagonal')) {
      directions.push({ rowDir: 1, colDir: 1 }); // ימינה-למטה
      directions.push({ rowDir: -1, colDir: 1 }); // ימינה-למעלה
      directions.push({ rowDir: 1, colDir: -1 }); // שמאלה-למטה
      directions.push({ rowDir: -1, colDir: -1 }); // שמאלה-למעלה
    }
    
    // ערבוב המילים ומיון לפי אורך (הארוכות קודם)
    const shuffledWords = [...wordList]
      .map(word => typeof word === 'string' ? word : word.word)
      .filter(word => word && word.length > 0)
      .sort((a, b) => b.length - a.length)
      .map(word => word.toUpperCase())
      .sort(() => Math.random() - 0.5);
    
    // ניסיון למקם כל מילה
    const placedWords = [];
    
    for (const word of shuffledWords) {
      let placed = false;
      
      // ניסיונות אקראיים למקם את המילה
      for (let attempt = 0; attempt < 50 && !placed; attempt++) {
        // בחירת כיוון אקראי
        const dirIndex = Math.floor(Math.random() * directions.length);
        const { rowDir, colDir } = directions[dirIndex];
        
        // בחירת נקודת התחלה אקראית
        const startRow = Math.floor(Math.random() * rows);
        const startCol = Math.floor(Math.random() * cols);
        
        // בדיקה אם המילה מתאימה במיקום ובכיוון שנבחרו
        if (canPlaceWord(grid, word, startRow, startCol, rowDir, colDir, rows, cols)) {
          // מיקום המילה
          placeWord(grid, word, startRow, startCol, rowDir, colDir);
          placed = true;
          placedWords.push(word);
        }
      }
    }
    
    // מילוי התאים הריקים באותיות אקראיות
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!grid[row][col]) {
          const randomChar = String.fromCharCode(
            'א'.charCodeAt(0) + Math.floor(Math.random() * ('ת'.charCodeAt(0) - 'א'.charCodeAt(0) + 1))
          );
          grid[row][col] = randomChar;
        }
      }
    }
    
    return grid;
  };
  
  // בדיקה אם אפשר למקם מילה במיקום ובכיוון מסוימים
  const canPlaceWord = (grid, word, startRow, startCol, rowDir, colDir, rows, cols) => {
    const length = word.length;
    
    // בדיקה שהמילה לא יוצאת מגבולות הרשת
    if (
      startRow + rowDir * (length - 1) < 0 || 
      startRow + rowDir * (length - 1) >= rows ||
      startCol + colDir * (length - 1) < 0 || 
      startCol + colDir * (length - 1) >= cols
    ) {
      return false;
    }
    
    // בדיקה שהמילה לא מתנגשת עם מילים קיימות
    for (let i = 0; i < length; i++) {
      const row = startRow + rowDir * i;
      const col = startCol + colDir * i;
      
      if (grid[row][col] && grid[row][col] !== word[i]) {
        return false;
      }
    }
    
    return true;
  };
  
  // מיקום מילה ברשת
  const placeWord = (grid, word, startRow, startCol, rowDir, colDir) => {
    for (let i = 0; i < word.length; i++) {
      const row = startRow + rowDir * i;
      const col = startCol + colDir * i;
      grid[row][col] = word[i];
    }
  };
  
  // טיפול במציאת מילה
  const handleWordFound = (word, cells) => {
    // בדיקה שהמילה עוד לא נמצאה
    if (foundWords.find(w => (typeof w === 'string' ? w : w.word) === word)) {
      return;
    }
    
    // הוספת המילה למילים שנמצאו
    const wordWithCells = { word, cells };
    setFoundWords(prev => [...prev, wordWithCells]);
    
    // חישוב ניקוד
    const points = basePoints;
    setTotalScore(prev => prev + points);
    addScore(points);
    
    // בדיקה אם כל המילים נמצאו
    if (foundWords.length + 1 === words.length) {
      finishPuzzle();
    }
  };
  
  // סיום התצרף הנוכחי
  const finishPuzzle = () => {
    setIsComplete(true);
    
    if (hasTimeLimit) {
      timer.stop();
    }
    
    // בונוס זמן אם נשאר זמן וכל המילים נמצאו
    if (hasTimeLimit && foundWords.length === words.length && timer.time > 0) {
      const timeBonus = Math.floor(timer.time * basePoints / 10);
      setTotalScore(prev => prev + timeBonus);
      addScore(timeBonus);
    }
  };
  
  // מעבר לתצרף הבא
  const handleNextPuzzle = () => {
    if (currentPuzzleIndex < puzzles.length - 1) {
      setCurrentPuzzleIndex(prev => prev + 1);
    } else {
      // אם הוגדר חלון למידה, יש להציג אותו לפני הסיום
      if (learningPopup) {
        setShowLearningPopup(true);
      } else {
        setShowSummary(true);
      }
    }
  };
  
  // סיום המשחק
  const handleComplete = () => {
    if (onComplete) {
      onComplete(totalScore);
    }
  };
  
  // אם אין תצרפים
  if (!currentPuzzle) {
    return <div>לא נמצאו תצרפי חיפוש מילים</div>;
  }
  
  // הצגת סיכום בסיום המשחק
  if (showSummary) {
    const totalWordsFound = puzzles.reduce((total, _, index) => {
      if (index < currentPuzzleIndex) {
        return total + puzzles[index].words?.length || puzzles[index].wordList?.length || 0;
      }
      return total + foundWords.length;
    }, 0);
    
    const totalWordsPossible = puzzles.reduce((total, puzzle) => {
      return total + (puzzle.words?.length || puzzle.wordList?.length || 0);
    }, 0);
    
    const accuracy = totalWordsPossible > 0 
      ? Math.round((totalWordsFound / totalWordsPossible) * 100) 
      : 0;
      
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-4">סיכום</h2>
        <p className="text-xl mb-4">צברת {totalScore} נקודות</p>
        <p className="text-lg mb-2">מצאת {totalWordsFound} מתוך {totalWordsPossible} מילים</p>
        <p className="text-lg mb-6">דיוק: {accuracy}%</p>
        
        <Button onClick={handleComplete} size="large">סיים</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="text-sm text-gray-500">
            תצרף {currentPuzzleIndex + 1} מתוך {puzzles.length}
          </div>
          
          {hasTimeLimit && (
            <div className="font-mono text-lg font-bold">
              {timer.formattedTime}
            </div>
          )}
        </div>
      </div>
      
      <ProgressBar 
        value={currentPuzzleIndex} 
        max={puzzles.length - 1} 
        color="primary" 
      />
      
      {/* תיאור התצרף (אם יש) */}
      {currentPuzzle.description && (
        <p className="text-gray-700 mb-4">{currentPuzzle.description}</p>
      )}
      
      {/* מקור ורפרנס */}
      {(sourceReference || currentPuzzle.sourceReference) && (
        <SourceReference 
          source={currentPuzzle.sourceReference?.source || sourceReference?.source}
          reference={currentPuzzle.sourceReference?.reference || sourceReference?.reference}
          expandable={true}
          initiallyExpanded={false}
          className="mb-4"
        />
      )}
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* רשת חיפוש המילים */}
          <div className="lg:col-span-2 flex justify-center">
            <WordGrid
              grid={grid}
              words={words}
              foundWords={foundWords}
              onWordFound={handleWordFound}
              isDisabled={isComplete}
            />
          </div>
          
          {/* רשימת המילים */}
          <div className="lg:col-span-1">
            <WordList 
              words={words} 
              foundWords={foundWords}
              title="מילים לחיפוש"
            />
          </div>
        </div>
        
        {/* פאנל רמזים */}
        <div className="mt-6">
          <HintsPanel 
            hints={currentPuzzle.hints || hints}
            revealedHints={getRevealedHints()}
            canRevealMore={canRevealHint()}
            onRequestHint={handleRequestHint}
            hintsUsed={hintsUsed}
            maxHints={maxHints}
          />
        </div>
        
        {/* כפתור למעבר לתצרף הבא */}
        {isComplete && (
          <div className="flex justify-end mt-6">
            <Button onClick={handleNextPuzzle}>
              {currentPuzzleIndex < puzzles.length - 1 ? 'התצרף הבא' : 'סיים'}
            </Button>
          </div>
        )}
      </div>
      
      {/* חלון סיכום למידה */}
      {learningPopup && (
        <LearningPopup
          isOpen={showLearningPopup}
          onClose={handleCloseLearningPopup}
          onContinue={handleCloseLearningPopup}
          title={learningPopup.title || "מה למדנו?"}
          keyPoints={learningPopup.keyPoints || []}
          mainValue={learningPopup.mainValue || ""}
          thinkingPoints={learningPopup.thinkingPoints || []}
          familyActivity={learningPopup.familyActivity || ""}
        />
      )}
    </div>
  );
}