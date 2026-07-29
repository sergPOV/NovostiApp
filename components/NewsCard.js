import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getCategoryInfo } from '../utils/validators';
import { spacing } from '../styles/styles';

const { width } = Dimensions.get('window');
const cardWidth = width - 32;

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date)) return '';
  
  const today = new Date();
  const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Сегодня';
  if (diffDays === 1) return 'Вчера';
  if (diffDays < 7) return `${diffDays} дня назад`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} недель назад`;
  
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export default function NewsCard({ item, onPress }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const styles = getStyles(isDark);
  
  const category = getCategoryInfo(item.title, item.excerpt);
  const dateText = formatDate(item.date || item.pubDate);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.poster }} style={styles.image} />
        <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
          <Text style={styles.categoryText}>
            {category.icon} {category.label}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.excerpt} numberOfLines={2}>
          {item.excerpt || 'Нажмите для чтения'}
        </Text>
        <Text style={styles.dateText}>{dateText}</Text>
      </View>
    </TouchableOpacity>
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
    shadowColor: isDark ? '#000' : '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.3 : 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: isDark ? 1 : 0,
    borderColor: isDark ? '#2A2A2A' : 'transparent',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    backgroundColor: isDark ? '#2A2A2A' : '#e5e5e5',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    opacity: 0.9,
  },
  categoryText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  content: {
    padding: spacing.md,
  },
  title: {
    fontSize: 17,
    fontWeight: '600', // ← БЫЛО '700', СТАЛО '600' (менее жирный)
    color: isDark ? '#F5F5F5' : '#111111',
    lineHeight: 24,
    marginBottom: 6,
  },
  excerpt: {
    fontSize: 14,
    color: isDark ? '#AAAAAA' : '#666666',
    lineHeight: 20,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    color: isDark ? '#888888' : '#999999',
    marginTop: 2,
  },
});