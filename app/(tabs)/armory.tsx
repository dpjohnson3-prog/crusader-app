import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { HudPanel } from '@/components/HudPanel';
import { Colors, InterFonts, OrbitronFonts, PlexMonoFonts } from '@/constants/theme';
import { BOOK_CATEGORY_LABELS, booksByCategory, type BookCategory } from '@/lib/books';

// Gold ("sacred") for the classics, cyan ("system") for the discipline
// titles — matches the color roles from crusaderappspec.md's design system.
const CATEGORY_COLORS: Record<BookCategory, string> = {
  classic: Colors.gold,
  discipline: Colors.cyan,
};

const CATEGORIES: BookCategory[] = ['classic', 'discipline'];

export default function ArmoryScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>THE ARMORY</Text>
      <Text style={styles.subtitle}>A shelf of recommended reading — no purchase links, just the picks.</Text>

      {CATEGORIES.map((category) => {
        const color = CATEGORY_COLORS[category];
        return (
          <View key={category} style={styles.section}>
            <Text style={[styles.sectionLabel, { color }]}>{BOOK_CATEGORY_LABELS[category].toUpperCase()}</Text>
            {booksByCategory(category).map((book) => (
              <HudPanel key={book.id} borderColor={color} style={styles.bookCard}>
                <Text style={styles.bookTitle}>{book.title}</Text>
                <Text style={[styles.bookAuthor, { color }]}>{book.author}</Text>
                <Text style={styles.bookDescription}>{book.description}</Text>
              </HudPanel>
            ))}
          </View>
        );
      })}
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
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: InterFonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: Colors.inkSoft,
    marginBottom: 20,
  },
  section: {
    marginBottom: 8,
  },
  sectionLabel: {
    fontFamily: PlexMonoFonts.semiBold,
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 10,
  },
  bookCard: {
    padding: 16,
    marginBottom: 12,
  },
  bookTitle: {
    fontFamily: InterFonts.semiBold,
    fontSize: 15,
    color: Colors.ink,
  },
  bookAuthor: {
    fontFamily: PlexMonoFonts.medium,
    fontSize: 11,
    marginTop: 2,
    marginBottom: 8,
  },
  bookDescription: {
    fontFamily: InterFonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: Colors.inkSoft,
  },
});
