import { QueryClient } from '@tanstack/react-query';

// 创建全局 QueryClient 实例
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 数据新鲜度：5 分钟内认为数据是新鲜的，不会重新请求
      staleTime: 5 * 60 * 1000,
      
      // 缓存时间：30 分钟后清除缓存
      gcTime: 30 * 60 * 1000,
      
      // 重试次数：失败后重试 2 次
      retry: 2,
      
      // 重试延迟：指数退避
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // 窗口聚焦时不自动重新获取（节省流量）
      refetchOnWindowFocus: false,
    },
  },
});
