# 09 - Perceiving Permissions 🔐 | 感知权限

> **模块地址**: https://pwn.college/linux-luminarium/permissions/
> **难度**: ⭐⭐⭐ 中级
> **核心主题**: 文件权限、chmod、chown、chgrp、SUID/SGID

---

## 📖 模块概述

Linux 是一个多用户系统，权限模型是它的安全基石 🏰。每个文件和目录都有严格的权限控制——谁能读、谁能写、谁能执行，都由权限位决定。理解权限是做安全（尤其是提权）的必备基础！

这个模块将带你从 `ls -l` 的输出开始，一步步搞懂 Linux 权限的方方面面。

---

## 🖥️ 核心概念：Linux 权限模型

### 三类用户 👥

每个文件都有三个层级的权限控制：

| 类别 | 缩写 | 说明 |
|------|------|------|
| **用户（User/Owner）** | `u` | 文件的所有者 |
| **组（Group）** | `g` | 文件所属组的成员 |
| **其他（Other）** | `o` | 所有其他人 |
| **所有（All）** | `a` | 以上三者的总和 |

### 三种权限 🔑

| 权限 | 字符 | 数字 | 对文件的含义 | 对目录的含义 |
|------|------|------|------------|------------|
| **读（Read）** | `r` | 4 | 可以查看文件内容 | 可以列出目录内容（ls） |
| **写（Write）** | `w` | 2 | 可以修改文件 | 可以在目录中创建/删除文件 |
| **执行（Execute）** | `x` | 1 | 可以作为程序运行 | 可以进入目录（cd） |

💡 **对目录来说，执行权限（x）的含义是"可以进入"，这是很多人搞混的地方！**

### 用户与组的概念 🏷️

Linux 中每个用户都有：
- 一个 **UID（User ID）**：数字形式的身份标识
- 一个 **主组（Primary Group）**：默认 GID
- 可能属于多个 **附加组（Supplementary Groups）**

```bash
hacker@dojo:~$ id
uid=1000(hacker) gid=1000(hacker) groups=1000(hacker)

# 有更多权限的用户（Privileged Mode）
hacker@dojo:~$ id
uid=1000(hacker) gid=1000(hacker) groups=1000(hacker),27(sudo)
```

组的核心用途就是 **控制资源访问**。比如 `video` 组的成员能访问显示设备，`sudo` 组的成员能执行管理员命令。

---

## 🔧 解读 `ls -l` 输出 📋

```bash
hacker@dojo:~$ ls -l
-rwxr-xr-- 1 hacker students 4096 Jan 15 10:00 script.sh
drwxr-x--- 2 hacker students 4096 Jan 15 10:00 mydir/
```

逐段拆解 `-rwxr-xr--`：

```
-  rwx  r-x  r--
│  │    │    │
│  │    │    └── 其他用户(other)：只读
│  │    └─────── 组(group)：读+执行
│  └──────────── 所有者(user)：读+写+执行
└─────────────── 文件类型：- 普通文件，d 目录，l 符号链接
```

#### 文件类型标识

| 字符 | 类型 | 说明 |
|------|------|------|
| `-` | 普通文件 | 最常见 |
| `d` | 目录 | directory |
| `l` | 符号链接 | symlink |
| `c` | 字符设备 | 如终端 /dev/tty |
| `b` | 块设备 | 如硬盘 /dev/sda |
| `p` | 命名管道 | FIFO |
| `s` | 套接字 | socket |

#### `ls -l` 完整输出解读

```
-rwxr-xr-- 1 hacker students 4096 Jan 15 10:00 script.sh
│          │ │      │        │    │              │
│          │ │      │        │    └── 修改时间    └── 文件名
│          │ │      │        └── 文件大小（字节）
│          │ │      └── 所属组
│          │ └── 所有者
│          └── 硬链接数
└── 权限字符串
```

---

## 🔧 涉及的命令

### 1. id —— 查看用户和组信息 👤

**语法**: `id [用户名]`

**作用**: 显示当前（或指定）用户的 UID、GID 和所属组。

```bash
hacker@dojo:~$ id
uid=1000(hacker) gid=1000(hacker) groups=1000(hacker),27(sudo),1001(students)

# 查看指定用户
hacker@dojo:~$ id root
uid=0(root) gid=0(root) groups=0(root)
```

各字段含义：
- `uid`：用户 ID
- `gid`：主组 ID
- `groups`：所属的所有组

---

### 2. chmod —— 修改文件权限 🔧

`chmod`（change mode）有两种用法：**符号法** 和 **数字法**。

**语法**: `chmod [选项] 模式 文件`

#### 符号法

```bash
chmod [who][操作][权限] 文件

# who: u（用户）, g（组）, o（其他）, a（所有）
# 操作: +（添加）, -（移除）, =（设置为）
# 权限: r, w, x
```

```bash
# 给所有者添加执行权限
chmod u+x script.sh

# 给组和其他人移除写权限
chmod go-w file.txt

# 给所有人添加读权限
chmod a+r document.txt

# 设置所有者为读写执行，组和其他人为只读
chmod u=rwx,go=r file.txt

# 移除其他人的所有权限
chmod o= secret.txt
# 或者
chmod o-rwx secret.txt
```

#### 数字法（八进制）🔢

每种权限有一个数值，把三个权限的值加起来：

```
r = 4    w = 2    x = 1

rwx = 4+2+1 = 7
r-x = 4+0+1 = 5
r-- = 4+0+0 = 4
--- = 0+0+0 = 0
```

三位数字分别代表 **用户-组-其他**：

```bash
chmod 755 script.sh    # rwxr-xr-x（所有者全权限，其余可读可执行）
chmod 644 file.txt     # rw-r--r--（所有者可读写，其余只读）
chmod 700 private/     # rwx------（只有所有者有权限）
chmod 600 secret.key   # rw-------（只有所有者可读写）
chmod 777 open.txt     # rwxrwxrwx（所有人全权限）⚠️ 几乎不应该这么用！
```

#### 💡 常用权限数字速查

| 数字 | 权限 | 典型用途 |
|------|------|----------|
| `755` | `rwxr-xr-x` | 可执行脚本、公共目录 |
| `644` | `rw-r--r--` | 普通文件（网页、配置等） |
| `700` | `rwx------` | 私人目录、私人脚本 |
| `600` | `rw-------` | SSH 密钥、敏感配置 |
| `400` | `r--------` | 只读密钥文件 |

```bash
# -R 递归修改（对目录及其所有内容）
chmod -R 755 myproject/
```

⚠️ **注意**: `chmod` 不需要 root 权限——只要你是文件的所有者就行！

---

### 3. chown —— 修改文件所有者 👑

**语法**: `chown [选项] [新所有者][:新组] 文件`

**作用**: 修改文件的所有者和/或所属组。

```bash
# 修改所有者
sudo chown root file.txt

# 同时修改所有者和组
sudo chown root:admin file.txt

# 只修改组（冒号前留空）
sudo chown :admin file.txt

# 递归修改
sudo chown -R hacker:hacker /home/hacker/
```

⚠️ **注意**：只有 root 才能 `chown`（把文件给别人）。普通用户不能"赠送"文件所有权。

---

### 4. chgrp —— 修改文件所属组 👥

**语法**: `chgrp [选项] 新组 文件`

**作用**: 修改文件的所属组。

```bash
# 修改组
chgrp students project.txt

# 递归修改
chgrp -R students project/
```

💡 普通用户只能把文件的组改成 **自己所属的组**。

在 pwn.college 中，有一关就是用 `chgrp` 将 `/flag` 的组改成 `hacker`，然后就能读取了：

```bash
hacker@dojo:~$ chgrp hacker /flag
hacker@dojo:~$ cat /flag
```

---

### 5. SUID、SGID 和 Sticky Bit 🔑

这三个是 **特殊权限位**，在安全领域极其重要！

#### SUID（Set User ID）—— 数字：4000

当一个可执行文件设置了 SUID 位，**任何人执行它时，都会以文件所有者的身份运行**。

```bash
hacker@dojo:~$ ls -l /usr/bin/passwd
-rwsr-xr-x 1 root root 68208 Jan 15 10:00 /usr/bin/passwd
    ^
    注意这里是 's' 而不是 'x'！
```

- `passwd` 的所有者是 root，设置了 SUID
- 任何用户执行 `passwd` 时，它都以 **root 身份**运行
- 这就是为什么普通用户能修改 `/etc/shadow`

```bash
# 设置 SUID
chmod u+s program
chmod 4755 program    # 4 = SUID

# 查找系统中所有 SUID 文件（安全审计常用！）
find / -perm -4000 -type f 2>/dev/null
```

🔴 **安全警告**：SUID 是提权攻击的重要目标！一个有漏洞的 SUID root 程序 = 直接 root shell。

#### SGID（Set Group ID）—— 数字：2000

类似 SUID，但作用于 **组**：

- **对文件**：执行时以文件所属组的身份运行
- **对目录**：在该目录下创建的新文件会继承目录的组（而不是创建者的主组）

```bash
hacker@dojo:~$ ls -l /usr/bin/wall
-rwxr-sr-x 1 root tty 30800 Jan 15 10:00 /usr/bin/wall
        ^
        组的 x 位变成了 's'
```

```bash
# 设置 SGID
chmod g+s directory/
chmod 2755 directory/
```

#### Sticky Bit —— 数字：1000 🍯

主要用于 **目录**，设置后只有文件所有者（和 root）能删除该目录中的文件。

最经典的例子就是 `/tmp`：

```bash
hacker@dojo:~$ ls -ld /tmp
drwxrwxrwt 10 root root 4096 Jan 15 10:00 /tmp
          ^
          other 的 x 位变成了 't'
```

所有人都能往 `/tmp` 写文件，但你只能删自己的！

```bash
# 设置 Sticky Bit
chmod +t directory/
chmod 1777 directory/
```

#### 特殊权限一览表 📊

| 权限 | 数字 | 符号 | 作用于文件 | 作用于目录 |
|------|------|------|-----------|-----------|
| SUID | 4000 | `u+s` | 以所有者身份执行 | （无意义） |
| SGID | 2000 | `g+s` | 以所属组身份执行 | 新文件继承组 |
| Sticky | 1000 | `+t` | （少用） | 只有所有者能删 |

---

## 🎯 挑战解析

这个模块的挑战围绕权限操作展开，以下是思路提示（不含答案）：

1. **Changing File Permissions** 🔧：使用 `chmod` 给 `/flag` 添加读权限
2. **Permission Tweaking** ✏️：精确地设置某一类用户的权限（注意 `u`/`g`/`o` 的区别）
3. **Ownership Changes** 👑：用 `chown` 或 `chgrp` 改变 `/flag` 的所有者/组
4. **Groups and Access** 👥：通过 `chgrp` 把 flag 的组改成 hacker 组，然后读取
5. **SUID Challenges** 🔑：理解 SUID 程序如何以 root 身份运行
6. **Permission Denied Debugging** 🐛：分析为什么权限被拒绝，缺少 r/w/x 中的哪个

💡 **解题核心思路**：
- 先用 `ls -l` 看清楚当前权限状态
- 用 `id` 看清楚自己是谁、在哪些组
- 然后用 `chmod`/`chown`/`chgrp` 对症下药

---

## 📚 知识扩展

### umask —— 默认权限掩码 🎭

新建文件/目录时，系统会用 umask 来决定默认权限：

```bash
hacker@dojo:~$ umask
0022

# 文件默认权限 = 666 - 022 = 644 (rw-r--r--)
# 目录默认权限 = 777 - 022 = 755 (rwxr-xr-x)
```

### 权限与脚本 📜

要运行一个脚本，你需要：
1. 脚本本身有 **执行权限**（x）
2. 脚本有 **读权限**（r）——解释器需要读取内容
3. 脚本的 shebang（`#!/bin/bash`）指向的解释器可执行

```bash
# 写一个脚本并执行
echo '#!/bin/bash\necho hello' > test.sh
chmod +x test.sh   # 添加执行权限
./test.sh           # 运行！
```

### ACL（Access Control Lists）📋

传统的 rwx 权限只能设置三类用户（owner/group/other），ACL 提供更细粒度的控制：

```bash
# 给特定用户额外权限
setfacl -m u:zardus:rx file.txt

# 查看 ACL
getfacl file.txt
```

---

## 🏆 最佳实践

1. 🔒 **最小权限原则**：只给必要的权限，不要图方便 `chmod 777`
2. 🏠 **SSH 密钥权限**：`~/.ssh/` 目录 `700`，密钥文件 `600`，否则 SSH 会拒绝使用
3. 🔍 **定期审计 SUID**：`find / -perm -4000` 检查异常的 SUID 文件
4. 📁 **目录需要 x 权限**：想 `cd` 进去就必须有执行权限
5. 🚫 **不要给 root 以外的用户设置 SUID shell**：这等于直接送出 root 权限

---

## 📝 小结

| 命令 | 作用 | 常用示例 |
|------|------|----------|
| `ls -l` | 查看权限 | `ls -l /flag` |
| `id` | 查看用户/组信息 | `id` |
| `chmod` | 修改权限 | `chmod 755 file` / `chmod u+x file` |
| `chown` | 修改所有者 | `sudo chown root:root file` |
| `chgrp` | 修改组 | `chgrp hacker file` |
| `find -perm` | 查找特殊权限文件 | `find / -perm -4000` |

| 概念 | 说明 |
|------|------|
| `rwx` | 读(4)/写(2)/执行(1) |
| `u/g/o` | 用户/组/其他 |
| SUID | 以文件所有者身份执行 |
| SGID | 以文件所属组身份执行 / 目录继承组 |
| Sticky Bit | 只有所有者能删除文件 |
| umask | 控制新文件的默认权限 |

---

## 🔮 下一站预告

下一个模块是 **Untangling Users** 🧑‍🤝‍🧑——深入 Linux 用户系统！你将学习 `su`、`sudo`、`/etc/passwd`、`/etc/shadow` 等用户管理知识，理解如何在不同用户之间切换身份。权限和用户是一体两面，掌握了这两个模块，你就拿下了 Linux 安全的半壁江山！🏰
