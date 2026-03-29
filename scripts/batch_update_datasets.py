#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量更新数据集 - 使用标准化分类

用途:
- 从标准化 JSON 文件批量更新数据库
- 保留现有数据的 ID 和其他元数据
- 只更新 task_types 和 data_modality 字段

使用方法:
    python batch_update_datasets.py --dry-run  # 预览变更
    python batch_update_datasets.py --execute  # 执行更新

作者：小龙虾团队
创建时间：2026-03-29
"""

import argparse
import json
import os
import sys
from typing import Dict, List

try:
    from supabase import create_client, Client
except ImportError:
    print("❌ 错误：未找到 supabase 库")
    print("请安装：pip install supabase")
    sys.exit(1)


class BatchUpdater:
    """批量更新器"""
    
    def __init__(self, supabase_url: str, supabase_key: str):
        """初始化更新器"""
        self.supabase: Client = create_client(supabase_url, supabase_key)
        self.updated_count = 0
        self.skipped_count = 0
        self.error_count = 0
        self.changes = []
    
    def load_standardized_data(self, json_file: str) -> List[Dict]:
        """加载标准化数据"""
        if not os.path.exists(json_file):
            raise FileNotFoundError(f"文件不存在：{json_file}")
        
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print(f"✓ 已加载 {len(data)} 个标准化数据集")
        return data
    
    def find_dataset_by_name(self, name: str) -> Dict:
        """根据名称查找现有数据集"""
        try:
            response = self.supabase.table('datasets')\
                .select('id, task_types, data_modality')\
                .eq('name', name)\
                .execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            print(f"❌ 查找数据集失败：{str(e)}")
            return None
    
    def update_dataset(self, dataset_id: str, updates: Dict) -> bool:
        """更新数据集"""
        try:
            self.supabase.table('datasets')\
                .update(updates)\
                .eq('id', dataset_id)\
                .execute()
            return True
        except Exception as e:
            print(f"❌ 更新失败：{str(e)}")
            return False
    
    def process_updates(self, standardized_data: List[Dict], execute: bool = False) -> None:
        """
        处理批量更新
        
        Args:
            standardized_data: 标准化数据列表
            execute: 是否真正执行更新
        """
        print("\n📊 开始处理批量更新...\n")
        
        for std_dataset in standardized_data:
            name = std_dataset['name']
            new_task_types = std_dataset['task_types']
            new_modality = std_dataset['data_modality']
            
            # 查找现有数据集
            existing = self.find_dataset_by_name(name)
            
            if not existing:
                print(f"⚠️  未找到数据集：{name}，跳过")
                self.skipped_count += 1
                continue
            
            dataset_id = existing['id']
            old_task_types = existing.get('task_types', [])
            old_modality = existing.get('data_modality', '')
            
            # 检查是否有变化
            has_changes = (
                set(old_task_types) != set(new_task_types) or
                old_modality != new_modality
            )
            
            if has_changes:
                change_record = {
                    'id': dataset_id,
                    'name': name,
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
                        print(f"✅ 更新：{name}")
                        print(f"   任务类型：{old_task_types} → {new_task_types}")
                        print(f"   数据模态：{old_modality} → {new_modality}")
                        self.updated_count += 1
                    else:
                        self.error_count += 1
                else:
                    print(f"📝 待更新：{name}")
                    print(f"   任务类型：{old_task_types} → {new_task_types}")
                    print(f"   数据模态：{old_modality} → {new_modality}")
            else:
                print(f"✓ 无需更新：{name}")
                self.skipped_count += 1
        
        # 打印统计
        print("\n" + "="*60)
        print("📊 处理完成")
        print("="*60)
        print(f"总数据集数：{len(standardized_data)}")
        print(f"需要更新：{len(self.changes)}")
        print(f"无需更新：{self.skipped_count}")
        
        if execute:
            print(f"✅ 成功更新：{self.updated_count}")
            print(f"❌ 更新失败：{self.error_count}")
        else:
            print(f"\n💡 当前为预览模式，未执行实际更新")
            print(f"   使用 --execute 参数执行更新")
    
    def generate_report(self, output_file: str = 'batch_update_report.json') -> None:
        """生成更新报告"""
        report = {
            'summary': {
                'total_processed': len(self.changes) + self.skipped_count,
                'updated': self.updated_count,
                'skipped': self.skipped_count,
                'errors': self.error_count,
            },
            'changes': self.changes,
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        print(f"\n📄 报告已保存到：{output_file}")


def main():
    """主函数"""
    parser = argparse.ArgumentParser(description='批量更新数据集分类')
    parser.add_argument('--dry-run', action='store_true', help='预览变更，不执行更新')
    parser.add_argument('--execute', action='store_true', help='执行更新')
    parser.add_argument('--input', type=str, default='datasets_20_standardized.json',
                       help='标准化数据 JSON 文件')
    parser.add_argument('--report', type=str, default='batch_update_report.json',
                       help='报告输出文件名')
    
    args = parser.parse_args()
    
    if not args.dry_run and not args.execute:
        print("❌ 错误：必须指定 --dry-run 或 --execute")
        print("\n使用方法:")
        print("  python batch_update_datasets.py --dry-run  # 预览变更")
        print("  python batch_update_datasets.py --execute  # 执行更新")
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
    updater = BatchUpdater(supabase_url, supabase_key)
    
    # 加载标准化数据
    try:
        standardized_data = updater.load_standardized_data(args.input)
    except FileNotFoundError as e:
        print(f"❌ {e}")
        sys.exit(1)
    
    # 执行更新
    updater.process_updates(standardized_data, execute=args.execute)
    
    # 生成报告
    if args.execute:
        updater.generate_report(args.report)


if __name__ == '__main__':
    main()
