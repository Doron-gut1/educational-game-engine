/**
 * קונפיגורציה למשחק בדיקת נכסים
 */
export default {
  id: "test-assets",
  name: "בדיקת ניהול נכסים",
  description: "משחק בדיקה לוידוא תקינות ניהול נכסים",
  theme: "base",
  mainCharacter: "test_character",
  settings: {
    timerEnabled: false,
    audioEnabled: true
  },
  difficultySettings: {
    easy: {
      options: 3,
      timeLimit: 60,
      hints: 3
    },
    medium: {
      options: 4,
      timeLimit: 45,
      hints: 2
    },
    hard: {
      options: 6,
      timeLimit: 30,
      hints: 1
    }
  },
  progression: {
    requireMinScore: true,
    minScoreToProgress: 70
  }
};