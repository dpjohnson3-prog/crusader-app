import { useMemo, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/constants/categories';
import { useGameState } from '@/context/GameState';
import { currentRank, levelFromXp, totalLevel, xpIntoLevel, XP_PER_LEVEL, type StatCategory } from '@/lib/stats';
import { DISCIPLINES, TOTAL_DISCIPLINES, disciplinesByCategory } from '@/lib/disciplines';

export default function TheChargeScreen() {
  const [activeCategory, setActiveCategory] = useState<StatCategory>('body');
  const { xp, doneIds, toggleDiscipline } = useGameState();

  const overallLevel = totalLevel(xp);
  const rank = currentRank(overallLevel);
  const completedCount = useMemo(
    () => DISCIPLINES.reduce((count, d) => count + (doneIds[d.id] ? 1 : 0), 0),
    [doneIds]
  );

  const activeLevel = levelFromXp(xp[activeCategory]);
  const activeXpIntoLevel = xpIntoLevel(xp[activeCategory]);
  const activeColor = CATEGORY_COLORS[activeCategory];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>The Charge</Text>
        <Text style={styles.subtitle}>
          {rank} · Level {overallLevel} · {completedCount} of {TOTAL_DISCIPLINES} disciplines done today
        </Text>
      </View>

      <View style={styles.categoryTabs}>
        {(['body', 'mind', 'spirit'] as StatCategory[]).map((category) => {
          const isActive = category === activeCategory;
          return (
            <Pressable
              key={category}
              onPress={() => setActiveCategory(category)}
              style={[
                styles.categoryTab,
                isActive && { borderBottomColor: CATEGORY_COLORS[category], borderBottomWidth: 2 },
              ]}>
              <Text style={[styles.categoryTabText, isActive && { color: CATEGORY_COLORS[category] }]}>
                {CATEGORY_LABELS[category]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.statSummary}>
        <Text style={[styles.statSummaryLevel, { color: activeColor }]}>
          {CATEGORY_LABELS[activeCategory]} · Level {activeLevel}
        </Text>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${(activeXpIntoLevel / XP_PER_LEVEL) * 100}%`, backgroundColor: activeColor },
            ]}
          />
        </View>
        <Text style={styles.statSummarySub}>
          {activeXpIntoLevel} / {XP_PER_LEVEL} xp to next level
        </Text>
      </View>

      <View style={styles.list}>
        {disciplinesByCategory(activeCategory).map((discipline) => {
          const done = !!doneIds[discipline.id];
          return (
            <Pressable
              key={discipline.id}
              onPress={() => toggleDiscipline(discipline)}
              style={[
                styles.row,
                done && { borderColor: activeColor, backgroundColor: `${activeColor}22` },
              ]}>
              <View style={[styles.checkbox, done && { backgroundColor: activeColor, borderColor: activeColor }]}>
                {done && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowName}>{discipline.name}</Text>
                {discipline.subtitle && <Text style={styles.rowSub}>{discipline.subtitle}</Text>}
              </View>
              <Text style={styles.rowPoints}>+{discipline.points}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: 4,
  },
  categoryTabs: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryTab: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginRight: 24,
  },
  categoryTabText: {
    fontSize: 15,
    fontWeight: '600',
    opacity: 0.6,
  },
  statSummary: {
    marginBottom: 18,
  },
  statSummaryLevel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  progressTrack: {
    height: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(128,128,128,0.25)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  statSummarySub: {
    fontSize: 11,
    opacity: 0.6,
    marginTop: 4,
  },
  list: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.3)',
    marginBottom: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(128,128,128,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkmark: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  rowText: {
    flex: 1,
  },
  rowName: {
    fontSize: 14,
    fontWeight: '600',
  },
  rowSub: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  rowPoints: {
    fontSize: 12,
    opacity: 0.6,
    fontVariant: ['tabular-nums'],
  },
});
