/**
 * ייצוא מרוכז של כל התמות במערכת
 */
export { baseTheme } from './baseTheme';
export { passoverTheme } from './passoverTheme';
export { tuBishvatTheme } from './tuBishvatTheme';

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