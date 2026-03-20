'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import { AnimateIn } from '../ui/AnimateIn';
import { api } from '@/lib/api';

export default function Contacts() {
  const [form, setForm] = useState({ name: '', phone: '+375', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;

    setLoading(true);
    setError('');

    try {
      await api.sendContactLead({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        message: form.message.trim() || undefined,
      });

      setSent(true);
    } catch (err: any) {
      setError(err?.message || 'Не удалось отправить. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  const CONTACTS = [
    { icon: Phone, label: 'Телефон', value: '+375 (29) 123-45-67', href: 'tel:+375291234567' },
    { icon: Mail, label: 'Email', value: 'info@eurookna.by', href: 'mailto:info@eurookna.by' },
    { icon: MapPin, label: 'Офис', value: 'г. Минск, ул. Победителей, 1', href: '#' },
    { icon: Clock, label: 'Режим работы', value: 'Пн–Пт 9:00–18:00, Сб 10:00–15:00', href: '#' },
  ];

  return (
    <section id="contacts" className="py-24 sm:py-32 relative gradient-bg">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />

      <div className="section-container">
        <AnimateIn className="text-center mb-16">
          <span className="text-xs font-display font-semibold tracking-[0.2em] uppercase text-green-600 mb-4 block">
            Связь
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-4">
            Контакты
          </h2>
        </AnimateIn>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Contact info */}
          <AnimateIn direction="left">
            <div className="space-y-6">
              {CONTACTS.map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-start gap-4 group p-4 rounded-xl hover:bg-green-50/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition-colors">
                    <Icon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">{label}</div>
                    <div className="text-gray-900 font-medium">{value}</div>
                  </div>
                </a>
              ))}

              <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-50/50 border border-green-200/50">
                <p className="text-gray-600 text-sm leading-relaxed">
                  Работаем по всей Минской области.
                  Бесплатный выезд мастера на замер в пределах 50 км от областного центра.
                </p>
              </div>
            </div>
          </AnimateIn>

          {/* Contact form */}
          <AnimateIn direction="right" delay={0.2}>
            <div className="glass-card glow-border rounded-2xl p-8">
              {sent ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-display font-semibold text-lg text-gray-900 mb-2">Заявка отправлена!</h3>
                  <p className="text-gray-600 text-sm">Мы свяжемся с вами в ближайшее время.</p>

                  <button
                    type="button"
                    onClick={() => {
                      setSent(false);
                      setForm({ name: '', phone: '+375', email: '', message: '' });
                    }}
                    className="btn-secondary mt-6"
                  >
                    Отправить ещё раз
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="font-display font-semibold text-lg text-gray-900 mb-2">Обратная связь</h3>

                  <input
                    type="text"
                    placeholder="Ваше имя"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none transition-colors"
                  />

                  <input
                    type="tel"
                    placeholder="+375 (XX) XXX-XX-XX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none transition-colors"
                  />

                  <input
                    type="email"
                    placeholder="Email (необязательно)"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none transition-colors"
                  />

                  <textarea
                    placeholder="Ваше сообщение..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none transition-colors resize-none"
                  />

                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {loading ? 'Отправляем...' : 'Отправить'}
                  </button>
                </form>
              )}
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}