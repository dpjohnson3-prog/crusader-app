import { StyleSheet, Text } from 'react-native';

import { HudPanel } from '@/components/HudPanel';
import { Colors, FrauncesFonts, InterFonts, OrbitronFonts, PlexMonoFonts } from '@/constants/theme';
import { VIRTUE_LABELS, type VirtueCard } from '@/lib/virtueCards';

interface VirtueCardPanelProps {
  card: VirtueCard;
}

export function VirtueCardPanel({ card }: VirtueCardPanelProps) {
  return (
    <HudPanel style={styles.card}>
      <Text style={styles.virtueLabel}>{VIRTUE_LABELS[card.virtue].toUpperCase()}</Text>
      <Text style={styles.verse}>“{card.verse}”</Text>
      <Text style={styles.reference}>{card.reference}</Text>
      <Text style={styles.reflection}>{card.reflection}</Text>
    </HudPanel>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 16,
  },
  virtueLabel: {
    fontFamily: OrbitronFonts.medium,
    fontSize: 11,
    letterSpacing: 2,
    color: Colors.cyan,
    marginBottom: 8,
  },
  verse: {
    fontFamily: FrauncesFonts.mediumItalic,
    fontSize: 16,
    lineHeight: 23,
    color: Colors.gold,
  },
  reference: {
    fontFamily: PlexMonoFonts.medium,
    fontSize: 11,
    color: Colors.gold,
    marginTop: 8,
  },
  reflection: {
    fontFamily: InterFonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: Colors.inkSoft,
    marginTop: 12,
  },
});
