import { ScrollView, StyleSheet, Text } from 'react-native';

import { HudPanel } from '@/components/HudPanel';
import { StatProgressBar } from '@/components/StatProgressBar';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/constants/categories';
import { Colors, OrbitronFonts, PlexMonoFonts } from '@/constants/theme';
import { useGameState } from '@/context/GameState';
import { currentRank, levelFromXp, totalLevel, xpIntoLevel, XP_PER_LEVEL, type StatCategory } from '@/lib/stats';

const CATEGORIES: StatCategory[] = ['body', 'mind', 'spirit'];

export default function ProgressScreen() {
  const { xp, levelUpEvent } = useGameState();
  const overallLevel = totalLevel(xp);
  const rank = currentRank(overallLevel);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>RECORD OF DEEDS</Text>

      <HudPanel style={styles.overallCard}>
        <Text style={styles.overallRank}>{rank}</Text>
        <Text style={styles.overallLevel}>OVERALL LEVEL {overallLevel}</Text>
      </HudPanel>

      {CATEGORIES.map((category) => {
        const level = levelFromXp(xp[category]);
        const intoLevel = xpIntoLevel(xp[category]);
        const color = CATEGORY_COLORS[category];
        const levelUpToken = levelUpEvent?.category === category ? levelUpEvent.token : null;
        return (
          <HudPanel key={category} style={styles.statCard}>
            <Text style={[styles.statName, { color }]}>{CATEGORY_LABELS[category].toUpperCase()}</Text>
            <Text style={styles.statLevel}>LEVEL {level}</Text>
            <StatProgressBar
              color={color}
              progress={intoLevel / XP_PER_LEVEL}
              levelUpToken={levelUpToken}
            />
            <Text style={styles.statSub}>
              {intoLevel} / {XP_PER_LEVEL} XP TO NEXT LEVEL
            </Text>
          </HudPanel>
        );
      })}
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
    marginBottom: 16,
  },
  overallCard: {
    padding: 18,
    marginBottom: 16,
    alignItems: 'center',
  },
  overallRank: {
    fontFamily: OrbitronFonts.semiBold,
    fontSize: 19,
    color: Colors.gold,
    textShadowColor: Colors.gold,
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
  },
  overallLevel: {
    fontFamily: PlexMonoFonts.medium,
    fontSize: 12,
    color: Colors.inkSoft,
    marginTop: 6,
  },
  statCard: {
    padding: 16,
    marginBottom: 12,
  },
  statName: {
    fontFamily: OrbitronFonts.medium,
    fontSize: 12,
    letterSpacing: 1,
  },
  statLevel: {
    fontFamily: PlexMonoFonts.semiBold,
    fontSize: 19,
    color: Colors.ink,
    marginTop: 4,
    marginBottom: 10,
  },
  statSub: {
    fontFamily: PlexMonoFonts.medium,
    fontSize: 11,
    color: Colors.inkDim,
    marginTop: 6,
  },
});
