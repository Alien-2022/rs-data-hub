// Next.js 中间件 - 安全配置
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 安全响应头配置
const securityHeaders = {
  // 防止点击劫持（Clickjacking）
  'X-Frame-Options': 'DENY',
  
  // 防止 MIME 类型嗅探
  'X-Content-Type-Options': 'nosniff',
  
  // 启用 XSS 过滤器
  'X-XSS-Protection': '1; mode=block',
  
  // 强制 HTTPS（生产环境）
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  
  // 限制 Referrer 信息
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // 内容安全策略（CSP）- 限制资源加载来源
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.upstash.io https://*.supabase.co",
    "frame-ancestors 'none'",
  ].join('; '),
  
  // 权限策略（限制浏览器功能）
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// 允许的 CORS 来源（生产环境）
const ALLOWED_ORIGINS = [
  'https://rs-data-hub.vercel.app',
  'https://rs-data-hub-git-main.vercel.app',
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '',
].filter(Boolean);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 0️⃣ 强制 HTTPS 重定向（生产环境）
  if (process.env.NODE_ENV === 'production') {
    const host = request.headers.get('host') || '';
    const isVercelPreview = host.includes('vercel.app');
    const isCustomDomain = !isVercelPreview;
    
    // 检查是否是 HTTP 请求（通过 x-forwarded-proto 判断）
    const proto = request.headers.get('x-forwarded-proto');
    if (proto === 'http' && isCustomDomain) {
      const httpsUrl = new URL(request.url);
      httpsUrl.protocol = 'https:';
      return NextResponse.redirect(httpsUrl, { status: 308 });
    }
  }

  const response = NextResponse.next();

  // 1️⃣ 添加安全响应头（所有路由）
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // 2️⃣ CORS 配置（仅 API 路由）
  if (pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin') || '';
    
    // 检查来源是否允许
    if (ALLOWED_ORIGINS.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    } else {
      // 不允许的来源，拒绝预检请求
      if (request.method === 'OPTIONS') {
        return new NextResponse(null, { status: 403 });
      }
    }
    
    // CORS 预检请求处理
    if (request.method === 'OPTIONS') {
      response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      response.headers.set('Access-Control-Max-Age', '86400'); // 24 小时
      return response;
    }
    
    // 正常请求的 CORS 头
    response.headers.set('Access-Control-Allow-Methods', 'GET');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  }

  // 3️⃣ 限制 API 路由只能使用 GET 方法
  if (pathname.startsWith('/api/') && request.method !== 'GET') {
    return NextResponse.json(
      { error: '方法不允许', message: '该 API 仅支持 GET 请求' },
      { status: 405 }
    );
  }

  // 4️⃣ 防止敏感路径访问
  const blockedPaths = [
    '/.env',
    '/.env.local',
    '/.git',
    '/node_modules',
    '/package.json',
    '/tsconfig.json',
  ];
  
  if (blockedPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.json(
      { error: '禁止访问' },
      { status: 403 }
    );
  }

  return response;
}

// 配置中间件匹配的路由
export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了：
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favicon.ico (网站图标)
     * - 静态资源文件
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
