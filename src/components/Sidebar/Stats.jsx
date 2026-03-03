import { posts, SITE_CONFIG } from '../../data/loader';
import { AnimatedSection } from '../common';

export function Stats() {
  const totalReadTime = posts.reduce((acc, p) => {
    return acc + parseInt(p.readTime);
  }, 0);

  const statItems = [
    { label: '文章总数', value: `${posts.length}`, icon: '📝' },
    { label: '总阅读时长', value: `${totalReadTime}m`, icon: '⏱' },
    {
      label: '写作年数',
      value: `${new Date().getFullYear() - SITE_CONFIG.startYear + 1}`,
      icon: '📅',
    },
  ];

  return (
    <AnimatedSection delay={200}>
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '18px',
          padding: '24px',
        }}
      >
        <h4
          style={{
            color: 'var(--text-muted)',
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            margin: '0 0 20px',
            fontWeight: '600',
          }}
        >
          数据统计
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {statItems.map(item => (
            <div
              key={item.label}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                {item.icon} {item.label}
              </span>
              <span
                style={{
                  color: 'var(--accent)',
                  fontWeight: '700',
                  fontSize: '15px',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
