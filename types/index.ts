// 遥感数据集搜索引擎 - TypeScript 类型定义

export interface Dataset {
  id: string;
  name: string;
  description: string;
  task_types: string[];
  data_modality: string;
  domain: string;
  image_count: number | null;
  storage_size: string;
  storage_bytes: number | null;
  publisher: string;
  publish_year: number;
  license: string | null;
  download_url: string;
  paper_url: string | null;
  project_url: string | null;
  doi: string | null;
  sensor_name: string | null;
  spatial_resolution: string | null;
  spectral_bands: number | null;
  created_at: string;
  updated_at: string;
  source_platform: string | null;
  external_id: string | null;
}

export interface Tag {
  id: string;
  name: string;
  category: string;
  created_at: string;
}

export interface DatasetTag {
  dataset_id: string;
  tag_id: string;
  created_at: string;
}

// 搜索筛选条件
export interface SearchFilters {
  query?: string;  // 全文搜索关键词
  task_types?: string[];  // 任务类型
  data_modality?: string[];  // 数据模态
  publish_years?: number[];  // 发布年份
  image_count_range?: {
    min?: number;
    max?: number;
  };
  storage_size_range?: {
    min?: number;  // bytes
    max?: number;  // bytes
  };
  publishers?: string[];  // 发布机构
  sensor_types?: string[];  // 传感器类型
}

// 排序选项
export type SortOption = 'relevance' | 'publish_year' | 'image_count' | 'storage_size' | 'created_at';
export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  by: SortOption;
  order: SortOrder;
}

// 分页参数
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
