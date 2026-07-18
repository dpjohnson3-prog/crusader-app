import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { HudButton } from '@/components/HudButton';
import { HudPanel } from '@/components/HudPanel';
import { HudTextInput } from '@/components/HudTextInput';
import { Colors, FrauncesFonts, InterFonts, OrbitronFonts, PlexMonoFonts } from '@/constants/theme';
import { useGameState } from '@/context/GameState';
import { todaysReflectionPrompt } from '@/lib/reflectionPrompts';

export default function ChronicleScreen() {
  const { journalEntries, addJournalEntry } = useGameState();
  const [draft, setDraft] = useState('');
  const prompt = todaysReflectionPrompt();

  const handleSave = () => {
    if (!draft.trim()) return;
    addJournalEntry(draft);
    setDraft('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>CHRONICLE</Text>

      <HudPanel style={styles.promptCard}>
        <Text style={styles.promptText}>{prompt}</Text>
      </HudPanel>

      <HudTextInput
        value={draft}
        onChangeText={setDraft}
        placeholder="Write a few honest sentences..."
        multiline
        style={styles.input}
      />
      <HudButton title="Save entry" onPress={handleSave} disabled={!draft.trim()} style={styles.saveButton} />

      <Text style={styles.sectionLabel}>PAST ENTRIES</Text>
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
    backgroundColor: Colors.bg,
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontFamily: OrbitronFonts.bold,
    fontSize: 22,
    letterSpacing: 2,
    color: Colors.ink,
    marginBottom: 16,
  },
  promptCard: {
    padding: 16,
    marginBottom: 14,
  },
  promptText: {
    fontFamily: FrauncesFonts.mediumItalic,
    fontSize: 16,
    lineHeight: 23,
    color: Colors.gold,
  },
  input: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  sectionLabel: {
    fontFamily: PlexMonoFonts.semiBold,
    fontSize: 12,
    letterSpacing: 1,
    color: Colors.inkDim,
    marginTop: 28,
    marginBottom: 10,
  },
  emptyText: {
    fontFamily: InterFonts.regular,
    fontSize: 13,
    color: Colors.inkSoft,
  },
  entry: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  entryDate: {
    fontFamily: PlexMonoFonts.medium,
    fontSize: 11,
    color: Colors.inkDim,
    marginBottom: 4,
  },
  entryText: {
    fontFamily: InterFonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: Colors.ink,
  },
});
