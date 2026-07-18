import { ScrollView, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useGameState } from '@/context/GameState';
import { currentRank, RANK_LADDER, totalLevel } from '@/lib/stats';

export default function OrderScreen() {
  const { xp } = useGameState();
  const overallLevel = totalLevel(xp);
  const rank = currentRank(overallLevel);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>The Order</Text>
      <Text style={styles.subtitle}>
        Your overall level is Body + Mind + Spirit levels combined. You are Level {overallLevel} — {rank}.
      </Text>

      <View style={styles.ladder}>
        {RANK_LADDER.map((rung) => {
          const reached = overallLevel >= rung.level;
          const isCurrent = reached && rung.title === rank;
          const status = isCurrent ? 'current' : reached ? 'reached' : 'locked';
          return (
            <View
              key={rung.title}
              style={[
                styles.rung,
                status === 'current' && styles.rungCurrent,
                status === 'locked' && styles.rungLocked,
              ]}>
              <Text
                style={[
                  styles.rungTitle,
                  status === 'current' && styles.rungTitleCurrent,
                  status === 'locked' && styles.rungTitleLocked,
                ]}>
                {rung.title}
              </Text>
              <Text style={styles.rungLevel}>Level {rung.level}</Text>
            </View>
          );
        })}
      </View>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    opacity: 0.7,
    lineHeight: 19,
    marginBottom: 20,
  },
  ladder: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(128,128,128,0.2)',
  },
  rung: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128,128,128,0.2)',
  },
  rungCurrent: {
    backgroundColor: 'rgba(232,194,92,0.12)',
  },
  rungLocked: {
    opacity: 0.5,
  },
  rungTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  rungTitleCurrent: {
    color: '#C9A227',
    fontWeight: '700',
  },
  rungTitleLocked: {
    fontWeight: '400',
  },
  rungLevel: {
    fontSize: 12,
    opacity: 0.6,
  },
});
