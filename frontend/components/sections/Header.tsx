'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Menu, X, ChevronRight } from 'lucide-react';

const NAV_ITEMS = [
  { href: '#advantages', label: 'Преимущества' },
  { href: '#types', label: 'Типы окон' },
  { href: '#services', label: 'Услуги' },
  { href: '#constructor', label: 'Конструктор' },
  { href: '#process', label: 'Как мы работаем' },
  { href: '#appointment', label: 'Запись' },
  { href: '#contacts', label: 'Контакты' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'py-3 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="section-container flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <svg viewBox="0 0 40 40" className="w-full h-full">
                <rect
                  x="4"
                  y="4"
                  width="32"
                  height="32"
                  rx="4"
                  fill="none"
                  stroke="url(#logoGrad)"
                  strokeWidth="2"
                />
                <line x1="20" y1="4" x2="20" y2="36" stroke="url(#logoGrad)" strokeWidth="1.5" />
                <line x1="4" y1="20" x2="36" y2="20" stroke="url(#logoGrad)" strokeWidth="1.5" />
                <rect x="8" y="8" width="10" height="10" rx="1" fill="rgba(124,179,66,0.15)" />
                <rect x="22" y="22" width="10" height="10" rx="1" fill="rgba(139,195,74,0.1)" />
                <defs>
                  <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40">
                    <stop offset="0%" stopColor="#7cb342" />
                    <stop offset="100%" stopColor="#8bc34a" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight text-gray-900">
                Эвлон-<span className="text-green-600">М</span>
              </span>
              <span className="block text-[10px] text-gray-500 font-medium tracking-widest uppercase">
                Беларусь
              </span>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm text-gray-700 hover:text-green-600 font-medium rounded-lg hover:bg-green-50 transition-all duration-300"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+375291234567"
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-green-600 transition-colors"
            >
              <Phone className="w-4 h-4" />
              +375 (29) 123-45-67
            </a>
            <a href="#constructor" className="btn-primary text-xs !py-3 !px-6">
              Рассчитать стоимость
              <ChevronRight className="inline w-4 h-4 ml-1" />
            </a>
          </div>

          <button
            className="lg:hidden p-2 text-gray-700"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Меню"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6"
          >
            <nav className="flex flex-col gap-2">
              {NAV_ITEMS.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setMobileOpen(false)}
                  className="py-4 px-4 text-lg font-display font-medium text-gray-800 hover:text-green-600 border-b border-gray-100 transition-colors"
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>

            <div className="mt-8 space-y-4">
              <a
                href="tel:+375291234567"
                className="flex items-center gap-3 text-green-600 font-medium"
              >
                <Phone className="w-5 h-5" />
                +375 (29) 123-45-67
              </a>
              <a
                href="#constructor"
                onClick={() => setMobileOpen(false)}
                className="btn-primary block text-center"
              >
                Рассчитать стоимость
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}