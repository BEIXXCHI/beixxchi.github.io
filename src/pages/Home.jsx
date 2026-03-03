import { posts } from '../data/loader';
import { FeaturedCarousel, PostList } from '../components/blog';
import { Profile, Stats, TagCloud } from '../components/Sidebar';
import { AnimatedSection } from '../components/common';

// 取所有 featured: true 的文章，按日期降序（loader 已排序，这里直接 filter）
const featuredPosts = posts.filter(p => p.featured);
// 非精选文章列表
const rest = posts.filter(p => !p.featured);

export default function Home() {
  return (
    <div
      style={{
        maxWidth: '1160px',
        margin: '0 auto',
        padding: '48px 32px 80px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Hero */}
      <AnimatedSection>
        <div style={{ marginBottom: '44px' }}>
          <p
            style={{
              color: 'var(--accent)',
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: '600',
              marginBottom: '12px',
            }}
          >
            ✦ 欢迎来到我的数字花园
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(26px, 5vw, 42px)',
              fontWeight: '800',
              color: 'var(--text-heading)',
              lineHeight: '1.28',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            代码、文字与那些
            <br />
            <span
              style={{
                background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              值得记录的瞬间
            </span>
          </h1>
        </div>
      </AnimatedSection>

      {/* Featured Carousel */}
      {featuredPosts.length > 0 && (
        <AnimatedSection delay={100}>
          <div style={{ marginBottom: '52px' }}>
            <FeaturedCarousel
              posts={featuredPosts}
              interval={5000}
              autoPlay={true}
            />
          </div>
        </AnimatedSection>
      )}

      {/* Two column layout */}
      <div
        className="home-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: '40px',
          alignItems: 'start',
        }}
      >
        {/* Left: post list */}
        <PostList posts={rest} />

        {/* Right: sidebar */}
        <aside className="home-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '28px', position: 'sticky', top: '84px' }}>
          <Profile />
          <Stats />
          <TagCloud />
        </aside>
      </div>
    </div>
  );
}
