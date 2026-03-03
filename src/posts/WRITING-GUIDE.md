---
id: 6
title:  写作指南 · 如何新建与管理文章
excerpt: 本文档面向博客内容维护者，涵盖：新建文章、frontmatter 字段说明、本地图片使用、常见问题排查。
date: 2025-02-18
category: 技术
tag: 管理
readTime: 15 分钟
cover: \images\1.png
featured: true
---

# 📝 写作指南 · 如何新建与管理文章

本文档面向博客内容维护者，涵盖：新建文章、frontmatter 字段说明、本地图片使用、常见问题排查。

---

## 目录

1. [快速开始：新建一篇文章](#1-快速开始新建一篇文章)
2. [Frontmatter 字段完整说明](#2-frontmatter-字段完整说明)
3. [本地图片的正确使用方式](#3-本地图片的正确使用方式)
4. [文章正文 Markdown 规范](#4-文章正文-markdown-规范)
5. [自动化机制说明](#5-自动化机制说明)
6. [常见问题 FAQ](#6-常见问题-faq)

---

## 1. 快速开始：新建一篇文章

### 第一步：在 `src/posts/` 目录下新建 `.md` 文件

文件命名规范：`YYYY-MM-DD-文章slug.md`

```
src/posts/
├── 2025-02-18-react-19.md       ✅ 推荐格式
├── 2025-01-10-kyoto.md
└── 2025-03-01-my-new-post.md    ← 新建
```

> 文件名中的日期会作为排序依据，slug 部分建议使用英文小写加连字符。

### 第二步：填写 frontmatter 和正文

```markdown
---
id: 6
title: 我的新文章标题
excerpt: 这里是摘要，会显示在文章列表卡片上，建议 50-100 字
date: 2025-03-01
category: 技术
tag: Vue
readTime: 5 分钟
cover: /images/my-cover.jpg
featured: false
---

## 正文从这里开始

直接写 Markdown 内容即可...
```

### 第三步：保存，自动刷新

保存文件后，Vite 热更新会自动刷新页面，文章**立即出现**在博客中，无需重启服务。

---

## 2. Frontmatter 字段完整说明

frontmatter 是文件顶部 `---` 包裹的 YAML 元数据区域，用于配置文章属性。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `id` | number / string | 否 | 文件名 | 文章唯一标识，用于路由 `/post/:id` |
| `title` | string | **是** | — | 文章标题 |
| `excerpt` | string | 否 | 正文前 120 字 | 卡片摘要 |
| `date` | string | **是** | — | 发布日期，格式 `YYYY-MM-DD` |
| `category` | string | 否 | `随笔` | 分类，决定筛选标签颜色 |
| `tag` | string | 否 | 空 | 主标签，显示在卡片上 |
| `readTime` | string | 否 | 自动估算 | 阅读时长，如 `8 分钟` |
| `cover` | string | 否 | 默认封面 | 封面图路径或 URL |
| `featured` | boolean | 否 | `false` | 是否显示为首页精选大卡片 |

### 分类与颜色对应

在 `src/data/loader.js` 的 `CATEGORY_COLORS` 中定义，目前支持：

| 分类 | 颜色 |
|------|------|
| 技术 | 🟡 金色 `#f59e0b` |
| 生活 | 🟢 绿色 `#10b981` |
| 思考 | 🟣 紫色 `#8b5cf6` |
| 效率 | 🔵 蓝色 `#3b82f6` |
| 随笔 | 🩷 粉色 `#ec4899` |

新增分类只需在 `CATEGORY_COLORS` 对象中添加对应条目即可。

---

## 3. 本地图片的正确使用方式

### ⚠️ 问题根因

本项目通过 Vite 的 `import.meta.glob(..., { query: '?raw' })` 将 `.md` 文件以**原始字符串**方式加载。这意味着 Markdown 正文中的相对路径图片（如 `./img/photo.jpg`）**不会经过 Vite 的资源处理管道**，在浏览器中会变成无效的本地文件路径：

```
# 浏览器实际请求的路径（错误）：
file:///E:/Develop/.../src/img/photo.jpg  ❌
```

### ✅ 正确方案：使用 `public/images/` 目录

Vite 的 `public/` 目录下的文件会被**直接复制**到构建产物根目录，开发和生产环境均可通过绝对路径访问。

**目录结构：**

```
personal-blog/
└── public/
    └── images/
        ├── covers/
        │   ├── react-19.jpg       ← 文章封面图
        │   └── kyoto.jpg
        └── posts/
            ├── react-screenshot.png   ← 文章正文内图片
            └── rust-benchmark.png
```

**在 Markdown 中引用：**

```markdown
<!-- 正文内图片 ✅ -->
![React DevTools 截图](/images/posts/react-screenshot.png)

<!-- 封面图（frontmatter）✅ -->
cover: /images/covers/react-19.jpg
```

**路径规则：**

| 写法 | 是否有效 | 说明 |
|------|----------|------|
| `/images/photo.jpg` | ✅ | 从 public/ 根目录引用，推荐 |
| `https://example.com/photo.jpg` | ✅ | 外部 URL，始终有效 |
| `./img/photo.jpg` | ❌ | 相对路径，经 raw 加载后失效 |
| `../assets/photo.jpg` | ❌ | 同上，不经过 Vite 资源处理 |

### 封面图使用外部 URL

如果不想管理本地图片，封面图也可以直接使用外部图片服务（如 Unsplash）：

```markdown
---
cover: https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=900&q=80
---
```

---

## 4. 文章正文 Markdown 规范

项目使用 `marked.js` 渲染 Markdown，支持 GFM（GitHub Flavored Markdown）语法，并通过 `highlight.js` 提供代码高亮。

### 标题层级

```markdown
## 一级章节（H2）
### 二级章节（H3）
#### 三级章节（H4）
```

> 正文中从 H2 开始，H1 已由文章标题占用。

### 代码块（支持高亮）

````markdown
```javascript
const hello = () => console.log('Hello World');
```

```python
def hello():
    print("Hello World")
```

```bash
npm run dev
```
````

支持的语言：`javascript` `typescript` `jsx` `tsx` `python` `rust` `go` `bash` `sql` `json` `yaml` `css` `html` 等。

### 引用块

```markdown
> 这是一段引用，会显示为左边带金色竖线的斜体样式。
```

### 表格

```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| A   | B   | C   |
```

### 行内代码

```markdown
使用 `useState` 管理组件状态。
```

### 图片（结合本地图片方案）

```markdown
![图片描述](/images/posts/my-screenshot.png)

<!-- 可选：添加标题 -->
![图片描述](/images/posts/my-screenshot.png "图片标题")
```

---

## 5. 自动化机制说明

### 文件加载流程

```
src/posts/*.md
      │
      ▼  import.meta.glob('?raw')        ← Vite 批量读取为原始字符串
      │
      ▼  parseFrontmatter()              ← src/utils/parseFrontmatter.js 解析元数据
      │
      ▼  loadPostsFromMarkdown()         ← src/data/loader.js 组装 posts 数组
      │
      ▼  按日期降序排列
      │
      ▼  导出给各页面组件消费
```

### 自动推断字段

当 frontmatter 中省略某些字段时，系统会自动处理：

- **`excerpt` 未填写** → 截取正文前 120 个字符（去除 Markdown 标记符）
- **`readTime` 未填写** → 按正文字数估算（中文约 300 字/分钟，代码块不计入）
- **`cover` 未填写** → 使用 `loader.js` 中配置的默认封面图
- **`category` 未填写** → 归类为「随笔」
- **`id` 未填写** → 使用文件名（去掉日期前缀和 `.md` 后缀）作为路由 id

### 热更新

开发模式下（`npm run dev`），Vite 会监听 `src/posts/` 目录变化。新增、修改、删除 `.md` 文件后，页面会**自动刷新**，无需手动操作。

---

## 6. 常见问题 FAQ

### Q：图片显示不出来，控制台报 `file:///` 路径错误

**原因：** 在 Markdown 中使用了相对路径引用图片（如 `./img/photo.jpg`）。

**解决：**
1. 将图片移动到 `public/images/` 目录
2. 将引用改为 `/images/photo.jpg`

---

### Q：新建的 `.md` 文件没有出现在博客中

按顺序检查：
1. 文件是否放在 `src/posts/` 目录下（注意不是 `public/posts/`）
2. frontmatter 是否包含必填的 `title` 和 `date` 字段
3. `date` 格式是否正确（必须是 `YYYY-MM-DD`，不能是 `2025/03/01`）
4. 打开浏览器控制台，查看是否有 `[Blog] 跳过...` 或解析报错信息

---

### Q：如何设置文章为首页精选（大卡片）

在 frontmatter 中设置 `featured: true`。首页只显示**最新一篇** featured 文章，如果多篇都设置了 `true`，日期最新的优先。

```markdown
---
featured: true
---
```

---

### Q：想新增一个分类，比如「安全」

编辑 `src/data/loader.js`，在 `CATEGORY_COLORS` 中添加：

```javascript
export const CATEGORY_COLORS = {
  技术: '#f59e0b',
  生活: '#10b981',
  思考: '#8b5cf6',
  效率: '#3b82f6',
  随笔: '#ec4899',
  安全: '#ef4444',   // ← 新增
};
```

然后在文章 frontmatter 中使用 `category: 安全` 即可。

---

### Q：文章中的代码块没有高亮

确认 `PostDetail.jsx` 中动态 import 了 `highlight.js`，且代码块指定了语言：

````markdown
```javascript   ← 必须指定语言
const x = 1;
```
````

不指定语言则不会高亮（显示纯文本）。

---

### Q：构建后图片又不见了

确认图片放在 `public/images/` 而非 `src/` 目录下。`npm run build` 只会复制 `public/` 目录的内容到产物，`src/` 下的静态资源如果没有被 JS 显式 import，不会被打包。

---

*文档版本：v2.1 · 最后更新：2025-03-01*
