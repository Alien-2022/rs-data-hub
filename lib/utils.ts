// 工具函数
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind CSS 类名合并工具
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 格式化存储大小（人类可读）
export function formatStorageSize(bytes: number | null): string {
  if (bytes === null || bytes === undefined) return '未知';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

// 解析存储大小字符串为字节数
export function parseStorageSize(sizeStr: string): number | null {
  const match = sizeStr.match(/^([\d.]+)\s*(KB|MB|GB|TB)?$/i);
  if (!match) return null;
  
  const value = parseFloat(match[1]);
  const unit = (match[2] || 'B').toUpperCase();
  
  const multipliers: Record<string, number> = {
    B: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
    TB: 1024 ** 4,
  };
  
  return Math.round(value * multipliers[unit]);
}

// 格式化年份范围显示
export function formatYearRange(years: number[]): string {
  if (years.length === 0) return '';
  if (years.length === 1) return years[0].toString();
  
  const min = Math.min(...years);
  const max = Math.max(...years);
  
  return min === max ? min.toString() : `${min}-${max}`;
}

// 截断文本
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length - 1) + '…';
}

// 生成 BibTeX 引用
export function generateBibTeX(dataset: {
  name: string;
  publisher: string;
  publish_year: number;
  doi?: string | null;
  paper_url?: string | null;
  download_url?: string | null;
}): string {
  const key = dataset.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  
  return `@dataset{${key},
  title = {${dataset.name}},
  author = {${dataset.publisher}},
  year = {${dataset.publish_year}},
  ${dataset.doi ? `doi = {${dataset.doi}},` : ''}
  url = {${dataset.download_url || dataset.paper_url || ''}}
}`;
}
