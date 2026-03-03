---
id: 3
title: Hello Hackers 
excerpt: 命令行基础、命令执行、命令历史
date: 2025-03-01
category: 技术
tag: pwn
readTime: 10 分钟
cover: https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=900&q=80
featured: false
---

# 01 - Hello Hackers 👋 | 你好，黑客们

> **模块地址**: https://pwn.college/linux-luminarium/hello/
> **难度**: ⭐ 入门级
> **核心主题**: 命令行基础、命令执行、命令历史

---

## 📖 模块概述

这是 Linux Luminarium 的第一个模块，也是你踏入 Linux 命令行世界的第一步！这个模块会教你最最基本的东西：怎么跟命令行打交道。别小看这些基础，后面所有的高级操作都建立在这上面。

---

## 🖥️ 核心概念：Shell 与终端

### 什么是 Shell？

Shell 就是你和操作系统之间的"翻译官"。你输入命令，Shell 帮你执行，然后把结果告诉你。

当你打开终端（Terminal），你看到的那个闪烁的光标前面的文字，就是 **提示符（Prompt）**：

```bash
hacker@dojo:~$
```

来拆解一下这个提示符：

| 部分 | 含义 | 说明 |
|------|------|------|
| `hacker` | 当前用户名 | 你是谁 |
| `@` | 分隔符 | 就是个 at 符号 |
| `dojo` | 主机名（hostname） | 你在哪台机器上 |
| `:` | 分隔符 | 分隔主机名和路径 |
| `~` | 当前目录 | `~` 代表用户的 home 目录 |
| `$` | 权限标识 | `$` = 普通用户，`#` = root 用户 |

### 💡 小知识：`$` vs `#`

- 看到 `$` 说明你是普通用户
- 看到 `#` 说明你是 root（管理员），拥有系统最高权限
- 在 pwn.college 后面的模块中，当你学会利用漏洞变成 root 时，提示符就会从 `$` 变成 `#` 🎉

---

## 🔧 涉及的命令

### 1. 基本命令执行

在终端里输入命令，按 Enter 就能执行：

```bash
hacker@dojo:~$ whoami
hacker
```

**语法**：
```
命令名
```

就是这么简单！输入命令名，按回车，完事。

#### whoami 命令

```bash
whoami
```

- **作用**：显示当前登录的用户名
- **没有参数**，直接用就行
- **使用场景**：当你不确定自己以什么身份登录时

```bash
hacker@dojo:~$ whoami
hacker

# 如果你变成了 root
root@dojo:~# whoami
root
```

#### ⚠️ 注意事项
- **Linux 命令区分大小写！** `hello` 和 `HELLO` 和 `Hello` 是三个完全不同的东西
- 输入错误命令会报错：`command not found`
- 命令名前后不要加多余的空格

---

### 2. 命令参数（Arguments）

命令可以带参数（arguments），参数就是你传给命令的额外信息。

**语法**：
```
命令 参数1 参数2 参数3 ...
```

Shell 会把你输入的一行文字按空格拆分：
- 第一个词 = 命令
- 后面的词 = 参数

#### echo 命令

```bash
echo [参数...]
```

- **作用**：把参数"回显"到终端（说白了就是打印文字）
- **用途超广**：调试、输出信息、写入文件等等

```bash
# 一个参数
hacker@dojo:~$ echo Hello
Hello

# 多个参数（用空格分隔）
hacker@dojo:~$ echo Hello Hackers!
Hello Hackers!

# 没有参数就输出空行
hacker@dojo:~$ echo

```

#### 🔍 深入理解参数

```bash
# Shell 会把多个连续空格压缩成一个
hacker@dojo:~$ echo Hello      World
Hello World

# 如果想保留空格，用引号
hacker@dojo:~$ echo "Hello      World"
Hello      World

# 单引号和双引号的区别（后面模块会详细讲）
hacker@dojo:~$ echo 'Hello $USER'
Hello $USER
hacker@dojo:~$ echo "Hello $USER"
Hello hacker
```

---

### 3. 命令历史（Command History）

Shell 会自动记录你输入过的每一条命令，这就是 **命令历史（history）**。

#### 基本操作

| 按键 | 功能 |
|------|------|
| `↑` 方向键上 | 显示上一条命令 |
| `↓` 方向键下 | 显示下一条命令 |
| `Ctrl + R` | 搜索历史命令 |
| `!!` | 重复执行上一条命令 |
| `!n` | 执行第 n 条历史命令 |

#### history 命令

```bash
# 查看所有历史命令
hacker@dojo:~$ history
    1  whoami
    2  echo Hello
    3  ls
    4  history

# 查看最近 5 条
hacker@dojo:~$ history 5

# 清除历史
hacker@dojo:~$ history -c
```

#### 💡 实用技巧

```bash
# 用 Ctrl+R 搜索历史命令（超级好用！）
# 按 Ctrl+R 后输入关键词，Shell 会自动匹配
(reverse-i-search)`echo': echo Hello Hackers!

# 用 !! 快速重复上一条命令
hacker@dojo:~$ whoami
hacker
hacker@dojo:~$ !!
whoami
hacker

# 经典场景：忘记加 sudo
hacker@dojo:~$ cat /etc/shadow
Permission denied
hacker@dojo:~$ sudo !!
sudo cat /etc/shadow
# 成功！
```

---

## 🎯 挑战解析

### Challenge 1: 执行你的第一个命令
- **任务**：运行 `hello` 命令
- **提示**：直接输入 `hello` 按回车

### Challenge 2: 带参数的命令
- **任务**：运行 `hello hackers`
- **提示**：注意是 `hello` 命令加 `hackers` 参数，不是 `echo`

### Challenge 3: 命令历史
- **任务**：从历史记录中找到 flag
- **提示**：按 ↑ 方向键浏览历史

---

## 📚 知识扩展

### 常用终端快捷键

这些快捷键会让你效率翻倍 🚀

| 快捷键 | 功能 |
|--------|------|
| `Ctrl + A` | 光标移到行首 |
| `Ctrl + E` | 光标移到行尾 |
| `Ctrl + U` | 删除光标前的所有内容 |
| `Ctrl + K` | 删除光标后的所有内容 |
| `Ctrl + W` | 删除光标前的一个单词 |
| `Ctrl + L` | 清屏（等同于 `clear`） |
| `Ctrl + C` | 中断当前命令 |
| `Ctrl + D` | 退出当前 Shell |
| `Tab` | 自动补全（超级超级有用！） |

### Shell 的类型

你可能会遇到不同的 Shell：

- **bash**（Bourne Again Shell）：最常用的，大多数 Linux 发行版默认
- **zsh**：macOS 默认，功能更多
- **sh**：最基础的 Shell，兼容性最好
- **fish**：对新手最友好，但语法不兼容 bash

```bash
# 查看你当前用的什么 Shell
echo $SHELL

# 查看系统有哪些 Shell
cat /etc/shells
```

### 命令的本质

当你输入一个命令时，Shell 实际上在做这些事：
1. 读取你的输入
2. 解析命令和参数
3. 在 PATH 环境变量指定的目录中查找这个程序
4. 找到后启动一个新进程来执行它
5. 等待程序执行完毕
6. 显示结果并重新给你提示符

（PATH 的概念会在后面的模块详细讲解！）

---

## 🏆 最佳实践

1. **多用 Tab 键**：自动补全是你最好的朋友，减少打字还能避免拼写错误
2. **多用方向键**：浏览历史命令比重新输入快得多
3. **Ctrl+C 是你的安全网**：程序卡住了就 Ctrl+C 终止它
4. **注意大小写**：`Hello` ≠ `hello` ≠ `HELLO`
5. **先看提示再操作**：命令执行后的输出信息很重要，不要急着输入下一条

---

## 📝 小结

这个模块虽然简单，但建立了三个核心概念：
1. ✅ 命令行就是输入命令 → 按回车 → 看结果
2. ✅ 命令可以带参数，用空格分隔
3. ✅ Shell 会记住你的命令历史，善用它！

下一站：**Pondering Paths**，我们来学习 Linux 的文件路径系统！🚀
