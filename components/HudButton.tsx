import { ActivityIndicator, Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { Colors, OrbitronFonts } from '@/constants/theme';
import { HudPanel } from '@/components/HudPanel';

interface HudButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  /** Background color behind this button — needed so the notch cut paints correctly. */
  cutColor?: string;
  style?: StyleProp<ViewStyle>;
}

export function HudButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  cutColor = Colors.bg,
  style,
}: HudButtonProps) {
  const isPrimary = variant === 'primary';
  const isDisabled = disabled || loading;

  return (
    <Pressable onPress={onPress} disabled={isDisabled} style={[styles.wrapper, isDisabled && styles.disabled, style]}>
      <HudPanel
        backgroundColor={isPrimary ? Colors.cyan : 'transparent'}
        borderColor={isPrimary ? Colors.cyan : Colors.border}
        cutColor={cutColor}
        glow={isPrimary && !isDisabled}
        glowColor={Colors.cyan}
        style={styles.panel}>
        {loading ? (
          <ActivityIndicator color={isPrimary ? Colors.bg : Colors.cyan} />
        ) : (
          <Text style={[styles.label, { color: isPrimary ? Colors.bg : Colors.cyan }]}>{title}</Text>
        )}
      </HudPanel>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 12,
  },
  disabled: {
    opacity: 0.45,
  },
  panel: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: OrbitronFonts.semiBold,
    fontSize: 13,
    letterSpacing: 1,
  },
});
