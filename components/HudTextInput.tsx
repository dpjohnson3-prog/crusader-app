import { useState } from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { Colors, InterFonts } from '@/constants/theme';
import { HudPanel } from '@/components/HudPanel';

interface HudTextInputProps extends TextInputProps {
  /** Background color behind this input — needed so the notch cut paints correctly. */
  cutColor?: string;
}

export function HudTextInput({ style, cutColor = Colors.bg, onFocus, onBlur, ...props }: HudTextInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <HudPanel
      backgroundColor={Colors.panel2}
      borderColor={focused ? Colors.cyan : Colors.border}
      cutColor={cutColor}
      glow={focused}
      glowColor={Colors.cyan}
      notchSize={8}
      style={styles.panel}>
      <TextInput
        {...props}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        placeholderTextColor={Colors.inkDim}
        style={[styles.input, style]}
      />
    </HudPanel>
  );
}

const styles = StyleSheet.create({
  panel: {
    paddingHorizontal: 14,
    paddingVertical: 2,
  },
  input: {
    fontFamily: InterFonts.regular,
    fontSize: 14,
    color: Colors.ink,
    paddingVertical: 12,
  },
});
