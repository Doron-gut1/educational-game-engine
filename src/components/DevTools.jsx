import React, { useState } from 'react';
import { useGameContext } from '../contexts/GameContext';
import { LoggerService } from '../services/loggerService';

/**
 * כלי פיתוח למשחק - גלוי רק בסביבת פיתוח
 * מאפשר גישה מהירה לפעולות דיבאג ובדיקה
 */
export function DevTools() {
  const [isOpen, setIsOpen] = useState(false);
  const { state, gameConfig, resetGame, stateManager, stageController } = useGameContext();
  
  // רק בסביבת פיתוח
  if (import.meta.env.MODE !== 'development') return null;
  
  // רשימת שלבים לבחירה מהירה
  const stagesList = [
    { id: 'intro', title: 'מבוא' },
    ...(gameConfig?.content?.stages || []),
    { id: 'outro', title: 'סיום' }
  ];
  
  // מעבר לשלב נבחר
  const handleStageChange = (stageId) => {
    LoggerService.info(`מעבר יזום לשלב: ${stageId}`);
    if (stageController) {
      stageController.transitionToStage(stageId);
    } else if (stateManager) {
      stateManager.setState({ currentStage: stageId });
    }
  };
  
  // איפוס המשחק
  const handleReset = () => {
    LoggerService.info("איפוס משחק");
    resetGame();
  };
  
  // שינוי רמת לוג
  const handleLogLevelChange = (level) => {
    LoggerService.setLogLevel(Number(level));
    LoggerService.info(`רמת לוג שונתה ל: ${level}`);
  };
  
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 text-white p-2 rounded-full shadow-lg"
      >
        {isOpen ? 'X' : 'DEV'}
      </button>
      
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl p-4 mt-2 w-80 text-right">
          <h2 className="text-lg font-bold mb-2 border-b pb-2">כלי פיתוח</h2>
          
          <div className="space-y-2">
            <button 
              onClick={handleReset}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm"
            >
              איפוס משחק
            </button>
            
            <div className="mt-3">
              <h3 className="font-bold">דילוג לשלב:</h3>
              <select 
                className="w-full p-1 border rounded mt-1 text-right"
                onChange={(e) => handleStageChange(e.target.value)}
                value={state.currentStage || ''}
              >
                {stagesList.map(stage => (
                  <option key={stage.id} value={stage.id}>
                    {stage.title || stage.id}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mt-2">
              <h3 className="font-bold">רמת לוג:</h3>
              <select 
                className="w-full p-1 border rounded mt-1 text-right"
                onChange={(e) => handleLogLevelChange(e.target.value)}
                value={LoggerService.currentLevel}
              >
                <option value={0}>DEBUG (הכל)</option>
                <option value={1}>INFO</option>
                <option value={2}>WARN</option>
                <option value={3}>ERROR</option>
              </select>
            </div>
            
            <div className="mt-3">
              <h3 className="font-bold">מצב נוכחי:</h3>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40 ltr">
                {JSON.stringify(state, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}