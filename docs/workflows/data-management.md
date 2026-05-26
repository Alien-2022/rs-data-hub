# 数据集管理工作流

## 总览

**流程**: 导出摘要 → Agent 采集（含查重）→ 用户审查 → Agent 导入

- **阶段 0: 导出摘要**
  - 触发: 用户说"准备采集数据集"
  - 执行: `python export_for_dedup.py` → 生成 `scripts/output/dedup_index.json`
  - 作用: 为 Agent 采集提供本地查重依据，避免频繁访问线上数据库
- **阶段 1: Agent 采集**
  - 触发: 用户说"帮我找新的遥感数据集"
  - 执行: 读取 `dedup_index.json` 本地查重 → 搜索论文/GitHub → 输出到 `scripts/output/candidates_work.json`
  - 查重结果:
    - `skipped` — 精确重复，自动跳过（download_url/doi 完全匹配）
    - `suspected_duplicate` — 疑似重复（名称相似、同发布者+同年份+同任务类型）
    - `pending` — 无匹配，待用户审查
- **阶段 2: 用户审查**
  - 打开 `scripts/output/candidates_work.json`
  - 逐条标记: `approved` / `rejected` / `edit`
  - 重点关注 `suspected_duplicate` 条目，自行判断是否重复
- **阶段 3: Agent 导入**
  - 1) 过滤 approved 条目
  - 2) 导入数据库 (`import_datasets.py`)
  - 3) 验证链接 (`verify_links.py`)
  - 4) 更新文档 (`docs/datasets-top20.md`)
  - 5) 更新 CHANGELOG (`.agent/CHANGELOG.md`)
  - 6) 清理 `candidates_work.json`

## 阶段 0: 导出摘要

触发指令："准备采集数据集"

Agent 执行步骤：
1. 运行 `python export_for_dedup.py`
2. 从 Supabase 导出所有数据集的关键字段（name、download_url、doi 等）到 `scripts/output/dedup_index.json`
3. 后续采集时 Agent 读取此文件进行本地查重，无需访问线上数据库

> 此步骤可跳过——如果 `scripts/output/dedup_index.json` 已存在且你认为数据库没有变化。首次采集前必须执行。

## 阶段 1: Agent 采集

触发指令示例：
- "帮我找一些高光谱分类的数据集"
- "搜索 2024 年以后发布的遥感变化检测数据集"
- "找 SAR 目标检测相关的数据集"

Agent 执行步骤：
1. 读取 `scripts/output/dedup_index.json`，加载已有数据集信息
2. 通过论文搜索（arxiv、Google Scholar）、GitHub Awesome 列表、ModelScope、HuggingFace 等渠道搜索
3. 对每条候选数据集进行本地查重：
   - **精确匹配**（download_url / doi 完全相同）→ `_review.status = "skipped"`
   - **模糊匹配**（名称相似度 > 80%，或同发布者+同年份+同任务类型）→ `_review.status = "suspected_duplicate"`
   - **无匹配** → `_review.status = "pending"`
4. 按 `datasets.json` 格式整理数据
5. 写入 `scripts/output/candidates_work.json`

字段规范参考 `scripts/datasets.json`，其中：
- `task_types`：仅限 图像分类 / 目标检测 / 语义分割 / 变化检测 / 实例分割
- `data_modality`：仅限 光学 / SAR / 多光谱 / 高光谱 / LiDAR / 热红外
- `_review.source`：记录采集来源（论文标题、Awesome 列表 URL 等）

## 阶段 2: 用户审查

用户打开 `scripts/output/candidates_work.json`，对每条数据集修改 `_review.status`：

| status | 含义 | 后续操作 |
|--------|------|---------|
| `approved` | 采纳，直接导入 | Agent 会导入数据库 |
| `rejected` | 不需要 | Agent 会跳过 |
| `edit` | 采纳但需修改 | 在 `_review.note` 说明修改内容，Agent 修改后再导入 |
| `skipped` | Agent 已判定为重复 | 用户无需处理，Agent 会跳过 |
| `suspected_duplicate` | 疑似重复，需用户判断 | 改为 `approved` 或 `rejected` |

审查要点：
- 链接是否有效（可让 Agent 预验证）
- 任务类型和模态是否准确
- 图像数量和存储大小是否合理
- 许可证是否允许公开引用

## 阶段 3: Agent 导入

触发指令："处理 candidates_work.json" 或 "导入已审查的数据集"

Agent 执行步骤：
1. 过滤 approved 条目，去除 `_review` 字段，生成临时导入 JSON
2. 导入数据库: `python import_datasets.py --input approved_datasets.json`
3. 验证链接: `python verify_links.py --input approved_datasets.json --format markdown --output new_report.md`
4. 更新文档: 将新增数据集追加到 `docs/datasets-top20.md` 表格
5. 记录日志: 在 `.agent/CHANGELOG.md` 添加条目
6. 清理临时文件: 删除 `scripts/output/candidates_work.json` 和 `scripts/output/approved_datasets.json`

## 定期维护

每隔 2-3 个月，对数据库中已有的数据集进行链接复查：
1. 导出现有数据集链接到临时 JSON
2. 运行: `python verify_links.py --input existing_datasets.json --format markdown --output maintenance_report.md`
3. 处理失效链接（见下方）

失效链接处理：
- `⚠️` 警告（403/5xx）：用浏览器手动验证，确认是否可访问
- `❌` 失效（404）：搜索替代链接或官方镜像，更新数据库

## 相关文件

| 文件 | 类型 | 作用 |
|------|------|------|
| `scripts/export_for_dedup.py` | 持久脚本 | 导出数据库摘要用于本地查重 |
| `scripts/import_datasets.py` | 持久脚本 | 批量导入数据集到 Supabase |
| `scripts/verify_links.py` | 持久脚本 | 批量验证数据集链接 |
| `scripts/batch_update_datasets.py` | 持久脚本 | 批量更新数据库字段 |
| `scripts/datasets.json` | 持久模板 | 数据格式模板（3 条示范） |
| `scripts/candidates.json` | 持久模板 | 采集输出格式参考（占位数据） |
| `scripts/output/dedup_index.json` | 运行时产物 | 数据库摘要快照，采集前生成 |
| `scripts/output/candidates_work.json` | 运行时产物 | Agent 采集输出 / 用户审查输入，导入后清理 |
| `scripts/output/*_report.json` | 运行时产物 | 验证/导入/更新时生成 |
| `docs/datasets-top20.md` | 文档 | 数据集展示 |
