import { useState, useEffect } from 'react';
import { useGameContext } from '../contexts/GameContext';
import { LoggerService } from '../services/loggerService';

/**
 * הוק לטעינת נכסים ושימוש בהם
 * @param {string} assetPath - נתיב הנכס או מזהה
 * @param {string} assetType - סוג הנכס (images, audio, וכו')
 * @returns {Object} - הנכס הטעון, סטטוס טעינה ושגיאות (אם יש)
 */
export function useAsset(assetPath, assetType = 'images') {
  const { getAssetPath, loadAsset, gameConfig } = useGameContext();
  const [asset, setAsset] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // אם אין נתיב או אם אין משחק טעון, לא ננסה לטעון
    if (!assetPath || !gameConfig?.id) {
      setIsLoading(false);
      return;
    }
    
    let isMounted = true;
    
    async function fetchAsset() {
      try {
        setIsLoading(true);
        setError(null);
        
        // קבלת הנכס באמצעות AssetManager
        const loadedAsset = await loadAsset(assetPath, assetType);
        
        // עדכון המצב רק אם הרכיב עדיין מחובר
        if (isMounted) {
          setAsset(loadedAsset);
          setIsLoading(false);
        }
      } catch (err) {
        LoggerService.error(`[useAsset] Error loading asset ${assetPath}:`, err);
        if (isMounted) {
          setError(err.message || 'Failed to load asset');
          setIsLoading(false);
        }
      }
    }
    
    fetchAsset();
    
    // ניקוי בעת התנתקות
    return () => {
      isMounted = false;
    };
  }, [assetPath, assetType, loadAsset, gameConfig]);
  
  // החזרת הנתיב המלא לנכס (שימושי לתגיות img ו-audio)
  const fullPath = getAssetPath(assetPath, assetType);
  
  return {
    asset,         // הנכס עצמו (Image, Audio)
    fullPath,      // הנתיב המלא לנכס
    isLoading,     // האם הנכס עדיין נטען
    error          // שגיאת טעינה (אם קיימת)
  };
}