import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * רכיב להצגת מקור מידע, פסוק או הפניה
 */
export const SourceReference = ({
  source,
  reference,
  expanded = false,
  className = '',
  variant = 'default',
  ...props
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  
  // וריאנטים שונים לעיצוב
  const variantStyles = {
    default: {
      container: 'bg-gray-100 text-gray-700 border border-gray-300',
      header: 'text-gray-800 font-medium',
      content: 'text-gray-600'
    },
    scroll: {
      container: 'bg-amber-50 text-amber-800 border border-amber-200',
      header: 'text-amber-800 font-medium',
      content: 'text-amber-700'
    },
    passover: {
      container: 'bg-indigo-50 text-indigo-800 border border-indigo-200',
      header: 'text-indigo-800 font-medium',
      content: 'text-indigo-700'
    },
    tubishvat: {
      container: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
      header: 'text-emerald-800 font-medium',
      content: 'text-emerald-700'
    }
  };
  
  // בחירת סגנון
  const styles = variantStyles[variant] || variantStyles.default;
  
  // במידה ואין מקור או הפניה אין טעם להציג את הרכיב
  if (!source && !reference) {
    return null;
  }
  
  return (
    <div 
      className={`rounded-md p-3 mb-4 ${styles.container} text-right ${className}`}
      dir="rtl"
      {...props}
    >
      {/* כותרת המקור */}
      {source && (
        <div className={`flex items-center justify-between ${styles.header}`}>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
            <span>{source}</span>
          </div>
          {reference && (
            <button 
              type="button"
              className="text-sm opacity-70 hover:opacity-100"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
            >
              {isExpanded ? 'הסתר' : 'הצג'}
            </button>
          )}
        </div>
      )}
      
      {/* תוכן ההפניה/מקור */}
      {reference && isExpanded && (
        <div className={`mt-2 text-sm ${styles.content} border-r-2 pr-2 mr-1 border-opacity-30 border-current`}>
          {reference}
        </div>
      )}
    </div>
  );
};

SourceReference.propTypes = {
  /**
   * מקור הציטוט או ההפניה (כגון שמות פרק א')
   */
  source: PropTypes.string,
  /**
   * הציטוט או ההפניה המלאה
   */
  reference: PropTypes.string,
  /**
   * האם להציג את הציטוט המלא מלכתחילה
   */
  expanded: PropTypes.bool,
  /**
   * מחלקת CSS נוספת
   */
  className: PropTypes.string,
  /**
   * וריאנט עיצובי
   */
  variant: PropTypes.oneOf(['default', 'scroll', 'passover', 'tubishvat'])
};

export default SourceReference;