import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Colors, NOTCH_SIZE } from '@/constants/theme';

interface HudPanelProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  borderColor?: string;
  /** Color painted into the two cut corners — should match whatever sits behind this panel. */
  cutColor?: string;
  notchSize?: number;
  glow?: boolean;
  glowColor?: string;
}

// Notched/cut-corner panel — the "hexagon-style" HUD motif from the spec.
// React Native has no clip-path, so the corners are cut with the classic
// CSS border-triangle trick: a zero-size box with two opposite border
// widths set and the other two transparent, forming a right triangle
// painted in `cutColor` (whatever background sits behind the panel). That
// triangle sits over the panel's rectangular border, so the border simply
// reads as if it stops at the cut rather than needing a drawn diagonal.
export function HudPanel({
  children,
  style,
  backgroundColor = Colors.panel,
  borderColor = Colors.border,
  cutColor = Colors.bg,
  notchSize = NOTCH_SIZE,
  glow = false,
  glowColor = Colors.cyan,
}: HudPanelProps) {
  return (
    <View
      style={[
        styles.panel,
        { backgroundColor, borderColor },
        glow && {
          shadowColor: glowColor,
          shadowOpacity: 0.5,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 0 },
          elevation: 6,
        },
        style,
      ]}>
      {children}
      <View
        pointerEvents="none"
        style={[
          styles.notch,
          styles.notchTopLeft,
          { borderTopWidth: notchSize, borderRightWidth: notchSize, borderTopColor: cutColor },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.notch,
          styles.notchBottomRight,
          { borderBottomWidth: notchSize, borderLeftWidth: notchSize, borderBottomColor: cutColor },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderWidth: 1,
    borderRadius: 2,
  },
  notch: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderColor: 'transparent',
  },
  notchTopLeft: {
    top: -1,
    left: -1,
  },
  notchBottomRight: {
    bottom: -1,
    right: -1,
  },
});
