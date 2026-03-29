-- 遥感数据集搜索引擎 - 数据库索引优化脚本
-- 执行时间：2026-03-29
-- 目的：提升搜索和筛选查询性能（预计提升 5-10 倍）

-- ========================================
-- 1. 任务类型数组索引（GIN 索引）
-- 用于：task_type 筛选
-- ========================================
CREATE INDEX IF NOT EXISTS idx_datasets_task_types 
ON datasets USING GIN(task_types);

-- ========================================
-- 2. 数据模态索引
-- 用于：modality 筛选
-- ========================================
CREATE INDEX IF NOT EXISTS idx_datasets_data_modality 
ON datasets(data_modality);

-- ========================================
-- 3. 发布年份索引
-- 用于：year 筛选和排序
-- ========================================
CREATE INDEX IF NOT EXISTS idx_datasets_publish_year 
ON datasets(publish_year);

-- ========================================
-- 4. 图像数量索引
-- 用于：min_images/max_images 范围查询
-- ========================================
CREATE INDEX IF NOT EXISTS idx_datasets_image_count 
ON datasets(image_count);

-- ========================================
-- 5. 组合索引（常用筛选组合）
-- 用于：任务类型 + 数据模态的复合筛选
-- ========================================
CREATE INDEX IF NOT EXISTS idx_datasets_task_modality 
ON datasets(data_modality, publish_year DESC);

-- ========================================
-- 6. 全文搜索索引（可选优化）
-- 用于：名称和描述的全文搜索
-- 注意：当前使用 ILIKE，性能尚可；如需更强全文搜索可启用
-- ========================================
-- ALTER TABLE datasets ADD COLUMN search_vector tsvector;
-- UPDATE datasets SET search_vector = to_tsvector('simple', name || ' ' || description);
-- CREATE INDEX IF NOT EXISTS idx_datasets_search_vector 
-- ON datasets USING GIN(search_vector);
-- CREATE TRIGGER datasets_search_vector_update
--   BEFORE INSERT OR UPDATE ON datasets
--   FOR EACH ROW EXECUTE FUNCTION tsvector_update_trigger(
--     search_vector, 'simple', name, description
--   );

-- ========================================
-- 验证索引创建
-- ========================================
SELECT 
  indexname,
  tablename,
  indexdef
FROM pg_indexes
WHERE tablename = 'datasets'
ORDER BY indexname;

-- ========================================
-- 性能测试（可选）
-- ========================================
-- EXPLAIN ANALYZE SELECT * FROM datasets WHERE task_types @> ARRAY['目标检测'];
-- EXPLAIN ANALYZE SELECT * FROM datasets WHERE data_modality = '光学图像';
-- EXPLAIN ANALYZE SELECT COUNT(*) FROM datasets;
