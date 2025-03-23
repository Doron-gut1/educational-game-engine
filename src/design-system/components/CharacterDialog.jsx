// src/design-system/components/CharacterDialog.jsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../ThemeProvider';
import { Button } from './Button';
import { Card } from './Card';

/**
 * רכיב דו-שיח עם דמות
 * @param {Object} props - פרופס של הרכיב
 * @param {string} props.character - מזהה הדמות
 * @param {string} props.characterName - שם הדמות לתצוגה
 * @param {string} props.characterImage - תמונת הדמות
 * @param {string} props.text - טקסט הדו-שיח
 * @param {Array} props.dialogue - מערך של שורות דו-שיח עם שדות character, text
 * @param {string} props.actionText - טקסט לכפתור הפעולה (אופציונלי)
 * @param {Function} props.onAction - פונקציה לביצוע בלחיצה על כפתור הפעולה
 * @param {string} props.className - קלאסים נוספים
 * @param {Object} props.style - סגנון נוסף
 */
export function CharacterDialog({ 
  character,
  characterName,
  characterImage,
  text,
  dialogue = [],
  actionText = 'המשך',
  onAction,
  className = '',
  style = {},
  ...props
}) {
  const theme = useTheme();
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  
  // שימוש בדיאלוג או בטקסט בודד
  const hasMultipleDialogue = dialogue && dialogue.length > 0;
  const currentText = hasMultipleDialogue 
    ? dialogue[currentDialogueIndex]?.text || '' 
    : text || '';
  const currentCharacter = hasMultipleDialogue
    ? dialogue[currentDialogueIndex]?.character || character
    : character;
  const currentCharacterName = hasMultipleDialogue
    ? dialogue[currentDialogueIndex]?.characterName || characterName
    : characterName;
  const currentCharacterImage = hasMultipleDialogue
    ? dialogue[currentDialogueIndex]?.characterImage || characterImage
    : characterImage;
  
  // אפקט הקלדה
  useEffect(() => {
    let timeoutId;
    let currentIndex = 0;
    setIsTyping(true);
    setTypedText('');
    
    const typeText = () => {
      if (currentIndex < currentText.length) {
        setTypedText(prev => prev + currentText[currentIndex]);
        currentIndex++;
        timeoutId = setTimeout(typeText, 30); // מהירות ההקלדה
      } else {
        setIsTyping(false);
      }
    };
    
    timeoutId = setTimeout(typeText, 300); // עיכוב התחלתי
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentText, currentDialogueIndex]);
  
  // טיפול בלחיצת המשך
  const handleContinue = () => {
    if (isTyping) {
      // אם עדיין מקליד, לסיים את ההקלדה מיד
      setTypedText(currentText);
      setIsTyping(false);
      return;
    }
    
    if (hasMultipleDialogue && currentDialogueIndex < dialogue.length - 1) {
      // אם יש עוד דיאלוג, להמשיך לשורה הבאה
      setCurrentDialogueIndex(prev => prev + 1);
    } else {
      // אחרת להפעיל את פונקציית הסיום
      if (onAction) {
        onAction();
      }
    }
  };
  
  // סגנונות דינמיים
  const cardStyle = {
    backgroundColor: theme.colors.primaryLight + '11', // שקיפות נמוכה
    borderColor: theme.colors.primary + '33',
    ...style
  };
  
  const characterStyle = {
    backgroundImage: currentCharacterImage ? `url(${currentCharacterImage})` : undefined,
    backgroundColor: theme.colors.secondary + '22',
    borderColor: theme.colors.secondary,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };
  
  return (
    <Card 
      className={`flex p-0 overflow-hidden ${className}`}
      style={cardStyle}
    >
      {/* תמונת דמות */}
      {currentCharacterImage && (
        <div 
          className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden m-4 flex-shrink-0 border-2"
          style={characterStyle}
        />
      )}
      
      <div className="flex-grow p-4 flex flex-col">
        {/* שם הדמות */}
        {currentCharacterName && (
          <div className="font-bold text-lg" style={{ color: theme.colors.primary }}>
            {currentCharacterName}
          </div>
        )}
        
        {/* תוכן הדיאלוג */}
        <div className="flex-grow py-2 text-lg">
          {typedText}
          {isTyping && <span className="animate-pulse">|</span>}
        </div>
        
        {/* כפתור פעולה */}
        <div className="flex justify-end mt-2">
          <Button onClick={handleContinue}>
            {isTyping ? 'דלג' : hasMultipleDialogue && currentDialogueIndex < dialogue.length - 1 ? 'המשך' : actionText}
          </Button>
        </div>
      </div>
    </Card>
  );
}
