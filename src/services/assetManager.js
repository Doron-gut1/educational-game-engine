import { LoggerService } from './loggerService';

/**
 * שירות לניהול נכסי מדיה במשחק
 * תומך בטעינה מקדימה, מטמון, וניהול נכסים
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
        { type: 'backgrounds', path: 'main_background.jpg' },
        { type: 'backgrounds', path: 'scroll_background.jpg' },
      ];
      
      const assetsToLoad = essentialAssets.length ? essentialAssets : defaultAssets;
      
      // הכנת מערך הבטחות לטעינה מקבילה
      const loadPromises = assetsToLoad.map(asset => {
        const fullPath = this.getAssetPath(gameId, asset.path, asset.type);
        return this.preloadAsset(fullPath, asset.type);
      });
      
      // המתנה לסיום כל הטעינות
      await Promise.all(loadPromises);
      LoggerService.info(`[AssetManager] טעינה מוקדמת הושלמה`);
    } catch (error) {
      LoggerService.error(`[AssetManager] שגיאה בטעינה מוקדמת:`, error);
      // לא לזרוק חריגה כדי לאפשר למשחק להמשיך גם ללא כל הנכסים
    }
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
          LoggerService.error(`[AssetManager] שגיאה בטעינת אודיו ${assetPath}:`, error);
          reject(new Error(`שגיאה בטעינת אודיו ${assetPath}`));
        };
        
        // התחלת טעינה
        audio.load();
      } else {
        // טעינת תמונה
        const img = new Image();
        img.src = assetPath;
        
        img.onload = () => {
          this.cacheAsset(assetPath, img, 'images');
          resolve(img);
        };
        
        img.onerror = (error) => {
          LoggerService.error(`[AssetManager] שגיאה בטעינת תמונה ${assetPath}:`, error);
          reject(new Error(`שגיאה בטעינת תמונה ${assetPath}`));
        };
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
    return await this.preloadAsset(fullPath, assetType);
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