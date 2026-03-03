import { useState } from 'react';
import { SITE_CONFIG } from '../../data/loader';
import { AnimatedSection } from '../common';

export function Profile() {
  const links = [
    { label: 'GitHub', href: SITE_CONFIG.github },
    { label: 'Twitter', href: SITE_CONFIG.twitter },
    { label: 'RSS', href: SITE_CONFIG.rss },
  ];

  return (
    <AnimatedSection delay={100}>
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '18px',
          padding: '28px',
          textAlign: 'center',
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            boxShadow: '0 0 0 4px var(--accent-dim)',
          }}
        >
          {SITE_CONFIG.avatar}
        </div>

        {/* Name */}
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            color: 'var(--text-heading)',
            fontSize: '17px',
            fontWeight: '700',
            margin: '0 0 6px',
          }}
        >
          {SITE_CONFIG.author}
        </h3>

        {/* Bio */}
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '13px',
            lineHeight: '1.75',
            margin: '0 0 20px',
          }}
        >
          {SITE_CONFIG.subtitle}
        </p>

        {/* Social links */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {links.map(link => (
            <SocialButton key={link.label} {...link} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

function SocialButton({ label, href }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textDecoration: 'none',
        background: hovered ? 'var(--accent-dim)' : 'var(--bg-hover)',
        border: `1px solid ${hovered ? 'var(--accent-border)' : 'var(--border)'}`,
        color: hovered ? 'var(--accent)' : 'var(--text-secondary)',
        borderRadius: '8px',
        padding: '6px 14px',
        fontSize: '12px',
        transition: 'all 0.2s ease',
        display: 'inline-block',
      }}
    >
      {label}
    </a>
  );
}
