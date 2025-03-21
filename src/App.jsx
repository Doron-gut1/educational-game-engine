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
      <div className="min-h-screen overflow-hidden relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700" dir="rtl">
        {/* צורות דקורטיביות ברקע */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl"></div>
        
        {/* קישוטים בסגנון מגילה בחלק העליון והתחתון */}
        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-amber-700/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-amber-700/30 to-transparent"></div>
        
        <div className="relative min-h-screen flex items-center justify-center p-4 z-10">
          <GlassCard className="max-w-4xl w-full p-8 backdrop-blur-lg bg-white/10 border border-white/20">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-amber-300 mb-2 tracking-wider animate-pulse-soft">מסע הדעת</h1>
              <p className="text-blue-100 text-xl max-w-2xl mx-auto">מערכת ליצירת משחקים חינוכיים אינטראקטיביים</p>
              
              {/* קו מעוטר */}
              <div className="flex items-center justify-center my-6">
                <div className="h-0.5 w-12 bg-amber-300 rounded"></div>
                <div className="mx-4 text-amber-300">✦</div>
                <div className="h-0.5 w-24 bg-amber-300 rounded"></div>
                <div className="mx-4 text-amber-300">✦</div>
                <div className="h-0.5 w-12 bg-amber-300 rounded"></div>
              </div>
            </div>
            
            <ScrollCard variant="primary" animated={true} className="mb-8 bg-white/20 border-white/30 backdrop-blur-md transition-all hover:bg-white/30">
              <h2 className="text-2xl font-bold text-amber-200 mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                בחר משחק להפעלה:
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  onClick={() => handleGameSelect('passover')}
                  className="staggered-item game-card group p-6 relative overflow-hidden bg-gradient-to-br from-blue-700/40 to-blue-900/40 rounded-lg border border-blue-500/30 hover:border-amber-400/60 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105 hover:rotate-1"
                >
                  {/* אפקט זוהר בריחוף */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-amber-400/0 via-amber-400/20 to-amber-400/0 blur-md transition-opacity duration-700 animate-shimmer"></div>
                  
                  <h3 className="text-xl font-bold mb-3 text-amber-300 relative z-10">המסע לחירות</h3>
                  <p className="text-blue-100 relative z-10">משחק פסח אינטראקטיבי על מסע יציאת מצרים</p>
                  
                  {/* איקון חץ */}
                  <div className="absolute bottom-3 left-3 text-amber-300/70 group-hover:text-amber-300 transition-all opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
                
                <div className="staggered-item game-card p-6 relative overflow-hidden bg-gradient-to-br from-gray-700/30 to-gray-900/30 rounded-lg border border-gray-500/20 shadow filter grayscale opacity-60 cursor-not-allowed">
                  <h3 className="text-xl font-bold mb-3 text-gray-300">חגיגת ט\"ו בשבט</h3>
                  <p className="text-gray-400">יהיה זמין בקרוב</p>
                  
                  {/* תווית בקרוב */}
                  <div className="absolute top-3 left-3 bg-gray-800/80 px-2 py-1 rounded text-xs text-gray-300">
                    בקרוב
                  </div>
                </div>
              </div>
            </ScrollCard>
            
            <div className="flex justify-center mt-4">
              <Button 
                variant="primary" 
                size="large"
                onClick={() => handleGameSelect('passover')}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 px-10 py-3 text-lg shadow-lg hover:shadow-amber-500/50 transition-all duration-300 transform hover:-translate-y-1 hover-lift"
              >
                התחל את המסע
              </Button>
            </div>
          </GlassCard>
        </div>
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
            <div className="min-h-screen bg-gradient-to-br from-red-900 to-red-800 flex items-center justify-center p-4" dir="rtl">
              <GlassCard variant="dark" className="p-8 max-w-lg backdrop-blur-md">
                <h1 className="text-2xl font-bold mb-4 text-red-300">שגיאה בטעינת המשחק</h1>
                <p className="mb-4 text-gray-200">אירעה שגיאה בעת טעינת משחק הפסח</p>
                <pre className="bg-red-900/30 p-4 rounded-md overflow-auto text-sm mb-4 text-gray-100 border border-red-500/30">
                  {error.toString()}
                </pre>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedGame(null)}
                  className="border-red-300 text-red-300 hover:bg-red-900/30"
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