import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

interface Dataset {
  id: string;
  name: string;
  description: string;
  task_types: string[];
  data_modality: string;
  image_count: number | null;
  storage_size: string;
  publisher: string;
  publish_year: number;
  paper_url: string | null;
  download_url: string;
}

interface SearchResponse {
  data: Dataset[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

interface SearchFilters {
  query: string;
  taskTypes: string[];
  modalities: string[];
  year: string;
}

// 获取数据集的 API 调用函数
async function fetchDatasets(
  page: number,
  pageSize: number,
  filters: SearchFilters
): Promise<SearchResponse> {
  const params = new URLSearchParams();
  params.set('page', page.toString());
  params.set('page_size', pageSize.toString());
  
  if (filters.query) params.set('q', filters.query);
  filters.taskTypes.forEach(type => params.append('task_type', type));
  filters.modalities.forEach(mod => params.append('modality', mod));
  if (filters.year) params.set('year', filters.year);
  
  const res = await fetch(`/api/search?${params}`);
  
  if (!res.ok) {
    throw new Error('搜索失败');
  }
  
  return res.json();
}

// 自定义 Hook：获取数据集列表
export function useDatasets(
  page: number,
  pageSize: number,
  filters: SearchFilters
) {
  const queryKey = ['datasets', page, pageSize, filters];
  
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching, // 包括初始加载和后台刷新
  } = useQuery({
    queryKey,
    queryFn: () => fetchDatasets(page, pageSize, filters),
    // 保持上一页数据时显示 loading
    placeholderData: (previousData) => previousData,
  });
  
  return {
    datasets: data?.data || [],
    pagination: data?.pagination,
    isLoading, // 首次加载
    isFetching, // 任何加载状态（包括后台刷新）
    isError,
    error,
    refetch,
  };
}

// 自定义 Hook：预加载下一页
export function usePrefetchNextPage(
  page: number,
  pageSize: number,
  filters: SearchFilters,
  totalPages: number
) {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    // 如果还有下一页，预加载
    if (page < totalPages) {
      const nextPage = page + 1;
      const nextQueryKey = ['datasets', nextPage, pageSize, filters];
      
      // 如果下一页数据不存在或未过期，预加载
      queryClient.prefetchQuery({
        queryKey: nextQueryKey,
        queryFn: () => fetchDatasets(nextPage, pageSize, filters),
      });
    }
  }, [page, pageSize, filters, totalPages, queryClient]);
}

// 自定义 Hook：获取筛选选项
export function useFilterOptions() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['filterOptions'],
    queryFn: async () => {
      const res = await fetch('/api/filters');
      if (!res.ok) {
        throw new Error('获取筛选选项失败');
      }
      return res.json();
    },
    staleTime: 10 * 60 * 1000, // 10 分钟新鲜时间
  });
  
  return {
    filterOptions: data || { taskTypes: [], modalities: [], years: [] },
    isLoading,
    isError,
  };
}
