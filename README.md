# 遥感数据集搜索引擎

专注于深度学习遥感影像数据集的整理与推荐。

**项目状态**: ✅ MVP 完成并部署  
**最后更新**: 2026-03-29

---

## 🌐 访问地址

- **生产环境**: https://rs-data-hub-alien-2022s-projects.vercel.app
- **GitHub**: https://github.com/Alien-2022/rs-data-hub
- **Gitee**: https://gitee.com/subi2000/rs-data-hub

---

## ✨ 功能特性

- 🔍 **多维度搜索** - 关键词搜索 + 任务类型 + 数据模态筛选
- 📊 **20 个经典数据集** - 涵盖 89 万 + 图像
- 🎯 **学术导向** - 论文链接、DOI、BibTeX 引用一键导出
- 🚀 **高性能** - React Query 缓存 + 预加载，翻页响应 <10ms
- 📱 **响应式** - 完美适配桌面和移动端
- 🛡️ **企业级安全** - 速率限制/输入验证/RLS/CORS/安全响应头

---

## 📊 数据规模

| 指标 | 数量 |
|------|------|
| 数据集 | 20 个 |
| 图像总数 | ~89 万张 |
| 任务类型 | 5 个 |
| 数据模态 | 5 个 |

**任务类型**: 图像分类、目标检测、语义分割、变化检测、实例分割  
**数据模态**: 光学、SAR、多光谱、高光谱、LiDAR

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

## 📚 文档

- [项目文档](./docs/README.md) - 文档导航
- [数据集清单](./docs/datasets-top20.md) - 20 个经典遥感数据集
- [数据验证流程](./docs/workflows/data-verification.md) - 链接验证方法
- [经验教训](./knowledge/LESSONS.md) - 实践中积累的经验

---

## 📈 性能表现

| 指标 | 优化前 | 优化后 | 提升 |
|------|--------|--------|------|
| 计数查询 | ~50ms | ~1ms | **50 倍** |
| 筛选查询 | ~30ms | ~5ms | **6 倍** |
| 翻页响应 | ~100ms | <10ms | **10 倍** |
| 重复请求 | 100% | 30-50% | **减少 50-70%** |

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License
