import { useState, useEffect, useRef } from 'react';

/**
 * הוק לניהול מדידת זמן לשלבים במשחק
 * מאפשר מדידת זמן קדימה (טיימר) או אחורה (countdown)
 */
export function useTimer({
  initialTime = 60,
  isCountdown = true,
  autoStart = false,
  onTimeUp = () => {},
  step = 1 // צעד בשניות
}) {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  
  // התחלת הטיימר
  const start = () => {
    if (isFinished) return;
    startTimeRef.current = Date.now() - (initialTime - time) * 1000;
    setIsRunning(true);
  };
  
  // עצירת הטיימר
  const stop = () => {
    setIsRunning(false);
  };
  
  // איפוס הטיימר
  const reset = () => {
    setTime(initialTime);
    setIsRunning(false);
    setIsFinished(false);
    startTimeRef.current = null;
  };
  
  // הקצבת זמן חדש
  const setNewTime = (newTime) => {
    setTime(newTime > 0 ? newTime : 0);
    if (newTime <= 0 && isCountdown) {
      setIsFinished(true);
      setIsRunning(false);
    }
  };
  
  // הפעלת הטיימר
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (isCountdown) {
          setTime(prevTime => {
            if (prevTime <= step) {
              clearInterval(intervalRef.current);
              setIsRunning(false);
              setIsFinished(true);
              onTimeUp();
              return 0;
            }
            return prevTime - step;
          });
        } else {
          setTime(prevTime => prevTime + step);
        }
      }, step * 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isCountdown, onTimeUp, step]);
  
  // המרת זמן בשניות לפורמט מתאים
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    time, // זמן בשניות
    formattedTime: formatTime(time), // זמן בפורמט MM:SS
    isRunning,
    isFinished,
    start,
    stop,
    reset,
    setTime: setNewTime
  };
}