import { questJourneyTemplate } from "../../templates/questJourney";

/**
 * קונפיגורציית משחק פסח - "המסע לחירות"
 */
export const passoverQuestConfig = {
  id: "passover_quest",
  name: "המסע לחירות",
  template: questJourneyTemplate.id,
  theme: "passover",
  mainCharacter: "rabbi_elazar",
  supportingCharacters: ["miriam"],
  settings: {
    timerEnabled: false,
    audioEnabled: true,
    showSourceReferences: true,
    showLearningPopups: true
  },
  // הגדרות רמות קושי
  difficultySettings: {
    easy: {
      options: 3,
      timeLimit: 120,
      hints: 3,
      targetAudience: "כיתות א-ב"
    },
    medium: {
      options: 4,
      timeLimit: 90,
      hints: 2,
      targetAudience: "כיתות ג-ו"
    },
    hard: {
      options: 6,
      timeLimit: 60,
      hints: 1,
      targetAudience: "נוער ומבוגרים"
    }
  },
  progression: {
    requireMinScore: true,
    minScoreToProgress: 70
  },
  // הגדרת שלבי המשחק
  stages: [
    {
      id: "intro",
      type: "story_intro",
      title: "פתיחה - המסע לחירות",
      description: "הכירו את המשימה והתחילו במסע"
    },
    {
      id: "preliminary",
      type: "multi_stage",
      title: "מסע אברהם - לך לך מארצך",
      description: "מסעו של אברהם אבינו - ראשית האומה"
    },
    {
      id: "stage1",
      type: "multi_stage",
      title: "ברית בין הבתרים - הבטחה לדורות",
      description: "ה' מבטיח לאברהם את ארץ ישראל ומתנבא על גלות מצרים"
    },
    {
      id: "stage2",
      type: "multi_stage",
      title: "השעבוד במצרים - כור הברזל",
      description: "כיצד התדרדר מצבם של בני ישראל במצרים"
    },
    {
      id: "stage3",
      type: "multi_stage",
      title: "משה ואהרן - הנהגה בעת משבר",
      description: "כיצד נבחרו מנהיגי האומה"
    },
    {
      id: "stage4",
      type: "multi_stage",
      title: "עשר המכות - יד ה' במצרים",
      description: "המכות שהביא ה' על מצרים והמשמעות שלהן"
    },
    {
      id: "stage5",
      type: "multi_stage",
      title: "ליל הסדר הראשון - והגדת לבנך",
      description: "ליל היציאה ממצרים וסדר פסח הראשון"
    },
    {
      id: "stage6",
      type: "multi_stage",
      title: "קריעת ים סוף - בין המיצרים",
      description: "נס קריעת ים סוף והצלת עם ישראל"
    },
    {
      id: "stage7",
      type: "multi_stage",
      title: "מתן תורה - מחירות פיזית לחירות רוחנית",
      description: "קבלת התורה בהר סיני ומשמעות החירות האמיתית"
    },
    {
      id: "outro",
      type: "story_conclusion",
      title: "סיום - מגילת החירות הושלמה",
      description: "סיכום המסע וחשיבות החירות"
    }
  ]
};

export default passoverQuestConfig;