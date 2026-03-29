#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
遥感数据集分类标准化脚本

用途:
- 将现有的任务类型和数据模态分类标准化
- 合并重叠/过于细分的分类
- 批量更新 Supabase 数据库中的数据

分类映射规则:
============

任务类型映射 (14 → 5):
- 图像分类 ← 图像分类、场景分类、土地利用分类、土地覆盖分类、细粒度分类
- 目标检测 ← 目标检测、旋转目标检测、细粒度检测
- 语义分割 ← 语义分割、土地覆盖分类
- 变化检测 ← 变化检测
- 实例分割 ← 实例分割

数据模态映射 (9 → 5):
- 光学 ← 光学、光学/航拍、航拍
- SAR ← SAR
- 多光谱 ← 多光谱、无人机、无人机航拍、航拍 (IR-R-G)、航拍 (RGB+NIR)
- 高光谱 ← 高光谱
- LiDAR ← LiDAR

使用方法:
    python update_dataset_categories.py --dry-run  # 预览变更
    python update_dataset_categories.py --execute  # 执行更新

作者：小龙虾团队
创建时间：2026-03-29
"""

import argparse
import sys
from typing import Dict, List, Set

try:
    from supabase import create_client, Client
except ImportError:
    print("❌ 错误：未找到 supabase 库")
    print("请安装：pip install supabase")
    sys.exit(1)


# ============ 分类映射表 ============

# 任务类型映射：旧分类 → 新分类
TASK_TYPE_MAPPING = {
    # 图像分类
    '图像分类': '图像分类',
    '场景分类': '图像分类',
    '土地利用分类': '图像分类',
    '土地覆盖分类': '图像分类',
    '细粒度分类': '图像分类',
    
    # 目标检测
    '目标检测': '目标检测',
    '旋转目标检测': '目标检测',
    '细粒度检测': '目标检测',
    
    # 语义分割
    '语义分割': '语义分割',
    '土地覆盖分类': '语义分割',  # 注意：这个可能同时属于图像分类和语义分割
    
    # 变化检测
    '变化检测': '变化检测',
    
    # 实例分割
    '实例分割': '实例分割',
    
    # 多标签分类（删除，不作为任务类型）
    '多标签分类': None,  # None 表示删除
}

# 数据模态映射：旧分类 → 新分类
MODALITY_MAPPING = {
    # 光学
    '光学': '光学',
    '光学/航拍': '光学',
    '航拍': '光学',
    
    # SAR
    'SAR': 'SAR',
    
    # 多光谱
    '多光谱': '多光谱',
    '无人机': '多光谱',
    '无人机航拍': '多光谱',
    '航拍 (IR-R-G)': '多光谱',
    '航拍 (RGB+NIR)': '多光谱',
    
    # 高光谱
    '高光谱': '高光谱',
    
    # LiDAR
    'LiDAR': 'LiDAR',
}

# 标准分类列表
STANDARD_TASK_TYPES = ['图像分类', '目标检测', '语义分割', '变化检测', '实例分割']
STANDARD_MODALITIES = ['光学', 'SAR', '多光谱', '高光谱', 'LiDAR']


class CategoryUpdater:
    """分类更新器"""
    
    def __init__(self, supabase_url: str, supabase_key: str):
        """初始化更新器"""
        self.supabase: Client = create_client(supabase_url, supabase_key)
        self.updated_count = 0
        self.skipped_count = 0
        self.error_count = 0
        self.changes = []
    
    def map_task_types(self, old_task_types: List[str]) -> List[str]:
        """
        映射任务类型
        
        Args:
            old_task_types: 旧的任务类型列表
            
        Returns:
            新的任务类型列表（已去重）
        """
        new_task_types = set()
        
        for old_type in old_task_types:
            if old_type in TASK_TYPE_MAPPING:
                new_type = TASK_TYPE_MAPPING[old_type]
                if new_type:  # None 表示删除
                    new_task_types.add(new_type)
            else:
                # 未知分类，保留原样并警告
                print(f"⚠️  未知任务类型：{old_type}，保留原样")
                new_task_types.add(old_type)
        
        return sorted(list(new_task_types))
    
    def map_modality(self, old_modality: str) -> str:
        """
        映射数据模态
        
        Args:
            old_modality: 旧的数据模态
            
        Returns:
            新的数据模态
        """
        if old_modality in MODALITY_MAPPING:
            return MODALITY_MAPPING[old_modality]
        else:
            # 未知分类，保留原样并警告
            print(f"⚠️  未知数据模态：{old_modality}，保留原样")
            return old_modality
    
    def fetch_all_datasets(self) -> List[Dict]:
        """获取所有数据集"""
        try:
            response = self.supabase.table('datasets').select('*').execute()
            return response.data
        except Exception as e:
            print(f"❌ 获取数据集失败：{str(e)}")
            return []
    
    def update_dataset(self, dataset_id: str, updates: Dict) -> bool:
        """
        更新单个数据集
        
        Args:
            dataset_id: 数据集 ID
            updates: 要更新的字段
            
        Returns:
            是否成功
        """
        try:
            self.supabase.table('datasets').update(updates).eq('id', dataset_id).execute()
            return True
        except Exception as e:
            print(f"❌ 更新失败：{str(e)}")
            return False
    
    def process_datasets(self, execute: bool = False) -> None:
        """
        处理所有数据集
        
        Args:
            execute: 是否真正执行更新（False = 仅预览）
        """
        print("📊 开始处理数据集...\n")
        
        datasets = self.fetch_all_datasets()
        if not datasets:
            print("❌ 没有数据集")
            return
        
        print(f"✓ 找到 {len(datasets)} 个数据集\n")
        
        for dataset in datasets:
            dataset_id = dataset['id']
            dataset_name = dataset['name']
            
            # 获取当前分类
            old_task_types = dataset.get('task_types', [])
            old_modality = dataset.get('data_modality', '')
            
            # 映射新分类
            new_task_types = self.map_task_types(old_task_types)
            new_modality = self.map_modality(old_modality)
            
            # 检查是否有变化
            has_changes = (
                set(old_task_types) != set(new_task_types) or
                old_modality != new_modality
            )
            
            if has_changes:
                change_record = {
                    'id': dataset_id,
                    'name': dataset_name,
                    'old_task_types': old_task_types,
                    'new_task_types': new_task_types,
                    'old_modality': old_modality,
                    'new_modality': new_modality,
                }
                self.changes.append(change_record)
                
                if execute:
                    updates = {
                        'task_types': new_task_types,
                        'data_modality': new_modality,
                    }
                    if self.update_dataset(dataset_id, updates):
                        print(f"✅ 更新：{dataset_name}")
                        self.updated_count += 1
                    else:
                        self.error_count += 1
                else:
                    print(f"📝 待更新：{dataset_name}")
            else:
                self.skipped_count += 1
        
        # 打印统计
        print("\n" + "="*60)
        print("📊 处理完成")
        print("="*60)
        print(f"总数据集数：{len(datasets)}")
        print(f"需要更新：{len(self.changes)}")
        print(f"无需更新：{self.skipped_count}")
        
        if execute:
            print(f"✅ 成功更新：{self.updated_count}")
            print(f"❌ 更新失败：{self.error_count}")
        else:
            print(f"\n💡 当前为预览模式，未执行实际更新")
            print(f"   使用 --execute 参数执行更新")
        
        # 打印详细变更
        if self.changes:
            print("\n" + "="*60)
            print("📋 详细变更列表")
            print("="*60)
            
            for i, change in enumerate(self.changes, 1):
                print(f"\n{i}. {change['name']} (ID: {change['id']})")
                
                if set(change['old_task_types']) != set(change['new_task_types']):
                    print(f"   任务类型：{change['old_task_types']} → {change['new_task_types']}")
                
                if change['old_modality'] != change['new_modality']:
                    print(f"   数据模态：{change['old_modality']} → {change['new_modality']}")
    
    def generate_report(self, output_file: str = 'category_update_report.json') -> None:
        """生成更新报告"""
        import json
        
        report = {
            'summary': {
                'total_changes': len(self.changes),
                'updated': self.updated_count,
                'skipped': self.skipped_count,
                'errors': self.error_count,
            },
            'changes': self.changes,
            'standard_categories': {
                'task_types': STANDARD_TASK_TYPES,
                'modalities': STANDARD_MODALITIES,
            }
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        print(f"\n📄 报告已保存到：{output_file}")


def main():
    """主函数"""
    parser = argparse.ArgumentParser(description='遥感数据集分类标准化脚本')
    parser.add_argument('--dry-run', action='store_true', help='预览变更，不执行更新')
    parser.add_argument('--execute', action='store_true', help='执行更新')
    parser.add_argument('--report', type=str, default='category_update_report.json',
                       help='报告输出文件名')
    
    args = parser.parse_args()
    
    if not args.dry_run and not args.execute:
        print("❌ 错误：必须指定 --dry-run 或 --execute")
        print("\n使用方法:")
        print("  python update_dataset_categories.py --dry-run  # 预览变更")
        print("  python update_dataset_categories.py --execute  # 执行更新")
        sys.exit(1)
    
    # 检查环境变量
    supabase_url = os.getenv('SUPABASE_URL')
    supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
    
    if not supabase_url or not supabase_key:
        print("❌ 错误：缺少环境变量")
        print("\n请设置:")
        print("  export SUPABASE_URL='your-supabase-url'")
        print("  export SUPABASE_SERVICE_ROLE_KEY='your-service-role-key'")
        sys.exit(1)
    
    # 创建更新器
    updater = CategoryUpdater(supabase_url, supabase_key)
    
    # 执行更新
    execute = args.execute
    updater.process_datasets(execute=execute)
    
    # 生成报告
    if args.execute:
        updater.generate_report(args.report)


if __name__ == '__main__':
    import os
    main()
