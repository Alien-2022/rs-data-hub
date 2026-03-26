#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
遥感数据集链接验证脚本

用途:
- 批量验证论文链接和下载链接的 HTTP 状态
- 生成验证报告 (JSON/Markdown)
- 定期复查已验证链接

使用方法:
    # 验证单个链接
    python verify_links.py --url https://arxiv.org/abs/1909.00133
    
    # 批量验证 (从 JSON 文件读取)
    python verify_links.py --input datasets.json --output report.json
    
    # 生成 Markdown 报告
    python verify_links.py --input datasets.json --format markdown --output report.md
    
    # 定期复查 (从已验证列表读取)
    python verify_links.py --review verified_datasets.json --output new_report.json

作者：小龙虾团队
创建时间：2026-03-27
"""

import argparse
import json
import requests
import time
from datetime import datetime
from typing import List, Dict, Optional
from concurrent.futures import ThreadPoolExecutor, as_completed
import sys

# 配置
DEFAULT_TIMEOUT = 10  # 请求超时时间 (秒)
MAX_WORKERS = 10  # 并发线程数
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"


class LinkVerifier:
    """链接验证器"""
    
    def __init__(self, timeout: int = DEFAULT_TIMEOUT):
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': USER_AGENT,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        })
    
    def verify_url(self, url: str) -> Dict:
        """
        验证单个链接
        
        Returns:
            dict: {
                'url': str,
                'status': '✅' | '⚠️' | '❌',
                'http_code': int | None,
                'error': str | None,
                'verified_at': str (ISO 8601),
                'response_time': float (秒)
            }
        """
        result = {
            'url': url,
            'status': '❌',
            'http_code': None,
            'error': None,
            'verified_at': datetime.now().isoformat(),
            'response_time': None
        }
        
        if not url or not url.startswith('http'):
            result['error'] = '无效链接'
            return result
        
        try:
            start_time = time.time()
            # 先用 HEAD 请求，失败再用 GET
            response = self.session.head(url, timeout=self.timeout, allow_redirects=True)
            
            # 如果 HEAD 不被支持 (405)，改用 GET
            if response.status_code == 405:
                response = self.session.get(url, timeout=self.timeout, stream=True)
            
            response_time = time.time() - start_time
            result['response_time'] = round(response_time, 3)
            result['http_code'] = response.status_code
            
            # 判断状态
            if 200 <= response.status_code < 400:
                result['status'] = '✅'
            elif 400 <= response.status_code < 500:
                # 4xx 客户端错误
                if response.status_code == 403:
                    result['status'] = '⚠️'  # 可能是反爬
                    result['error'] = '403 Forbidden (可能需浏览器验证)'
                else:
                    result['status'] = '❌'
                    result['error'] = f'{response.status_code} Client Error'
            else:
                # 5xx 服务器错误
                result['status'] = '⚠️'
                result['error'] = f'{response.status_code} Server Error (可重试)'
                
        except requests.exceptions.Timeout:
            result['error'] = '请求超时'
        except requests.exceptions.TooManyRedirects:
            result['error'] = '重定向过多'
        except requests.exceptions.SSLError:
            result['error'] = 'SSL 证书错误'
        except requests.exceptions.ConnectionError:
            result['error'] = '连接失败'
        except Exception as e:
            result['error'] = f'未知错误：{str(e)}'
        
        return result
    
    def verify_batch(self, urls: List[str], max_workers: int = MAX_WORKERS) -> List[Dict]:
        """
        批量验证链接 (并发)
        
        Args:
            urls: 链接列表
            max_workers: 最大并发线程数
            
        Returns:
            list: 验证结果列表
        """
        results = []
        
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_url = {executor.submit(self.verify_url, url): url for url in urls}
            
            for future in as_completed(future_to_url):
                url = future_to_url[future]
                try:
                    result = future.result()
                    results.append(result)
                except Exception as e:
                    results.append({
                        'url': url,
                        'status': '❌',
                        'http_code': None,
                        'error': f'验证异常：{str(e)}',
                        'verified_at': datetime.now().isoformat(),
                        'response_time': None
                    })
        
        return results


def load_datasets(input_file: str) -> List[Dict]:
    """加载数据集 JSON 文件"""
    with open(input_file, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_report(results: List[Dict], output_file: str, format: str = 'json'):
    """保存验证报告"""
    if format == 'json':
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
    elif format == 'markdown':
        save_markdown_report(results, output_file)
    
    print(f"✓ 报告已保存：{output_file}")


def save_markdown_report(results: List[Dict], output_file: str):
    """生成 Markdown 格式报告"""
    # 统计
    total = len(results)
    valid = sum(1 for r in results if r['status'] == '✅')
    warning = sum(1 for r in results if r['status'] == '⚠️')
    invalid = sum(1 for r in results if r['status'] == '❌')
    
    lines = [
        "# 链接验证报告",
        "",
        f"**验证时间**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        f"**总计**: {total} 个链接",
        "",
        "## 验证统计",
        "",
        f"| 状态 | 数量 | 占比 |",
        f"|------|------|------|",
        f"| ✅ 有效 | {valid} | {valid/total*100:.1f}% |",
        f"| ⚠️ 警告 | {warning} | {warning/total*100:.1f}% |",
        f"| ❌ 失效 | {invalid} | {invalid/total*100:.1f}% |",
        "",
        "## 详细结果",
        "",
    ]
    
    # 按状态分组
    for status, status_name in [('✅', '有效'), ('⚠️', '警告'), ('❌', '失效')]:
        filtered = [r for r in results if r['status'] == status]
        if filtered:
            lines.append(f"### {status} {status_name} ({len(filtered)}个)")
            lines.append("")
            for r in filtered:
                lines.append(f"- **{r.get('name', 'Unknown')}**")
                lines.append(f"  - 链接：{r['url']}")
                lines.append(f"  - HTTP 状态码：{r['http_code']}")
                lines.append(f"  - 响应时间：{r['response_time']}s")
                if r.get('error'):
                    lines.append(f"  - 错误：{r['error']}")
                lines.append("")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))


def main():
    parser = argparse.ArgumentParser(description='遥感数据集链接验证工具')
    parser.add_argument('--url', type=str, help='验证单个链接')
    parser.add_argument('--input', type=str, help='输入 JSON 文件 (数据集列表)')
    parser.add_argument('--output', type=str, default='verification_report.json', help='输出文件路径')
    parser.add_argument('--format', type=str, choices=['json', 'markdown'], default='json', help='输出格式')
    parser.add_argument('--timeout', type=int, default=DEFAULT_TIMEOUT, help='请求超时时间 (秒)')
    parser.add_argument('--workers', type=int, default=MAX_WORKERS, help='并发线程数')
    
    args = parser.parse_args()
    
    verifier = LinkVerifier(timeout=args.timeout)
    
    # 验证单个链接
    if args.url:
        print(f"正在验证：{args.url}")
        result = verifier.verify_url(args.url)
        print(f"状态：{result['status']}")
        print(f"HTTP 状态码：{result['http_code']}")
        print(f"响应时间：{result['response_time']}s")
        if result.get('error'):
            print(f"错误：{result['error']}")
        return
    
    # 批量验证
    if args.input:
        print(f"正在加载数据集：{args.input}")
        datasets = load_datasets(args.input)
        
        # 提取所有链接
        urls_to_verify = []
        for ds in datasets:
            if ds.get('paper_url'):
                urls_to_verify.append({
                    'name': f"{ds.get('name', 'Unknown')} - 论文",
                    'url': ds['paper_url']
                })
            if ds.get('download_url'):
                urls_to_verify.append({
                    'name': f"{ds.get('name', 'Unknown')} - 下载",
                    'url': ds['download_url']
                })
        
        print(f"共 {len(urls_to_verify)} 个链接待验证")
        print(f"并发线程数：{args.workers}")
        print("-" * 50)
        
        # 批量验证
        start_time = time.time()
        results = verifier.verify_batch([u['url'] for u in urls_to_verify], max_workers=args.workers)
        total_time = time.time() - start_time
        
        # 合并名称信息
        for i, result in enumerate(results):
            if i < len(urls_to_verify):
                result['name'] = urls_to_verify[i]['name']
        
        # 统计
        valid = sum(1 for r in results if r['status'] == '✅')
        warning = sum(1 for r in results if r['status'] == '⚠️')
        invalid = sum(1 for r in results if r['status'] == '❌')
        
        print(f"\n验证完成！")
        print(f"总耗时：{total_time:.2f}秒")
        print(f"平均速度：{total_time/len(results):.2f}秒/链接")
        print("-" * 50)
        print(f"✅ 有效：{valid} ({valid/len(results)*100:.1f}%)")
        print(f"⚠️ 警告：{warning} ({warning/len(results)*100:.1f}%)")
        print(f"❌ 失效：{invalid} ({invalid/len(results)*100:.1f}%)")
        print("-" * 50)
        
        # 保存报告
        save_report(results, args.output, format=args.format)
        
        # 显示需要人工处理的链接
        if warning + invalid > 0:
            print("\n⚠️ 需要人工处理的链接:")
            for r in results:
                if r['status'] in ['⚠️', '❌']:
                    print(f"  - {r.get('name', 'Unknown')}: {r['url']}")
                    print(f"    状态：{r['status']}, 错误：{r.get('error', 'N/A')}")
        
        return
    
    # 无参数时显示帮助
    parser.print_help()


if __name__ == '__main__':
    main()
