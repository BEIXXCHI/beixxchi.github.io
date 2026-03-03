import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SITE_CONFIG } from '../../data/loader';
import { useTheme } from '../../hooks/useTheme';

const navLinks = [
  { label: '首页', to: '/' },
  { label: '归档', to: '/archive' },
  { label: '关于', to: '/about' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: scrolled ? 'var(--bg-overlay)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled
          ? '1px solid var(--border)'
          : '1px solid transparent',
        transition: 'all 0.35s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1160px',
          margin: '0 auto',
          padding: '0 32px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '15px',
              color: '#fff',
              flexShrink: 0,
            }}
          >
            ✦
          </div>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '17px',
              fontWeight: '700',
              color: 'var(--text-heading)',
              letterSpacing: '0.02em',
            }}
          >
            {SITE_CONFIG.title}
          </span>
        </Link>

        {/* Navigation + Theme toggle */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {navLinks.map(({ label, to }) => {
            const isActive = location.pathname === to;
            return (
              <NavLink key={to} to={to} label={label} isActive={isActive} />
            );
          })}
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </nav>
      </div>
    </header>
  );
}

function NavLink({ to, label, isActive }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textDecoration: 'none',
        color: isActive ? 'var(--accent)' : hovered ? 'var(--text-heading)' : 'var(--text-secondary)',
        fontSize: '14px',
        padding: '8px 14px',
        borderRadius: '8px',
        background: isActive
          ? 'var(--accent-dim)'
          : hovered
          ? 'var(--bg-hover)'
          : 'transparent',
        transition: 'all 0.2s ease',
        fontWeight: isActive ? '600' : '400',
      }}
    >
      {label}
    </Link>
  );
}

function ThemeToggle({ theme, onToggle }) {
  const [hovered, setHovered] = useState(false);
  const isDark = theme === 'dark';

  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={isDark ? '切换到白天模式' : '切换到夜间模式'}
      style={{
        background: hovered ? 'var(--bg-hover)' : 'transparent',
        border: 'none',
        borderRadius: '8px',
        padding: '8px',
        marginLeft: '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        transition: 'all 0.2s ease',
        color: hovered ? 'var(--accent)' : 'var(--text-secondary)',
        fontSize: '18px',
      }}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}
