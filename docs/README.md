# 项目文档 · Personal Blog v2

> 技术栈：React 18 + Vite 5 + React Router v6 (Hash) + marked + highlight.js
> 无后端，Markdown 文件即内容源

---

## 目录

1. [快速开始](#1-快速开始)
2. [目录结构](#2-目录结构)
3. [架构设计](#3-架构设计)
4. [内容写作](#4-内容写作)
5. [精选轮播](#5-精选轮播)
6. [组件参考](#6-组件参考)
7. [主题与样式](#7-主题与样式)
8. [注意事项与踩坑记录](#8-注意事项与踩坑记录)
9. [常见问题 FAQ](#9-常见问题-faq)

---

## 1. 快速开始

```bash
npm install          # 安装依赖
npm run dev          # 启动开发服务器 (http://localhost:5173)
npm run build        # 生产构建 → dist/
npm run preview      # 预览生产构建
```

无测试框架，无 CI/CD 配置。

---

## 2. 目录结构

```
personal-blog/
├── public/
│   └── images/              # 静态图片（封面、正文图）
├── src/
│   ├── components/
│   │   ├── blog/            # FeaturedCard, FeaturedCarousel, PostCard, PostList
│   │   ├── common/          # AnimatedSection, Tag, Button
│   │   ├── Layout/          # Header, Footer
│   │   └── Sidebar/         # Profile, Stats, TagCloud
│   ├── data/
│   │   └── loader.js        # 扫描 src/posts/ 并导出 posts 数组
│   ├── hooks/
│   │   ├── useIntersection.js   # 滚动入场动画
│   │   ├── useSearch.js         # 搜索 + 分类过滤
│   │   └── useTheme.jsx         # 亮/暗主题切换
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── PostDetail.jsx
│   │   ├── Archive.jsx
│   │   └── About.jsx
│   ├── posts/               # ← Markdown 文章放这里
│   ├── styles/
│   │   └── global.css       # CSS 变量 + 全局样式
│   └── utils/
│       └── parseFrontmatter.js  # 轻量 YAML 解析
├── docs/                    # 项目文档（本文件）
├── CLAUDE.md                # AI 编码助手指引
├── vite.config.js
└── package.json
```

每个组件目录下有 `index.js` 作为桶导出（barrel export）。

---

## 3. 架构设计

### 三层分离

| 层 | 目录 | 职责 |
|----|------|------|
| 数据层 | `src/data/` | 扫描 .md 文件，解析 frontmatter，导出 `posts`、`SITE_CONFIG`、`CATEGORY_COLORS` |
| 逻辑层 | `src/hooks/` | 可复用业务逻辑（搜索、主题、动画） |
| 视图层 | `src/components/` `src/pages/` | 纯展示，props 驱动，无全局状态（除主题 Context） |

### 数据流

```
src/posts/*.md
    ↓  Vite import.meta.glob('?raw')
    ↓  parseFrontmatter()
    ↓  loader.js → posts[]（按日期降序）
    ↓
  pages/ → 通过 props 传给组件
```

### 路由（Hash 模式，兼容静态托管）

| 路径 | 页面 | 说明 |
|------|------|------|
| `/#/` | Home | 精选轮播 + 文章列表 + 侧边栏 |
| `/#/post/:id` | PostDetail | Markdown 渲染（marked + highlight.js） |
| `/#/archive` | Archive | 按年份分组的时间轴 |
| `/#/about` | About | 作者介绍 |

### 状态管理

- `useState` — 组件本地状态
- `ThemeProvider` (Context) — 唯一的全局状态，管理亮/暗主题
- 不使用 Redux / Zustand

---

## 4. 内容写作

### 新建文章

在 `src/posts/` 下新建 `.md` 文件，推荐命名：`YYYY-MM-DD-slug.md`

```markdown
---
title: 文章标题
date: 2025-03-01
category: 技术
tag: React
cover: /images/covers/my-cover.jpg
featured: false
---

## 正文从这里开始

支持标准 GFM 语法...
```

保存后 Vite 热更新自动刷新，文章立即出现。

### Frontmatter 字段

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|:----:|--------|------|
| `title` | string | **是** | — | 文章标题 |
| `date` | string | **是** | — | 格式 `YYYY-MM-DD` |
| `id` | number/string | 否 | 文件名 | 路由标识 `/post/:id` |
| `excerpt` | string | 否 | 正文前 120 字 | 卡片摘要 |
| `category` | string | 否 | `随笔` | 分类 |
| `tag` | string | 否 | 空 | 主标签 |
| `readTime` | string | 否 | 自动估算 | 如 `8 分钟` |
| `cover` | string | 否 | Unsplash 默认图 | 封面图路径或 URL |
| `featured` | boolean | 否 | `false` | 是否进入首页精选轮播 |

### 分类颜色（`CATEGORY_COLORS`）

| 分类 | 颜色 | 新增方式 |
|------|------|----------|
| 技术 | `#f59e0b` 金色 | 编辑 `src/data/loader.js` |
| 生活 | `#10b981` 绿色 | 的 `CATEGORY_COLORS` 对象 |
| 思考 | `#8b5cf6` 紫色 | 添加 `分类名: '#颜色'` 即可 |
| 效率 | `#3b82f6` 蓝色 | |
| 随笔 | `#ec4899` 粉色 | |

### 图片使用

**必须放在 `public/images/` 下，用绝对路径引用：**

```markdown
<!-- frontmatter 封面 -->
cover: /images/covers/react-19.jpg

<!-- 正文图片 -->
![截图](/images/posts/screenshot.png)

<!-- 外部 URL 也可以 -->
cover: https://images.unsplash.com/photo-xxx?w=900&q=80
```

| 写法 | 有效 | 原因 |
|------|:----:|------|
| `/images/photo.jpg` | ✅ | 从 public/ 引用 |
| `https://example.com/a.jpg` | ✅ | 外部 URL |
| `./img/photo.jpg` | ❌ | .md 以 raw string 加载，相对路径失效 |
| `\images\1.png` | ❌ | 反斜杠在浏览器中不是合法路径分隔符 |

### 代码块高亮

使用三个反引号 + 语言标识：

````markdown
```bash
echo "Hello World"
```

```javascript
const x = 1;
```
````

**必须指定语言**（如 `bash`、`javascript`、`jsx`、`python` 等），不指定则无高亮。

---

## 5. 精选轮播

首页顶部的精选轮播区自动展示所有 `featured: true` 的文章。

### 功能

| 特性 | 说明 |
|------|------|
| 自动播放 | 默认每 5 秒切换 |
| 悬停暂停 | 鼠标移入暂停，移出继续 |
| 手动切换 | 左右箭头按钮 / 键盘 ← → |
| 圆点指示 | 右下角，可点击跳转 |
| 进度条 | 底部细线，实时显示剩余时间 |

只有 1 篇精选时退化为静态大卡片，0 篇时轮播区隐藏。

### 调整参数

编辑 `src/pages/Home.jsx`：

```jsx
<FeaturedCarousel
  posts={featuredPosts}
  interval={5000}     // 切换间隔（毫秒）
  autoPlay={true}     // 是否自动播放
/>
```

### 精选文章建议

- 数量 **2–4 篇**效果最佳
- 封面图推荐 **1200×600px** 以上的横幅图，有明暗对比
- 标题控制在 **20 字以内**
- 摘要控制在 **60–100 字**

---

## 6. 组件参考

### Layout

| 组件 | 说明 |
|------|------|
| `Header` | 顶部导航栏，滚动后毛玻璃效果，含主题切换按钮 |
| `Footer` | 底部版权信息 |

### Common

| 组件 | Props | 说明 |
|------|-------|------|
| `AnimatedSection` | `children`, `delay=0` | 滚动入场动画包装器 |
| `Tag` | `label`, `color`, `filled`, `onClick` | 标签胶囊 |
| `Button` | `children`, `variant`, `onClick` | 通用按钮 |

### Blog

| 组件 | Props | 说明 |
|------|-------|------|
| `FeaturedCarousel` | `posts`, `interval=5000`, `autoPlay=true` | 精选轮播 |
| `FeaturedCard` | `post` | 精选大卡片（轮播内部使用） |
| `PostCard` | `post`, `index` | 文章列表卡片，左图右文 |
| `PostList` | `posts` | 文章列表 + 搜索框 + 分类筛选 |

### Sidebar

| 组件 | Props | 说明 |
|------|-------|------|
| `Profile` | 无 | 作者信息卡片，读 `SITE_CONFIG` |
| `Stats` | 无 | 博客统计数字 |
| `TagCloud` | 无 | 标签云 |

### Post 数据结构

```ts
{
  id: number | string   // 路由标识
  title: string
  excerpt: string
  date: string          // "YYYY-MM-DD"
  category: string
  tag: string
  readTime: string      // "8 分钟"
  cover: string         // 图片 URL
  featured: boolean
  content: string       // Markdown 正文
}
```

---

## 7. 主题与样式

### 方案

**CSS 变量（`global.css`）+ 组件内联样式**，无 CSS Modules，无 Tailwind。

### 主题切换

- `ThemeProvider`（`src/hooks/useTheme.jsx`）管理状态并设置 `<html data-theme="light|dark">`
- 状态持久化到 `localStorage`
- Header 中的按钮触发切换

### CSS 变量（摘要）

| 变量 | 用途 |
|------|------|
| `--bg` | 页面背景 |
| `--bg-card` | 卡片背景 |
| `--text-primary` | 主要文字 |
| `--text-secondary` | 次要文字 |
| `--text-muted` | 弱化文字 |
| `--accent` | 强调色（金色） |
| `--border` | 边框 |
| `--font-sans` | Noto Sans SC |
| `--font-serif` | Noto Serif SC |

### 样式规则

- **所有颜色必须用 CSS 变量**（`var(--text-primary)` 等），禁止硬编码颜色值
- 例外：FeaturedCard / FeaturedCarousel / PostDetail hero 区域的文字始终白色（在深色蒙层上）
- 代码高亮：暗色主题用 CDN 加载的 `atom-one-dark`，亮色主题在 `global.css` 中覆盖 `.hljs` 类

---

## 8. 注意事项与踩坑记录

### Markdown 渲染 — marked v12 的 renderer API

`marked v12` 的自定义 renderer 使用**位置参数**，不是对象解构：

```javascript
// ✅ 正确（位置参数）
renderer: {
  code(code, lang, escaped) { ... }
}

// ❌ 错误（会导致 code 为 undefined，渲染崩溃）
renderer: {
  code({ text, lang }) { ... }
}
```

如升级 marked 版本，务必核对 renderer API 签名是否变化。

### 图片路径必须用正斜杠

封面图和正文图片路径**必须使用正斜杠 `/`**：

```yaml
# ✅ 正确
cover: /images/covers/photo.jpg

# ❌ 错误（Windows 反斜杠，浏览器无法识别）
cover: \images\1.png
```

### frontmatter 格式严格要求

- `---` 必须在文件**第一行**，前面不能有空行或其他内容
- `featured: true` 不是 `featured: True` 也不是 `featured: "true"`
- `date` 格式必须是 `YYYY-MM-DD`（不是 `YYYY/MM/DD`）
- 缺少 `title` 或 `date` 的文件会被跳过，控制台输出警告

### 没有 frontmatter 的 .md 文件会被忽略

`src/posts/` 下所有 .md 文件都会被 Vite glob import 扫描。如果文件不以 `---` 开头或缺少必填字段，`loader.js` 会跳过它，不会报错但也不会显示。

检查方式：打开浏览器控制台，搜索 `[Blog] 跳过` 日志。

### `docs/` 下的 .md 不要加 frontmatter

`docs/` 目录不在 `src/posts/` 下，不会被 loader 扫描。但如果误将文档移入 `src/posts/`，带 frontmatter 的文档会被当作博客文章显示。

### Vite 配置 `base: './'`

使用相对路径，支持子目录部署。如果部署到域名根路径，可改为 `base: '/'`。

### 无 SSR / 无 SEO

纯客户端渲染 (CSR) + Hash 路由，搜索引擎无法索引文章内容。如需 SEO，建议迁移到 Astro 或 Next.js。

### highlight.js CDN 与 npm 版本

- CDN（`index.html`）：提供 `atom-one-dark` CSS 主题样式
- npm 包（`package.json`）：提供运行时高亮逻辑

两者版本不需要完全一致（class 名称稳定），但不建议大版本差距过大。

### `marked.use()` 是累积的

`PostDetail.jsx` 中每次进入文章页都会调用 `marked.use()`，配置会累积叠加。当前实现不会造成问题，但如果未来添加更多自定义 renderer，注意避免重复注册副作用。

---

## 9. 常见问题 FAQ

### Q：新建了 .md 但文章没出现

1. 文件是否在 `src/posts/` 下（不是 `public/`、不是 `docs/`）
2. 是否有 `---` 包裹的 frontmatter 且包含 `title` 和 `date`
3. 打开控制台看 `[Blog] 跳过` 日志

### Q：文章显示"渲染出错，请刷新重试"

`PostDetail.jsx` 中 marked 渲染失败。常见原因：
- marked 版本升级后 renderer API 变更（见注意事项）
- highlight.js 导入失败（检查网络）

### Q：图片不显示 / 控制台报 `file:///` 错误

图片必须放在 `public/images/` 下，用 `/images/xxx.jpg` 绝对路径引用。不支持相对路径。

### Q：封面图路径用了反斜杠 `\`

Windows 复制路径会带反斜杠。必须手动改为正斜杠 `/`。

### Q：代码块没有语法高亮

确认代码块指定了语言标识（如 ````javascript`、````bash`），不指定则无高亮。

### Q：想新增分类

编辑 `src/data/loader.js` 的 `CATEGORY_COLORS`，添加 `分类名: '#颜色码'`。

### Q：想修改站点信息（名称、简介等）

编辑 `src/data/loader.js` 的 `SITE_CONFIG` 对象。

### Q：精选轮播没更新

1. 确认 `featured: true`（注意大小写和类型）
2. 保存文件触发热更新
3. 无效则重启 `npm run dev`

---

*最后更新：2025-03-01*
