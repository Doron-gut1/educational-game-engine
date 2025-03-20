import React, { useState, useEffect } from 'react';
import { useGameContext } from '../../contexts/GameContext';

/**
 * רכיב דמות - מציג דמות מתוך רשימת הדמויות
 * @param {Object} props - פרופס הרכיב
 * @param {string} props.characterId - מזהה הדמות
 * @param {string} props.animation - סוג האנימציה
 * @param {boolean} props.speaking - האם הדמות מדברת
 * @param {string} props.size - גודל הדמות (small, medium, large, fullscreen)
 * @param {string} props.className - מחלקות CSS נוספות
 */
export function Character({
  characterId,
  animation = 'idle',
  speaking = false,
  size = 'medium',
  className,
  ...props
}) {
  const { gameConfig } = useGameContext();
  const [characterData, setCharacterData] = useState(null);
  
  // טעינת נתוני הדמות
  useEffect(() => {
    if (!characterId || !gameConfig) return;
    
    if (gameConfig.characters && gameConfig.characters[characterId]) {
      setCharacterData(gameConfig.characters[characterId]);
    } else {
      console.warn(`Character not found: ${characterId}`);
    }
  }, [characterId, gameConfig]);
  
  // הגדרת גדלים לפי קטגוריה
  const sizeClasses = {
    small: "w-12 h-12",
    medium: "w-24 h-24",
    large: "w-32 h-32",
    fullscreen: "w-full h-full max-h-80"
  };
  
  // אם אין נתוני דמות, הצג ממלא מקום
  if (!characterData) {
    return (
      <div 
        className={`${sizeClasses[size]} bg-gray-200 rounded-full flex items-center justify-center ${className || ''}`}
        {...props}
      >
        <span className="text-gray-400 text-xs">דמות</span>
      </div>
    );
  }
  
  return (
    <div 
      className={`character ${sizeClasses[size]} ${className || ''} relative`}
      title={characterData.name || characterId}
      {...props}
    >
      {characterData.avatar ? (
        <img 
          src={characterData.avatar}
          alt={characterData.name || characterId}
          className="w-full h-full object-contain rounded-full border-2 border-blue-200"
        />
      ) : (
        <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center">
          <span className="font-bold text-blue-700">{(characterData.name || characterId).substring(0, 2)}</span>
        </div>
      )}
      
      {/* אייקון דיבור אם הדמות מדברת */}
      {speaking && (
        <div className="absolute -top-2 -right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-md border border-blue-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )}
    </div>
  );
}