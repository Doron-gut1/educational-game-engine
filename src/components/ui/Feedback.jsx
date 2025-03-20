import React, { useEffect, useState } from 'react';
import { FeedbackService } from '../../services/feedbackService';

/**
 * רכיב להצגת הודעות מערכת
 * רכיב זה מאזין לשירות המשוב ומציג הודעות למשתמש
 */
export function Feedback() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // הרשמה לשירות המשוב
    const unsubscribe = FeedbackService.subscribe(feedback => {
      setMessages(prev => [...prev, feedback]);

      // הסרת ההודעה לאחר פרק הזמן שהוגדר
      setTimeout(() => {
        setMessages(prev => prev.filter(msg => msg.id !== feedback.id));
      }, feedback.duration);
    });

    return unsubscribe;
  }, []);

  if (messages.length === 0) return null;

  // פונקציה להחזרת מחלקות לפי סוג ההודעה
  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
      default:
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className="fixed bottom-4 left-0 right-0 flex flex-col items-center justify-center z-50 pointer-events-none">
      {messages.map(message => (
        <div 
          key={message.id}
          className={`
            mb-2 p-4 rounded-lg shadow-lg pointer-events-auto animate-fade-in max-w-md
            ${getTypeStyles(message.type)}
          `}
        >
          {message.message}
        </div>
      ))}
    </div>
  );
}