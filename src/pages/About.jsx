import { AnimatedSection } from '../components/common';
import { SITE_CONFIG } from '../data/loader';
import { useIntersection } from '../hooks/useIntersection';

const skills = [
  { name: 'React / Next.js', level: 92 },
  { name: 'TypeScript', level: 85 },
  { name: 'Node.js', level: 78 },
  { name: 'Rust', level: 55 },
  { name: 'UI / 设计', level: 70 },
];

const timeline = [
  { year: '2024', title: '独立开发者', desc: '辞职后开始做独立项目，尝试将技术与创意结合。' },
  { year: '2022', title: '高级前端工程师', desc: '加入某互联网公司，负责核心产品前端架构。' },
  { year: '2020', title: '前端开发工程师', desc: '从校园走向职场，开始在创业公司写第一行生产代码。' },
  { year: '2018', title: '计算机科学学生', desc: '开始学习编程，在宿舍里写出了第一个 Hello World。' },
];

export default function About() {
  return (
    <div
      style={{
        maxWidth: '820px',
        margin: '0 auto',
        padding: '52px 32px 80px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Header */}
      <AnimatedSection>
        <div style={{ marginBottom: '52px' }}>
          <p style={{ color: 'var(--accent)', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: '600', marginBottom: '10px' }}>
            ✦ 关于我
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '28px', flexWrap: 'wrap' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                flexShrink: 0,
                boxShadow: '0 0 0 4px var(--accent-dim)',
              }}
            >
              {SITE_CONFIG.avatar}
            </div>
            <div>
              <h1
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(24px, 4vw, 34px)',
                  fontWeight: '800',
                  color: 'var(--text-heading)',
                  margin: '0 0 6px',
                  letterSpacing: '-0.02em',
                }}
              >
                {SITE_CONFIG.author}
              </h1>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '14px' }}>
                前端工程师 · 独立开发者 · 记录者
              </p>
            </div>
          </div>

          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '16px',
              color: 'var(--text-secondary)',
              lineHeight: '1.9',
              margin: 0,
            }}
          >
            {SITE_CONFIG.subtitle} 我相信好的代码和好的文字有共同的特质：清晰、克制、留有余地。
            这个博客是我思考的外延，记录技术探索、生活感悟，以及那些难以归类的瞬间。
          </p>
        </div>
      </AnimatedSection>

      {/* Skills */}
      <AnimatedSection delay={100}>
        <section style={{ marginBottom: '52px' }}>
          <SectionTitle>技术栈</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {skills.map((skill, i) => (
              <SkillBar key={skill.name} {...skill} delay={i * 60} />
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* Timeline */}
      <AnimatedSection delay={200}>
        <section style={{ marginBottom: '52px' }}>
          <SectionTitle>经历</SectionTitle>
          <div style={{ position: 'relative', paddingLeft: '28px' }}>
            {/* Vertical line */}
            <div
              style={{
                position: 'absolute',
                left: '6px',
                top: '8px',
                bottom: '8px',
                width: '1px',
                background: 'var(--border)',
              }}
            />
            {timeline.map((item, i) => (
              <AnimatedSection key={item.year} delay={i * 80}>
                <div style={{ position: 'relative', marginBottom: '32px' }}>
                  {/* Dot */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '-25px',
                      top: '6px',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: i === 0 ? 'var(--accent)' : 'var(--border-hover)',
                      border: `2px solid ${i === 0 ? 'var(--accent)' : 'transparent'}`,
                      boxShadow: i === 0 ? '0 0 8px rgba(245,158,11,0.4)' : 'none',
                    }}
                  />
                  <div
                    style={{
                      display: 'inline-block',
                      background: 'var(--accent-dim)',
                      color: 'var(--accent)',
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '2px 10px',
                      borderRadius: '12px',
                      marginBottom: '8px',
                    }}
                  >
                    {item.year}
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '16px',
                      color: 'var(--text-heading)',
                      margin: '0 0 6px',
                      fontWeight: '600',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* Contact */}
      <AnimatedSection delay={300}>
        <section>
          <SectionTitle>联系我</SectionTitle>
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '28px',
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            {[
              { label: '📧 Email', value: SITE_CONFIG.email, href: `mailto:${SITE_CONFIG.email}` },
              { label: '🐙 GitHub', value: 'github.com/...', href: SITE_CONFIG.github },
              { label: '🐦 Twitter', value: '@beixxchi', href: SITE_CONFIG.twitter },
            ].map(item => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  flex: '1',
                  minWidth: '160px',
                  padding: '16px',
                  background: 'var(--bg-hover)',
                  borderRadius: '12px',
                  border: '1px solid transparent',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--accent-border)';
                  e.currentTarget.style.background = 'var(--accent-dim)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.background = 'var(--bg-hover)';
                }}
              >
                <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{item.label}</span>
                <span style={{ color: 'var(--accent)', fontSize: '14px', fontWeight: '500' }}>{item.value}</span>
              </a>
            ))}
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2
      style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '20px',
        fontWeight: '700',
        color: 'var(--text-primary)',
        margin: '0 0 24px',
        paddingBottom: '12px',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {children}
    </h2>
  );
}

function SkillBar({ name, level, delay }) {
  const { ref, isVisible } = useIntersection();

  return (
    <div ref={ref}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{name}</span>
        <span style={{ color: 'var(--accent)', fontSize: '13px', fontWeight: '600' }}>{level}%</span>
      </div>
      <div
        style={{
          height: '4px',
          background: 'var(--bg-code)',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: isVisible ? `${level}%` : '0%',
            background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
            borderRadius: '4px',
            transition: `width 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}
