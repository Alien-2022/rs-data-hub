# 数据验证流程

## 验证优先级

### 论文链接

优先级：**arxiv > 期刊官网 > IEEE/ScienceDirect > GitHub > 个人页面**

- arxiv 优先搜索：`[数据集名称] + arxiv`（成功率 90%+）
- 付费墙论文（IEEE/ScienceDirect）先找 arxiv 预印本
- 期刊官网作为引导页面即可，不要求直接下载 PDF

### 下载链接

优先级：**官方平台（ISPRS/NODA）> 知名托管（Kaggle/GitHub/HuggingFace）> 大学官网 > 个人页面**

- GitHub 仓库需确认活跃度（最后更新 <1 年，Star >50）
- 重要数据集记录主下载源 + 备用下载源

## 验证流程

```
1. 搜索论文（arxiv 优先）→ 2. 浏览器验证论文链接
→ 3. 搜索下载链接（官方平台优先）→ 4. 验证下载链接
→ 5. 记录状态（✅/⚠️/❌）+ 验证时间 → 6. 更新数据集清单
```

## 验证工具

| 工具 | 适用场景 | 可靠性 |
|------|---------|--------|
| 浏览器手动访问 | 核心链接、少量验证 | 最高 |
| `curl -o /dev/null -s -w "%{http_code}\n" URL` | 批量检查 HTTP 状态码 | 高 |
| web_fetch 工具 | 提取页面内容 | 辅助（有反爬限制） |

## 检查清单

### 论文链接
- [ ] HTTP 200，页面正常加载
- [ ] 包含论文标题和作者
- [ ] 与目标数据集相关
- [ ] 记录 DOI（如有）

### 下载链接
- [ ] 链接可访问
- [ ] 有明确下载方式或申请流程
- [ ] 确认数据规模（图像数量、存储大小）
- [ ] 确认许可证类型

## 自动化验证脚本

位于 `scripts/verify_links.py`，支持批量验证：

```bash
python scripts/verify_links.py --input datasets.json --output report.json
python scripts/verify_links.py --input datasets.json --format markdown --output report.md
```

输出状态：✅ 有效（HTTP 200-399）| ⚠️ 需人工确认（403/5xx）| ❌ 失效（404/连接失败）

## 定期复查

建议每月复查一次链接有效性，可用 cron 或 Vercel Cron Jobs 自动触发验证脚本。
