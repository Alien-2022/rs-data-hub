// 获取单个数据集详情
import { createServerClient } from '@/../lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getIdentifier } from '@/lib/rateLimit';
import { validateDatasetId } from '@/lib/validate';

// 显式声明为动态路由，避免构建时警告
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // 2️⃣ 输入验证
    const { id } = params;
    validateDatasetId(id); // 验证 ID 格式，如果无效会抛出异常
    
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('datasets')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      // 记录错误日志（服务端）
      if (error) {
        console.error('[Dataset API] 查询失败:', {
          code: error.code,
          message: error.message,
        });
      }
      
      // 返回通用错误信息（不泄露是否存在该 ID）
      return NextResponse.json(
        { 
          error: '数据集不存在',
          message: '请检查数据集 ID',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });

  } catch (error) {
    // 记录详细错误日志（服务端）
    console.error('[Dataset API] 异常:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
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
