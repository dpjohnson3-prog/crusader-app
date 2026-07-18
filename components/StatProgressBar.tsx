import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface StatProgressBarProps {
  color: string;
  /** 0..1 */
  progress: number;
  /** Bump this (e.g. an incrementing token) to trigger the level-up flash. */
  levelUpToken?: number | null;
}

// Per-stat level-up feedback — see crusaderappspec.md's "Level-up feedback":
// "the stat's progress bar flashes/glows briefly in that stat's color when
// it crosses a 30-XP threshold."
export function StatProgressBar({ color, progress, levelUpToken }: StatProgressBarProps) {
  const flash = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (levelUpToken == null) return;
    flash.setValue(1);
    Animated.timing(flash, { toValue: 0, duration: 900, useNativeDriver: true }).start();
  }, [levelUpToken, flash]);

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.max(0, Math.min(1, progress)) * 100}%`, backgroundColor: color }]} />
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          styles.flash,
          {
            backgroundColor: color,
            opacity: flash,
            shadowColor: color,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
  flash: {
    borderRadius: 2,
    shadowOpacity: 0.9,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
});
