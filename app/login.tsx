import * as Google from 'expo-auth-session/providers/google';
import { Redirect } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HudButton } from '@/components/HudButton';
import { HudPanel } from '@/components/HudPanel';
import { HudTextInput } from '@/components/HudTextInput';
import { useAuth } from '@/context/Auth';
import { Colors, InterFonts, OrbitronFonts } from '@/constants/theme';

WebBrowser.maybeCompleteAuthSession();

const googleWebClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
// expo-auth-session throws synchronously (during render) if webClientId is
// undefined, even if the request is never used. Fall back to a placeholder
// so the hook doesn't crash the screen when Google sign-in isn't configured
// yet — the button below stays disabled in that case, so it's never used.
const googleWebClientIdOrPlaceholder = googleWebClientId || 'unconfigured';

export default function LoginScreen() {
  const { user, isFirebaseConfigured, signInWithEmail, signUpWithEmail, signInWithGoogleIdToken } = useAuth();
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [googleRequest, googleResponse, promptGoogleSignIn] = Google.useIdTokenAuthRequest({
    webClientId: googleWebClientIdOrPlaceholder,
  });

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const idToken = googleResponse.params.id_token;
      setSubmitting(true);
      signInWithGoogleIdToken(idToken)
        .catch((err) => setError(err instanceof Error ? err.message : 'Google sign-in failed.'))
        .finally(() => setSubmitting(false));
    } else if (googleResponse?.type === 'error') {
      setError('Google sign-in failed.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleResponse]);

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'signIn') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  if (user) {
    return <Redirect href="/" />;
  }

  if (!isFirebaseConfigured) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>CRUSADER</Text>
        <HudPanel style={styles.notConfiguredCard}>
          <Text style={styles.notConfiguredTitle}>Firebase isn't configured yet</Text>
          <Text style={styles.notConfiguredText}>
            Add your Firebase project's config to a .env file at the project root (see .env.example for the
            required keys) and restart the app to enable sign-in.
          </Text>
        </HudPanel>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRUSADER</Text>
      <Text style={styles.subtitle}>{mode === 'signIn' ? 'Sign in to continue' : 'Create your account'}</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <HudTextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.inputSpacing}
      />
      <HudTextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={styles.inputSpacing}
      />

      <HudButton
        title={mode === 'signIn' ? 'Sign in' : 'Sign up'}
        onPress={handleSubmit}
        disabled={!email || !password}
        loading={submitting}
      />

      <HudButton
        title="Continue with Google"
        onPress={() => promptGoogleSignIn()}
        disabled={!googleRequest || !googleWebClientId || submitting}
        variant="secondary"
      />
      {!googleWebClientId && (
        <Text style={styles.googleHint}>Set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID to enable Google sign-in.</Text>
      )}

      <Pressable onPress={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')} style={styles.switchModeButton}>
        <Text style={styles.switchModeText}>
          {mode === 'signIn' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: Colors.bg,
  },
  title: {
    fontFamily: OrbitronFonts.bold,
    fontSize: 28,
    letterSpacing: 4,
    textAlign: 'center',
    marginBottom: 6,
    color: Colors.gold,
    textShadowColor: Colors.gold,
    textShadowRadius: 16,
    textShadowOffset: { width: 0, height: 0 },
  },
  subtitle: {
    fontFamily: InterFonts.regular,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    color: Colors.inkSoft,
  },
  error: {
    fontFamily: InterFonts.medium,
    color: Colors.danger,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
  },
  inputSpacing: {
    marginBottom: 12,
  },
  googleHint: {
    fontFamily: InterFonts.regular,
    fontSize: 11,
    color: Colors.inkDim,
    textAlign: 'center',
    marginTop: 6,
  },
  switchModeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchModeText: {
    fontFamily: InterFonts.regular,
    fontSize: 13,
    color: Colors.inkSoft,
  },
  notConfiguredCard: {
    padding: 18,
  },
  notConfiguredTitle: {
    fontFamily: OrbitronFonts.medium,
    fontSize: 14,
    marginBottom: 8,
    color: Colors.ink,
  },
  notConfiguredText: {
    fontFamily: InterFonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: Colors.inkSoft,
  },
});
