'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { api, ReviewResponse } from '@/lib/api';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    city: '',
    rating: 5,
    text: '',
  });

  const loadReviews = async () => {
    try {
      const data = await api.getReviews();
      setReviews(data);
    } catch {
      setReviews([]);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      await api.createReview({
        name: form.name,
        city: form.city || undefined,
        rating: form.rating,
        text: form.text,
      });

      setSuccess('Спасибо! Ваш отзыв добавлен.');
      setForm({
        name: '',
        city: '',
        rating: 5,
        text: '',
      });

      await loadReviews();
    } catch (err: any) {
      setError(err?.message || 'Не удалось отправить отзыв');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f8f8] py-16 sm:py-24">
      <div className="section-container">
        <Link href="/" className="inline-flex text-sm text-green-700 hover:text-green-800 mb-6">
          ← Назад на главную
        </Link>

        <div className="mb-12">
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-gray-900 mb-4">
            Отзывы клиентов
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Здесь вы можете прочитать отзывы о нашей работе и оставить свой.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
            <h2 className="font-display font-semibold text-2xl text-gray-900 mb-6">
              Оставить отзыв
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Ваше имя"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:outline-none"
                required
              />

              <input
                type="text"
                placeholder="Город"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:outline-none"
              />

              <select
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:outline-none"
              >
                <option value={5}>5 звёзд</option>
                <option value={4}>4 звезды</option>
                <option value={3}>3 звезды</option>
                <option value={2}>2 звезды</option>
                <option value={1}>1 звезда</option>
              </select>

              <textarea
                placeholder="Ваш отзыв"
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:outline-none resize-none"
                required
              />

              {success && <p className="text-green-600 text-sm">{success}</p>}
              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-60"
              >
                {loading ? 'Отправляем...' : 'Оставить отзыв'}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200"
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

                  <div className="flex gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-green-500 text-green-500" />
                    ))}
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}