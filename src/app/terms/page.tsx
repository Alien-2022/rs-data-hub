import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '服务条款 - 遥感数据集搜索引擎',
  description: '遥感数据集搜索引擎的服务条款',
};

export default function TermsPage() {
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
              <Link href="/about" className="text-sm sm:text-base text-gray-600 hover:text-blue-600 transition font-medium">
                关于
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <h1 className="heading-xl mb-8 text-gray-900">服务条款</h1>
        
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 space-y-8">
          <section>
            <p className="text-gray-600 mb-4">
              <strong>最后更新日期：</strong>2026 年 5 月 26 日
            </p>
            <p className="text-gray-600">
              欢迎使用遥感数据集搜索引擎（以下简称&quot;本网站&quot;）。在使用本网站之前，请仔细阅读以下服务条款。访问或使用本网站即表示您同意遵守这些条款。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. 服务说明</h2>
            <p className="text-gray-600">
              本网站是一个免费的遥感数据集信息聚合搜索引擎，旨在帮助研究人员和学者发现和了解公开可用的遥感影像数据集。本网站仅提供数据集的元数据信息和导航链接，不直接托管或分发任何数据集文件。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. 使用条件</h2>
            <p className="text-gray-600 mb-4">使用本网站，您同意：</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>将本网站用于合法的学术研究和教育目的</li>
              <li>不以任何方式干扰或破坏本网站的正常运行</li>
              <li>不使用自动化工具大规模抓取本网站内容</li>
              <li>遵守各数据集原始来源的使用条款和许可协议</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. 知识产权</h2>
            <p className="text-gray-600">
              本网站的设计、代码和原创内容采用开源协议发布。网站上展示的数据集信息来源于公开发表的学术论文和官方数据发布平台，相关版权归原作者和机构所有。数据集的使用需遵循各数据集指定的许可协议。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. 免责声明</h2>
            <p className="text-gray-600 mb-4">
              本网站按&ldquo;现状&rdquo;提供服务，我们不对以下情况承担责任：
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>数据集信息的准确性、完整性或时效性</li>
              <li>外部链接网站的内容、安全性或可用性</li>
              <li>因使用本网站或第三方数据集而产生的任何损失</li>
              <li>网站服务的中断或不可用</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. 第三方链接</h2>
            <p className="text-gray-600">
              本网站包含指向第三方网站的链接，这些链接仅为方便用户而提供。我们对第三方网站的内容不承担任何责任，也不对其可用性或安全性做出任何保证。访问第三方网站的风险由用户自行承担。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. 服务变更</h2>
            <p className="text-gray-600">
              我们保留随时修改、暂停或终止本网站服务的权利，无需事先通知。我们可能会定期更新数据集信息和网站功能。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. 条款更新</h2>
            <p className="text-gray-600">
              我们可能会不时更新这些服务条款。更新后的条款将在本页面发布并立即生效。继续使用本网站即表示您接受修改后的条款。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. 联系方式</h2>
            <p className="text-gray-600">
              如果您对这些服务条款有任何疑问，请通过以下方式联系我们：
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mt-2">
              <li>GitHub: <a href="https://github.com/Alien-2022/rs-data-hub" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">rs-data-hub</a></li>
            </ul>
          </section>
        </div>

        <footer className="text-center text-gray-500 text-xs sm:text-sm pt-8 border-t border-gray-200 mt-12">
          <div className="flex justify-center gap-4 mb-4">
            <Link href="/privacy" className="text-gray-600 hover:text-blue-600 hover:underline">隐私政策</Link>
            <Link href="/terms" className="text-blue-600 hover:underline">服务条款</Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600 hover:underline">关于我们</Link>
          </div>
          <p>© 2026 遥感数据集搜索引擎 · 为学术研究者服务</p>
        </footer>
      </div>
    </main>
  );
}
