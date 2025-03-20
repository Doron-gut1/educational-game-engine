import { useState } from 'react';
import { useGameContext } from '../contexts/GameContext';

/**
 * הוק לניהול מערכת רמזים
 * מאפשר חשיפה הדרגתית של רמזים בהתאם לרמת הקושי
 * 
 * @param {Array} initialHints - מערך הרמזים הזמינים
 * @returns {Object} - אובייקט עם פונקציות ומידע על רמזים
 */
export function useHints(initialHints = []) {
  const { state } = useGameContext();
  const [usedHints, setUsedHints] = useState([]);
  
  // קבלת מספר הרמזים הזמינים לפי רמת קושי
  const getAvailableHintsCount = () => {
    switch(state.difficulty) {
      case 'easy': return 3;
      case 'medium': return 2;
      case 'hard': return 1;
      default: return 2;
    }
  };
  
  // בדיקה אם ניתן להציג רמז נוסף
  const canRevealHint = () => {
    return usedHints.length < Math.min(initialHints.length, getAvailableHintsCount());
  };
  
  // חשיפת הרמז הבא
  const revealNextHint = () => {
    if (canRevealHint()) {
      const nextHintIndex = usedHints.length;
      setUsedHints([...usedHints, nextHintIndex]);
      return initialHints[nextHintIndex];
    }
    return null;
  };
  
  // קבלת כל הרמזים שכבר נחשפו
  const getRevealedHints = () => {
    return usedHints.map(index => initialHints[index]);
  };
  
  // איפוס הרמזים שנחשפו
  const resetHints = () => {
    setUsedHints([]);
  };
  
  return {
    canRevealHint,
    revealNextHint,
    getRevealedHints,
    resetHints,
    hintsUsed: usedHints.length,
    maxHints: getAvailableHintsCount(),
    totalHints: initialHints.length
  };
}