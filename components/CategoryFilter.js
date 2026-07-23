import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getAllCategories } from '../utils/validators';
import { colors, spacing } from '../styles/styles';

export default function CategoryFilter({ selectedCategory, onSelectCategory }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const styles = getStyles(isDark);
  const categories = getAllCategories();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {categories.map((category) => {
        const isActive = selectedCategory === category.key;
        return (
          <TouchableOpacity
            key={category.key}
            onPress={() => onSelectCategory(category.key)}
            style={[
              styles.categoryButton,
              isActive && styles.categoryButtonActive,
            ]}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text
              style={[
                styles.categoryLabel,
                isActive && styles.categoryLabelActive,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const getStyles = (isDark) => StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#2A2A2A' : '#F0F0F0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: spacing.sm,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  categoryLabel: {
    fontSize: 13,
    color: isDark ? '#CCCCCC' : '#666666',
  },
  categoryLabelActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});