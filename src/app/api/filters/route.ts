/* eslint-disable @typescript-eslint/no-explicit-any */
// 获取所有任务类型和数据模态（用于筛选下拉框）
import { createServerClient } from '@/../lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createServerClient();
    
    // 获取所有唯一任务类型
    const { data: taskData, error: taskError } = await supabase
      .from('datasets')
      .select('task_types');
    
    // 获取所有唯一数据模态
    const { data: modalityData, error: modalityError } = await supabase
      .from('datasets')
      .select('data_modality');
    
    if (taskError || modalityError) {
      console.error('Filter options error:', taskError || modalityError);
      return NextResponse.json(
        { error: '获取筛选选项失败' },
        { status: 500 }
      );
    }
    
    // 提取唯一值
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const taskTypes = Array.from(
      new Set((taskData as any[])?.flatMap((ds: any) => ds.task_types) || [])
    ).sort();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modalities = Array.from(
      new Set((modalityData as any[])?.map((ds: any) => ds.data_modality) || [])
    ).sort();
    
    // 获取年份范围
    const { data: yearData } = await supabase
      .from('datasets')
      .select('publish_year')
      .order('publish_year', { ascending: false });
    
    const years = Array.from(
      new Set((yearData as any[])?.map((ds: any) => ds.publish_year) || [])
    ).sort((a, b) => b - a);
    
    return NextResponse.json({
      taskTypes,
      modalities,
      years
    });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
