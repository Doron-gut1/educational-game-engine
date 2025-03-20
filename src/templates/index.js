/**
 * ייצוא מרוכז של כל תבניות המשחק
 */
import { questJourneyTemplate } from './questJourney';
import { escapeRoomTemplate } from './escapeRoom';
import { memoryChallengeTemplate } from './memoryChallenge';

// מיפוי תבניות לפי ID
export const templates = {
  [questJourneyTemplate.id]: questJourneyTemplate,
  [escapeRoomTemplate.id]: escapeRoomTemplate,
  [memoryChallengeTemplate.id]: memoryChallengeTemplate,
};

// פונקציה לקבלת תבנית לפי ID
export const getTemplate = (templateId) => {
  return templates[templateId] || null;
};

// רשימת תבניות זמינות
export const availableTemplates = Object.values(templates);

// ייצוא פרטני
 export { questJourneyTemplate, escapeRoomTemplate, memoryChallengeTemplate };