/**
 * שירות לטעינת תוכן משחק
 */
export class ContentLoader {
  /**
   * טעינת הגדרות משחק ספציפי
   * @param {string} gameId - מזהה המשחק
   * @returns {Promise<Object>} - קונפיגורציית המשחק
   */
  static async loadGameConfig(gameId) {
    try {
      // בשלב הראשוני בלבד משאיר אפשרות לטעינה מ-import
      // בשלב מתקדם יותר ניתן להרחיב לטעינה מ-API או מקובץ חיצוני
      const config = await import(`../games/${gameId}/config.js`);
      return config.default || config;
    } catch (error) {
      console.error(`Failed to load game config for ${gameId}:`, error);
      throw new Error(`Game ${gameId} not found or invalid`);
    }
  }

  /**
   * טעינת תוכן משחק ספציפי
   * @param {string} gameId - מזהה המשחק
   * @returns {Promise<Object>} - תוכן המשחק
   */
  static async loadGameContent(gameId) {
    try {
      // בשלב הראשוני בלבד משאיר אפשרות לטעינה מ-import
      const content = await import(`../games/${gameId}/data.json`);
      return content.default || content;
    } catch (error) {
      console.error(`Failed to load game content for ${gameId}:`, error);
      throw new Error(`Content for game ${gameId} not found or invalid`);
    }
  }

  /**
   * טעינת הגדרות דמויות עבור משחק
   * @param {string} gameId - מזהה המשחק
   * @returns {Promise<Object>} - הגדרות הדמויות
   */
  static async loadCharacters(gameId) {
    try {
      const characters = await import(`../games/${gameId}/characters.js`);
      return characters.default || characters;
    } catch (error) {
      console.error(`Failed to load characters for ${gameId}:`, error);
      // דמויות אינן חובה, לכן אם אין - מחזירים אובייקט ריק
      return {};
    }
  }
  
  /**
   * טעינת הגדרות נכסי מדיה
   * @param {string} gameId - מזהה המשחק
   * @returns {Promise<Object>} - מיפוי נכסי מדיה
   */
  static async loadMediaAssets(gameId) {
    try {
      const mediaAssets = await import(`../games/${gameId}/mediaAssets.js`);
      return mediaAssets.default || mediaAssets;
    } catch (error) {
      console.error(`Failed to load media assets for ${gameId}:`, error);
      // מיפוי נכסים אינו חובה, לכן אם אין - מחזירים אובייקט ריק
      return {};
    }
  }
  
  /**
   * טעינת תבנית משחק
   * @param {string} templateId - מזהה התבנית
   * @returns {Promise<Object>} - הגדרות התבנית
   */
  static async loadTemplate(templateId) {
    try {
      const template = await import(`../templates/${templateId}.js`);
      return template.default || template;
    } catch (error) {
      console.error(`Failed to load template ${templateId}:`, error);
      throw new Error(`Template ${templateId} not found or invalid`);
    }
  }
}