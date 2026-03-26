# 链接验证工具使用说明

## 📦 工具位置

```
remote-sensing-search/scripts/
├── verify_links.py          # 主验证脚本
└── datasets_sample.json     # 示例数据集 (20 个)
```

---

## 🚀 快速开始

### 1. 验证单个链接

```bash
cd /home/admin/openclaw/workspace/remote-sensing-search/scripts

python verify_links.py --url https://arxiv.org/abs/1909.00133
```

**输出**:
```
正在验证：https://arxiv.org/abs/1909.00133
状态：✅
HTTP 状态码：200
响应时间：0.523s
```

---

### 2. 批量验证 (JSON 输入)

```bash
python verify_links.py --input datasets_sample.json --output report.json
```

**输出**:
```
正在加载数据集：datasets_sample.json
共 38 个链接待验证
并发线程数：10
--------------------------------------------------

验证完成！
总耗时：12.34 秒
平均速度：0.32 秒/链接
--------------------------------------------------
✅ 有效：35 (92.1%)
⚠️ 警告：2 (5.3%)
❌ 失效：1 (2.6%)
--------------------------------------------------

⚠️ 需要人工处理的链接:
  - EuroSAT - 论文：https://ieeexplore.ieee.org/document/8736719
    状态：⚠️, 错误：403 Forbidden (可能需浏览器验证)
  - UDD - 论文：https://link.springer.com/chapter/10.1007/978-3-030-03398-9_30
    状态：❌, 错误：404 Client Error
```

---

### 3. 生成 Markdown 报告

```bash
python verify_links.py --input datasets_sample.json --format markdown --output report.md
```

**生成报告示例** (`report.md`):
```markdown
# 链接验证报告

**验证时间**: 2026-03-27 02:15:00
**总计**: 38 个链接

## 验证统计

| 状态 | 数量 | 占比 |
|------|------|------|
| ✅ 有效 | 35 | 92.1% |
| ⚠️ 警告 | 2 | 5.3% |
| ❌ 失效 | 1 | 2.6% |

## 详细结果

### ✅ 有效 (35 个)

- **NWPU-RESISC45 - 论文**
  - 链接：https://arxiv.org/abs/1703.00121
  - HTTP 状态码：200
  - 响应时间：0.423s

...

### ⚠️ 警告 (2 个)

- **EuroSAT - 论文**
  - 链接：https://ieeexplore.ieee.org/document/8736719
  - HTTP 状态码：403
  - 响应时间：1.234s
  - 错误：403 Forbidden (可能需浏览器验证)

### ❌ 失效 (1 个)

- **UDD - 论文**
  - 链接：https://link.springer.com/chapter/10.1007/978-3-030-03398-9_30
  - HTTP 状态码：404
  - 响应时间：0.856s
  - 错误：404 Client Error
```

---

## ⚙️ 高级选项

### 调整超时时间

```bash
# 设置 30 秒超时 (默认 10 秒)
python verify_links.py --input datasets_sample.json --timeout 30
```

### 调整并发数

```bash
# 设置 20 个并发线程 (默认 10 个)
python verify_links.py --input datasets_sample.json --workers 20
```

### 查看完整帮助

```bash
python verify_links.py --help
```

---

## 📊 输出格式说明

### JSON 报告结构

```json
[
  {
    "name": "DIOR - 论文",
    "url": "https://arxiv.org/abs/1909.00133",
    "status": "✅",
    "http_code": 200,
    "error": null,
    "verified_at": "2026-03-27T02:15:00.123456",
    "response_time": 0.523
  },
  {
    "name": "EuroSAT - 论文",
    "url": "https://ieeexplore.ieee.org/document/8736719",
    "status": "⚠️",
    "http_code": 403,
    "error": "403 Forbidden (可能需浏览器验证)",
    "verified_at": "2026-03-27T02:15:01.234567",
    "response_time": 1.234
  }
]
```

### 状态说明

| 状态 | 说明 | 处理方式 |
|------|------|---------|
| **✅** | HTTP 200-399，链接有效 | 直接记录 |
| **⚠️** | HTTP 403/5xx，需人工确认 | 用浏览器验证 |
| **❌** | HTTP 404/连接失败，可能失效 | 找替代链接 |

---

## 🔄 定期复查流程

### 1. 创建已验证链接列表

```json
// verified_links.json
[
  {
    "name": "DIOR - 论文",
    "url": "https://arxiv.org/abs/1909.00133",
    "last_verified": "2026-03-27",
    "status": "✅"
  },
  ...
]
```

### 2. 设置定期任务 (cron)

```bash
# 编辑 crontab
crontab -e

# 添加每周日凌晨 2 点自动验证
0 2 * * 0 cd /home/admin/openclaw/workspace/remote-sensing-search/scripts && python verify_links.py --input verified_links.json --output weekly_report.json --format markdown
```

### 3. 查看复查报告

每周查看 `weekly_report.md`，发现失效链接及时处理。

---

## 🛠️ 与工作流集成

### 方案 1: 脚本 + 人工处理 (推荐)

```
1. 运行验证脚本 (10 秒)
   ↓
2. 查看报告，标记失效链接
   ↓
3. 人工处理失效链接 (browser 工具)
   ↓
4. 更新最终文档
```

### 方案 2: 完全自动化 (未来)

```python
# 集成到 Next.js API
# app/api/verify/route.ts
```

---

## 📝 实际案例

### 案例 1: 验证 20 个数据集

```bash
# 准备数据集 JSON (参考 datasets_sample.json)
# 包含 20 个数据集，共 40 个链接 (论文 + 下载)

# 运行验证
python verify_links.py --input datasets_20.json --output report_20.md --format markdown

# 输出:
# 总耗时：15.23 秒
# 平均速度：0.38 秒/链接
# ✅ 有效：38 (95%)
# ⚠️ 警告：2 (5%)
# ❌ 失效：0 (0%)
```

### 案例 2: 定期复查

```bash
# 每月 1 号复查所有链接
python verify_links.py --input all_datasets.json --output monthly_check.md --format markdown

# 对比上次报告，发现:
# - 1 个链接从 ✅ 变为 ❌ (失效)
# - 立即用 browser 工具找替代链接
# - 更新文档
```

---

## ⚠️ 注意事项

### 1. 反爬网站

某些网站 (IEEE、ScienceDirect) 可能返回 403:
```
状态：⚠️
错误：403 Forbidden (可能需浏览器验证)
```

**处理方式**:
- 用 browser 工具手动验证
- 优先找 arxiv 替代链接

### 2. 超时处理

某些网站响应慢，可增加超时时间:
```bash
python verify_links.py --input datasets.json --timeout 30
```

### 3. 并发限制

不要设置过高并发 (建议 ≤20)，避免被目标网站封禁。

---

## 📈 效率对比

| 验证方式 | 20 个数据集 (40 链接) | 100 个数据集 (200 链接) |
|---------|---------------------|----------------------|
| **手动 (browser)** | ~20 分钟 | ~100 分钟 |
| **脚本验证** | ~15 秒 | ~60 秒 |
| **效率提升** | **80 倍** | **100 倍** |

---

## 🔄 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|---------|
| v1.0 | 2026-03-27 | 初始版本，支持批量验证 |

---

**维护人**: 小龙虾团队  
**最后更新**: 2026-03-27
