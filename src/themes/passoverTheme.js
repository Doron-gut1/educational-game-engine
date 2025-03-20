/**
 * ערכת עיצוב לחג הפסח - המסע לחירות
 */
export const passoverTheme = {
  name: "Passover",
  colors: {
    primary: "#B83280",       // ורוד כהה / סגול - צבע היין
    primaryLight: "#FED7E2",
    primaryDark: "#702459",
    secondary: "#4299E1",     // כחול - מים וחירות
    secondaryLight: "#BEE3F8",
    secondaryDark: "#2C5282",
    accent: "#F6E05E",        // צהוב - המצה
    background: "#FFF5F7",
    text: "#2D3748",
    textLight: "#4A5568",
    success: "#48BB78",
    error: "#F56565",
    warning: "#ED8936",
    info: "#4299E1"
  },
  fonts: {
    primary: "'Heebo', sans-serif",
    heading: "'Rubik', sans-serif"
  },
  gradients: {
    background: "linear-gradient(135deg, #FFF5F7 0%, #FEFCBF 100%)",
    card: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(254,243,242,0.9) 100%)"
  },
  sizes: {
    borderRadius: "0.75rem",
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem"
    }
  },
  animations: {
    fast: "0.2s",
    medium: "0.3s",
    slow: "0.5s"
  }
};

export default passoverTheme;