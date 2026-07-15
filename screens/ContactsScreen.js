import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { colors, spacing, typography, shadows } from '../styles/styles';

export default function ContactsScreen() {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    margin: spacing.lg,
    padding: spacing.xl,
    ...shadows.card,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  text: {
    fontSize: 14,
    color: '#555',
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
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
});