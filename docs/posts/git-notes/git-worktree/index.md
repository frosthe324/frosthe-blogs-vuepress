---
title: Git Worktree - 一个仓库，多个工作目录
author: Frost He
date: 2026-03-10
description: git worktree 让你在磁盘上同时拥有同一仓库的多个工作目录
excerpt: git worktree 让你在磁盘上同时拥有同一仓库的多个工作目录
categories:
- Git
tag:
- git
- worktree
---

## 什么是 Git Worktree

一个 Git 仓库默认只有一个工作目录，对应一个签出的 branch。想在另一个 branch 上工作，就得先 stash 或 commit 当前改动，再 `git checkout`，这是一个**串行**的工作流。

`git worktree` 把它变成**并行**的：为同一个仓库在磁盘上创建多个工作目录，每个目录签出不同的 branch，互不干扰。你不需要在 branch 之间来回切换，而是直接打开另一个目录继续工作。

所有 worktree 共享同一份 `.git` 仓库数据 (对象、引用等)，不需要重复克隆。

## 使用场景

- **紧急修复**：正在 feature branch 开发，需要在 main 上修 bug，直接开一个 worktree，两边互不影响
- **并行开发**：两个 feature branch 各自保留编译产物和运行状态，不互相覆盖
- **代码对比**：两个 branch 同时在不同编辑器窗口中打开
- **长时间构建**：一个 worktree 在跑构建/测试，另一个继续写代码

## 常用命令

### 添加 worktree

```
git worktree add <path> [<branch>]
```

在 `<path>` 创建一个新的工作目录并签出指定 branch:
- 省略 `<branch>` 时，Git 以 `<path>` 的最后一段作为 branch 名 - 若该 branch 存在则签出，不存在则自动创建
- 指定 `<branch>` 时，签出该已有 branch

**关于路径**: worktree 的路径通常在仓库目录之外(如 `../hotfix`)。worktree 是一个独立的工作目录，放在仓库内部会被 Git 视为仓库内容的一部分，产生干扰。典型的磁盘布局如下:

```
~/projects/
├── my-repo/          ← 主仓库 (main branch)
├── hotfix/           ← worktree (hotfix branch)
└── feature-new/      ← worktree (feature/new branch)
```

```bash
# 最常用: 省略 branch，自动签出或创建同名 branch
$ git worktree add ../hotfix

# 签出一个已有的 branch 到指定路径
$ git worktree add ../hotfix release-1.0

# -b 显式创建新 branch
$ git worktree add -b feature/new ../feature-new

# detached HEAD 模式，不关联任何 branch
$ git worktree add --detach ../temp-build
```

### 查看所有 worktree

```bash
$ git worktree list
/home/user/my-repo         abc1234 [main]
/home/user/hotfix          def5678 [hotfix]
/home/user/feature-new     789abcd [feature/new]
```

### 移除 worktree

```bash
$ git worktree remove ../hotfix

# 有未提交的修改时需要 --force
$ git worktree remove --force ../hotfix
```

手动删除 worktree 目录后，执行 `git worktree prune` 清理残留的管理数据。

### 移动 worktree

```bash
$ git worktree move ../hotfix ../bugfix
```

## 常用选项速查

| 选项          | 说明                                                         |
|---------------|--------------------------------------------------------------|
| `-b <branch>` | 创建新 branch 并签出到 worktree                              |
| `-B <branch>` | 创建或重置 branch 并签出                                     |
| `--detach`    | 以 detached HEAD 模式签出，不关联任何 branch                 |
| `--force`     | 允许签出已被其他 worktree 签出的 branch，或强制移除 worktree |
| `--lock`      | 创建后立即锁定 worktree，防止被 prune 清理                   |

## 注意事项

- worktree 中的 `.git` 是一个文件而非目录，内容指向主仓库的 `.git/worktrees/` 下对应的条目
- `git worktree lock <path>` 可防止 worktree 被 prune 意外清理，适用于挂载在可移动存储上的场景

参考资料:
- https://git-scm.com/docs/git-worktree
