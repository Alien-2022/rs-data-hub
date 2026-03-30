# 遥感数据集搜索引擎 - 文档导航

**项目状态**: ✅ MVP 完成并部署 | 🛡️ 安全优化完成  
**最后更新**: 2026-03-30

---

## 📂 文档结构

```
docs/
├── README.md                    # 你在这里
├── optimization-report.md       # 基础性能优化报告
├── react-query-optimization.md  # React Query 缓存优化报告
├── category-standardization.md  # 数据集分类标准化说明
├── datasets-top20.md            # 20 个经典数据集清单
├── security-optimization.md     # 🛡️ 安全优化综合报告（新增）
├── security-setup.md            # Upstash Redis 配置指南
└── workflows/
    └── data-verification.md     # 数据验证流程

scripts/
├── create_indexes.sql           # 数据库索引脚本
├── batch_update_datasets.py     # 批量更新脚本
├── setup_rls.sql                # 🛡️ Supabase RLS 配置脚本（新增）
└── batch_update_report.json     # 更新报告
```

---

## 📖 快速索引

### 新手入门
- [20 个经典数据集](./datasets-top20.md) - 已收录的数据集清单
- [数据验证流程](./workflows/data-verification.md) - 如何验证论文/下载链接

### 优化报告
- [基础性能优化](./optimization-report.md) - 分页、计数、数据库索引
- [React Query 缓存](./react-query-optimization.md) - 缓存策略 + 预加载
- [分类标准化](./category-standardization.md) - 任务类型和数据模态分类
- [🛡️ 安全优化](./security-optimization.md) - 速率限制/输入验证/RLS 等（新增）

### 技术文档
- [数据库索引脚本](../scripts/create_indexes.sql) - 提升查询性能
- [批量更新脚本](../scripts/batch_update_datasets.py) - 标准化分类
- [🛡️ Supabase RLS 脚本](../scripts/setup_rls.sql) - 行级安全配置（新增）
- [🛡️ 安全中间件](../src/middleware.ts) - CORS/安全响应头（新增）

---

## 🚀 快速开始

**查看数据集？**
- 访问：https://rs-data-hub.vercel.app
- 查看：[数据集清单](./datasets-top20.md)

**验证新数据集？**
1. 阅读 [数据验证流程](./workflows/data-verification.md)
2. 使用验证脚本批量检查链接

**遇到技术问题？**
- 查看：[踩坑记录](../knowledge/lessons-learned.md)
- 查看：[优化报告](./optimization-report.md)

---

## 📊 项目统计

| 指标 | 数量 |
|------|------|
| 数据集 | 20 个 |
| 图像总数 | ~89 万张 |
| 任务类型 | 5 个（图像分类/目标检测/语义分割/变化检测/实例分割） |
| 数据模态 | 5 个（光学/SAR/多光谱/高光谱/LiDAR） |
| 代码行数 | ~12,605 行 |

---

## 🔗 相关链接

- **GitHub**: https://github.com/Alien-2022/rs-data-hub
- **Gitee**: https://gitee.com/subi2000/rs-data-hub
- **Vercel (生产环境)**: https://rs-data-hub-alien-2022s-projects.vercel.app

---

**维护人**: 小龙虾团队
