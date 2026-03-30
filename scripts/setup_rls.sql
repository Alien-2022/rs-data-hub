-- =====================================================
-- Supabase RLS (Row Level Security) 配置脚本
-- =====================================================
-- 用途：启用行级安全，限制未授权访问
-- 执行方式：在 Supabase Dashboard → SQL Editor 中执行
-- 执行时间：约 1 分钟
-- =====================================================

-- =====================================================
-- 1. 启用 RLS
-- =====================================================
-- 对 datasets 表启用行级安全
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. 创建公开只读策略
-- =====================================================
-- 允许任何人（包括匿名用户）读取数据集
-- 这是公开 API，所以允许所有人 SELECT
CREATE POLICY "datasets_public_read" ON datasets
  FOR SELECT
  USING (true);

-- =====================================================
-- 3. 禁止匿名写入
-- =====================================================
-- 禁止匿名用户插入数据
CREATE POLICY "datasets_no_anon_insert" ON datasets
  FOR INSERT
  WITH CHECK (false);

-- 禁止匿名用户更新数据
CREATE POLICY "datasets_no_anon_update" ON datasets
  FOR UPDATE
  USING (false);

-- 禁止匿名用户删除数据
CREATE POLICY "datasets_no_anon_delete" ON datasets
  FOR DELETE
  USING (false);

-- =====================================================
-- 4. （可选）创建管理员策略
-- =====================================================
-- 如果你有 authenticated 用户角色，可以创建管理员策略
-- 注意：需要先创建 admin 角色或在 auth.users 中标记管理员

-- 示例：允许 authenticated 用户中的管理员进行所有操作
-- 取消下面注释并使用前，请确保你有 admin 角色或类似机制
/*
CREATE POLICY "datasets_admin_all" ON datasets
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );
*/

-- =====================================================
-- 5. 验证策略
-- =====================================================
-- 查看已创建的策略
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'datasets';

-- =====================================================
-- 6. 测试 RLS（重要！）
-- =====================================================
-- 在 Supabase Dashboard → SQL Editor 中测试：

-- 测试 1: 匿名读取应该成功
/*
SELECT count(*) FROM datasets;
-- 预期：返回数据集总数（如 20）
*/

-- 测试 2: 匿名插入应该失败
/*
INSERT INTO datasets (name, description) 
VALUES ('Test', 'Test dataset');
-- 预期：错误 "new row violates row-level security policy"
*/

-- =====================================================
-- 7. 回滚脚本（如果需要撤销）
-- =====================================================
/*
-- 删除所有策略
DROP POLICY IF EXISTS "datasets_public_read" ON datasets;
DROP POLICY IF EXISTS "datasets_no_anon_insert" ON datasets;
DROP POLICY IF EXISTS "datasets_no_anon_update" ON datasets;
DROP POLICY IF EXISTS "datasets_no_anon_delete" ON datasets;
DROP POLICY IF EXISTS "datasets_admin_all" ON datasets;

-- 禁用 RLS
ALTER TABLE datasets DISABLE ROW LEVEL SECURITY;
*/

-- =====================================================
-- 执行完成
-- =====================================================
-- 如果看到 "CREATE POLICY" 和 "ALTER TABLE" 成功消息，说明配置完成
-- 现在你的 datasets 表已经受到 RLS 保护：
-- ✅ 公开可读（任何人可以查询）
-- ✅ 禁止匿名写入（防止未授权修改）
-- ✅ 需要 Service Role Key 才能管理数据
