import { cleanText, makeAbsoluteUrl } from '../utils/helpers';

const BASE = 'https://admprom.ru';

// ============================================================
// ПАРСИНГ RSS — получаем ТОЛЬКО СПИСОК ССЫЛОК
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
    
    if (link) {
      links.push({
        url: link,
        date: date || new Date().toISOString(),
      });
    }
  }
  
  return links;
};

// ============================================================
// ЗАГРУЗКА СТРАНИЦЫ НОВОСТИ
// ============================================================
const fetchNewsDetails = async (url) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
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
    
    // --- ОПИСАНИЕ ---
    let excerpt = '';
    
    const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    if (articleMatch) {
      let articleText = cleanText(articleMatch[1]);
      
      if (title && articleText.startsWith(title)) {
        articleText = articleText.slice(title.length).trim();
      }
      
      excerpt = articleText.slice(0, 200);
      if (articleText.length > 200) {
        excerpt += '...';
      }
    }
    
    if (!excerpt) {
      const entryMatch = html.match(/<div[^>]*class="[^"]*(?:entry-content|post-content)[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
      if (entryMatch) {
        let entryText = cleanText(entryMatch[1]);
        
        if (title && entryText.startsWith(title)) {
          entryText = entryText.slice(title.length).trim();
        }
        
        excerpt = entryText.slice(0, 200);
        if (entryText.length > 200) {
          excerpt += '...';
        }
      }
    }
    
    if (!title && excerpt) {
      const firstSentence = excerpt.match(/^([^.!?]*[.!?])/);
      if (firstSentence) {
        title = firstSentence[1].trim();
        if (title.length > 80) {
          title = title.slice(0, 80) + '...';
        }
      }
    }
    
    if (!title) {
      title = 'Новость';
    }
    
    if (!excerpt) {
      excerpt = 'Нажмите для чтения';
    }
    
    if (!poster) {
      poster = `https://via.placeholder.com/600x300/007AFF/FFFFFF?text=${encodeURIComponent(title.slice(0, 20))}`;
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
// ⚡ ОСНОВНАЯ ФУНКЦИЯ ЗАГРУЗКИ (ПАРАЛЛЕЛЬНАЯ)
// ============================================================
export const loadNews = async () => {
  console.log('📡 Загружаем RSS-ленту новостей...');
  
  try {
    const response = await fetch('https://admprom.ru/news/feed/', {
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    
    const rssText = await response.text();
    console.log(`📄 RSS загружен, длина: ${rssText.length} символов`);
    
    const links = parseRSSLinks(rssText);
    console.log(`📰 Найдено ${links.length} ссылок в RSS`);
    
    const sortedLinks = links.sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      return dateB - dateA;
    });
    
    const topLinks = sortedLinks.slice(0, 15);
    
    console.log(`⏳ Загружаем ${topLinks.length} новостей параллельно...`);
    
    const newsItems = await Promise.all(
      topLinks.map(async (link) => {
        return await fetchNewsDetails(link.url);
      })
    );
    
    const validNews = newsItems.filter(item => item !== null);
    
    console.log(`✅ Загружено ${validNews.length} новостей`);
    return validNews;
    
  } catch (err) {
    console.error('❌ Ошибка загрузки:', err);
    throw err;
  }
};