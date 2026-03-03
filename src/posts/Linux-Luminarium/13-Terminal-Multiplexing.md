# 13 - Terminal Multiplexing 🖥️ | 终端复用

> 🔗 **模块地址**：[https://pwn.college/linux-luminarium/terminal-multiplexing/](https://pwn.college/linux-luminarium/terminal-multiplexing/)
> ⭐ **难度**：⭐⭐（入门友好，但概念很重要）
> 🎯 **核心主题**：`screen` 和 `tmux` — 终端复用器的使用
> 📦 **挑战数量**：6 个
> 🏷️ **关键词**：terminal multiplexer, session, detach, reattach, window, pane

---

## 📖 模块概述

想象一下这个场景 😱：你通过 SSH 连接到远程服务器，正在跑一个需要 3 小时的编译任务……然后你的网络断了。**一切都没了。** 进程被杀死，输出消失，你只能从头再来。

**终端复用器（Terminal Multiplexer）** 就是解决这个问题的神器！🦸‍♂️

终端复用器的核心能力：

| 功能 | 说明 | 为什么重要 |
|------|------|-----------|
| 🔄 **会话持久化** | 断开连接后进程继续运行 | SSH 断了也不怕！ |
| 📺 **多窗口** | 一个终端里开多个 "标签页" | 不用开 10 个终端窗口 |
| 🪟 **面板分割** | 把一个窗口分成多个区域 | 同时看日志 + 写代码 |
| 🤝 **会话共享** | 多人连接同一个会话 | 结对编程利器 |

本模块介绍两大终端复用工具：

- 🏛️ **screen** — 老牌经典，1987 年就有了！
- 🚀 **tmux** — 现代主流，功能更强大

### 🧠 核心概念：三层结构

无论是 screen 还是 tmux，都有类似的层级概念：

```
┌─────────────────────────────────────────┐
│              Session（会话）              │
│  ┌──────────────┐  ┌──────────────┐     │
│  │  Window 0    │  │  Window 1    │     │
│  │  ┌────┬────┐ │  │              │     │
│  │  │Pane│Pane│ │  │   (单面板)    │     │
│  │  │ 0  │ 1  │ │  │              │     │
│  │  └────┴────┘ │  │              │     │
│  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────┘
```

- **Session（会话）** 🗂️：最外层容器，可以 detach（分离）和 reattach（重连）
- **Window（窗口）** 🪟：一个会话里的"标签页"，每个窗口占满整个屏幕
- **Pane（面板）** 📐：一个窗口里的分割区域（tmux 特色，screen 也支持但不如 tmux 好用）

### 🔑 前缀键（Prefix Key）

这是操作终端复用器的**灵魂**！所有快捷键都要先按前缀键：

| 工具 | 前缀键 | 记忆方法 |
|------|--------|---------|
| screen | `Ctrl+A` | **A** = Activate |
| tmux | `Ctrl+B` | **B** 紧跟 A 之后，新一代 |

> ⚠️ **操作方式**：先按住 `Ctrl` + 前缀字母，**松开**，再按功能键！不是同时按三个键！

---

## 🔧 涉及的命令

### 📟 `screen` — GNU Screen 终端复用器

**语法**：
```bash
screen [选项] [命令]
```

**作用**：在一个物理终端内创建和管理多个虚拟终端会话 🖥️

**常用参数**：

| 参数 | 作用 | 示例 |
|------|------|------|
| （无参数） | 创建新会话 | `screen` |
| `-S name` | 创建命名会话 | `screen -S mywork` |
| `-r [name]` | 重新连接会话 | `screen -r mywork` |
| `-ls` | 列出所有会话 | `screen -ls` |
| `-d` | 远程分离一个会话 | `screen -d mywork` |
| `-d -r` | 先分离再重连（强制） | `screen -d -r mywork` |
| `-x` | 多人共享同一会话 | `screen -x mywork` |

**示例**：

```bash
# 🎬 启动一个新的 screen 会话
hacker@dojo:~$ screen

# 🏷️ 启动一个命名会话（推荐！方便管理）
hacker@dojo:~$ screen -S compile-job

# 📋 查看所有运行中的会话
hacker@dojo:~$ screen -ls
There are screens on:
    23847.compile-job   (Detached)
    23851.monitoring    (Detached)
2 Sockets in /run/screen/S-hacker.

# 🔗 重新连接到指定会话
hacker@dojo:~$ screen -r compile-job

# 💪 强制重连（如果会话还标记为 Attached）
hacker@dojo:~$ screen -d -r compile-job
```

**screen 内部快捷键**（前缀 `Ctrl+A`）：

| 快捷键 | 功能 | 说明 |
|--------|------|------|
| `Ctrl+A` `d` | 🚪 分离会话 | 会话继续在后台运行 |
| `Ctrl+A` `c` | ➕ 新建窗口 | 创建新的虚拟终端 |
| `Ctrl+A` `n` | ➡️ 下一个窗口 | Next |
| `Ctrl+A` `p` | ⬅️ 上一个窗口 | Previous |
| `Ctrl+A` `0-9` | 🔢 跳转窗口 | 直接去第 N 个窗口 |
| `Ctrl+A` `"` | 📜 窗口列表 | 弹出选择菜单 |
| `Ctrl+A` `k` | ❌ 杀死窗口 | Kill current window |
| `Ctrl+A` `?` | ❓ 帮助 | 查看所有快捷键 |

> ⚠️ **注意事项**：
> - `Ctrl+A` 在 bash 中原本是"跳到行首"的快捷键，进入 screen 后会被拦截！
> - 要在 screen 内发送真正的 `Ctrl+A`，需要按 `Ctrl+A` `a`（按两次）
> - 退出 screen 窗口用 `exit` 或 `Ctrl+D`，所有窗口关闭后会话终止

---

### 🚀 `tmux` — Terminal Multiplexer

**语法**：
```bash
tmux [命令] [参数]
```

**作用**：现代终端复用器，screen 的升级替代品 ✨

**常用子命令**：

| 命令 | 作用 | 示例 |
|------|------|------|
| `tmux` | 创建新会话 | `tmux` |
| `tmux new -s name` | 创建命名会话 | `tmux new -s dev` |
| `tmux ls` | 列出会话 | `tmux ls` |
| `tmux attach` / `tmux a` | 连接会话 | `tmux a -t dev` |
| `tmux kill-session -t name` | 杀死会话 | `tmux kill-session -t dev` |
| `tmux kill-server` | 杀死所有会话 | `tmux kill-server` |

**示例**：

```bash
# 🎬 启动新会话
hacker@dojo:~$ tmux

# 🏷️ 启动命名会话
hacker@dojo:~$ tmux new -s project-x

# 📋 列出所有会话
hacker@dojo:~$ tmux ls
project-x: 1 windows (created Mon Feb 16 22:00:00 2026)
debug: 2 windows (created Mon Feb 16 22:15:00 2026)

# 🔗 连接到指定会话
hacker@dojo:~$ tmux attach -t project-x
# 简写
hacker@dojo:~$ tmux a -t project-x

# 💀 杀死指定会话
hacker@dojo:~$ tmux kill-session -t debug
```

**tmux 内部快捷键**（前缀 `Ctrl+B`）：

| 快捷键 | 功能 | 说明 |
|--------|------|------|
| `Ctrl+B` `d` | 🚪 分离会话 | Detach |
| `Ctrl+B` `c` | ➕ 新建窗口 | Create window |
| `Ctrl+B` `n` | ➡️ 下一个窗口 | Next window |
| `Ctrl+B` `p` | ⬅️ 上一个窗口 | Previous window |
| `Ctrl+B` `0-9` | 🔢 跳转窗口 | Go to window N |
| `Ctrl+B` `w` | 📜 窗口选择器 | Window picker |
| `Ctrl+B` `%` | ↔️ 左右分割面板 | Vertical split |
| `Ctrl+B` `"` | ↕️ 上下分割面板 | Horizontal split |
| `Ctrl+B` `方向键` | 🔀 切换面板 | Navigate panes |
| `Ctrl+B` `z` | 🔍 最大化/还原面板 | Zoom toggle |
| `Ctrl+B` `x` | ❌ 关闭当前面板 | Kill pane |
| `Ctrl+B` `?` | ❓ 帮助 | List all keybindings |

> ⚠️ **注意事项**：
> - tmux 的状态栏在屏幕**底部**，会显示窗口列表，`*` 标记当前窗口
> - `Ctrl+B` 在 bash 中原本是"光标左移"，进入 tmux 后被拦截
> - tmux 配置文件在 `~/.tmux.conf`，可以高度自定义

---

### 🔄 screen vs tmux 对比速查表

| 功能 | screen | tmux |
|------|--------|------|
| 前缀键 | `Ctrl+A` | `Ctrl+B` |
| 创建会话 | `screen` / `screen -S name` | `tmux` / `tmux new -s name` |
| 分离 | `Ctrl+A` `d` | `Ctrl+B` `d` |
| 列出会话 | `screen -ls` | `tmux ls` |
| 重连 | `screen -r [name]` | `tmux a [-t name]` |
| 新建窗口 | `Ctrl+A` `c` | `Ctrl+B` `c` |
| 下一窗口 | `Ctrl+A` `n` | `Ctrl+B` `n` |
| 上一窗口 | `Ctrl+A` `p` | `Ctrl+B` `p` |
| 窗口列表 | `Ctrl+A` `"` | `Ctrl+B` `w` |
| 左右分割 | `Ctrl+A` `\|` | `Ctrl+B` `%` |
| 上下分割 | `Ctrl+A` `S` | `Ctrl+B` `"` |
| 状态栏 | 默认隐藏 | 默认显示 ✅ |
| 鼠标支持 | 有限 | 更好 ✅ |
| 脚本化 | 一般 | 强大 ✅ |

---

## 🎯 挑战解析

### 挑战 1：Let's dive right in! 🏊

> **目标**：启动 screen

**提示**：直接输入 `screen` 即可获得 flag！最简单的入门挑战 🎉

```bash
hacker@dojo:~$ screen
# flag 直接出现！
# 完成后用 exit 或 Ctrl+D 退出
```

---

### 挑战 2：Detaching 🚪

> **目标**：学习 screen 的分离与重连

**提示**：三步走！

```bash
# 1️⃣ 启动 screen
hacker@dojo:~$ screen

# 2️⃣ 在 screen 内，按 Ctrl+A 然后按 d 分离
#    看到 [detached from ...] 说明成功！

# 3️⃣ 回到原始 shell 后，运行挑战程序
hacker@dojo:~$ /challenge/run

# 4️⃣ 重新连接查看 flag
hacker@dojo:~$ screen -r
```

> 💡 `/challenge/run` 会把 flag 发送到你的 detached session 中，所以必须 reattach 才能看到！

---

### 挑战 3：Screen Detective 🕵️

> **目标**：在多个 screen 会话中找到隐藏的 flag

**提示**：

```bash
# 📋 列出所有会话
hacker@dojo:~$ screen -ls

# 🔍 逐个检查，找到有 flag 的那个
hacker@dojo:~$ screen -r <session-name>
# 没有 flag？按 Ctrl+A d 分离，试下一个

# 💡 三个会话，一个有 flag，两个是诱饵
```

---

### 挑战 4：Screen Windows 🪟

> **目标**：在 screen 窗口之间切换

**提示**：

```bash
# 🔗 连接到预创建的会话
hacker@dojo:~$ screen -r

# 你会进入 Window 1（欢迎信息）
# 🔢 按 Ctrl+A 然后按 0，切换到 Window 0
# 或者按 Ctrl+A n / Ctrl+A p 切换
# Flag 在其中一个窗口里！
```

---

### 挑战 5：tmux Detach 🚀

> **目标**：用 tmux 完成分离与重连（和挑战 2 一样，但用 tmux）

**提示**：

```bash
# 1️⃣ 启动 tmux
hacker@dojo:~$ tmux

# 2️⃣ 按 Ctrl+B 然后按 d 分离

# 3️⃣ 运行挑战
hacker@dojo:~$ /challenge/run

# 4️⃣ 重新连接
hacker@dojo:~$ tmux attach
```

> 💡 注意是 `Ctrl+B`，不是 `Ctrl+A`！别和 screen 搞混了 😅

---

### 挑战 6：tmux Windows 🪟

> **目标**：在 tmux 窗口之间切换

**提示**：

```bash
# 🔗 连接到预创建的 tmux 会话
hacker@dojo:~$ tmux attach

# 你会进入 Window 1（欢迎信息）
# 👀 看底部状态栏：0:bash  1:bash*
#     * 号表示当前窗口

# 🔢 按 Ctrl+B 然后按 0，切换到 Window 0
# Flag 在 Window 0！
```

---

## 📚 知识扩展

### 🔧 tmux 自定义配置

tmux 的配置文件是 `~/.tmux.conf`，你可以定制几乎一切！

```bash
# ~/.tmux.conf 常用配置

# 🔄 把前缀键改成 Ctrl+A（screen 用户福音！）
unbind C-b
set -g prefix C-a
bind C-a send-prefix

# 🖱️ 启用鼠标支持（可以用鼠标切换面板、调整大小）
set -g mouse on

# 🔢 窗口编号从 1 开始（而不是 0）
set -g base-index 1
setw -g pane-base-index 1

# ⌨️ 用更直觉的键分割面板
bind | split-window -h    # | 左右分割
bind - split-window -v    # - 上下分割

# 🎨 256 色支持
set -g default-terminal "screen-256color"

# ⏱️ 状态栏显示时间
set -g status-right '%H:%M %Y-%m-%d'
```

修改后运行 `tmux source-file ~/.tmux.conf` 重新加载 🔄

### 🧩 tmux 进阶技巧

**复制模式**（Copy Mode）📋：
```
Ctrl+B [          # 进入复制模式（可以用方向键/Page Up 翻页）
q                 # 退出复制模式
```

**命令模式** 💻：
```
Ctrl+B :          # 进入命令模式（类似 vim 的 : ）
:resize-pane -D 5 # 向下调整面板大小 5 行
:swap-window -t 0 # 把当前窗口移到位置 0
```

**同步输入**（Synchronize Panes）🔗：
```
Ctrl+B : setw synchronize-panes on
# 现在你在任何面板输入的内容会同时发到所有面板！
# 批量操作多台服务器的神器 🤯
```

### 🤔 screen vs tmux：该学哪个？

**推荐 tmux** 🚀，原因：
- 更活跃的社区和开发
- 更强大的脚本能力
- 更好的面板管理
- 更现代的配置语法
- 原生支持状态栏

**但 screen 也要了解** 🏛️，因为：
- 很多老系统只有 screen
- 有些自动化脚本依赖 screen
- 面试时可能被问到

### 🌐 实际应用场景

1. **远程服务器管理** 🖥️ — SSH 到服务器后启动 tmux，即使断开也不怕
2. **长时间任务** ⏳ — 编译、训练模型、跑测试……分离后去喝杯咖啡 ☕
3. **多任务监控** 📊 — 一个面板看日志，一个面板写代码，一个面板跑测试
4. **结对编程** 👥 — 两个人 attach 到同一个会话，实时协作
5. **IDE 替代** 💡 — vim + tmux = 穷人版 IDE（但超级强大！）

---

## 🏆 最佳实践

### ✅ DO — 推荐做法

1. **总是给会话命名** 🏷️
   ```bash
   tmux new -s project-name    # ✅ 好
   tmux                         # ❌ 会话叫 "0"，不好找
   ```

2. **养成 detach 的习惯** 🚪
   - 不要用 `exit` 关闭，用 `Ctrl+B d` 分离
   - 下次直接 `tmux a` 回来，所有状态都在

3. **学习常用快捷键** ⌨️
   - 不需要全记住，先掌握：detach、新窗口、切换窗口、分割面板

4. **使用配置文件** 📝
   - 把你的 `~/.tmux.conf` 加入 dotfiles 版本控制
   - 到哪台机器都能快速部署

5. **利用状态栏** 📊
   - tmux 底部状态栏能显示时间、主机名、系统信息等

### ❌ DON'T — 避免的做法

1. **不要嵌套 tmux/screen** 🪆
   - tmux 里再开 tmux 会搞混前缀键
   - 如果必须嵌套，用 `Ctrl+B Ctrl+B` 发送前缀到内层

2. **不要忘记清理旧会话** 🧹
   ```bash
   tmux ls                         # 看看有多少僵尸会话
   tmux kill-session -t old-stuff  # 清理掉
   ```

3. **不要在 tmux 内运行 GUI 程序** 🖼️
   - tmux 是纯文本终端，GUI 程序无法显示

---

## 📝 小结

🎉 恭喜完成 **Terminal Multiplexing** 模块！

在这个模块中，我们学会了：

| 学到了什么 | 关键命令 |
|-----------|---------|
| 🏛️ screen 基本操作 | `screen`, `screen -r`, `Ctrl+A d` |
| 📋 会话管理 | `screen -ls`, `screen -r <name>` |
| 🪟 screen 窗口切换 | `Ctrl+A c/n/p/0-9` |
| 🚀 tmux 基本操作 | `tmux`, `tmux a`, `Ctrl+B d` |
| 🪟 tmux 窗口切换 | `Ctrl+B c/n/p/0-9/w` |

**核心收获** 💎：
- 终端复用器让你的终端会话**不依赖于连接** — SSH 断了进程照跑
- `screen` 是经典，`tmux` 是主流，两个都要会
- 前缀键是灵魂：screen 用 `Ctrl+A`，tmux 用 `Ctrl+B`
- 记住三层结构：**Session → Window → Pane**

> 🔮 **下一站预告**：Linux Luminarium 的旅程到这里就告一段落了！你已经从一个 Linux 新手成长为能够熟练使用命令行的 hacker 🎓。接下来可以挑战更高级的模块，比如 **pwn.college** 的安全相关课程，把这些 Linux 基础运用到实际的安全研究中去！加油 💪🔥
