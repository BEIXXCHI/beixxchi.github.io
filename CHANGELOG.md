# Changelog

## [0.2.0] - 2026-03-03

### 重命名
- 站点作者名由 "拾柒" 更改为 "beixxchi"
  - `src/data/loader.js` — SITE_CONFIG.title / SITE_CONFIG.author
  - `src/data/posts.js` — 同步更新 legacy 文件
  - `src/pages/About.jsx` — Twitter 显示名

### 交互优化
- **主题切换平滑过渡**：切换时临时添加 `.theme-transitioning` class，为所有元素的颜色属性加 400ms 过渡动画，过渡完成后自动移除，避免永久性能开销。快速连续切换时使用 `useRef` 防竞态。
  - `src/styles/global.css` — 新增 `.theme-transitioning` 规则
  - `src/hooks/useTheme.jsx` — toggleTheme 添加 class 管理逻辑

- **页面切换动画**：新建 `PageTransition` 组件，监听 `useLocation().key` 变化触发 fade-in + slide-up 动画（opacity + translateY，350ms ease），与现有 `AnimatedSection` 风格一致。
  - `src/components/common/PageTransition.jsx` — 新建
  - `src/components/common/index.js` — 添加导出
  - `src/App.jsx` — 用 `<PageTransition>` 包裹 `<Routes>`

- **修复滚动行为不一致**：在 `App.jsx` 中新增 `ScrollToTop` 组件，路由 pathname 变化时立即 `scrollTo(0, 0)`。移除 PostDetail 中两处重复的 `window.scrollTo` 调用（Markdown 加载时的 smooth scroll 和 RelatedCard 点击时的 instant scroll）。
  - `src/App.jsx` — 添加 ScrollToTop
  - `src/pages/PostDetail.jsx` — 删除 line 19 和 line 285 的 scrollTo

- **阅读进度条性能优化**：scroll 事件改用 `requestAnimationFrame` 节流（每帧最多更新一次），并添加 `{ passive: true }` 标记，减少主线程阻塞。
  - `src/pages/PostDetail.jsx` — 重写 scroll useEffect
