import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { HudPanel } from '@/components/HudPanel';
import { Colors, InterFonts, OrbitronFonts, PlexMonoFonts } from '@/constants/theme';
import { useGameState } from '@/context/GameState';
import { currentRank, RANK_LADDER, totalLevel } from '@/lib/stats';

export default function OrderScreen() {
  const { xp } = useGameState();
  const overallLevel = totalLevel(xp);
  const rank = currentRank(overallLevel);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>THE ORDER</Text>
      <Text style={styles.subtitle}>
        Your overall level is Body + Mind + Spirit levels combined. You are Level {overallLevel} — {rank}.
      </Text>

      <HudPanel style={styles.ladder}>
        {RANK_LADDER.map((rung, index) => {
          const reached = overallLevel >= rung.level;
          const isCurrent = reached && rung.title === rank;
          const isLast = index === RANK_LADDER.length - 1;
          return (
            <View
              key={rung.title}
              style={[
                styles.rung,
                !isLast && styles.rungDivider,
                isCurrent && styles.rungCurrent,
                !reached && styles.rungLocked,
              ]}>
              <Text
                style={[
                  styles.rungTitle,
                  isCurrent && styles.rungTitleCurrent,
                  !reached && styles.rungTitleLocked,
                ]}>
                {rung.title}
              </Text>
              <Text style={styles.rungLevel}>LEVEL {rung.level}</Text>
            </View>
          );
        })}
      </HudPanel>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontFamily: OrbitronFonts.bold,
    fontSize: 22,
    letterSpacing: 2,
    color: Colors.ink,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: InterFonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: Colors.inkSoft,
    marginBottom: 20,
  },
  ladder: {
    paddingHorizontal: 4,
  },
  rung: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  rungDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rungCurrent: {
    backgroundColor: 'rgba(232,194,92,0.12)',
  },
  rungLocked: {
    opacity: 0.5,
  },
  rungTitle: {
    fontFamily: OrbitronFonts.medium,
    fontSize: 14,
    color: Colors.ink,
  },
  rungTitleCurrent: {
    fontFamily: OrbitronFonts.semiBold,
    color: Colors.gold,
    textShadowColor: Colors.gold,
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 0 },
  },
  rungTitleLocked: {
    color: Colors.inkDim,
  },
  rungLevel: {
    fontFamily: PlexMonoFonts.medium,
    fontSize: 11,
    color: Colors.inkDim,
  },
});
