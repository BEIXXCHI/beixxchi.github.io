# 06 - Practicing Piping 🔀 | 管道与重定向实战

> 🌐 **模块地址**：[https://pwn.college/linux-luminarium/piping/](https://pwn.college/linux-luminarium/piping/)
> ⭐ **难度**：⭐⭐
> 🎯 **核心主题**：stdin / stdout / stderr、重定向操作符、管道、tee、进程替换

---

## 📖 模块概述

在 Linux 中，每个进程都有三条"数据通道"——标准输入、标准输出和标准错误。这个模块教你如何**重定向**这些通道：把输出写进文件、从文件读取输入、用管道把多个命令串起来，以及更高级的进程替换技巧。

掌握管道和重定向是成为 Linux 高手的**必经之路** 🚀。它让你能把简单的小工具组合成强大的数据处理流水线。

---

## 🧠 核心概念

### 📌 三大标准流（Standard Streams）

| 名称 | 缩写 | FD 编号 | 默认连接 | 说明 |
|------|------|---------|----------|------|
| Standard Input | stdin | 0 | 键盘 | 进程读取输入的通道 |
| Standard Output | stdout | 1 | 终端屏幕 | 进程输出正常数据的通道 |
| Standard Error | stderr | 2 | 终端屏幕 | 进程输出错误信息的通道 |

> 💡 **File Descriptor (FD)** 是 Linux 中描述通信通道的数字。FD 0/1/2 是每个进程自动拥有的三个通道。

### 📌 重定向操作符速查表

| 操作符 | 含义 | 示例 |
|--------|------|------|
| `>` | 将 stdout 重定向到文件（覆盖） | `echo hi > file.txt` |
| `>>` | 将 stdout 追加到文件 | `echo hi >> file.txt` |
| `2>` | 将 stderr 重定向到文件 | `cmd 2> err.log` |
| `2>>` | 将 stderr 追加到文件 | `cmd 2>> err.log` |
| `&>` | 将 stdout + stderr 都重定向到文件 | `cmd &> all.log` |
| `<` | 从文件重定向输入到 stdin | `cmd < input.txt` |
| `2>&1` | 将 stderr 合并到 stdout | `cmd 2>&1` |
| `\|` | 管道：左边 stdout → 右边 stdin | `cmd1 \| cmd2` |

### 📌 数据流可视化

```
                    ┌──────────┐
   stdin (FD 0) ──▶│          │──▶ stdout (FD 1) ──▶ 屏幕/文件/管道
   键盘/文件/管道   │  进程    │
                    │          │──▶ stderr (FD 2) ──▶ 屏幕/文件
                    └──────────┘
```

### 📌 管道（Pipe）原理

管道 `|` 把左侧命令的 **stdout** 连接到右侧命令的 **stdin**，形成数据流水线：

```bash
# 三级管道示例
cat access.log | grep "404" | wc -l
#   读取文件  →  过滤含404的行  →  计数
```

> ⚠️ 管道默认只传递 stdout，**不传递 stderr**！要管道传递 stderr 需要先 `2>&1`。

### 📌 进程替换（Process Substitution）

```bash
# 输入进程替换：<(command) — 把命令输出当文件读
diff <(ls /dir1) <(ls /dir2)

# 输出进程替换：>(command) — 把文件写入当命令输入
echo data | tee >(cmd1) >(cmd2) > /dev/null
```

`<(command)` 在后台运行命令，并返回一个临时命名管道路径（如 `/dev/fd/63`），可以当文件路径使用。

---

## 🔧 涉及的命令

### 1️⃣ `echo` — 输出文本

```bash
# 语法
echo [选项] [字符串]

# 基本用法
echo "Hello World"          # 输出：Hello World
echo -n "no newline"        # 不换行
echo -e "line1\nline2"      # 解释转义字符

# 配合重定向
echo "PWN" > COLLEGE         # 写入文件
echo "more data" >> COLLEGE  # 追加到文件
```

> ⚠️ `echo` 默认在末尾加换行符。用 `-n` 可以去掉。

### 2️⃣ `cat` — 读取/拼接文件

```bash
# 语法
cat [文件...]

# 示例
cat file.txt                 # 显示文件内容
cat file1 file2 > merged     # 合并文件
cat < input.txt              # 从 stdin 读取（等效 cat input.txt）
```

### 3️⃣ `grep` — 文本搜索

```bash
# 语法
grep [选项] 模式 [文件]

# 常用选项
grep "flag" data.txt         # 在文件中搜索
grep -i "flag" data.txt      # 忽略大小写
grep -v "DECOY" data.txt     # 反向匹配：排除含 DECOY 的行 🎯
grep -n "error" log.txt      # 显示行号
grep -c "pattern" file       # 只输出匹配行数
grep -r "TODO" ./src/        # 递归搜索目录

# 配合管道
cat huge_file | grep "needle"
/challenge/run | grep "flag"
```

> ⚠️ `grep -v` 是**反向过滤**的利器——显示所有**不匹配**的行。

### 4️⃣ `sed` — 流编辑器

```bash
# 语法
sed 's/旧文本/新文本/g'

# 示例
echo "helloFAKEworld" | sed 's/FAKE//g'   # 输出：helloworld
echo "abc123" | sed 's/[0-9]//g'           # 输出：abc（删除数字）

# 替换文件内容
sed -i 's/old/new/g' file.txt              # 直接修改文件（-i = in-place）
```

> ⚠️ 不加 `g` 只替换每行第一个匹配。

### 5️⃣ `tee` — T 型分流器

```bash
# 语法
tee [选项] 文件...

# 作用：从 stdin 读取，同时写到 stdout 和指定文件
echo "data" | tee file1.txt file2.txt
# stdout 输出 "data"，同时写入 file1.txt 和 file2.txt

# 追加模式
echo "more" | tee -a file1.txt

# 调试管道：在中间插入 tee 查看数据
command1 | tee /tmp/debug.txt | command2
```

> 💡 `tee` 得名于水管的 T 型接头——数据一路进来，分成多路出去。

### 6️⃣ `diff` — 比较差异

```bash
# 语法
diff 文件1 文件2

# 配合进程替换比较命令输出
diff <(command1) <(command2)

# 示例
diff <(ls /dir1) <(ls /dir2)   # 比较两个目录的文件列表
```

### 7️⃣ `/dev/null` — 黑洞设备

```bash
# 丢弃 stdout
command > /dev/null

# 丢弃 stderr
command 2> /dev/null

# 丢弃所有输出
command &> /dev/null
# 或
command > /dev/null 2>&1
```

> 💡 `/dev/null` 是一个特殊文件，写入的数据全部被丢弃，读取时立刻返回 EOF。常用于静默执行命令。

---

## 🎯 挑战解析

### Challenge 1: Redirecting output 📤
> 💡 提示：用 `echo` 和 `>` 把特定单词写入特定文件名。注意大小写！

### Challenge 2: Redirecting more output 📤📤
> 💡 提示：把 `/challenge/run` 的输出重定向到指定文件，然后 `cat` 该文件获取 flag。

### Challenge 3: Appending output ➕
> 💡 提示：用 `>>` 而不是 `>`！程序会分两次写入，追加模式才能保留两半 flag。

### Challenge 4: Redirecting errors 🚫
> 💡 提示：同时使用 `>` 和 `2>` 分别重定向 stdout 和 stderr 到不同文件。

### Challenge 5: Redirecting input 📥
> 💡 提示：先用 `echo` + `>` 创建输入文件，再用 `<` 把文件内容送给程序。

### Challenge 6: Grepping stored results 🔍
> 💡 提示：先把海量输出重定向到文件，再 `grep` 搜索关键词。

### Challenge 7: Grepping live output 🔍⚡
> 💡 提示：直接用管道 `|` 把输出送给 `grep`，不需要中间文件。

### Challenge 8: Grepping errors 🔍🚫
> 💡 提示：stderr 无法直接管道。先 `2>&1` 合并到 stdout，再 `|` 给 `grep`。

### Challenge 9: Grepping with `-v` (反向过滤) 🔄
> 💡 提示：用 `grep -v "DECOY"` 过滤掉假 flag，留下真 flag。

### Challenge 10: Filtering with `sed` ✂️
> 💡 提示：用 `sed 's/垃圾文本//g'` 去掉 flag 中夹杂的干扰字符串。

### Challenge 11: Duplicating piped data with `tee` 🔀
> 💡 提示：用 `tee` 在管道中截获数据查看，了解程序需要什么输入。

### Challenge 12: Process substitution (diff) 🔃
> 💡 提示：用 `diff <(cmd1) <(cmd2)` 比较两个程序的输出，找出多出来的那一行。

### Challenge 13: Process substitution (tee + writing) ✍️
> 💡 提示：用 `tee` 搭配 `>(command)` 输出进程替换，同时向两个命令发送数据。

---

## 📚 知识扩展

### 🔍 Here Document 与 Here String

```bash
# Here Document：多行输入
cat << EOF
第一行
第二行
EOF

# Here String：单行输入
grep "pattern" <<< "search in this string"
```

### 🔍 文件描述符的高级用法

```bash
# 打开自定义 FD
exec 3> /tmp/custom.log    # FD 3 指向文件
echo "log entry" >&3       # 写到 FD 3
exec 3>&-                  # 关闭 FD 3

# 交换 stdout 和 stderr
command 3>&1 1>&2 2>&3 3>&-
```

### 🔍 管道的返回值

```bash
# 默认管道返回最后一个命令的退出码
false | true
echo $?  # 0（true 的退出码）

# 使用 PIPESTATUS 获取每个命令的退出码
false | true | false
echo ${PIPESTATUS[@]}  # 1 0 1

# 使用 set -o pipefail 让管道返回第一个非零退出码
set -o pipefail
false | true
echo $?  # 1
```

### 🔍 命名管道（Named Pipe / FIFO）

```bash
# 创建命名管道
mkfifo /tmp/mypipe

# 终端 1：写入
echo "hello" > /tmp/mypipe

# 终端 2：读取
cat < /tmp/mypipe  # 输出：hello
```

### 🔍 xargs — 把 stdin 转为命令参数

```bash
# 管道传递的是数据流，但有些命令需要参数而非 stdin
find . -name "*.log" | xargs rm     # 删除找到的所有 .log 文件
echo "file1 file2" | xargs cat      # 等效于 cat file1 file2
```

---

## 🏆 最佳实践

1. 🎯 **优先用管道而非临时文件** — `cmd1 | cmd2` 比 `cmd1 > tmp; cmd2 < tmp; rm tmp` 更优雅高效
2. 🎯 **总是处理 stderr** — 用 `2>` 保存错误日志，或 `2>/dev/null` 静默丢弃
3. 🎯 **用 `tee` 调试管道** — 在管道链中插入 `tee /tmp/debug` 查看中间数据
4. 🎯 **用 `set -o pipefail`** — 在脚本中确保管道任意环节失败都能被捕获
5. 🎯 **用 `>>` 而非 `>`** — 当你需要保留文件已有内容时，避免意外覆盖

---

## 📝 小结

| 技能 | 操作符/命令 | 一句话总结 |
|------|-------------|-----------|
| 输出重定向 | `>` / `>>` | stdout 写入/追加到文件 |
| 错误重定向 | `2>` / `2>>` | stderr 写入/追加到文件 |
| 输入重定向 | `<` | 从文件读取到 stdin |
| 合并流 | `2>&1` | stderr 合并到 stdout |
| 管道 | `\|` | 左边 stdout → 右边 stdin |
| 分流 | `tee` | 数据同时到屏幕和文件 |
| 黑洞 | `/dev/null` | 丢弃不需要的输出 |
| 进程替换 | `<()` / `>()` | 命令输出当文件用 |
| 流编辑 | `sed` | 在数据流中替换文本 |
| 反向过滤 | `grep -v` | 排除匹配的行 |

> 🚀 **下一站**：[07 - Shell Variables](./07-Shell-Variables.md) — 学习 Shell 变量的赋值、导出与命令替换！
