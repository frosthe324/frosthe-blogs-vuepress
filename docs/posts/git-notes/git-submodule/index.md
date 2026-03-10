---
title: Git Submodule - 在项目中嵌套管理其他仓库
date: 2019-09-13
description: git submodule 将一个 Git repository 作为另一个的子目录进行管理，两者独立维护各自的版本历史
excerpt: git submodule 将一个 Git repository 作为另一个的子目录进行管理，两者独立维护各自的版本历史
category:
- Git
tag:
- git
- submodule
---

## 什么是 Git Submodule

`git submodule` 允许将一个 Git repository 嵌套在另一个 repository 的子目录中。两个 repository 各自独立维护版本历史，互不干扰。包含 submodule 的 repository 称为 superproject。

使用场景:
- 项目依赖一个外部维护的库，希望引用其源码但分开管理
- 将一个大项目拆分为多个独立 repository 并组合在一起

## 添加 submodule

```bash
$ git submodule add https://github.com/chaconinc/DbConnector
```

默认以 repository 名称作为目录名添加到项目根目录下 (本例中为 `DbConnector`)。也可以在命令末尾指定自定义路径。

执行后会产生两个变化:
- 新增 `.gitmodules` 文件 - 存储 superproject 与 submodule 之间的映射关系，该文件受版本控制
- 新增 submodule 对应的目录

`.gitmodules` 内容示例:

```
[submodule "DbConnector"]
	path = DbConnector
	url = https://github.com/chaconinc/DbConnector
```

## 克隆含 submodule 的项目

submodule 不会随 superproject 一起被克隆。直接 `git clone` 后，submodule 目录是空的。

有两种方式获取 submodule 内容:

```bash
# 方式一: 克隆后手动初始化
$ git submodule update --init --recursive

# 方式二: 克隆时一步到位
$ git clone --recurse-submodules https://github.com/chaconinc/MainProject
```

之后拉取更新时，加上 `--recurse-submodules` 可同步所有 submodule:

```bash
$ git pull --recurse-submodules
```

## 获取 submodule 更新

最典型的场景: 引用一个外部 repository，仅使用不修改。

**方式一**: 进入 submodule 目录手动更新

```bash
$ cd DbConnector
$ git fetch
$ git merge origin/master
```

**方式二**: 在 superproject 目录下直接更新所有 submodule

```bash
$ git submodule update --remote DbConnector
```

该命令默认以各 submodule 的 master branch 作为更新依据，可通过 `.gitmodules` 的 `branch` 配置项修改。

更新后在 superproject 执行 `git diff --submodule` 可查看变更的 commit 列表。设置默认参数可省去每次输入 `--submodule`:

```bash
$ git config --global diff.submodule log
```

## .gitmodules 配置参考

`.gitmodules` 位于 Git working tree 的根目录，每个 subsection 对应一个 submodule 的配置。

### 必填项

| 配置项                     | 说明                                                                   |
|----------------------------|------------------------------------------------------------------------|
| `submodule.<name>.path`    | 相对于 working tree 根目录的路径，不能以 `/` 结尾，所有路径必须唯一    |
| `submodule.<name>.url`     | 克隆 submodule 的 URL，可以是绝对路径，也可以 `./` 或 `../` 开头的相对路径 |

### 可选项

| 配置项                                  | 说明                                                                                       |
|-----------------------------------------|--------------------------------------------------------------------------------------------|
| `submodule.<name>.branch`               | 用于检测更新的 branch 名称，默认 master。`.` 表示取与 superproject 当前 branch 一致的名称  |
| `submodule.<name>.update`               | 定义 `git submodule update` 时的默认更新行为                                               |
| `submodule.<name>.fetchRecurseSubmodules`| 控制递归 fetch，可被 `--[no-]recurse-submodules` 覆盖                                     |
| `submodule.<name>.shallow`              | 设为 true 时执行浅 clone (只包含一层深度的历史)                                            |
| `submodule.<name>.ignore`               | 控制 `git status` 和 diff 如何对待 submodule 的修改                                        |

`ignore` 可取的值:

| 值          | 行为                                                           |
|-------------|----------------------------------------------------------------|
| `all`       | submodule 永远不被视为 modified (staged 后仍会显示)            |
| `dirty`     | 忽略工作目录的修改，只关注 HEAD 与 superproject 记录的差异     |
| `untracked` | 只忽略未追踪的文件                                             |
| `none`      | 不忽略任何修改                                                 |

配置示例:

```
[submodule "libfoo"]
	path = include/foo
	url = git://foo.com/git/lib.git
```

## 文件系统结构

一个 submodule 在文件系统中通常由三部分组成:

1. superproject 的 `$GIT_DIR/modules/<name>/` - submodule 的 Git 数据目录
2. superproject 工作目录下的对应子目录 - submodule 的工作目录
3. 子目录根下的 `.git` 文件 - 指向 (1) 的位置

superproject 通过子目录中的 gitlink 和 `.gitmodules` 中的条目来追踪 submodule。

参考资料:
- https://git-scm.com/book/en/v2/Git-Tools-Submodules
- https://git-scm.com/docs/gitmodules
- https://git-scm.com/docs/gitsubmodules
