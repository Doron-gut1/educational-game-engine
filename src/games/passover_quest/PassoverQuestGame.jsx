import React, { useState, useEffect } from 'react';
import { GameContainer } from '../../components/layout/GameContainer';
import { GameManager } from '../../components/GameManager';
import { NavigationBar } from '../../components/layout/NavigationBar';
import passoverQuestConfig from './config';
import passoverCharacters from './characters';
import passoverTheme from '../../themes/passoverTheme';

/**
 * דף ראשי למשחק פסח - המסע לחירות
 */
export default function PassoverQuestGame() {
  const [gameKey, setGameKey] = useState(Date.now()); // מפתח לאיפוס המשחק
  
  // איפוס המשחק
  const handleReset = () => {
    setGameKey(Date.now());
  };
  
  // סיום המשחק
  const handleComplete = (score) => {
    console.log("המשחק הסתיים, הניקוד הסופי:", score);
    // כאן ניתן להוסיף פעולות נוספות בסיום המשחק
  };
  
  return (
    <GameContainer 
      gameConfig={passoverQuestConfig}
      characters={passoverCharacters}
      theme={passoverTheme}
      key={gameKey}
    >
      <NavigationBar 
        onReset={handleReset} 
        allowSkipping={false}
        showAllStages={false}
      />
      
      <main className="flex-grow p-4">
        <GameManager
          templateId={passoverQuestConfig.template}
          onComplete={handleComplete}
          onReset={handleReset}
        />
      </main>
      
      <footer className="p-4 text-center text-gray-500 text-sm">
        &copy; המסע לחירות - משחק פסח אינטראקטיבי
      </footer>
    </GameContainer>
  );
}