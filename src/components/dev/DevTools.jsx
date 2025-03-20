/**
 * כלי פיתוח למפתחים 
 * רכיב המאפשר שליטה ומעקב אחרי מצב המשחק בזמן פיתוח
 * מוצג רק בסביבת פיתוח
 */
import React, { useState, useEffect } from 'react';
import { useGameContext } from '../../contexts/GameContext';
import { LoggerService } from '../../services/loggerService';

export function DevTools() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('state');
  const { state, gameState, gameConfig } = useGameContext();
  const [stageList, setStageList] = useState([]);
  
  // הצגה רק בסביבת פיתוח
  const isDev = import.meta.env.MODE === 'development';
  if (!isDev) return null;
  
  // בניית רשימת השלבים בטעינה
  useEffect(() => {
    if (gameConfig?.stages) {
      const stages = gameConfig.stages.map(stage => ({
        id: stage.id,
        title: stage.title || stage.id
      }));
      setStageList(stages);
    }
  }, [gameConfig]);
  
  // טיפול במעבר לשלב
  const handleStageChange = (stageId) => {
    if (!stageId) return;
    if (gameState && typeof gameState.moveToStage === 'function') {
      gameState.moveToStage(stageId);
      LoggerService.info(`[DevTools] Manually moved to stage: ${stageId}`);
    } else if (gameState) {
      // אם אין פונקציה מובנית, ננסה לעדכן ישירות
      gameState.state.currentStage = stageId;
      gameState.notifyListeners();
      LoggerService.info(`[DevTools] Directly updated stage to: ${stageId}`);
    }
  };
  
  // איפוס המשחק
  const handleResetGame = () => {
    if (gameState && typeof gameState.initState === 'function') {
      gameState.initState();
      LoggerService.info('[DevTools] Game reset');
    }
  };
  
  // שינוי רמת קושי
  const handleDifficultyChange = (difficulty) => {
    if (gameState && typeof gameState.setDifficulty === 'function') {
      gameState.setDifficulty(difficulty);
      LoggerService.info(`[DevTools] Difficulty changed to: ${difficulty}`);
    }
  };
  
  // הוספת ניקוד
  const handleAddScore = (amount) => {
    if (gameState && typeof gameState.addScore === 'function') {
      gameState.addScore(parseInt(amount));
      LoggerService.info(`[DevTools] Added ${amount} points`);
    }
  };
  
  // איפוס מסתירים
  const resetDevLogs = () => {
    // ניקוי הקונסול
    console.clear();
    LoggerService.info('[DevTools] Console cleared');
  };
  
  return (
    <div className="fixed bottom-4 left-4 z-50 text-right dir-rtl font-mono">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 text-white px-3 py-2 rounded-md shadow-lg hover:bg-gray-700"
      >
        {isOpen ? 'X סגור כלים' : '🛠️ כלי פיתוח'}
      </button>
      
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl mt-2 p-4 text-sm w-80 max-h-[80vh] overflow-y-auto border-2 border-gray-300">
          <h2 className="text-lg font-bold mb-3 text-blue-800 border-b pb-2">כלי פיתוח למשחק</h2>
          
          {/* טאבים */}
          <div className="flex mb-3 gap-1">
            <button 
              onClick={() => setActiveTab('state')}
              className={`px-2 py-1 rounded ${activeTab === 'state' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              מצב
            </button>
            <button 
              onClick={() => setActiveTab('controls')}
              className={`px-2 py-1 rounded ${activeTab === 'controls' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              שליטה
            </button>
            <button 
              onClick={() => setActiveTab('tools')}
              className={`px-2 py-1 rounded ${activeTab === 'tools' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              כלים
            </button>
          </div>
          
          {/* חלק המצב */}
          {activeTab === 'state' && (
            <div>
              <div className="mb-3">
                <div className="font-bold text-gray-700">שלב נוכחי:</div>
                <div className="bg-gray-100 p-2 rounded">{state?.currentStage || 'לא מוגדר'}</div>
              </div>
              
              <div className="mb-3">
                <div className="font-bold text-gray-700">ניקוד:</div>
                <div className="bg-gray-100 p-2 rounded">{state?.score || 0}</div>
              </div>
              
              <div className="mb-3">
                <div className="font-bold text-gray-700">רמת קושי:</div>
                <div className="bg-gray-100 p-2 rounded">{state?.difficulty || 'בינוני'}</div>
              </div>
              
              <div className="mb-3">
                <div className="font-bold text-gray-700">התקדמות:</div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500" 
                    style={{ width: `${state?.progress || 0}%` }}
                  ></div>
                </div>
                <div className="text-center mt-1">{state?.progress || 0}%</div>
              </div>
              
              <div className="mb-3">
                <div className="font-bold text-gray-700">שלבים שהושלמו:</div>
                <div className="bg-gray-100 p-2 rounded max-h-20 overflow-y-auto">
                  {state?.completedStages?.length ? (
                    state.completedStages.map(stage => (
                      <div key={stage} className="mb-1 text-xs bg-green-100 px-1 py-0.5 rounded">
                        {stage}
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-500">אין עדיין</span>
                  )}
                </div>
              </div>
              
              <div className="mb-3">
                <details>
                  <summary className="font-bold text-gray-700 cursor-pointer">מצב מלא (JSON)</summary>
                  <pre className="bg-gray-900 text-green-400 p-2 text-xs rounded mt-1 overflow-x-auto max-h-40">
                    {JSON.stringify(state, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          )}
          
          {/* חלק השליטה */}
          {activeTab === 'controls' && (
            <div>
              <div className="mb-3">
                <label className="font-bold text-gray-700 block mb-1">מעבר לשלב:</label>
                <select 
                  onChange={(e) => handleStageChange(e.target.value)}
                  value={state?.currentStage || ''}
                  className="w-full p-2 border rounded"
                >
                  <option value="">בחר שלב...</option>
                  {stageList.map(stage => (
                    <option key={stage.id} value={stage.id}>
                      {stage.title} ({stage.id})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-3">
                <label className="font-bold text-gray-700 block mb-1">שינוי רמת קושי:</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleDifficultyChange('easy')}
                    className={`flex-1 py-1 rounded ${state?.difficulty === 'easy' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    קל
                  </button>
                  <button 
                    onClick={() => handleDifficultyChange('medium')}
                    className={`flex-1 py-1 rounded ${state?.difficulty === 'medium' 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    בינוני
                  </button>
                  <button 
                    onClick={() => handleDifficultyChange('hard')}
                    className={`flex-1 py-1 rounded ${state?.difficulty === 'hard' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    קשה
                  </button>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="font-bold text-gray-700 block mb-1">הוספת ניקוד:</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleAddScore(10)}
                    className="flex-1 py-1 rounded bg-blue-200 hover:bg-blue-300"
                  >
                    +10
                  </button>
                  <button 
                    onClick={() => handleAddScore(50)}
                    className="flex-1 py-1 rounded bg-blue-200 hover:bg-blue-300"
                  >
                    +50
                  </button>
                  <button 
                    onClick={() => handleAddScore(100)}
                    className="flex-1 py-1 rounded bg-blue-200 hover:bg-blue-300"
                  >
                    +100
                  </button>
                </div>
              </div>
              
              <button 
                onClick={handleResetGame}
                className="w-full p-2 bg-red-600 text-white rounded hover:bg-red-700 mt-3"
              >
                איפוס המשחק
              </button>
            </div>
          )}
          
          {/* כלים נוספים */}
          {activeTab === 'tools' && (
            <div>
              <div className="mb-3">
                <label className="font-bold text-gray-700 block mb-1">כלי פיתוח:</label>
                <button 
                  onClick={resetDevLogs}
                  className="w-full p-2 bg-gray-200 hover:bg-gray-300 rounded mb-2"
                >
                  ניקוי קונסול
                </button>
                
                <details className="mb-3">
                  <summary className="font-bold text-gray-700 cursor-pointer">רמות לוג</summary>
                  <div className="mt-2 flex flex-col gap-1">
                    <button 
                      onClick={() => LoggerService.setLogLevel(LoggerService.LOG_LEVELS.DEBUG)}
                      className="py-1 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      הכל (DEBUG)
                    </button>
                    <button 
                      onClick={() => LoggerService.setLogLevel(LoggerService.LOG_LEVELS.INFO)}
                      className="py-1 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      INFO ומעלה
                    </button>
                    <button 
                      onClick={() => LoggerService.setLogLevel(LoggerService.LOG_LEVELS.WARN)}
                      className="py-1 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      אזהרות ושגיאות בלבד
                    </button>
                    <button 
                      onClick={() => LoggerService.setLogLevel(LoggerService.LOG_LEVELS.ERROR)}
                      className="py-1 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      שגיאות בלבד
                    </button>
                  </div>
                </details>
                
                <div className="border-t pt-2 mt-2">
                  <div className="font-bold text-gray-700 mb-1">גרסה:</div>
                  <div className="bg-gray-100 p-1 rounded text-xs">{import.meta.env.VITE_APP_VERSION || 'לא מוגדר'}</div>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-4 text-xs text-gray-500 text-center border-t pt-2">
            כלי פיתוח מוצגים רק בסביבת פיתוח
          </div>
        </div>
      )}
    </div>
  );
}
