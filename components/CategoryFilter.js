import React, { useRef } from 'react';
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
  const scrollViewRef = useRef(null);
  const scrollPosition = useRef(0);

  const handleScroll = (event) => {
    scrollPosition.current = event.nativeEvent.contentOffset.x;
  };

  React.useEffect(() => {
    if (scrollViewRef.current && scrollPosition.current > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: scrollPosition.current,
          animated: false,
        });
      }, 50);
    }
  }, [theme]);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="always"
        onScroll={handleScroll}
        scrollEventThrottle={16}
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
              activeOpacity={0.7}
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
    </View>
  );
}

const getStyles = (isDark) => StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
    zIndex: 10,
  },
  container: {
    flexGrow: 0,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    gap: spacing.sm,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // ✅ ФОН ОВАЛА — ЗАМЕТНЫЙ
    backgroundColor: isDark ? '#2C2C2C' : '#E8E8E8',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: spacing.sm,
    minHeight: 40,
    borderWidth: 1.5,
    borderColor: isDark ? '#444444' : '#D0D0D0',
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryIcon: {
    fontSize: 15,
    marginRight: 6,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: isDark ? '#AAAAAA' : '#555555',
  },
  categoryLabelActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});