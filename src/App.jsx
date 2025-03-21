// src/App.jsx
import React, { useState, useEffect } from 'react';
import { LoggerService } from './services';
import './App.css';

// ייבוא מערכת העיצוב החדשה
import { ThemeProvider } from './design-system';
import { Button, ScrollCard, GlassCard } from './design-system/components';

// Import game components
import PassoverQuestGame from './games/passover/PassoverQuestGame.jsx';

function App() {
  LoggerService.debug("App component initialized");
  
  const [selectedGame, setSelectedGame] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('base');

  // Debug effect to track initial render and state changes
  useEffect(() => {
    LoggerService.debug("App mounted/updated. Selected game:", selectedGame);
    
    // עדכון התמה בהתאם למשחק שנבחר
    if (selectedGame === 'passover') {
      setCurrentTheme('passover');
    } else {
      setCurrentTheme('base');
    }
  }, [selectedGame]);

  const handleGameSelect = (gameId) => {
    LoggerService.info("Game selected:", gameId);
    setSelectedGame(gameId);
  };

  const renderGameSelector = () => {
    LoggerService.debug("Rendering game selector");
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 flex items-center justify-center p-4" dir="rtl">
        <GlassCard className="max-w-4xl w-full p-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-4 text-center">מסע הדעת</h1>
          <p className="text-gray-600 mb-8 text-center text-lg">מערכת ליצירת משחקים חינוכיים אינטראקטיביים</p>
          
          <ScrollCard variant="primary" animated={true} className="mb-6">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">בחר משחק להפעלה:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                onClick={() => handleGameSelect('passover')}
                className="p-6 bg-white/80 rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-blue-200 hover:border-blue-400 transform hover:scale-105"
              >
                <h3 className="text-xl font-bold mb-3 text-blue-800">המסע לחירות</h3>
                <p className="text-gray-700">משחק פסח אינטראקטיבי על מסע יציאת מצרים</p>
              </div>
              
              <div 
                className="p-6 bg-white/60 rounded-lg shadow hover:shadow-md transition-all border-2 border-gray-200 opacity-60 cursor-not-allowed"
              >
                <h3 className="text-xl font-bold mb-3 text-gray-500">חגיגת ט\"ו בשבט</h3>
                <p className="text-gray-500">יהיה זמין בקרוב</p>
              </div>
            </div>
          </ScrollCard>
          
          <div className="flex justify-center mt-4">
            <Button 
              variant="primary" 
              size="large"
              onClick={() => handleGameSelect('passover')}
              className="mx-2"
            >
              התחל את המסע
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  };

  const renderSelectedGame = () => {
    LoggerService.debug("Rendering selected game:", selectedGame);
    
    switch (selectedGame) {
      case 'passover':
        LoggerService.debug("Attempting to render PassoverQuestGame");
        try {
          return <PassoverQuestGame />;
        } catch (error) {
          LoggerService.error("Error rendering PassoverQuestGame:", error);
          return (
            <div className="min-h-screen bg-red-50 flex items-center justify-center p-4" dir="rtl">
              <GlassCard variant="dark" className="p-8 max-w-lg">
                <h1 className="text-2xl font-bold mb-4 text-red-500">שגיאה בטעינת המשחק</h1>
                <p className="mb-4 text-white">אירעה שגיאה בעת טעינת משחק הפסח</p>
                <pre className="bg-red-900/30 p-4 rounded-md overflow-auto text-sm mb-4 text-white">
                  {error.toString()}
                </pre>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedGame(null)}
                >
                  חזרה לבחירת משחק
                </Button>
              </GlassCard>
            </div>
          );
        }
      default:
        return renderGameSelector();
    }
  };

  LoggerService.debug("App render with theme:", currentTheme);
  
  // שימוש ב-ThemeProvider החדש עם תמה מתאימה למשחק
  return (
    <ThemeProvider theme={currentTheme}>
      <div className="app">
        {renderSelectedGame()}
      </div>
    </ThemeProvider>
  );
}

export default App;