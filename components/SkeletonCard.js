import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../styles/styles';

const { width } = Dimensions.get('window');
const cardWidth = width - 32;

export default function SkeletonCard() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const styles = getStyles(isDark);

  return (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.content}>
        <View style={styles.titlePlaceholder} />
        <View style={styles.titlePlaceholderShort} />
        <View style={styles.excerptPlaceholder} />
        <View style={styles.excerptPlaceholderShort} />
        <View style={styles.footerPlaceholder}>
          <View style={styles.datePlaceholder} />
        </View>
      </View>
    </View>
  );
}

const getStyles = (isDark) => StyleSheet.create({
  card: {
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    width: cardWidth,
    alignSelf: 'center',
    borderWidth: isDark ? 1 : 0,
    borderColor: isDark ? '#2A2A2A' : 'transparent',
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: isDark ? '#2A2A2A' : '#e5e5e5',
  },
  content: {
    padding: spacing.md,
  },
  titlePlaceholder: {
    height: 18,
    width: '85%',
    backgroundColor: isDark ? '#2A2A2A' : '#e5e5e5',
    borderRadius: 4,
    marginBottom: 6,
  },
  titlePlaceholderShort: {
    height: 18,
    width: '60%',
    backgroundColor: isDark ? '#2A2A2A' : '#e5e5e5',
    borderRadius: 4,
    marginBottom: 12,
  },
  excerptPlaceholder: {
    height: 14,
    width: '100%',
    backgroundColor: isDark ? '#2A2A2A' : '#e5e5e5',
    borderRadius: 4,
    marginBottom: 4,
  },
  excerptPlaceholderShort: {
    height: 14,
    width: '70%',
    backgroundColor: isDark ? '#2A2A2A' : '#e5e5e5',
    borderRadius: 4,
    marginBottom: 12,
  },
  footerPlaceholder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: isDark ? '#2A2A2A' : '#F0F0F0',
  },
  datePlaceholder: {
    height: 12,
    width: 60,
    backgroundColor: isDark ? '#2A2A2A' : '#e5e5e5',
    borderRadius: 4,
  },
});