# 数据集管理工作流

## 总览

**流程**: 用户发起 → Agent 采集 → 用户审查 → Agent 导入

- **阶段 1: Agent 采集**
  - 触发: 用户说"帮我找新的遥感数据集"
  - 执行: 搜索论文 / GitHub / 学术网站
  - 输出: `scripts/candidates.json`
- **阶段 2: 用户审查**
  - 打开 `candidates.json`
  - 逐条标记: `approved` / `rejected` / `edit`
- **阶段 3: Agent 导入**
  - 1) 过滤 approved 条目
  - 2) 导入数据库 (`import_datasets.py`)
  - 3) 验证链接 (`verify_links.py`)
  - 4) 更新文档 (`docs/datasets-top20.md`)
  - 5) 更新 CHANGELOG (`.agent/CHANGELOG.md`)

## 阶段 1: Agent 采集

触发指令示例：
- "帮我找一些高光谱分类的数据集"
- "搜索 2024 年以后发布的遥感变化检测数据集"
- "找 SAR 目标检测相关的数据集"

Agent 执行步骤：
1. 通过论文搜索（arxiv、Google Scholar）、GitHub Awesome 列表、ModelScope、HuggingFace 等渠道搜索
2. 采集信息：名称、描述、任务类型、模态、图像数量、论文链接、下载链接等
3. 按 `datasets.json` 格式整理数据
4. 添加 `_review` 字段（status 默认 `pending`）
5. 写入 `scripts/candidates.json`

字段规范参考 `scripts/datasets.json`，其中：
- `task_types`：仅限 图像分类 / 目标检测 / 语义分割 / 变化检测 / 实例分割
- `data_modality`：仅限 光学 / SAR / 多光谱 / 高光谱 / LiDAR / 热红外
- `_review.source`：记录采集来源（论文标题、Awesome 列表 URL 等）

## 阶段 2: 用户审查

用户打开 `scripts/candidates.json`，对每条数据集修改 `_review.status`：

| status | 含义 | 后续操作 |
|--------|------|---------|
| `approved` | 采纳，直接导入 | Agent 会导入数据库 |
| `rejected` | 不需要 | Agent 会跳过 |
| `edit` | 采纳但需修改 | 在 `_review.note` 说明修改内容，Agent 修改后再导入 |

审查要点：
- 链接是否有效（可让 Agent 预验证）
- 任务类型和模态是否准确
- 是否与数据库中已有数据集重复
- 图像数量和存储大小是否合理
- 许可证是否允许公开引用

## 阶段 3: Agent 导入

触发指令："处理 candidates.json" 或 "导入已审查的数据集"

Agent 执行步骤：
1. 过滤 approved 条目，去除 `_review` 字段，生成临时导入 JSON
2. 导入数据库: `python import_datasets.py --input approved_datasets.json`
3. 验证链接: `python verify_links.py --input approved_datasets.json --format markdown --output new_report.md`
4. 更新文档: 将新增数据集追加到 `docs/datasets-top20.md` 表格
5. 记录日志: 在 `.agent/CHANGELOG.md` 添加条目
6. 清理临时文件: 删除 approved_datasets.json 等临时产物

## 定期维护

每隔 2-3 个月，对数据库中已有的数据集进行链接复查：
1. 导出现有数据集链接到临时 JSON
2. 运行: `python verify_links.py --input existing_datasets.json --format markdown --output maintenance_report.md`
3. 处理失效链接（见下方）

失效链接处理：
- `⚠️` 警告（403/5xx）：用浏览器手动验证，确认是否可访问
- `❌` 失效（404）：搜索替代链接或官方镜像，更新数据库

## 相关文件

| 文件 | 作用 |
|------|------|
| `scripts/datasets.json` | 数据格式模板（3 条示范） |
| `scripts/candidates.json` | Agent 采集输出 / 用户审查输入 |
| `scripts/import_datasets.py` | 批量导入工具 |
| `scripts/verify_links.py` | 链接验证工具 |
| `scripts/batch_update_datasets.py` | 批量更新字段工具 |
| `docs/datasets-top20.md` | 数据集展示文档 |
