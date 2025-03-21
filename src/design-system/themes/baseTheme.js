/**
 * תמה בסיסית למערכת העיצוב "מסע הדעת"
 * הפלטה הבסיסית משלבת גוונים המסמלים מסורת יהודית (זהב, כחול עמוק) עם רעננות וחיוניות
 */
export const baseTheme = {
  name: "מסע הדעת - בסיסי",
  colors: {
    // צבעים ראשיים
    primary: "#1E3A8A",        // כחול עמוק - שמיים, תורה, חכמה
    primaryLight: "#DBEAFE",   // כחול בהיר
    primaryDark: "#1E40AF",    // כחול כהה
    
    // צבעי הדגשה
    secondary: "#2563EB",      // כחול בינוני - מים, טהרה
    secondaryLight: "#93C5FD", // כחול בהיר
    secondaryDark: "#1D4ED8",  // כחול כהה
    
    // צבעי אקצנט
    accent: "#F59E0B",         // זהב - קדושה, אור, הארה
    accentLight: "#FCD34D",    // זהב בהיר - זריחה, התחדשות
    accentDark: "#D97706",     // זהב כהה
    
    // צבעי רקע
    background: "#FFFBEB",     // לבן-קרם - טוהר, קלף, מגילה
    backgroundAlt: "#F3F4F6",  // אפור בהיר
    
    // צבעי טקסט
    text: "#0F172A",           // שחור-כחול - דיו, כתיבה עתיקה
    textLight: "#475569",      // אפור כהה
    textInverted: "#F8FAFC",   // לבן
    
    // צבעי משוב
    success: "#10B981",        // ירוק
    error: "#EF4444",          // אדום
    warning: "#F59E0B",        // כתום
    info: "#3B82F6",           // כחול
  },
  
  // טיפוגרפיה
  fonts: {
    primary: "'Heebo', sans-serif",
    heading: "'Rubik', sans-serif",
    special: "'Alef', sans-serif",
  },
  
  // מידות
  sizes: {
    borderRadius: {
      sm: "0.25rem",
      md: "0.5rem",
      lg: "0.75rem",
      xl: "1rem",
      full: "9999px",
    },
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      xxl: "3rem",
    },
  },
  
  // מעברים ואנימציות
  transitions: {
    fast: "150ms",
    medium: "300ms",
    slow: "500ms",
    timing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  
  // אפקטים
  effects: {
    shadows: {
      sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    },
    glassmorphism: "backdrop-filter: blur(8px); background-color: rgba(255, 255, 255, 0.25);",
    scrollGradient: {
      top: "linear-gradient(to bottom, rgba(247, 212, 138, 0.75), transparent)",
      bottom: "linear-gradient(to top, rgba(247, 212, 138, 0.75), transparent)",
    },
  },
  
  // גרדיאנטים
  gradients: {
    primary: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)",
    accent: "linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%)",
    background: "linear-gradient(to bottom, #FFFBEB 0%, #F3F4F6 100%)",
    scrollPaper: "linear-gradient(to bottom, #FEF3C7 0%, #FFFBEB 100%)",
  },
  
  // אנימציות
  animations: {
    entrances: {
      fadeIn: "fade-in 0.5s forwards",
      riseIn: "rise-in 0.5s forwards",
      unfold: "unfold 0.8s forwards",
    },
    exits: {
      fadeOut: "fade-out 0.5s forwards",
      sinkOut: "sink-out 0.5s forwards",
      fold: "fold 0.8s forwards",
    },
    attention: {
      pulse: "pulse 1.5s infinite",
      glow: "glow 2s infinite",
      pulseBorder: "pulse-border 1.5s infinite",
    },
    feedback: {
      success: "success-feedback 0.5s forwards",
      error: "error-feedback 0.5s forwards",
      shake: "shake 0.5s forwards",
    },
  },
  
  // CSS גלובלי
  globalCSS: `
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes rise-in {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes unfold {
      from { max-height: 0; opacity: 0; }
      to { max-height: var(--content-height, 1000px); opacity: 1; }
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    @keyframes glow {
      0% { box-shadow: 0 0 0px 0px rgba(246, 224, 94, 0); }
      50% { box-shadow: 0 0 15px 7px rgba(246, 224, 94, 0.3); }
      100% { box-shadow: 0 0 0px 0px rgba(246, 224, 94, 0); }
    }
    
    @keyframes shake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
      40%, 60% { transform: translate3d(3px, 0, 0); }
    }
    
    @keyframes pulse-border {
      0% { border-color: rgba(245, 158, 11, 0.5); }
      50% { border-color: rgba(245, 158, 11, 1); }
      100% { border-color: rgba(245, 158, 11, 0.5); }
    }
  `,
};

export default baseTheme;
