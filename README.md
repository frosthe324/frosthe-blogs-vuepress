# FrostHe 技术博客

基于 VuePress 构建的个人技术博客，分享软件开发、架构设计、人工智能等技术心得。

## 技术栈

- **框架**: VuePress 2.0
- **构建工具**: Vite
- **包管理器**: pnpm 10.13.1
- **Node.js**: 20.19.2

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm docs:dev

# 构建生产版本
pnpm docs:build
```

## 部署

项目配置了 GitHub Actions 自动部署到 GitHub Pages。当代码推送到 `master` 分支时，会自动触发构建和部署流程。

详细部署指南请参考[部署文档](.github\workflows\deploy-docs.yml)。

## 许可证

MIT Licensed