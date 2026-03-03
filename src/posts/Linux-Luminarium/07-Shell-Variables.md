# 07 - Shell Variables 🔤 | Shell 变量

> 🌐 **模块地址**：[https://pwn.college/linux-luminarium/variables/](https://pwn.college/linux-luminarium/variables/)
> ⭐ **难度**：⭐⭐
> 🎯 **核心主题**：变量赋值、echo 输出变量、export 导出、环境变量、命令替换 `$()`、read 读取输入、PATH 变量

---

## 📖 模块概述

Linux 命令行本质上是一门**编程语言**——Shell 脚本语言。和大多数编程语言一样，Shell 支持**变量**。

本模块将教你如何**设置变量、打印变量、导出变量给子进程**，以及一些重要的技巧如命令替换和从文件读取。变量是 Shell 编程的基石 🧱，掌握它才能写出真正有用的脚本。

---

## 🧠 核心概念

### 📌 Shell 变量 vs 环境变量

| 特性 | Shell 变量（局部） | 环境变量（导出后） |
|------|-------------------|-------------------|
| 作用域 | 仅当前 Shell 进程 | 当前进程 + 所有子进程 |
| 设置方式 | `VAR=value` | `export VAR=value` |
| 查看方式 | `echo $VAR` | `env` / `printenv` |
| 继承性 | ❌ 子进程看不到 | ✅ 子进程可以访问 |

```bash
# 演示区别
VAR=hello              # 局部变量
echo $VAR              # hello ✅ 当前 Shell 能看到
bash -c 'echo $VAR'    # （空）❌ 子进程看不到

export VAR=hello       # 导出为环境变量
bash -c 'echo $VAR'    # hello ✅ 子进程也能看到
```

### 📌 变量赋值规则 ⚠️

```bash
# ✅ 正确写法：等号两边不能有空格！
VAR=value
NAME="John Doe"
COUNT=42

# ❌ 错误写法
VAR = value      # Shell 会把 VAR 当命令执行！
VAR =value       # 同上
VAR= value       # VAR 被设为空，"value" 被当命令执行
```

> ⚠️ **这是最常见的新手陷阱！** 等号两边**绝对不能有空格**。

### 📌 变量展开（Variable Expansion）

```bash
NAME="World"

# 基本展开
echo $NAME           # World
echo "Hello $NAME"   # Hello World（双引号中会展开）
echo 'Hello $NAME'   # Hello $NAME（单引号中不会展开！）

# 花括号展开（推荐，避免歧义）
echo "${NAME}ly"     # Worldly
echo "$NAMEly"       # （空）— Shell 以为变量名是 NAMEly
```

### 📌 引号对比 🔍

| 引号类型 | 变量展开 | 命令替换 | 特殊字符 | 用途 |
|----------|---------|---------|---------|------|
| 双引号 `"..."` | ✅ 展开 | ✅ 展开 | 部分转义 | 包含空格的值 |
| 单引号 `'...'` | ❌ 原样 | ❌ 原样 | 全部原样 | 纯文本字面量 |
| 无引号 | ✅ 展开 | ✅ 展开 | 会做词分割 | 简单无空格值 |

```bash
VAR="hello world"

echo $VAR        # hello world（无引号：词分割，但 echo 不影响）
echo "$VAR"      # hello world（双引号：保留原样 ✅ 推荐）
echo '$VAR'      # $VAR（单引号：纯文本）
```

### 📌 命令替换（Command Substitution）

```bash
# 语法：$(命令) 或 `命令`（推荐前者）
CURRENT_DIR=$(pwd)
FILE_COUNT=$(ls | wc -l)
TODAY=$(date +%Y-%m-%d)

echo "今天是 $TODAY"           # 今天是 2024-01-15
echo "当前目录有 $FILE_COUNT 个文件"

# 嵌套命令替换（$() 语法的优势）
CONTENT=$(cat $(find /tmp -name "flag*" -type f))
# 用反引号几乎无法写嵌套！
```

### 📌 重要的内置环境变量

| 变量 | 含义 | 示例值 |
|------|------|--------|
| `$HOME` | 用户主目录 | `/home/hacker` |
| `$USER` | 当前用户名 | `hacker` |
| `$PWD` | 当前工作目录 | `/home/hacker` |
| `$PATH` | 命令搜索路径 | `/usr/bin:/bin:...` |
| `$SHELL` | 当前 Shell 路径 | `/bin/bash` |
| `$?` | 上一个命令的退出码 | `0`（成功） |
| `$$` | 当前 Shell 的 PID | `12345` |
| `$RANDOM` | 随机数（0-32767） | `28431` |

---

## 🔧 涉及的命令

### 1️⃣ `echo` — 打印文本/变量

```bash
# 语法
echo [选项] [字符串...]

# 打印变量
echo $FLAG                    # 输出 FLAG 变量的值
echo "PATH is: $PATH"        # 在字符串中嵌入变量
echo "Home: ${HOME}"         # 花括号写法（更安全）

# 选项
echo -n "no newline"          # 不输出尾部换行
echo -e "tab:\there"          # 启用转义：tab:	here
```

### 2️⃣ `export` — 导出环境变量

```bash
# 语法
export 变量名[=值]

# 用法 1：先赋值再导出
PWN=COLLEGE
export PWN

# 用法 2：一步到位（推荐 ✅）
export PWN=COLLEGE

# 用法 3：导出多个
export VAR1=a VAR2=b VAR3=c

# 查看所有已导出变量
export -p
```

> ⚠️ `export` 是单向的——父进程导出给子进程，子进程修改不会影响父进程。

### 3️⃣ `env` / `printenv` — 查看环境变量

```bash
# 显示所有环境变量
env
printenv

# 查看特定变量
printenv HOME         # /home/hacker
env | grep FLAG       # 搜索含 FLAG 的变量

# 用 env 在修改后的环境中运行命令
env VAR=test command   # 临时设置 VAR 运行 command
```

### 4️⃣ `read` — 读取输入到变量

```bash
# 语法
read [选项] 变量名

# 从键盘读取
read MY_VAR                      # 等待用户输入，存入 MY_VAR
read -p "请输入: " MY_VAR       # 带提示符

# 从文件读取（配合输入重定向）
read VAR < /path/to/file         # 读取文件第一行到 VAR

# 读取多个变量
echo "Alice 25" | read NAME AGE  # ⚠️ 管道中 read 在子 Shell，变量丢失！

# 正确方式：用 Here String
read NAME AGE <<< "Alice 25"
echo "$NAME is $AGE"             # Alice is 25

# 常用选项
read -s PASSWORD                  # 静默模式（不显示输入，适合密码）
read -t 5 ANSWER                  # 超时 5 秒
read -n 1 KEY                     # 只读一个字符
```

> ⚠️ `read` 从 **stdin** 读取。用 `<` 可以把文件重定向到 stdin，避免 "Useless Use of Cat"。

### 5️⃣ `set` / `unset` — 管理变量

```bash
# set：显示所有变量（包括局部和环境）
set | grep MY_VAR

# unset：删除变量
unset MY_VAR
echo $MY_VAR         # （空）
```

---

## 🎯 挑战解析

### Challenge 1: Printing Variables 🖨️
> 💡 提示：flag 已经存在于 `FLAG` 变量中。用 `echo` 和 `$` 把它打印出来即可。

### Challenge 2: Setting Variables ✏️
> 💡 提示：`变量名=值`，注意**等号两边不能有空格**，大小写敏感！

### Challenge 3: Multi-word Variables 📝
> 💡 提示：值中包含空格时，必须用**双引号**包裹。`VAR="word1 word2"`

### Challenge 4: Exporting Variables 📦
> 💡 提示：需要 `export` 一个变量让子进程（`/challenge/run`）看到它，同时另一个变量**不要** export。

### Challenge 5: Printing Exported Variables 📋
> 💡 提示：`env` 命令会列出所有已导出的环境变量，在输出中找 FLAG。

### Challenge 6: Command Substitution 🔄
> 💡 提示：用 `VAR=$(command)` 把命令输出捕获到变量中。

### Challenge 7: Reading Input 📖
> 💡 提示：用 `read` 命令读取用户输入到指定变量，然后输入特定的值。

### Challenge 8: Reading Files 📂
> 💡 提示：用 `read VAR < file` 从文件读取，比 `VAR=$(cat file)` 更优雅！

---

## 📚 知识扩展

### 🔍 特殊变量大全

```bash
# 脚本/函数参数相关
$0      # 脚本名
$1-$9   # 第1-9个参数
$#      # 参数个数
$@      # 所有参数（各自独立）
$*      # 所有参数（合为一个字符串）

# 进程相关
$$      # 当前 Shell PID
$!      # 最近后台进程 PID
$?      # 上一个命令退出码（0=成功）
```

### 🔍 PATH 变量详解

```bash
# PATH 决定了 Shell 去哪里找命令
echo $PATH
# /usr/local/bin:/usr/bin:/bin

# 添加自定义路径
export PATH="$PATH:/home/hacker/mybin"

# 查看命令实际路径
which python3     # /usr/bin/python3
type ls           # ls is aliased to 'ls --color=auto'
```

> ⚠️ **永远不要把 `.`（当前目录）放在 PATH 前面**，这是安全隐患！

### 🔍 变量的默认值与替换

```bash
# 如果 VAR 未设置或为空，使用默认值
echo ${VAR:-default}       # 输出 default，但 VAR 不变
echo ${VAR:=default}       # 输出 default，且 VAR 被设为 default

# 如果 VAR 已设置且非空，使用替代值
echo ${VAR:+replacement}   # VAR 非空时输出 replacement

# 如果 VAR 未设置，报错退出
echo ${VAR:?错误：VAR 未设置}
```

### 🔍 字符串操作

```bash
STR="Hello World"

# 长度
echo ${#STR}               # 11

# 子串
echo ${STR:0:5}            # Hello（从位置0取5个字符）
echo ${STR:6}              # World（从位置6到末尾）

# 替换
echo ${STR/World/Linux}    # Hello Linux（替换第一个）
echo ${STR//l/L}           # HeLLo WorLd（替换所有）

# 删除模式
FILE="archive.tar.gz"
echo ${FILE%.gz}           # archive.tar（从末尾删最短匹配）
echo ${FILE%%.*}           # archive（从末尾删最长匹配）
echo ${FILE#*.}            # tar.gz（从开头删最短匹配）
echo ${FILE##*.}           # gz（从开头删最长匹配）
```

### 🔍 declare 声明特殊变量

```bash
declare -i NUM=42          # 整数变量
declare -r CONST="fixed"   # 只读变量（常量）
declare -a ARR=(a b c)     # 索引数组
declare -A MAP             # 关联数组（字典）
MAP[name]="Alice"
MAP[age]=25
```

---

## 🏆 最佳实践

1. 🎯 **赋值时等号两边不加空格** — `VAR=value` ✅ `VAR = value` ❌
2. 🎯 **引用变量时总是用双引号** — `"$VAR"` 防止词分割和通配符展开
3. 🎯 **用 `$()` 而非反引号** — 可读性好、支持嵌套
4. 🎯 **用 `read < file` 代替 `VAR=$(cat file)`** — 避免 "Useless Use of Cat"
5. 🎯 **敏感变量用完即 `unset`** — 如 `unset PASSWORD`，减少泄露风险

---

## 📝 小结

| 操作 | 语法 | 关键点 |
|------|------|--------|
| 打印变量 | `echo $VAR` | `$` 触发变量展开 |
| 赋值 | `VAR=value` | 等号两边无空格！ |
| 带空格赋值 | `VAR="a b"` | 双引号包裹 |
| 导出 | `export VAR` | 子进程可见 |
| 查看环境变量 | `env` / `printenv` | 只显示已导出的 |
| 命令替换 | `VAR=$(cmd)` | 捕获命令输出 |
| 读取输入 | `read VAR` | 从 stdin 读取 |
| 从文件读取 | `read VAR < file` | 优雅且高效 |
| 单引号 vs 双引号 | `'...'` vs `"..."` | 单引号不展开变量 |

> 🚀 **下一站**：[08 - Processes and Jobs](./08-Processes-and-Jobs.md) — 学习进程管理、后台任务与信号控制！
