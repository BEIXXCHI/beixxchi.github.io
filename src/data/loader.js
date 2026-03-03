/**
 * loader.js
 * 自动加载 src/posts/ 目录下所有 .md 文件
 *
 * ─── 使用方式 ───────────────────────────────────────────────
 * 只需在 src/posts/ 目录下新建 .md 文件，格式如下：
 *
 *   ---
 *   id: 6
 *   title: 我的新文章
 *   excerpt: 摘要内容
 *   date: 2025-03-01
 *   category: 技术
 *   tag: Vue
 *   readTime: 5 分钟
 *   cover: https://...
 *   featured: false
 *   ---
 *
 *   正文 Markdown 内容...
 *
 * 保存后，Vite 热更新会自动刷新，文章立即出现在博客中。
 * ─────────────────────────────────────────────────────────────
 */

import { parseFrontmatter } from '../utils/parseFrontmatter';

// Vite glob import —— 自动扫描 src/posts/ 下所有 .md 文件
// { eager: true } 表示同步加载，无需 await
const mdModules = import.meta.glob('../posts/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

/**
 * 从 .md 文件批量解析并生成 posts 数组
 * 按日期降序排列
 */
function loadPostsFromMarkdown() {
  const loaded = [];

  for (const [filepath, rawContent] of Object.entries(mdModules)) {
    try {
      const { data, content } = parseFrontmatter(rawContent);

      // 必填字段校验
      if (!data.title || !data.date) {
        console.warn(`[Blog] 跳过缺少 title 或 date 的文件: ${filepath}`);
        continue;
      }

      // 自动生成 id（如果没有手动指定，用文件名哈希）
      const filename = filepath.split('/').pop().replace('.md', '');
      const id = data.id ?? filename;

      loaded.push({
        id,
        title: data.title,
        excerpt: data.excerpt ?? content.slice(0, 120).replace(/#+\s/g, '') + '...',
        date: String(data.date),
        category: data.category ?? '随笔',
        tag: data.tag ?? '',
        readTime: data.readTime ?? estimateReadTime(content),
        cover: data.cover ?? 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=900&q=80',
        featured: data.featured ?? false,
        content,
        // 保留原始文件名，方便调试
        _filename: filename,
      });
    } catch (err) {
      console.error(`[Blog] 解析文件出错: ${filepath}`, err);
    }
  }

  // 按日期降序排列
  return loaded.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * 根据字数估算阅读时长（中文约 300 字/分钟）
 */
function estimateReadTime(content) {
  const charCount = content.replace(/```[\s\S]*?```/g, '').length;
  const minutes = Math.max(1, Math.round(charCount / 300));
  return `${minutes} 分钟`;
}

// ── 导出 ──────────────────────────────────────────────────────

export const posts = loadPostsFromMarkdown();

export const SITE_CONFIG = {
  title: 'beixxchi 的博客',
  subtitle: '代码与文字之间，探索技术与人文的交汇地带。',
  author: 'beixxchi',
  email: 'hi@example.com',
  github: 'https://github.com',
  twitter: 'https://twitter.com',
  rss: '/rss.xml',
  avatar: '🧑‍💻',
  startYear: 2022,
};

export const CATEGORY_COLORS = {
  技术: '#f59e0b',
  生活: '#10b981',
  思考: '#8b5cf6',
  效率: '#3b82f6',
  随笔: '#ec4899',
};

export const getAllCategories = () => {
  const cats = [...new Set(posts.map(p => p.category))];
  return ['全部', ...cats];
};

export const getAllTags = () => {
  return [...new Set(posts.map(p => p.tag).filter(Boolean))];
};

export const getPostsByYear = () => {
  const map = {};
  posts.forEach(post => {
    const year = String(post.date).slice(0, 4);
    if (!map[year]) map[year] = [];
    map[year].push(post);
  });
  return Object.entries(map).sort((a, b) => b[0] - a[0]);
};
