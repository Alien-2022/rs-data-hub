// 速率限制工具 - 使用 Upstash Redis
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// 从环境变量初始化 Redis 和速率限制器
// 需要在 .env.local 中配置:
// UPSTASH_REDIS_REST_URL=your-redis-url
// UPSTASH_REDIS_REST_TOKEN=your-redis-token

let ratelimit: Ratelimit | null = null;

// 懒加载初始化（避免未配置时报错）
export const getRatelimit = (): Ratelimit => {
  if (!ratelimit) {
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    
    if (!redisUrl || !redisToken) {
      // 开发环境没有配置时，返回一个永远成功的假限制器
      if (process.env.NODE_ENV === 'development') {
        console.warn('[RateLimit] Upstash 未配置，开发模式下跳过速率限制');
        return {
          limit: async () => ({ success: true, limit: { remaining: 999 }, reset: 0 }),
        } as unknown as Ratelimit;
      }
      throw new Error('Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN');
    }

    const redis = new Redis({
      url: redisUrl,
      token: redisToken,
    });

    // 配置：20 次请求 / 10 秒（滑动窗口）
    // 防抖后正常搜索应该远低于此限制
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, '10 s'),
      analytics: true,
      prefix: 'rs-hub', // 键前缀，避免与其他应用冲突
    });
  }
  
  return ratelimit;
};

// 速率限制中间件函数
export const checkRateLimit = async (identifier: string): Promise<{
  success: boolean;
  remaining: number;
  reset: number;
  limit: number;
}> => {
  try {
    const limiter = getRatelimit();
    const result = await limiter.limit(identifier);
    
    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
      limit: result.limit,
    };
  } catch (error) {
    console.error('[RateLimit] 检查失败:', error);
    // 失败时不阻止请求，但记录日志
    return {
      success: true,
      remaining: 0,
      reset: 0,
      limit: 10,
    };
  }
};

// 从请求中提取用户标识（IP 地址）
export const getIdentifier = (request: Request): string => {
  // 尝试从 X-Forwarded-For 头获取真实 IP（Vercel 会设置这个头）
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded 
    ? forwarded.split(',')[0].trim() 
    : 'unknown';
  
  return `ip:${ip}`;
};
