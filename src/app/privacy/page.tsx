import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '隐私政策 - 遥感数据集搜索引擎',
  description: '遥感数据集搜索引擎的隐私政策',
};

export default function PrivacyPage() {
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
        <h1 className="heading-xl mb-8 text-gray-900">隐私政策</h1>
        
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 space-y-8">
          <section>
            <p className="text-gray-600 mb-4">
              <strong>最后更新日期：</strong>2026 年 5 月 26 日
            </p>
            <p className="text-gray-600">
              欢迎访问遥感数据集搜索引擎（以下简称"本网站"）。本网站致力于为遥感领域的研究者提供数据集检索服务。我们非常重视您的隐私保护，本隐私政策旨在说明我们如何处理信息。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. 信息收集</h2>
            <p className="text-gray-600 mb-4">
              本网站是一个<strong>静态内容展示网站</strong>，我们不会主动收集用户的个人信息。具体来说：
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>我们不要求用户注册或登录</li>
              <li>我们不收集电子邮件地址、姓名、电话号码等个人信息</li>
              <li>我们不使用 Cookie 进行用户追踪</li>
              <li>我们不设置用户账户系统</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. 服务器日志</h2>
            <p className="text-gray-600">
              本网站托管在 Vercel 平台上，Vercel 可能会自动收集标准的服务器日志信息，包括 IP 地址、浏览器类型、访问时间等。这些信息由 Vercel 平台自动处理，用于保障服务的正常运行和安全防护。我们不会主动访问或使用这些日志数据进行用户行为分析。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. 第三方服务</h2>
            <p className="text-gray-600 mb-4">本网站使用以下第三方服务：</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li><strong>Vercel</strong>：网站托管服务</li>
              <li><strong>Supabase</strong>：数据存储服务，仅存储公开的数据集元数据</li>
              <li><strong>Cloudflare</strong>：DNS 解析服务</li>
            </ul>
            <p className="text-gray-600 mt-4">
              这些第三方服务有各自的隐私政策，我们建议您查阅其相关政策以了解它们如何处理数据。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. 数据存储</h2>
            <p className="text-gray-600">
              本网站数据库中存储的所有数据均为公开的遥感数据集元数据信息（如数据集名称、描述、下载链接等），这些信息来源于公开发表的学术论文和官方数据发布平台。我们不存储任何用户个人信息。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. 外部链接</h2>
            <p className="text-gray-600">
              本网站包含指向外部网站的链接（如数据集下载页面、学术论文链接等）。这些外部网站不在我们的控制范围内，我们对其隐私做法不承担责任。我们建议您在离开本网站时查阅目标网站的隐私政策。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. 儿童隐私</h2>
            <p className="text-gray-600">
              本网站面向学术研究人员，不针对 13 岁以下的儿童。我们不会故意收集儿童的个人信息。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. 隐私政策更新</h2>
            <p className="text-gray-600">
              我们可能会不定期更新本隐私政策。更新后的政策将在本页面发布，并更新"最后更新日期"。我们建议您定期查看本页面以了解最新的隐私保护信息。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. 联系我们</h2>
            <p className="text-gray-600">
              如果您对本隐私政策有任何疑问，可以通过以下方式联系我们：
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mt-2">
              <li>GitHub: <a href="https://github.com/Alien-2022/rs-data-hub" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">rs-data-hub</a></li>
            </ul>
          </section>
        </div>

        <footer className="text-center text-gray-500 text-xs sm:text-sm pt-8 border-t border-gray-200 mt-12">
          <div className="flex justify-center gap-4 mb-4">
            <Link href="/privacy" className="text-blue-600 hover:underline">隐私政策</Link>
            <Link href="/terms" className="text-gray-600 hover:text-blue-600 hover:underline">服务条款</Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600 hover:underline">关于我们</Link>
          </div>
          <p>© 2026 遥感数据集搜索引擎 · 为学术研究者服务</p>
        </footer>
      </div>
    </main>
  );
}
