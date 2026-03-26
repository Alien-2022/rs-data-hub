# 待办事项清单

## 🔧 Supabase 配置

### RLS 策略配置（重要）

**问题**: Supabase 的 RLS（行级安全）策略限制了 anon key 对 datasets 表的查询

**影响**: 
- ✅ Next.js API 使用 Service Role Key，功能正常
- ⚠️ 直接访问 Supabase REST API 会返回空结果

**解决方案**:

在 Supabase Dashboard → SQL Editor 中执行：

```sql
-- 1. 启用 RLS（如果还没启用）
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;

-- 2. 创建公开读取策略（允许任何人读取）
CREATE POLICY "Public read access" ON datasets
  FOR SELECT
  USING (true);

-- 3. 验证策略
SELECT * FROM pg_policies WHERE tablename = 'datasets';
```

**操作步骤**:
1. 打开 https://supabase.com/dashboard
2. 进入项目 → SQL Editor
3. 粘贴上述 SQL 并执行
4. 验证：在 API 设置页面测试 REST API

**优先级**: 中（不影响当前功能，但建议配置）

---

## 📊 项目进度

### ✅ 已完成
- [x] 数据库搭建（Supabase + 3 张表）
- [x] 数据导入（20 个经典数据集）
- [x] 验证脚本（Python 批量导入工具）
- [x] 首页开发（`/` 页面）
- [x] 搜索页面（`/search` 页面）
- [x] 搜索 API（`/api/search`）
- [x] 筛选 API（`/api/filters`）
- [x] 数据集详情页（`/dataset/[id]`）
- [x] 详情 API（`/api/datasets/[id]`）
- [x] 筛选功能修复（PostgreSQL 数组查询）
- [x] 服务器部署（PM2 管理）

### 📋 待完成
- [ ] UI/UX 优化（简约大气风格）
- [ ] RLS 策略配置
- [ ] 生产环境部署
- [ ] SEO 优化
- [ ] 性能优化

---

## 🎨 UI/UX 优化计划

### 设计风格
- **简约大气**: 留白充足，层次清晰
- **专业感**: 统一配色，精致细节
- **易用性**: 直观导航，快速访问

### 优化内容
1. **配色方案**: 主色调 + 辅助色 + 中性色
2. **字体系统**: 统一字号、字重、行高
3. **组件样式**: 卡片、按钮、表单统一风格
4. **响应式**: 完美适配手机、平板、桌面
5. **动效**: 微妙的过渡动画提升体验

---

**创建时间**: 2026-03-27  
**最后更新**: 2026-03-27
