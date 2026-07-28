import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// ============================================================
// ЦВЕТА ДЛЯ СВЕТЛОЙ И ТЁМНОЙ ТЕМЫ
// ============================================================
export const lightColors = {
  primary: '#007AFF',        // ← СИНИЙ для светлой темы
  primaryDark: '#0055CC',
  background: '#F5F5F5',
  card: '#FFFFFF',
  text: '#111111',
  textSecondary: '#666666',
  textLight: '#999999',
  textEmpty: '#666666',
  border: '#E0E0E0',
  error: '#D32F2F',
  success: '#34A853',
  shadow: '#000',
};

export const darkColors = {
  primary: '#7B61FF',        // ← ФИОЛЕТОВЫЙ для тёмной темы
  primaryDark: '#5A3FD6',
  background: '#121212',
  card: '#1E1E1E',
  text: '#F5F5F5',
  textSecondary: '#CCCCCC',
  textLight: '#888888',
  textEmpty: '#EEEEEE',
  border: '#333333',
  error: '#EF5350',
  success: '#66BB6A',
  shadow: '#000',
};

// ============================================================
// ТЕКУЩАЯ ТЕМА
// ============================================================
export let colors = { ...lightColors };

export const setTheme = (theme) => {
  colors = theme === 'dark' ? { ...darkColors } : { ...lightColors };
};

// ============================================================
// ОТСТУПЫ
// ============================================================
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// ============================================================
// ШРИФТЫ
// ============================================================
export const typography = {
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 22,
  },
  cardExcerpt: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  body: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  small: {
    fontSize: 12,
    color: colors.textLight,
  },
};

// ============================================================
// ТЕНИ
// ============================================================
export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardDark: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
};

// ============================================================
// ГЛОБАЛЬНЫЕ СТИЛИ
// ============================================================
export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  list: {
    
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: 'center',
  },
});

// ============================================================
// ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ СТИЛЕЙ ПРИ СМЕНЕ ТЕМЫ
// ============================================================
export const getThemedStyles = (theme) => {
  const isDark = theme === 'dark';
  const currentColors = isDark ? darkColors : lightColors;
  
  return {
    container: {
      flex: 1,
      backgroundColor: currentColors.background,
    },
    card: {
      backgroundColor: currentColors.card,
      borderRadius: 14,
      overflow: 'hidden',
      marginBottom: spacing.lg,
      shadowColor: currentColors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    text: {
      color: currentColors.text,
    },
    textSecondary: {
      color: currentColors.textSecondary,
    },
  };
};