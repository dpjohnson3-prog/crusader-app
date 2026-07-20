import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

// TEMPORARY diagnostic screen for the iOS "keyboard opens then immediately
// closes" bug reported on the real login screen (see git history for the
// investigation). Not linked from any in-app navigation — reach it directly
// by its route path (Expo Go's "Enter URL manually" screen, pointed at this
// dev server, with /keyboard-test appended). Delete once root-caused.
//
// Section A isolates whether ANY TextInput on a freshly-pushed screen in
// this app/Stack is affected, stripped of all of login.tsx's styling,
// hooks, and complexity. Section B reproduces login.tsx's original
// unconfigured email+password shape (no textContentType/autoComplete) to
// test whether iOS's password-manager form heuristics are the trigger.
// If A fails too, the cause is screen/Stack/Fabric-wide, not specific to
// login.tsx or to autofill. If only B fails, that points at autofill.
export default function KeyboardTestScreen() {
  const [plainValue, setPlainValue] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Section A — single plain input</Text>
      <Text style={styles.hint}>
        Tap below and try typing. No styling, no autofill hints, nothing else on screen.
      </Text>
      <TextInput value={plainValue} onChangeText={setPlainValue} placeholder="Type here" style={styles.input} />
      <Text style={styles.result}>Current value: {plainValue || '(empty)'}</Text>

      <View style={styles.divider} />

      <Text style={styles.heading}>Section B — email + password pair</Text>
      <Text style={styles.hint}>
        Same shape as the original login form: a plain text field followed by a secureTextEntry
        field, deliberately with no textContentType/autoComplete set.
      </Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry style={styles.input} />
      <Text style={styles.result}>Email value: {email || '(empty)'}</Text>
      <Text style={styles.result}>Password value: {password ? '*'.repeat(password.length) : '(empty)'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 4,
  },
  hint: {
    fontSize: 12,
    color: '#555555',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
    fontSize: 15,
    color: '#111111',
  },
  result: {
    fontSize: 13,
    color: '#333333',
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#cccccc',
    marginVertical: 24,
  },
});
