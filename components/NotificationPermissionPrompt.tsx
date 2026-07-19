import { StyleSheet, Text, View } from 'react-native';

import { HudButton } from '@/components/HudButton';
import { HudPanel } from '@/components/HudPanel';
import { Colors, InterFonts, OrbitronFonts } from '@/constants/theme';

interface NotificationPermissionPromptProps {
  onEnable: () => void;
  onDismiss: () => void;
}

// Shown once, the first time a signed-in user reaches the main tabs (see
// app/(tabs)/_layout.tsx) — our own explanation before the system
// permission dialog, framed in the app's voice rather than a bare OS prompt.
export function NotificationPermissionPrompt({ onEnable, onDismiss }: NotificationPermissionPromptProps) {
  return (
    <View style={styles.overlay}>
      <HudPanel style={styles.card}>
        <Text style={styles.eyebrow}>STAND WATCH</Text>
        <Text style={styles.title}>Daily Reminders</Text>
        <Text style={styles.body}>
          Crusader can send two quiet reminders each day — one to start strong, one only if
          today&apos;s charge isn&apos;t finished by evening. Nothing more, and you can turn it off
          anytime in your device settings.
        </Text>
        <HudButton title="Enable Reminders" onPress={onEnable} cutColor={Colors.panel} />
        <HudButton title="Not Now" onPress={onDismiss} variant="secondary" cutColor={Colors.panel} />
      </HudPanel>
    </View>
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
    paddingHorizontal: 24,
    zIndex: 1000,
  },
  card: {
    padding: 20,
    width: '100%',
    maxWidth: 360,
  },
  eyebrow: {
    fontFamily: OrbitronFonts.medium,
    fontSize: 11,
    letterSpacing: 3,
    color: Colors.cyan,
    marginBottom: 8,
  },
  title: {
    fontFamily: OrbitronFonts.bold,
    fontSize: 18,
    letterSpacing: 1,
    color: Colors.ink,
    marginBottom: 12,
  },
  body: {
    fontFamily: InterFonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: Colors.inkSoft,
    marginBottom: 8,
  },
});
