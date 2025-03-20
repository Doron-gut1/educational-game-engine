import React from 'react';
import { Card } from '../ui/Card';

/**
 * עטיפה לשלבי משחק שמספקת עיצוב ומבנה אחידים
 * כולל שתי שכבות - כותרת/תיאור ותוכן השלב
 */
export function StageWrapper({
  title,
  description,
  children,
  background,
  className,
  ...props
}) {
  return (
    <Card
      className={`w-full max-w-4xl mx-auto animate-fade-in ${className || ''}`}
      shadow="large"
      {...props}
    >
      {/* כותרת ותיאור */}
      {(title || description) && (
        <div className="p-6 border-b border-gray-200 text-center">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          )}
          {description && (
            <p className="text-gray-600">{description}</p>
          )}
        </div>
      )}

      {/* אזור תוכן עם רקע אופציונלי */}
      <div 
        className="p-6"
        style={background ? { 
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        {children}
      </div>
    </Card>
  );
}