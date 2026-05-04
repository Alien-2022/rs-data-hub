# 工具脚本

## 文件清单

| 文件 | 用途 |
|------|------|
| `verify_links.py` | 批量验证数据集链接有效性（并发） |
| `import_datasets.py` | 从 JSON 批量导入数据集到 Supabase |
| `batch_update_datasets.py` | 批量更新数据库字段（支持 dry-run） |
| `datasets.json` | 数据格式模板（3 条示范） |
| `candidates.json` | Agent 采集输出 / 用户审查输入 |
| `create_indexes.sql` | 创建数据库索引（GIN + B-Tree） |
| `setup_rls.sql` | 配置 Supabase RLS 行级安全策略 |
| `schema.sql` | 数据库建表语句（datasets/tags/dataset_tags） |

## 数据集管理工作流

> 详见 [docs/workflows/data-management.md](../docs/workflows/data-management.md)

**流程**: 用户发起"找新数据集" → Agent 采集 → 用户审查 → Agent 导入 → 验证链接 → 更新文档

## 链接验证

```bash
python verify_links.py --url https://arxiv.org/abs/1909.00133
python verify_links.py --input datasets.json --output report.json
python verify_links.py --input datasets.json --format markdown --output report.md
```

状态：`✅` 有效（200-399）| `⚠️` 需人工确认（403/5xx）| `❌` 失效（404/连接失败）

## 批量导入

```bash
export SUPABASE_URL='your-supabase-url'
export SUPABASE_SERVICE_ROLE_KEY='your-service-role-key'
python import_datasets.py --input datasets.json
```

## 批量更新

```bash
python batch_update_datasets.py --dry-run   # 预览变更
python batch_update_datasets.py --execute   # 执行更新
```

## SQL 脚本

在 Supabase Dashboard → SQL Editor 中按顺序执行：

- `schema.sql`：建表语句（首次部署时执行）
- `create_indexes.sql`：创建查询性能索引（幂等）
- `setup_rls.sql`：配置只读公开 / 禁止匿名写入的 RLS 策略
