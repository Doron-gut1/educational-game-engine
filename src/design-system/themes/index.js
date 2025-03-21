/**
 * ייצוא מרוכז של כל התמות במערכת
 */
import { baseTheme } from './baseTheme';
import { passoverTheme } from './passoverTheme';
import { tuBishvatTheme } from './tuBishvatTheme';

// ייצוא התמות
export { baseTheme, passoverTheme, tuBishvatTheme };

// פונקציית עזר למיזוג תמות בסיסיות עם תוספות
export const mergeTheme = (baseTheme, overrides) => {
  return {
    ...baseTheme,
    ...overrides,
    colors: {
      ...baseTheme.colors,
      ...(overrides.colors || {})
    },
    gradients: {
      ...baseTheme.gradients,
      ...(overrides.gradients || {})
    },
    effects: {
      ...baseTheme.effects,
      ...(overrides.effects || {})
    },
    animations: {
      ...baseTheme.animations,
      ...(overrides.animations || {})
    },
    globalCSS: `
      ${baseTheme.globalCSS || ''}
      ${overrides.globalCSS || ''}
    `,
  };
};

// אובייקט התמות הזמינות - מאפשר בחירה דינמית לפי מזהה
export const themes = {
  base: baseTheme,
  passover: passoverTheme,
  tuBishvat: tuBishvatTheme
};

export default themes;