import { LoggerService } from './loggerService';

/**
 * שירות מורחב לניהול נכסי מדיה במשחק
 * תומך בטעינה מקדימה, מטמון, ניהול נכסים, ומנגנוני גיבוי
 */
export class AssetManager {
  // מאגר מטמון פנימי לנכסים כבר טעונים
  static assetsCache = {
    images: {},
    audio: {}
  };
  
  // רשימת סוגי נכסים ותיקיות מתאימות
  static assetTypes = {
    backgrounds: 'backgrounds',
    characters: 'characters',
    items: 'items',
    images: 'images',
    audio: 'audio',
    icons: 'icons'
  };
  
  // נתיבים לנכסי ברירת מחדל
  static defaultAssets = {
    backgrounds: '/assets/shared/placeholders/background_placeholder.svg',
    characters: '/assets/shared/placeholders/character_placeholder.svg',
    items: '/assets/shared/placeholders/item_placeholder.svg',
    images: '/assets/shared/placeholders/image_placeholder.svg',
    audio: null // אין ברירת מחדל לאודיו
  };

  // תיקיות חלופיות לחיפוש נכסים אם לא נמצאו במיקום הראשי
  static alternativePaths = {
    backgrounds: ['images', ''],
    characters: ['images', ''],
    items: ['images', ''],
    images: ['', 'backgrounds', 'items'],
    audio: ['sounds', '']
  };
  
  /**
   * טעינה מוקדמת של נכסים הכרחיים
   * @param {string} gameId - מזהה המשחק
   * @param {Array} essentialAssets - רשימת נכסים הכרחיים לטעינה
   */
  static async preloadEssentialAssets(gameId, essentialAssets = []) {
    LoggerService.info(`[AssetManager] טוען נכסים חיוניים למשחק ${gameId}`);
    
    try {
      // אם לא הועברה רשימה ספציפית, ניתן לקבוע קבוצות ברירת מחדל
      const defaultAssets = [
        // רקעים חיוניים
        { type: 'backgrounds', path: 'scroll_background.jpg' },
        { type: 'backgrounds', path: 'intro_background.jpg' },
        { type: 'backgrounds', path: 'thumbnail.svg' },
        // תוספת של רקעים נוספים שהיו מגיעים בהמשך
        { type: 'backgrounds', path: 'ancient_map_background.jpg' },
        { type: 'backgrounds', path: 'covenant_background.jpg' },
        { type: 'backgrounds', path: 'egypt_slavery_background.jpg' },
        { type: 'backgrounds', path: 'burning_bush_background.jpg' }
      ];
      
      const assetsToLoad = essentialAssets.length ? essentialAssets : defaultAssets;
      
      // שימוש בקבוצות קטנות לטעינה יעילה
      const batchSize = 3;
      for (let i = 0; i < assetsToLoad.length; i += batchSize) {
        const batch = assetsToLoad.slice(i, i + batchSize);
        
        // הכנת מערך הבטחות לטעינה מקבילה
        const loadPromises = batch.map(asset => {
          const fullPath = this.getAssetPath(gameId, asset.path, asset.type);
          return this.preloadAssetWithRetry(fullPath, asset.type, 2);
        });
        
        // המתנה לסיום הקבוצה הנוכחית לפני המשך לקבוצה הבאה
        await Promise.allSettled(loadPromises);
      }
      
      LoggerService.info(`[AssetManager] טעינה מוקדמת הושלמה למשחק ${gameId}`);
    } catch (error) {
      LoggerService.error(`[AssetManager] שגיאה בטעינה מוקדמת:`, error);
      // לא לזרוק חריגה כדי לאפשר למשחק להמשיך גם ללא כל הנכסים
    }
  }
  
  /**
   * טעינת נכס עם מנגנון ניסיונות חוזרים ומדורגים
   * @param {string} assetPath - נתיב הנכס
   * @param {string} assetType - סוג הנכס (images, audio)
   * @param {number} maxRetries - מספר ניסיונות מקסימלי
   */
  static async preloadAssetWithRetry(assetPath, assetType = 'images', maxRetries = 2) {
    let attempts = 0;
    let lastError;
    
    // ניסיון טעינה רגיל
    while (attempts < maxRetries) {
      try {
        const asset = await this.preloadAsset(assetPath, assetType);
        return asset;
      } catch (error) {
        lastError = error;
        LoggerService.warn(`[AssetManager] ניסיון ${attempts + 1}/${maxRetries} נכשל עבור ${assetPath}: ${error.message}`);
        attempts++;
        
        // המתנה לפני הניסיון הבא (אקספוננציאלי backoff)
        if (attempts < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 200 * Math.pow(2, attempts)));
        }
      }
    }
    
    // ניסיון למצוא את הנכס במיקומים אלטרנטיביים
    try {
      const alternativePath = await this.findAlternativePath(assetPath, assetType);
      if (alternativePath) {
        LoggerService.info(`[AssetManager] נמצאה חלופה: ${alternativePath}`);
        return await this.preloadAsset(alternativePath, assetType);
      }
    } catch (altError) {
      LoggerService.warn(`[AssetManager] חיפוש חלופות נכשל:`, altError);
    }
    
    // אם הגענו לכאן, כל הניסיונות נכשלו. ננסה את נכס ברירת המחדל
    if (this.defaultAssets[assetType]) {
      try {
        LoggerService.info(`[AssetManager] משתמש בנכס ברירת מחדל: ${this.defaultAssets[assetType]}`);
        return await this.preloadAsset(this.defaultAssets[assetType], assetType);
      } catch (fallbackError) {
        LoggerService.error(`[AssetManager] גם נכס ברירת המחדל נכשל:`, fallbackError);
      }
    }
    
    // אין ברירה אלא להחזיר שגיאה
    throw lastError || new Error(`[AssetManager] כל הניסיונות לטעינת ${assetPath} נכשלו`);
  }
  
  /**
   * מחפש נתיב חלופי לנכס במקרה שהנתיב המקורי לא קיים
   * @param {string} originalPath - הנתיב המקורי
   * @param {string} assetType - סוג הנכס
   * @returns {Promise<string|null>} - נתיב חלופי או null אם לא נמצא
   */
  static async findAlternativePath(originalPath, assetType) {
    // שימוש רק עם תמונות, לא עם אודיו
    if (assetType === 'audio') return null;
    
    const fileName = originalPath.split('/').pop();
    const gameId = originalPath.includes('/games/') ? originalPath.split('/games/')[1].split('/')[0] : null;
    
    if (!gameId || !fileName) return null;
    
    const alternatives = this.alternativePaths[assetType] || [];
    
    // בדיקת מיקומים חלופיים
    for (const altType of alternatives) {
      if (!altType) continue;
      
      const altPath = `/assets/games/${gameId}/${altType}/${fileName}`;
      
      // בדיקה האם הקובץ קיים (ניסיון לטעון אותו)
      try {
        const response = await fetch(altPath, { method: 'HEAD' });
        if (response.ok) {
          return altPath;
        }
      } catch (error) {
        // התעלמות משגיאות - פשוט עוברים לאלטרנטיבה הבאה
      }
    }
    
    // ניסיון אחרון - לחפש בתיקיית shared
    try {
      const sharedPath = `/assets/shared/${assetType}/${fileName}`;
      const response = await fetch(sharedPath, { method: 'HEAD' });
      if (response.ok) {
        return sharedPath;
      }
    } catch (error) {
      // התעלמות משגיאות
    }
    
    return null;
  }
  
  /**
   * טעינת נכס בודד (תמונה או אודיו)
   */
  static preloadAsset(assetPath, assetType = 'images') {
    return new Promise((resolve, reject) => {
      // בדיקה אם הנכס כבר במטמון
      if (this.assetsCache[assetType]?.[assetPath]) {
        return resolve(this.assetsCache[assetType][assetPath]);
      }
      
      if (assetType === 'audio') {
        // טעינת קובץ אודיו
        const audio = new Audio();
        audio.src = assetPath;
        
        audio.oncanplaythrough = () => {
          this.cacheAsset(assetPath, audio, assetType);
          resolve(audio);
        };
        
        audio.onerror = (error) => {
          reject(new Error(`[AssetManager] שגיאה בטעינת אודיו ${assetPath}: ${error}`));
        };
        
        // הגדרת טיימאאוט למניעת תקיעות
        setTimeout(() => {
          if (audio.readyState === 0) { // לא התחיל לטעון
            reject(new Error(`[AssetManager] טיימאאוט בטעינת אודיו ${assetPath}`));
          }
        }, 5000);
        
        // התחלת טעינה
        audio.load();
      } else {
        // טעינת תמונה
        const img = new Image();
        
        img.onload = () => {
          this.cacheAsset(assetPath, img, 'images');
          resolve(img);
        };
        
        img.onerror = () => {
          reject(new Error(`[AssetManager] שגיאה בטעינת תמונה ${assetPath}`));
        };
        
        // הגדרת טיימאאוט למניעת תקיעות
        setTimeout(() => {
          if (!img.complete) {
            reject(new Error(`[AssetManager] טיימאאוט בטעינת תמונה ${assetPath}`));
          }
        }, 5000);
        
        img.src = assetPath;
      }
    });
  }
  
  /**
   * הוספת נכס למטמון
   */
  static cacheAsset(path, asset, type = 'images') {
    // וידוא קיום המטמון לסוג הנכס
    if (!this.assetsCache[type]) {
      this.assetsCache[type] = {};
    }
    
    // שמירה במטמון
    this.assetsCache[type][path] = asset;
    LoggerService.debug(`[AssetManager] נכס נשמר במטמון: ${path}`);
  }
  
  /**
   * קבלת נכס מהמטמון אם קיים
   */
  static getCachedAsset(path, type = 'images') {
    return this.assetsCache[type]?.[path] || null;
  }
  
  /**
   * יצירת נתיב מלא לנכס
   * @param {string} gameId - מזהה המשחק
   * @param {string} assetPath - נתיב יחסי לנכס
   * @param {string} assetType - סוג הנכס (images, audio, וכו')
   * @returns {string} - הנתיב המלא לנכס
   */
  static getAssetPath(gameId, assetPath, assetType = 'images') {
    // אם כבר נתיב מלא או חיצוני, להחזיר כמו שהוא
    if (assetPath.startsWith('/') || assetPath.startsWith('http')) {
      return assetPath;
    }
    
    // וידוא שסוג הנכס חוקי
    const validType = this.assetTypes[assetType] || 'images';
    
    // בנייה ונרמול של הנתיב
    return `/assets/games/${gameId}/${validType}/${assetPath}`;
  }
  
  /**
   * טעינת נכס או החזרתו מהמטמון
   */
  static async getAsset(gameId, assetPath, assetType = 'images') {
    const fullPath = this.getAssetPath(gameId, assetPath, assetType);
    
    // בדיקה אם הנכס כבר במטמון
    const cachedAsset = this.getCachedAsset(fullPath, assetType);
    if (cachedAsset) {
      return cachedAsset;
    }
    
    // טעינת הנכס אם אינו במטמון
    return await this.preloadAssetWithRetry(fullPath, assetType);
  }
  
  /**
   * פונקציית עזר לטיפול בשגיאות טעינת תמונה בתגיות img
   * @param {Event} errorEvent - אירוע השגיאה
   * @param {string} assetType - סוג הנכס
   */
  static handleImageError(errorEvent, assetType = 'images') {
    errorEvent.target.onerror = null;  // למניעת לולאות אינסופיות
    
    // נתיב הנכס המקורי לדיווח
    const originalSrc = errorEvent.target.src;
    LoggerService.warn(`[AssetManager] שגיאת טעינת תמונה: ${originalSrc}`);
    
    // בדיקה אם יש נכס ברירת מחדל
    const fallbackSrc = this.defaultAssets[assetType];
    
    if (fallbackSrc) {
      LoggerService.info(`[AssetManager] משתמש בנכס ברירת מחדל: ${fallbackSrc}`);
      errorEvent.target.src = fallbackSrc;
    }
  }
  
  /**
   * ניקוי מטמון לשחרור זיכרון
   */
  static clearCache(type = null) {
    if (type && this.assetsCache[type]) {
      this.assetsCache[type] = {};
      LoggerService.info(`[AssetManager] מטמון ${type} נוקה`);
    } else if (!type) {
      Object.keys(this.assetsCache).forEach(cacheType => {
        this.assetsCache[cacheType] = {};
      });
      LoggerService.info(`[AssetManager] כל המטמון נוקה`);
    }
  }
}