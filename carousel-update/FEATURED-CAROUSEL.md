# 🎠 精选轮播文章 · 设置指南

本文档说明如何设置首页精选轮播，包括：添加/移除精选、轮播参数调整、常见问题。

---

## 目录

1. [效果说明](#1-效果说明)
2. [设置精选文章](#2-设置精选文章)
3. [调整轮播参数](#3-调整轮播参数)
4. [轮播交互说明](#4-轮播交互说明)
5. [精选文章的设计建议](#5-精选文章的设计建议)
6. [常见问题](#6-常见问题)

---

## 1. 效果说明

首页顶部的**精选轮播区**会自动展示所有 `featured: true` 的文章，具备以下特性：

| 特性 | 说明 |
|------|------|
| 🔄 自动播放 | 默认每 **5 秒**切换到下一篇 |
| ⏸ 悬停暂停 | 鼠标移入轮播区域自动暂停，移出继续 |
| ◀▶ 手动切换 | 左右箭头按钮，或键盘方向键 ← → |
| ● 圆点指示 | 右下角圆点显示当前位置，可点击跳转 |
| ▬ 进度条 | 底部细线实时显示当前幻灯片剩余播放时间 |
| 🎬 动画过渡 | 背景图淡入淡出，文字内容上移入场 |

**只有 1 篇精选时**：箭头、圆点、进度条均自动隐藏，退化为普通大卡片样式。

---

## 2. 设置精选文章

### 方法一：Markdown 文件（推荐）

在文章的 frontmatter 中设置 `featured: true`：

```markdown
---
id: 1
title: 深入探索 React 19 的新特性
date: 2025-02-18
category: 技术
tag: React
featured: true          ← 设为精选
---
```

**取消精选**：将值改为 `false` 或直接删除该行（默认为 `false`）：

```markdown
featured: false         ← 取消精选
```

### 方法二：批量查看当前精选列表

在浏览器控制台执行以下代码，可以看到当前所有精选文章：

```javascript
// 打开 DevTools → Console 粘贴执行
// （仅开发环境可用）
```

或直接搜索项目中的 md 文件：

```bash
# 在项目根目录执行
grep -r "featured: true" src/posts/
```

---

## 3. 调整轮播参数

打开 `src/pages/Home.jsx`，找到 `<FeaturedCarousel>` 组件，修改以下 props：

```jsx
<FeaturedCarousel
  posts={featuredPosts}
  interval={5000}     // ← 自动播放间隔（毫秒）
  autoPlay={true}     // ← 是否自动播放
/>
```

### 参数详解

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `posts` | `Post[]` | — | 精选文章数组，由 Home.jsx 自动传入，无需修改 |
| `interval` | `number` | `5000` | 自动切换间隔，单位毫秒（1000ms = 1s） |
| `autoPlay` | `boolean` | `true` | 是否开启自动播放 |

### 常用配置示例

```jsx
{/* 3 秒快速切换 */}
<FeaturedCarousel posts={featuredPosts} interval={3000} autoPlay={true} />

{/* 8 秒慢速切换，适合长文摘要 */}
<FeaturedCarousel posts={featuredPosts} interval={8000} autoPlay={true} />

{/* 关闭自动播放，只允许手动操作 */}
<FeaturedCarousel posts={featuredPosts} autoPlay={false} />
```

---

## 4. 轮播交互说明

### 用户可以通过以下方式操作轮播

| 操作 | 行为 |
|------|------|
| 鼠标移入 | 暂停自动播放，右上角显示「⏸ 已暂停」提示 |
| 鼠标移出 | 恢复自动播放，进度条重新开始计时 |
| 点击左箭头 `‹` | 切换到上一篇 |
| 点击右箭头 `›` | 切换到下一篇 |
| 键盘 `←` | 切换到上一篇 |
| 键盘 `→` | 切换到下一篇 |
| 点击右下角圆点 | 跳转到对应文章 |
| 点击卡片内容区 | 进入文章详情页 |

> **注意**：点击箭头和圆点不会触发页面跳转；只有点击文章标题/摘要/「阅读全文」区域才会跳转。

---

## 5. 精选文章的设计建议

### 封面图

精选卡片尺寸较大（高度约 360–500px），建议使用**横向宽幅图片**：

- 推荐尺寸：**1200 × 600px** 或以上
- 宽高比：约 **2:1**
- 图片尽量有**明暗对比**，避免全白背景（文字叠加在上方需要清晰可读）

```markdown
# 本地图片（放在 public/images/covers/ 下）
cover: /images/covers/react-19.jpg

# 外部图片（Unsplash 等）
cover: https://images.unsplash.com/photo-xxx?w=1200&q=80
```

### 标题

精选文章标题会以**大号字体**显示，建议：

- 控制在 **20 字以内**，避免换行过多
- 使用名词性短语，信息密度高

```markdown
# ✅ 好的标题
title: 深入探索 React 19 的并发模式

# ⚠️ 过长（会被截断或换行）
title: 关于我在2025年初尝试将项目从Node.js迁移到Rust之后的一些总结与反思
```

### 摘要

精选卡片摘要最多显示 **2 行**，多余内容自动隐藏：

```markdown
# ✅ 控制在 60-100 字
excerpt: React 19 带来了 Server Components、Actions 等革命性特性，从根本上改变前端开发范式。

# 不填写则自动截取正文前 120 字
```

### 精选数量建议

| 精选数量 | 效果 |
|---------|------|
| 0 篇 | 轮播区隐藏，直接显示文章列表 |
| 1 篇 | 静态大卡片，无轮播控件 |
| **2–4 篇** | **✅ 推荐，轮播效果最佳** |
| 5 篇以上 | 可用，但浏览体验下降，圆点过多 |

---

## 6. 常见问题

### Q：设置了 `featured: true` 但轮播没有更新

1. 确认文件保存了（Vite 热更新依赖文件变动）
2. 检查 frontmatter 格式是否正确（`featured: true` 不是 `featured: True` 或 `featured: "true"`）
3. 如果还不生效，在终端重新执行 `npm run dev`

---

### Q：想让最新的精选显示在第一张

`loader.js` 已按 `date` 字段降序排列，日期最新的文章自然排在第一张。确保文章的 `date` 字段填写正确即可：

```markdown
date: 2025-03-01    ← 日期越新，越靠前
```

---

### Q：想修改轮播切换的动画速度

打开 `src/components/blog/FeaturedCarousel.jsx`，找到以下样式属性修改：

```jsx
// 背景图淡入淡出速度
transition: 'opacity 0.7s ease'        // ← 改这里，如 0.4s 更快

// 文字入场动画速度
transition: 'all 0.45s cubic-bezier(0.22,1,0.36,1) 0.1s'  // ← 改这里
```

---

### Q：想修改进度条颜色

进度条颜色跟随文章的**分类颜色**（`CATEGORY_COLORS`），会自动变化。如需固定颜色，在 `FeaturedCarousel.jsx` 中找到进度条样式：

```jsx
background: `linear-gradient(90deg, ${color}, #ef4444)`
// 改为固定颜色，如：
background: 'linear-gradient(90deg, #f59e0b, #ef4444)'
```

---

*文档版本：v1.0 · 最后更新：2025-03-01*
