// ============================================================
// ВАЛИДАТОРЫ
// ============================================================

import { STOP_WORDS } from '../constans';

/**
 * Проверяет, является ли публикация новостью (не документом)
 */
export const isRealNews = (title = '', excerpt = '') => {
  const text = `${title} ${excerpt}`.toLowerCase();
  return !STOP_WORDS.some((word) => text.includes(word.toLowerCase()));
};

/**
 * Проверяет, является ли строка валидным URL
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Проверяет, является ли дата валидной и не старше указанного количества дней
 */
export const isRecent = (dateString, maxDays = 60) => {
  if (!dateString) return false;
  const d = new Date(dateString);
  if (isNaN(d)) return false;
  const diffDays = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= maxDays;
};