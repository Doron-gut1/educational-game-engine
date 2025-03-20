/**
 * מנהל סיפור המשחק
 * אחראי על ניהול דמויות, דיאלוגים וזרימת העלילה
 */
export class StoryManager {
  constructor(gameConfig, characters = {}) {
    this.gameConfig = gameConfig;
    this.characters = characters;
    this.dialogueHistory = [];
    this.currentDialogueIndex = 0;
    this.currentScene = null;
  }

  /**
   * הגדרת דמויות המשחק
   * @param {Object} characters - מידע על דמויות המשחק
   */
  setCharacters(characters) {
    this.characters = characters;
  }

  /**
   * קבלת מידע על דמות ספציפית
   * @param {string} characterId - מזהה הדמות
   * @returns {Object|null} - מידע על הדמות או null אם לא נמצאה
   */
  getCharacter(characterId) {
    return this.characters[characterId] || null;
  }

  /**
   * קבלת רשימת הדמויות
   * @returns {Array} - רשימת מזהי הדמויות
   */
  getCharacterIds() {
    return Object.keys(this.characters);
  }

  /**
   * הגדרת סצנה נוכחית
   * @param {string} sceneId - מזהה הסצנה
   * @param {Object} sceneData - נתוני הסצנה
   */
  setCurrentScene(sceneId, sceneData) {
    this.currentScene = {
      id: sceneId,
      ...sceneData
    };
    this.currentDialogueIndex = 0;
    
    if (sceneData.dialogue) {
      this.dialogueHistory = [];
    }
  }

  /**
   * קבלת הסצנה הנוכחית
   * @returns {Object|null} - הסצנה הנוכחית
   */
  getCurrentScene() {
    return this.currentScene;
  }

  /**
   * קבלת דיאלוג נוכחי מהסצנה
   * @returns {Object|null} - הדיאלוג הנוכחי או null אם אין
   */
  getCurrentDialogue() {
    if (!this.currentScene || !this.currentScene.dialogue) {
      return null;
    }

    if (this.currentDialogueIndex >= this.currentScene.dialogue.length) {
      return null;
    }

    return this.currentScene.dialogue[this.currentDialogueIndex];
  }

  /**
   * מעבר לדיאלוג הבא בסצנה
   * @returns {Object|null} - הדיאלוג הבא או null אם אין
   */
  nextDialogue() {
    const currentDialogue = this.getCurrentDialogue();
    
    if (currentDialogue) {
      this.dialogueHistory.push(currentDialogue);
      this.currentDialogueIndex++;
    }

    return this.getCurrentDialogue();
  }

  /**
   * בדיקה אם יש דיאלוג נוסף בסצנה
   * @returns {boolean} - האם יש עוד דיאלוג
   */
  hasMoreDialogue() {
    if (!this.currentScene || !this.currentScene.dialogue) {
      return false;
    }

    return this.currentDialogueIndex < this.currentScene.dialogue.length;
  }

  /**
   * קבלת היסטוריית הדיאלוגים בסצנה
   * @returns {Array} - היסטוריית דיאלוגים
   */
  getDialogueHistory() {
    return this.dialogueHistory;
  }

  /**
   * קבלת רקע הסצנה הנוכחית
   * @returns {string|null} - שם קובץ הרקע או null אם אין
   */
  getSceneBackground() {
    return this.currentScene?.background || null;
  }

  /**
   * קבלת פעולות אפשריות בסצנה הנוכחית
   * @returns {Array|null} - פעולות אפשריות או null אם אין
   */
  getSceneActions() {
    return this.currentScene?.actions || null;
  }
}