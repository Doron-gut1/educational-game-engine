import { LoggerService } from './loggerService';

/**
 * שירות מורחב לניהול נכסי מדיה במשחק
 * תומך בטעינה מקדימה, מטמון, ניהול נכסים, ומנגנוני גיבוי
 * גרסה 2.0 עם שיפורים רבים
 */
export class AssetManager {
  // מאגר מטמון פנימי לנכסים כבר טעונים
  static assetsCache = {
    images: {},
    audio: {}
  };
  
  // מטמון לתוצאות בדיקת קיום קבצים - לשיפור ביצועים
  static pathExistenceCache = {};
  
  // סטטיסטיקות שימוש
  static assetStats = {
    checks: 0,
    misses: 0,
    hits: 0,
    fallbacks: 0
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
  
  // משתנה לשמירת תוצאות בדיקת קיום תיקיות
  static verifiedFolders = {};

  // תיקיות חלופיות לחיפוש נכסים אם לא נמצאו במיקום הראשי
  static alternativePaths = {
    backgrounds: ['images', ''],
    characters: ['images', ''],
    items: ['images', ''],
    images: ['', 'backgrounds', 'items'],
    audio: ['sounds', '']
  };
  
  /**
   * בדיקת קיום של נכס בנתיב ספציפי
   * עם מטמון תוצאות לשיפור ביצועים
   */
  static async verifyAssetExists(assetPath) {
    this.assetStats.checks++;
    
    // בדיקה במטמון לשיפור ביצועים
    if (this.pathExistenceCache[assetPath] !== undefined) {
      return this.pathExistenceCache[assetPath];
    }
    
    try {
      const response = await fetch(assetPath, { 
        method: 'HEAD', 
        cache: 'no-store' // מניעת מטמון דפדפן
      });
      
      const exists = response.ok;
      
      if (exists) {
        this.assetStats.hits++;
        LoggerService.debug(`[AssetManager] Asset verified: ${assetPath}`);
      } else {
        this.assetStats.misses++;
        LoggerService.warn(`[AssetManager] Asset not found: ${assetPath} (status: ${response.status})`);
      }
      
      // שמירה במטמון
      this.pathExistenceCache[assetPath] = exists;
      return exists;
    } catch (error) {
      this.assetStats.misses++;
      LoggerService.error(`[AssetManager] Error verifying asset: ${assetPath}`, error);
      
      // שמירה במטמון כקובץ לא קיים במקרה של שגיאה
      this.pathExistenceCache[assetPath] = false;
      return false;
    }
  }
  
  /**
   * טעינה מוקדמת של נכסים הכרחיים
   */
  static async preloadEssentialAssets(gameId, essentialAssets = []) {
    LoggerService.info(`[AssetManager] טוען נכסים חיוניים למשחק ${gameId}`);
    
    try {
      // בדיקת קיום תיקיות חיוניות לפני טעינת נכסים
      await this.verifyEssentialFolders(gameId);
      
      // אם לא הועברה רשימה ספציפית, ניתן לקבוע קבוצות ברירת מחדל
      const defaultAssets = [
        // רקעים חיוניים
        { type: 'backgrounds', path: 'scroll_background.jpg' },
        { type: 'backgrounds', path: 'intro_background.jpg' },
        { type: 'backgrounds', path: 'thumbnail.svg' },
        // רקעים שיהיו בשימוש מאוחר יותר
        { type: 'backgrounds', path: 'ancient_map_background.jpg' },
        { type: 'backgrounds', path: 'egypt_slavery_background.jpg' }
      ];
      
      const assetsToLoad = essentialAssets.length ? essentialAssets : defaultAssets;
      
      // שימוש בקבוצות קטנות לטעינה יעילה
      const batchSize = 3;
      for (let i = 0; i < assetsToLoad.length; i += batchSize) {
        const batch = assetsToLoad.slice(i, i + batchSize);
        
        // הכנת מערך הבטחות לטעינה מקבילה
        const loadPromises = batch.map(asset => {
          const fullPath = this.getAssetPath(gameId, asset.path, asset.type);
          return this.loadAssetSafely(gameId, asset.path, asset.type);
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
   * בדיקת קיום תיקיות חיוניות
   */
  static async verifyEssentialFolders(gameId) {
    if (this.verifiedFolders[gameId]) {
      return this.verifiedFolders[gameId];
    }
    
    // רשימת תיקיות לבדיקה
    const foldersToCheck = [
      `/assets/games/${gameId}/backgrounds`,
      `/assets/shared/placeholders`
    ];
    
    const results = {};
    let success = true;
    
    for (const folderPath of foldersToCheck) {
      try {
        // ניסיון לטעון קובץ check.txt כדי לוודא שהתיקייה קיימת
        const response = await fetch(`${folderPath}/check.txt`);
        
        // במקרה של 404 לקובץ check.txt, ננסה לבדוק אם התיקיה עצמה קיימת
        if (response.status === 404) {
          LoggerService.warn(`[AssetManager] check.txt לא נמצא בנתיב ${folderPath}. בודק קיום תיקייה...`);
          
          // פשוט נבדוק אם יש תמונות בתיקייה
          const alternativeCheck = await fetch(`${folderPath}`);
          
          if (alternativeCheck.ok || alternativeCheck.status !== 404) {
            results[folderPath] = "התיקייה קיימת אבל check.txt חסר";
          } else {
            results[folderPath] = "התיקייה לא נמצאה";
            success = false;
          }
        } else if (response.ok) {
          results[folderPath] = "נמצא";
        } else {
          results[folderPath] = `שגיאה ${response.status}`;
          success = false;
        }
      } catch (error) {
        LoggerService.error(`[AssetManager] שגיאה בבדיקת תיקייה ${folderPath}:`, error);
        results[folderPath] = `שגיאה: ${error.message}`;
        // לא נכשל לגמרי כי יכול להיות שהשגיאה זמנית
      }
    }
    
    LoggerService.info(`[AssetManager] בדיקת תיקיות: `, results);
    
    // שמירת התוצאות למניעת בדיקות חוזרות
    this.verifiedFolders[gameId] = { success, results };
    
    return { success, results };
  }
  
  /**
   * מחפש נתיב חלופי לנכס במקרה שהנתיב המקורי לא קיים
   * גרסה משופרת עם חיפוש מקיף יותר
   */
  static async findAlternativePath(originalPath, assetType) {
    // שימוש רק עם תמונות, לא עם אודיו
    if (assetType === 'audio') return null;
    
    const fileName = originalPath.split('/').pop();
    const gameId = originalPath.includes('/games/') ? originalPath.split('/games/')[1].split('/')[0] : null;
    
    if (!gameId || !fileName) return null;
    
    // מפת חיפוש חדשה - אלטרנטיבות בכל סוגי המיקומים
    const searchPaths = [
      // 1. חיפוש באותו gameId בסוגי נכסים שונים
      ...Object.values(this.assetTypes).map(type => 
        `/assets/games/${gameId}/${type}/${fileName}`
      ),
      
      // 2. חיפוש בתיקייה הראשית של המשחק
      `/assets/games/${gameId}/${fileName}`,
      
      // 3. חיפוש בתיקיית shared לפי סוג נכס
      ...Object.values(this.assetTypes).map(type => 
        `/assets/shared/${type}/${fileName}`
      ),
      
      // 4. חיפוש בתיקיית placeholders
      `/assets/shared/placeholders/${fileName}`,
    ]
    // נמנע כפילויות ומסיר את הנתיב המקורי
    .filter((path, index, self) => path !== originalPath && self.indexOf(path) === index);
    
    // בדיקה רצינית של כל הנתיבים
    for (const path of searchPaths) {
      if (await this.verifyAssetExists(path)) {
        LoggerService.info(`[AssetManager] נמצאה חלופה: ${path} (במקום ${originalPath})`);
        this.assetStats.fallbacks++;
        return path;
      }
    }
    
    // לא נמצאה חלופה ספציפית, מחזיר ברירת מחדל כללית
    return this.defaultAssets[assetType];
  }
  
  /**
   * טעינת נכס בצורה בטוחה עם ניסיונות חוזרים ומדורגים
   * גרסה משופרת שמחזירה תמיד תוצאה
   */
  static async loadAssetSafely(gameId, assetPath, assetType = 'images', maxRetries = 2) {
    // יצירת נתיב מלא ובדיקה במטמון
    const fullPath = this.getAssetPath(gameId, assetPath, assetType);
    
    // בדיקה אם הנכס כבר במטמון
    const cachedAsset = this.getCachedAsset(fullPath, assetType);
    if (cachedAsset) {
      return cachedAsset;
    }
    
    let attempts = 0;
    let lastError = null;
    
    // ניסיון טעינה רגיל עם מספר ניסיונות
    while (attempts < maxRetries) {
      try {
        // ניסיון טעינה
        const asset = await this.preloadAsset(fullPath, assetType);
        return asset;
      } catch (error) {
        lastError = error;
        LoggerService.warn(`[AssetManager] ניסיון ${attempts + 1}/${maxRetries} נכשל עבור ${fullPath}`, error);
        attempts++;
        
        // המתנה לפני ניסיון נוסף
        if (attempts < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 300 * Math.pow(1.5, attempts)));
        }
      }
    }
    
    // חיפוש חלופה
    try {
      const alternativePath = await this.findAlternativePath(fullPath, assetType);
      if (alternativePath) {
        try {
          return await this.preloadAsset(alternativePath, assetType);
        } catch (error) {
          LoggerService.error(`[AssetManager] גם טעינת חלופה נכשלה: ${alternativePath}`, error);
        }
      }
    } catch (error) {
      LoggerService.error(`[AssetManager] שגיאה בחיפוש חלופה: ${fullPath}`, error);
    }
    
    // כישלון מוחלט - יצירת אובייקט חירום
    LoggerService.error(`[AssetManager] כל הניסיונות לטעינת ${fullPath} נכשלו. יצירת אובייקט חירום.`);
    
    if (assetType === 'audio') {
      // אודיו ריק
      const emptyAudio = new Audio();
      this.cacheAsset(fullPath, emptyAudio, assetType); // שמירה במטמון
      return emptyAudio;
    } else {
      // תמונה בסיסית
      const emptyImg = new Image();
      emptyImg.width = 50;
      emptyImg.height = 50;
      emptyImg.src = this.defaultAssets[assetType] || this.defaultAssets.images;
      this.cacheAsset(fullPath, emptyImg, assetType); // שמירה במטמון
      return emptyImg;
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
          reject(new Error(`[AssetManager] שגיאה בטעינת אודיו ${assetPath}: ${error}`));
        };
        
        // הגדרת טיימאאוט למניעת תקיעות - קצר יותר מהקודם
        setTimeout(() => {
          if (audio.readyState === 0) { // לא התחיל לטעון
            reject(new Error(`[AssetManager] טיימאאוט בטעינת אודיו ${assetPath}`));
          }
        }, 3000); // קיצור הזמן ל-3 שניות
        
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
        
        // הגדרת טיימאאוט למניעת תקיעות - קצר יותר מהקודם
        setTimeout(() => {
          if (!img.complete) {
            reject(new Error(`[AssetManager] טיימאאוט בטעינת תמונה ${assetPath}`));
          }
        }, 3000); // קיצור הזמן ל-3 שניות
        
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
    
    // בדיקה אם assetPath כולל תיקיה
    if (assetPath.includes('/')) {
      // נתיב שכבר כולל תיקיה - ננסה לזהות את סוג הנכס מהנתיב
      const segments = assetPath.split('/');
      const potentialType = segments[0].toLowerCase();
      
      // אם התיקיה היא סוג תקף של נכס, נשתמש בה ונסיר אותה מהנתיב
      if (Object.values(this.assetTypes).includes(potentialType)) {
        assetType = potentialType;
        assetPath = segments.slice(1).join('/');
      }
    }
    
    // וידוא שסוג הנכס חוקי
    const validType = this.assetTypes[assetType] || 'images';
    
    // בנייה ונרמול של הנתיב
    return `/assets/games/${gameId}/${validType}/${assetPath}`;
  }
  
  /**
   * טעינת נכס או החזרתו מהמטמון
   * גרסה משופרת באמצעות הפונקציה loadAssetSafely
   */
  static async getAsset(gameId, assetPath, assetType = 'images') {
    return await this.loadAssetSafely(gameId, assetPath, assetType);
  }
  
  /**
   * פונקציית עזר לטיפול בשגיאות טעינת תמונה בתגיות img
   * גרסה משופרת שמנסה למצוא חלופות לפני ברירת מחדל
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
    
    // הוספת ניסיון אסינכרוני למציאת חלופה
    this.findAlternativePath(originalSrc, assetType)
      .then(alternativePath => {
        if (alternativePath && alternativePath !== fallbackSrc) {
          LoggerService.info(`[AssetManager] נמצאה חלופה אסינכרונית: ${alternativePath}`);
          errorEvent.target.src = alternativePath;
        }
      })
      .catch(() => {/* התעלם משגיאות */});
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
      
      // ניקוי מטמון בדיקות קיום
      this.pathExistenceCache = {};
      
      // איפוס סטטיסטיקה
      this.assetStats = {
        checks: 0,
        misses: 0,
        hits: 0,
        fallbacks: 0
      };
      
      LoggerService.info(`[AssetManager] כל המטמון ומטמון הבדיקות נוקה`);
    }
  }
}