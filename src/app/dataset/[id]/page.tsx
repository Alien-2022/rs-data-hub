'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Dataset {
  id: string;
  name: string;
  description: string;
  task_types: string[];
  data_modality: string;
  domain: string;
  image_count: number | null;
  storage_size: string;
  storage_bytes: number | null;
  publisher: string;
  publish_year: number;
  license: string | null;
  download_url: string;
  paper_url: string | null;
  project_url: string | null;
  doi: string | null;
  sensor_name: string | null;
  spatial_resolution: string | null;
  spectral_bands: number | null;
  created_at: string;
  updated_at: string;
}

export default function DatasetDetailPage() {
  const params = useParams();
  useRouter(); // 保留用于未来功能
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bibtexCopied, setBibtexCopied] = useState(false);

  useEffect(() => {
    async function fetchDataset() {
      try {
        const res = await fetch(`/api/datasets/${params.id}`);
        if (!res.ok) {
          throw new Error('数据集不存在');
        }
        const data = await res.json();
        setDataset(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载失败');
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchDataset();
    }
  }, [params.id]);

  // 生成 BibTeX 引用
  const generateBibTeX = () => {
    if (!dataset) return '';
    const key = dataset.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `@dataset{${key},
  title = {${dataset.name}},
  author = {${dataset.publisher}},
  year = {${dataset.publish_year}},
  ${dataset.doi ? `doi = {${dataset.doi}},` : ''}
  url = {${dataset.download_url}}
}`;
  };

  // 复制 BibTeX
  const copyBibTeX = async () => {
    try {
      await navigator.clipboard.writeText(generateBibTeX());
      setBibtexCopied(true);
      setTimeout(() => setBibtexCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">加载数据集中...</p>
        </div>
      </div>
    );
  }

  if (error || !dataset) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-6">{error || '数据集不存在'}</p>
          <Link
            href="/search"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            返回搜索页面
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link
            href="/search"
            className="text-blue-600 hover:text-blue-800 transition flex items-center gap-2"
          >
            ← 返回搜索页面
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* 标题区域 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{dataset.name}</h1>
          <p className="text-xl text-gray-600">{dataset.description}</p>
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {dataset.task_types.map((type, i) => (
            <span
              key={i}
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
            >
              {type}
            </span>
          ))}
          <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            {dataset.data_modality}
          </span>
        </div>

        {/* 主要内容 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* 基础信息 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">基础信息</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-gray-500">数据模态</dt>
                <dd className="text-gray-900 font-medium">{dataset.data_modality}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">领域</dt>
                <dd className="text-gray-900 font-medium">{dataset.domain}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">发布机构</dt>
                <dd className="text-gray-900 font-medium">{dataset.publisher}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">发布年份</dt>
                <dd className="text-gray-900 font-medium">{dataset.publish_year}</dd>
              </div>
              {dataset.license && (
                <div>
                  <dt className="text-sm text-gray-500">许可证</dt>
                  <dd className="text-gray-900 font-medium">{dataset.license}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* 规模信息 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">规模信息</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-gray-500">图像数量</dt>
                <dd className="text-gray-900 font-medium">
                  {dataset.image_count?.toLocaleString() || 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">存储大小</dt>
                <dd className="text-gray-900 font-medium">{dataset.storage_size}</dd>
              </div>
              {dataset.storage_bytes && (
                <div>
                  <dt className="text-sm text-gray-500">字节数</dt>
                  <dd className="text-gray-900 font-medium">
                    {dataset.storage_bytes.toLocaleString()} bytes
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* 遥感特有字段 */}
          {(dataset.sensor_name || dataset.spatial_resolution || dataset.spectral_bands) && (
            <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
              <h2 className="text-lg font-semibold mb-4">遥感特有信息</h2>
              <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dataset.sensor_name && (
                  <div>
                    <dt className="text-sm text-gray-500">传感器/卫星</dt>
                    <dd className="text-gray-900 font-medium">{dataset.sensor_name}</dd>
                  </div>
                )}
                {dataset.spatial_resolution && (
                  <div>
                    <dt className="text-sm text-gray-500">空间分辨率</dt>
                    <dd className="text-gray-900 font-medium">{dataset.spatial_resolution}</dd>
                  </div>
                )}
                {dataset.spectral_bands && (
                  <div>
                    <dt className="text-sm text-gray-500">波段数量</dt>
                    <dd className="text-gray-900 font-medium">{dataset.spectral_bands}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>

        {/* 学术资源 */}
        {(dataset.paper_url || dataset.project_url || dataset.doi) && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">学术资源</h2>
            <div className="space-y-3">
              {dataset.paper_url && (
                <div>
                  <a
                    href={dataset.paper_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-2"
                  >
                    📄 论文链接
                  </a>
                </div>
              )}
              {dataset.project_url && (
                <div>
                  <a
                    href={dataset.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-2"
                  >
                    🌐 项目首页
                  </a>
                </div>
              )}
              {dataset.doi && (
                <div>
                  <span className="text-gray-500">DOI:</span>{' '}
                  <span className="text-gray-900 font-mono">{dataset.doi}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BibTeX 引用 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">BibTeX 引用</h2>
            <button
              onClick={copyBibTeX}
              className={`px-4 py-2 rounded-lg transition ${
                bibtexCopied
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {bibtexCopied ? '✓ 已复制' : '📋 复制'}
            </button>
          </div>
          <pre className="bg-gray-100 rounded-lg p-4 overflow-x-auto text-sm font-mono">
            {generateBibTeX()}
          </pre>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-4">
          <a
            href={dataset.download_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-6 py-4 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition font-semibold"
          >
            📥 下载数据集
          </a>
          {dataset.paper_url && (
            <a
              href={dataset.paper_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              📄 查看论文
            </a>
          )}
        </div>

        {/* 元信息 */}
        <div className="mt-8 pt-6 border-t text-sm text-gray-500">
          <p>创建时间：{new Date(dataset.created_at).toLocaleDateString('zh-CN')}</p>
          <p>最后更新：{new Date(dataset.updated_at).toLocaleDateString('zh-CN')}</p>
        </div>
      </main>
    </div>
  );
}
