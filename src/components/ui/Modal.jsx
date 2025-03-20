import React, { useEffect } from 'react';

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'md',
  closeOnOverlayClick = true,
  className,
  ...props
}) {
  // הפעלת key escape לסגירת המודאל
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // ניטרול הגלילה ברקע
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      // החזרת הגלילה
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // מיפוי רוחבים
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* שכבת הרקע */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      
      {/* תיבת המודאל */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div 
          className={`
            relative transform overflow-hidden rounded-lg bg-white text-right shadow-xl 
            transition-all sm:my-8 ${maxWidthClasses[maxWidth]} w-full
            ${className || ''}
          `}
          onClick={(e) => e.stopPropagation()} 
          {...props}
        >
          {/* כפתור סגירה */}
          <button
            type="button"
            className="absolute top-2 left-2 text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={onClose}
          >
            <span className="sr-only">סגור</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* כותרת */}
          {title && (
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-xl font-medium text-gray-900">{title}</h3>
            </div>
          )}
          
          {/* תוכן */}
          <div className="p-4">
            {children}
          </div>
          
          {/* כפתורים */}
          {footer && (
            <div className="bg-gray-50 p-4 border-t border-gray-200">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}