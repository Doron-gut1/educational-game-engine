// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoggerService } from './services';
import './App.css';

// ייבוא מערכת העיצוב החדשה
import { ThemeProvider } from './design-system';

// ייבוא הדפים החדשים
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';

function App() {
  LoggerService.debug("App component initialized");
  
  return (
    <ThemeProvider theme="base">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game/:gameId" element={<GamePage />} />
          {/* הפניה לדף הבית במקרה של נתיב לא חוקי */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;