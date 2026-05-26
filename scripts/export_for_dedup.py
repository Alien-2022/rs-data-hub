#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
导出数据库摘要用于采集前查重

用途:
- 从 Supabase 导出数据集的关键字段（name/url/doi 等）到本地 JSON
- Agent 采集时读取此文件进行本地查重，避免频繁访问线上数据库

使用方法:
    # 导出摘要到 scripts/output/dedup_index.json
    python export_for_dedup.py

    # 指定输出路径
    python export_for_dedup.py --output /path/to/dedup_index.json

环境变量:
    SUPABASE_URL              Supabase 项目 URL
    SUPABASE_SERVICE_ROLE_KEY Supabase 密钥
"""

import json
import os
import sys
from datetime import datetime, timezone

try:
    from supabase import create_client, Client
except ImportError:
    print("❌ 错误：未找到 supabase 库")
    print("请安装：pip install supabase")
    sys.exit(1)

DEDUP_FIELDS = [
    "name",
    "download_url",
    "doi",
    "publisher",
    "publish_year",
    "task_types",
    "data_modality",
    "image_count",
]


def load_env() -> tuple:
    env_file = os.path.join(os.path.dirname(__file__), '..', '.env.local')
    if os.path.exists(env_file):
        with open(env_file, 'r', encoding='utf-8') as f:
            config = {}
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    config[k.strip()] = v.strip()
        url = config.get('NEXT_PUBLIC_SUPABASE_URL')
        key = config.get('SUPABASE_SERVICE_ROLE_KEY')
        if url and key:
            return url, key
    url = os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        print("❌ 错误：请设置环境变量或在 .env.local 文件中配置")
        print("  NEXT_PUBLIC_SUPABASE_URL=...")
        print("  SUPABASE_SERVICE_ROLE_KEY=...")
        sys.exit(1)
    return url, key


def get_supabase() -> Client:
    url, key = load_env()
    return create_client(url, key)


def export(supabase: Client, output: str):
    print("正在从 Supabase 导出数据集摘要...")

    select_fields = ",".join(DEDUP_FIELDS)
    response = supabase.table("datasets").select(select_fields).execute()
    datasets = response.data or []

    index = {
        "exported_at": datetime.now(timezone.utc).isoformat(),
        "count": len(datasets),
        "datasets": datasets,
    }

    os.makedirs(os.path.dirname(os.path.abspath(output)), exist_ok=True)
    with open(output, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)

    print(f"✅ 已导出 {len(datasets)} 条摘要到 {output}")


def main():
    import argparse

    parser = argparse.ArgumentParser(description="导出数据库摘要用于查重")
    parser.add_argument(
        "--output",
        default="scripts/output/dedup_index.json",
        help="输出文件路径 (默认: scripts/output/dedup_index.json)",
    )
    args = parser.parse_args()

    supabase = get_supabase()
    export(supabase, args.output)


if __name__ == "__main__":
    main()
