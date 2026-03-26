-- 测试数据插入脚本
-- 用于验证数据库连接和表结构
-- 执行方式：在 Supabase SQL Editor 中运行

-- 插入 3 个测试数据集

-- 1. NWPU-RESISC45 (场景分类)
INSERT INTO datasets (
  name, description, task_types, data_modality, domain,
  image_count, storage_size, storage_bytes,
  publisher, publish_year, license, download_url,
  paper_url, project_url, doi,
  sensor_name, spatial_resolution, spectral_bands,
  source_platform, external_id
) VALUES (
  'NWPU-RESISC45',
  '西北工业大学发布的大规模遥感图像场景分类基准数据集，包含 45 个场景类别',
  ARRAY['场景分类', '图像分类'],
  '光学',
  'CV',
  31500,
  '2.5GB',
  2684354560,
  '西北工业大学',
  2017,
  '公开学术研究',
  'https://www.modelscope.cn/datasets/timm/resisc45',
  'https://arxiv.org/abs/1703.00121',
  'https://github.com/etalab/RESISC45',
  '10.1109/JSTARS.2017.2696777',
  NULL,
  NULL,
  NULL,
  'manual',
  'nwpu-resisc45'
);

-- 2. DOTA v2.0 (目标检测)
INSERT INTO datasets (
  name, description, task_types, data_modality, domain,
  image_count, storage_size, storage_bytes,
  publisher, publish_year, license, download_url,
  paper_url, project_url, doi,
  sensor_name, spatial_resolution, spectral_bands,
  source_platform, external_id
) VALUES (
  'DOTA v2.0',
  '大规模航拍图像目标检测数据集，包含 18 类 oriented-bounding-box 标注',
  ARRAY['目标检测', '旋转目标检测'],
  '光学/航拍',
  'CV',
  11268,
  '50GB',
  53687091200,
  '武汉大学 (LIESMARS)',
  2021,
  '公开学术研究',
  'https://captain-whu.github.io/DOTA/dataset.html',
  'https://arxiv.org/abs/2102.12219',
  'https://captain-whu.github.io/DOTA/index.html',
  NULL,
  NULL,
  '0.3m ~ 1.5m',
  NULL,
  'manual',
  'dota-v2'
);

-- 3. DIOR (目标检测)
INSERT INTO datasets (
  name, description, task_types, data_modality, domain,
  image_count, storage_size, storage_bytes,
  publisher, publish_year, license, download_url,
  paper_url, project_url, doi,
  sensor_name, spatial_resolution, spectral_bands,
  source_platform, external_id
) VALUES (
  'DIOR',
  '大规模光学遥感图像目标检测基准数据集，包含 20 个目标类别',
  ARRAY['目标检测'],
  '光学',
  'CV',
  23463,
  '15GB',
  16106127360,
  '西北工业大学',
  2020,
  '公开学术研究',
  'https://gcheng-nwpu.github.io/',
  'https://arxiv.org/abs/1909.00133',
  'https://gcheng-nwpu.github.io/',
  '10.1016/j.isprsjprs.2020.03.009',
  NULL,
  NULL,
  NULL,
  'manual',
  'dior'
);

-- 验证插入结果
SELECT name, task_types, image_count, publisher 
FROM datasets 
ORDER BY created_at DESC 
LIMIT 10;
