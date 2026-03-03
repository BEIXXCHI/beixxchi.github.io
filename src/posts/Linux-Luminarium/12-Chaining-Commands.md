# 🔗 模块 11：Chaining Commands（命令链接）

> **把多条命令串成一条龙！从分号到脚本，迈向自动化的第一步 🐉**

| 📌 信息 | 详情 |
|---------|------|
| 🔗 地址 | https://pwn.college/linux-luminarium/chaining/ |
| ⭐ 难度 | ★★☆☆☆ |
| 🎯 核心主题 | 命令链接操作符、Shell 脚本基础 |
| 📚 前置知识 | Piping、Processes（退出码） |

---

## 📖 模块概述

到目前为止，你一直在一条一条地敲命令。但真正的 hacker 🧑‍💻 是不会一条条敲的——他们把命令**串起来**！

本模块教你如何：
- 用 `;` 顺序执行多条命令
- 用 `&&` 和 `||` 做**条件执行**
- 用 `()` 和 `{}` 分组命令
- 编写你的第一个 **bash 脚本** 🎉

从此，你将从"手动操作员"进化为"脚本编写者"！

---

## 🧠 核心概念

### 1️⃣ 分号 `;` —— 顺序执行

分号就像按了 Enter，但可以把多条命令写在一行：

```bash
# 等价于分两行执行
echo "Hello" ; echo "World"
```

**关键点：** 不管前一条命令成功还是失败，下一条**照样执行** 💪

```bash
# 即使 ls 报错，echo 依然运行
ls /nonexistent ; echo "我还是会执行！"
# 输出：
# ls: cannot access '/nonexistent': No such file or directory
# 我还是会执行！
```

### 2️⃣ `&&` —— AND 操作符（成功才继续）

```bash
command1 && command2
```

只有 `command1` **成功**（退出码 = 0）时，`command2` 才会执行：

```bash
# 创建文件成功 → 打印消息
touch /tmp/test && echo "文件创建成功！✅"

# 权限不足，touch 失败 → echo 不执行
touch /root/test && echo "这句不会出现"
```

**实际用途：**
```bash
# 编译成功才运行
gcc main.c -o main && ./main

# 目录创建成功才进入
mkdir myproject && cd myproject
```

### 3️⃣ `||` —— OR 操作符（失败才继续）

```bash
command1 || command2
```

只有 `command1` **失败**（退出码 ≠ 0）时，`command2` 才会执行：

```bash
# 文件不存在 → 创建它
cat config.txt || echo "配置文件不存在，使用默认值 ⚠️"

# 常见模式：尝试 → 兜底
which python3 || which python
```

### 4️⃣ 三剑客组合 🗡️🗡️🗡️

```bash
# 经典模式：成功做A，失败做B
command && echo "成功 ✅" || echo "失败 ❌"

# 实战：检查服务是否运行
ping -c 1 google.com && echo "网络正常" || echo "网络故障！"
```

| 操作符 | 含义 | 何时执行下一条 | 类比 |
|--------|------|---------------|------|
| `;` | 顺序执行 | **无论如何** | 流水线 🏭 |
| `&&` | AND | 前一条**成功** | 安全门 🚪 |
| `||` | OR | 前一条**失败** | 备用方案 🔄 |

### 5️⃣ 退出码（Exit Code）回顾

每个命令执行后都会产生一个退出码，存储在 `$?` 中：

```bash
true    # 退出码 0（成功）
echo $? # 输出: 0

false   # 退出码 1（失败）
echo $? # 输出: 1

ls /nonexistent
echo $? # 输出: 2（错误）
```

| 退出码 | 含义 |
|--------|------|
| `0` | ✅ 成功 |
| `1` | ❌ 一般错误 |
| `2` | ❌ 命令使用错误 |
| `126` | 🚫 权限不足 |
| `127` | 🔍 命令未找到 |
| `128+N` | 💀 被信号 N 终止 |

### 6️⃣ 子 Shell `()` 与代码块 `{}`

**子 Shell `()`** —— 在新的 shell 环境中执行，不影响当前环境：

```bash
# 子 shell 中的 cd 不影响当前目录
pwd           # /home/hacker
(cd /tmp; pwd) # /tmp
pwd           # /home/hacker（没变！）
```

**代码块 `{}`** —— 在当前 shell 中分组执行：

```bash
# 注意：{ 后面要有空格，最后要有分号
{ cd /tmp; pwd; }  # /tmp
pwd                 # /tmp（变了！）
```

| 特性 | `( )` 子 Shell | `{ }` 代码块 |
|------|---------------|-------------|
| 环境 | 新的子进程 | 当前 shell |
| 变量影响 | ❌ 不影响父 shell | ✅ 影响当前 shell |
| 语法 | `(cmd1; cmd2)` | `{ cmd1; cmd2; }` |
| 用途 | 隔离环境 | 逻辑分组 |

### 7️⃣ Shell 脚本基础 📜

把命令写进文件，就变成了**脚本**！

**创建脚本：**
```bash
# 方法1：用编辑器
nano myscript.sh

# 方法2：用 echo/cat
cat > myscript.sh << 'EOF'
#!/bin/bash
echo "Hello from script! 🎉"
echo "Current directory: $(pwd)"
echo "Current user: $(whoami)"
EOF
```

**Shebang 行** `#!/bin/bash`：
- 告诉系统用哪个解释器运行脚本
- 必须是脚本的**第一行**
- `#!` 后面是解释器的绝对路径

```bash
#!/bin/bash      # Bash 脚本
#!/bin/sh        # POSIX Shell 脚本
#!/usr/bin/python3  # Python 脚本
#!/usr/bin/env bash # 更通用的写法（推荐）
```

**运行脚本的三种方式：**

```bash
# 方式1：通过 bash 运行（不需要执行权限）
bash myscript.sh

# 方式2：添加执行权限后直接运行
chmod +x myscript.sh
./myscript.sh

# 方式3：source（在当前 shell 中执行）
source myscript.sh
# 或
. myscript.sh
```

---

## 🔧 涉及的命令/语法

### `bash` —— 执行脚本

```bash
# 语法
bash [选项] 脚本文件 [参数...]

# 常用选项
bash -x script.sh   # 调试模式，打印每条执行的命令
bash -n script.sh   # 语法检查，不实际运行
bash -e script.sh   # 遇到错误立即退出
```

### `chmod` —— 添加执行权限

```bash
chmod +x script.sh   # 给脚本添加执行权限
chmod 755 script.sh  # rwxr-xr-x
```

### `echo $?` —— 查看退出码

```bash
some_command
echo $?  # 打印上一条命令的退出码
```

⚠️ **注意：** `echo $?` 本身也会产生退出码，所以只能查看**紧接着的上一条**命令的退出码！

### `true` / `false` —— 返回固定退出码

```bash
true   # 永远返回 0（成功）
false  # 永远返回 1（失败）

# 常用于测试条件链
true && echo "会执行"
false && echo "不会执行"
false || echo "会执行"
```

---

## 🎯 挑战解析

### Challenge 1: 分号链接
> 用 `;` 链接 `/challenge/pwn` 和 `/challenge/college`

```bash
/challenge/pwn ; /challenge/college
```

💡 最简单的链接方式！

### Challenge 2: AND 操作符
> 用 `&&` 链接 `/challenge/first-success` 和 `/challenge/second`

```bash
/challenge/first-success && /challenge/second
```

💡 第一个命令成功后才会运行第二个，两个都运行才能拿 flag。

### Challenge 3: OR 操作符
> 用 `||` 链接 `/challenge/first-failure` 和 `/challenge/second`

```bash
/challenge/first-failure || /challenge/second
```

💡 第一个命令故意失败，从而触发第二个命令。

### Challenge 4: 编写 Shell 脚本
> 将命令写进脚本文件，用 `bash` 执行

```bash
# 创建脚本
cat > /tmp/solve.sh << 'EOF'
#!/bin/bash
/challenge/pwn
/challenge/college
EOF

# 运行
bash /tmp/solve.sh
```

### Challenge 5: 可执行脚本
> 创建脚本并用 `chmod +x` 使其可直接执行

```bash
cat > /tmp/solve.sh << 'EOF'
#!/bin/bash
/challenge/pwn
/challenge/college
EOF

chmod +x /tmp/solve.sh
/tmp/solve.sh
```

💡 Shebang `#!/bin/bash` 是关键——没有它系统不知道用什么来运行！

---

## 📚 知识扩展

### 🔀 更多链接技巧

```bash
# 管道也是链接的一种
cat file | grep "pattern" | wc -l

# 命令替换
echo "Today is $(date)"

# 后台执行
long_task &

# 混合使用
(cd /tmp && make) || echo "Build failed" | tee error.log
```

### 📝 脚本模板

```bash
#!/bin/bash
# 描述：这是一个模板脚本
# 作者：hacker
# 日期：2024-01-01

set -e  # 遇到错误立即退出
set -u  # 使用未定义变量时报错
set -o pipefail  # 管道中任一命令失败则整体失败

echo "脚本开始 🚀"

# 你的逻辑...

echo "脚本完成 ✅"
```

### 短路求值（Short-circuit Evaluation）

`&&` 和 `||` 使用的是**短路求值**，跟编程语言中的逻辑运算一样：

```bash
# 类似 if-else 的单行写法
[ -f file.txt ] && echo "exists" || echo "not found"

# 等价于
if [ -f file.txt ]; then
    echo "exists"
else
    echo "not found"
fi
```

---

## 🏆 最佳实践

1. **脚本第一行永远写 Shebang** 🏷️
2. **用 `set -euo pipefail`** 让脚本更健壮 🛡️
3. **`&&` 比 `;` 更安全** —— 避免在前一步失败后继续执行 ⚡
4. **复杂逻辑用脚本，别硬塞一行** —— 可读性第一 📖
5. **测试脚本前用 `bash -n` 检查语法** 🔍
6. **子 Shell `()` 隔离副作用**，避免意外修改环境变量 🔒

---

## 📝 小结

| 概念 | 语法 | 作用 | 记忆口诀 |
|------|------|------|---------|
| 顺序执行 | `cmd1 ; cmd2` | 无条件依次执行 | 分号 = 换行 |
| AND 链 | `cmd1 && cmd2` | 成功才继续 | 两个都要成 ✅✅ |
| OR 链 | `cmd1 \|\| cmd2` | 失败才继续 | 有一个成就行 ✅ |
| 子 Shell | `(cmd1; cmd2)` | 隔离执行 | 小括号 = 沙盒 |
| 代码块 | `{ cmd1; cmd2; }` | 当前环境分组 | 大括号 = 就地 |
| 脚本 | `bash script.sh` | 批量执行命令 | 文件 = 自动化 |
| Shebang | `#!/bin/bash` | 指定解释器 | 脚本的身份证 |
| 退出码 | `$?` | 上条命令结果 | 0=好，非0=坏 |

---

## 🔮 下一站预告

接下来进入 **模块 12：Pondering PATH** 🛤️！你将了解 Shell 是如何找到 `ls`、`cat` 这些命令的。掌握 PATH 变量，你就能**劫持命令**、**自定义工具箱**，向真正的系统掌控者迈进！🚀
