# 03 - Comprehending Commands 📂 | 理解命令

> **模块地址**: https://pwn.college/linux-luminarium/commands/
> **难度**: ⭐⭐ 基础级
> **核心主题**: cat, grep, diff, ls, touch, rm, mv, cp, 隐藏文件, find

---

## 📖 模块概述

这个模块是 Linux 命令行的"瑞士军刀"教学——你将学会最常用的文件操作命令。从读取文件、搜索内容、比较差异，到创建、删除、移动、复制文件，这些都是你日常操作中用得最多的命令。掌握了它们，你就能在文件系统中自由穿梭了！🚀

---

## 🔧 涉及的命令

### 1. cat — 读取与拼接文件 🐱

`cat` 是 **concatenate**（拼接）的缩写，但它最常见的用法其实就是"显示文件内容"。

#### 基本用法：读取文件

```bash
# 读取当前目录下的文件
hacker@dojo:~$ cat flag
pwn.college{FLAG_CONTENT_HERE}

# 读取绝对路径的文件
hacker@dojo:~$ cat /challenge/DESCRIPTION.md
This challenge requires you to read a file...
```

#### 拼接多个文件

`cat` 的本职工作是把多个文件拼接在一起输出：

```bash
# 拼接两个文件
hacker@dojo:~$ cat file1.txt file2.txt
这是文件1的内容
这是文件2的内容

# 拼接并写入新文件
hacker@dojo:~$ cat header.txt body.txt footer.txt > full_page.txt
```

#### cat 绝对路径读取

在 pwn.college 挑战中，flag 经常藏在各种路径下，你需要用绝对路径来读取：

```bash
hacker@dojo:~$ cat /flag
pwn.college{...}

hacker@dojo:~$ cat /challenge/data/secret.txt
```

#### 💡 cat 的实用技巧

```bash
# 显示行号
cat -n myfile.txt

# 压缩连续空行为一行
cat -s myfile.txt

# 显示不可见字符（调试时超有用）
cat -A myfile.txt

# 从标准输入读取（按 Ctrl+D 结束）
cat > newfile.txt
输入内容...
^D
```

#### ⚠️ 注意事项
- `cat` 适合查看小文件，大文件请用 `less` 或 `more`
- 不要 `cat` 二进制文件，否则终端会乱码 💥
- `cat file > file` 会清空文件！千万别这么干

---

### 2. grep — 搜索文件内容 🔍

`grep` 是 **Global Regular Expression Print** 的缩写，用来在文件中搜索匹配的文本行。

#### 基本语法

```bash
grep SEARCH_STRING /path/to/file
```

#### 使用示例

```bash
# 在文件中搜索关键词
hacker@dojo:~$ grep "flag" /challenge/data.txt
The flag is: pwn.college{...}

# 在多个文件中搜索
hacker@dojo:~$ grep "password" file1.txt file2.txt file3.txt

# 递归搜索整个目录
hacker@dojo:~$ grep -r "secret" /challenge/

# 忽略大小写搜索
hacker@dojo:~$ grep -i "hello" myfile.txt
```

#### 常用选项

| 选项 | 功能 | 示例 |
|------|------|------|
| `-i` | 忽略大小写 | `grep -i "error" log.txt` |
| `-r` | 递归搜索目录 | `grep -r "TODO" ./src/` |
| `-n` | 显示行号 | `grep -n "bug" code.py` |
| `-c` | 只显示匹配行数 | `grep -c "warning" log.txt` |
| `-v` | 反转匹配（显示不匹配的行） | `grep -v "comment" code.py` |
| `-l` | 只显示包含匹配的文件名 | `grep -rl "flag" /challenge/` |
| `-w` | 全词匹配 | `grep -w "the" article.txt` |

#### 🔍 配合管道使用

```bash
# 在命令输出中搜索
hacker@dojo:~$ ls -la /etc/ | grep "passwd"
-rw-r--r-- 1 root root 1234 Jan 1 00:00 passwd

# 查找进程
hacker@dojo:~$ ps aux | grep "python"
```

---

### 3. diff — 比较文件差异 📊

`diff` 用来比较两个文件的内容差异，是代码审查和调试的好帮手。

#### 基本语法

```bash
diff file1 file2
```

#### 使用示例

```bash
hacker@dojo:~$ cat original.txt
apple
banana
cherry

hacker@dojo:~$ cat modified.txt
apple
blueberry
cherry
date

hacker@dojo:~$ diff original.txt modified.txt
2c2
< banana
---
> blueberry
3a4
> date
```

#### 解读 diff 输出

- `<` 开头的行：来自第一个文件
- `>` 开头的行：来自第二个文件
- `2c2`：第一个文件第2行**改变**（**c**hange）为第二个文件第2行
- `3a4`：第一个文件第3行后**添加**（**a**dd）了第二个文件第4行
- `5d4`：第一个文件第5行被**删除**（**d**elete）

#### 更友好的 diff

```bash
# 并排对比（更直观）
diff -y file1 file2

# 统一格式（类似 git diff）
diff -u file1 file2

# 只显示是否不同（不看具体差异）
diff -q file1 file2
```

---

### 4. ls — 列出目录内容 📋

`ls` 是你用得最多的命令之一，用来查看目录里有什么文件。

#### 基本用法

```bash
# 列出当前目录
hacker@dojo:~$ ls
Desktop  Documents  Downloads  flag.txt

# 列出指定目录
hacker@dojo:~$ ls /challenge
DESCRIPTION.md  run  data

# 长格式（显示详细信息）
hacker@dojo:~$ ls -l
total 4
drwxr-xr-x 2 hacker hacker 4096 Jan 1 00:00 Desktop
-rw-r--r-- 1 hacker hacker   42 Jan 1 00:00 flag.txt
```

#### 常用选项

| 选项 | 功能 |
|------|------|
| `-l` | 长格式，显示权限、大小、时间等 |
| `-a` | 显示所有文件（包括隐藏文件） |
| `-la` | 长格式 + 显示隐藏文件（最常用组合！） |
| `-lh` | 长格式 + 人类可读的文件大小（KB/MB/GB） |
| `-R` | 递归列出子目录 |
| `-t` | 按修改时间排序 |
| `-S` | 按文件大小排序 |
| `-1` | 每行一个文件 |

#### 💡 解读 ls -l 输出

```
-rw-r--r-- 1 hacker hacker 4096 Jan 1 00:00 flag.txt
│          │ │      │      │    │             │
│          │ │      │      │    │             └─ 文件名
│          │ │      │      │    └─ 修改时间
│          │ │      │      └─ 文件大小（字节）
│          │ │      └─ 所属组
│          │ └─ 所有者
│          └─ 硬链接数
└─ 权限信息（后面模块会详细讲）
```

---

### 5. touch — 创建空文件 ✨

`touch` 的本意是"触碰"文件——更新文件的时间戳。但最常用的场景是创建空文件。

```bash
# 创建空文件
hacker@dojo:~$ touch newfile.txt
hacker@dojo:~$ ls -l newfile.txt
-rw-r--r-- 1 hacker hacker 0 Jan 1 00:00 newfile.txt

# 同时创建多个文件
hacker@dojo:~$ touch file1.txt file2.txt file3.txt

# 更新已有文件的时间戳（不改变内容）
hacker@dojo:~$ touch existing_file.txt
```

---

### 6. rm — 删除文件 🗑️

`rm` 是 **remove** 的缩写。⚠️ **Linux 没有回收站**，删了就是真的没了！

```bash
# 删除文件
hacker@dojo:~$ rm unwanted_file.txt

# 删除多个文件
hacker@dojo:~$ rm file1.txt file2.txt

# 删除目录及其内容（递归删除）
hacker@dojo:~$ rm -r old_directory/

# 强制删除，不询问确认
hacker@dojo:~$ rm -f stubborn_file.txt

# ⚠️ 最危险的命令（千万别在真实系统上执行！！）
# rm -rf /   # 删除整个文件系统，系统直接报废
```

#### 安全习惯

```bash
# 交互式删除，每个文件都问你确认
rm -i important_stuff.txt
# rm: remove regular file 'important_stuff.txt'? y

# 建议给 rm 加 alias（后面模块讲）
# alias rm='rm -i'
```

---

### 7. mv — 移动与重命名 📦

`mv` 是 **move** 的缩写，既能移动文件，也能重命名文件。

```bash
# 重命名文件
hacker@dojo:~$ mv old_name.txt new_name.txt

# 移动文件到另一个目录
hacker@dojo:~$ mv file.txt /tmp/

# 移动并重命名
hacker@dojo:~$ mv file.txt /tmp/renamed_file.txt

# 移动多个文件到目录
hacker@dojo:~$ mv file1.txt file2.txt file3.txt /target_dir/
```

#### ⚠️ 注意
- `mv` 如果目标文件已存在，会**直接覆盖**，不问你！
- 用 `mv -i` 可以在覆盖前询问确认
- `mv` 移动文件不会改变文件内容，只是改变位置/名字

---

### 8. cp — 复制文件 📋

`cp` 是 **copy** 的缩写。

```bash
# 复制文件
hacker@dojo:~$ cp original.txt backup.txt

# 复制到另一个目录
hacker@dojo:~$ cp file.txt /tmp/

# 复制并重命名
hacker@dojo:~$ cp file.txt /tmp/copy_of_file.txt

# 复制整个目录（必须加 -r）
hacker@dojo:~$ cp -r my_folder/ /tmp/my_folder_backup/
```

#### 常用选项

| 选项 | 功能 |
|------|------|
| `-r` | 递归复制（复制目录必须加） |
| `-i` | 覆盖前询问确认 |
| `-v` | 显示复制过程（verbose） |
| `-p` | 保留文件属性（权限、时间戳等） |

---

### 9. 隐藏文件 👻

在 Linux 中，以 `.`（点号）开头的文件或目录就是**隐藏文件**。

```bash
# 普通 ls 看不到隐藏文件
hacker@dojo:~$ ls
Desktop  Documents

# 加 -a 才能看到
hacker@dojo:~$ ls -a
.  ..  .bashrc  .profile  .hidden_flag  Desktop  Documents
```

#### 常见隐藏文件

| 文件 | 用途 |
|------|------|
| `.bashrc` | Bash Shell 的配置文件 |
| `.profile` | 登录 Shell 的配置文件 |
| `.bash_history` | 命令历史记录 |
| `.ssh/` | SSH 密钥和配置 |
| `.gitignore` | Git 忽略规则 |
| `.` | 当前目录 |
| `..` | 上级目录 |

#### 创建隐藏文件

```bash
# 名字以 . 开头就行
hacker@dojo:~$ touch .my_secret

# 验证
hacker@dojo:~$ ls
# 看不到

hacker@dojo:~$ ls -a
.  ..  .my_secret
```

---

### 10. find — 查找文件（扩展） 🔎

虽然 `find` 可能不是本模块的重点挑战，但它是寻宝类题目的利器：

```bash
# 在 /challenge 下查找名为 flag 的文件
hacker@dojo:~$ find /challenge -name "flag"

# 按文件类型查找
hacker@dojo:~$ find / -type f -name "*.txt" 2>/dev/null

# 按大小查找
hacker@dojo:~$ find / -size +1M -size -10M 2>/dev/null

# 查找后执行命令
hacker@dojo:~$ find /challenge -name "flag" -exec cat {} \;
```

> 💡 `2>/dev/null` 会把错误信息丢掉，让输出更干净。

---

## 🎯 挑战解析思路

### 综合练习：用 ls 和 cat 寻宝

很多挑战的模式是这样的：

```bash
# 第一步：ls 看看有什么
hacker@dojo:~$ ls /challenge
DESCRIPTION.md  files  run

# 第二步：继续往下看
hacker@dojo:~$ ls /challenge/files
hint1.txt  hint2.txt  flag_is_here/

# 第三步：找到 flag 读取它
hacker@dojo:~$ cat /challenge/files/flag_is_here/flag
pwn.college{...}
```

别忘了检查隐藏文件：

```bash
hacker@dojo:~$ ls -a /challenge
.  ..  .hidden_flag  DESCRIPTION.md  run

hacker@dojo:~$ cat /challenge/.hidden_flag
pwn.college{...}
```

---

## 📚 知识扩展

### 通配符（Globbing）

Shell 支持通配符来匹配多个文件：

```bash
# * 匹配任意字符
ls *.txt          # 所有 .txt 文件
cat /challenge/*  # 读取目录下所有文件

# ? 匹配单个字符
ls file?.txt      # file1.txt, file2.txt, ...

# [] 匹配括号内的任意字符
ls file[123].txt  # file1.txt, file2.txt, file3.txt
```

### 重定向基础

```bash
# > 将输出写入文件（覆盖）
echo "hello" > output.txt

# >> 将输出追加到文件
echo "world" >> output.txt

# < 从文件读取输入
grep "flag" < data.txt
```

---

## 🏆 最佳实践

1. **先 ls 再操作**：在做任何文件操作前，先 `ls` 看清楚当前状态
2. **善用 Tab 补全**：输入路径时多按 Tab，减少打字错误
3. **rm 要谨慎**：养成用 `rm -i` 的习惯，或者先 `ls` 确认要删除的文件
4. **别忘记 -a**：找不到文件时，试试 `ls -a`，可能是隐藏文件
5. **绝对路径最保险**：不确定当前目录时，用绝对路径操作
6. **cp 做备份**：修改重要文件前先 `cp file file.bak`

---

## 📝 小结

这个模块的命令是 Linux 日常操作的基石：

| 命令 | 功能 | 助记 |
|------|------|------|
| `cat` | 读取/拼接文件 | 🐱 concatenate |
| `grep` | 搜索文件内容 | 🔍 global regex print |
| `diff` | 比较文件差异 | 📊 difference |
| `ls` | 列出目录内容 | 📋 list |
| `touch` | 创建空文件 | ✨ touch |
| `rm` | 删除文件 | 🗑️ remove |
| `mv` | 移动/重命名 | 📦 move |
| `cp` | 复制文件 | 📋 copy |

记住：**熟练使用这些命令 = Linux 日常操作自由**。多练多敲，形成肌肉记忆！💪

下一站：**Digesting Documentation**，学会查阅手册，让你自己能找到任何命令的用法！📖
