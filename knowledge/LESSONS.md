# 经验教训

> 项目实践中积累的经验，按类别组织。遇到新坑时追加条目。

---

## 链接验证

- **arxiv 优先**：遥感领域 80%+ 论文有 arxiv 预印本，访问稳定无付费墙
- **web_fetch 失败 ≠ 链接失效**：ScienceDirect/IEEE 有反爬虫机制，需浏览器二次验证
- **GitHub 404 ≠ 数据集消失**：先搜作者新仓库/镜像，再联系作者。案例：SSDD 旧仓库 → `Official-SSDD`
- **大学官网容易失效**：网站重构、毕业生页面清理。优先用 Kaggle/NODA 等稳定平台镜像
- **付费墙处理**：IEEE/ScienceDirect 论文 → 搜 arxiv 或 ResearchGate，成功率 80%+

## 数据库

- **Supabase 免费版 anon key 和 service_role key 可能显示相同**：需点击 Reveal 按钮查看真实 service_role key。新版 key（Publishable/Secret）已替代旧版
- **RLS 必须配置**：不配置 RLS，任何人可通过 API 修改数据
- **estimated count 够用**：比 exact 快 10-100 倍，误差 <5%，对搜索场景完全可接受
- **GIN 索引提升数组查询**：`task_types` 字段用 GIN 索引，筛选性能提升 5-10 倍

## 前端

- **React Query 缓存**：staleTime 5 分钟 + gcTime 30 分钟，减少 50-70% 重复请求
- **翻页用 placeholderData**：`placeholderData: (prev) => prev` 保持旧数据，避免翻页闪烁
- **预加载下一页**：`queryClient.prefetchQuery` 在后台静默加载，用户点击下一页时立即显示

## 部署

- **Vercel 环境变量改了要重新部署**：环境变量变更不会自动触发重新部署
- **不要用 vercel.json 管理环境变量**：直接在 Vercel Dashboard 配置 Plain Text 类型
- **GitHub 推送用 HTTPS + Token**：SSH 可能被拒绝

## 分类体系

- **任务类型 14→5**：图像分类/目标检测/语义分割/变化检测/实例分割（符合 CVPR/IGARSS 标准）
- **数据模态 9→5**：光学/SAR/多光谱/高光谱/LiDAR（按传感器分类，不按平台分类）
- 子分类（如旋转目标检测、细粒度检测）未来可通过 `tags` 字段实现

## 安全

- **输入验证用白名单**：`validate.ts` 中 8 个验证函数，不用黑名单过滤
- **错误信息脱敏**：服务端记录详细日志，客户端只返回通用错误信息
- **速率限制开发模式自动跳过**：未配置 Upstash 时，开发环境返回假限制器，不阻断开发
