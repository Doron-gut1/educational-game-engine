/**
 * מיצוא כל ההוקים במודול אחד
 */

// הוק לגישה לקונטקסט המשחק
export { useGameContext } from '../contexts/GameContext';

// הוק לשימוש בתמות
export { useTheme } from '../contexts/ThemeContext';

// הוק לטעינת נכסים
export { useAsset } from './useAsset';

// הוקים להתנהגויות
export { default as useScoring } from './useScoring';
export { default as useTimer } from './useTimer';
export { default as useHints } from './useHints';
