# 工具脚本

## 文件清单

### 持久脚本

| 文件 | 用途 |
|------|------|
| `export_for_dedup.py` | 导出数据库摘要到本地，用于采集前查重 |
| `import_datasets.py` | 从 JSON 批量导入数据集到 Supabase |
| `batch_update_datasets.py` | 批量更新数据库字段（支持 dry-run） |
| `verify_links.py` | 批量验证数据集链接有效性（并发） |

### 持久模板

| 文件 | 用途 |
|------|------|
| `datasets.json` | 数据格式模板（3 条示范） |
| `candidates.json` | 采集输出格式参考（占位数据） |

### SQL 脚本

在 Supabase Dashboard → SQL Editor 中按顺序执行：

| 文件 | 用途 | 何时执行 |
|------|------|---------|
| `schema.sql` | 建表语句（datasets/tags/dataset_tags） | 首次部署 |
| `create_indexes.sql` | 创建查询性能索引（幂等） | 首次部署 |
| `setup_rls.sql` | 配置只读公开 / 禁止匿名写入的 RLS 策略 | 首次部署 |

### 运行时产物（`output/` 目录，不提交到 GitHub，已被 .gitignore 排除）

| 文件 | 何时生成 | 何时清理 |
|------|---------|---------|
| `output/dedup_index.json` | 采集前运行 `export_for_dedup.py` | 下次采集前覆盖 |
| `output/candidates_work.json` | Agent 采集时生成 | 导入完成后删除 |
| `output/*_report.json` | 验证/导入/更新时生成 | 按需保留或删除 |

## 数据集管理工作流

> 详见 [docs/workflows/data-management.md](../docs/workflows/data-management.md)

**流程**: 导出摘要 → Agent 采集（含查重）→ 用户审查 → Agent 导入 → 验证链接 → 更新文档

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

## 导出查重索引

```bash
export SUPABASE_URL='your-supabase-url'
export SUPABASE_SERVICE_ROLE_KEY='your-service-role-key'
python export_for_dedup.py                  # 输出到 output/dedup_index.json
python export_for_dedup.py --output /path   # 指定输出路径
```
