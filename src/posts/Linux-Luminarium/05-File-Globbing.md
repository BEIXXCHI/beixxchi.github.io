# 05 - File Globbing 🌟 | 文件通配符

> **模块地址**: [https://pwn.college/linux-luminarium/globbing/](https://pwn.college/linux-luminarium/globbing/)
> **难度**: ⭐⭐
> **核心主题**: Shell Globbing（通配符展开）— 用通配符模式匹配文件名，告别逐字输入的痛苦！

---

## 📖 模块概述

还在一个字母一个字母地敲文件路径吗？😩 太累了吧！

Shell 说：**我来帮你！** 🦸‍♂️

**Globbing**（通配符匹配）是 Shell 内建的文件名展开机制，让你用简短的模式匹配一堆文件。
比如 `*.txt` 就能匹配当前目录下所有 `.txt` 文件，再也不用一个个敲了！✨

本模块一共 **10 个挑战**，覆盖：
1. ⭐ `*` 星号通配符（匹配任意字符串）
2. ❓ `?` 问号通配符（匹配单个字符）
3. 📦 `[]` 方括号通配符（匹配字符集）
4. 🛤️ 路径中使用 glob
5. 🔗 多 glob 组合
6. 🧩 综合 glob 挑战
7. 🚫 `[!]` / `[^]` 反向匹配
8. ⌨️ Tab 补全基础
9. ⌨️ Tab 补全进阶
10. ⌨️ Tab 补全命令

---

## 🧠 核心概念：Shell 展开与 Globbing

### 🔄 Shell 展开（Shell Expansion）是什么？

当你在终端输入一条命令并按下回车时，Shell **并不会**直接把你输入的文字原封不动地传给程序！🤯

Shell 会先进行一系列 **展开（expansion）** 操作，然后才执行命令。展开的顺序大致如下：

```
你的输入 → Brace Expansion → Tilde Expansion → Parameter Expansion
         → Command Substitution → Arithmetic Expansion → Word Splitting
         → ✨ Filename Expansion (Globbing) ✨ → Quote Removal → 执行！
```

**Globbing 就是 Filename Expansion** — Shell 看到通配符字符（`*`、`?`、`[]`）时，
会在文件系统中查找匹配的文件名，然后用匹配结果**替换**掉原来的模式！

### 🎯 关键理解

| 特性 | 说明 |
|------|------|
| 🕐 **展开时机** | 命令执行**之前**，由 Shell 完成 |
| 🎭 **谁来展开** | **Shell** 自己！不是 `ls`、不是 `cat`、不是任何程序 |
| 📁 **匹配对象** | 文件系统中**实际存在**的文件/目录名 |
| 🚫 **不匹配时** | 默认保留原始 glob 字符串不变 |
| 🔒 **引号保护** | 用引号包裹可以阻止 glob 展开 |

```bash
# Shell 展开过程演示 🎬
$ echo *.txt
# Shell: 让我看看当前目录... 找到 a.txt b.txt c.txt
# Shell: 好，把 *.txt 替换成 a.txt b.txt c.txt
# 实际执行: echo a.txt b.txt c.txt

$ echo "*.txt"
# 引号保护！Shell 不展开
# 输出: *.txt
```

> 💡 **一句话记忆**: Globbing = Shell 帮你把通配符翻译成真实文件名！

---

## 🔧 通配符详解

### ⭐ `*` 星号通配符 — 万能匹配王

#### 📐 语法与规则

| 项目 | 说明 |
|------|------|
| **语法** | `*` |
| **匹配** | 任意数量的任意字符（包括零个字符！） |
| **不匹配** | `/`（路径分隔符）和开头的 `.`（隐藏文件） |
| **常见用法** | `*.txt`、`file_*`、`*log*` |

#### 💻 代码示例

```bash
# 创建测试文件 📁
$ touch file_a file_b file_c

# * 匹配所有以 file_ 开头的文件 🎯
$ echo file_*
file_a file_b file_c

# 只有一个匹配也可以 👍
$ echo file_a*
file_a

# 没有匹配时保留原样 🤷
$ echo nope_*
nope_*

# 路径中也能用！🛤️
$ echo /ho*/*ck*
/home/hacker

$ echo /*/hacker
/home/hacker
```

#### ⚠️ 注意事项

```bash
# ❌ * 不匹配隐藏文件（以 . 开头的文件）
$ ls *          # 不会列出 .bashrc 等
$ ls .*         # 这样才能匹配隐藏文件

# ❌ * 不跨越路径分隔符 /
$ echo /home/*  # 匹配 /home/ 下一层
                # 不会递归到子目录！
```

---

### ❓ `?` 问号通配符 — 精准单字符

#### 📐 语法与规则

| 项目 | 说明 |
|------|------|
| **语法** | `?` |
| **匹配** | 恰好**一个**任意字符 |
| **不匹配** | `/` 和开头的 `.` |
| **常见用法** | `file_?`、`???.txt`、`log_202?` |

#### 💻 代码示例

```bash
$ touch file_a file_b file_cc

# ? 只匹配一个字符 🎯
$ echo file_?
file_a file_b       # file_cc 不匹配！因为 cc 是两个字符

# ?? 匹配两个字符 ✌️
$ echo file_??
file_cc

# 组合使用 🔗
$ echo ???_?
file_a file_b        # 如果有 3+1 结构的文件名就匹配
```

#### 🔍 `*` vs `?` 对比

| 特性 | `*` | `?` |
|------|-----|-----|
| 匹配字符数 | 0 到无限个 | **恰好 1 个** |
| `file_*` 匹配 `file_` | ✅ 是 | ❌ 否 |
| `file_*` 匹配 `file_abc` | ✅ 是 | ❌ 否 |
| `file_?` 匹配 `file_a` | ✅ 是 | ✅ 是 |
| `file_?` 匹配 `file_ab` | ✅（`*` 的话）| ❌ 否 |
| 精确度 | 🎪 宽泛 | 🎯 精准 |

---

### 📦 `[]` 方括号通配符 — 字符集选择器

#### 📐 语法与规则

| 项目 | 说明 |
|------|------|
| **语法** | `[字符列表]` |
| **匹配** | 括号中列出的**任意一个**字符 |
| **范围** | `[a-z]`、`[0-9]`、`[A-Z]` |
| **常见用法** | `file_[abc]`、`[Mm]akefile`、`log_[0-9]` |

#### 💻 代码示例

```bash
$ touch file_a file_b file_c

# 只匹配 a 和 b 🎯
$ echo file_[ab]
file_a file_b

# 范围匹配 📏
$ echo file_[a-c]
file_a file_b file_c

# 大小写都要？
$ ls [Rr]eadme*
Readme.md readme.txt
```

#### 📊 字符类（POSIX Character Classes）

方括号里还能用预定义的字符类，超方便！🎉

| 字符类 | 等价于 | 说明 |
|--------|--------|------|
| `[:alpha:]` | `[a-zA-Z]` | 所有字母 |
| `[:digit:]` | `[0-9]` | 所有数字 |
| `[:alnum:]` | `[a-zA-Z0-9]` | 字母和数字 |
| `[:upper:]` | `[A-Z]` | 大写字母 |
| `[:lower:]` | `[a-z]` | 小写字母 |
| `[:space:]` | 空白字符 | 空格、Tab 等 |

```bash
# 注意：要双层方括号！
$ ls file_[[:digit:]]    # 匹配 file_0 到 file_9
$ ls [[:upper:]]*        # 匹配大写开头的文件
```

---

### 🚫 `[!]` / `[^]` 反向匹配 — 排除大法

#### 📐 语法与规则

| 项目 | 说明 |
|------|------|
| **语法** | `[!字符列表]` 或 `[^字符列表]` |
| **匹配** | **不在**括号中列出的任意一个字符 |
| **兼容性** | `!` 更通用；`^` 在较新 Bash 中可用 |

#### 💻 代码示例

```bash
$ touch file_a file_b file_c

# 排除 a 和 b，只匹配 c 🚫
$ echo file_[!ab]
file_c

# ^ 写法（较新 Bash）
$ echo file_[^ab]
file_c

# 排除数字 🔢
$ ls [!0-9]*           # 不以数字开头的文件
```

#### ⚠️ `!` 的陷阱

```bash
# ❌ ! 必须是 [] 中的第一个字符！
$ echo file_[a!b]      # 这里 ! 被当作普通字符匹配
                        # 匹配 file_a、file_!、file_b

# ✅ 正确用法
$ echo file_[!ab]      # ! 在开头，表示"非 a 非 b"
```

---

## 🎯 挑战解析

### Challenge 1: Matching with * ⭐

> 从 home 目录 `cd` 到 `/challenge`，但 `cd` 的参数**最多 4 个字符**！

```bash
# 思路：/challenge 太长了，用 * 缩短！ 🤔
# /cha* → 4 个字符（含 /）... 不对，算参数的话不含前面

$ cd /ch*
# Shell 展开 /ch* → /challenge ✅
$ /challenge/run
```

> 💡 关键：`/ch*` 只有 4 个字符，匹配到 `/challenge`！

---

### Challenge 2: Matching with ? ❓

> 用 `?` 替换 `/challenge` 中的 `c` 和 `l`！

```bash
$ cd /?ha??enge
# ? 替换了 c 和 l 的位置 🎯
$ /challenge/run
```

---

### Challenge 3: Matching with [] 📦

> 在 `/challenge/files` 中用一个 bracket glob 匹配 `file_b`、`file_a`、`file_s`、`file_h`

```bash
$ cd /challenge/files
$ /challenge/run file_[bash]
# [bash] 匹配 b、a、s、h 四个字符 🎯
```

> 💡 巧妙！`[bash]` 就是这四个字母的集合 — 而且拼起来就是 "bash"！😄

---

### Challenge 4: Matching paths with [] 🛤️

> 从 home 目录出发，用**绝对路径** + bracket glob 匹配同样的文件

```bash
$ /challenge/run /challenge/files/file_[bash]
# 路径中也能用 glob！Shell 会在对应目录中查找匹配 ✅
```

---

### Challenge 5: Mixing globs 🔗

> 在 `/challenge/files` 中，用最多 **3 个字符**的 glob 匹配所有含字母 `p` 的文件

```bash
$ cd /challenge/files
$ /challenge/run *p*
# 两个 * 夹一个 p：匹配任何包含 p 的文件名 🎯
```

---

### Challenge 6: Exclusionary globbing 🧩

> 用最多 **6 个字符**的 glob 同时匹配 "challenging"、"educational"、"pwning"

```bash
$ cd /challenge/files
$ ls
# 观察文件名... 🔍
# challenging, educational, pwning 都有什么共同点？
# 看看哪些文件不要匹配... 
# 提示：观察文件名的某些位置的字符模式

$ /challenge/run [cep]*
# [cep] 匹配以 c、e、p 开头的文件，* 匹配剩余部分 ✅
```

> 💡 这道题要仔细观察 `/challenge/files` 里所有文件名的规律！

---

### Challenge 7: Exclusionary globbing with [!] 🚫

> 运行 `/challenge/run` 匹配所有**不以** `p`、`w`、`n` 开头的文件

```bash
$ cd /challenge/files
$ /challenge/run [!pwn]*
# [!pwn] 排除以 p、w、n 开头的文件
# * 匹配剩余部分 🎯
```

---

### Challenge 8: Tab 补全基础 ⌨️

> `/challenge/pwncollege` 文件名有隐藏字符，必须用 Tab 补全！

```bash
$ cat /challenge/pwn<TAB>
# Shell 自动补全文件名（含隐藏字符）
# 直接就能读到 flag！🏁
```

> 💡 文件名中可能包含不可见字符或特殊 Unicode，手动输入根本不可能对！
> Tab 补全会帮你处理这些"魔法"字符 ✨

---

### Challenge 9: Tab 补全多选 ⌨️⌨️

> `/challenge/files` 下有多个 `pwncollege` 开头的文件，逐步 Tab 补全找到 flag

```bash
$ cat /challenge/files/p<TAB>
# 自动补全到 pwncollege（公共前缀）
$ cat /challenge/files/pwncollege<TAB><TAB>
# 显示所有选项，继续输入区分字符，再 Tab
# 一步步缩小范围找到正确文件！🔍
```

---

### Challenge 10: Tab 补全命令 ⌨️🖥️

> 有个以 `pwncollege` 开头的命令，Tab 补全找到它！

```bash
$ pwncollege<TAB>
# Shell 自动补全命令名，回车执行即可！🚀
```

---

## 📚 知识扩展

### 🔮 extglob — 扩展通配符（Extended Globbing）

Bash 默认的 glob 功能有限，但开启 `extglob` 后就能解锁更强大的模式！💪

```bash
# 开启 extglob
$ shopt -s extglob
```

| 模式 | 说明 | 示例 |
|------|------|------|
| `?(pattern)` | 匹配 0 或 1 次 | `file_?(backup_)data` |
| `*(pattern)` | 匹配 0 或多次 | `*(ab)` 匹配 ababab |
| `+(pattern)` | 匹配 1 或多次 | `+([0-9])` 匹配纯数字 |
| `@(pattern)` | 匹配恰好 1 次 | `@(yes\|no)` |
| `!(pattern)` | **不匹配** | `!(*.log)` 匹配非 .log 文件 |

```bash
# 删除所有非 .txt 和 .md 的文件 🗑️
$ shopt -s extglob
$ rm !(*.txt|*.md)

# 匹配 jpg 或 png
$ ls *.@(jpg|png)
```

### 🔗 Brace Expansion `{}` — 不是 Glob！

容易混淆但完全不同的机制！⚡

| 特性 | Globbing | Brace Expansion |
|------|----------|-----------------|
| **依赖文件系统？** | ✅ 是 | ❌ 否 |
| **展开时机** | 较晚 | 最早之一 |
| **没匹配时** | 保留原样 | **始终展开** |
| **用途** | 匹配已有文件 | 生成字符串 |

```bash
# Brace Expansion 示例 🎪
$ echo {a,b,c}
a b c

$ echo file_{1..5}
file_1 file_2 file_3 file_4 file_5

$ mkdir -p project/{src,test,docs}
# 一次创建三个目录！

# 组合使用 🔥
$ echo {a,b}{1,2}
a1 a2 b1 b2
```

### 🌊 globstar — 递归匹配 `**`

```bash
# 开启 globstar
$ shopt -s globstar

# ** 递归匹配所有子目录！ 🔄
$ ls **/*.py          # 当前目录及所有子目录下的 .py 文件
$ echo **/README.md   # 找到所有 README.md
```

### 🔍 dotglob — 匹配隐藏文件

```bash
# 默认 * 不匹配 .开头的文件
$ shopt -s dotglob

# 现在 * 也能匹配隐藏文件了！
$ echo *    # 包含 .bashrc 等
```

---

## 🏆 最佳实践

### ✅ Do — 好习惯

1. **🔍 先预览再执行** — 用 `echo` 或 `ls` 预览 glob 展开结果！
   ```bash
   # 删除前先看看会删什么 👀
   $ echo rm *.tmp
   rm cache.tmp log.tmp session.tmp
   # 确认后再真正执行
   $ rm *.tmp
   ```

2. **⌨️ 善用 Tab 补全** — 比手打更安全、更快、不容易错

3. **📏 优先使用精确的 glob** — `?` 和 `[]` 比 `*` 更安全
   ```bash
   # 😬 太宽泛
   $ rm *log*
   # 😊 更精确
   $ rm *.log
   # 😍 最精确
   $ rm app_[0-9][0-9].log
   ```

4. **🧪 引号保护** — 不想展开时用引号
   ```bash
   $ grep "*.txt" config    # 搜索字面量 *.txt
   $ find . -name "*.py"    # 把 glob 交给 find 处理
   ```

### ❌ Don't — 坏习惯

1. **🚨 不要盲目 `rm *`** — 永远先 `ls *` 看看！
2. **🚨 不要在 `find -name` 中忘记引号** — 不加引号 Shell 会先展开！
   ```bash
   # ❌ Shell 先展开了
   $ find . -name *.txt
   # ✅ 引号保护，让 find 自己处理
   $ find . -name "*.txt"
   ```
3. **🚨 不要混淆 glob 和 regex** — 它们语法不同！
   | Glob | Regex | 含义 |
   |------|-------|------|
   | `*` | `.*` | 任意字符串 |
   | `?` | `.` | 单个字符 |
   | `[abc]` | `[abc]` | 恰好相同！ |

---

## 📝 小结

### 🗺️ 通配符速查表

| 通配符 | 匹配 | 示例 | 匹配结果 |
|--------|------|------|----------|
| `*` | 任意字符串（含空） | `*.txt` | `a.txt`, `readme.txt` |
| `?` | 恰好一个字符 | `file_?` | `file_a`, `file_1` |
| `[abc]` | a、b 或 c | `[Mm]ake*` | `Makefile`, `makefile` |
| `[a-z]` | a 到 z 的范围 | `file_[a-c]` | `file_a`, `file_b`, `file_c` |
| `[!abc]` | 非 a、b、c | `[!.]*.log` | 不以 `.` 开头的 .log 文件 |
| `**` | 递归子目录 *(需 globstar)* | `**/*.py` | 所有子目录中的 .py |

### 🧠 核心要点

1. 🔄 **Globbing 是 Shell 展开** — 命令执行前 Shell 先把通配符替换成匹配的文件名
2. ⭐ **`*` = 任意多个字符**，`?` **= 恰好一个**，`[]` **= 指定集合中的一个**
3. 🚫 **`[!]` 取反** — 排除指定字符
4. 📁 **基于路径** — 每个 `/` 分隔的部分独立匹配
5. ⌨️ **Tab 是你最好的朋友** — 安全、快速、准确
6. 🔍 **先预览** — `echo` 看结果再执行危险操作！

### 🎓 学到了什么？

> 从手动输入每个文件名，到用几个字符匹配一堆文件 — 这就是 Shell 的魔法！🪄
> Globbing 是日常命令行操作中**最常用**的特性之一，掌握它能让你的效率翻倍！🚀

---

*📅 笔记创建: 2026-02-16*
*🏫 课程: [pwn.college Linux Luminarium](https://pwn.college/linux-luminarium/)*
