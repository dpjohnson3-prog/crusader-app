import { StyleSheet, Text, View } from 'react-native';

import { HudButton } from '@/components/HudButton';
import { HudPanel } from '@/components/HudPanel';
import { Colors, InterFonts, OrbitronFonts, PlexMonoFonts } from '@/constants/theme';
import { CRUSADE_LENGTH_DAYS } from '@/lib/crusade';

interface CrusadeCompleteViewProps {
  daysCompleted: number;
  finalStreak: number;
  rank: string;
  onBeginNewCrusade: () => void;
}

// Shown on The Charge once the 40-day window has elapsed — see
// crusaderappspec.md-adjacent spec for "The Crusade" campaign structure.
export function CrusadeCompleteView({
  daysCompleted,
  finalStreak,
  rank,
  onBeginNewCrusade,
}: CrusadeCompleteViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>THE CRUSADE</Text>
      <Text style={styles.title}>CRUSADE COMPLETE</Text>

      <HudPanel style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>DAYS COMPLETED</Text>
          <Text style={styles.summaryValue}>
            {daysCompleted} / {CRUSADE_LENGTH_DAYS}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>FINAL STREAK</Text>
          <Text style={styles.summaryValue}>{finalStreak} DAYS</Text>
        </View>
        <View style={[styles.summaryRow, styles.summaryRowLast]}>
          <Text style={styles.summaryLabel}>RANK ACHIEVED</Text>
          <Text style={styles.summaryRank}>{rank}</Text>
        </View>
      </HudPanel>

      <Text style={styles.note}>
        Your rank and XP carry forward — only the crusade's day count and streak reset.
      </Text>

      <HudButton title="Begin a New Crusade" onPress={onBeginNewCrusade} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  eyebrow: {
    fontFamily: OrbitronFonts.medium,
    fontSize: 12,
    letterSpacing: 3,
    color: Colors.cyan,
    textAlign: 'center',
    marginBottom: 6,
  },
  title: {
    fontFamily: OrbitronFonts.bold,
    fontSize: 24,
    letterSpacing: 2,
    color: Colors.gold,
    textAlign: 'center',
    textShadowColor: Colors.gold,
    textShadowRadius: 16,
    textShadowOffset: { width: 0, height: 0 },
    marginBottom: 24,
  },
  summaryCard: {
    padding: 18,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  summaryRowLast: {
    borderBottomWidth: 0,
  },
  summaryLabel: {
    fontFamily: PlexMonoFonts.medium,
    fontSize: 12,
    color: Colors.inkSoft,
  },
  summaryValue: {
    fontFamily: PlexMonoFonts.semiBold,
    fontSize: 16,
    color: Colors.ink,
  },
  summaryRank: {
    fontFamily: OrbitronFonts.semiBold,
    fontSize: 16,
    color: Colors.gold,
  },
  note: {
    fontFamily: InterFonts.regular,
    fontSize: 12,
    color: Colors.inkDim,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
});
