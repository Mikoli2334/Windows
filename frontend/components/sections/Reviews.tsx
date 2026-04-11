'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { AnimateIn } from '../ui/AnimateIn';
import { api, ReviewResponse } from '@/lib/api';

export default function Reviews() {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);

  useEffect(() => {
    api.getReviews(4).then(setReviews).catch(() => setReviews([]));
  }, []);

  return (
    <section id="reviews" className="py-24 sm:py-32 bg-white">
      <div className="section-container">
        <AnimateIn className="text-center mb-12">
          <span className="text-xs font-display font-semibold tracking-[0.2em] uppercase text-green-600 mb-4 block">
            Отзывы
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-4">
            Что говорят наши клиенты
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Несколько последних отзывов о нашей работе.
          </p>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-display font-semibold text-lg text-gray-900">
                    {review.name}
                  </div>
                  {review.city && (
                    <div className="text-sm text-gray-500">{review.city}</div>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-green-500 text-green-500" />
                  ))}
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">{review.text}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/reviews" className="btn-primary inline-flex">
            Читать все отзывы
          </Link>
        </div>
      </div>
    </section>
  );
}