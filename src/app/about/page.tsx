import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '关于我们 - 遥感数据集搜索引擎',
  description: '了解遥感数据集搜索引擎的背景和目标',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent hidden xs:block group-hover:opacity-80 transition">
                遥感数据集搜索引擎
              </span>
            </Link>
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/search" className="text-sm sm:text-base text-gray-600 hover:text-blue-600 transition font-medium">
                搜索
              </Link>
              <Link href="/about" className="text-sm sm:text-base text-blue-600 font-medium">
                关于
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <h1 className="heading-xl mb-8 text-gray-900">关于我们</h1>
        
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">项目简介</h2>
            <p className="text-gray-600">
              遥感数据集搜索引擎是一个专注于深度学习遥感影像数据集的信息聚合平台。我们致力于帮助遥感领域的研究人员和学者快速发现、了解和访问公开可用的遥感数据集。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">项目背景</h2>
            <p className="text-gray-600 mb-4">
              随着深度学习在遥感领域的广泛应用，越来越多的遥感数据集被发布。然而，这些数据集分散在不同的平台和论文中，研究人员往往需要花费大量时间来寻找合适的数据集。本项目旨在解决这个问题，通过统一的搜索和筛选功能，帮助用户快速找到所需的数据集。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">功能特点</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-3 ml-4">
              <li><strong>多维搜索</strong>：支持按数据集名称、任务类型、数据模态、发布年份等维度进行筛选</li>
              <li><strong>详细信息</strong>：提供数据集的完整描述、规模、分辨率、许可协议等关键信息</li>
              <li><strong>学术导向</strong>：直接链接到原始论文和数据集下载页面</li>
              <li><strong>免费开放</strong>：所有功能完全免费，无需注册即可使用</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">技术栈</h2>
            <p className="text-gray-600 mb-4">本网站使用以下技术构建：</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li><strong>前端框架</strong>：Next.js (React)</li>
              <li><strong>样式</strong>：Tailwind CSS</li>
              <li><strong>数据库</strong>：Supabase (PostgreSQL)</li>
              <li><strong>部署</strong>：Vercel</li>
              <li><strong>DNS</strong>：Cloudflare</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">开源项目</h2>
            <p className="text-gray-600 mb-4">
              本项目是一个开源项目，代码托管在 GitHub 上。我们欢迎社区的贡献和反馈：
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <a 
                href="https://github.com/Alien-2022/rs-data-hub" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                https://github.com/Alien-2022/rs-data-hub
              </a>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">数据来源</h2>
            <p className="text-gray-600">
              本网站收录的数据集信息来源于公开发表的学术论文、官方数据发布平台以及研究人员的推荐。我们会定期更新和扩充数据集列表，确保信息的准确性和时效性。所有数据集均遵循其原始许可协议。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">联系我们</h2>
            <p className="text-gray-600">
              如果您有任何问题、建议或合作意向，欢迎通过 GitHub 与我们联系。我们重视每一位用户的反馈，这将帮助我们不断改进和完善服务。
            </p>
          </section>
        </div>

        <footer className="text-center text-gray-500 text-xs sm:text-sm pt-8 border-t border-gray-200 mt-12">
          <div className="flex justify-center gap-4 mb-4">
            <Link href="/privacy" className="text-gray-600 hover:text-blue-600 hover:underline">隐私政策</Link>
            <Link href="/terms" className="text-gray-600 hover:text-blue-600 hover:underline">服务条款</Link>
            <Link href="/about" className="text-blue-600 hover:underline">关于我们</Link>
          </div>
          <p>© 2026 遥感数据集搜索引擎 · 为学术研究者服务</p>
        </footer>
      </div>
    </main>
  );
}
