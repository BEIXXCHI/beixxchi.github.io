import { SITE_CONFIG } from '../../data/loader';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: '32px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>
        © {SITE_CONFIG.startYear}
        {currentYear > SITE_CONFIG.startYear ? `–${currentYear}` : ''}{' '}
        {SITE_CONFIG.title} · 用文字与代码，记录此刻
      </p>
    </footer>
  );
}
