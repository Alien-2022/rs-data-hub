// 输入验证工具 - 严格验证 API 查询参数

// 验证搜索查询
export const validateSearchQuery = (query: string | null): string => {
  if (!query) return '';
  
  // 限制长度（最多 200 字符）
  if (query.length > 200) {
    throw new Error('查询语句过长，请限制在 200 字符以内');
  }
  
  // 移除潜在危险字符（HTML 标签、特殊符号）
  const sanitized = query
    .replace(/[<>\"'&]/g, '') // 移除 HTML 相关字符
    .replace(/[\u0000-\u001F\u007F]/g, '') // 移除控制字符
    .trim();
  
  // 验证是否只剩下有效字符（中文、英文、数字、常见标点）
  if (!/^[\u4e00-\u9fa5a-zA-Z0-9\s\-\_\.\,\?\!\(\)]+$/.test(sanitized) && sanitized.length > 0) {
    throw new Error('查询包含无效字符');
  }
  
  return sanitized;
};

// 验证分页参数
export const validatePagination = (
  page: string | null,
  pageSize: string | null
): { page: number; pageSize: number } => {
  const pageNum = page ? parseInt(page, 10) : 1;
  const sizeNum = pageSize ? parseInt(pageSize, 10) : 10;
  
  // 验证页码
  if (isNaN(pageNum) || pageNum < 1) {
    throw new Error('页码必须大于等于 1');
  }
  if (pageNum > 1000) {
    throw new Error('页码过大，最多支持 1000 页');
  }
  
  // 验证每页数量
  if (isNaN(sizeNum) || sizeNum < 1) {
    throw new Error('每页数量必须大于等于 1');
  }
  if (sizeNum > 100) {
    throw new Error('每页数量最多为 100');
  }
  
  return {
    page: pageNum,
    pageSize: sizeNum,
  };
};

// 验证排序参数（白名单）
const ALLOWED_SORT_FIELDS = ['name', 'image_count', 'publish_year', 'created_at', 'relevance'] as const;
type AllowedSortField = typeof ALLOWED_SORT_FIELDS[number];

export const validateSortParams = (
  sortBy: string | null,
  sortOrder: string | null
): { sortBy: AllowedSortField; sortOrder: 'asc' | 'desc' } => {
  // 验证排序字段
  const safeSortBy = sortBy && ALLOWED_SORT_FIELDS.includes(sortBy as AllowedSortField)
    ? sortBy as AllowedSortField
    : 'created_at'; // 默认按创建时间排序
  
  // 验证排序方向
  const safeSortOrder = sortOrder === 'asc' ? 'asc' : 'desc'; // 默认降序
  
  return {
    sortBy: safeSortBy,
    sortOrder: safeSortOrder,
  };
};

// 验证任务类型（白名单）
const ALLOWED_TASK_TYPES = [
  '图像分类',
  '目标检测',
  '语义分割',
  '变化检测',
  '实例分割',
] as const;

export const validateTaskTypes = (taskTypes: string[]): string[] => {
  if (taskTypes.length === 0) return [];
  
  // 限制最多选择 5 个类型
  if (taskTypes.length > 5) {
    throw new Error('最多只能选择 5 个任务类型');
  }
  
  // 验证每个类型是否在白名单中
  const validTypes = taskTypes.filter(type => 
    ALLOWED_TASK_TYPES.includes(type as typeof ALLOWED_TASK_TYPES[number])
  );
  
  if (validTypes.length !== taskTypes.length) {
    throw new Error('包含无效的任务类型');
  }
  
  return validTypes;
};

// 验证数据模态（白名单）
const ALLOWED_MODALITIES = [
  '光学',
  'SAR',
  '多光谱',
  '高光谱',
  'LiDAR',
] as const;

export const validateModality = (modalities: string[]): string[] => {
  if (modalities.length === 0) return [];
  
  // 限制最多选择 5 个模态
  if (modalities.length > 5) {
    throw new Error('最多只能选择 5 个数据模态');
  }
  
  // 验证每个模态是否在白名单中
  const validModalities = modalities.filter(mod => 
    ALLOWED_MODALITIES.includes(mod as typeof ALLOWED_MODALITIES[number])
  );
  
  if (validModalities.length !== modalities.length) {
    throw new Error('包含无效的数据模态');
  }
  
  return validModalities;
};

// 验证年份
export const validateYear = (year: string | null): number | null => {
  if (!year) return null;
  
  const yearNum = parseInt(year, 10);
  const currentYear = new Date().getFullYear();
  
  if (isNaN(yearNum)) {
    throw new Error('年份必须是数字');
  }
  if (yearNum < 1990 || yearNum > currentYear + 1) {
    throw new Error(`年份必须在 1990-${currentYear + 1} 之间`);
  }
  
  return yearNum;
};

// 验证图像数量范围
export const validateImageCountRange = (
  minImages: string | null,
  maxImages: string | null
): { minImages: number | null; maxImages: number | null } => {
  let min: number | null = null;
  let max: number | null = null;
  
  if (minImages) {
    const minNum = parseInt(minImages, 10);
    if (isNaN(minNum) || minNum < 0) {
      throw new Error('最小图像数量必须是非负整数');
    }
    if (minNum > 1000000) {
      throw new Error('最小图像数量过大');
    }
    min = minNum;
  }
  
  if (maxImages) {
    const maxNum = parseInt(maxImages, 10);
    if (isNaN(maxNum) || maxNum < 0) {
      throw new Error('最大图像数量必须是非负整数');
    }
    if (maxNum > 1000000) {
      throw new Error('最大图像数量过大');
    }
    max = maxNum;
  }
  
  // 验证范围合理性
  if (min !== null && max !== null && min > max) {
    throw new Error('最小图像数量不能大于最大图像数量');
  }
  
  return { minImages: min, maxImages: max };
};

// 验证数据集 ID
export const validateDatasetId = (id: string | null): string => {
  if (!id) {
    throw new Error('数据集 ID 不能为空');
  }
  
  // UUID 格式验证（Supabase 默认使用 UUID）
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw new Error('无效的数据集 ID 格式');
  }
  
  return id;
};
