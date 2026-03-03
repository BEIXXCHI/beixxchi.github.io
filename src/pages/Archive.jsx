import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { getPostsByYear, posts, CATEGORY_COLORS } from '../data/loader';
import { AnimatedSection, Tag } from '../components/common';

const postsByYear = getPostsByYear();

export default function Archive() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tagFilter = searchParams.get('tag');
  const [hoveredId, setHoveredId] = useState(null);

  const filtered = tagFilter
    ? posts.filter(p => p.tag === tagFilter)
    : null;

  const renderList = filtered
    ? [['', filtered]]
    : postsByYear;

  return (
    <div
      style={{
        maxWidth: '820px',
        margin: '0 auto',
        padding: '52px 32px 80px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Header */}
      <AnimatedSection>
        <div style={{ marginBottom: '48px' }}>
          <p style={{ color: 'var(--accent)', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: '600', marginBottom: '10px' }}>
            ✦ 归档
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: '800',
              color: 'var(--text-heading)',
              margin: '0 0 12px',
              letterSpacing: '-0.02em',
            }}
          >
            {tagFilter ? `#${tagFilter}` : '所有文章'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            共 {filtered ? filtered.length : posts.length} 篇文章
            {tagFilter && (
              <button
                onClick={() => navigate('/archive')}
                style={{
                  marginLeft: '12px',
                  background: 'none',
                  border: '1px solid var(--border-hover)',
                  color: 'var(--text-secondary)',
                  borderRadius: '12px',
                  padding: '2px 10px',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                清除筛选 ✕
              </button>
            )}
          </p>
        </div>
      </AnimatedSection>

      {/* Timeline */}
      {renderList.map(([year, yearPosts], yi) => (
        <AnimatedSection key={year || 'all'} delay={yi * 60}>
          <div style={{ marginBottom: '44px' }}>
            {/* Year label */}
            {year && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '20px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '22px',
                    fontWeight: '800',
                    color: 'var(--accent)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {year}
                </span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                  {yearPosts.length} 篇
                </span>
              </div>
            )}

            {/* Posts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {yearPosts.map((post, pi) => {
                const color = CATEGORY_COLORS[post.category] || '#f59e0b';
                const hovered = hoveredId === post.id;
                return (
                  <div
                    key={post.id}
                    onClick={() => navigate(`/post/${post.id}`)}
                    onMouseEnter={() => setHoveredId(post.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '14px 16px',
                      borderRadius: '10px',
                      background: hovered ? 'var(--bg-hover)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: '1px solid',
                      borderColor: hovered ? 'var(--border)' : 'transparent',
                    }}
                  >
                    {/* Date */}
                    <span
                      style={{
                        color: 'var(--text-muted)',
                        fontSize: '12px',
                        flexShrink: 0,
                        width: '72px',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {post.date.slice(5)}
                    </span>

                    {/* Dot */}
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: hovered ? color : 'var(--border-hover)',
                        flexShrink: 0,
                        transition: 'background 0.2s',
                      }}
                    />

                    {/* Title */}
                    <span
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '15px',
                        color: hovered ? 'var(--text-heading)' : 'var(--text-secondary)',
                        flex: 1,
                        transition: 'color 0.2s',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {post.title}
                    </span>

                    {/* Tag */}
                    <Tag label={post.tag} color={color} />

                    {/* Read time */}
                    <span style={{ color: 'var(--text-muted)', fontSize: '12px', flexShrink: 0 }}>
                      {post.readTime}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </AnimatedSection>
      ))}
    </div>
  );
}
