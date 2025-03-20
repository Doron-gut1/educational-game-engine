import React, { createContext, useState, useContext } from 'react';
import { defaultTheme } from '../themes/defaultTheme';

// יצירת קונטקסט לנושא
export const ThemeContext = createContext();

// ספק נושא שמאפשר גישה לכל רכיבי הילדים
export const ThemeProvider = ({ children, initialTheme = defaultTheme }) => {
  const [theme, setTheme] = useState(initialTheme);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// הוק לשימוש בנושא
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context.theme;
};

// הוק לשינוי נושא
export const useChangeTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useChangeTheme must be used within a ThemeProvider');
  }
  return context.changeTheme;
};