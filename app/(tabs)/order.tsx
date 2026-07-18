import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { HudPanel } from '@/components/HudPanel';
import { Colors, InterFonts, OrbitronFonts, PlexMonoFonts } from '@/constants/theme';
import { useGameState } from '@/context/GameState';
import { currentRank, RANK_LADDER, totalLevel } from '@/lib/stats';
import { VIRTUE_CARDS, VIRTUES, VIRTUE_LABELS, virtueCardsSeenThroughDay, type VirtueCard } from '@/lib/virtueCards';

export default function OrderScreen() {
  const { xp, crusadeVowMode, setCrusadeVowMode, crusadeDayNumber } = useGameState();
  const overallLevel = totalLevel(xp);
  const rank = currentRank(overallLevel);
  const seenCards = virtueCardsSeenThroughDay(crusadeDayNumber);
  const seenIds = new Set(seenCards.map((card) => card.id));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>THE ORDER</Text>
      <Text style={styles.subtitle}>
        Your overall level is Body + Mind + Spirit levels combined. You are Level {overallLevel} — {rank}.
      </Text>

      <HudPanel style={styles.vowCard}>
        <View style={styles.vowRow}>
          <View style={styles.vowText}>
            <Text style={styles.vowTitle}>VOW MODE</Text>
            <Text style={styles.vowDescription}>
              Only count a day toward your crusade streak if all 21 disciplines are completed — no partial credit.
            </Text>
          </View>
          <Switch
            value={crusadeVowMode}
            onValueChange={setCrusadeVowMode}
            trackColor={{ false: Colors.border, true: Colors.gold }}
            thumbColor={Colors.ink}
          />
        </View>
      </HudPanel>

      <Text style={styles.sectionLabel}>VIRTUE CARDS SEEN THIS CRUSADE</Text>
      {VIRTUES.map((virtue) => {
        const cardsForVirtue: VirtueCard[] = VIRTUE_CARDS.filter((card) => card.virtue === virtue);
        const seenCount = cardsForVirtue.filter((card) => seenIds.has(card.id)).length;
        return (
          <HudPanel key={virtue} style={styles.virtueCard}>
            <View style={styles.virtueCardHeader}>
              <Text style={styles.virtueCardTitle}>{VIRTUE_LABELS[virtue].toUpperCase()}</Text>
              <Text style={styles.virtueCardCount}>
                {seenCount} / {cardsForVirtue.length}
              </Text>
            </View>
            <View style={styles.virtueChipRow}>
              {cardsForVirtue.map((card) => {
                const seen = seenIds.has(card.id);
                return (
                  <View key={card.id} style={[styles.virtueChip, seen && styles.virtueChipSeen]}>
                    <Text style={[styles.virtueChipText, seen && styles.virtueChipTextSeen]}>{card.reference}</Text>
                  </View>
                );
              })}
            </View>
          </HudPanel>
        );
      })}

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
  vowCard: {
    padding: 16,
    marginBottom: 16,
  },
  vowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  vowText: {
    flex: 1,
  },
  vowTitle: {
    fontFamily: OrbitronFonts.medium,
    fontSize: 13,
    letterSpacing: 1,
    color: Colors.ink,
    marginBottom: 4,
  },
  vowDescription: {
    fontFamily: InterFonts.regular,
    fontSize: 12,
    lineHeight: 17,
    color: Colors.inkSoft,
  },
  sectionLabel: {
    fontFamily: PlexMonoFonts.semiBold,
    fontSize: 12,
    letterSpacing: 1,
    color: Colors.inkDim,
    marginBottom: 10,
  },
  virtueCard: {
    padding: 14,
    marginBottom: 10,
  },
  virtueCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  virtueCardTitle: {
    fontFamily: OrbitronFonts.medium,
    fontSize: 12,
    letterSpacing: 1,
    color: Colors.gold,
  },
  virtueCardCount: {
    fontFamily: PlexMonoFonts.medium,
    fontSize: 11,
    color: Colors.inkDim,
  },
  virtueChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  virtueChip: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 9,
  },
  virtueChipSeen: {
    borderColor: Colors.gold,
    backgroundColor: 'rgba(232,194,92,0.12)',
  },
  virtueChipText: {
    fontFamily: PlexMonoFonts.medium,
    fontSize: 10,
    color: Colors.inkDim,
  },
  virtueChipTextSeen: {
    color: Colors.gold,
  },
  ladder: {
    paddingHorizontal: 4,
    marginTop: 6,
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
