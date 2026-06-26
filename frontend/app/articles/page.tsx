import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { articles } from '@/lib/articles-data';

export const metadata = {
  title: 'Полезные статьи — Эвлон-М',
  description: 'Статьи о пластиковых окнах, ремонте, монтаже, подоконниках и уходе за окнами.',
};

export default function ArticlesPage() {
  return (
    <main className="min-h-screen bg-[#f8f8f8] py-16 sm:py-24">
      <div className="section-container">
        <Link href="/" className="inline-flex text-sm text-green-700 hover:text-green-800 mb-6">
          ← Назад на главную
        </Link>

        <div className="mb-12">
          <span className="text-xs font-display font-semibold tracking-[0.2em] uppercase text-green-600 mb-4 block">
            Блог
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-gray-900 mb-4">
            Полезные статьи
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Простые объяснения, советы и рекомендации по пластиковым окнам, ремонту,
            монтажу и уходу.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article) => (
            <Link key={article.slug} href={`/articles/${article.slug}`} className="group">
              <article className="h-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-3 py-1 rounded-full">
                      {article.category}
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readTime}
                    </span>
                  </div>

                  <h2 className="font-display font-semibold text-2xl text-gray-900 mb-3 group-hover:text-green-700 transition-colors">
                    {article.title}
                  </h2>

                  <p className="text-gray-600 leading-relaxed mb-5">
                    {article.excerpt}
                  </p>

                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-green-700">
                    Читать полностью
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}