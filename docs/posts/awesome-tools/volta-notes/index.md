---
title: Volta 使用笔记
description: 
excerpt: Volta 是对 Nodejs 开发环境和工具涟的管理工具，它允许用户虚拟化整个工具链，让每个项目都有自己的 Node + 工具版本组合，并实现零摩擦切换
author: Frost He
date: 2025-10-21
lang: zh-CN
category:
- Awesome Tools
tag:
- volta
---

Volta 是对 Nodejs 开发环境和工具涟的管理工具，它允许用户虚拟化整个工具链，让每个项目都有自己的 Node + 工具版本组合，并实现零摩擦切换。

过去，使用 nvm 进行虚拟 Node 版本管理时常遇到一些问题:

## 独立管理全局工具版本

过去，nvm 切换 node 版本时会同时切换其对应的全局 npm 库，无法单独对工具进行版本管理。当 A 项目依赖 `node@20 pnpm@8`，而 B 项目依赖 `node@20 pnpm@10` 时，无法在 node20 的虚拟 node 环境安装两个版本的 pnpm，只能在该虚拟环境不同的卸载和安装对应版本的 pnpm。

- 当你执行 nvm use 20 时，它会修改环境变量，让 shell 指向对应的 Node 可执行文件和全局 npm 包目录
- 因此，在 `node@20` 下安装的全局工具 (如 pnpm、yarn、typescript) 都属于这个 Node 版本的全局环境。

Volta 引入了 "每个工具独立固定版本" 的机制。

## 项目级自动切换

`nvm-windows` 暂时不支持在项目中使用 `.nvmrc`，以实现在项目级的自动 node 版本切换。当在多个项目之间来回切换开发时，如果它们所依赖的 node 版本不同。则每次都需要手动切换 nvm 版本。

当执行 `volta pin node@20`, `volta pin pnpm@8` 时，会在当前项目的 `package.json` 中写入:

```JSON
{
  "volta": {
    "node": "20.0.0",
    "pnpm": "8.6.3"
  }
}
```

Volta 会在进入该项目时自动激活对应版本的 Node 和 pnpm。当你切到另一个项目 (pin 了 pnpm@10)，Volta 自动切换环境，无需手动切换或重新安装。

| 项目 | 配置              | 实际使用                           |
| ---- | ----------------- | ---------------------------------- |
| `A`  | `node@20 pnpm@8`  | Volta 自动切换到 Node 20 + pnpm 8  |
| `B`  | `node@20 pnpm@10` | Volta 自动切换到 Node 20 + pnpm 10 |
| `C`  | 无 pin            | 使用用户默认（global）版本         |

## 常用命令

### 安装全局(默认)工具

```shell
$ volta install pnpm@10
```

该命令将 `pnpm@10` 作为 pnpm 的默认版本安装到当前全局环境，在无 pin 场景时，默认使用 `pnpm@10`。

### 安装项目级环境及工具

`volta pin` 即为当前目录所在的项目指定 node 环境及工具的版本，例如 `volta pin node@22 pnpm@10`

### 列出已安装工具及包

```shell
$ volta list

⚡️ Currently active tools:

    Node: v22.19.0 (current @ D:\path-to-the-project\package.json)
    npm: v10.9.3 (default)
    pnpm: v10.13.1 (current @ D:\path-to-the-project\package.json)
    Tool binaries available:
        claude (default)
        pnpm, pnpx (default)
        tsc, tsserver (default)
        vite (default)
```

取决于执行 `pnpm list` 的当前工作目录，该命令打印出主要环境及工具的版本，及所使用的 profile (default or pinned)。以上例子可以看出，node 及 pnpm 因为在该项目中检测到有 pin 的版本，所以使用了其指定的版本的，其他工具使用安装的 default 版本。

另外，可使用 `all` option 查看当前全局环境下，安装的所有工具及版本: 

```shell
$ volta list all

⚡️ User toolchain:

    Node runtimes:
        v14.21.1
        v16.20.2
        v18.18.2
        v20.19.2 (default)
        v20.19.5
        v22.14.0
        v22.19.0 (current @ D:\path-to-the-project\package.json)

    Package managers:
        npm:
            v6.14.18
            v10.9.3 (default)
        pnpm:
            v6.35.1
            v8.9.2
            v8.15.9
            v9.15.9
            v10.13.1 (default)

    Packages:
        ... 其他工具版本未列出
```

### 其他命令

- `volta uninstall`: 卸载指定版本的工具
- `volta which`: 展示特定工具的实际调用目录