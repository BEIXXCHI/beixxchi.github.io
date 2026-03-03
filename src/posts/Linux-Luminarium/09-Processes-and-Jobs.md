# ⚙️ 模块 08：Processes and Jobs — 进程与作业控制

> **pwn.college Linux Luminarium** 第八关
> 🔗 [https://pwn.college/linux-luminarium/processes/](https://pwn.college/linux-luminarium/processes/)
> ⭐ 难度：★★★☆☆
> 🎯 核心主题：进程管理、PID、信号、前台/后台、作业控制、/proc 文件系统

---

## 📖 模块概述

你在 Shell 里敲的每一条命令，都会变成一个 **进程（Process）** 🏃 在系统中运行。理解进程是掌握 Linux 的关键一步——它让你能：

- 👀 **查看**系统中正在运行什么
- 🔪 **终止**不听话的程序
- 🎛️ **控制**程序在前台还是后台运行
- 📡 用**信号**与进程通信
- 🔍 通过 `/proc` 深入了解进程内部状态

---

## 🧠 核心概念

### 1. 什么是进程？

进程 = **正在运行的程序实例**。一个程序文件可以产生多个进程。

每个进程都有：

| 属性 | 说明 | 示例 |
|------|------|------|
| **PID** | 进程 ID，唯一标识符 | `1234` |
| **PPID** | 父进程 ID | `1`（init/systemd） |
| **UID** | 运行该进程的用户 | `hacker` |
| **状态** | Running / Sleeping / Stopped / Zombie | `S`（sleeping） |
| **TTY** | 关联的终端 | `pts/0` |

```
你的 Shell (bash, PID=100)
├── ls (PID=101)        ← 你运行 ls，它是 bash 的子进程
├── cat (PID=102)       ← 你运行 cat，也是子进程
└── python (PID=103)    ← 你运行 python，同理
```

### 2. PID 与 PPID 🔗

- **PID (Process ID)：** 每个进程的唯一编号，由内核分配
- **PPID (Parent Process ID)：** 创建该进程的父进程的 PID

```bash
echo "My PID: $$"            # 当前 Shell 的 PID
echo "My parent: $PPID"      # 父进程的 PID
```

特殊的 PID：
- **PID 1：** `init` 或 `systemd`，所有进程的祖先 👑
- **PID 0：** 内核调度器（你看不到它）

### 3. 进程状态 🚦

| 状态码 | 名称 | 含义 |
|--------|------|------|
| `R` | Running | 正在 CPU 上执行或等待调度 |
| `S` | Sleeping | 等待事件（I/O、信号等） |
| `T` | Stopped | 被信号暂停（如 Ctrl+Z） |
| `Z` | Zombie | 已结束但父进程还没回收 🧟 |
| `D` | Uninterruptible Sleep | 不可中断的睡眠（通常是 I/O） |

### 4. 前台与后台 🎭

```
┌─────────────────────────────────┐
│  Terminal (TTY)                  │
│                                  │
│  前台 (Foreground):              │
│  → 占据终端，接收键盘输入        │
│  → 同时只能有一个前台进程        │
│                                  │
│  后台 (Background):              │
│  → 不占据终端输入                │
│  → 可以同时有多个                │
│  → 用 & 启动或 Ctrl+Z + bg 切换 │
└─────────────────────────────────┘
```

### 5. 僵尸进程与孤儿进程 🧟👶

| 类型 | 发生时机 | 危害 | 解决 |
|------|---------|------|------|
| **僵尸进程 (Zombie)** | 子进程结束了，但父进程没调用 `wait()` 回收 | 占用 PID 资源 | 让父进程 `wait()` 或杀死父进程 |
| **孤儿进程 (Orphan)** | 父进程先于子进程结束 | 无危害——被 init 收养 | 自动处理 ✅ |

```bash
# 制造一个僵尸 🧟
sleep 100 &          # 后台子进程
kill -9 $!           # 子进程被杀，但 Shell 没 wait → 僵尸！
ps aux | grep Z      # 看到 Z 状态
```

---

## 🔧 涉及的命令/语法

### 📌 `ps` — 查看进程快照

**语法：**
```bash
ps [选项]
```

**作用：** 显示当前系统进程的快照信息 📸

**两种主流写法：**

| 写法 | 风格 | 含义 |
|------|------|------|
| `ps -ef` | System V 标准 | `-e` 所有进程，`-f` 完整格式 |
| `ps aux` | BSD 风格 | `a` 所有用户，`u` 用户格式，`x` 包括无终端的 |

**`ps -ef` 输出字段：**
```
UID    PID  PPID  C  STIME  TTY    TIME     CMD
hacker  1    0    0  05:34   ?    00:00:00  /sbin/init
hacker  100  1    0  05:34  pts/0 00:00:00  bash
```

**`ps aux` 输出字段：**
```
USER    PID  %CPU  %MEM   VSZ   RSS  TTY  STAT  START  TIME  COMMAND
hacker   1   0.0   0.0   1128    4    ?    Ss   05:34  0:00  /sbin/init
```

**实用组合：**
```bash
ps -ef | grep challenge     # 找包含 "challenge" 的进程
ps aux --sort=-%mem          # 按内存使用排序
ps -ef --forest              # 树形显示进程关系 🌳
ps -p 1234 -o pid,cmd        # 查看特定 PID 的信息
```

⚠️ **注意：** `ps aux` 不加 `-`！`ps -aux` 含义不同（会警告）。

---

### 📌 `kill` — 发送信号

**语法：**
```bash
kill [选项] PID...
kill -信号 PID
```

**作用：** 向进程发送信号（不仅仅是"杀死"！）

**常用信号：**

| 信号 | 编号 | 含义 | 能被捕获？ |
|------|------|------|-----------|
| `SIGTERM` | 15 | 请求终止（默认） | ✅ |
| `SIGKILL` | 9 | 强制终止 | ❌ 不可捕获！ |
| `SIGINT` | 2 | 中断（= Ctrl+C） | ✅ |
| `SIGTSTP` | 20 | 暂停（= Ctrl+Z） | ✅ |
| `SIGCONT` | 18 | 继续执行 | ✅ |
| `SIGHUP` | 1 | 终端断开 | ✅ |
| `SIGUSR1` | 10 | 用户自定义信号1 | ✅ |

**示例：**
```bash
kill 1234              # 发送 SIGTERM（温柔请求退出）
kill -9 1234           # 发送 SIGKILL（强制杀死！💀）
kill -SIGTERM 1234     # 同 kill 1234
kill -SIGSTOP 1234     # 暂停进程
kill -SIGCONT 1234     # 恢复进程

# 杀死所有同名进程
killall python3
pkill -f "my_script"
```

⚠️ **注意：** 优先使用 `SIGTERM`（15），给进程清理资源的机会。`SIGKILL`（9）是最后手段！

---

### 📌 `Ctrl+C` 和 `Ctrl+Z` — 键盘信号 ⌨️

| 快捷键 | 信号 | 效果 |
|--------|------|------|
| `Ctrl+C` | SIGINT (2) | **中断**前台进程，通常导致退出 |
| `Ctrl+Z` | SIGTSTP (20) | **暂停**前台进程，放入后台（Stopped 状态） |
| `Ctrl+\` | SIGQUIT (3) | 退出并生成 core dump |

```bash
# 运行一个长任务
sleep 1000
# 按 Ctrl+Z → 暂停
[1]+  Stopped    sleep 1000

# 用 bg 让它在后台继续
bg
[1]+ sleep 1000 &
```

---

### 📌 `&` — 后台运行

**语法：**
```bash
命令 &
```

**作用：** 让命令在后台运行，不阻塞终端

```bash
sleep 100 &
# [1] 12345          ← 作业号 1，PID 12345
echo "I can still type!"   # 终端不被占据 ✅

# 运行多个后台任务
./task1 &
./task2 &
./task3 &
```

⚠️ **注意：** 后台进程的输出仍然会打印到终端！用重定向避免：
```bash
./noisy_program > /dev/null 2>&1 &
```

---

### 📌 `jobs` — 查看当前作业

**语法：**
```bash
jobs [选项]
```

**作用：** 列出当前 Shell 会话中的后台/暂停作业

```bash
sleep 100 &
sleep 200 &
vim     # 然后 Ctrl+Z 暂停

jobs
# [1]   Running    sleep 100 &
# [2]-  Running    sleep 200 &
# [3]+  Stopped    vim
```

| 标记 | 含义 |
|------|------|
| `+` | 当前默认作业（`fg`/`bg` 不加编号时操作它） |
| `-` | 上一个作业 |

---

### 📌 `fg` / `bg` — 前后台切换

**语法：**
```bash
fg [%作业号]     # 把作业调到前台
bg [%作业号]     # 让暂停的作业在后台继续
```

**示例：**
```bash
sleep 1000 &         # 后台运行
# [1] 12345

fg %1                # 调到前台
# sleep 1000         ← 现在前台运行，终端被占

# Ctrl+Z 暂停
# [1]+  Stopped    sleep 1000

bg %1                # 后台继续运行
# [1]+ sleep 1000 &
```

---

### 📌 `wait` — 等待进程结束

**语法：**
```bash
wait [PID...]
wait %作业号
```

**作用：** 阻塞当前 Shell，直到指定的后台进程结束

```bash
./slow_task &
PID=$!               # 获取最近后台进程的 PID
echo "Task running as PID $PID"
wait $PID
echo "Task finished with exit code $?"

# 等待所有后台任务
./task1 &
./task2 &
./task3 &
wait                  # 等待全部完成
echo "All done! 🎉"
```

⚠️ **注意：** `wait` 只能等待当前 Shell 的子进程！

---

### 📌 `/proc` 文件系统 — 进程的 X 光机 🔬

`/proc` 是一个虚拟文件系统，内核把进程信息以文件形式暴露出来。

```
/proc/
├── 1/                    ← PID 1 的目录
│   ├── cmdline          ← 启动命令
│   ├── status           ← 进程状态详情
│   ├── environ          ← 环境变量
│   ├── fd/              ← 打开的文件描述符
│   ├── maps             ← 内存映射
│   └── cwd → /home/...  ← 工作目录（符号链接）
├── self/                 ← 当前进程（指向自己的 PID 目录）
├── cpuinfo              ← CPU 信息
├── meminfo              ← 内存信息
└── version              ← 内核版本
```

**实用操作：**
```bash
# 查看进程的启动命令
cat /proc/1234/cmdline | tr '\0' ' '

# 查看进程状态
cat /proc/1234/status | head

# 查看进程的环境变量
cat /proc/1234/environ | tr '\0' '\n'

# 查看进程的文件描述符
ls -la /proc/1234/fd/

# 查看进程的工作目录
readlink /proc/1234/cwd

# 系统信息
cat /proc/cpuinfo | grep "model name"
cat /proc/meminfo | head -5
```

⚠️ **注意：** `/proc` 中的内容是实时的，每次读取都反映当前状态！

---

## 🎯 挑战解析

### Challenge 1: Listing Processes 📋
> 用 `ps` 找到 challenge 进程

💡 **思路：** `ps -ef | grep challenge` 或 `ps aux | grep challenge`

### Challenge 2: Killing Processes 🔪
> 终止指定进程

💡 **思路：** 先 `ps -ef` 找 PID，然后 `kill PID`

### Challenge 3: Interrupting Processes ⌨️
> 用 Ctrl+C 中断进程

💡 **思路：** 运行 `/challenge/run`，然后按 `Ctrl+C` 发送 SIGINT

### Challenge 4: Suspending Processes ⏸️
> 用 Ctrl+Z 暂停进程

💡 **思路：** 运行程序，然后 `Ctrl+Z` 暂停

### Challenge 5: Resuming Processes ▶️
> 恢复暂停的进程

💡 **思路：** `Ctrl+Z` 暂停后，`fg` 恢复前台 或 `bg` 恢复后台

### Challenge 6: Backgrounding Processes 🔙
> 在后台运行进程

💡 **思路：** `/challenge/run &`

### Challenge 7: Foregrounding Processes 🔜
> 把后台进程调到前台

💡 **思路：** 后台启动后用 `fg` 调回前台

### Challenge 8: Starting and Backgrounding 🚀
> 启动进程并放到后台

💡 **思路：** `Ctrl+Z` 暂停 → `bg` 后台继续 → 可能需要 `wait`

### Challenge 9: Process Files (`/proc`) 🔬
> 通过 /proc 读取进程信息

💡 **思路：** `ls /proc/PID/` 探索，`cat /proc/PID/cmdline`

### Challenge 10: The `/proc` File System 📁
> 深入探索 /proc

💡 **思路：** 可能需要读取 `/proc/PID/status` 或 `environ`

---

## 📚 知识扩展

### 🔧 进程管理高级工具

```bash
# top / htop — 实时进程监控
top                      # 内置
htop                     # 更好用（需安装）

# pgrep / pkill — 按名称查找/杀死
pgrep -f "python"        # 找所有 python 进程的 PID
pkill -f "my_script"     # 杀死匹配的进程

# pstree — 树形显示进程
pstree -p                # 带 PID 的进程树 🌳

# lsof — 查看进程打开的文件
lsof -p 1234             # PID 1234 打开了哪些文件
lsof -i :80              # 谁在用 80 端口
```

### 🎯 信号处理（在脚本中）

```bash
# 在脚本中捕获信号
trap 'echo "Caught SIGINT!"; exit' SIGINT
trap 'cleanup_function' EXIT    # 退出时自动清理

# 忽略信号
trap '' SIGINT    # 忽略 Ctrl+C（慎用！）

# 示例：优雅退出
cleanup() {
    echo "Cleaning up temp files..."
    rm -f /tmp/my_temp_*
    exit 0
}
trap cleanup SIGTERM SIGINT
```

### 💡 实用小技巧

```bash
# nohup — 断开终端后继续运行
nohup ./long_task &

# disown — 从作业表移除（不受 Shell 退出影响）
./long_task &
disown %1

# timeout — 限时运行
timeout 10 ./maybe_hangs   # 10秒后自动杀掉

# 获取进程的完整命令行
ps -p $(pgrep -f challenge) -o args=
```

---

## 🏆 最佳实践

1. **先 SIGTERM，后 SIGKILL** 🤝 — 给进程优雅退出的机会
2. **用 `ps aux` 配合 `grep`** 🔍 — 快速定位目标进程
3. **后台任务重定向输出** 📝 — `cmd > log.txt 2>&1 &`
4. **`nohup` 保护长任务** 🛡️ — 防止终端断开时任务被杀
5. **善用 `trap` 清理资源** 🧹 — 脚本中捕获信号做清理
6. **`/proc` 是你的好朋友** 🔬 — 比任何工具都底层、直接
7. **不要盲目 `kill -9`** ⚠️ — 进程没机会清理，可能留下临时文件/锁

---

## 📝 小结

| 操作 | 命令 | 示例 |
|------|------|------|
| 查看所有进程 | `ps -ef` / `ps aux` | `ps aux \| grep bash` |
| 杀死进程 | `kill PID` | `kill 1234` |
| 强制杀死 | `kill -9 PID` | `kill -9 1234` |
| 中断前台 | `Ctrl+C` | SIGINT |
| 暂停前台 | `Ctrl+Z` | SIGTSTP |
| 后台运行 | `cmd &` | `sleep 100 &` |
| 查看作业 | `jobs` | `jobs -l` |
| 调到前台 | `fg %n` | `fg %1` |
| 后台继续 | `bg %n` | `bg %1` |
| 等待进程 | `wait PID` | `wait $!` |
| 探索进程 | `/proc/PID/` | `cat /proc/1/status` |

---

## 🚀 下一站预告

**模块 09：Perceiving Permissions** 🔐 — 进入 Linux 权限系统！你将学习文件权限（rwx）、用户与组、chmod、chown 等。掌握了进程管理和权限系统，你就能真正理解 Linux 的安全模型——谁能运行什么、读写什么，一切尽在掌控！🛡️
