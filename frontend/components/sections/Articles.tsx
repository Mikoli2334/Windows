'use client';

import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { AnimateIn } from '../ui/AnimateIn';
import { getLatestArticles } from '@/lib/articles-data';

export default function Articles() {
  const latestArticles = getLatestArticles(3);

  return (
    <section id="articles" className="py-20 sm:py-32 bg-white">
      <div className="section-container">
        <AnimateIn className="text-center mb-12">
          <span className="text-xs font-display font-semibold tracking-[0.2em] uppercase text-green-600 mb-4 block">
            Блог
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-4">
            Полезные статьи
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Советы по уходу за окнами, ремонту, монтажу и выбору комплектующих.
          </p>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestArticles.map((article, index) => (
            <AnimateIn key={article.slug} delay={index * 0.1}>
              <Link href={`/articles/${article.slug}`} className="block h-full group">
                <article className="h-full rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-3 py-1 rounded-full">
                        {article.category}
                      </span>

                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        {article.readTime}
                      </span>
                    </div>

                    <h3 className="font-display font-semibold text-lg text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                      {article.title}
                    </h3>

                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {article.excerpt}
                    </p>

                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-green-700">
                      Читать статью
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              </Link>
            </AnimateIn>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/articles" className="btn-primary inline-flex items-center justify-center">
            Все статьи
          </Link>
        </div>
      </div>
    </section>
  );
}