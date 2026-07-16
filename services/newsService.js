// ============================================================
// СЕРВИС ДЛЯ ЗАГРУЗКИ НОВОСТЕЙ
// ============================================================

import { BASE_URL, RSS_URL, MAX_NEWS, PLACEHOLDER_IMAGE, USER_AGENT } from '../constans/index';
import { cleanText, truncate } from '../utils/text';
import { makeAbsoluteUrl, extractDateFromUrl, isInternalNewsLink } from '../utils/url';
import { isRealNews } from '../utils/validators';

// ============================================================
// 1. ПАРСИНГ RSS — получаем список ссылок
// ============================================================
const parseRSSLinks = (rssText) => {
  const links = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(rssText)) !== null) {
    const content = match[1];

    const linkMatch = content.match(/<link>([^<]*)<\/link>/);
    const link = linkMatch ? linkMatch[1].trim() : '';

    const pubDateMatch = content.match(/<pubDate>([^<]*)<\/pubDate>/);
    let date = null;
    if (pubDateMatch) {
      const d = new Date(pubDateMatch[1]);
      if (!isNaN(d)) date = d.toISOString();
    }

    if (link && isInternalNewsLink(link)) {
      links.push({
        url: link,
        date: date || extractDateFromUrl(link) || new Date().toISOString(),
      });
    }
  }

  return links;
};

// ============================================================
// 2. ЗАГРУЗКА СТРАНИЦЫ НОВОСТИ
// ============================================================
const fetchNewsDetails = async (url) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml',
        'User-Agent': USER_AGENT,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    // --- ЗАГОЛОВОК ---
    let title = '';
    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1Match) {
      title = cleanText(h1Match[1]);
    }

    if (!title) {
      const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
      if (titleMatch) {
        title = cleanText(titleMatch[1]).replace(/\s*[-|].*$/, '');
      }
    }

    // --- КАРТИНКА ---
    let poster = null;

    // 1. og:image
    let match = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i);
    if (match) {
      poster = makeAbsoluteUrl(match[1]);
    }

    // 2. twitter:image
    if (!poster) {
      match = html.match(/<meta[^>]+name="twitter:image"[^>]+content="([^"]+)"/i);
      if (match) {
        poster = makeAbsoluteUrl(match[1]);
      }
    }

    // 3. Первая картинка в статье
    if (!poster) {
      match = html.match(/<article[\s\S]*?<img[^>]+src="([^"]+)"/i);
      if (match) {
        poster = makeAbsoluteUrl(match[1]);
      }
    }

    // 4. Любая картинка (кроме логотипов)
    if (!poster) {
      const imgRegex = /<img[^>]+src="([^"]+)"/gi;
      let imgMatch;
      while ((imgMatch = imgRegex.exec(html)) !== null) {
        const imgUrl = imgMatch[1];
        if (!/logo|icon|avatar|sprite|wp-content\/themes/i.test(imgUrl)) {
          poster = makeAbsoluteUrl(imgUrl);
          break;
        }
      }
    }

    // --- ОПИСАНИЕ (чистый текст, без заголовка) ---
    let excerpt = '';

    const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    if (articleMatch) {
      let articleText = cleanText(articleMatch[1]);
      // Удаляем заголовок из начала описания, если он там есть
      if (title && articleText.startsWith(title)) {
        articleText = articleText.slice(title.length).trim();
      }
      excerpt = truncate(articleText, 200);
    }

    if (!excerpt) {
      const entryMatch = html.match(/<div[^>]*class="[^"]*(?:entry-content|post-content)[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
      if (entryMatch) {
        let entryText = cleanText(entryMatch[1]);
        if (title && entryText.startsWith(title)) {
          entryText = entryText.slice(title.length).trim();
        }
        excerpt = truncate(entryText, 200);
      }
    }

    // --- Заглушки ---
    if (!title) {
      title = 'Новость';
    }

    if (!excerpt) {
      excerpt = 'Нажмите для чтения';
    }

    if (!poster) {
      poster = PLACEHOLDER_IMAGE;
    }

    return {
      id: url,
      title: title,
      excerpt: excerpt,
      poster: poster,
      url: url,
    };

  } catch (err) {
    console.error(`Ошибка загрузки ${url}:`, err);
    return null;
  }
};

// ============================================================
// 3. ОСНОВНАЯ ФУНКЦИЯ — ЗАГРУЗКА ВСЕХ НОВОСТЕЙ
// ============================================================
export const loadNews = async () => {
  try {
    // 1. Загружаем RSS
    const response = await fetch(RSS_URL, {
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const rssText = await response.text();

    // 2. Парсим ссылки
    const links = parseRSSLinks(rssText);

    // 3. Сортируем по дате (сначала свежие)
    const sortedLinks = links.sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      return dateB - dateA;
    });

    // 4. Берём только первые MAX_NEWS
    const topLinks = sortedLinks.slice(0, MAX_NEWS);

    // 5. Загружаем все новости параллельно
    const newsItems = await Promise.all(
      topLinks.map((link) => fetchNewsDetails(link.url))
    );

    // 6. Убираем null и фильтруем по стоп-словам
    const validNews = newsItems
      .filter((item) => item !== null)
      .filter((item) => isRealNews(item.title, item.excerpt));

    return validNews;

  } catch (err) {
    console.error('Ошибка загрузки новостей:', err);
    throw err;
  }
};