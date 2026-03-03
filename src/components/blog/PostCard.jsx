import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedSection, Tag } from '../common';
import { CATEGORY_COLORS } from '../../data/loader';

/**
 * PostCard
 * 文章列表卡片（左图右文）
 */
export function PostCard({ post, index = 0 }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const color = CATEGORY_COLORS[post.category] || '#f59e0b';

  return (
    <AnimatedSection delay={index * 80}>
      <div
        onClick={() => navigate(`/post/${post.id}`)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex',
          gap: '20px',
          padding: '20px',
          borderRadius: '16px',
          background: hovered ? 'var(--bg-hover)' : 'transparent',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          border: '1px solid',
          borderColor: hovered ? 'var(--border-hover)' : 'transparent',
          marginBottom: '4px',
        }}
      >
        {/* Thumbnail */}
        <div
          style={{
            width: '120px',
            height: '88px',
            flexShrink: 0,
            borderRadius: '10px',
            overflow: 'hidden',
            background: 'var(--bg-thumb)',
          }}
        >
          <img
            loading="lazy"
            src={post.cover}
            alt={post.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: hovered ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.4s ease',
            }}
          />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {/* Top: tag + read time */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Tag label={post.tag} color={color} />
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{post.readTime}阅读</span>
          </div>

          {/* Title */}
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '16px',
              fontWeight: '600',
              color: hovered ? 'var(--accent)' : 'var(--text-primary)',
              lineHeight: '1.55',
              margin: '0 0 10px 0',
              transition: 'color 0.2s ease',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.title}
          </h3>

          {/* Date */}
          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{post.date}</span>
        </div>
      </div>
    </AnimatedSection>
  );
}
