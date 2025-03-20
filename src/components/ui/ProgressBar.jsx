import React from 'react';

export function ProgressBar({
  value = 0,
  max = 100,
  height = 'normal',
  color = 'primary',
  showValue = false,
  label,
  className,
  ...props
}) {
  // חישוב אחוז השלמה
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  // מיפוי גבהים
  const heightClasses = {
    small: "h-1",
    normal: "h-2",
    large: "h-4"
  };
  
  // מיפוי צבעים
  const colorClasses = {
    primary: "bg-indigo-600",
    secondary: "bg-emerald-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500"
  };
  
  return (
    <div className={`w-full ${className || ''}`} {...props}>
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showValue && (
            <span className="text-sm font-medium text-gray-700">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div className={`w-full ${heightClasses[height]} bg-gray-200 rounded-full overflow-hidden`}>
        <div 
          className={`${colorClasses[color]} h-full rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && !label && (
        <div className="text-xs font-medium text-gray-500 text-center mt-1">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
}