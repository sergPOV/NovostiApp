import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const colors = {
  primary: '#007AFF',
  primaryDark: '#0055CC',
  background: '#F5F5F5',
  white: '#FFFFFF',
  black: '#111111',
  gray: '#666666',
  lightGray: '#888888',
  border: '#E0E0E0',
  error: '#D32F2F',
  success: '#34A853',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const typography = {
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.black,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
    lineHeight: 22,
  },
  cardExcerpt: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
  },
  body: {
    fontSize: 14,
    color: colors.gray,
  },
  small: {
    fontSize: 12,
    color: colors.lightGray,
  },
};

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHover: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};

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
    backgroundColor: colors.white,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  list: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: 'center',
  },
});