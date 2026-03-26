# 遥感数据集搜索引擎

专注于深度学习遥感影像数据集的整理与推荐引擎。

## 🎯 项目目标

- 为学术研究者提供高质量的遥感数据集搜索与发现平台
- 多维度元数据描述（传感器、分辨率、任务类型等）
- 学术资源集成（论文链接、DOI、BibTeX 引用）

## 🛠️ 技术栈

- **前端**: Next.js 14 (App Router)
- **后端**: Supabase (PostgreSQL)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **部署**: Vercel

## 📦 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`，填入你的 Supabase 项目凭证。

### 3. 初始化数据库

在 Supabase 控制台 SQL 编辑器中运行 `schema.sql` 文件内容。

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 🗄️ 数据库 Schema

详见 `schema.sql` 文件。

### 核心表

- `datasets`: 数据集主表
- `tags`: 标签表
- `dataset_tags`: 数据集 - 标签关联表

## 📋 功能规划

### MVP（4 周）

- [x] 项目初始化
- [ ] 数据库设计
- [ ] 数据录入（20-30 个核心数据集）
- [ ] 搜索与筛选功能
- [ ] 数据集详情页
- [ ] BibTeX 引用导出

### 后续迭代

- [ ] 地图可视化
- [ ] 用户贡献/审核
- [ ] 数据集相似度推荐
- [ ] API 开放

## 📝 数据集录入模板

详见项目文档。

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT
