// ============================================================
//  Blog Data & Site Config
//  替换此文件中的内容来自定义你的博客
// ============================================================

/** 站点基本配置 */
export const SITE_CONFIG = {
  title: 'beixxchi 的博客',
  subtitle: '代码与文字之间，探索技术与人文的交汇地带。',
  author: 'beixxchi',
  email: 'hi@example.com',
  github: 'https://github.com',
  twitter: 'https://twitter.com',
  rss: '/rss.xml',
  avatar: '🧑‍💻',
  startYear: 2022,
};

/** 分类配置（名称 → 颜色） */
export const CATEGORY_COLORS = {
  技术: '#f59e0b',
  生活: '#10b981',
  思考: '#8b5cf6',
  效率: '#3b82f6',
  随笔: '#ec4899',
};

export const posts = [
  {
    id: 1,
    title: "深入探索 React 19 的新特性与并发模式",
    excerpt: "React 19 带来了革命性的并发特性，从 Server Components 到 Actions，每一个新功能都在重新定义前端开发的边界。让我们一起深入探索这些令人兴奋的变化。",
    date: '2025-02-18',
    category: '技术',
    tag: 'React',
    readTime: '8 分钟',
    cover: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=900&q=80',
    featured: true,
    content: "## 前言\n\nReact 19 是近年来最重要的版本更新之一。它不仅带来了性能层面的突破，更从根本上改变了我们思考 UI 构建的方式。\n\n## Server Components\n\nServer Components 允许组件在服务端渲染并直接流式传输到客户端，无需 JavaScript bundle。\n\n```jsx\n// app/page.jsx - 这是一个 Server Component\nasync function BlogPage() {\n  const posts = await db.posts.findAll();\n  return (\n    <ul>\n      {posts.map(post => (\n        <li key={post.id}>{post.title}</li>\n      ))}\n    </ul>\n  );\n}\n```\n\n> Server Components 和 Client Components 的边界由 `\"use client\"` 指令明确标记，这让架构决策更加显式。\n\n## Actions\n\nReact 19 引入了 Actions 的概念，用于处理数据变更：\n\n```jsx\nfunction UpdateName() {\n  const [name, setName] = useState('');\n  const [isPending, startTransition] = useTransition();\n\n  const handleSubmit = () => {\n    startTransition(async () => {\n      const error = await updateName(name);\n      if (error) return;\n      redirect('/profile');\n    });\n  };\n\n  return (\n    <div>\n      <input value={name} onChange={e => setName(e.target.value)} />\n      <button onClick={handleSubmit} disabled={isPending}>\n        {isPending ? '更新中...' : '更新'}\n      </button>\n    </div>\n  );\n}\n```\n\n## 新的 Hooks\n\n### useOptimistic\n\n乐观更新现在有了原生支持：\n\n```jsx\nconst [optimisticLikes, addOptimisticLike] = useOptimistic(\n  likes,\n  (state, newLike) => [...state, newLike]\n);\n```\n\n### use API\n\n全新的 `use` API 允许在渲染过程中读取资源：\n\n```jsx\nfunction Comments({ commentsPromise }) {\n  const comments = use(commentsPromise);\n  return comments.map(c => <p key={c.id}>{c.text}</p>);\n}\n```\n\n## 总结\n\nReact 19 的这些改变代表着前端框架向「服务端优先」和「流式渲染」方向的重要转变。建议从今天起开始学习 Next.js App Router，那是目前体验这些特性最完整的平台。",
  },
  {
    id: 2,
    title: "用 Rust 重写工具链：性能提升的真实案例",
    excerpt: "当我们把核心构建工具从 Node.js 迁移到 Rust 之后，构建时间缩短了 73%。这不仅仅是一次技术实验，更是一次对团队认知的彻底刷新。",
    date: '2025-01-30',
    category: '技术',
    tag: 'Rust',
    readTime: '12 分钟',
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&q=80',
    featured: false,
    content: "## 背景\n\n我们的前端项目随着业务增长，构建时间从最初的 30 秒膨胀到了 4 分钟。这严重影响了开发体验和 CI/CD 效率。\n\n## 为什么选择 Rust\n\n- **零成本抽象**：Rust 的性能与 C/C++ 相当，但有现代化的语言特性\n- **内存安全**：编译期排除了大量运行时错误\n- **生态成熟**：Tokio、Rayon 等异步和并行库已经非常稳定\n\n## 迁移过程\n\n### 第一阶段：识别瓶颈\n\n使用 Node.js 性能分析工具定位热点：\n\n```bash\nnode --prof build.js\nnode --prof-process isolate-*.log > profile.txt\n```\n\n结论：60% 的时间花在文件 I/O 和字符串处理上。\n\n### 第二阶段：Rust 重写核心模块\n\n```rust\nuse rayon::prelude::*;\nuse std::fs;\n\npub fn process_files(paths: Vec<String>) -> Vec<ProcessedFile> {\n    paths\n        .par_iter()\n        .map(|path| {\n            let content = fs::read_to_string(path).unwrap();\n            transform(content)\n        })\n        .collect()\n}\n```\n\n### 第三阶段：Node.js FFI 桥接\n\n使用 `napi-rs` 将 Rust 模块暴露给 Node.js：\n\n```rust\n#[napi]\npub fn process(files: Vec<String>) -> Vec<String> {\n    // Rust 处理逻辑\n}\n```\n\n## 结果\n\n| 指标 | 迁移前 | 迁移后 | 提升 |\n|------|--------|--------|------|\n| 冷构建 | 4m 12s | 1m 8s | **-73%** |\n| 热构建 | 45s | 11s | **-76%** |\n| 内存峰值 | 2.8 GB | 0.9 GB | **-68%** |\n\n## 总结\n\nRust 迁移的最大收益不只是性能数字，而是团队对系统底层的理解深度得到了显著提升。",
  },
  {
    id: 3,
    title: "旅行笔记：在京都的十二天",
    excerpt: "樱花还未落尽，石板路上的雨水倒映着千年古寺。我在这座城市里慢慢走，试图理解那种东方式的从容与克制，最终却发现自己只是一名安静的旁观者。",
    date: '2025-01-10',
    category: '生活',
    tag: '旅行',
    readTime: '6 分钟',
    cover: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&q=80',
    featured: false,
    content: "## 第一天：抵达\n\n从关西空港出来，外面飘着细雨。我没有打伞，直接走向利木津巴士的候车亭。日本的细雨是温柔的，不像南方那种密不透风的梅雨，它轻轻落在衬衫上，凉意刚好。\n\n## 岚山\n\n嵯峨野竹林是我去过最被过度拍摄的地方，但它依然美得让我沉默。竹节与竹节之间透过来的光，把整条小径切割成金色的碎片。\n\n> 真正的美不需要被解释，它只是在那里，等待你停下来。\n\n## 伏见稻荷\n\n三千座鸟居，每一座都由企业或个人捐建，刻着名字和日期。走在里面，你会忘记自己是一个现代人。\n\n我在山腰的茶屋里吃了一碗豆腐汤，店主是位七十多岁的老人，他不会说英语，我不会说日语，但我们完成了一次完整的交易，并且都对彼此笑了。\n\n## 离开前\n\n在新干线上，看着窗外的田野飞速后退，我试着记住这十二天里最重要的事情。最后我想到的是那碗豆腐汤，和那位老人的眼睛。\n\n有些东西是语言无法传递的。旅行最好的部分，恰恰是那些说不清楚的时刻。",
  },
  {
    id: 4,
    title: "AI 时代的程序员：焦虑还是机遇？",
    excerpt: "每隔几个月就有人宣布「程序员已死」。但当我坐下来与 Claude 协作完成一个复杂项目时，我意识到：消亡的不是程序员，而是某种单一的工作方式。",
    date: '2024-12-22',
    category: '思考',
    tag: 'AI',
    readTime: '10 分钟',
    cover: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=900&q=80',
    featured: false,
    content: "## 恐慌从何而来\n\n2023 年 GPT-4 发布后，「程序员将被取代」的讨论就从未停止过。我的朋友圈里开始出现大量焦虑的帖子，有人开始学产品，有人开始学设计，仿佛技术能力正在快速贬值。\n\n但我的实际感受却恰恰相反。\n\n## 协作而非替代\n\n过去一年里，我大量使用 AI 辅助编程工具。我的结论是：**AI 是一个无限耐心的初级程序员，而你是那个知道要做什么的人**。\n\n这个比喻很重要。初级程序员能写代码，但他需要你来：\n\n- 定义问题边界\n- 判断方案的合理性\n- 在多种技术路线中做选择\n- 对最终结果负责\n\n这些能力，AI 目前还无法替代。\n\n## 真正的威胁\n\n真正被威胁的不是「程序员」这个职业，而是某种**只会执行，不会思考**的工作方式。\n\n如果你的工作是「把这个 API 返回的数据渲染成表格」，那你确实很危险。但如果你的工作是「理解业务，设计系统，带领团队交付」，那 AI 只会让你更强。\n\n## 我的建议\n\n1. **学会与 AI 协作**，而不是逃避它\n2. **投资系统性思维**，这是 AI 最薄弱的地方\n3. **保持对技术本质的好奇**，不要只会调用接口\n\n这个时代最好的程序员，将是那些能够把 AI 的能力放大十倍的人。",
  },
  {
    id: 5,
    title: "构建个人知识库：我的 Obsidian 工作流",
    excerpt: "花了三年时间折腾各种笔记软件，最终在 Obsidian 上安定下来。不是因为它最完美，而是因为它最诚实——它把复杂度还给了你自己。",
    date: '2024-12-05',
    category: '效率',
    tag: '工具',
    readTime: '9 分钟',
    cover: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=900&q=80',
    featured: false,
    content: "## 我用过的笔记工具\n\n- Evernote（2015-2018）：功能太多，太臃肿\n- Notion（2018-2022）：漂亮但太慢，依赖网络\n- Roam Research（2021）：双向链接很酷，但价格劝退\n- **Obsidian（2022-至今）**：最终归宿\n\n## 为什么是 Obsidian\n\n核心原因只有一个：**本地 Markdown 文件**。\n\n你的笔记就是你硬盘上的 .md 文件。没有数据库，没有专有格式，没有云端锁定。就算 Obsidian 这家公司倒闭，你的笔记也完好无损。\n\n## 我的文件夹结构\n\n```\nVault/\n├── Inbox/          # 随手记，待整理\n├── Notes/          # 永久笔记（Zettelkasten 风格）\n├── Projects/       # 项目相关笔记\n├── Areas/          # 持续关注的领域\n├── Resources/      # 参考资料\n└── Archive/        # 已完成/过期内容\n```\n\n## 核心工作流\n\n### 1. 快速捕捉\n用手机端 Obsidian + iCloud 同步。任何想法、链接、灵感，先扔进 Inbox。\n\n### 2. 每日整理（15 分钟）\n每天早上翻一遍 Inbox，决定每条笔记的归属。\n\n### 3. 笔记原子化\n每个笔记只讲一件事。标题是一个完整的观点，而不是一个话题。\n\n- 错误示例：笔记标题叫「React Hooks」\n- 正确示例：「useEffect 的依赖数组决定了副作用的执行时机」\n\n## 最重要的插件\n\n| 插件 | 用途 |\n|------|------|\n| Dataview | 用 SQL 查询你的笔记 |\n| Templater | 强大的模板系统 |\n| Calendar | 日记日历视图 |\n| Excalidraw | 手绘风格思维导图 |\n\n## 结语\n\n完美的笔记系统不存在。重要的是开始记，然后持续迭代你的系统。",
  }
];

/** 获取所有唯一分类 */
export const getAllCategories = () => {
  const cats = [...new Set(posts.map(p => p.category))];
  return ['全部', ...cats];
};

/** 获取所有唯一标签 */
export const getAllTags = () => {
  return [...new Set(posts.map(p => p.tag))];
};

/** 按年份分组（用于归档页） */
export const getPostsByYear = () => {
  const map = {};
  posts.forEach(post => {
    const year = post.date.slice(0, 4);
    if (!map[year]) map[year] = [];
    map[year].push(post);
  });
  return Object.entries(map).sort((a, b) => b[0] - a[0]);
};
