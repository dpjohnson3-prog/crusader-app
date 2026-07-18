import {
  Orbitron_500Medium,
  Orbitron_600SemiBold,
  Orbitron_700Bold,
} from '@expo-google-fonts/orbitron';
import {
  Fraunces_500Medium,
  Fraunces_500Medium_Italic,
  Fraunces_600SemiBold,
} from '@expo-google-fonts/fraunces';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import {
  IBMPlexMono_500Medium,
  IBMPlexMono_600SemiBold,
} from '@expo-google-fonts/ibm-plex-mono';

// "System window" HUD theme — see crusaderappspec.md's "Visual design system".
// This app has one fixed dark theme; it does not adapt to system light/dark mode.

export const Colors = {
  bg: '#0A0D16',
  bg2: '#0E1220',
  panel: '#121728',
  panel2: '#161C30',
  cyan: '#5FD8FF',
  gold: '#E8C25C',
  body: '#FF6E5A',
  mind: '#5FD8FF',
  spirit: '#C9A6FF',
  ink: '#E7ECF8',
  inkSoft: '#8B93B0',
  inkDim: '#5B6280',
  border: 'rgba(95,216,255,0.22)',
  danger: '#FF6E5A',
} as const;

// Display/headers/rank text.
export const OrbitronFonts = {
  medium: 'Orbitron_500Medium',
  semiBold: 'Orbitron_600SemiBold',
  bold: 'Orbitron_700Bold',
} as const;

// Scripture verses / reflective quotes only — deliberately distinct from the system UI.
export const FrauncesFonts = {
  medium: 'Fraunces_500Medium',
  mediumItalic: 'Fraunces_500Medium_Italic',
  semiBold: 'Fraunces_600SemiBold',
} as const;

// Body copy.
export const InterFonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
} as const;

// Stats/numbers/labels.
export const PlexMonoFonts = {
  medium: 'IBMPlexMono_500Medium',
  semiBold: 'IBMPlexMono_600SemiBold',
} as const;

export const AllFontsToLoad = {
  [OrbitronFonts.medium]: Orbitron_500Medium,
  [OrbitronFonts.semiBold]: Orbitron_600SemiBold,
  [OrbitronFonts.bold]: Orbitron_700Bold,
  [FrauncesFonts.medium]: Fraunces_500Medium,
  [FrauncesFonts.mediumItalic]: Fraunces_500Medium_Italic,
  [FrauncesFonts.semiBold]: Fraunces_600SemiBold,
  [InterFonts.regular]: Inter_400Regular,
  [InterFonts.medium]: Inter_500Medium,
  [InterFonts.semiBold]: Inter_600SemiBold,
  [PlexMonoFonts.medium]: IBMPlexMono_500Medium,
  [PlexMonoFonts.semiBold]: IBMPlexMono_600SemiBold,
};

// Notched/cut-corner panel motif — see components/HudPanel.tsx.
export const NOTCH_SIZE = 14;
