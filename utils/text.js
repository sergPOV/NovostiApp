// ============================================================
// РАБОТА С ТЕКСТОМ
// ============================================================

/**
 * Очищает текст от HTML-тегов и лишних пробелов
 */
export const cleanText = (text = '') => {
  if (!text) return '';
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

/**
 * Обрезает текст до указанной длины
 */
export const truncate = (text = '', maxLength = 200) => {
  if (!text) return '';
  const cleaned = cleanText(text);
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.slice(0, maxLength) + '...';
};

/**
 * Извлекает первое предложение из текста
 */
export const getFirstSentence = (text = '') => {
  if (!text) return '';
  const cleaned = cleanText(text);
  const match = cleaned.match(/^([^.!?]*[.!?])/);
  return match ? match[1].trim() : cleaned.slice(0, 80);
};