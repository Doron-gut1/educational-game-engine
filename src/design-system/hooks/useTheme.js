import { useContext } from 'react';
import { ThemeContext } from '../ThemeProvider';
import { themes } from '../themes';

/**
 * הוק לשימוש בתמה הנוכחית של מערכת העיצוב
 * @returns {Object} תמה נוכחית
 */
export function useTheme() {
  const { currentTheme } = useContext(ThemeContext);
  
  // החזרת התמה הנוכחית אם קיימת, אחרת תמה ברירת מחדל
  return themes[currentTheme] || themes.base;
}