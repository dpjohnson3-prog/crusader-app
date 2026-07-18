import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { Colors, OrbitronFonts } from '@/constants/theme';
import { useGameState } from '@/context/GameState';

const VISIBLE_MS = 2500;
const FADE_MS = 400;

// Full-screen "RANK ACHIEVED" moment — see crusaderappspec.md's
// "Level-up feedback": dimmed overlay, pulsing gold rank title, ~2.5s then fades.
export function RankUpOverlay() {
  const { rankUpEvent } = useGameState();
  const [rank, setRank] = useState<string | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0.9)).current;
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (!rankUpEvent) return;

    setRank(rankUpEvent.rank);

    pulseLoop.current?.stop();
    pulse.setValue(0.9);
    pulseLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.9, duration: 700, useNativeDriver: true }),
      ])
    );
    pulseLoop.current.start();

    Animated.timing(opacity, { toValue: 1, duration: FADE_MS, useNativeDriver: true }).start();

    const hideTimer = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: FADE_MS, useNativeDriver: true }).start(() => {
        pulseLoop.current?.stop();
        setRank(null);
      });
    }, VISIBLE_MS);

    return () => clearTimeout(hideTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rankUpEvent?.token]);

  if (!rank) return null;

  return (
    <Animated.View pointerEvents="none" style={[styles.overlay, { opacity }]}>
      <Animated.Text style={[styles.eyebrow, { transform: [{ scale: pulse }] }]}>RANK ACHIEVED</Animated.Text>
      <Animated.Text style={[styles.rank, { transform: [{ scale: pulse }] }]}>{rank}</Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10,13,22,0.86)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  eyebrow: {
    fontFamily: OrbitronFonts.medium,
    fontSize: 13,
    letterSpacing: 4,
    color: Colors.cyan,
    marginBottom: 14,
  },
  rank: {
    fontFamily: OrbitronFonts.bold,
    fontSize: 34,
    color: Colors.gold,
    textShadowColor: Colors.gold,
    textShadowRadius: 20,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 2,
  },
});
