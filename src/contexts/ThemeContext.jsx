/**
 * קובץ זה קיים למטרות תאימות לאחור בלבד
 * יש להשתמש ב-ThemeProvider מ-design-system במקום זה
 */

import React, { createContext } from 'react';
import { ThemeContext as DesignSystemThemeContext } from '../design-system/ThemeProvider';

// ייצוא מחדש של ה-ThemeContext מ-design-system
export const ThemeContext = DesignSystemThemeContext;

// Function to create a legacy theme provider for backward compatibility
export function ThemeProvider({ children, theme }) {
  console.warn(
    'Using deprecated ThemeContext.jsx. Please update imports to use design-system ThemeProvider instead.'
  );
  
  return (
    <DesignSystemThemeContext.Provider value={{ theme }}>
      {children}
    </DesignSystemThemeContext.Provider>
  );
}

export default ThemeContext;