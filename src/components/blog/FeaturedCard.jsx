import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag } from '../common';
import { CATEGORY_COLORS } from '../../data/loader';

/**
 * FeaturedCard
 * 精选文章全宽大卡片
 * 注意：文字始终在深色渐变蒙层上，不随主题变化
 */
export function FeaturedCard({ post }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const color = CATEGORY_COLORS[post.category] || '#f59e0b';

  return (
    <div
      onClick={() => navigate(`/post/${post.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        cursor: 'pointer',
        height: 'clamp(360px, 45vw, 500px)',
        background: 'var(--bg-thumb)',
        boxShadow: hovered
          ? 'var(--shadow-card-hover)'
          : 'var(--shadow-card)',
        transform: hovered ? 'scale(1.012)' : 'scale(1)',
        transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {/* Cover image */}
      <img
        loading="lazy"
        src={post.cover}
        alt={post.title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: hovered ? 0.45 : 0.35,
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
          transition: 'all 0.6s cubic-bezier(0.22,1,0.36,1)',
        }}
      />

      {/* Gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--card-gradient)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'clamp(24px, 4vw, 44px)',
        }}
      >
        {/* Tags row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Tag label="精选" filled color={color} />
          <Tag label={post.tag} color={color} />
        </div>

        {/* Title — 始终白色（在深色蒙层上） */}
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(20px, 3vw, 30px)',
            fontWeight: '700',
            color: '#fff',
            lineHeight: '1.4',
            margin: '0 0 14px 0',
            letterSpacing: '-0.01em',
          }}
        >
          {post.title}
        </h2>

        {/* Excerpt */}
        <p
          style={{
            color: 'rgba(255,255,255,0.65)',
            fontSize: '14px',
            lineHeight: '1.75',
            margin: '0 0 20px 0',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            maxWidth: '680px',
          }}
        >
          {post.excerpt}
        </p>

        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>{post.date}</span>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>{post.readTime}阅读</span>
          <span
            style={{
              marginLeft: 'auto',
              color: '#f59e0b',
              fontSize: '13px',
              fontWeight: '500',
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateX(0)' : 'translateX(-8px)',
              transition: 'all 0.3s ease',
            }}
          >
            阅读全文 →
          </span>
        </div>
      </div>
    </div>
  );
}
