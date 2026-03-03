# 02 - Pondering Paths 🛤️ | 深入理解路径

> **模块地址**: https://pwn.college/linux-luminarium/paths/
> **难度**: ⭐⭐ 基础级
> **核心主题**: 绝对路径、相对路径、`cd` 命令、`.` 和 `..`、`~` 目录

---

## 📖 模块概述

Linux 的文件系统就像一棵大树 🌳，而路径（Path）就是你在这棵树上导航的地图。这个模块教你如何用路径来定位和执行文件，是后面所有文件操作的基础。

---

## 🌲 核心概念：Linux 文件系统树

### 文件系统的结构

Linux 文件系统是一个**树形结构**（Tree Structure）：

```
/                    ← 根目录（root），一切的起点
├── home/            ← 用户主目录
│   ├── hacker/      ← hacker 用户的 home
│   └── zardus/      ← zardus 用户的 home
├── challenge/       ← pwn.college 挑战目录
├── bin/             ← 基本命令程序
├── etc/             ← 系统配置文件
├── tmp/             ← 临时文件
├── var/             ← 可变数据（日志等）
├── usr/             ← 用户程序
└── dev/             ← 设备文件
```

**关键点**：
- 根目录是 `/`（正斜杠），这是整个文件系统的顶端
- 每一层用 `/` 分隔
- **没有盘符！** 不像 Windows 的 `C:\`、`D:\`，Linux 只有一个根 `/`

---

## 🔧 路径的两种形式

### 1. 绝对路径（Absolute Path）

从根目录 `/` 开始的完整路径，不管你在哪个目录都能用。

```bash
/challenge/run
/home/hacker/file.txt
/usr/bin/python3
```

**特点**：
- ✅ 总是以 `/` 开头
- ✅ 不管你在哪，都能准确找到目标
- ❌ 有时候打字比较多

```bash
# 用绝对路径执行程序
hacker@dojo:~$ /challenge/run

# 用绝对路径访问根目录下的程序
hacker@dojo:~$ /pwn
```

### 2. 相对路径（Relative Path）

相对于**当前工作目录（cwd）**的路径，不以 `/` 开头。

```bash
# 如果当前在 / 目录
challenge/run        # 等同于 /challenge/run

# 如果当前在 /challenge 目录
run                  # 等同于 /challenge/run

# 如果当前在 /tmp/a/b 目录
../../home/hacker    # 等同于 /home/hacker
```

**特点**：
- ✅ 输入更短，更方便
- ❌ 取决于你当前在哪个目录
- ❌ 容易搞混

### 对比示例

假设要访问 `/tmp/a/b/my_file`：

| 你当前的位置 | 相对路径 |
|-------------|---------|
| `/` | `tmp/a/b/my_file` |
| `/tmp` | `a/b/my_file` |
| `/tmp/a` | `b/my_file` |
| `/tmp/a/b` | `my_file` |
| `/tmp/a/b/c` | `../my_file` |
| `/home/hacker` | `../../tmp/a/b/my_file` |

---

## 🔧 涉及的命令

### cd - 切换目录（Change Directory）

```bash
cd [目录路径]
```

- **作用**：改变当前工作目录
- **超级常用**，你会用一辈子

```bash
# 用绝对路径切换
hacker@dojo:~$ cd /challenge
hacker@dojo:/challenge$

# 用相对路径切换
hacker@dojo:/$ cd challenge
hacker@dojo:/challenge$

# 回到 home 目录（三种方式）
hacker@dojo:/challenge$ cd ~
hacker@dojo:~$

hacker@dojo:/challenge$ cd /home/hacker
hacker@dojo:~$

hacker@dojo:/challenge$ cd          # 不带参数也回 home！
hacker@dojo:~$

# 回到上一级目录
hacker@dojo:/challenge$ cd ..
hacker@dojo:/$

# 回到上一次的目录
hacker@dojo:/tmp$ cd /challenge
hacker@dojo:/challenge$ cd -        # 回到 /tmp
hacker@dojo:/tmp$
```

#### ⚠️ cd 常见错误

```bash
# ❌ cd 后面不需要加斜杠开头（除非是绝对路径）
cd challenge    # ✅ 相对路径
cd /challenge   # ✅ 绝对路径
cd \challenge   # ❌ 这是 Windows 写法！

# ❌ cd 到文件（只能 cd 到目录！）
cd /etc/passwd  # ❌ 这是个文件，不是目录
```

### pwd - 显示当前目录（Print Working Directory）

```bash
pwd
```

- **作用**：打印当前工作目录的绝对路径
- **什么时候用**：迷路的时候 😂

```bash
hacker@dojo:~$ pwd
/home/hacker

hacker@dojo:~$ cd /tmp
hacker@dojo:/tmp$ pwd
/tmp
```

---

## 📁 特殊目录符号

### `.`（当前目录）

一个点代表**当前目录**。

```bash
# 以下路径完全等价
/challenge
/challenge/.
/challenge/./././././
/./challenge/.
```

#### 为什么需要 `.`？

Linux 安全机制：**Shell 不会自动在当前目录搜索程序！**

```bash
# 假设你在 /challenge 目录
hacker@dojo:/challenge$ run
bash: run: command not found    # ❌ 找不到！

# 必须显式告诉 Shell "我要执行当前目录的 run"
hacker@dojo:/challenge$ ./run   # ✅ 成功！
```

🔐 **为什么这么设计？** 这是安全措施！想象一下，如果有人在你常去的目录放了一个叫 `ls` 的恶意程序，当你执行 `ls` 时，如果 Shell 优先搜索当前目录，就会执行恶意程序而不是系统的 `ls`。

### `..`（上一级目录）

两个点代表**父目录**。

```bash
hacker@dojo:/challenge$ cd ..
hacker@dojo:/$

# 可以连续使用
hacker@dojo:/home/hacker$ cd ../..
hacker@dojo:/$

# 在路径中间使用
hacker@dojo:~$ cat /challenge/../flag
```

### `~`（Home 目录）

波浪号代表**当前用户的 home 目录**。

```bash
# 对于 hacker 用户，~ 等同于 /home/hacker
hacker@dojo:~$ echo ~
/home/hacker

# 用在路径中
hacker@dojo:~$ cd ~/Documents
hacker@dojo:~/Documents$

# ⚠️ 只有开头的 ~ 才会被展开
hacker@dojo:~$ echo ~/~
/home/hacker/~     # 第二个 ~ 不会展开！
```

#### ~ 的扩展用法

```bash
# 查看其他用户的 home 目录
echo ~root          # /root
echo ~zardus        # /home/zardus

# 在命令中使用
cat ~/flag          # 读取 home 下的 flag
cp ~/file /tmp/     # 复制 home 下的文件到 /tmp
```

---

## 🎯 挑战解析

### Challenge 1: 绝对路径执行
```bash
/pwn    # 直接用绝对路径执行根目录下的 pwn
```

### Challenge 2: 多层路径
```bash
/challenge/run    # 执行 /challenge 目录下的 run
```

### Challenge 3-4: cd + 执行
```bash
cd /指定目录
/challenge/run
```

### Challenge 5: 相对路径
```bash
cd /
challenge/run    # 从 / 出发的相对路径
```

### Challenge 6: 使用 `.`
```bash
cd /challenge
./run    # 用 ./ 执行当前目录的程序
```

### Challenge 7: Home 目录与 `~`
```bash
/challenge/run ~/f    # 三个字符以内的 home 目录路径
```

---

## 📚 知识扩展

### Linux 目录结构速览

| 目录 | 用途 | 记忆方法 |
|------|------|---------|
| `/` | 根目录 | 万物之源 |
| `/home` | 用户主目录 | 你的"家" 🏠 |
| `/root` | root 用户的 home | root 很特殊，home 不在 /home 下 |
| `/bin` | 基本命令 | binary 的缩写 |
| `/sbin` | 系统管理命令 | system binary |
| `/etc` | 配置文件 | 像是 "et cetera" |
| `/tmp` | 临时文件 | temporary |
| `/var` | 可变数据（日志等） | variable |
| `/usr` | 用户程序和数据 | Unix System Resources |
| `/dev` | 设备文件 | device |
| `/proc` | 进程信息（虚拟） | process |
| `/opt` | 可选软件 | optional |

### 路径相关的实用命令

```bash
# basename - 获取文件名
basename /home/hacker/file.txt
# 输出: file.txt

# dirname - 获取目录部分
dirname /home/hacker/file.txt
# 输出: /home/hacker

# realpath - 获取真实的绝对路径（解析符号链接）
realpath ./some/relative/path

# readlink -f - 类似 realpath
readlink -f ./symlink
```

### 隐藏的小技巧

```bash
# cd 到一个很长的路径后，用 pushd/popd 来"记住"位置
pushd /some/very/long/path    # 保存当前位置并切换
# ... 做一些操作 ...
popd                           # 回到之前保存的位置

# 用 CDPATH 设置 cd 的搜索路径
export CDPATH=~/projects
cd myapp    # 即使不在 ~/projects 下也能直接跳转到 ~/projects/myapp
```

---

## 🏆 最佳实践

1. **多用 Tab 补全路径**：输入路径前几个字符后按 Tab，Shell 自动补全
2. **用绝对路径写脚本**：脚本中应该用绝对路径，因为你不知道脚本在哪个目录被执行
3. **善用 `cd -`**：在两个目录之间快速切换
4. **理解 `.` 的安全意义**：执行当前目录的程序时必须用 `./`
5. **记住 `~` 是绝对路径**：`~` 展开后是 `/home/用户名`，是绝对路径

---

## 📝 小结

| 路径符号 | 含义 | 示例 |
|---------|------|------|
| `/` | 根目录/路径分隔符 | `/home/hacker` |
| `.` | 当前目录 | `./run` |
| `..` | 上一级目录 | `cd ..` |
| `~` | Home 目录 | `~/file.txt` |

这个模块的核心就是理解 Linux 文件系统是一棵树，而路径就是你在这棵树上的导航方式。搞清楚绝对路径和相对路径的区别，后面的学习就轻松多了！

下一站：**Comprehending Commands**，学习更多实用命令！📂
