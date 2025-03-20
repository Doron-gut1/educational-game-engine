import { questJourneyTemplate } from "../../templates/questJourney";
import { tuBishvatTheme } from "../../themes/tuBishvatTheme";

/**
 * קונפיגורציית משחק טו בשבט
 */
export const tuBishvatGameConfig = {
  id: "tu_bishvat_quest",
  name: "המסע הקסום בארץ שבעת המינים",
  template: questJourneyTemplate.id,
  theme: "tuBishvat",
  mainCharacter: "forest_keeper",
  supportingCharacters: ["wise_olive", "date_palm"],
  settings: {
    // התאמות לתבנית הבסיסית
    timerEnabled: false,  // שינוי מברירת המחדל
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
    // התאמות לזרימת המשחק
    requireMinScore: true,
    minScoreToProgress: 70
  },
  // הגדרת שלבי המשחק
  stages: [
    {
      id: "intro",
      type: "story_intro",
      title: "מבוא למשחק",
      description: "הכירו את הדמויות והמשימה"
    },
    {
      id: "stage1",
      type: "multi_choice",
      title: "נטיעות בארץ ישראל",
      description: "עזרו לעצים למצוא את המקום המתאים להם"
    },
    {
      id: "stage2",
      type: "drag_drop",
      title: "שמירה על הסביבה",
      description: "בואו נלמד איך לשמור על הטבע שלנו"
    },
    {
      id: "stage3",
      type: "matching",
      title: "ברכות ושבעת המינים",
      description: "הברכות ושבעת המינים"
    },
    {
      id: "stage4",
      type: "combined_challenge",
      title: "סיכום והתמחות",
      description: "עכשיו לאתגר המסכם"
    }
  ]
};

export default tuBishvatGameConfig;