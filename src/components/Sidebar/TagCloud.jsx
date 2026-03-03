import { useNavigate } from 'react-router-dom';
import { getAllTags } from '../../data/loader';
import { AnimatedSection, Tag } from '../common';

const ALL_TAGS = getAllTags();

export function TagCloud() {
  const navigate = useNavigate();

  return (
    <AnimatedSection delay={300}>
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
            margin: '0 0 16px',
            fontWeight: '600',
          }}
        >
          标签云
        </h4>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {ALL_TAGS.map(tag => (
            <Tag
              key={tag}
              label={tag}
              onClick={() => navigate(`/archive?tag=${tag}`)}
            />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
