import React from 'react';

export function Card({
  children,
  variant = 'default',
  shadow = 'medium',
  hoverable = false,
  className,
  ...props
}) {
  const baseClasses = "rounded-lg overflow-hidden";
  
  const variantClasses = {
    default: "bg-white",
    primary: "bg-indigo-50",
    secondary: "bg-emerald-50",
    translucent: "bg-white bg-opacity-80 backdrop-filter backdrop-blur-md"
  };
  
  const shadowClasses = {
    none: "",
    small: "shadow",
    medium: "shadow-md",
    large: "shadow-lg"
  };
  
  const hoverClasses = hoverable 
    ? `transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer` 
    : '';
  
  const combinedClasses = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${shadowClasses[shadow]}
    ${hoverClasses}
    ${className || ''}
  `;
  
  return (
    <div 
      className={combinedClasses}
      {...props}
    >
      {children}
    </div>
  );
}