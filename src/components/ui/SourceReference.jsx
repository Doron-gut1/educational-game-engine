// src/components/ui/SourceReference.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../design-system';
import { Button, ScrollCard } from '../../design-system/components';

/**
 * רכיב להצגת מקורות ומידע מורחב
 */
const SourceReference = ({ 
  title = "מקור",
  source = "",
  explanation = "",
  className = ""
}) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  
  // אם אין מקור, לא מציגים את הרכיב
  if (!source && !explanation) {
    return null;
  }
  
  return (
    <div className={`source-reference mt-4 ${className}`}>
      <div 
        className="bg-blue-50 border-r-4 border-blue-500 p-4 rounded-lg cursor-pointer transition-all hover:bg-blue-100"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-blue-800 font-bold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            {title}
          </h3>
          <Button 
            variant="text" 
            size="small"
            className="text-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? 'הסתר' : 'הרחב'}
          </Button>
        </div>
        
        {!expanded && (
          <p className="text-blue-900 text-sm mt-1 line-clamp-1">{source}</p>
        )}
      </div>
      
      {expanded && (
        <ScrollCard variant="transparent" className="mt-2 p-4 border border-blue-200">
          {source && (
            <div className="mb-4">
              <h4 className="font-bold text-blue-700 mb-2">המקור:</h4>
              <p className="text-blue-900 text-lg font-alef leading-relaxed">{source}</p>
            </div>
          )}
          
          {explanation && (
            <div>
              <h4 className="font-bold text-blue-700 mb-2">הסבר:</h4>
              <p className="text-blue-800">{explanation}</p>
            </div>
          )}
        </ScrollCard>
      )}
    </div>
  );
};

SourceReference.propTypes = {
  title: PropTypes.string,
  source: PropTypes.string,
  explanation: PropTypes.string,
  className: PropTypes.string
};

export default SourceReference;