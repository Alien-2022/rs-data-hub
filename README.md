# 遥感数据集搜索引擎

专注于深度学习遥感影像数据集的整理与推荐。

---

## ✨ 功能特性

- 🔍 **多维度搜索** - 关键词搜索 + 任务类型 + 数据模态筛选
- 🎯 **学术导向** - 论文链接、DOI、BibTeX 引用一键导出
- 📱  **响应式** - 完美适配桌面和移动端

---

## 📊 数据规模

| 指标 | 数量 |
|------|------|
| 数据集 | 20 个 |
| 任务类型 | 5 个 |
| 数据模态 | 5 个 |

**任务类型**: 图像分类、目标检测、语义分割、变化检测、实例分割  
**数据模态**: 光学、SAR、多光谱、高光谱、LiDAR、热红外

---

## 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| **前端** | Next.js 14 (App Router), React, Tailwind CSS |
| **后端** | Next.js API Routes |
| **数据库** | Supabase (PostgreSQL) |
| **部署** | Vercel |
| **性能优化** | React Query 缓存 + 预加载 |

---

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件：

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

---


## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License
