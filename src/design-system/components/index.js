// ייצוא מרוכז של כל רכיבי מערכת העיצוב

// רכיבי תוכן בסיסיים
export { Button } from './Button';
export { Card } from './Card';
export { ScrollCard } from './ScrollCard';
export { GlassCard } from './GlassCard';
export { Heading } from './Heading';

// רכיבי פריסה
export { PageContainer } from './PageContainer';
export { GameContainer } from './GameContainer';
export { JourneyMap } from './JourneyMap';
export { ProgressTracker } from './ProgressTracker';
export { SourceReference } from './SourceReference';

// רכיבי משוב ולמידה
export { HintsPanel } from './HintsPanel';
export { LearningPopup } from './LearningPopup';

// רכיבים נוספים שיידרשו בהמשך
export { CharacterDialog } from './CharacterDialog';
export { LoadingIndicator } from './LoadingIndicator';

// מייצא את כל הרכיבים כברירת מחדל
export default {
  Button,
  Card,
  ScrollCard,
  GlassCard,
  Heading,
  PageContainer,
  GameContainer,
  JourneyMap,
  ProgressTracker,
  SourceReference,
  HintsPanel,
  LearningPopup,
  CharacterDialog,
  LoadingIndicator
};
