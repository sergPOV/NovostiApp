import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, shadows } from '../styles/styles';

export default function SkeletonCard() {
  return (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.content}>
        <View style={styles.titlePlaceholder} />
        <View style={styles.excerptPlaceholder} />
        <View style={styles.excerptPlaceholderShort} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  imagePlaceholder: {
    width: '100%',
    height: 190,
    backgroundColor: '#e5e5e5',
  },
  content: {
    padding: spacing.md,
  },
  titlePlaceholder: {
    height: 20,
    width: '80%',
    backgroundColor: '#e5e5e5',
    borderRadius: 4,
    marginBottom: spacing.sm,
  },
  excerptPlaceholder: {
    height: 14,
    width: '100%',
    backgroundColor: '#e5e5e5',
    borderRadius: 4,
    marginBottom: spacing.xs,
  },
  excerptPlaceholderShort: {
    height: 14,
    width: '60%',
    backgroundColor: '#e5e5e5',
    borderRadius: 4,
  },
});