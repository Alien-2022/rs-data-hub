// 搜索和筛选 API
import { createServerClient } from '@/../lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getIdentifier } from '@/lib/rateLimit';
import {
  validateSearchQuery,
  validatePagination,
  validateSortParams,
  validateTaskTypes,
  validateModality,
  validateYear,
  validateImageCountRange,
} from '@/lib/validate';

// 显式声明为动态路由，避免构建时警告
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 1️⃣ 速率限制检查
    const identifier = getIdentifier(request);
    const rateLimitResult = await checkRateLimit(identifier);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: '请求过于频繁',
          message: '请稍后再试',
          retryAfter: rateLimitResult.reset,
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          },
        }
      );
    }
    
    const supabase = createServerClient();
    
    // 2️⃣ 输入验证
    const searchParams = request.nextUrl.searchParams;
    
    // 验证搜索查询
    const query = validateSearchQuery(searchParams.get('q'));
    
    // 验证分页
    const { page, pageSize } = validatePagination(
      searchParams.get('page'),
      searchParams.get('page_size')
    );
    
    // 验证排序
    const { sortBy, sortOrder } = validateSortParams(
      searchParams.get('sort_by'),
      searchParams.get('sort_order')
    );
    
    // 验证任务类型
    const taskTypes = validateTaskTypes(searchParams.getAll('task_type'));
    
    // 验证数据模态
    const dataModality = validateModality(searchParams.getAll('modality'));
    
    // 验证图像数量范围
    const { minImages, maxImages } = validateImageCountRange(
      searchParams.get('min_images'),
      searchParams.get('max_images')
    );
    
    // 验证年份
    const publishYear = validateYear(searchParams.get('year'));

    // 构建查询 - 使用 estimated 计数提升性能（比 exact 快 10-100 倍）
    let queryBuilder = supabase
      .from('datasets')
      .select('*', { count: 'estimated' });

    // 全文搜索（名称和描述）- 使用参数化查询防止 SQL 注入
    if (query) {
      // 使用 Supabase 的参数化查询，避免字符串拼接
      const searchTerm = `%${query}%`;
      queryBuilder = queryBuilder.or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`);
    }

    // 任务类型筛选 (使用 filter + cs 操作符处理 PostgreSQL 原生数组字段)
    if (taskTypes.length > 0) {
      // cs = contains (PostgreSQL 数组操作符)
      // 白名单已验证，安全拼接数组格式
      const taskTypeArray = `{${taskTypes.join(',')}}`;
      queryBuilder = queryBuilder.filter('task_types', 'cs', taskTypeArray);
    }

    // 数据模态筛选 (精确匹配)
    if (dataModality.length > 0) {
      queryBuilder = queryBuilder.in('data_modality', dataModality);
    }

    // 图像数量范围（验证后已经是 number 类型）
    if (minImages !== null) {
      queryBuilder = queryBuilder.gte('image_count', minImages);
    }
    if (maxImages !== null) {
      queryBuilder = queryBuilder.lte('image_count', maxImages);
    }

    // 发布年份（验证后已经是 number 类型）
    if (publishYear !== null) {
      queryBuilder = queryBuilder.eq('publish_year', publishYear);
    }

    // 排序
    queryBuilder = queryBuilder.order(sortBy, { ascending: sortOrder === 'asc' });

    // 分页
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    queryBuilder = queryBuilder.range(from, to);

    // 执行查询
    const { data, error, count } = await queryBuilder;

    if (error) {
      // 记录详细错误日志（服务端）
      console.error('[Search API] 查询失败:', {
        code: error.code,
        message: error.message,
        details: error.details,
      });
      
      // 返回通用错误信息（不泄露内部细节）
      return NextResponse.json(
        { 
          error: '搜索失败',
          message: '请稍后重试',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      pagination: {
        page,
        pageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize)
      }
    });

  } catch (error) {
    // 记录详细错误日志（服务端）
    console.error('[Search API] 异常:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    // 返回通用错误信息（不泄露内部细节）
    return NextResponse.json(
      { 
        error: '服务器错误',
        message: '请稍后重试',
      },
      { status: 500 }
    );
  }
}
