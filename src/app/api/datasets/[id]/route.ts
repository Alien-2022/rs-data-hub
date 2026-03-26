// 获取单个数据集详情
import { createServerClient } from '@/../lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const { id } = params;

    const { data, error } = await supabase
      .from('datasets')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: '数据集不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
