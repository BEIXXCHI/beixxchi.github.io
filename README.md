# 🌙 Personal Blog — React + Vite

一个优雅的深色风格个人博客，基于 React 18 + Vite + React Router v6 构建，支持模块化开发、主题定制，无需后端即可运行。

## ✨ 功能特性

- 📄 **多页面路由** — 首页 / 文章详情 / 归档 / 关于
- 🎨 **深色优雅主题** — 金琥珀色调，衬线中文字体，流畅动画
- 🔍 **实时搜索 & 分类筛选**
- ♾️ **滚动触发动画** — IntersectionObserver 驱动
- 📱 **响应式布局** — 移动端友好
- 🧩 **完全模块化** — 每个 UI 单元均独立组件
- 📊 **Markdown 渲染** — 文章详情支持 marked.js

## 📁 项目结构

```
personal-blog/
├── README.md
├── package.json
├── vite.config.js
├── index.html
├── docs/
│   ├── ARCHITECTURE.md        # 架构设计说明
│   └── COMPONENTS.md          # 组件文档
├── public/
└── src/
    ├── main.jsx               # 入口文件
    ├── App.jsx                # 路由配置
    ├── styles/
    │   └── global.css         # 全局样式 & CSS 变量
    ├── data/
    │   └── posts.js           # 博客数据 (可替换为 API)
    ├── hooks/
    │   ├── useIntersection.js # 滚动可见性 Hook
    │   └── useSearch.js       # 搜索过滤 Hook
    ├── components/
    │   ├── Layout/
    │   │   ├── Header.jsx     # 顶部导航 (sticky + blur)
    │   │   ├── Footer.jsx     # 底部版权
    │   │   └── index.js
    │   ├── common/
    │   │   ├── AnimatedSection.jsx  # 入场动画包装器
    │   │   ├── Tag.jsx              # 标签/分类胶囊
    │   │   ├── Button.jsx           # 通用按钮
    │   │   └── index.js
    │   ├── blog/
    │   │   ├── FeaturedCard.jsx     # 精选文章大卡片
    │   │   ├── PostCard.jsx         # 文章列表卡片
    │   │   ├── PostList.jsx         # 文章列表 + 筛选
    │   │   └── index.js
    │   └── Sidebar/
    │       ├── Profile.jsx          # 作者信息卡
    │       ├── Stats.jsx            # 博客数据统计
    │       ├── TagCloud.jsx         # 标签云
    │       └── index.js
    └── pages/
        ├── Home.jsx           # 首页
        ├── PostDetail.jsx     # 文章详情
        ├── Archive.jsx        # 归档页
        └── About.jsx          # 关于页
```

## 🚀 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 构建生产版本
npm run build
```

## 🛠 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.x | UI 框架 |
| Vite | 5.x | 构建工具 |
| React Router | 6.x | 客户端路由 |
| marked | 12.x | Markdown 渲染 |
| highlight.js | 11.x | 代码高亮 |

## ⚙️ 自定义配置

### 修改博客信息
编辑 `src/data/posts.js` 中的 `SITE_CONFIG` 对象：
```js
export const SITE_CONFIG = {
  title: "你的博客名",
  subtitle: "你的签名",
  author: "你的昵称",
  github: "https://github.com/yourname",
  twitter: "https://twitter.com/yourname",
};
```

### 修改主题色
编辑 `src/styles/global.css` 中的 CSS 变量：
```css
:root {
  --accent: #f59e0b;      /* 主色调 */
  --accent-2: #ef4444;    /* 渐变辅色 */
  --bg: #0c0c0e;          /* 背景色 */
}
```

### 添加文章
在 `src/data/posts.js` 的 `posts` 数组中添加新条目，支持 Markdown 格式的 `content` 字段。

## 📖 文档

- [架构设计](./docs/ARCHITECTURE.md)
- [组件文档](./docs/COMPONENTS.md)

## 📄 License

MIT
