import { useState } from 'react';

/**
 * Button
 * 通用按钮组件，支持 outline / ghost / primary 变体
 */
export function Button({ children, onClick, variant = 'outline', disabled = false, style = {} }) {
  const [hovered, setHovered] = useState(false);

  const base = {
    padding: '10px 28px',
    borderRadius: '24px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.25s ease',
    opacity: disabled ? 0.5 : 1,
    fontFamily: 'inherit',
    ...style,
  };

  const variants = {
    outline: {
      background: 'transparent',
      border: `1px solid ${hovered ? 'var(--accent)' : 'var(--border-hover)'}`,
      color: hovered ? 'var(--accent)' : 'var(--text-secondary)',
    },
    ghost: {
      background: hovered ? 'var(--bg-hover)' : 'transparent',
      border: '1px solid transparent',
      color: hovered ? 'var(--text-primary)' : 'var(--text-secondary)',
    },
    primary: {
      background: hovered ? '#e08e0a' : '#f59e0b',
      border: '1px solid transparent',
      color: 'var(--text-on-accent)',
      fontWeight: '600',
    },
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ ...base, ...variants[variant] }}
    >
      {children}
    </button>
  );
}
