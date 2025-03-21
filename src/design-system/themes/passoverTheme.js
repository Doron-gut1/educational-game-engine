/**
 * תמת פסח - "המסע לחירות"
 * תמה מותאמת לפסח המבוססת על התמה הבסיסית עם שינויים ספציפיים לחג.
 */
import { baseTheme } from './baseTheme';

export const passoverTheme = {
  ...baseTheme,
  
  name: "מסע הדעת - פסח: המסע לחירות",
  
  colors: {
    ...baseTheme.colors,
    
    // צבעים ראשיים - משתמשים בגוני סגול-כחול עמוק המסמלים מלכות
    primary: "#4338CA",        // סגול-כחול עמוק - מלכות, חירות
    primaryLight: "#E0E7FF",   // סגול בהיר
    primaryDark: "#3730A3",    // סגול כהה
    
    // צבעי משניים - משתמשים בגוני כחול-ים המסמלים קריעת ים סוף
    secondary: "#0284C7",      // כחול-ים - קריעת ים סוף
    secondaryLight: "#BAE6FD", // כחול-ים בהיר
    secondaryDark: "#0369A1",  // כחול-ים כהה
    
    // צבעי אקצנט - משתמשים בגוני זהב המסמלים חירות
    accent: "#F59E0B",         // זהב - חירות, גאולה
    accentLight: "#FDE68A",    // זהב בהיר - חירות, אור
    accentDark: "#D97706",     // זהב כהה
    
    // צבעי רקע - משתמשים בגוני לבן-קרם המסמלים מצה
    background: "#FFFBEB",     // לבן-קרם - מצה, טוהר
    backgroundAlt: "#FEF3C7",  // קרם - קלף עתיק, מגילה
  },
  
  // גרדיאנטים מותאמים
  gradients: {
    ...baseTheme.gradients,
    primary: "linear-gradient(135deg, #4338CA 0%, #6366F1 100%)",
    accent: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
    background: "linear-gradient(to bottom, #FFFBEB 0%, #FEF3C7 100%)",
    seaWaves: "linear-gradient(to bottom, #0284C7 0%, #38BDF8 50%, #0284C7 100%)",
    desert: "linear-gradient(to bottom, #FEF3C7 0%, #FBBF24 100%)",
    night: "linear-gradient(to bottom, #1E3A8A 0%, #312E81 100%)",
  },
  
  // אפקטים מיוחדים לנושא פסח
  effects: {
    ...baseTheme.effects,
    seaParting: "clip-path: polygon(0 0, 100% 0, 100% 45%, 50% 45%, 50% 100%, 0 100%)",
    desertDust: "background-image: url('/assets/games/passover/effects/dust.png'); opacity: 0.05;",
    parchment: "background-image: url('/assets/games/passover/effects/parchment-texture.png'); background-blend-mode: multiply; opacity: 0.1;",
  },
  
  // אנימציות ספציפיות לפסח
  animations: {
    ...baseTheme.animations,
    seaParting: "sea-parting 2s forwards",
    sandStorm: "sand-storm 3s infinite",
    scrollUnfold: "scroll-unfold 1.2s forwards",
  },
  
  // CSS ספציפי לפסח
  globalCSS: `
    ${baseTheme.globalCSS}
    
    @keyframes sea-parting {
      0% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%); }
      100% { clip-path: polygon(0 0, 100% 0, 100% 45%, 50% 45%, 50% 100%, 0 100%); }
    }
    
    @keyframes sand-storm {
      0% { transform: translateX(0); opacity: 0.1; }
      50% { transform: translateX(10px); opacity: 0.2; }
      100% { transform: translateX(0); opacity: 0.1; }
    }
    
    @keyframes scroll-unfold {
      0% { 
        transform: scale(0.9, 0.1); 
        opacity: 0;
      }
      50% {
        transform: scale(0.9, 1.02);
        opacity: 0.8;
      }
      100% { 
        transform: scale(1, 1); 
        opacity: 1;
      }
    }
  `,
  
  // נכסים ייחודיים לפסח
  assets: {
    icons: {
      seaWaves: '/assets/games/passover/icons/sea-waves.svg',
      desert: '/assets/games/passover/icons/desert.svg',
      matzah: '/assets/games/passover/icons/matzah.svg',
      pharaoh: '/assets/games/passover/icons/pharaoh.svg',
      moses: '/assets/games/passover/icons/moses.svg',
      staff: '/assets/games/passover/icons/staff.svg',
      plagues: '/assets/games/passover/icons/plagues.svg',
    },
    decorations: {
      scrollEdges: '/assets/games/passover/decorations/scroll-edges.svg',
      parchmentTexture: '/assets/games/passover/decorations/parchment-texture.png',
      desertPattern: '/assets/games/passover/decorations/desert-pattern.svg',
    }
  }
};

export default passoverTheme;