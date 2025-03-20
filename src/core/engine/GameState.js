/**
 * מחלקה המנהלת את מצב המשחק
 */
export class GameState {
  constructor(gameConfig) {
    this.config = gameConfig;
    this.state = {
      currentStage: null,
      completedStages: [],
      score: 0,
      difficulty: 'medium',
      inventory: [],
      progress: 0,
      startTime: null,
      endTime: null,
      settings: {
        soundEnabled: true,
        hintsEnabled: true,
        timerEnabled: gameConfig?.settings?.timerEnabled || false
      }
    };
    this.listeners = [];
  }
  
  // אתחול מצב חדש
  initState() {
    this.state = {
      ...this.state,
      currentStage: this.config.stages?.[0]?.id || null,
      completedStages: [],
      score: 0,
      progress: 0,
      startTime: new Date(),
      endTime: null
    };
    this.notifyListeners();
  }
  
  // מעבר לשלב הבא
  moveToNextStage() {
    if (!this.config.stages || !this.state.currentStage) return false;
    
    const currentIndex = this.config.stages.findIndex(
      stage => stage.id === this.state.currentStage
    );
    
    if (currentIndex >= 0 && currentIndex < this.config.stages.length - 1) {
      const nextStage = this.config.stages[currentIndex + 1].id;
      this.state.completedStages.push(this.state.currentStage);
      this.state.currentStage = nextStage;
      this.state.progress = (this.state.completedStages.length / this.config.stages.length) * 100;
      this.notifyListeners();
      return true;
    }
    
    return false;
  }
  
  // הוספת ניקוד
  addScore(points) {
    this.state.score += points;
    this.notifyListeners();
  }
  
  // שינוי רמת קושי
  setDifficulty(difficulty) {
    this.state.difficulty = difficulty;
    this.notifyListeners();
  }
  
  // שמירת המצב הנוכחי
  saveState() {
    try {
      localStorage.setItem(
        `game_${this.config.id}_state`,
        JSON.stringify(this.state)
      );
    } catch (e) {
      console.error('Failed to save game state:', e);
    }
  }
  
  // טעינת מצב שמור
  loadState() {
    try {
      const savedState = localStorage.getItem(`game_${this.config.id}_state`);
      if (savedState) {
        this.state = JSON.parse(savedState);
        this.notifyListeners();
        return true;
      }
    } catch (e) {
      console.error('Failed to load game state:', e);
    }
    return false;
  }
  
  // הוספת מאזין לשינויים במצב
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  // עדכון כל המאזינים
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }
}