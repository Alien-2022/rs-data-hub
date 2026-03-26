import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 顶部导航栏 */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">遥</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                遥感数据集搜索引擎
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/search"
                className="text-gray-600 hover:text-blue-600 transition font-medium"
              >
                搜索
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition font-medium"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容区 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero 区域 */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="heading-xl mb-6 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 bg-clip-text text-transparent">
            遥感数据集搜索引擎
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
            专注于深度学习遥感影像数据集的整理与推荐
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full text-green-700 font-medium mb-8">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            已收录 20 个经典数据集，共约 89 万张图像
          </div>
          
          {/* CTA 按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/search"
              className="btn btn-primary px-8 py-4 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              开始搜索数据集
            </Link>
            <Link
              href="/dataset/0b22780a-62b6-4cf0-8e3e-74d5db9b0820"
              className="btn btn-secondary px-8 py-4 text-lg"
            >
              查看示例
            </Link>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="card hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg text-2xl">
                📊
              </div>
              <h3 className="heading-sm">数据规模</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">20+</p>
            <p className="text-gray-600">经典遥感数据集</p>
            <p className="text-gray-600 mt-1">涵盖 89 万 + 图像</p>
          </div>

          <div className="card hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg text-2xl">
                🔍
              </div>
              <h3 className="heading-sm">多维搜索</h3>
            </div>
            <p className="text-gray-900 mb-2">按任务类型筛选</p>
            <p className="text-gray-600">目标检测、语义分割、</p>
            <p className="text-gray-600">场景分类等 12 种类型</p>
          </div>

          <div className="card hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg text-2xl">
                📚
              </div>
              <h3 className="heading-sm">学术导向</h3>
            </div>
            <p className="text-gray-900 mb-2">完整学术资源</p>
            <p className="text-gray-600">论文链接、DOI、</p>
            <p className="text-gray-600">BibTeX 引用一键导出</p>
          </div>
        </div>

        {/* 特性说明 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="heading-md mb-6 text-center">全面覆盖遥感数据集</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                任务类型覆盖
              </h3>
              <div className="flex flex-wrap gap-2">
                {['目标检测', '语义分割', '场景分类', '变化检测', '实例分割', '旋转目标检测'].map((type) => (
                  <span key={type} className="tag tag-primary">
                    {type}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                数据模态覆盖
              </h3>
              <div className="flex flex-wrap gap-2">
                {['光学', '航拍', '多光谱', 'SAR', '无人机', '高光谱'].map((modality) => (
                  <span key={modality} className="tag tag-gray">
                    {modality}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 页脚 */}
        <footer className="text-center text-gray-500 text-sm pt-8 border-t border-gray-200">
          <p>© 2026 遥感数据集搜索引擎 · 为学术研究者服务</p>
        </footer>
      </div>
    </main>
  );
}
