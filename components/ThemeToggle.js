import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../styles/styles';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <TouchableOpacity onPress={toggleTheme} style={styles.button}>
      <Ionicons
        name={isDark ? 'sunny' : 'moon'}
        size={24}
        color={isDark ? '#FFD700' : '#fff'}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    marginRight: 8,
  },
});