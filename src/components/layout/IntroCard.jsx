import React from 'react';
import { Button, ScrollCard } from '../../design-system/components';
import { Character } from '../characters/Character';

/**
 * כרטיס פתיחה למשחק עם עיצוב מלא
 * @param {Object} props - פרופס הרכיב
 * @param {Object} props.introData - נתוני שלב הפתיחה
 * @param {Function} props.onStart - פונקציית קולבק להתחלת המשחק
 * @param {Object} props.characters - מידע על הדמויות
 * @param {boolean} props.isLoading - האם המשחק בטעינה
 */
export function IntroCard({
  introData,
  onStart,
  characters,
  isLoading = false
}) {
  if (!introData) {
    return (
      <ScrollCard className="p-6 bg-yellow-50 text-center">
        <p className="mb-4">נתוני שלב המבוא חסרים</p>
        <Button onClick={onStart}>
          המשך למשחק
        </Button>
      </ScrollCard>
    );
  }
  
  return (
    <ScrollCard className="max-w-4xl mx-auto overflow-hidden">
      {/* כותרת עם רקע */}
      <div 
        className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white relative"
        style={{
          backgroundImage: introData.background ? `url(${introData.background})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* שכבת הצללה אם יש תמונת רקע */}
        {introData.background && (
          <div className="absolute inset-0 bg-blue-900 bg-opacity-60"></div>
        )}
        
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
            {introData.title}
          </h1>
          
          {introData.subtitle && (
            <p className="text-lg text-center text-blue-100">{introData.subtitle}</p>
          )}
        </div>
      </div>
      
      {/* תוכן הדיאלוג */}
      <div className="p-6">
        {introData.dialogue && (
          <div className="mb-8 space-y-4">
            {introData.dialogue.map((line, index) => {
              const characterInfo = characters?.[line.character];
              
              return (
                <div key={index} className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  {characterInfo && (
                    <div className="flex-shrink-0">
                      {characterInfo.avatar ? (
                        <img 
                          src={characterInfo.avatar} 
                          alt={characterInfo.name} 
                          className="w-16 h-16 rounded-full object-cover border-2 border-blue-300"
                        />
                      ) : (
                        <Character
                          characterId={line.character}
                          size="small"
                        />
                      )}
                    </div>
                  )}
                  
                  <div className="flex-grow">
                    {line.character && (
                      <p className="font-bold text-blue-800 mb-1">
                        {characterInfo?.name || line.character}:
                      </p>
                    )}
                    <p className="text-lg">{line.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* כפתור התחלה */}
        <div className="text-center mt-6">
          <Button 
            onClick={onStart} 
            size="large"
            variant="primary"
            disabled={isLoading}
            className="px-8 py-3 text-lg shadow-lg transition-transform transform hover:scale-105"
          >
            {isLoading ? (
              <>
                <span className="ml-2">טוען...</span>
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
              </>
            ) : (
              introData.actionButton?.text || 'התחל במסע'
            )}
          </Button>
        </div>
      </div>
    </ScrollCard>
  );
}