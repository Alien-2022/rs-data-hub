-- 遥感数据集搜索引擎 - 数据库 Schema
-- 创建时间：2026-03-26

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 数据集主表
-- =============================================
CREATE TABLE datasets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- 基础信息（必填）
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  task_types TEXT[] NOT NULL,  -- 任务类型数组
  data_modality TEXT NOT NULL,  -- 数据模态：光学/SAR/多光谱/高光谱/LiDAR/热红外
  domain TEXT NOT NULL DEFAULT 'CV',  -- 领域
  
  -- 规模信息（必填）
  image_count INTEGER,  -- 图像数量
  storage_size TEXT NOT NULL,  -- 存储大小（人类可读，如 "7.1GB"）
  storage_bytes BIGINT,  -- 存储字节数（用于排序）
  
  -- 来源信息（必填）
  publisher TEXT NOT NULL,  -- 发布机构
  publish_year INTEGER NOT NULL,  -- 发布年份
  license TEXT,  -- 许可证
  download_url TEXT NOT NULL,  -- 下载链接
  
  -- 学术资源（可选）
  paper_url TEXT,  -- 论文链接
  project_url TEXT,  -- 项目首页
  doi TEXT,  -- DOI
  
  -- 遥感特有字段（可选）
  sensor_name TEXT,  -- 传感器/卫星名称
  spatial_resolution TEXT,  -- 空间分辨率
  spectral_bands INTEGER,  -- 波段数量
  
  -- 元数据
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  source_platform TEXT,  -- 来源平台：OpenDataLab/Kaggle/PapersWithCode 等
  external_id TEXT  -- 外部平台 ID（用于去重和更新）
);

-- 创建索引
CREATE INDEX idx_datasets_name ON datasets USING gin(name gin_trgm_ops);
CREATE INDEX idx_datasets_description ON datasets USING gin(description gin_trgm_ops);
CREATE INDEX idx_datasets_task_types ON datasets USING gin(task_types);
CREATE INDEX idx_datasets_data_modality ON datasets(data_modality);
CREATE INDEX idx_datasets_publisher ON datasets(publisher);
CREATE INDEX idx_datasets_publish_year ON datasets(publish_year);
CREATE INDEX idx_datasets_storage_bytes ON datasets(storage_bytes);
CREATE INDEX idx_datasets_created_at ON datasets(created_at DESC);

-- 启用全文搜索扩展
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- =============================================
-- 标签表（用于筛选）
-- =============================================
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,  -- 标签分类：task_type, domain, sensor, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tags_category ON tags(category);
CREATE INDEX idx_tags_name ON tags(name);

-- =============================================
-- 数据集 - 标签关联表
-- =============================================
CREATE TABLE dataset_tags (
  dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (dataset_id, tag_id)
);

CREATE INDEX idx_dataset_tags_dataset_id ON dataset_tags(dataset_id);
CREATE INDEX idx_dataset_tags_tag_id ON dataset_tags(tag_id);

-- =============================================
-- 预置标签数据（任务类型）
-- =============================================
INSERT INTO tags (name, category) VALUES
  -- 任务类型
  ('目标检测', 'task_type'),
  ('旋转目标检测', 'task_type'),
  ('语义分割', 'task_type'),
  ('实例分割', 'task_type'),
  ('图像分类', 'task_type'),
  ('场景分类', 'task_type'),
  ('变化检测', 'task_type'),
  ('超分辨率', 'task_type'),
  ('云去除', 'task_type'),
  ('显著性检测', 'task_type'),
  ('地物分类', 'task_type'),
  ('道路提取', 'task_type'),
  ('建筑物提取', 'task_type'),
  
  -- 数据模态
  ('光学图像', 'data_modality'),
  ('SAR 图像', 'data_modality'),
  ('多光谱', 'data_modality'),
  ('高光谱', 'data_modality'),
  ('LiDAR', 'data_modality'),
  ('热红外', 'data_modality'),
  
  -- 领域
  ('CV', 'domain'),
  ('遥感', 'domain');

-- =============================================
-- 更新触发器（自动更新 updated_at）
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_datasets_updated_at
  BEFORE UPDATE ON datasets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 行级安全策略（RLS）- 可选，根据需求启用
-- =============================================
-- ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public read access" ON datasets FOR SELECT USING (true);
-- CREATE POLICY "Admin write access" ON datasets FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
