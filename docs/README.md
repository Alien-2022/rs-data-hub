# 项目文档

## 目录结构

```
docs/
├── README.md                    # 本文档
├── datasets-top20.md            # 20 个经典遥感数据集清单
└── workflows/
    └── data-verification.md     # 数据验证流程

knowledge/
└── LESSONS.md                   # 经验教训（按类别组织）

.agent/                          # AI 辅助文件（不上传 GitHub）
├── GUIDE.md                     # AI 项目上下文指南
└── CHANGELOG.md                 # AI 工作日志
```

## 文档说明

### docs/

| 文档 | 用途 |
|------|------|
| [datasets-top20.md](./datasets-top20.md) | 已收录的 20 个数据集一览表，含论文和下载链接 |
| [workflows/data-verification.md](./workflows/data-verification.md) | 新增数据集时的链接验证流程和检查清单 |

### knowledge/

| 文档 | 用途 |
|------|------|
| [LESSONS.md](../knowledge/LESSONS.md) | 链接验证、数据库、前端、部署、安全等实践经验 |

### .agent/（仅本地）

| 文档 | 用途 |
|------|------|
| GUIDE.md | AI Agent 快速理解项目的入口文件（技术栈、目录结构、Schema、已知坑） |
| CHANGELOG.md | 滚动更新的工作日志，供 Agent 回顾近期工作 |

## 已归档文档

以下一次性报告已从仓库移除，核心结论已合并到 CHANGELOG 和 LESSONS 中：

- ~~optimization-report.md~~ → 性能优化详情（estimated count + 索引 + pageSize 限制）
- ~~react-query-optimization.md~~ → React Query 缓存策略
- ~~category-standardization.md~~ → 分类标准化（14→5 / 9→5）
- ~~security-optimization.md~~ → 安全优化综合报告
- ~~security-setup.md~~ → Upstash Redis 配置指南
