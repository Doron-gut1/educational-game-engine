import React from 'react';
import PropTypes from 'prop-types';

/**
 * רכיב כרטיס בסגנון זכוכית (Glassmorphism)
 * 
 * @param {Object} props - Props הרכיב
 * @param {ReactNode} props.children - תוכן הכרטיס
 * @param {string} props.variant - וריאנט צבע (default, primary, secondary, accent)
 * @param {string} props.blur - רמת טשטוש (none, light, medium, heavy)
 * @param {string} props.opacity - רמת אטימות (low, medium, high)
 * @param {string} props.border - סגנון מסגרת (none, thin, medium, glow)
 * @param {string} props.className - מחלקות CSS נוספות
 */
const GlassCard = ({ 
  children, 
  variant = 'default',
  blur = 'medium',
  opacity = 'medium',
  border = 'thin',
  className = '',
  ...rest 
}) => {
  // וריאנטים צבעוניים
  const variantClasses = {
    default: "from-white/60 to-white/30 border-white/50",
    primary: "from-blue-50/60 to-blue-50/30 border-blue-200/50",
    secondary: "from-green-50/60 to-green-50/30 border-green-200/50",
    accent: "from-amber-50/60 to-amber-50/30 border-amber-200/50",
    dark: "from-gray-700/70 to-gray-900/50 border-gray-600/50 text-white"
  };
  
  // רמות טשטוש
  const blurClasses = {
    none: "",
    light: "backdrop-blur-sm",
    medium: "backdrop-blur-md",
    heavy: "backdrop-blur-lg"
  };
  
  // רמות אטימות
  const opacityValues = {
    low: {
      from: "30",
      to: "10"
    },
    medium: {
      from: "60",
      to: "30"
    },
    high: {
      from: "80",
      to: "60"
    }
  };
  
  // סגנונות מסגרת
  const borderClasses = {
    none: "border-0",
    thin: "border",
    medium: "border-2",
    glow: "border shadow-[0_0_15px_rgba(255,255,255,0.3)]"
  };
  
  // קביעת מחלקות צבע על פי וריאנט ואטימות
  const getColorClasses = () => {
    const [baseClass] = variantClasses[variant].split(' ');
    const [baseColor] = baseClass.split('-');
    const [_, colorIntensity] = baseClass.split('/');
    
    // רק אם הוריאנט הוא בפורמט סטנדרטי, נחליף את האטימות
    if (opacityValues[opacity] && baseColor && colorIntensity) {
      return `from-${baseColor}/${opacityValues[opacity].from} to-${baseColor}/${opacityValues[opacity].to}`;
    }
    
    // אחרת, נחזיר את המחלקות המקוריות
    return variantClasses[variant];
  };
  
  // בסיס מחלקות עיצוב הכרטיס
  const glassClasses = `
    bg-gradient-to-br
    ${getColorClasses()}
    ${blurClasses[blur]}
    ${borderClasses[border]}
    rounded-xl
    shadow-lg
    p-6
    transition-all
    duration-300
    ${className}
  `;
  
  return (
    <div 
      className={glassClasses}
      {...rest}
    >
      {children}
    </div>
  );
};

GlassCard.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'accent', 'dark']),
  blur: PropTypes.oneOf(['none', 'light', 'medium', 'heavy']),
  opacity: PropTypes.oneOf(['low', 'medium', 'high']),
  border: PropTypes.oneOf(['none', 'thin', 'medium', 'glow']),
  className: PropTypes.string,
};

export default GlassCard;