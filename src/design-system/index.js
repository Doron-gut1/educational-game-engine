// src/design-system/index.js
// נקודת גישה מרכזית למערכת העיצוב - מאחדת את כל הרכיבים תחת ייבוא אחד

import { ThemeProvider, useTheme } from './ThemeProvider';

// ייבוא כל רכיבי העיצוב
import Button from './components/Button';
import Card from './components/Card';
import GlassCard from './components/GlassCard';
import ScrollCard from './components/ScrollCard';
import Heading from './components/Heading';
import StageHeading from './components/StageHeading';
import PageContainer from './components/PageContainer';
import GameContainer from './components/GameContainer';
import LoadingIndicator from './components/LoadingIndicator';
import ProgressTracker from './components/ProgressTracker';
import HintsPanel from './components/HintsPanel';
import SourceReference from './components/SourceReference';
import LearningPopup from './components/LearningPopup';
import CharacterDialog from './components/CharacterDialog';

// ייבוא כל התמות
import { themes } from './themes';

// ייצוא כל הרכיבים בנקודת גישה אחת
export {
  // ניהול תמה
  ThemeProvider,
  useTheme,
  themes,
  
  // רכיבים בסיסיים
  Button,
  Card,
  GlassCard,
  ScrollCard,
  Heading,
  StageHeading,
  
  // רכיבי פריסה
  PageContainer,
  GameContainer,
  
  // רכיבי משחק
  ProgressTracker,
  HintsPanel,
  SourceReference,
  LearningPopup,
  LoadingIndicator,
  CharacterDialog
};

// ייצוא כל המערכת כברירת מחדל
export default {
  ThemeProvider,
  useTheme,
  themes,
  Button,
  Card,
  GlassCard,
  ScrollCard,
  Heading,
  StageHeading,
  PageContainer,
  GameContainer,
  ProgressTracker,
  HintsPanel,
  SourceReference,
  LearningPopup,
  LoadingIndicator,
  CharacterDialog
};