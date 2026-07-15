// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================

const BASE = 'https://admprom.ru';

export const cleanText = (text = '') => {
  return text
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8230;/g, '...')
    .replace(/&nbsp;/g, ' ')
    .trim();
};

export const makeAbsoluteUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/')) return `${BASE}${url}`;
  return `${BASE}/${url}`;
};

export const isRealNews = (title = '') => {
  const stopWords = [
    'постановление', 'решение', 'документ', 'pdf', 'doc',
    'xls', 'скачать', 'распоряжение', 'извещение', 'отчет',
    'протокол', 'тест', '№', 'заявление',
  ];
  const text = title.toLowerCase();
  return !stopWords.some((word) => text.includes(word));
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date)) return '';
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};