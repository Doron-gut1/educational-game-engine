/**
 * מנהל נכסי המדיה של המשחק
 * אחראי על טעינה, ניהול ושחרור של תמונות, צלילים ואנימציות
 */
export class AssetManager {
  constructor(mediaAssets = {}) {
    this.mediaAssets = mediaAssets;
    this.loadedAssets = {
      images: {},
      audio: {},
      animations: {}
    };
    this.loadingPromises = {};
  }

  /**
   * הגדרת מפת נכסי מדיה
   * @param {Object} mediaAssets - מפת נכסי מדיה
   */
  setMediaAssets(mediaAssets) {
    this.mediaAssets = mediaAssets;
  }

  /**
   * קבלת כתובת נכס מדיה לפי סוג ומזהה
   * @param {string} type - סוג הנכס (images, audio, animations)
   * @param {string} category - קטגוריה (characters, backgrounds, וכו')
   * @param {string} id - מזהה הנכס
   * @returns {string|null} - כתובת הנכס או null אם לא נמצא
   */
  getAssetUrl(type, category, id) {
    try {
      return this.mediaAssets[type]?.[category]?.[id] || null;
    } catch (error) {
      console.error(`Failed to get asset URL for ${type}/${category}/${id}:`, error);
      return null;
    }
  }

  /**
   * טעינת תמונה
   * @param {string} url - כתובת התמונה
   * @returns {Promise<HTMLImageElement>} - אובייקט התמונה
   */
  loadImage(url) {
    if (this.loadedAssets.images[url]) {
      return Promise.resolve(this.loadedAssets.images[url]);
    }

    if (this.loadingPromises[url]) {
      return this.loadingPromises[url];
    }

    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.loadedAssets.images[url] = img;
        delete this.loadingPromises[url];
        resolve(img);
      };
      img.onerror = () => {
        delete this.loadingPromises[url];
        reject(new Error(`Failed to load image: ${url}`));
      };
      img.src = url;
    });

    this.loadingPromises[url] = promise;
    return promise;
  }

  /**
   * טעינת קובץ אודיו
   * @param {string} url - כתובת קובץ האודיו
   * @returns {Promise<HTMLAudioElement>} - אובייקט האודיו
   */
  loadAudio(url) {
    if (this.loadedAssets.audio[url]) {
      return Promise.resolve(this.loadedAssets.audio[url]);
    }

    if (this.loadingPromises[url]) {
      return this.loadingPromises[url];
    }

    const promise = new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.oncanplaythrough = () => {
        this.loadedAssets.audio[url] = audio;
        delete this.loadingPromises[url];
        resolve(audio);
      };
      audio.onerror = () => {
        delete this.loadingPromises[url];
        reject(new Error(`Failed to load audio: ${url}`));
      };
      audio.src = url;
      audio.load();
    });

    this.loadingPromises[url] = promise;
    return promise;
  }

  /**
   * טעינת קובץ אנימציה (JSON)
   * @param {string} url - כתובת קובץ האנימציה
   * @returns {Promise<Object>} - אובייקט האנימציה
   */
  async loadAnimation(url) {
    if (this.loadedAssets.animations[url]) {
      return this.loadedAssets.animations[url];
    }

    if (this.loadingPromises[url]) {
      return this.loadingPromises[url];
    }

    const promise = fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load animation: ${url}`);
        }
        return response.json();
      })
      .then(data => {
        this.loadedAssets.animations[url] = data;
        delete this.loadingPromises[url];
        return data;
      });

    this.loadingPromises[url] = promise;
    return promise;
  }

  /**
   * טעינת נכס לפי סוג וכתובת
   * @param {string} type - סוג הנכס (image, audio, animation)
   * @param {string} url - כתובת הנכס
   * @returns {Promise<any>} - הנכס שנטען
   */
  async loadAsset(type, url) {
    switch (type) {
      case 'image':
        return this.loadImage(url);
      case 'audio':
        return this.loadAudio(url);
      case 'animation':
        return this.loadAnimation(url);
      default:
        throw new Error(`Unknown asset type: ${type}`);
    }
  }

  /**
   * טעינה מקדימה של נכסים חיוניים
   * @param {Array} assetsList - רשימת נכסים לטעינה
   * @returns {Promise<void>}
   */
  async preloadAssets(assetsList) {
    const loadPromises = assetsList.map(asset => {
      const { type, category, id } = asset;
      const url = this.getAssetUrl(type, category, id);
      if (!url) {
        console.warn(`Asset not found: ${type}/${category}/${id}`);
        return Promise.resolve();
      }
      return this.loadAsset(type, url);
    });

    return Promise.all(loadPromises);
  }

  /**
   * שחרור נכסים שאינם בשימוש לשחרור זיכרון
   * @param {Array} keepAssetsList - רשימת נכסים לשמירה
   */
  unloadUnusedAssets(keepAssetsList = []) {
    const keepUrls = new Set(keepAssetsList.map(asset => {
      const { type, category, id } = asset;
      return this.getAssetUrl(type, category, id);
    }).filter(Boolean));

    // שחרור תמונות שאינן בשימוש
    for (const url in this.loadedAssets.images) {
      if (!keepUrls.has(url)) {
        delete this.loadedAssets.images[url];
      }
    }

    // שחרור קבצי אודיו שאינם בשימוש
    for (const url in this.loadedAssets.audio) {
      if (!keepUrls.has(url)) {
        delete this.loadedAssets.audio[url];
      }
    }

    // שחרור אנימציות שאינן בשימוש
    for (const url in this.loadedAssets.animations) {
      if (!keepUrls.has(url)) {
        delete this.loadedAssets.animations[url];
      }
    }
  }

  /**
   * בדיקה אם נכס טעון במטמון
   * @param {string} type - סוג הנכס
   * @param {string} url - כתובת הנכס
   * @returns {boolean} - האם הנכס טעון
   */
  isAssetLoaded(type, url) {
    switch (type) {
      case 'image':
        return !!this.loadedAssets.images[url];
      case 'audio':
        return !!this.loadedAssets.audio[url];
      case 'animation':
        return !!this.loadedAssets.animations[url];
      default:
        return false;
    }
  }

  /**
   * קבלת נכס טעון
   * @param {string} type - סוג הנכס
   * @param {string} url - כתובת הנכס
   * @returns {any|null} - הנכס הטעון או null אם לא נטען
   */
  getLoadedAsset(type, url) {
    switch (type) {
      case 'image':
        return this.loadedAssets.images[url] || null;
      case 'audio':
        return this.loadedAssets.audio[url] || null;
      case 'animation':
        return this.loadedAssets.animations[url] || null;
      default:
        return null;
    }
  }
}