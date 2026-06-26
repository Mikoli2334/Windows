import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock } from 'lucide-react';
import { articles, getArticleBySlug } from '@/lib/articles-data';

type Props = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export function generateMetadata({ params }: Props) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: 'Статья не найдена — Эвлон-М',
    };
  }

  return {
    title: `${article.title} — Эвлон-М`,
    description: article.excerpt,
  };
}

export default function ArticleDetailsPage({ params }: Props) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="py-16 sm:py-24 bg-[#f8f8f8]">
        <div className="section-container">
          <Link href="/articles" className="inline-flex text-sm text-green-700 hover:text-green-800 mb-6">
            ← Все статьи
          </Link>

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-3 py-1 rounded-full">
                {article.category}
              </span>

              <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {article.readTime}
              </span>
            </div>

            <div className="mb-6 rounded-2xl bg-white border border-gray-200 p-5 shadow-sm max-w-2xl">
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500 mb-1">Автор</div>
                  <div className="font-semibold text-gray-900">Специалист компании Эвлон-М</div>
                  <div className="text-gray-500">ремонт и обслуживание окон</div>
                </div>

                <div>
                  <div className="text-gray-500 mb-1">Статья опубликована</div>
                  <div className="font-semibold text-gray-900">
                    {new Date(article.date).toLocaleDateString('ru-RU')}
                  </div>
                  <div className="text-gray-500">обновлено для клиентов в Минске и области</div>
                </div>
              </div>
            </div>

            <h1 className="font-display font-bold text-4xl sm:text-5xl text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
              {article.excerpt}
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-3xl shadow-md mb-10">
              <img
                src={article.image}
                alt={article.title}
                className="w-full aspect-[16/9] object-cover"
              />
            </div>

            <article>
              {article.sections.map((section) => (
                <section key={section.title} className="mb-10">
                  <h2 className="font-display font-semibold text-2xl sm:text-3xl text-gray-900 mb-4">
                    {section.title}
                  </h2>

                  <div className="space-y-4">
                    {section.paragraphs.map((paragraph, index) => (
                      <p key={index} className="text-gray-700 text-base sm:text-lg leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </article>

            <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-green-50 border border-green-100">
              <h2 className="font-display font-semibold text-2xl text-gray-900 mb-3">
                Нужна помощь с окнами?
              </h2>

              <p className="text-gray-600 mb-6">
                Оставьте заявку — мы проконсультируем, подскажем решение и при необходимости
                запишем на замер.
              </p>

              <Link href="/#appointment" className="btn-primary inline-flex">
                Записаться на замер
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}