# 08 - Data Manipulation 🔄 | 数据处理

> 🌐 **模块地址**: [https://pwn.college/linux-luminarium/data/](https://pwn.college/linux-luminarium/data/)
> ⭐⭐ **难度**: 中等
> 🎯 **核心主题**: 文本数据的过滤、转换、排序与组合处理
> 📋 **前置知识**: 管道（pipe）、重定向、基本文件操作

---

## 📖 模块概述

终于来到了 **数据处理** 的世界！🎉

之前我们学会了管道（pipe）和重定向，现在要把这些技能真正用起来了。Linux 的哲学是 **"Do one thing and do it well"** —— 每个命令只做一件小事，但通过管道把它们串起来，就能完成极其复杂的数据处理任务 💪

这个模块会教你一系列文本处理的 **瑞士军刀** 🔪：

| 命令 | 一句话概括 | 类比 |
|------|-----------|------|
| `tr` | 字符级别的替换/删除 | 🔤 字母翻译机 |
| `head` | 取前 N 行 | 📄 只看开头 |
| `tail` | 取后 N 行 | 📄 只看结尾 |
| `cut` | 按列提取字段 | ✂️ 纵向切割表格 |
| `sort` | 排序 | 🔢 整理排列 |
| `uniq` | 去重 | 🧹 扫除重复 |
| `wc` | 统计行/词/字符数 | 🔢 计数器 |
| `sed` | 流编辑器（替换等） | ✏️ 批量查找替换 |
| `awk` | 强大的文本处理语言 | 🧠 文本处理大脑 |

这些命令的 **组合使用** 才是真正的魔法 ✨ —— 用管道 `|` 串联起来，数据像流水线一样被一步步加工处理。

---

## 🔧 涉及的命令

### 1️⃣ `tr` — 字符翻译器 🔤

**语法**:
```bash
tr [选项] SET1 [SET2]
```

**作用**: 将 stdin 中的字符从 SET1 翻译为 SET2，或删除指定字符。注意：`tr` **只能从 stdin 读取**，不能直接接文件名！

**常用参数**:

| 参数 | 作用 | 示例 |
|------|------|------|
| (无) | 字符替换 | `tr 'a' 'b'` |
| `-d` | 删除指定字符 | `tr -d 'x'` |
| `-s` | 压缩重复字符 | `tr -s ' '`（多个空格变一个） |
| `-c` | 取补集 | `tr -cd 'a-z'`（只保留小写字母） |

**示例**:

```bash
# 🔄 基本替换 —— 把 O 换成 P
echo "OWN" | tr O P
# 输出: PWN

# 🔄 多字符替换 —— 位置对应替换
echo "PWM.COLLAGE" | tr MA NE
# 输出: PWN.COLLEGE
# M→N, A→E，按位置一一对应！

# 🔄 大小写转换 —— 超常用！
echo "Hello World" | tr 'a-z' 'A-Z'
# 输出: HELLO WORLD

echo "Hello World" | tr 'A-Z' 'a-z'
# 输出: hello world

# 🗑️ 删除字符
echo "PAWN" | tr -d A
# 输出: PWN

echo "h^e%l^l%o" | tr -d '^%'
# 输出: hello

# 🗑️ 删除换行符（把多行合并为一行）
echo -e "hello\nworld" | tr -d '\n'
# 输出: helloworld

# 🔧 压缩重复空格
echo "too    many    spaces" | tr -s ' '
# 输出: too many spaces

# 🔧 只保留数字
echo "abc123def456" | tr -cd '0-9'
# 输出: 123456
```

> ⚠️ **注意事项**:
> - `tr` 不能直接读文件！必须用管道或重定向：`cat file | tr ...` 或 `tr ... < file`
> - `\n` 表示换行符，必须放在引号里，否则 shell 会先解释它
> - `\\` 表示字面反斜杠（转义的转义 🤯）
> - SET1 和 SET2 是 **逐字符对应** 的，不是字符串替换！

---

### 2️⃣ `head` — 看头部 📄⬆️

**语法**:
```bash
head [选项] [文件...]
```

**作用**: 显示文件或 stdin 的前几行（默认 10 行）。

**常用参数**:

| 参数 | 作用 | 示例 |
|------|------|------|
| `-n N` | 显示前 N 行 | `head -n 5 file.txt` |
| `-c N` | 显示前 N 个字节 | `head -c 100 file.txt` |
| `-n -N` | 显示除了最后 N 行外的所有行 | `head -n -3 file.txt` |

**示例**:

```bash
# 📄 默认显示前 10 行
cat /var/log/syslog | head

# 📄 显示前 5 行
head -n 5 /etc/passwd

# 📄 通过管道使用
ls -la | head -n 3

# 📄 显示前 100 个字节
head -c 100 bigfile.bin

# 📄 显示除最后 2 行外的所有内容
head -n -2 file.txt
```

> ⚠️ **注意事项**:
> - `-n 5` 可以简写为 `-5`
> - 处理大文件时，`head` 非常高效 —— 它读到够了就停，不会读整个文件 🚀

---

### 3️⃣ `tail` — 看尾部 📄⬇️

**语法**:
```bash
tail [选项] [文件...]
```

**作用**: 显示文件或 stdin 的最后几行（默认 10 行）。

**常用参数**:

| 参数 | 作用 | 示例 |
|------|------|------|
| `-n N` | 显示最后 N 行 | `tail -n 5 file.txt` |
| `-n +N` | 从第 N 行开始显示到末尾 | `tail -n +3 file.txt` |
| `-f` | 实时追踪文件变化 | `tail -f /var/log/syslog` |
| `-c N` | 显示最后 N 个字节 | `tail -c 50 file.txt` |

**示例**:

```bash
# 📄 查看最后 10 行
tail /var/log/syslog

# 📄 查看最后 3 行
tail -n 3 file.txt

# 📄 从第 5 行开始显示（跳过前 4 行）
tail -n +5 file.txt

# 👀 实时追踪日志（运维必备！）
tail -f /var/log/nginx/access.log

# 🔗 配合 head 取中间行（取第 5-10 行）
head -n 10 file.txt | tail -n 6
```

> ⚠️ **注意事项**:
> - `tail -f` 会持续运行，按 `Ctrl+C` 退出
> - `tail -n +N` 中的 `+` 号表示 "从第 N 行开始"，别忘了！
> - 和 `head` 一样，`-n 5` 可以简写为 `-5`

---

### 4️⃣ `cut` — 文本切割器 ✂️

**语法**:
```bash
cut [选项] [文件...]
```

**作用**: 按分隔符或位置提取文本的指定列/字段。

**常用参数**:

| 参数 | 作用 | 示例 |
|------|------|------|
| `-d '分隔符'` | 指定字段分隔符 | `-d ','` |
| `-f N` | 提取第 N 个字段 | `-f 1` |
| `-f N,M` | 提取多个字段 | `-f 1,3` |
| `-f N-M` | 提取字段范围 | `-f 2-5` |
| `-c N-M` | 按字符位置提取 | `-c 1-10` |
| `-b N-M` | 按字节位置提取 | `-b 1-10` |

**示例**:

```bash
# ✂️ 用空格分隔，取第 1 列
echo "Alice 90 A" | cut -d ' ' -f 1
# 输出: Alice

# ✂️ 用逗号分隔（CSV 文件常用！）
echo "name,age,city" | cut -d ',' -f 2
# 输出: age

# ✂️ 取多列
echo "a:b:c:d:e" | cut -d ':' -f 1,3,5
# 输出: a:c:e

# ✂️ 取列范围
echo "a:b:c:d:e" | cut -d ':' -f 2-4
# 输出: b:c:d

# ✂️ 处理 /etc/passwd —— 提取用户名
cut -d ':' -f 1 /etc/passwd

# ✂️ 按字符位置
echo "Hello World" | cut -c 1-5
# 输出: Hello
```

> ⚠️ **注意事项**:
> - 分隔符默认是 **TAB**，不是空格！处理空格分隔的数据要显式指定 `-d ' '`
> - `-d` 的参数只能是 **单个字符**
> - 空格作为分隔符时要加引号：`-d " "`

---

### 5️⃣ `sort` — 排序大师 🔢

**语法**:
```bash
sort [选项] [文件...]
```

**作用**: 对输入行进行排序。

**常用参数**:

| 参数 | 作用 | 示例 |
|------|------|------|
| (默认) | 字母顺序排序 | `sort names.txt` |
| `-r` | 逆序排序 | `sort -r names.txt` |
| `-n` | 按数值排序 | `sort -n numbers.txt` |
| `-u` | 去重排序 | `sort -u data.txt` |
| `-R` | 随机排序 | `sort -R data.txt` |
| `-k N` | 按第 N 列排序 | `sort -k 2 scores.txt` |
| `-t '分隔符'` | 指定列分隔符 | `sort -t ',' -k 2 data.csv` |

**示例**:

```bash
# 🔤 字母排序
echo -e "banana\napple\ncherry" | sort
# apple banana cherry

# 🔢 数值排序（不加 -n 的话 9 会排在 10 后面！）
echo -e "9\n10\n2\n100" | sort -n
# 2 9 10 100

# 🔄 逆序
echo -e "a\nc\nb" | sort -r
# c b a

# 🎲 随机打乱
seq 1 10 | sort -R

# 📊 按第 2 列的数值排序
echo -e "Alice 90\nBob 85\nCharlie 95" | sort -t ' ' -k 2 -n
# Bob 85 → Alice 90 → Charlie 95

# 🧹 排序并去重
echo -e "apple\nbanana\napple\ncherry\nbanana" | sort -u
# apple banana cherry
```

> ⚠️ **注意事项**:
> - 不加 `-n` 时，`sort` 按字典序排，所以 `9` > `10`（因为 '9' > '1'）—— 排数字一定要加 `-n`！
> - `-k` 的字段编号从 1 开始
> - `sort -u` = `sort | uniq`，但更高效

---

### 6️⃣ `uniq` — 去重专家 🧹

**语法**:
```bash
uniq [选项] [输入文件] [输出文件]
```

**作用**: 去除 **相邻的** 重复行。

**常用参数**:

| 参数 | 作用 | 示例 |
|------|------|------|
| (默认) | 去除相邻重复行 | `uniq data.txt` |
| `-c` | 显示每行出现次数 | `uniq -c data.txt` |
| `-d` | 只显示有重复的行 | `uniq -d data.txt` |
| `-u` | 只显示没有重复的行 | `uniq -u data.txt` |
| `-i` | 忽略大小写 | `uniq -i data.txt` |

**示例**:

```bash
# 🧹 基本去重（注意：要先排序！）
echo -e "apple\napple\nbanana\nbanana\ncherry" | uniq
# apple banana cherry

# 🔢 计数每行出现几次
echo -e "apple\napple\nbanana\napple" | sort | uniq -c
#       3 apple
#       1 banana

# 🔍 只看重复的行
echo -e "apple\napple\nbanana\ncherry\ncherry" | uniq -d
# apple cherry

# 🏆 经典组合：找出出现最多的行
cat access.log | sort | uniq -c | sort -rn | head -10
```

> ⚠️ **注意事项**:
> - `uniq` 只去除 **相邻的** 重复行！不相邻的重复不会被处理！
> - 所以 99% 的情况下要先 `sort` 再 `uniq`：`sort file | uniq`
> - 这是一个超级常见的新手坑 🕳️

---

### 7️⃣ `wc` — 计数器 🔢

**语法**:
```bash
wc [选项] [文件...]
```

**作用**: 统计行数、单词数、字符/字节数。

**常用参数**:

| 参数 | 作用 | 示例 |
|------|------|------|
| `-l` | 统计行数 | `wc -l file.txt` |
| `-w` | 统计单词数 | `wc -w file.txt` |
| `-c` | 统计字节数 | `wc -c file.txt` |
| `-m` | 统计字符数 | `wc -m file.txt` |
| (无参数) | 显示全部统计 | `wc file.txt` |

**示例**:

```bash
# 📊 统计文件行数
wc -l /etc/passwd

# 📊 统计当前目录有多少文件
ls | wc -l

# 📊 统计代码行数
find . -name "*.py" | xargs wc -l

# 📊 统计某个单词出现次数
grep -o "error" log.txt | wc -l
```

> ⚠️ **注意事项**:
> - `-c` 是字节数，`-m` 是字符数，在 UTF-8 环境下可能不同（中文字符占 3 字节）
> - 不加参数时输出格式是：`行数 词数 字节数 文件名`

---

### 8️⃣ `sed` — 流编辑器 ✏️

**语法**:
```bash
sed [选项] '命令' [文件...]
```

**作用**: 对文本流进行编辑操作，最常用于查找替换。

**常用参数**:

| 参数 | 作用 | 示例 |
|------|------|------|
| `s/old/new/` | 替换每行第一个匹配 | `sed 's/cat/dog/'` |
| `s/old/new/g` | 替换所有匹配 | `sed 's/cat/dog/g'` |
| `-i` | 直接修改文件 | `sed -i 's/old/new/g' file` |
| `-n` | 静默模式 | 配合 `p` 使用 |
| `Nd` | 删除第 N 行 | `sed '3d' file` |

**示例**:

```bash
# ✏️ 基本替换
echo "I love cats" | sed 's/cats/dogs/'
# I love dogs

# ✏️ 全局替换（不加 g 只替换第一个！）
echo "cat and cat" | sed 's/cat/dog/g'
# dog and dog

# ✏️ 删除空行
sed '/^$/d' file.txt

# ✏️ 删除第 3 行
sed '3d' file.txt

# ✏️ 只显示第 5-10 行
sed -n '5,10p' file.txt

# ✏️ 直接修改文件（危险操作！建议先备份）
sed -i.bak 's/old/new/g' config.txt
```

> ⚠️ **注意事项**:
> - `sed -i` 会直接修改原文件！加 `.bak` 后缀可以自动备份：`sed -i.bak ...`
> - macOS 的 `sed` 和 Linux 的 GNU `sed` 有差异，`-i` 的用法不同
> - `s` 命令不加 `g` 标志只替换每行的第一个匹配！

---

### 9️⃣ `awk` — 文本处理之王 👑

**语法**:
```bash
awk '模式 {动作}' [文件...]
```

**作用**: 按行处理文本，支持字段提取、条件判断、计算等。

**常用用法**:

```bash
# 👑 打印第 1 列
echo "Alice 90" | awk '{print $1}'
# Alice

# 👑 打印第 2 列
echo "Alice 90 A" | awk '{print $2}'
# 90

# 👑 打印最后一列
echo "a b c d" | awk '{print $NF}'
# d

# 👑 自定义分隔符
echo "Alice,90,A" | awk -F',' '{print $2}'
# 90

# 👑 条件过滤 —— 只打印第二列大于 85 的行
echo -e "Alice 90\nBob 80\nCharlie 95" | awk '$2 > 85 {print $1, $2}'
# Alice 90
# Charlie 95

# 👑 计算总和
echo -e "10\n20\n30" | awk '{sum+=$1} END {print sum}'
# 60

# 👑 自定义输出格式
echo "Alice 90" | awk '{printf "Name: %s, Score: %d\n", $1, $2}'
# Name: Alice, Score: 90
```

> ⚠️ **注意事项**:
> - `awk` 默认以空格/tab 分隔字段
> - `$0` 是整行，`$1` 是第 1 列，`$NF` 是最后一列
> - `awk` 功能极其强大，这里只是冰山一角 🧊 —— 它本身就是一门编程语言！

---

## 🎯 挑战解析

### Challenge 1: Swapped Casing 🔄

> `/challenge/run` 输出 flag，但大小写被翻转了。用 `tr` 还原！

**提示**:
```bash
/challenge/run | tr 'a-zA-Z' 'A-Za-z'
```
把小写范围映射到大写，大写映射到小写，完美翻转 ✨

---

### Challenge 2: Removing Decoy Characters 🗑️

> flag 中混入了 `^` 和 `%` 干扰字符，用 `tr -d` 删掉它们。

**提示**:
```bash
/challenge/run | tr -d '^%'
```

---

### Challenge 3: Removing Newlines 📝

> flag 被插入了一堆换行符，用 `tr -d` 删除换行。

**提示**:
```bash
/challenge/run | tr -d '\n'
```

---

### Challenge 4: Head of Output 📄

> `/challenge/pwn` 输出大量数据，取前 7 行传给 `/challenge/college`。

**提示**:
```bash
/challenge/pwn | head -n 7 | /challenge/college
```
三个命令，两个管道，流水线作业！🏭

---

### Challenge 5: Cutting Columns ✂️

> `/challenge/run` 输出多列数据，flag 字符藏在某一列里。用 `cut` 提取，再用 `tr` 去掉换行。

**提示**:
```bash
/challenge/run | cut -d ' ' -f 2 | tr -d '\n'
```
具体是第几个字段（`-f` 的值）需要先看一下输出来判断，注意分隔符是什么 🔍

---

### Challenge 6: Sorting for the Flag 🔢

> `/challenge/flags.txt` 里有 100 个假 flag 和 1 个真 flag。排序后真 flag 在最后。

**提示**:
```bash
sort /challenge/flags.txt | tail -n 1
```
排序后取最后一行就是真正的 flag！也可以用 `sort /challenge/flags.txt | tail -1` 🎯

---

## 📚 知识扩展

### 🔗 管道组合的艺术

数据处理的真正威力在于 **组合**。以下是一些实用的经典 combo：

```bash
# 🏆 统计 access.log 中访问最多的 IP（Top 10）
cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -10

# 🏆 找出目录中最大的 10 个文件
du -sh * | sort -rh | head -10

# 🏆 统计代码中 TODO 的数量
grep -r "TODO" . | wc -l

# 🏆 提取 CSV 第 2 列并去重排序
cut -d ',' -f 2 data.csv | sort -u

# 🏆 把文件中所有 tab 替换为空格
cat file.txt | tr '\t' ' '

# 🏆 批量重命名文件中的字符串
sed -i 's/old_name/new_name/g' *.conf
```

### 🧠 Unix 哲学回顾

| 原则 | 含义 | 体现 |
|------|------|------|
| 只做一件事 | 每个程序专注于一个功能 | `sort` 只排序，`uniq` 只去重 |
| 文本是通用接口 | 用纯文本作为数据格式 | 几乎所有命令都处理文本流 |
| 程序可组合 | 通过管道连接程序 | `sort | uniq -c | sort -rn` |
| 早做原型 | 快速验证想法 | 命令行上一行就能测试 |

### 📊 命令速查对比表

| 需求 | 命令 | 示例 |
|------|------|------|
| 替换字符 | `tr` | `tr 'a-z' 'A-Z'` |
| 替换字符串 | `sed` | `sed 's/old/new/g'` |
| 提取列 | `cut` / `awk` | `cut -d: -f1` / `awk '{print $1}'` |
| 排序 | `sort` | `sort -n` |
| 去重 | `sort -u` / `uniq` | `sort | uniq -c` |
| 统计 | `wc` | `wc -l` |
| 前 N 行 | `head` | `head -n 5` |
| 后 N 行 | `tail` | `tail -n 5` |

---

## 🏆 最佳实践

1. **先看再操作** 👀 —— 处理数据前先用 `head` 看几行，了解数据格式
2. **逐步构建管道** 🧱 —— 不要一次写完整条管道，一段段加，每加一段检查输出
3. **`sort` 在 `uniq` 之前** ⚠️ —— 这是最常见的错误！`uniq` 只去相邻重复行
4. **数值排序加 `-n`** 🔢 —— 否则 `9` 会排在 `10` 后面
5. **`sed -i` 先备份** 💾 —— 用 `sed -i.bak` 自动创建备份
6. **`tr` vs `sed`** 🤔 —— 单字符用 `tr`，字符串/正则用 `sed`
7. **`cut` vs `awk`** 🤔 —— 简单切列用 `cut`，需要逻辑判断用 `awk`
8. **用 `tee` 调试管道** 🔍 —— `cmd1 | tee debug.txt | cmd2` 可以同时保存中间结果

---

## 📝 小结

这个模块教会了我们 Linux 下 **文本数据处理** 的核心工具集 🧰：

- 🔤 **`tr`** —— 字符级翻译和删除
- 📄 **`head` / `tail`** —— 取首尾行
- ✂️ **`cut`** —— 按列提取
- 🔢 **`sort`** —— 排序
- 🧹 **`uniq`** —— 去重
- 🔢 **`wc`** —— 统计计数
- ✏️ **`sed`** —— 流式查找替换
- 👑 **`awk`** —— 强大的文本编程

**核心思想**：每个工具只做一件小事，但通过管道 `|` 组合起来，就能完成任何文本处理任务！这就是 Unix 哲学的魅力 ✨

> 🚀 **下一站**: [09 - Shell Variables](../09-Shell-Variables/) —— 我们将学习 shell 变量的使用，包括环境变量、变量赋值和导出，让我们的 shell 技能再上一层楼！🎓
