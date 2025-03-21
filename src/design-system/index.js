/**
 * ייצוא מרכזי של מערכת העיצוב "מסע הדעת"
 */

// ייצוא התמות
export * from './themes';

// ייצוא רכיבים
export * from './components';

// ייצוא מידע נוסף
export const DESIGN_SYSTEM_VERSION = '1.0.0';
export const DESIGN_SYSTEM_NAME = 'מסע הדעת';

/**
 * מידע על מערכת העיצוב
 */
export const designSystemInfo = {
  name: DESIGN_SYSTEM_NAME,
  version: DESIGN_SYSTEM_VERSION,
  description: 'מערכת עיצוב למשחקים לימודיים אינטראקטיביים',
  themes: ['base', 'passover', 'tuBishvat'],
  components: {
    buttons: ['Button', 'IconButton'],
    cards: ['ScrollCard', 'GlassCard'],
    navigation: ['JourneyMap', 'StageMarker'],
  },
  author: 'צוות פיתוח מנוע משחק מודולרי',
  year: 2025
};