// ============================================================
// РАБОТА С URL
// ============================================================

import { BASE_URL } from '../constans';

/**
 * Преобразует относительный URL в абсолютный
 */
export const makeAbsoluteUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/')) return `${BASE_URL}${url}`;
  return `${BASE_URL}/${url}`;
};

/**
 * Извлекает дату из URL новости (формат /2024/12/25/)
 */
export const extractDateFromUrl = (url) => {
  if (!url) return null;
  const match = url.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);
  if (match) {
    const year = parseInt(match[1]);
    const month = parseInt(match[2]) - 1;
    const day = parseInt(match[3]);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      const d = new Date(year, month, day);
      if (!isNaN(d)) return d.toISOString();
    }
  }
  return null;
};

/**
 * Проверяет, является ли URL внутренней ссылкой (не пагинация, не категория)
 */
export const isInternalNewsLink = (url) => {
  if (!url) return false;
  return !/\/page\/|\/feed\/|\/tag\/|\/category\//i.test(url);
};