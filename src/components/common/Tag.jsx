import { useState } from 'react';

/**
 * Tag
 * 标签/分类胶囊组件
 */
export function Tag({ label, color = '#f59e0b', filled = false, onClick, active = false }) {
  const [hovered, setHovered] = useState(false);
  const isActive = active || filled;

  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: isActive ? '700' : '500',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        background: isActive || hovered
          ? (filled ? color : `${color}18`)
          : 'var(--bg-hover)',
        color: isActive || hovered
          ? (filled ? 'var(--text-on-accent)' : color)
          : 'var(--text-secondary)',
        border: `1px solid ${isActive || hovered ? `${color}50` : 'var(--border-hover)'}`,
        userSelect: 'none',
      }}
    >
      {label}
    </span>
  );
}
