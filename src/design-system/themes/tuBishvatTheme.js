/**
 * תמת ט"ו בשבט - "חידוש הטבע"
 * תמה מותאמת לט"ו בשבט המבוססת על התמה הבסיסית עם שינויים ספציפיים לחג.
 */
import { baseTheme } from './baseTheme';

export const tuBishvatTheme = {
  ...baseTheme,
  
  name: "מסע הדעת - ט\"ו בשבט: חידוש הטבע",
  
  colors: {
    ...baseTheme.colors,
    
    // צבעים ראשיים - משתמשים בגוני ירוק עשיר המסמלים עצים וטבע
    primary: "#16A34A",        // ירוק עשיר - עצים, טבע
    primaryLight: "#DCFCE7",   // ירוק בהיר
    primaryDark: "#15803D",    // ירוק כהה
    
    // צבעי משניים - משתמשים בגוני חום-אדמה
    secondary: "#92400E",      // חום-אדמה - קרקע, שורשים
    secondaryLight: "#FEEBC8", // חום בהיר
    secondaryDark: "#78350F",  // חום כהה
    
    // צבעי אקצנט - משתמשים בגוני ורוד-פריחה
    accent: "#EC4899",         // ורוד-פריחה - פריחת עצים
    accentLight: "#FBCFE8",    // ורוד בהיר
    accentDark: "#BE185D",     // ורוד כהה
    
    // צבעי רקע - משתמשים בגוני ירוק בהיר וטבעי
    background: "#F0FDF4",     // ירוק בהיר מאוד - התחדשות
    backgroundAlt: "#ECFDF5",  // ירוק-תכלת בהיר - שמיים ועלים
  },
  
  // גרדיאנטים מותאמים לט"ו בשבט
  gradients: {
    ...baseTheme.gradients,
    primary: "linear-gradient(135deg, #16A34A 0%, #22C55E 100%)",
    accent: "linear-gradient(135deg, #EC4899 0%, #F472B6 100%)",
    background: "linear-gradient(to bottom, #ECFDF5 0%, #F0FDF4 100%)",
    forest: "linear-gradient(to bottom, #15803D 0%, #16A34A 100%)",
    soil: "linear-gradient(to bottom, #92400E 0%, #B45309 100%)",
    blossom: "linear-gradient(to right, #EC4899 0%, #F472B6 50%, #FBCFE8 100%)",
  },
  
  // אפקטים מיוחדים לנושא ט"ו בשבט
  effects: {
    ...baseTheme.effects,
    treeShadow: "drop-shadow(0 0 8px rgba(22, 163, 74, 0.2))",
    leafPattern: "background-image: url('/assets/games/tuBishvat/effects/leaf-pattern.png'); opacity: 0.05;",
    soilTexture: "background-image: url('/assets/games/tuBishvat/effects/soil-texture.png'); background-blend-mode: multiply; opacity: 0.1;",
  },
  
  // אנימציות ספציפיות לט"ו בשבט
  animations: {
    ...baseTheme.animations,
    treeGrowing: "tree-growing 3s forwards",
    leafFalling: "leaf-falling 4s infinite",
    blossomAppear: "blossom-appear 1.5s forwards",
  },
  
  // CSS ספציפי לט"ו בשבט
  globalCSS: `
    ${baseTheme.globalCSS}
    
    @keyframes tree-growing {
      0% { transform: scaleY(0.3); opacity: 0.7; }
      70% { transform: scaleY(1.05); }
      100% { transform: scaleY(1); opacity: 1; }
    }
    
    @keyframes leaf-falling {
      0% { 
        transform: translate(0, 0) rotate(0deg); 
        opacity: 1;
      }
      100% { 
        transform: translate(20px, 100px) rotate(180deg); 
        opacity: 0;
      }
    }
    
    @keyframes blossom-appear {
      0% { transform: scale(0); opacity: 0; }
      70% { transform: scale(1.1); }
      100% { transform: scale(1); opacity: 1; }
    }
  `,
  
  // נכסים ייחודיים לט"ו בשבט
  assets: {
    icons: {
      tree: '/assets/games/tuBishvat/icons/tree.svg',
      leaf: '/assets/games/tuBishvat/icons/leaf.svg',
      fruit: '/assets/games/tuBishvat/icons/fruit.svg',
      seeds: '/assets/games/tuBishvat/icons/seeds.svg',
      watering: '/assets/games/tuBishvat/icons/watering.svg',
      flower: '/assets/games/tuBishvat/icons/flower.svg',
      sevenSpecies: '/assets/games/tuBishvat/icons/seven-species.svg',
    },
    decorations: {
      leafBorder: '/assets/games/tuBishvat/decorations/leaf-border.svg',
      flowerCorner: '/assets/games/tuBishvat/decorations/flower-corner.svg',
      treePattern: '/assets/games/tuBishvat/decorations/tree-pattern.svg',
    }
  }
};

export default tuBishvatTheme;