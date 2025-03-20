/**
 * מערכת ניהול תבניות המשחק
 * מאפשרת טעינה, יצירה ועדכון של תבניות משחק
 */
export class TemplateManager {
  constructor() {
    this.templates = {};
    this.loadedTemplates = [];
    
    // מיפוי של מזהי תבניות לשמות קבצים
    this.templateFileMapping = {
      'quest_journey': 'questJourney',
      // ניתן להוסיף כאן מיפויים נוספים בעתיד אם יהיו אי התאמות נוספות
    };
  }

  /**
   * מתרגם מזהה תבנית לשם קובץ
   * @param {string} templateId - מזהה התבנית
   * @returns {string} - שם הקובץ התואם
   */
  getTemplateFileName(templateId) {
    // אם יש מיפוי מפורש, השתמש בו
    if (this.templateFileMapping[templateId]) {
      return this.templateFileMapping[templateId];
    }
    
    // אחרת, השתמש במזהה כמו שהוא
    return templateId;
  }

  /**
   * טעינת תבנית לפי מזהה
   * @param {string} templateId - מזהה התבנית
   * @returns {Promise<Object>} - תבנית המשחק
   */
  async loadTemplate(templateId) {
    // בדיקה אם התבנית כבר נטענה
    if (this.templates[templateId]) {
      return this.templates[templateId];
    }

    try {
      // המרת מזהה התבנית לשם קובץ מתאים
      const templateFileName = this.getTemplateFileName(templateId);
      
      // טעינת הקובץ
      const module = await import(`../../templates/${templateFileName}.js`);
      const template = module.default || module;
      
      this.templates[templateId] = template;
      this.loadedTemplates.push(templateId);
      
      return template;
    } catch (error) {
      console.error(`Failed to load template ${templateId}:`, error);
      throw new Error(`Template ${templateId} not found or invalid`);
    }
  }

  /**
   * קבלת תבנית שכבר נטענה
   * @param {string} templateId - מזהה התבנית
   * @returns {Object|null} - תבנית המשחק או null אם לא נטענה
   */
  getTemplate(templateId) {
    return this.templates[templateId] || null;
  }

  /**
   * יצירת משחק חדש על בסיס תבנית
   * @param {string} templateId - מזהה התבנית
   * @param {Object} customizations - התאמות אישיות
   * @returns {Promise<Object>} - הגדרות המשחק החדש
   */
  async createGameFromTemplate(templateId, customizations = {}) {
    const template = await this.loadTemplate(templateId);

    // שילוב הגדרות התבנית עם התאמות אישיות
    const gameConfig = this.mergeTemplateWithCustomizations(template, customizations);
    
    return gameConfig;
  }

  /**
   * מיזוג תבנית עם התאמות אישיות
   * @param {Object} template - תבנית בסיסית
   * @param {Object} customizations - התאמות אישיות
   * @returns {Object} - תבנית מותאמת
   */
  mergeTemplateWithCustomizations(template, customizations) {
    // מיזוג בסיסי
    const merged = {
      ...template,
      ...customizations
    };

    // מיזוג מובנה יותר עבור מבנים מורכבים
    if (template.structure && customizations.structure) {
      merged.structure = this.deepMerge(template.structure, customizations.structure);
    }

    if (template.progression && customizations.progression) {
      merged.progression = this.deepMerge(template.progression, customizations.progression);
    }

    if (template.difficulty && customizations.difficulty) {
      merged.difficulty = this.deepMerge(template.difficulty, customizations.difficulty);
    }

    if (template.storytelling && customizations.storytelling) {
      merged.storytelling = this.deepMerge(template.storytelling, customizations.storytelling);
    }

    if (template.defaultSettings && customizations.defaultSettings) {
      merged.defaultSettings = this.deepMerge(template.defaultSettings, customizations.defaultSettings);
    }

    return merged;
  }

  /**
   * מיזוג עמוק של אובייקטים
   * @param {Object} target - אובייקט יעד
   * @param {Object} source - אובייקט מקור
   * @returns {Object} - אובייקט ממוזג
   */
  deepMerge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (typeof source[key] === 'object' && source[key] !== null && target[key]) {
        result[key] = this.deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }

  /**
   * קבלת רשימת כל התבניות הזמינות
   * @returns {Promise<Array>} - רשימת התבניות הזמינות
   */
  async getAvailableTemplates() {
    // כרגע מחזיר רק תבניות שנטענו
    // בעתיד יכול לבצע סריקה דינמית של כל התבניות הזמינות
    return this.loadedTemplates.map(id => ({
      id,
      name: this.templates[id].name,
      description: this.templates[id].description
    }));
  }
}