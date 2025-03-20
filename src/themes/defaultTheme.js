// ערכת עיצוב ברירת מחדל
export const defaultTheme = {
  name: "Default",
  colors: {
    primary: "#4F46E5",       // כחול-סגול
    primaryLight: "#C7D2FE",
    primaryDark: "#3730A3",
    secondary: "#10B981",     // ירוק
    secondaryLight: "#A7F3D0",
    secondaryDark: "#047857",
    accent: "#F59E0B",        // כתום
    background: "#F9FAFB",
    text: "#111827",
    textLight: "#6B7280",
    success: "#10B981",
    error: "#EF4444",
    warning: "#F59E0B",
    info: "#3B82F6"
  },
  fonts: {
    primary: "'Heebo', sans-serif",
    heading: "'Rubik', sans-serif"
  },
  gradients: {
    background: "linear-gradient(135deg, #F9FAFB 0%, #E5E7EB 100%)",
    card: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(243,244,246,0.9) 100%)"
  },
  sizes: {
    borderRadius: "0.5rem",
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