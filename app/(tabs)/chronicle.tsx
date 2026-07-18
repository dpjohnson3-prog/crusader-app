import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';

import { Text, useThemeColor, View } from '@/components/Themed';
import { useGameState } from '@/context/GameState';
import { todaysReflectionPrompt } from '@/lib/reflectionPrompts';

export default function ChronicleScreen() {
  const { journalEntries, addJournalEntry } = useGameState();
  const [draft, setDraft] = useState('');
  const prompt = todaysReflectionPrompt();
  const textColor = useThemeColor({}, 'text');

  const handleSave = () => {
    if (!draft.trim()) return;
    addJournalEntry(draft);
    setDraft('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Chronicle</Text>

      <View style={styles.promptCard}>
        <Text style={styles.promptText}>{prompt}</Text>
      </View>

      <TextInput
        value={draft}
        onChangeText={setDraft}
        placeholder="Write a few honest sentences..."
        placeholderTextColor="rgba(128,128,128,0.7)"
        multiline
        style={[styles.input, { color: textColor }]}
      />
      <Pressable
        onPress={handleSave}
        disabled={!draft.trim()}
        style={[styles.saveButton, !draft.trim() && styles.saveButtonDisabled]}>
        <Text style={styles.saveButtonText}>Save entry</Text>
      </Pressable>

      <Text style={styles.sectionLabel}>Past entries</Text>
      {journalEntries.length === 0 ? (
        <Text style={styles.emptyText}>No entries yet.</Text>
      ) : (
        journalEntries.map((entry) => (
          <View key={entry.id} style={styles.entry}>
            <Text style={styles.entryDate}>{entry.date}</Text>
            <Text style={styles.entryText}>{entry.text}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  promptCard: {
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },
  promptText: {
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.3)',
    borderRadius: 10,
    padding: 12,
    minHeight: 100,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  saveButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#2E3440',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginTop: 10,
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.6,
    marginTop: 28,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 13,
    opacity: 0.6,
  },
  entry: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128,128,128,0.2)',
  },
  entryDate: {
    fontSize: 11,
    opacity: 0.6,
    marginBottom: 4,
  },
  entryText: {
    fontSize: 13,
    lineHeight: 19,
  },
});
