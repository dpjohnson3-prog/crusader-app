import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CrusadeCompleteView } from '@/components/CrusadeCompleteView';
import { HudPanel } from '@/components/HudPanel';
import { StatProgressBar } from '@/components/StatProgressBar';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/constants/categories';
import { Colors, InterFonts, OrbitronFonts, PlexMonoFonts } from '@/constants/theme';
import { useGameState } from '@/context/GameState';
import { CRUSADE_LENGTH_DAYS } from '@/lib/crusade';
import { currentRank, levelFromXp, totalLevel, xpIntoLevel, XP_PER_LEVEL, type StatCategory } from '@/lib/stats';
import { DISCIPLINES, TOTAL_DISCIPLINES, disciplinesByCategory } from '@/lib/disciplines';

export default function TheChargeScreen() {
  const [activeCategory, setActiveCategory] = useState<StatCategory>('body');
  const {
    xp,
    doneIds,
    toggleDiscipline,
    levelUpEvent,
    crusadeDayNumber,
    crusadeStreak,
    crusadeDaysCompleted,
    crusadeComplete,
    beginNewCrusade,
  } = useGameState();

  const overallLevel = totalLevel(xp);
  const rank = currentRank(overallLevel);
  const completedCount = useMemo(
    () => DISCIPLINES.reduce((count, d) => count + (doneIds[d.id] ? 1 : 0), 0),
    [doneIds]
  );

  const activeLevel = levelFromXp(xp[activeCategory]);
  const activeXpIntoLevel = xpIntoLevel(xp[activeCategory]);
  const activeColor = CATEGORY_COLORS[activeCategory];
  const activeLevelUpToken = levelUpEvent?.category === activeCategory ? levelUpEvent.token : null;

  if (crusadeComplete) {
    return (
      <View style={styles.container}>
        <CrusadeCompleteView
          daysCompleted={crusadeDaysCompleted}
          finalStreak={crusadeStreak}
          rank={rank}
          onBeginNewCrusade={beginNewCrusade}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>THE CHARGE</Text>
        <Text style={styles.subtitle}>
          {rank} · Level {overallLevel} · {completedCount} of {TOTAL_DISCIPLINES} disciplines done today
        </Text>
        <View style={styles.crusadeBadgeRow}>
          <Text style={styles.crusadeBadge}>
            DAY {crusadeDayNumber} / {CRUSADE_LENGTH_DAYS}
          </Text>
          <Text style={styles.crusadeBadgeDivider}>·</Text>
          <Text style={styles.crusadeBadge}>{crusadeStreak} DAY STREAK</Text>
        </View>
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
          {CATEGORY_LABELS[activeCategory].toUpperCase()} · LEVEL {activeLevel}
        </Text>
        <StatProgressBar
          color={activeColor}
          progress={activeXpIntoLevel / XP_PER_LEVEL}
          levelUpToken={activeLevelUpToken}
        />
        <Text style={styles.statSummarySub}>
          {activeXpIntoLevel} / {XP_PER_LEVEL} XP TO NEXT LEVEL
        </Text>
      </View>

      <View style={styles.list}>
        {disciplinesByCategory(activeCategory).map((discipline) => {
          const done = !!doneIds[discipline.id];
          return (
            <Pressable key={discipline.id} onPress={() => toggleDiscipline(discipline)}>
              <HudPanel
                notchSize={10}
                backgroundColor={done ? `${activeColor}22` : Colors.panel}
                borderColor={done ? activeColor : Colors.border}
                glow={done}
                glowColor={activeColor}
                style={styles.row}>
                <View style={[styles.checkbox, done && { backgroundColor: activeColor, borderColor: activeColor }]}>
                  {done && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <View style={styles.rowText}>
                  <Text style={styles.rowName}>{discipline.name}</Text>
                  {discipline.subtitle && <Text style={styles.rowSub}>{discipline.subtitle}</Text>}
                </View>
                <Text style={[styles.rowPoints, { color: activeColor }]}>+{discipline.points}</Text>
              </HudPanel>
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
    backgroundColor: Colors.bg,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontFamily: OrbitronFonts.bold,
    fontSize: 22,
    letterSpacing: 2,
    color: Colors.ink,
  },
  subtitle: {
    fontFamily: InterFonts.regular,
    fontSize: 13,
    color: Colors.inkSoft,
    marginTop: 4,
  },
  crusadeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  crusadeBadge: {
    fontFamily: PlexMonoFonts.medium,
    fontSize: 11,
    letterSpacing: 0.5,
    color: Colors.gold,
  },
  crusadeBadgeDivider: {
    fontFamily: PlexMonoFonts.medium,
    fontSize: 11,
    color: Colors.inkDim,
    marginHorizontal: 8,
  },
  categoryTabs: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoryTab: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginRight: 24,
  },
  categoryTabText: {
    fontFamily: OrbitronFonts.medium,
    fontSize: 13,
    color: Colors.inkDim,
  },
  statSummary: {
    marginBottom: 18,
  },
  statSummaryLevel: {
    fontFamily: PlexMonoFonts.semiBold,
    fontSize: 13,
    marginBottom: 8,
  },
  statSummarySub: {
    fontFamily: PlexMonoFonts.medium,
    fontSize: 11,
    color: Colors.inkDim,
    marginTop: 6,
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
    marginBottom: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.inkDim,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkmark: {
    color: Colors.bg,
    fontSize: 13,
    fontWeight: 'bold',
  },
  rowText: {
    flex: 1,
  },
  rowName: {
    fontFamily: InterFonts.semiBold,
    fontSize: 14,
    color: Colors.ink,
  },
  rowSub: {
    fontFamily: InterFonts.regular,
    fontSize: 12,
    color: Colors.inkSoft,
    marginTop: 2,
  },
  rowPoints: {
    fontFamily: PlexMonoFonts.medium,
    fontSize: 12,
  },
});
