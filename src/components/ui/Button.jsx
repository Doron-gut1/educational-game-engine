import React from 'react';
import { useTheme } from '../../hooks/useTheme';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false,
  onClick,
  className,
  ...props 
}) {
  const theme = useTheme();
  
  const baseClasses = "rounded-lg font-bold transition-colors";
  
  const variantClasses = {
    primary: `bg-${theme.colors.primary} text-white hover:bg-${theme.colors.primaryDark}`,
    secondary: `bg-${theme.colors.secondary} text-white hover:bg-${theme.colors.secondaryDark}`,
    outline: `border-2 border-${theme.colors.primary} text-${theme.colors.primary} hover:bg-${theme.colors.primaryLight}`,
    text: `text-${theme.colors.primary} hover:bg-${theme.colors.primaryLight} hover:bg-opacity-20`
  };
  
  const sizeClasses = {
    small: "px-3 py-1 text-sm",
    medium: "px-4 py-2",
    large: "px-6 py-3 text-lg"
  };
  
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  
  // למכיוון שבTailwindCSS לא ניתן להשתמש במשתנים דינמיים בכיתות, נשתמש במיפוי מודרך
  const getActualClasses = () => {
    let variantClass = '';
    
    switch(variant) {
      case 'primary':
        variantClass = `bg-indigo-600 text-white hover:bg-indigo-700`;
        break;
      case 'secondary':
        variantClass = `bg-emerald-600 text-white hover:bg-emerald-700`;
        break;
      case 'outline':
        variantClass = `border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50`;
        break;
      case 'text':
        variantClass = `text-indigo-600 hover:bg-indigo-50 hover:bg-opacity-20`;
        break;
      default:
        variantClass = `bg-indigo-600 text-white hover:bg-indigo-700`;
    }
    
    return `${baseClasses} ${variantClass} ${sizeClasses[size]} ${disabledClasses} ${className || ''}`;
  };
  
  return (
    <button 
      className={getActualClasses()}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}