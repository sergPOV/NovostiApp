import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { colors, spacing, shadows, typography } from '../styles/styles';

export default function NewsCard({ item, onPress }) {
  const hasImage = !!item.poster;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={`Открыть новость: ${item.title}`}
    >
      {hasImage ? (
        <Image
          source={{ uri: item.poster }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}

      <View style={styles.content}>
        <Text numberOfLines={3} style={styles.title}>
          {item.title}
        </Text>

        {item.excerpt ? (
          <Text numberOfLines={3} style={styles.excerpt}>
            {item.excerpt}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
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
  image: {
    width: '100%',
    height: 190,
    backgroundColor: '#e5e5e5',
  },
  imagePlaceholder: {
    width: '100%',
    height: 190,
    backgroundColor: '#e5e5e5',
  },
  content: {
    padding: spacing.md,
  },
  title: {
    ...typography.cardTitle,
  },
  excerpt: {
    ...typography.cardExcerpt,
    marginTop: spacing.sm,
  },
});