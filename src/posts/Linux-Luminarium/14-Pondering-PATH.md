# 🛤️ 模块 12：Pondering PATH（探索 PATH）

> **Shell 是怎么找到命令的？掌握 PATH，你就是命令的主人 👑**

| 📌 信息 | 详情 |
|---------|------|
| 🔗 地址 | https://pwn.college/linux-luminarium/path/ |
| ⭐ 难度 | ★★★☆☆ |
| 🎯 核心主题 | PATH 环境变量、命令查找机制、PATH 劫持 |
| 📚 前置知识 | Shell Variables、Chaining Commands |

---

## 📖 模块概述

你敲 `ls` 的时候，Shell 怎么知道去哪找 `ls` 这个程序？答案就是 **PATH** 🛤️

PATH 是一个环境变量，里面存了一堆目录路径，Shell 会**按顺序**在这些目录里搜索你输入的命令名。理解了 PATH，你就能：

- 🔍 搞懂命令查找机制
- 🔧 添加自定义命令目录
- 🏴‍☠️ 劫持（hijack）系统命令
- 🛡️ 识别 PATH 相关的安全风险

---

## 🧠 核心概念

### 1️⃣ PATH 是什么？

PATH 是一个用冒号 `:` 分隔的目录列表：

```bash
echo $PATH
# /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```

当你输入一个**裸命令名**（如 `ls`），Shell 会：

```
1. 检查是否是 built-in 命令（cd, echo 等）
2. 按 PATH 中的目录顺序查找：
   /usr/local/sbin/ls → 不存在 ❌
   /usr/local/bin/ls  → 不存在 ❌
   /usr/sbin/ls       → 不存在 ❌
   /usr/bin/ls        → 不存在 ❌
   /sbin/ls           → 不存在 ❌
   /bin/ls            → 找到了！✅ 执行它！
```

### 2️⃣ 三种调用命令的方式

| 方式 | 示例 | 是否依赖 PATH |
|------|------|--------------|
| 绝对路径 | `/bin/ls` | ❌ 不依赖 |
| 相对路径 | `./my_script` | ❌ 不依赖 |
| 裸命令名 | `ls` | ✅ **依赖 PATH** |

### 3️⃣ 清空 PATH —— 一切崩塌 💥

```bash
hacker@dojo:~$ ls
Desktop Documents ...
hacker@dojo:~$ PATH=""
hacker@dojo:~$ ls
bash: ls: No such file or directory
```

清空 PATH 后，Shell 找不到任何命令了！但注意：
- **Built-in 命令依然可用**（`cd`、`echo`、`export` 等）
- 用**绝对路径**依然能执行：`/bin/ls`

```bash
PATH=""
echo "我是 built-in，我还活着！"  # ✅ 正常
/bin/ls                            # ✅ 绝对路径正常
ls                                 # ❌ 找不到
```

### 4️⃣ 修改 PATH

**覆盖 PATH：**
```bash
PATH=/my/custom/dir
# 现在只会在 /my/custom/dir 里找命令
```

**追加目录到 PATH：**
```bash
# 追加到末尾（低优先级）
PATH=$PATH:/my/custom/dir

# 追加到开头（高优先级）
PATH=/my/custom/dir:$PATH
```

**永久修改（写入配置文件）：**
```bash
echo 'export PATH=$PATH:/my/custom/dir' >> ~/.bashrc
source ~/.bashrc
```

### 5️⃣ PATH 劫持（PATH Hijacking）🏴‍☠️

这是本模块最精髓的部分！如果你把一个恶意目录放在 PATH 的**前面**，就能让你的"假命令"替代真命令：

```bash
# 创建一个假的 cat 命令
mkdir /tmp/evil
cat > /tmp/evil/cat << 'EOF'
#!/bin/bash
echo "😈 你的数据是我的了！"
# 这里可以偷偷做坏事...
/bin/cat "$@"  # 还可以正常执行真正的 cat 来掩人耳目
EOF
chmod +x /tmp/evil/cat

# 劫持 PATH
PATH=/tmp/evil:$PATH

cat /etc/passwd
# 输出：😈 你的数据是我的了！
# （然后正常显示文件内容）
```

**防止程序找到某个命令：**
```bash
# 清空 PATH，让程序找不到 rm
PATH="" /challenge/run
# /challenge/run 内部调用 rm 时会失败
```

### 6️⃣ 创建自定义命令

```bash
# 1. 创建命令目录
mkdir -p ~/bin

# 2. 写一个自定义命令
cat > ~/bin/hello << 'EOF'
#!/bin/bash
echo "Hello, $(whoami)! 🎉 Today is $(date +%A)"
EOF
chmod +x ~/bin/hello

# 3. 添加到 PATH
PATH=~/bin:$PATH

# 4. 使用！
hello
# Hello, hacker! 🎉 Today is Monday
```

---

## 🔧 涉及的命令/语法

### `which` —— 查找命令位置

```bash
# 语法
which 命令名

# 示例
which ls       # /bin/ls
which python3  # /usr/bin/python3
which cd       # 可能无输出（cd 是 built-in）
```

`which` 按照 PATH 中的目录顺序查找，返回**第一个**匹配的文件路径。

⚠️ **注意：** `which` 只查找 PATH 中的外部命令，不查找 shell built-in。用 `type` 可以查找所有类型：

```bash
type cd      # cd is a shell builtin
type ls      # ls is /bin/ls
type ll      # ll is aliased to 'ls -l'
```

### `env` —— 查看/修改环境

```bash
# 查看所有环境变量
env

# 临时修改 PATH 运行命令
env PATH=/tmp/mybin command_name

# 清空环境运行命令
env -i /bin/bash
```

### `export` —— 导出环境变量

```bash
# 修改 PATH 并导出给子进程
export PATH=$PATH:/new/dir

# 等价于
PATH=$PATH:/new/dir
export PATH
```

---

## 🎯 挑战解析

### Challenge 1: 阻止 rm 执行
> `/challenge/run` 会用 `rm` 删除 flag。让它找不到 `rm`！

```bash
PATH="" /challenge/run
```

💡 清空 PATH 后，`/challenge/run` 内部的 `rm` 命令就找不到了，flag 得以保留！

### Challenge 2: 添加命令目录
> `/challenge/run` 会执行 `win` 命令，但 `win` 在 `/challenge/more_commands/` 中

```bash
PATH=/challenge/more_commands
/challenge/run
```

💡 把包含 `win` 的目录设为 PATH。

### Challenge 3: 用 which 找命令
> 找到隐藏的 `win` 命令和同目录的 flag

```bash
which win
# 比如输出 /some/hidden/dir/win
cat /some/hidden/dir/flag
```

💡 `which` 帮你定位命令所在目录，flag 就在旁边！

### Challenge 4: 创建自定义 win 命令
> `win` 不存在！你需要自己创建它

```bash
mkdir -p /tmp/mybin
cat > /tmp/mybin/win << 'EOF'
#!/bin/bash
cat /flag
EOF
chmod +x /tmp/mybin/win

PATH=/tmp/mybin /challenge/run
```

💡 自己写一个 `win` 脚本，让 `/challenge/run` 能找到并执行它。

---

## 📚 知识扩展

### 🔐 PATH 安全隐患

**常见攻击场景：**

1. **当前目录在 PATH 中** 🚨
   ```bash
   # 危险！如果 PATH 包含 . （当前目录）
   PATH=.:$PATH
   # 攻击者在 /tmp 放一个假 ls，你 cd /tmp 后执行 ls 就中招
   ```

2. **SUID 程序中的 PATH 注入**
   - 如果一个 SUID root 程序内部调用 `system("some_command")`
   - 攻击者可以劫持 PATH 来替换 `some_command`
   - 从而以 root 权限执行任意代码 😱

3. **写权限目录在 PATH 前面**
   - 如果 `/tmp` 在 PATH 前面，任何人都能在里面放"假命令"

**安全建议：**

| ❌ 不要 | ✅ 应该 |
|---------|---------|
| PATH 中包含 `.` | 用 `./script` 显式执行 |
| PATH 中包含可写目录 | 只包含受保护的系统目录 |
| 脚本中依赖裸命令名 | 在脚本中使用**绝对路径** |
| `export PATH` 不检查 | 定期检查 PATH 内容 |

### 🔍 命令查找优先级

当你输入一个命令名时，Shell 按以下顺序查找：

```
1. Alias（别名）        → alias ll='ls -l'
2. Function（函数）     → my_func() { ... }
3. Built-in（内置命令） → cd, echo, export
4. Hash table（缓存）   → 之前找到的路径缓存
5. PATH 搜索           → 遍历 PATH 目录
```

```bash
# 查看完整的查找信息
type -a echo
# echo is a shell builtin
# echo is /usr/bin/echo
# echo is /bin/echo
```

### 🔄 hash 命令 —— PATH 缓存

Shell 会缓存命令路径以加速查找：

```bash
hash          # 查看缓存
hash -r       # 清除所有缓存
hash -d ls    # 清除特定命令缓存
```

⚠️ 修改 PATH 后如果命令行为异常，试试 `hash -r`！

---

## 🏆 最佳实践

1. **永远不要把 `.` 放进 PATH** 🚫 —— 这是经典安全漏洞
2. **脚本中用绝对路径** 📍 —— `/bin/rm` 而不是 `rm`
3. **追加而非覆盖** —— 用 `PATH=$PATH:/new` 而不是 `PATH=/new`
4. **`~/.local/bin`** 是存放个人脚本的好地方 📂
5. **修改前先备份** —— `OLD_PATH=$PATH` 以防万一 💾
6. **用 `type -a` 排查命令冲突** 🔎

---

## 📝 小结

| 概念 | 要点 | 示例 |
|------|------|------|
| PATH 变量 | 冒号分隔的搜索目录列表 | `/usr/bin:/bin` |
| 命令查找 | 按 PATH 顺序，返回第一个匹配 | `which ls` → `/bin/ls` |
| 清空 PATH | 裸命令全部失效 | `PATH=""` |
| 追加目录 | 在末尾/开头添加 | `PATH=$PATH:/new` |
| PATH 劫持 | 用假命令替代真命令 | 高优先级目录放前面 |
| 自定义命令 | 写脚本 + 加入 PATH | `~/bin/mytool` |
| 安全要点 | 不放 `.`，脚本用绝对路径 | `/bin/rm` 而非 `rm` |

---

## 🔮 下一站预告

接下来进入 **模块 13：Destruction** 💥！在 Luminarium 的最后一站，你将见识 Linux 中最危险的操作——Fork Bomb、磁盘填满、`rm -rf /`。了解破坏的力量，才能更好地防御！⚠️ 请系好安全带！
