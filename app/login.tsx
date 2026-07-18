import * as Google from 'expo-auth-session/providers/google';
import { Redirect } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput } from 'react-native';

import { Text, useThemeColor, View } from '@/components/Themed';
import { useAuth } from '@/context/Auth';

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
  const textColor = useThemeColor({}, 'text');

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
        <Text style={styles.title}>Crusader</Text>
        <View style={styles.notConfiguredCard}>
          <Text style={styles.notConfiguredTitle}>Firebase isn't configured yet</Text>
          <Text style={styles.notConfiguredText}>
            Add your Firebase project's config to a .env file at the project root (see .env.example for the
            required keys) and restart the app to enable sign-in.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crusader</Text>
      <Text style={styles.subtitle}>{mode === 'signIn' ? 'Sign in to continue' : 'Create your account'}</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="rgba(128,128,128,0.7)"
        autoCapitalize="none"
        keyboardType="email-address"
        style={[styles.input, { color: textColor }]}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor="rgba(128,128,128,0.7)"
        secureTextEntry
        style={[styles.input, { color: textColor }]}
      />

      <Pressable
        onPress={handleSubmit}
        disabled={submitting || !email || !password}
        style={[styles.primaryButton, (submitting || !email || !password) && styles.buttonDisabled]}>
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>{mode === 'signIn' ? 'Sign in' : 'Sign up'}</Text>
        )}
      </Pressable>

      <Pressable
        onPress={() => promptGoogleSignIn()}
        disabled={!googleRequest || !googleWebClientId || submitting}
        style={[
          styles.googleButton,
          (!googleRequest || !googleWebClientId || submitting) && styles.buttonDisabled,
        ]}>
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </Pressable>
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
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 24,
  },
  error: {
    color: '#D14343',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.3)',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#2E3440',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  googleButton: {
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.4)',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 12,
  },
  googleButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  googleHint: {
    fontSize: 11,
    opacity: 0.5,
    textAlign: 'center',
    marginTop: 6,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  switchModeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchModeText: {
    fontSize: 13,
    opacity: 0.7,
  },
  notConfiguredCard: {
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.3)',
    borderRadius: 12,
    padding: 18,
  },
  notConfiguredTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  notConfiguredText: {
    fontSize: 13,
    opacity: 0.7,
    lineHeight: 19,
  },
});
