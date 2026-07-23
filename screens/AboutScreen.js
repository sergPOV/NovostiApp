import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { colors, spacing, shadows } from '../styles/styles';

export default function AboutScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const styles = getStyles(isDark);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📰 Новостная лента</Text>
      <Text style={styles.subtitle}>Промышленновского округа</Text>

      <View style={styles.card}>
        <Text style={styles.version}>Версия 1.0</Text>
        <Text style={styles.description}>
          Приложение показывает последние новости с официального сайта администрации
          Промышленновского муниципального округа в удобном мобильном формате.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>🔹 Источник новостей:</Text>
        <Text style={styles.source}>admprom.ru/news/feed/</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>🔹 Разработано для:</Text>
        <Text style={styles.source}>Практической работы</Text>
        <Text style={styles.source}>ПИм-251</Text>
        <Text style={styles.source}>Павлов С.С.</Text>
      </View>
    </View>
  );
}

const getStyles = (isDark) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#121212' : '#F5F5F5',
    padding: spacing.lg,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: isDark ? '#F5F5F5' : '#111111',
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  subtitle: {
    fontSize: 18,
    color: isDark ? '#AAAAAA' : '#666666',
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  card: {
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: isDark ? '#000' : '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  version: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 15,
    color: isDark ? '#CCCCCC' : '#444444',
    textAlign: 'center',
    lineHeight: 22,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#AAAAAA' : '#555555',
    marginBottom: spacing.xs,
  },
  source: {
    fontSize: 14,
    color: isDark ? '#CCCCCC' : '#333333',
  },
});