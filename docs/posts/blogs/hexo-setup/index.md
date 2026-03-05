---
title: 搭建 Hexo 轻博客
date: 2015-05-07 23:21:36
categories: 
- Hexo
tag: 
- hexo
---

本文索引:
<!-- TOC -->

- [前言](#前言)
- [环境准备](#环境准备)
- [初始化](#初始化)
- [配置 _config.yml](#配置-_configyml)
    - [网站(site)](#网站site)
    - [网址(url)](#网址url)
- [本地测试](#本地测试)
- [部署到 Github Pages](#部署到-github-pages)
    - [为 Github Pages 指定自定义域名](#为-github-pages-指定自定义域名)

<!-- /TOC -->

## 前言
如果你
- 希望摆脱对第三方云笔记的依赖 
- 对 Git 有足够的了解

那么 [Hexo](https://hexo.io/) 将是个人博客很好的一个选择。Hexo 是一个轻量级的基于 [Markdown(.md)](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) 的轻博客框架。

## 环境准备
 - Node.js
 - 安装 hexo npm 包
 - git bash 客户端

`hexo` 是 [npm](https://github.com/npm/npm) 的一个包，首先从 [Node.js](https://nodejs.org/zh-cn/) 官网下载对应系统的安装包。`Node.js` 安装完成后会自动在环境变量中加入 `npm cli` 的路径，接着在 cli 中使用以下命令安装 `hexo` 包：
``` bash
npm install -g hexo-cli
```
确认安装已经成功：
``` bash 
hexo version
```

## 初始化
以下两种途径初始化 `hexo`：
- 首先创建指定目录作为 `hexo` 的根目录，在该目录下运行命令行工具，执行 `hexo init`，该命令会以当前目录作为 `hexo` 的根
- 启动命令行工具，执行 `hexo init <folder>` 初始化指定目录为 `hexo` 的根，随后执行 `cd <folder>` 导航到该目录


> `hexo init <folder>` 命令中，如果 `folder` 所包含的目录层级中包含不存在的层级，该命令会自动创建该层级下的目录

初始化完成后，得到以下的目录结构：
```
.
├── _config.yml
├── package.json
├── scaffolds
├── source
|   ├── _drafts
|   └── _posts
└── themes
```
在初始化完成后的目录中包含了 `package.json` 文件，意味着该项目有其自己的 npm 包依赖，执行 `npm install` 解析依赖并在本地安装。

## 配置 _config.yml
`_config.yml` 文件包含了对 `hexo` 博客站点的配置信息。
### 网站(site)
| 参数        | 描述           |
| ----------- | -------------- |
| title       | 网站标题       |
| subtitle    | 网站副标题     |
| description | 网站描述       |
| author      | 作者名字       |
| language    | 网站使用的语言 |
| timezone    | 时区           |
其中，`description` 主要用于 SEO，为搜索引擎提供一个关于站点的简单描述，通常建议包含网站的关键词。`author` 参数用于主题显示文章的作者。
### 网址(url)
| 参数               | 描述                     | 默认值(示例值)                  |
| ------------------ | ------------------------ | ------------------------------- |
| url                | 根地址                   | http://www.your-site.conm/blog/ |
| root               | 站点根目录               | /blog/                          |
| permalink          | 文章的永久链接格式       | :year/:month/:day/:title/       |
| permalink_defaults | 永久链接中各部分的默认值 |                                 |


> 永久链接是指，当执行 `hexo s` 或发布到 web server 之后，其生成文件的 url 组成策略，默认值为 `:year/:month/:day/:title/`，这意味着 url 将以分隔的日期值来定位文章。


> `url` 和 `root` 总是成对修改，例如，想要把站点的根目录放在子目录 `/blog` 下，那么 `root` 的值应该修改为 `/blog/`，`url` 的值对应修改为 `http://www.your-site.com/blog/`。

> 官方文档中的网站存放于子目录的意思是，`hexo` 项目包含的是生成站点的源代码文件，包括 `source/_posts` 目录，均用于生成网站，而“网站”是指生成好之后的静态资源文件集。

> 更多配置详情参考[官方文档](https://hexo.io/docs/configuration.html)

## 本地测试
本地生成并 serve：
``` bash
cd <target-directory>
hexo g
hexo server
```
此时在浏览器中访问 localhost 对应的端口号将看到一个新的模板页面已经生成成功，执行如下命令来创建新的文章，在 `source/_posts` 目录下一个对应的文件被创建
``` bash
hexo new "my-first-post"
```
导航到该文件可以看到其模板内容

``` ml
---
title: my-first-post
date: 2018-03-01 02:51:53
tag:
---
```
重新生成博客文章并启动 `hexo server`
``` bash
hexo generate
hexo server -o --debug
```

> `-o` 参数代表在成功 `serve` 立即打开一个浏览器窗口以访问站点的根页面，`--debug` 参数启用在控制台打印 `debug` 级别的日志信息，方便排错。
`hexo generate` 可简写为 `hexo g`，`hexo server` 可简写为 `hexo s`

文章列表中已经列出刚刚创建的文章名称，进一步修改该文件，`hexo server` 将实时更新页面内容

## 部署到 Github Pages

当站点准备就绪后，下一步就是要给它找个家，[GitHub](https://github.com/) 为每个账号提供了站点寄宿服务——[GitHub Pages](https://pages.github.com/)，在 `GitHub` 中创建一个 `username.github.io` 的公开仓库，将 `build` 好的站点资源文件集 `push` 到该仓库，再访问唯一的 `https://username.github.io/` 即可。

`hexo` 提供了自动部署机制，在 `_config.yml` 中找到 `deploy` 这一项：
``` bash
# Deployment
## Docs: https://hexo.io/docs/deployment.html
deploy:
  type: git
  repo: git@github.com:username/username.github.io.git
  branch: master
```
部署的更多详情参考[官方文档](https://hexo.io/docs/deployment.html)

### 为 Github Pages 指定自定义域名
`GitHub Pages` 支持自定域名解析，假设已经有了一个根域名 `example.com`，可配置将 `blog` 二级域名指向 `username.github.io`，具体参考「[官方指南](https://help.github.com/articles/using-a-custom-domain-with-github-pages/)」，Github Pages 接受使用 CNAME 记录将自定义域名指向 `username.github.io`，其实现原理是在站点根目录下放置一个名为 `CNAME` 的文件，其内容包含一行自定义域名值:
```bash
blog.example.com
```
该文件并不由 hexo 项目维护，所以每次运行 `hexo d` 之后该文件都将被删除。为了解决这个问题，可在 hexo 项目的 `/source` 目录下包含一个 `CNAME` 文件用于告知 Github Pages 自定义域名的值，在执行 `hexo g` 之后，生成的 `public` 文件夹也将包含该文件。这样，每次部署都会将该文件一同上传至 `username.github.io` 项目。
