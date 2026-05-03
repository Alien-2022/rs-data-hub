# 工具脚本

## 脚本列表

| 脚本 | 用途 |
|------|------|
| `verify_links.py` | 批量验证数据集链接有效性 |
| `import_datasets.py` | 从 JSON 批量导入数据集到 Supabase |
| `batch_update_datasets.py` | 批量更新数据集分类 |
| `update_dataset_categories.py` | 更新数据集分类标签 |
| `create_indexes.sql` | 创建数据库索引（GIN + B-Tree） |
| `setup_rls.sql` | 配置 Supabase RLS 行级安全策略 |
| `test_insert.sql` | 测试数据插入 |

## 数据文件

| 文件 | 说明 |
|------|------|
| `datasets_sample.json` | 示例数据集（20 个） |
| `datasets_20.json` | 完整 20 个数据集数据 |

## 链接验证脚本

```bash
# 验证单个链接
python verify_links.py --url https://arxiv.org/abs/1909.00133

# 批量验证（JSON 输入）
python verify_links.py --input datasets_20.json --output report.json

# 生成 Markdown 报告
python verify_links.py --input datasets_20.json --format markdown --output report.md

# 调整超时（默认 10 秒）和并发数（默认 10）
python verify_links.py --input datasets_20.json --timeout 30 --workers 20
```

输出状态：`✅` 有效（200-399）| `⚠️` 需人工确认（403/5xx）| `❌` 失效（404/连接失败）

## 批量导入脚本

```bash
# 设置环境变量
export SUPABASE_URL='your-supabase-url'
export SUPABASE_SERVICE_ROLE_KEY='your-service-role-key'

# 导入数据集
python import_datasets.py --input datasets_20.json
```

## SQL 脚本

在 Supabase Dashboard → SQL Editor 中执行：

- `create_indexes.sql`：创建查询性能索引
- `setup_rls.sql`：配置只读公开 / 禁止匿名写入的 RLS 策略
- `test_insert.sql`：测试数据库写入权限

详细验证流程参见 [docs/workflows/data-verification.md](../docs/workflows/data-verification.md)。
