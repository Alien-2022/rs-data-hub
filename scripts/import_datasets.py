#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
遥感数据集批量导入脚本

用途:
- 从 JSON 文件批量导入数据集到 Supabase 数据库
- 验证导入结果
- 生成导入报告

使用方法:
    # 从 JSON 文件导入
    python import_datasets.py --input datasets_20.json
    
    # 测试连接
    python import_datasets.py --test-connection
    
    # 查看现有数据
    python import_datasets.py --list

作者：小龙虾团队
创建时间：2026-03-27
"""

import argparse
import json
import os
import sys
from datetime import datetime
from typing import List, Dict, Optional

# 尝试导入 Supabase 客户端
try:
    from supabase import create_client, Client
except ImportError:
    print("❌ 错误：未找到 supabase 库")
    print("请安装：pip install supabase")
    sys.exit(1)


class DatasetImporter:
    """数据集导入器"""
    
    def __init__(self, supabase_url: str, supabase_key: str):
        """
        初始化导入器
        
        Args:
            supabase_url: Supabase 项目 URL
            supabase_key: Supabase 密钥 (建议使用 service_role key)
        """
        self.supabase: Client = create_client(supabase_url, supabase_key)
        self.imported_count = 0
        self.skipped_count = 0
        self.error_count = 0
        self.errors = []
    
    def test_connection(self) -> bool:
        """测试数据库连接"""
        try:
            # 尝试查询现有数据
            response = self.supabase.table('datasets').select('id').limit(1).execute()
            print(f"✅ 数据库连接成功！当前已有 {len(response.data)} 条记录")
            return True
        except Exception as e:
            print(f"❌ 数据库连接失败：{str(e)}")
            return False
    
    def load_datasets(self, input_file: str) -> List[Dict]:
        """加载数据集 JSON 文件"""
        if not os.path.exists(input_file):
            raise FileNotFoundError(f"文件不存在：{input_file}")
        
        with open(input_file, 'r', encoding='utf-8') as f:
            datasets = json.load(f)
        
        print(f"✓ 已加载 {len(datasets)} 个数据集")
        return datasets
    
    def prepare_dataset(self, dataset: Dict) -> Dict:
        """
        准备数据集数据，转换格式
        
        Args:
            dataset: 原始数据集字典
            
        Returns:
            符合数据库格式的字典
        """
        # 转换存储大小为字节数
        storage_bytes = self.parse_storage_size(dataset.get('storage_size', '0'))
        
        # 准备数据
        data = {
            'name': dataset.get('name', ''),
            'description': dataset.get('description', ''),
            'task_types': dataset.get('task_types', []),
            'data_modality': dataset.get('data_modality', ''),
            'domain': dataset.get('domain', 'CV'),
            'image_count': dataset.get('image_count'),
            'storage_size': dataset.get('storage_size', ''),
            'storage_bytes': storage_bytes,
            'publisher': dataset.get('publisher', ''),
            'publish_year': dataset.get('publish_year'),
            'license': dataset.get('license'),
            'download_url': dataset.get('download_url', ''),
            'paper_url': dataset.get('paper_url'),
            'project_url': dataset.get('project_url'),
            'doi': dataset.get('doi'),
            'sensor_name': dataset.get('sensor_name'),
            'spatial_resolution': dataset.get('spatial_resolution'),
            'spectral_bands': dataset.get('spectral_bands'),
            'source_platform': 'manual_import',
            'external_id': dataset.get('external_id', dataset.get('name', '').lower().replace(' ', '-'))
        }
        
        return data
    
    def parse_storage_size(self, size_str: str) -> Optional[int]:
        """
        解析存储大小字符串为字节数
        
        Args:
            size_str: 如 "7.1GB", "2.5TB"
            
        Returns:
            字节数，解析失败返回 None
        """
        if not size_str:
            return None
        
        size_str = size_str.upper().strip()
        
        multipliers = {
            'B': 1,
            'KB': 1024,
            'MB': 1024 ** 2,
            'GB': 1024 ** 3,
            'TB': 1024 ** 4,
        }
        
        for unit, multiplier in multipliers.items():
            if size_str.endswith(unit):
                try:
                    value = float(size_str[:-len(unit)].strip())
                    return int(value * multiplier)
                except:
                    return None
        
        # 如果是纯数字，假设是字节
        try:
            return int(size_str)
        except:
            return None
    
    def import_dataset(self, dataset: Dict) -> bool:
        """
        导入单个数据集
        
        Args:
            dataset: 数据集字典
            
        Returns:
            是否导入成功
        """
        try:
            data = self.prepare_dataset(dataset)
            
            # 插入数据库
            response = self.supabase.table('datasets').insert(data).execute()
            
            if response.data:
                self.imported_count += 1
                print(f"  ✅ 已导入：{dataset.get('name')}")
                return True
            else:
                self.error_count += 1
                error_msg = f"导入失败：{dataset.get('name')} - 无返回数据"
                self.errors.append(error_msg)
                print(f"  ❌ {error_msg}")
                return False
                
        except Exception as e:
            self.error_count += 1
            error_msg = f"导入失败：{dataset.get('name')} - {str(e)}"
            self.errors.append(error_msg)
            print(f"  ❌ {error_msg}")
            return False
    
    def import_batch(self, datasets: List[Dict], skip_existing: bool = True) -> Dict:
        """
        批量导入数据集
        
        Args:
            datasets: 数据集列表
            skip_existing: 是否跳过已存在的数据集
            
        Returns:
            导入统计信息
        """
        print(f"\n开始导入 {len(datasets)} 个数据集...")
        print("-" * 50)
        
        for i, dataset in enumerate(datasets, 1):
            print(f"[{i}/{len(datasets)}] 处理：{dataset.get('name')}")
            
            # 检查是否已存在
            if skip_existing:
                existing = self.supabase.table('datasets')\
                    .select('id')\
                    .eq('name', dataset.get('name'))\
                    .execute()
                
                if existing.data:
                    print(f"  ⏭️  已存在，跳过：{dataset.get('name')}")
                    self.skipped_count += 1
                    continue
            
            # 导入数据集
            self.import_dataset(dataset)
        
        print("-" * 50)
        print(f"\n导入完成！")
        print(f"✅ 成功：{self.imported_count}")
        print(f"⏭️  跳过：{self.skipped_count}")
        print(f"❌ 失败：{self.error_count}")
        
        if self.errors:
            print(f"\n错误详情:")
            for error in self.errors:
                print(f"  - {error}")
        
        return {
            'imported': self.imported_count,
            'skipped': self.skipped_count,
            'failed': self.error_count,
            'errors': self.errors
        }
    
    def list_datasets(self, limit: int = 10):
        """列出已有数据集"""
        try:
            response = self.supabase.table('datasets')\
                .select('name, task_types, image_count, publisher, created_at')\
                .order('created_at', desc=True)\
                .limit(limit)\
                .execute()
            
            print(f"\n最近 {len(response.data)} 个数据集:")
            print("-" * 80)
            print(f"{'名称':<25} {'任务类型':<20} {'图像数量':<12} {'发布机构':<20}")
            print("-" * 80)
            
            for ds in response.data:
                task_types = ', '.join(ds.get('task_types', []))[:18]
                print(f"{ds['name']:<25} {task_types:<20} {str(ds.get('image_count', 'N/A')):<12} {ds.get('publisher', 'N/A')[:18]:<20}")
            
            print("-" * 80)
            
        except Exception as e:
            print(f"❌ 查询失败：{str(e)}")


def load_env() -> tuple:
    """从环境变量或 .env.local 文件加载配置"""
    # 尝试从 .env.local 文件读取
    env_file = os.path.join(os.path.dirname(__file__), '..', '.env.local')
    
    if os.path.exists(env_file):
        with open(env_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        config = {}
        for line in lines:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                config[key.strip()] = value.strip()
        
        supabase_url = config.get('NEXT_PUBLIC_SUPABASE_URL')
        supabase_key = config.get('SUPABASE_SERVICE_ROLE_KEY')
        
        if supabase_url and supabase_key:
            return supabase_url, supabase_key
    
    # 从环境变量读取
    supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
    
    if not supabase_url or not supabase_key:
        raise EnvironmentError(
            "未找到 Supabase 配置\n"
            "请设置环境变量或在 .env.local 文件中配置:\n"
            "  NEXT_PUBLIC_SUPABASE_URL=...\n"
            "  SUPABASE_SERVICE_ROLE_KEY=..."
        )
    
    return supabase_url, supabase_key


def main():
    parser = argparse.ArgumentParser(description='遥感数据集批量导入工具')
    parser.add_argument('--input', type=str, help='输入 JSON 文件 (数据集列表)')
    parser.add_argument('--test-connection', action='store_true', help='测试数据库连接')
    parser.add_argument('--list', action='store_true', help='列出已有数据集')
    parser.add_argument('--limit', type=int, default=10, help='列出数据集数量限制')
    parser.add_argument('--no-skip', action='store_true', help='不跳过已存在的数据集')
    
    args = parser.parse_args()
    
    # 加载配置
    try:
        supabase_url, supabase_key = load_env()
    except EnvironmentError as e:
        print(f"❌ {e}")
        sys.exit(1)
    
    # 创建导入器
    try:
        importer = DatasetImporter(supabase_url, supabase_key)
    except Exception as e:
        print(f"❌ 初始化失败：{str(e)}")
        sys.exit(1)
    
    # 测试连接
    if args.test_connection:
        success = importer.test_connection()
        sys.exit(0 if success else 1)
    
    # 列出已有数据集
    if args.list:
        importer.list_datasets(args.limit)
        sys.exit(0)
    
    # 导入数据集
    if args.input:
        try:
            datasets = importer.load_datasets(args.input)
            stats = importer.import_batch(datasets, skip_existing=not args.no_skip)
            
            # 保存导入报告
            report = {
                'imported_at': datetime.now().isoformat(),
                'input_file': args.input,
                'statistics': stats
            }
            
            report_file = f"import_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            with open(report_file, 'w', encoding='utf-8') as f:
                json.dump(report, f, indent=2, ensure_ascii=False)
            
            print(f"\n✓ 导入报告已保存：{report_file}")
            
        except FileNotFoundError as e:
            print(f"❌ {e}")
            sys.exit(1)
        except Exception as e:
            print(f"❌ 导入失败：{str(e)}")
            sys.exit(1)
    else:
        parser.print_help()


if __name__ == '__main__':
    main()
