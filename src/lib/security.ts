// 安全工具函数 - 统一的安全处理
import { NextResponse } from 'next/server';

/**
 * 创建安全的错误响应
 * 原则：不泄露内部错误详情，只返回通用信息
 */
export const createSafeError = (
  message: string = '服务器错误',
  status: number = 500,
  userMessage?: string
) => {
  return NextResponse.json(
    {
      error: message,
      message: userMessage || '请稍后重试',
      // 开发环境可以返回更多信息（可选）
      ...(process.env.NODE_ENV === 'development' && {
        debug: {
          timestamp: new Date().toISOString(),
          path: new URLSearchParams(window.location.search).get('debug') ? 'enabled' : undefined,
        },
      }),
    },
    { status }
  );
};

/**
 * 记录安全日志（不包含敏感信息）
 */
export const logSecurityEvent = (
  eventType: string,
  details: Record<string, unknown>
) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    type: eventType,
    env: process.env.NODE_ENV,
    ...details,
  };

  // 生产环境：只记录必要信息
  if (process.env.NODE_ENV === 'production') {
    console.log(`[SECURITY] ${eventType}:`, {
      type: eventType,
      ...details,
    });
  } else {
    // 开发环境：记录详细信息
    console.log(`[SECURITY] ${eventType}:`, logEntry);
  }

  // 可以在这里集成外部日志服务（如 Sentry、LogRocket）
  // if (process.env.SENTRY_DSN) {
  //   Sentry.captureMessage(eventType, { level: 'warning', extra: details });
  // }
};

/**
 * 验证请求来源（Referer 检查）
 */
export const validateReferer = (request: Request): boolean => {
  const referer = request.headers.get('referer');
  
  if (!referer) {
    // 没有 Referer 可能是直接访问，允许
    return true;
  }

  try {
    const refererUrl = new URL(referer);
    const allowedHosts = [
      'rs-data-hub.vercel.app',
      'rs-data-hub-git-main.vercel.app',
      'localhost',
    ];

    return allowedHosts.some(host => refererUrl.hostname === host || refererUrl.hostname.endsWith(`.${host}`));
  } catch {
    // URL 解析失败，拒绝
    return false;
  }
};

/**
 * 清理用户输入（防止 XSS）
 * 虽然 Next.js 默认转义，但双重防护更安全
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>\"'&]/g, '') // 移除 HTML 相关字符
    .replace(/javascript:/gi, '') // 移除 javascript: 协议
    .replace(/on\w+=/gi, '') // 移除 on* 事件处理器
    .trim();
};

/**
 * 生成安全的随机 ID（用于临时标识等）
 */
export const generateSecureId = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * 检查是否是可疑的 User-Agent
 */
export const isSuspiciousUserAgent = (userAgent: string | null): boolean => {
  if (!userAgent) return true; // 没有 User-Agent 很可疑

  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python-requests/i,
  ];

  return suspiciousPatterns.some(pattern => pattern.test(userAgent));
};

/**
 * 速率限制响应头
 */
export const addRateLimitHeaders = (
  response: NextResponse,
  limit: number,
  remaining: number,
  reset: number
) => {
  response.headers.set('X-RateLimit-Limit', limit.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', reset.toString());
  return response;
};
