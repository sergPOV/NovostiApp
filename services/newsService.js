import { BASE_URL, RSS_URL, MAX_NEWS, PLACEHOLDER_IMAGE, USER_AGENT } from '../constans/index';
import { cleanText, truncate } from '../utils/text';
import { makeAbsoluteUrl, extractDateFromUrl, isInternalNewsLink } from '../utils/url';
import { isRealNews } from '../utils/validators';

// ============================================================
// 1. ПАРСИНГ RSS — получаем список ссылок с заголовками
// ============================================================
const parseRSSLinks = (rssText) => {
  const links = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(rssText)) !== null) {
    const content = match[1];

    const linkMatch = content.match(/<link>([^<]*)<\/link>/);
    const link = linkMatch ? linkMatch[1].trim() : '';

    const titleMatch = content.match(/<title>([^<]*)<\/title>/);
    let title = titleMatch ? titleMatch[1].trim() : '';

    if (!title) {
      const descMatch = content.match(/<description>([\s\S]*?)<\/description>/);
      if (descMatch) {
        const rawDesc = descMatch[1].replace(/<[^>]*>/g, ' ').trim();
        const firstSentence = rawDesc.match(/^([^.!?]*[.!?])/);
        if (firstSentence) {
          title = firstSentence[1].trim();
          if (title.length > 80) {
            title = title.slice(0, 80) + '...';
          }
        }
      }
    }

    const pubDateMatch = content.match(/<pubDate>([^<]*)<\/pubDate>/);
    let date = null;
    if (pubDateMatch) {
      const d = new Date(pubDateMatch[1]);
      if (!isNaN(d)) date = d.toISOString();
    }

    if (link && isInternalNewsLink(link)) {
      links.push({
        url: link,
        title: title || 'Новость',
        date: date || extractDateFromUrl(link) || new Date().toISOString(),
      });
    }
  }

  return links;
};

// ============================================================
// 2. ЗАГРУЗКА СТРАНИЦЫ НОВОСТИ (ПОЛНЫЕ ДЕТАЛИ)
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

    let poster = null;

    let match = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i);
    if (match) {
      poster = makeAbsoluteUrl(match[1]);
    }

    if (!poster) {
      match = html.match(/<meta[^>]+name="twitter:image"[^>]+content="([^"]+)"/i);
      if (match) {
        poster = makeAbsoluteUrl(match[1]);
      }
    }

    if (!poster) {
      match = html.match(/<article[\s\S]*?<img[^>]+src="([^"]+)"/i);
      if (match) {
        poster = makeAbsoluteUrl(match[1]);
      }
    }

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

    let excerpt = '';

    const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    if (articleMatch) {
      let articleText = cleanText(articleMatch[1]);
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
// 3. БЫСТРАЯ ЗАГРУЗКА — только RSS (без HTML)
// ============================================================
export const loadNewsFast = async () => {
  try {
    const response = await fetch(RSS_URL, {
      headers: { 'Accept': 'application/rss+xml, application/xml, text/xml, */*' },
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const rssText = await response.text();
    const links = parseRSSLinks(rssText);

    const sortedLinks = links.sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      return dateB - dateA;
    });

    const topLinks = sortedLinks.slice(0, MAX_NEWS);

    return topLinks.map((link) => ({
      id: link.url,
      title: link.title || 'Новость',
      excerpt: 'Загрузка описания...',
      poster: PLACEHOLDER_IMAGE,
      url: link.url,
      isLoading: true,
    }));

  } catch (err) {
    console.error('Ошибка быстрой загрузки:', err);
    throw err;
  }
};

// ============================================================
// 4. ДОЗАГРУЗКА ДЕТАЛЕЙ ДЛЯ ОДНОЙ НОВОСТИ
// ============================================================
export const loadNewsDetails = async (newsItem) => {
  if (!newsItem.isLoading) return newsItem;

  const detail = await fetchNewsDetails(newsItem.url);
  if (detail) {
    return {
      ...detail,
      isLoading: false,
    };
  }
  return {
    ...newsItem,
    isLoading: false,
    excerpt: 'Описание недоступно',
  };
};

// ============================================================
// 5. ОСНОВНАЯ ФУНКЦИЯ — ПОЛНАЯ ЗАГРУЗКА (для совместимости)
// ============================================================
export const loadNews = async () => {
  try {
    const fastData = await loadNewsFast();
    
    // Дозагружаем детали для всех новостей
    const detailedNews = [];
    for (let i = 0; i < fastData.length; i++) {
      const detailed = await loadNewsDetails(fastData[i]);
      detailedNews.push(detailed);
    }
    
    return detailedNews;

  } catch (err) {
    console.error('Ошибка загрузки новостей:', err);
    throw err;
  }
};