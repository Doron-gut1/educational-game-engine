// ייצוא מרוכז של כל רכיבי מערכת העיצוב

// רכיבי תוכן בסיסיים
import { Button } from './Button';
import { Card } from './Card';
import { ScrollCard } from './ScrollCard';
import { GlassCard } from './GlassCard';
import { Heading } from './Heading';
import { StageHeading } from './StageHeading';

// רכיבי פריסה
import { PageContainer } from './PageContainer';
import { GameContainer } from './GameContainer';
import { JourneyMap } from './JourneyMap';
import { ProgressTracker } from './ProgressTracker';
import { SourceReference } from './SourceReference';

// רכיבי משוב ולמידה
import { HintsPanel } from './HintsPanel';
import { LearningPopup } from './LearningPopup';

// רכיבים נוספים שיידרשו בהמשך
import { CharacterDialog } from './CharacterDialog';
import { LoadingIndicator } from './LoadingIndicator';

// ייצוא כל הרכיבים בנפרד
export { 
  Button,
  Card,
  ScrollCard,
  GlassCard,
  Heading,
  StageHeading,
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

// מייצא את כל הרכיבים כברירת מחדל
export default {
  Button,
  Card,
  ScrollCard,
  GlassCard,
  Heading,
  StageHeading,
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