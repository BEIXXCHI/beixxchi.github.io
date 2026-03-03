import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { posts, CATEGORY_COLORS } from '../data/loader';
import { Tag, AnimatedSection } from '../components/common';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // id 可能是数字或字符串（文件名），用宽松比较
  const post = posts.find(p => String(p.id) === String(id));

  const [htmlContent, setHtmlContent] = useState('');
  const [progress, setProgress] = useState(0);

  // ── Markdown 渲染（marked v12+ 使用 use() 扩展 API 注入 highlight.js）──
  useEffect(() => {
    if (!post) return;

    Promise.all([
      import('marked'),
      import('highlight.js'),
    ]).then(([markedModule, hljs]) => {
      const { marked } = markedModule;
      const hljsLib = hljs.default;

      // 使用 marked.use() 注入自定义 code renderer
      marked.use({
        breaks: true,
        gfm: true,
        renderer: {
          code(code, lang) {
            const language = lang && hljsLib.getLanguage(lang) ? lang : null;
            const highlighted = language
              ? hljsLib.highlight(code, { language }).value
              : hljsLib.highlightAuto(code).value;
            const langLabel = lang
              ? `<span class="hljs-lang-label">${lang}</span>`
              : '';
            return `<pre><code class="hljs language-${lang || 'plaintext'}">${highlighted}</code>${langLabel}</pre>`;
          },
        },
      });

      setHtmlContent(marked.parse(post.content || ''));
    }).catch(err => {
      console.error('[PostDetail] Markdown 渲染失败:', err);
      setHtmlContent(`<p style="color:red">文章渲染出错，请刷新重试。</p>`);
    });
  }, [post]);

  // ── 阅读进度条（rAF 节流）──
  useEffect(() => {
    let rafId = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
        rafId = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // ── 404 ──
  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 32px', color: 'var(--text-secondary)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>404</div>
        <p style={{ marginBottom: '24px' }}>文章不存在</p>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'var(--accent)',
            border: 'none',
            color: 'var(--text-on-accent)',
            padding: '10px 28px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          返回首页
        </button>
      </div>
    );
  }

  const color = CATEGORY_COLORS[post.category] || '#f59e0b';
  const related = posts.filter(p => p.category === post.category && String(p.id) !== String(id)).slice(0, 3);

  return (
    <>
      {/* 阅读进度条 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '2px',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
          zIndex: 200,
          transition: 'width 0.1s ease',
        }}
      />

      <article style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero 封面 — 文字在深色蒙层上，保持白色 */}
        <div
          style={{
            position: 'relative',
            height: 'clamp(280px, 40vw, 420px)',
            overflow: 'hidden',
          }}
        >
          <img
            src={post.cover}
            alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'var(--hero-gradient)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: 'clamp(24px, 5vw, 64px)',
            }}
          >
            <div style={{ maxWidth: '760px' }}>
              <button
                onClick={() => navigate(-1)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)',
                  borderRadius: '20px',
                  padding: '6px 16px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  marginBottom: '20px',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                ← 返回
              </button>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <Tag label={post.category} color={color} filled />
                <Tag label={post.tag} color={color} />
              </div>

              <h1
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(22px, 4vw, 36px)',
                  fontWeight: '800',
                  color: '#fff',
                  lineHeight: '1.35',
                  margin: '0 0 18px',
                  letterSpacing: '-0.02em',
                }}
              >
                {post.title}
              </h1>

              <div style={{ display: 'flex', gap: '16px', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                <span>📅 {post.date}</span>
                <span>⏱ {post.readTime}阅读</span>
              </div>
            </div>
          </div>
        </div>

        {/* 正文区 */}
        <div
          style={{
            maxWidth: '760px',
            margin: '0 auto',
            padding: 'clamp(32px, 5vw, 56px) clamp(20px, 4vw, 32px) 80px',
          }}
        >
          {/* 摘要引用块 */}
          <AnimatedSection>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '17px',
                color: 'var(--text-secondary)',
                lineHeight: '1.85',
                padding: '20px 24px',
                borderLeft: `3px solid ${color}`,
                background: 'var(--bg-card)',
                borderRadius: '0 10px 10px 0',
                margin: '0 0 40px',
                fontStyle: 'italic',
              }}
            >
              {post.excerpt}
            </p>
          </AnimatedSection>

          {/* Markdown 正文 */}
          <AnimatedSection delay={100}>
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </AnimatedSection>

          {/* 标签尾部 */}
          <AnimatedSection delay={150}>
            <div
              style={{
                marginTop: '56px',
                paddingTop: '28px',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>标签：</span>
              <Tag label={post.category} color={color} />
              <Tag label={post.tag} color={color} />
            </div>
          </AnimatedSection>

          {/* 相关文章 */}
          {related.length > 0 && (
            <AnimatedSection delay={200}>
              <div style={{ marginTop: '56px' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '18px',
                    color: 'var(--text-secondary)',
                    marginBottom: '20px',
                    fontWeight: '600',
                  }}
                >
                  相关文章
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {related.map(p => (
                    <RelatedCard key={p.id} post={p} color={color} />
                  ))}
                </div>
              </div>
            </AnimatedSection>
          )}
        </div>
      </article>

      {/* 代码块语言标签样式 */}
      <style>{`
        .article-content pre {
          position: relative;
        }
        .hljs-lang-label {
          position: absolute;
          top: 10px;
          right: 14px;
          font-size: 11px;
          color: var(--text-muted);
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          letter-spacing: 0.06em;
          text-transform: lowercase;
          pointer-events: none;
        }
      `}</style>
    </>
  );
}

function RelatedCard({ post, color }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/post/${post.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        gap: '14px',
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid',
        borderColor: hovered ? 'var(--border-hover)' : 'var(--border)',
        background: hovered ? 'var(--bg-hover)' : 'var(--bg-card)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      <img
        src={post.cover}
        alt={post.title}
        style={{
          width: '80px',
          height: '60px',
          objectFit: 'cover',
          borderRadius: '8px',
          flexShrink: 0,
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.3s ease',
        }}
      />
      <div>
        <h4
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '14px',
            color: hovered ? color : 'var(--text-primary)',
            margin: '0 0 6px',
            lineHeight: '1.5',
            transition: 'color 0.2s',
          }}
        >
          {post.title}
        </h4>
        <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{post.date}</span>
      </div>
    </div>
  );
}
