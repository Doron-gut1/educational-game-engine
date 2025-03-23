import React from 'react';

/**
 * רכיב מיכל דף ראשי
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - תוכן המיכל
 * @param {string} props.className - מחלקות CSS נוספות
 * @param {string} props.backgroundImage - נתיב לתמונת רקע (אופציונלי)
 */
export default function PageContainer({ 
  children, 
  className = '', 
  backgroundImage = '',
  style = {},
  ...props 
}) {
  // הוספת תמונת רקע אם סופקה
  const containerStyle = {
    ...(backgroundImage ? { 
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    } : {}),
    ...style
  };
  
  return (
    <div 
      className={`min-h-screen w-full ${className}`}
      style={containerStyle}
      {...props}
    >
      <div className="container mx-auto px-4">
        {children}
      </div>
    </div>
  );
}
