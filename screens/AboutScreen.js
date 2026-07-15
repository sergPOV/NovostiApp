import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography, shadows } from '../styles/styles';

export default function AboutScreen() {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.black,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  subtitle: {
    fontSize: 18,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.card,
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
    color: '#444',
    textAlign: 'center',
    lineHeight: 22,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: spacing.xs,
  },
  source: {
    fontSize: 14,
    color: '#333',
  },
});