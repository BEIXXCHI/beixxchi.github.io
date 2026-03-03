# 13 - Destruction 💥 | 毁灭之路

> 🔗 **模块地址**：[https://pwn.college/linux-luminarium/destruction/](https://pwn.college/linux-luminarium/destruction/)
> ⭐ **难度**：★★★☆☆
> 🎯 **核心主题**：Fork Bomb、磁盘填满攻击、rm -rf / 系统清除、DoS 拒绝服务、Shell 内建命令自救

---

## 📖 模块概述

> _With great power comes great responsibility._ 🕷️

这是 Linux Luminarium 的**终章**——一场在安全沙箱中的"可控毁灭"。💣

你已经学会了导航、操作和控制一台 Linux 机器。在放你出去闯荡之前，pwn.college 决定让你亲手体验那些**看似无害却能摧毁系统**的操作：

- 🧨 **Fork Bomb** —— 让进程指数级爆炸，直到系统崩溃
- 💾 **磁盘填满** —— 用垃圾数据塞满硬盘，让一切停摆
- 🗑️ **rm -rf /** —— 递归删除整个文件系统，归于虚无
- 📖 **废墟中自救** —— 在没有 `cat`、`ls` 的世界里用 shell 内建命令读取文件

这些操作在 pwn.college 的容器中是**完全可恢复的**（重启容器即可），但在真实系统上会造成**灾难性后果**。

> ⚠️ **警告：永远不要在真实系统上执行这些操作！** 仅在隔离的实验环境中练习。

---

## 🧠 核心概念

### 1. Fork Bomb — 进程炸弹 🧨

#### 什么是 Fork Bomb？

Fork Bomb 是一种 **拒绝服务攻击（DoS）**，通过不断创建新进程来耗尽系统的进程表（process table），最终导致系统无法启动任何新进程。

#### 工作原理 ⚙️

```
脚本启动
├── 副本 A（后台）
│   ├── 副本 AA（后台）
│   │   ├── ...
│   │   └── ...
│   └── 副本 AB（后台）
│       ├── ...
│       └── ...
└── 副本 B（后台）
    ├── 副本 BA（后台）
    │   ├── ...
    │   └── ...
    └── 副本 BB（后台）
        ├── ...
        └── ...
```

每个进程创建 **2 个子进程**，子进程又各创建 2 个……这是**指数增长**：

| 代数 | 进程数 | 累计总数 |
|------|--------|----------|
| 0 | 1 | 1 |
| 1 | 2 | 3 |
| 2 | 4 | 7 |
| 5 | 32 | 63 |
| 10 | 1,024 | 2,047 |
| 20 | 1,048,576 | ~200万 |

> 💡 系统通常的 PID 上限（`/proc/sys/kernel/pid_max`）为 32768 或 4194304。Fork bomb 只需要几秒就能达到上限。

#### 经典 Fork Bomb（Bash 版）🏴

```bash
# 经典的一行 fork bomb —— 请勿在真实系统运行！
:(){ :|:& };:
```

拆解分析：

```bash
:()        # 定义一个名为 ":" 的函数
{          # 函数体开始
  : | :&   # 调用自身两次，通过管道连接，放入后台
}          # 函数体结束
;          # 语句分隔符
:          # 调用这个函数，引爆 💥
```

#### 脚本版 Fork Bomb 📝

```bash
#!/bin/bash
# fork_bomb.sh —— 仅在安全环境中使用！

$0 &    # 在后台启动自身的一个副本
$0 &    # 在后台启动自身的另一个副本
sleep 100  # 保持进程存活，不要立即退出
```

> 💡 `$0` 是当前脚本自身的路径。`&` 将其放入后台运行。`sleep` 确保进程不会立即退出（否则进程死亡速率可能大于创建速率）。

### 2. 磁盘填满攻击 💾

#### 原理

每个文件系统都有容量上限。当磁盘空间被 100% 占满时：
- ❌ 无法创建新文件
- ❌ 日志系统停止工作
- ❌ 数据库崩溃
- ❌ 很多程序无法正常运行

#### 快速填满磁盘的方法

```bash
# 方法 1：yes 命令（持续输出 "y" 直到磁盘满）
yes > ~/bigfile
# yes 会不断写入 "y\n"，直到磁盘空间耗尽

# 方法 2：dd 命令（更可控）
dd if=/dev/zero of=~/bigfile bs=1M count=1024
# 创建一个 1GB 的全零文件

# 方法 3：fallocate（瞬间分配空间，最快）
fallocate -l 1G ~/bigfile
# 瞬间分配 1GB 空间，不实际写入数据

# 方法 4：/dev/urandom（随机数据）
cat /dev/urandom > ~/bigfile
# 写入随机数据直到磁盘满
```

#### 检测磁盘使用情况 🔍

```bash
# 查看磁盘使用情况
df -h

# 查看当前目录的磁盘占用
du -sh ~/*

# 查看 inode 使用情况（即使空间够，inode 耗尽也会出问题）
df -i
```

### 3. rm -rf / — 终极毁灭 🗑️

```bash
# ⚠️ 这将删除整个文件系统上的所有内容！
rm -rf /
```

| 标志 | 含义 |
|------|------|
| `-r` | 递归删除（包括所有子目录和文件） |
| `-f` | 强制删除（忽略不存在的文件，不提示确认） |
| `/` | 文件系统根目录 —— **一切的起点** |

执行后的世界：

```bash
hacker@dojo:~$ ls /
bin etc lib usr ...
hacker@dojo:~$ rm -rf /
hacker@dojo:~$ ls /
bash: ls: command not found    # ls 二进制文件已被删除 💀
```

> 💡 现代 Linux 的 `rm` 默认有 `--preserve-root` 保护，会拒绝删除 `/`。需要 `--no-preserve-root` 才能绕过。pwn.college 环境中可能已修改了此保护。

### 4. 废墟中生存 — Shell 内建命令 🏚️

当文件系统被清空后，**外部命令**（`ls`、`cat`、`grep`...）都不复存在，因为它们的二进制文件已被删除。但 **shell 内建命令**仍然可用！

#### 内建 vs 外部命令

| 类型 | 说明 | 示例 |
|------|------|------|
| **内建命令** | 编译在 bash 内部，不依赖外部文件 | `echo`, `read`, `cd`, `type`, `printf` |
| **外部命令** | 独立的二进制文件，位于 /usr/bin 等目录 | `ls`, `cat`, `grep`, `rm` |

```bash
# 在清空文件系统后，用 read 读取文件（代替 cat）
while IFS= read -r line; do echo "$line"; done < /flag

# 或者更简洁地：
read -r flag < /flag
echo "$flag"

# 用 echo + glob 代替 ls
echo /*        # 列出根目录下所有文件
echo /flag*    # 查找以 flag 开头的文件

# 用 Tab 补全探索文件系统
# 输入 /  然后按 Tab Tab
```

> 💡 `type` 命令可以告诉你一个命令是内建的还是外部的：
> ```bash
> type read    # read is a shell builtin
> type ls      # ls is /usr/bin/ls
> ```

---

## 🔧 涉及的命令

### 📌 `yes` — 无限输出

**语法**：
```bash
yes [字符串]
```

**作用**：不断重复输出 "y"（或指定的字符串），直到被终止或管道关闭。

```bash
# 无限输出 "y"
yes
# y
# y
# y
# ... (Ctrl+C 停止)

# 输出自定义字符串
yes "hello world"

# 经典用途：自动确认
yes | apt install some-package

# 本模块用途：填满磁盘
yes > ~/bigfile   # 不断写入 "y\n" 直到磁盘满
```

> ⚠️ `yes` 重定向到文件时会持续写入直到磁盘满。完成后记得清理！

---

### 📌 `dd` — 数据复制与转换

**语法**：
```bash
dd if=输入 of=输出 bs=块大小 count=块数
```

**作用**：按块复制数据，常用于磁盘操作和创建特定大小的文件。

| 参数 | 说明 |
|------|------|
| `if=` | 输入文件（Input File） |
| `of=` | 输出文件（Output File） |
| `bs=` | 块大小（Block Size） |
| `count=` | 复制的块数 |

```bash
# 创建 1GB 全零文件
dd if=/dev/zero of=~/bigfile bs=1M count=1024

# 创建 100MB 随机文件
dd if=/dev/urandom of=~/random.bin bs=1M count=100

# 查看写入速度
dd if=/dev/zero of=~/test bs=1M count=500 status=progress
```

> ⚠️ `dd` 被戏称为 "Disk Destroyer"——参数写错（比如 `of=` 指向磁盘设备）可以瞬间抹掉整块硬盘。

---

### 📌 `fallocate` — 快速分配磁盘空间

**语法**：
```bash
fallocate -l 大小 文件名
```

**作用**：瞬间为文件预分配指定大小的空间（不实际写入数据）。

```bash
# 瞬间创建 1GB 文件
fallocate -l 1G ~/bigfile

# 创建 500MB 文件
fallocate -l 500M ~/medium.bin
```

> 💡 比 `dd` 快得多，因为不需要实际写入数据，只是在文件系统元数据中标记空间。

---

### 📌 `rm` — 删除文件

**语法**：
```bash
rm [选项] 文件/目录
```

| 参数 | 说明 |
|------|------|
| `-r` | 递归删除目录及其内容 |
| `-f` | 强制删除，不提示 |
| `-i` | 删除前逐个确认 |
| `--preserve-root` | 防止删除 `/`（默认开启） |
| `--no-preserve-root` | 允许删除 `/` |

```bash
# 删除单个文件
rm ~/bigfile

# 递归删除目录
rm -r ~/old_project

# 强制递归删除（危险！）
rm -rf /tmp/junk

# 终极毁灭（⚠️ 仅在安全环境中！）
rm -rf --no-preserve-root /
```

> ⚠️ **永远在执行 `rm -rf` 前三思**。考虑使用 `trash` 命令代替 `rm`，文件会进入回收站而非永久删除。

---

### 📌 `read` (Shell Builtin) — 读取输入/文件

**语法**：
```bash
read [选项] 变量名
```

**作用**：从标准输入或文件中读取一行，常用于脚本交互和文件读取。

```bash
# 从键盘读取用户输入
read -p "请输入名字: " name
echo "你好, $name"

# 读取文件的第一行（代替 cat）
read -r content < /flag
echo "$content"

# 逐行读取文件
while IFS= read -r line; do
    echo "$line"
done < /etc/hostname
```

> 💡 在文件系统被清空后，`read` 是你读取文件的救命稻草！

---

## 🎯 挑战解析

### Challenge 1: Fork Bomb 🧨

> 💡 **提示**：编写一个脚本，让它在后台启动自身两个副本。

- 📝 创建脚本文件，使其可执行
- 🔑 关键：使用 `$0 &` 启动自身副本，加 `sleep` 保持存活
- ⚠️ **先在另一个终端运行 `/challenge/check`**，否则 fork bomb 启动后你将无法运行任何新程序！
- 🏃 然后在原终端运行你的 fork bomb 脚本

### Challenge 2: 磁盘填满 💾

> 💡 **提示**：分两个阶段完成——先填满，再清理。

- 第一步：用 `yes > ~/bigfile` 或 `dd` 填满 `/home/hacker` 的 1GB 空间
- 第二步：运行 `/challenge/check`（检测磁盘已满）
- 第三步：`rm ~/bigfile` 清理空间
- 第四步：再次运行 `/challenge/check` 获取 flag
- ⚠️ 如果搞砸了没清理，需要通过 SSH 连接来修复

### Challenge 3: rm -rf / 🗑️

> 💡 **提示**：先启动检查器，再执行毁灭。

- **先**在一个终端运行 `/challenge/check`（让它看着"烟花"🎆）
- **然后**在另一个终端执行 `rm -rf /`（可能需要 `--no-preserve-root`）
- 删除过程需要一些时间——毕竟要删的东西很多
- `/challenge/check` 会在检测到足够破坏后给你 flag

### Challenge 4: 没有 cat 的世界 📖

> 💡 **提示**：用 shell 内建命令 `read` 读取 flag 文件。

- 同样先运行 `/challenge/check`，再 `rm -rf /`
- 清除后，`/challenge/check` 会恢复 `/flag` 文件
- 用 `read` 内建命令读取它：`read flag < /flag && echo $flag`

### Challenge 5: 没有 ls 的世界 🔍

> 💡 **提示**：flag 被放在随机命名的文件中，你需要找到它。

- `rm -rf /` 之后，`/challenge/check` 会在 `/` 下创建一个随机命名的文件
- 用 `echo /*` 代替 `ls /` 来发现文件名
- 或者输入 `/` 后按 **Tab** 键补全
- 找到文件后用 `read` 读取

---

## 📚 知识扩展

### 🌐 DoS vs DDoS

| 类型 | 全称 | 来源 | 示例 |
|------|------|------|------|
| **DoS** | Denial of Service | 单一来源 | Fork bomb, 磁盘填满 |
| **DDoS** | Distributed DoS | 多个来源（僵尸网络） | 大量机器同时发请求 |

Fork bomb 是一种**本地 DoS**——攻击者需要已经在系统上有执行权限。

### 🛡️ 系统防护机制

#### ulimit — 限制用户资源

```bash
# 查看当前用户的所有限制
ulimit -a

# 查看最大进程数
ulimit -u
# 例如：63457

# 设置最大进程数为 100（防止 fork bomb）
ulimit -u 100

# 设置最大文件大小为 100MB
ulimit -f 102400
```

`/etc/security/limits.conf` 中可以永久设置：

```
# 限制 hacker 用户最多 500 个进程
hacker    hard    nproc    500

# 限制所有用户最大文件大小为 1GB
*         hard    fsize    1048576
```

#### cgroups — 容器级资源控制

现代 Linux 通过 **cgroups**（Control Groups）提供更精细的资源限制：

```bash
# 查看进程的 cgroup
cat /proc/self/cgroup

# systemd 的资源限制配置示例
# /etc/systemd/system/myservice.service
# [Service]
# TasksMax=100          # 最大进程数
# MemoryMax=512M        # 最大内存
```

#### 磁盘配额 (Quota) 💾

```bash
# 查看用户磁盘配额
quota -u hacker

# 设置配额（管理员操作）
sudo edquota -u hacker
# 可以设置 soft limit（警告）和 hard limit（强制）
```

### 🔧 Fork Bomb 的变体

```bash
# Bash 经典版
:(){ :|:& };:

# Python 版
import os
while True:
    os.fork()

# Perl 版
perl -e 'fork while fork'

# C 版
#include <unistd.h>
int main() {
    while(1) fork();
}
```

### 🔄 安全删除 vs 普通删除

```bash
# 普通删除（数据仍可恢复）
rm secret.txt

# 安全覆写后删除（数据更难恢复）
shred -vfz -n 5 secret.txt

# shred 参数：
# -v  显示进度
# -f  必要时修改权限
# -z  最后用零覆盖（隐藏 shred 操作痕迹）
# -n  覆写次数
```

> 💡 在 SSD 和有日志的文件系统（ext4, btrfs）上，`shred` 效果有限，因为数据可能被写入其他物理位置。

---

## 🏆 最佳实践

1. 🧪 **在隔离环境中实验** —— 使用容器（Docker）、虚拟机（VM）或 pwn.college 等平台练习危险操作，永不在生产环境中尝试
2. 🛡️ **配置 ulimit 和 cgroups** —— 限制用户进程数和资源使用，是防御 fork bomb 的第一道防线
3. 💾 **设置磁盘配额** —— 使用 quota 系统防止单个用户填满整个磁盘
4. 🔄 **定期备份** —— `rm -rf` 的唯一真正防御是备份。遵循 3-2-1 规则：3 份副本、2 种介质、1 份异地
5. ⚠️ **使用 `alias rm='rm -i'`** —— 在交互式 shell 中为 `rm` 添加确认提示，防止手滑误删

---

## 📝 小结

### 关键知识点速查表 📋

| 攻击类型 | 原理 | 关键命令 | 防御手段 |
|----------|------|----------|----------|
| 🧨 Fork Bomb | 进程指数级增长，耗尽进程表 | `:(){ :\|:& };:` | `ulimit -u`, cgroups |
| 💾 磁盘填满 | 写入大量数据直到磁盘空间耗尽 | `yes > file`, `dd` | 磁盘配额 (quota) |
| 🗑️ rm -rf / | 递归删除整个文件系统 | `rm -rf --no-preserve-root /` | `--preserve-root`, 备份 |
| 📖 废墟求生 | 在无外部命令的环境中操作 | `read`, `echo *`, Tab补全 | — |

### 🏚️ 废墟中的救命工具

| 需求 | 正常命令 | 内建替代方案 |
|------|----------|-------------|
| 查看文件内容 | `cat file` | `read var < file; echo $var` |
| 列出目录 | `ls /dir` | `echo /dir/*` 或 Tab 补全 |
| 输出文本 | `printf` | `echo`（都是内建） |
| 查看命令类型 | `which cmd` | `type cmd` |

### 💀 一句话总结

> 毁灭是理解创造的最后一步——只有亲手摧毁过系统，你才能真正理解如何保护它。**在安全环境中尽情破坏，在真实世界中谨慎操作。** 🛡️

### 🎉 恭喜！

你已经完成了 **Linux Luminarium** 的全部课程！从最基础的 `cd` 和 `ls`，到今天的 fork bomb 和系统清除——你已经从一个 Linux 新手成长为了一名合格的命令行战士。🎓

> 🚀 **下一站**：pwn.college 的其他 Dojo 在等着你——二进制漏洞利用、逆向工程、Web 安全……冒险才刚刚开始！
