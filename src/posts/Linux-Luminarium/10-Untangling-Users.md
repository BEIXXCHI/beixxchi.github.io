# 10 - Untangling Users 🧑‍🤝‍🧑 | 理清用户

> **模块地址**: https://pwn.college/linux-luminarium/users/
> **难度**: ⭐⭐⭐ 中级
> **核心主题**: 用户系统、su、sudo、/etc/passwd、/etc/shadow、身份切换

---

## 📖 模块概述

你以为 Linux 里就你一个人？Nope！一个典型的 Linux 系统上有 **大量用户** 🫠。有些是真人，有些是服务账户，还有那个无所不能的 **root**。这个模块将带你深入 Linux 用户系统——从查看自己是谁，到切换身份，再到理解密码存储机制。

想在安全领域立足？**提权（privilege escalation）**是核心技能，而提权的第一步就是理解用户系统！

---

## 🖥️ 核心概念：Linux 用户系统

### UID 和 GID 🔢

Linux 内部用 **数字** 来标识用户和组，名字只是给人看的：

| 概念 | 说明 | 示例 |
|------|------|------|
| **UID（User ID）** | 用户的唯一数字标识 | root=0, hacker=1000 |
| **GID（Group ID）** | 组的唯一数字标识 | root=0, hacker=1000 |
| **主组（Primary Group）** | 用户的默认组 | 通常与用户名同名 |
| **附加组（Supplementary Groups）** | 用户额外加入的组 | sudo, video, docker... |

💡 **关键规则**：
- UID 0 = root = 🔱 上帝用户，无视一切权限检查
- UID 1-999 通常是系统/服务账户
- UID 1000+ 通常是普通用户

### root 用户的特殊性 🔱

root 是 Linux 的系统管理员，拥有 **至高无上** 的权限：

- ✅ 可以读写任何文件，无视权限位
- ✅ 可以杀死任何进程
- ✅ 可以修改任何用户的密码
- ✅ 可以挂载/卸载文件系统
- ✅ 可以修改网络配置
- ❌ 如果 root 被黑客控制 = 游戏结束 💀

```bash
# root 可以直接读取任何文件
root@dojo:~# cat /etc/shadow    # 普通用户读不了的文件
# 对 root 来说毫无压力
```

---

## 📂 三大用户配置文件

### 1. /etc/passwd —— 用户数据库 📖

虽然名字叫 "passwd"，但它 **不再存储密码**（历史遗留命名）。这是一个 **全局可读** 的文件：

```
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
hacker:x:1000:1000::/home/hacker:/bin/bash
```

每行格式（用 `:` 分隔 7 个字段）：

| 字段 | 含义 | 示例 |
|------|------|------|
| 1. 用户名 | 登录名 | `hacker` |
| 2. 密码占位 | 历史遗留，现为 `x` | `x` |
| 3. UID | 用户 ID | `1000` |
| 4. GID | 主组 ID | `1000` |
| 5. GECOS | 用户描述/全名 | （可为空） |
| 6. 家目录 | Home directory | `/home/hacker` |
| 7. 登录 Shell | 默认 shell | `/bin/bash` |

💡 **安全洞察**：
- Shell 为 `/usr/sbin/nologin` 或 `/bin/false` 的用户 **不能登录**
- 这些通常是服务账户（daemon、www-data 等）
- 如果你能修改 `/etc/passwd`，你可以直接提权！😈

```bash
# 查看系统上有哪些可登录用户
grep -v 'nologin\|false' /etc/passwd

# 只看用户名
cut -d: -f1 /etc/passwd
```

### 2. /etc/shadow —— 密码文件 🔒

密码的 **真正存储位置**，默认只有 root 可读：

```
root:$6$s74oZg/...(长hash)...:19921:0:99999:7:::
daemon:*:19873:0:99999:7:::
hacker::19916:0:99999:7:::
zardus:$6$bEFkpM0w/...(长hash)...:19921:0:99999:7:::
```

每行格式（用 `:` 分隔 9 个字段）：

| 字段 | 含义 | 说明 |
|------|------|------|
| 1. 用户名 | | `zardus` |
| 2. 密码哈希 | 加密后的密码 | 见下方解读 |
| 3. 最后修改日期 | 距 1970-01-01 的天数 | |
| 4. 最短修改间隔 | 天数 | 0 = 无限制 |
| 5. 最长有效期 | 天数 | 99999 ≈ 永不过期 |
| 6. 警告期 | 过期前几天开始警告 | |
| 7. 不活跃期 | 过期后多久禁用 | |
| 8. 账户过期日 | | |
| 9. 保留字段 | | |

#### 密码哈希字段解读 🔐

```
$6$bEFkpM0w/6J0n979$47ksu/JE5QK6hSe...
│  │                │
│  │                └── 哈希值
│  └── Salt（盐值）
└── 算法标识：$6$ = SHA-512
```

| 标识 | 算法 | 安全性 |
|------|------|--------|
| `$1$` | MD5 | ❌ 已不安全 |
| `$5$` | SHA-256 | ⚠️ 一般 |
| `$6$` | SHA-512 | ✅ 推荐 |
| `$y$` | yescrypt | ✅ 最新推荐 |

密码字段的特殊值：

| 值 | 含义 |
|----|------|
| `$6$...`（长哈希） | 有密码 |
| `*` | 账户禁用密码登录 |
| `!` | 账户被锁定 |
| （空） | 无密码！⚠️ 危险配置 |

### 3. /etc/group —— 组文件 👥

```
root:x:0:
sudo:x:27:hacker
hacker:x:1000:
students:x:1001:hacker,zardus
```

格式（4 个字段）：

| 字段 | 含义 | 示例 |
|------|------|------|
| 1. 组名 | | `students` |
| 2. 密码占位 | 通常为 `x` | `x` |
| 3. GID | 组 ID | `1001` |
| 4. 成员列表 | 逗号分隔 | `hacker,zardus` |

```bash
# 查看某个组的成员
grep students /etc/group

# 查看自己在哪些组
groups
# 或
id
```

---

## 🔧 涉及的命令

### 1. whoami —— 我是谁？🤔

**语法**: `whoami`

**作用**: 显示当前有效用户名。就这么简单。

```bash
hacker@dojo:~$ whoami
hacker

# 切换到 root 后
root@dojo:~# whoami
root
```

等效于 `id -un`，但更短更好记。

---

### 2. id —— 详细身份信息 🪪

**语法**: `id [选项] [用户名]`

**作用**: 显示用户的 UID、GID 和所有组。

```bash
hacker@dojo:~$ id
uid=1000(hacker) gid=1000(hacker) groups=1000(hacker)

# 查看其他用户
hacker@dojo:~$ id root
uid=0(root) gid=0(root) groups=0(root)
```

常用选项：

| 选项 | 作用 | 示例输出 |
|------|------|----------|
| `-u` | 只显示 UID | `1000` |
| `-g` | 只显示 GID | `1000` |
| `-G` | 显示所有组 ID | `1000 27` |
| `-n` | 显示名字而非数字（配合 -u/-g） | `hacker` |

```bash
# 只看用户名
id -un        # 输出: hacker

# 只看所有组名
id -Gn        # 输出: hacker sudo
```

---

### 3. su —— 切换用户 🔄

**语法**: `su [选项] [用户名]`

**作用**: 切换到另一个用户（默认切换到 root）。需要输入 **目标用户** 的密码。

```bash
# 切换到 root（需要 root 密码）
hacker@dojo:~$ su
Password:
root@dojo:~#

# 切换到指定用户
hacker@dojo:~$ su zardus
Password:
zardus@dojo:~$

# 使用 - 获得完整的登录环境（推荐！）
hacker@dojo:~$ su - root
Password:
root@dojo:~#
```

⚠️ **su vs su -**：

| 命令 | 环境变量 | 工作目录 | PATH |
|------|---------|---------|------|
| `su root` | 保留当前用户的 | 不变 | 不变 |
| `su - root` | 加载目标用户的 | 切换到 ~ | 更新 |

💡 **为什么 su 在现代系统中不常用？**
- 需要知道目标用户的密码
- root 密码管理困难（泄露风险高）
- 不适合大规模服务器管理
- 已被 `sudo` 取代

`su` 是一个 **SUID 程序**！它以 root 身份运行，验证密码后切换用户：

```bash
hacker@dojo:~$ ls -l /usr/bin/su
-rwsr-xr-x 1 root root 232416 Dec 1 11:45 /usr/bin/su
    ^
    SUID 位！
```

---

### 4. sudo —— 以 root 身份执行 ⚡

**语法**: `sudo [选项] 命令`

**作用**: 以 root（或指定用户）身份执行单条命令。需要输入 **自己的** 密码（或免密配置）。

```bash
# 以 root 身份执行命令
hacker@dojo:~$ whoami
hacker
hacker@dojo:~$ sudo whoami
root

# 以 root 读取受限文件
hacker@dojo:~$ cat /etc/shadow
cat: /etc/shadow: Permission denied
hacker@dojo:~$ sudo cat /etc/shadow
root:$6$...

# 以指定用户执行
sudo -u zardus whoami    # 输出: zardus

# 获取 root shell
sudo -i     # 登录式 shell
sudo -s     # 非登录式 shell
sudo bash   # 直接启动 bash
```

常用选项：

| 选项 | 作用 |
|------|------|
| `-u 用户` | 以指定用户身份执行（默认 root） |
| `-i` | 模拟完整登录（加载 profile 等） |
| `-s` | 启动一个 shell |
| `-l` | 列出当前用户可以执行的 sudo 命令 |
| `-k` | 清除缓存的密码 |

#### sudo 的工作原理 ⚙️

```
用户执行 sudo cmd
      │
      ▼
sudo 检查 /etc/sudoers
      │
      ├── 用户是否有权限？
      │     ├── 是 → 验证密码（或 NOPASSWD）→ 执行命令
      │     └── 否 → 拒绝 ❌ 并记录日志
      │
      └── 密码缓存（默认 15 分钟内不再询问）
```

#### /etc/sudoers 文件 📜

```bash
# 查看 sudoers（不要直接编辑！用 visudo）
sudo cat /etc/sudoers

# 典型配置
root    ALL=(ALL:ALL) ALL          # root 可以执行任何命令
%sudo   ALL=(ALL:ALL) ALL          # sudo 组的成员可以执行任何命令
hacker  ALL=(ALL) NOPASSWD: ALL    # hacker 无需密码执行任何命令
```

格式解读：

```
用户  主机=(以谁的身份) 可执行的命令
```

⚠️ **永远用 `visudo` 编辑 sudoers 文件**——它会做语法检查，防止你把自己锁在外面！

---

### 5. 密码破解 —— John the Ripper 🔨

如果你拿到了泄露的 `/etc/shadow`，可以用 John the Ripper 破解密码：

```bash
# 基本用法
john shadow-file

# 指定字典
john --wordlist=/usr/share/wordlists/rockyou.txt shadow-file

# 查看已破解的密码
john --show shadow-file
```

在 pwn.college 的挑战中：

```bash
# 破解泄露的 shadow 文件
hacker@dojo:~$ john /challenge/shadow-leak
Loaded 1 password hash (crypt, generic crypt(3) [?/64])
password1337     (zardus)

# 然后用破解出的密码 su
hacker@dojo:~$ su zardus
Password: password1337
zardus@dojo:~$ /challenge/run
```

💡 这就是为什么 `/etc/shadow` 必须严格保护——一旦泄露，密码就可能被暴力破解！

---

## 🎯 挑战解析

这个模块的挑战逐步升级，以下是思路提示：

1. **Becoming root with su** 🔑：已知 root 密码为 `hack-the-planet`，直接 `su` 然后读 flag
2. **Other users with su** 🔄：用 `su zardus` 切换到 zardus（密码 `dont-hack-me`），然后执行 `/challenge/run`
3. **Cracking passwords** 🔨：用 John the Ripper 破解 `/challenge/shadow-leak` 中的密码，然后 `su` 切换
4. **Using sudo** ⚡：直接 `sudo cat /flag` 或 `sudo /challenge/run`

💡 **解题核心思路**：
- `su` 需要目标用户的密码
- `sudo` 需要在 sudoers 中有配置
- 密码哈希泄露 + John = 密码明文

---

## 📚 知识扩展

### 密码安全的演进史 📜

```
1970s: 密码明文存在 /etc/passwd（全局可读！😱）
  ↓
1980s: 密码移到 /etc/shadow（只有 root 可读）
  ↓
1990s: 从 DES 加密升级到 MD5 哈希
  ↓
2000s: SHA-256/SHA-512 成为标准
  ↓
2020s: yescrypt/bcrypt 等专用密码哈希
```

### PAM（Pluggable Authentication Modules）🔌

Linux 的认证不止密码一种！PAM 是一个可插拔的认证框架：

```
su/sudo/login → PAM → 密码认证
                    → LDAP 认证
                    → 生物识别
                    → 双因素认证
                    → ...
```

### NSS（Name Service Switch）🔀

`/etc/passwd` 不一定是用户信息的唯一来源：

```bash
# /etc/nsswitch.conf 决定了查找顺序
passwd: files ldap
# 先查本地文件，再查 LDAP
```

### 提权攻击思路 🎯

理解用户系统后，常见的提权路径包括：

1. **SUID 滥用**：找到有漏洞的 SUID 程序
2. **sudo 配置错误**：`sudo -l` 查看可以执行什么
3. **/etc/passwd 可写**：直接添加 root 用户
4. **/etc/shadow 泄露**：暴力破解密码
5. **cron job 滥用**：以 root 运行的定时任务有漏洞

---

## 🏆 最佳实践

1. 🔒 **禁用 root 直接登录**：用 `sudo` 代替 `su`
2. 🔑 **使用强密码**：避免字典攻击破解
3. 📝 **最小 sudo 权限**：只授权必要的命令，而非 `ALL`
4. 🔍 **定期检查 sudo 日志**：`/var/log/auth.log`
5. 🚫 **不要在 /etc/passwd 中留空密码字段**
6. 🛡️ **保护 /etc/shadow 权限**：确保只有 root 可读
7. 🔐 **SSH 密钥认证优于密码认证**

---

## 📝 小结

| 命令 | 作用 | 关键点 |
|------|------|--------|
| `whoami` | 显示当前用户名 | 最简单的身份查询 |
| `id` | 显示 UID/GID/组 | 详细身份信息 |
| `su` | 切换用户 | 需要目标用户的密码 |
| `sudo` | 以 root 执行命令 | 需要 sudoers 授权 |
| `john` | 破解密码哈希 | 安全审计利器 |

| 文件 | 作用 | 权限 |
|------|------|------|
| `/etc/passwd` | 用户数据库 | 全局可读 |
| `/etc/shadow` | 密码哈希 | 仅 root 可读 |
| `/etc/group` | 组数据库 | 全局可读 |
| `/etc/sudoers` | sudo 配置 | 仅 root 可读 |

| 概念 | 说明 |
|------|------|
| UID 0 | root 用户，至高权限 |
| SUID | 程序以文件所有者身份运行 |
| su vs sudo | su 需目标密码，sudo 需自己密码+授权 |
| 密码哈希 | 单向加密，可暴力破解 |

---

## 🔮 下一站预告

下一个模块是 **Chaining Commands** ⛓️——学习如何把多个命令串联起来！你将掌握 `;`、`&&`、`||`、管道、子 shell 等高级组合技巧。从单兵作战到组合连招，你的 Linux 功力即将再上一个台阶！🚀
