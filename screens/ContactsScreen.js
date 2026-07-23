import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { colors, spacing } from '../styles/styles';

export default function ContactsScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const styles = getStyles(isDark);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Администрация Промышленновского муниципального округа</Text>

        <Text style={styles.label}>📍 Адрес:</Text>
        <Text style={styles.text}>
          652380, Кемеровская область - Кузбасс,{'\n'}
          пгт. Промышленная, ул. Коммунистическая, д. 23 к. А
        </Text>

        <Text style={styles.label}>🌐 Официальный сайт:</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://admprom.ru')}>
          <Text style={styles.link}>admprom.ru</Text>
        </TouchableOpacity>

        <Text style={styles.label}>📞 Горячая линия по вопросам пожарной безопасности:</Text>
        <TouchableOpacity onPress={() => Linking.openURL('tel:83844274390')}>
          <Text style={styles.phone}>8 (384-42) 7-43-90 (основной)</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('tel:83844271087')}>
          <Text style={styles.phone}>8 (384-42) 7-10-87 (дополнительный)</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('tel:89617310505')}>
          <Text style={styles.phone}>8-961-731-05-05 (мобильный)</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.label}>📧 Электронная почта:</Text>
        <Text style={styles.text}>admin@admprom.ru</Text>

        <Text style={styles.label}>🕐 Режим работы:</Text>
        <Text style={styles.text}>Пн–Пт: 8:00 – 17:00</Text>
        <Text style={styles.text}>Обед: 12:00 – 13:00</Text>
      </View>
    </ScrollView>
  );
}

const getStyles = (isDark) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#121212' : '#F5F5F5',
  },
  card: {
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 12,
    margin: spacing.lg,
    padding: spacing.xl,
    shadowColor: isDark ? '#000' : '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#F5F5F5' : '#111111',
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: isDark ? '#AAAAAA' : '#333333',
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  text: {
    fontSize: 14,
    color: isDark ? '#CCCCCC' : '#555555',
    lineHeight: 20,
  },
  link: {
    fontSize: 14,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  phone: {
    fontSize: 14,
    color: colors.primary,
    paddingVertical: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: isDark ? '#333333' : '#E0E0E0',
    marginVertical: spacing.lg,
  },
});