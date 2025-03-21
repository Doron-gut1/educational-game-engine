/**
 * רשימת המשחקים הזמינים במערכת
 */

// יבוא קונפיגורציות המשחקים
import passoverConfig from './passover/config';
import testAssetsConfig from './test-assets/config';

// ייצוא רשימת המשחקים הזמינים
export const availableGames = [
  passoverConfig,
  testAssetsConfig
  // להוסיף משחקים נוספים כאן
];

/**
 * פונקציה לקבלת רשימת המשחקים הזמינים
 * @returns {Array} רשימת המשחקים
 */
export const getAvailableGames = () => {
  return availableGames;
};

/**
 * פונקציה למציאת משחק לפי מזהה
 * @param {string} gameId - מזהה המשחק
 * @returns {Object|null} - קונפיגורציית המשחק או null אם לא נמצא
 */
export const findGameById = (gameId) => {
  return availableGames.find(game => game.id === gameId) || null;
};
