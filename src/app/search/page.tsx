'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Dataset {
  id: string;
  name: string;
  description: string;
  task_types: string[];
  data_modality: string;
  image_count: number | null;
  storage_size: string;
  publisher: string;
  publish_year: number;
  paper_url: string | null;
  download_url: string;
}

interface FilterOptions {
  taskTypes: string[];
  modalities: string[];
  years: number[];
}

export default function SearchPage() {
  // 状态
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    taskTypes: [],
    modalities: [],
    years: []
  });
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // 筛选状态
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaskTypes, setSelectedTaskTypes] = useState<string[]>([]);
  const [selectedModalities, setSelectedModalities] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // 加载筛选选项
  useEffect(() => {
    async function loadFilters() {
      try {
        const res = await fetch('/api/filters');
        const data = await res.json();
        setFilterOptions(data);
      } catch (error) {
        console.error('Failed to load filters:', error);
      }
    }
    loadFilters();
  }, []);
  
  // 搜索数据集
  useEffect(() => {
    async function searchDatasets() {
      setLoading(true);
      
      try {
        const params = new URLSearchParams();
        params.set('page', currentPage.toString());
        params.set('page_size', '10');
        
        if (searchQuery) params.set('q', searchQuery);
        selectedTaskTypes.forEach(type => params.append('task_type', type));
        selectedModalities.forEach(mod => params.append('modality', mod));
        if (selectedYear) params.set('year', selectedYear);
        
        const res = await fetch(`/api/search?${params}`);
        const data = await res.json();
        
        setDatasets(data.data);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    }
    
    searchDatasets();
  }, [searchQuery, selectedTaskTypes, selectedModalities, selectedYear, currentPage]);
  
  // 处理搜索提交
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };
  
  // 重置筛选
  const handleReset = () => {
    setSearchQuery('');
    setSelectedTaskTypes([]);
    setSelectedModalities([]);
    setSelectedYear('');
    setCurrentPage(1);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部搜索栏 */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索数据集名称或描述..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              搜索
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              重置
            </button>
          </form>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* 左侧筛选栏 */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4 sticky top-20">
              <h2 className="text-lg font-semibold mb-4">筛选条件</h2>
              
              {/* 任务类型 */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">任务类型</h3>
                <div className="space-y-2">
                  {filterOptions.taskTypes.map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedTaskTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTaskTypes([...selectedTaskTypes, type]);
                          } else {
                            setSelectedTaskTypes(selectedTaskTypes.filter(t => t !== type));
                          }
                        }}
                        className="mr-2 rounded"
                      />
                      <span className="text-sm text-gray-600">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* 数据模态 */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">数据模态</h3>
                <div className="space-y-2">
                  {filterOptions.modalities.map((mod) => (
                    <label key={mod} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedModalities.includes(mod)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedModalities([...selectedModalities, mod]);
                          } else {
                            setSelectedModalities(selectedModalities.filter(m => m !== mod));
                          }
                        }}
                        className="mr-2 rounded"
                      />
                      <span className="text-sm text-gray-600">{mod}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* 发布年份 */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">发布年份</h3>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">全部年份</option>
                  {filterOptions.years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </aside>
          
          {/* 右侧结果列表 */}
          <main className="flex-1">
            <div className="mb-4 text-sm text-gray-600">
              找到 <span className="font-semibold text-blue-600">{total}</span> 个数据集
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">加载中...</p>
              </div>
            ) : datasets.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-600">没有找到匹配的数据集</p>
              </div>
            ) : (
              <div className="space-y-4">
                {datasets.map((dataset) => (
                  <DatasetCard key={dataset.id} dataset={dataset} />
                ))}
              </div>
            )}
            
            {/* 分页 */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  上一页
                </button>
                <span className="px-4 py-2">
                  第 {currentPage} / {totalPages} 页
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  下一页
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// 数据集卡片组件
function DatasetCard({ dataset }: { dataset: Dataset }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-900">{dataset.name}</h3>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
          {dataset.data_modality}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{dataset.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {dataset.task_types.map((type, i) => (
          <span
            key={i}
            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
          >
            {type}
          </span>
        ))}
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
        <div>
          <span className="text-gray-500">图像数量</span>
          <p className="font-medium">{dataset.image_count?.toLocaleString() || 'N/A'}</p>
        </div>
        <div>
          <span className="text-gray-500">存储大小</span>
          <p className="font-medium">{dataset.storage_size}</p>
        </div>
        <div>
          <span className="text-gray-500">发布机构</span>
          <p className="font-medium">{dataset.publisher}</p>
        </div>
        <div>
          <span className="text-gray-500">发布年份</span>
          <p className="font-medium">{dataset.publish_year}</p>
        </div>
      </div>
      
      <div className="flex gap-3">
        <a
          href={`/dataset/${dataset.id}`}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
        >
          查看详情
        </a>
        {dataset.download_url && (
          <a
            href={dataset.download_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
          >
            下载数据集
          </a>
        )}
        {dataset.paper_url && (
          <a
            href={dataset.paper_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
          >
            论文链接
          </a>
        )}
      </div>
    </div>
  );
}
