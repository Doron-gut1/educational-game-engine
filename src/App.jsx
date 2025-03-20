// src/App.jsx
import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { defaultTheme } from './themes/defaultTheme';
import './App.css';

// Import game components
import PassoverQuestGame from './games/passover_quest/PassoverQuestGame';

function App() {
  const [selectedGame, setSelectedGame] = useState(null);

  const handleGameSelect = (gameId) => {
    setSelectedGame(gameId);
  };

  const renderGameSelector = () => {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-4 text-center">מנוע משחק מודולרי</h1>
          <p className="text-gray-600 mb-6 text-center">מערכת ליצירת משחקים חינוכיים אינטראקטיביים</p>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-blue-700 mb-4">בחר משחק להפעלה:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => handleGameSelect('passover')}
                className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border-2 border-blue-200 hover:border-blue-400"
              >
                <h3 className="text-lg font-bold mb-2">המסע לחירות</h3>
                <p className="text-gray-600">משחק פסח אינטראקטיבי על מסע יציאת מצרים</p>
              </button>
              
              <button 
                onClick={() => handleGameSelect('tubishvat')}
                className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border-2 border-green-200 hover:border-green-400"
              >
                <h3 className="text-lg font-bold mb-2">חגיגת ט"ו בשבט</h3>
                <p className="text-gray-600">משחק אינטראקטיבי לחג האילנות</p>
              </button>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-gray-600">בחר משחק כדי להתחיל</p>
          </div>
        </div>
      </div>
    );
  };

  const renderSelectedGame = () => {
    switch (selectedGame) {
      case 'passover':
        return <PassoverQuestGame />;
      case 'tubishvat':
        // צריך להוסיף את המשחק ט"ו בשבט אם יהיה מוכן
        return (
          <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center p-4" dir="rtl">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h1 className="text-2xl font-bold mb-4">חגיגת ט"ו בשבט</h1>
              <p className="mb-4">המשחק יהיה זמין בקרוב!</p>
              <button 
                onClick={() => setSelectedGame(null)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                חזרה לבחירת משחק
              </button>
            </div>
          </div>
        );
      default:
        return renderGameSelector();
    }
  };

  return (
    <ThemeProvider initialTheme={defaultTheme}>
      <div className="app">
        {renderSelectedGame()}
      </div>
    </ThemeProvider>
  );
}

export default App;