import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { baseTheme, themes } from './themes';

// יצירת קונטקסט התמה
export const ThemeContext = createContext({
  theme: baseTheme,
  setTheme: () => {},
});

/**
 * רכיב ספק התמה - מאפשר גישה לתמה הנוכחית בכל המערכת
 * 
 * @param {Object} props - Props הרכיב
 * @param {ReactNode} props.children - תוכן הרכיב
 * @param {Object|string} props.theme - תמה לשימוש (אובייקט או מזהה)
 */
export const ThemeProvider = ({ children, theme = 'base' }) => {
  // המרת מזהה תמה לאובייקט אם צריך
  const getThemeObject = (themeInput) => {
    // אם התמה היא מחרוזת, קבל את התמה המתאימה מהאובייקט themes
    if (typeof themeInput === 'string') {
      return themes[themeInput] || baseTheme;
    }
    // אם התמה היא אובייקט, החזר אותו
    if (themeInput && typeof themeInput === 'object') {
      return themeInput;
    }
    // ברירת מחדל היא התמה הבסיסית
    return baseTheme;
  };
  
  const [currentTheme, setCurrentTheme] = useState(() => getThemeObject(theme));
  
  // עדכון התמה כאשר ה-prop משתנה
  useEffect(() => {
    const newTheme = getThemeObject(theme);
    if (newTheme !== currentTheme) {
      setCurrentTheme(newTheme);
    }
  }, [theme, currentTheme]);
  
  // יצירת משתני CSS בהתאם לתמה
  useEffect(() => {
    if (!currentTheme) return; // וידוא שיש תמה תקפה
    
    const root = document.documentElement;
    
    // הוספת משתני CSS לצבעים
    if (currentTheme.colors) {
      Object.entries(currentTheme.colors).forEach(([name, value]) => {
        root.style.setProperty(`--color-${name}`, value);
      });
    }
    
    // הוספת משתני CSS למדרג גדלים
    if (currentTheme.sizes) {
      // משתני borderRadius
      if (currentTheme.sizes.borderRadius) {
        Object.entries(currentTheme.sizes.borderRadius).forEach(([name, value]) => {
          root.style.setProperty(`--border-radius-${name}`, value);
        });
      }
      
      // משתני spacing
      if (currentTheme.sizes.spacing) {
        Object.entries(currentTheme.sizes.spacing).forEach(([name, value]) => {
          root.style.setProperty(`--spacing-${name}`, value);
        });
      }
    }
    
    // הוספת גופנים
    if (currentTheme.fonts) {
      Object.entries(currentTheme.fonts).forEach(([name, value]) => {
        root.style.setProperty(`--font-${name}`, value);
      });
    }
    
    // הוספת משתני CSS לאנימציות
    if (currentTheme.transitions) {
      Object.entries(currentTheme.transitions).forEach(([name, value]) => {
        root.style.setProperty(`--transition-${name}`, value);
      });
    }
    
    // הוספת style גלובלי עם אנימציות
    if (currentTheme.globalCSS) {
      let styleElement = document.getElementById('theme-global-css');
      
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'theme-global-css';
        document.head.appendChild(styleElement);
      }
      
      styleElement.textContent = currentTheme.globalCSS;
    }
    
    // הוספת dir אם צריך
    document.documentElement.dir = 'rtl';
    
  }, [currentTheme]);
  
  // העברת התמה והאפשרות לשנות אותה
  const contextValue = {
    theme: currentTheme || baseTheme, // תמיד יהיה ערך ברירת מחדל אם התמה ריקה
    setTheme: setCurrentTheme,
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  theme: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ]),
};

/**
 * הוק לשימוש בתמה הנוכחית
 * @returns {Object} אובייקט התמה הנוכחית
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context.theme;
};

/**
 * הוק לשינוי התמה הנוכחית
 * @returns {Function} פונקציית שינוי התמה
 */
export const useThemeSetter = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeSetter must be used within a ThemeProvider');
  }
  return context.setTheme;
};