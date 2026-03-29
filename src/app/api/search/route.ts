// 搜索和筛选 API
import { createServerClient } from '@/../lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// 显式声明为动态路由，避免构建时警告
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const taskTypes = searchParams.getAll('task_type');
    const dataModality = searchParams.getAll('modality');
    const minImages = searchParams.get('min_images');
    const maxImages = searchParams.get('max_images');
    const publishYear = searchParams.get('year');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    // 限制每页数量：默认 10，最大 100，防止滥用
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('page_size') || '10')));
    const sortBy = searchParams.get('sort_by') || 'created_at';
    const sortOrder = searchParams.get('sort_order') || 'desc';

    // 构建查询 - 使用 estimated 计数提升性能（比 exact 快 10-100 倍）
    let queryBuilder = supabase
      .from('datasets')
      .select('*', { count: 'estimated' });

    // 全文搜索（名称和描述）
    if (query) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    }

    // 任务类型筛选 (使用 filter + cs 操作符处理 PostgreSQL 原生数组字段)
    if (taskTypes.length > 0) {
      // cs = contains (PostgreSQL 数组操作符)
      const taskTypeArray = `{${taskTypes.join(',')}}`;
      queryBuilder = queryBuilder.filter('task_types', 'cs', taskTypeArray);
    }

    // 数据模态筛选 (精确匹配)
    if (dataModality.length > 0) {
      queryBuilder = queryBuilder.in('data_modality', dataModality);
    }

    // 图像数量范围
    if (minImages) {
      queryBuilder = queryBuilder.gte('image_count', parseInt(minImages));
    }
    if (maxImages) {
      queryBuilder = queryBuilder.lte('image_count', parseInt(maxImages));
    }

    // 发布年份
    if (publishYear) {
      queryBuilder = queryBuilder.eq('publish_year', parseInt(publishYear));
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
      console.error('Search error:', error);
      return NextResponse.json(
        { error: '搜索失败' },
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
    console.error('API error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
