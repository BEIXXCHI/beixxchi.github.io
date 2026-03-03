import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag } from '../common';
import { CATEGORY_COLORS } from '../../data/loader';

/**
 * FeaturedCarousel
 * 精选文章轮播组件
 *
 * 功能：
 * - 自动播放（默认 5 秒切换）
 * - 鼠标悬停暂停自动播放
 * - 左右箭头手动切换
 * - 底部圆点指示器（可点击跳转）
 * - 背景图切换时有淡入淡出过渡
 * - 文字内容有上移入场动画
 *
 * Props:
 * @param {Array}  posts        - 精选文章数组（featured: true 的文章）
 * @param {number} interval     - 自动播放间隔（毫秒），默认 5000
 * @param {boolean} autoPlay    - 是否自动播放，默认 true
 */
export function FeaturedCarousel({ posts, interval = 5000, autoPlay = true }) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [contentVisible, setContentVisible] = useState(true);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const total = posts.length;

  // ── 切换到指定索引 ────────────────────────────────────────
  const goTo = useCallback((index, direction = 'next') => {
    if (isTransitioning || index === current) return;

    setIsTransitioning(true);
    setContentVisible(false);
    setPrev(current);
    setCurrent(index);

    // 文字重新入场
    setTimeout(() => {
      setContentVisible(true);
      setIsTransitioning(false);
      setPrev(null);
    }, 500);
  }, [current, isTransitioning]);

  const goNext = useCallback(() => {
    goTo((current + 1) % total);
  }, [current, total, goTo]);

  const goPrev = useCallback(() => {
    goTo((current - 1 + total) % total);
  }, [current, total, goTo]);

  // ── 自动播放 ──────────────────────────────────────────────
  useEffect(() => {
    if (!autoPlay || paused || total <= 1) return;
    timerRef.current = setInterval(goNext, interval);
    return () => clearInterval(timerRef.current);
  }, [autoPlay, paused, total, interval, goNext]);

  // ── 键盘导航 ──────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  if (!posts || total === 0) return null;

  const post = posts[current];
  const color = CATEGORY_COLORS[post.category] || '#f59e0b';

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        height: 'clamp(360px, 45vw, 500px)',
        background: '#0a0a0a',
        boxShadow: 'var(--shadow-card)',
        userSelect: 'none',
      }}
    >
      {/* ── 背景图层（带淡入淡出） ── */}
      {posts.map((p, i) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: i === current ? 1 : 0,
            transition: 'opacity 0.7s ease',
            zIndex: 0,
          }}
        >
          <img
            src={p.cover}
            alt={p.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.4,
              transform: i === current ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 6s ease, opacity 0.7s ease',
            }}
          />
        </div>
      ))}

      {/* ── 渐变蒙层 ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.2) 100%)',
          zIndex: 1,
        }}
      />

      {/* ── 文章内容区 ── */}
      <div
        onClick={() => navigate(`/post/${post.id}`)}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'clamp(24px, 4vw, 44px)',
          cursor: 'pointer',
        }}
      >
        {/* 标签行 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px',
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'all 0.45s cubic-bezier(0.22,1,0.36,1) 0.05s',
          }}
        >
          <Tag label="精选" filled color={color} />
          <Tag label={post.tag} color={color} />
          {total > 1 && (
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginLeft: '4px' }}>
              {current + 1} / {total}
            </span>
          )}
        </div>

        {/* 标题 */}
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(20px, 3vw, 30px)',
            fontWeight: '700',
            color: '#fff',
            lineHeight: '1.4',
            margin: '0 0 14px 0',
            letterSpacing: '-0.01em',
            maxWidth: '720px',
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.45s cubic-bezier(0.22,1,0.36,1) 0.1s',
          }}
        >
          {post.title}
        </h2>

        {/* 摘要 */}
        <p
          style={{
            color: 'rgba(255,255,255,0.62)',
            fontSize: '14px',
            lineHeight: '1.75',
            margin: '0 0 20px 0',
            maxWidth: '640px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.45s cubic-bezier(0.22,1,0.36,1) 0.15s',
          }}
        >
          {post.excerpt}
        </p>

        {/* 元信息行 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'all 0.45s cubic-bezier(0.22,1,0.36,1) 0.2s',
          }}
        >
          <span style={{ color: 'rgba(255,255,255,0.38)', fontSize: '13px' }}>{post.date}</span>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
          <span style={{ color: 'rgba(255,255,255,0.38)', fontSize: '13px' }}>{post.readTime}阅读</span>
          <span style={{ marginLeft: 'auto', color: '#f59e0b', fontSize: '13px', fontWeight: '500' }}>
            阅读全文 →
          </span>
        </div>
      </div>

      {/* ── 进度条 ── */}
      {total > 1 && autoPlay && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'rgba(255,255,255,0.08)',
            zIndex: 10,
          }}
        >
          <div
            key={`progress-${current}`}
            style={{
              height: '100%',
              background: `linear-gradient(90deg, ${color}, #ef4444)`,
              animation: paused ? 'none' : `progress ${interval}ms linear`,
              borderRadius: '0 1px 1px 0',
            }}
          />
        </div>
      )}

      {/* ── 左右切换箭头 ── */}
      {total > 1 && (
        <>
          <NavArrow direction="left" onClick={(e) => { e.stopPropagation(); goPrev(); }} />
          <NavArrow direction="right" onClick={(e) => { e.stopPropagation(); goNext(); }} />
        </>
      )}

      {/* ── 圆点指示器 ── */}
      {total > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            right: 'clamp(24px, 4vw, 44px)',
            display: 'flex',
            gap: '8px',
            zIndex: 10,
          }}
        >
          {posts.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); goTo(i); }}
              style={{
                width: i === current ? '24px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: i === current ? color : 'rgba(255,255,255,0.25)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
              }}
            />
          ))}
        </div>
      )}

      {/* ── 暂停指示 ── */}
      {paused && autoPlay && total > 1 && (
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            background: 'rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '4px 10px',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.06em',
          }}
        >
          ⏸ 已暂停
        </div>
      )}

      {/* ── CSS 动画 ── */}
      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}

// ── 左右箭头子组件 ────────────────────────────────────────────
function NavArrow({ direction, onClick }) {
  const [hovered, setHovered] = useState(false);
  const isLeft = direction === 'left';

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        top: '50%',
        [isLeft ? 'left' : 'right']: '16px',
        transform: 'translateY(-50%)',
        zIndex: 10,
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: hovered ? 'rgba(245,158,11,0.25)' : 'rgba(0,0,0,0.45)',
        border: `1px solid ${hovered ? 'rgba(245,158,11,0.5)' : 'rgba(255,255,255,0.12)'}`,
        color: hovered ? '#f59e0b' : 'rgba(255,255,255,0.7)',
        fontSize: '16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        backdropFilter: 'blur(8px)',
      }}
    >
      {isLeft ? '‹' : '›'}
    </button>
  );
}
