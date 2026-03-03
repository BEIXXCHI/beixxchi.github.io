import { useState, useMemo } from 'react';

/**
 * useSearch
 * 文章搜索与分类过滤逻辑
 *
 * @param {Array} posts - 全量文章数组
 * @returns {{ query, setQuery, activeCategory, setActiveCategory, filtered }}
 */
export function useSearch(posts) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');

  const filtered = useMemo(() => {
    return posts.filter(post => {
      const matchCategory =
        activeCategory === '全部' || post.category === activeCategory;
      const matchQuery =
        !query ||
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        post.tag.toLowerCase().includes(query.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [posts, query, activeCategory]);

  return { query, setQuery, activeCategory, setActiveCategory, filtered };
}
