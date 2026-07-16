// ============================================================
// КОНСТАНТЫ ПРОЕКТА
// ============================================================

export const BASE_URL = 'https://admprom.ru';

export const RSS_URL = `${BASE_URL}/news/feed/`;

export const MAX_NEWS = 15;

export const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/600x300/cccccc/ffffff?text=Новость';

// Стоп-слова для фильтрации новостей
export const STOP_WORDS = [
  'постановление',
  'решение',
  'документ',
  'pdf',
  'doc',
  'xls',
  'скачать',
  'распоряжение',
  'извещение',
  'отчет',
  'протокол',
  'тест',
  '№',
  'заявление',
];

export const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';