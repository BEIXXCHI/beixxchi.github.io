import { useState } from 'react';
import { PostCard } from './PostCard';
import { AnimatedSection, Button } from '../common';
import { useSearch } from '../../hooks/useSearch';
import { getAllCategories, CATEGORY_COLORS } from '../../data/loader';

const CATEGORIES = getAllCategories();

/**
 * PostList
 * 文章列表 + 搜索框 + 分类筛选器
 */
export function PostList({ posts }) {
  const { query, setQuery, activeCategory, setActiveCategory, filtered } = useSearch(posts);
  const [searchFocused, setSearchFocused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  return (
    <div>
      {/* Controls */}
      <AnimatedSection delay={150}>
        <div style={{ marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                fontSize: '14px',
                pointerEvents: 'none',
              }}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder="搜索文章标题、摘要或标签..."
              value={query}
              onChange={e => { setQuery(e.target.value); setVisibleCount(5); }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: `1px solid ${searchFocused ? 'var(--accent-border)' : 'var(--border-hover)'}`,
                borderRadius: '12px',
                color: 'var(--text-primary)',
                fontSize: '14px',
                padding: '12px 16px 12px 42px',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                boxShadow: searchFocused ? '0 0 0 3px var(--accent-dim)' : 'none',
                fontFamily: 'var(--font-sans)',
              }}
            />
          </div>

          {/* Category filter */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat;
              const color = CATEGORY_COLORS[cat] || '#f59e0b';
              return (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setVisibleCount(5); }}
                  style={{
                    padding: '6px 16px',
                    borderRadius: '24px',
                    border: '1px solid',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontWeight: isActive ? '600' : '400',
                    transition: 'all 0.2s ease',
                    fontFamily: 'var(--font-sans)',
                    background: isActive ? color : 'var(--bg-input)',
                    borderColor: isActive ? color : 'var(--border-hover)',
                    color: isActive ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      {/* Post list */}
      {visible.length > 0 ? (
        <>
          {visible.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
          {hasMore && (
            <AnimatedSection delay={300}>
              <div style={{ textAlign: 'center', marginTop: '32px' }}>
                <Button onClick={() => setVisibleCount(v => v + 5)}>
                  加载更多文章
                </Button>
              </div>
            </AnimatedSection>
          )}
        </>
      ) : (
        <AnimatedSection>
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌙</div>
            <p style={{ fontSize: '15px' }}>没有找到相关文章</p>
          </div>
        </AnimatedSection>
      )}
    </div>
  );
}
