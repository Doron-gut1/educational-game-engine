import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { defaultTheme } from './themes/defaultTheme';
import './App.css';

function App() {
  return (
    <ThemeProvider initialTheme={defaultTheme}>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <h1 className="text-3xl font-bold text-blue-800 mb-4">מנוע משחק מודולרי</h1>
          <p className="text-gray-600 mb-6">מערכת ליצירת משחקים חינוכיים אינטראקטיביים</p>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p>המערכת נמצאת בשלבי פיתוח. שלב נוכחי: הקמת תשתית</p>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;