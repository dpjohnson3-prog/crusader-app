import { ScrollView, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/constants/categories';
import { useGameState } from '@/context/GameState';
import { currentRank, levelFromXp, totalLevel, xpIntoLevel, XP_PER_LEVEL, type StatCategory } from '@/lib/stats';

const CATEGORIES: StatCategory[] = ['body', 'mind', 'spirit'];

export default function ProgressScreen() {
  const { xp } = useGameState();
  const overallLevel = totalLevel(xp);
  const rank = currentRank(overallLevel);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Record of Deeds</Text>

      <View style={styles.overallCard}>
        <Text style={styles.overallRank}>{rank}</Text>
        <Text style={styles.overallLevel}>Overall Level {overallLevel}</Text>
      </View>

      {CATEGORIES.map((category) => {
        const level = levelFromXp(xp[category]);
        const intoLevel = xpIntoLevel(xp[category]);
        const color = CATEGORY_COLORS[category];
        return (
          <View key={category} style={styles.statCard}>
            <Text style={[styles.statName, { color }]}>{CATEGORY_LABELS[category]}</Text>
            <Text style={styles.statLevel}>Level {level}</Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(intoLevel / XP_PER_LEVEL) * 100}%`, backgroundColor: color },
                ]}
              />
            </View>
            <Text style={styles.statSub}>
              {intoLevel} / {XP_PER_LEVEL} xp to next level
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  overallCard: {
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.3)',
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    alignItems: 'center',
  },
  overallRank: {
    fontSize: 20,
    fontWeight: '700',
  },
  overallLevel: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: 4,
  },
  statCard: {
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  statName: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statLevel: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },
  progressTrack: {
    height: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(128,128,128,0.25)',
    overflow: 'hidden',
    marginTop: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  statSub: {
    fontSize: 11,
    opacity: 0.6,
    marginTop: 6,
  },
});
