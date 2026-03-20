'use client';

import { motion } from 'framer-motion';
import { AnimateIn, StaggerContainer, StaggerItem } from '../ui/AnimateIn';
import { ChevronRight } from 'lucide-react';

interface WindowTypeDef {
  slug: string;
  name: string;
  desc: string;
  price: string;
  sections: number;
  svgContent: JSX.Element;
}

const WINDOW_TYPES: WindowTypeDef[] = [
  {
    slug: 'single',
    name: 'Одностворчатое',
    desc: 'Для небольших проёмов',
    price: 'от 180 BYN',
    sections: 1,
    svgContent: (
      <svg viewBox="0 0 120 160" className="w-full h-full">
        <rect x="10" y="10" width="100" height="140" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <rect x="16" y="16" width="88" height="128" rx="2" fill="rgba(124,179,66,0.08)" />
        <rect x="94" y="70" width="5" height="24" rx="2.5" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
  {
    slug: 'double',
    name: 'Двухстворчатое',
    desc: 'Самый популярный вариант',
    price: 'от 280 BYN',
    sections: 2,
    svgContent: (
      <svg viewBox="0 0 160 160" className="w-full h-full">
        <rect x="10" y="10" width="140" height="140" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <line x1="80" y1="10" x2="80" y2="150" stroke="currentColor" strokeWidth="2" />
        <rect x="16" y="16" width="58" height="128" rx="2" fill="rgba(124,179,66,0.08)" />
        <rect x="86" y="16" width="58" height="128" rx="2" fill="rgba(124,179,66,0.05)" />
        <rect x="70" y="70" width="5" height="24" rx="2.5" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
  {
    slug: 'triple',
    name: 'Трёхстворчатое',
    desc: 'Для широких проёмов',
    price: 'от 420 BYN',
    sections: 3,
    svgContent: (
      <svg viewBox="0 0 200 160" className="w-full h-full">
        <rect x="10" y="10" width="180" height="140" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <line x1="70" y1="10" x2="70" y2="150" stroke="currentColor" strokeWidth="2" />
        <line x1="130" y1="10" x2="130" y2="150" stroke="currentColor" strokeWidth="2" />
        <rect x="16" y="16" width="48" height="128" rx="2" fill="rgba(124,179,66,0.08)" />
        <rect x="76" y="16" width="48" height="128" rx="2" fill="rgba(124,179,66,0.05)" />
        <rect x="136" y="16" width="48" height="128" rx="2" fill="rgba(139,195,74,0.06)" />
        <rect x="60" y="70" width="5" height="24" rx="2.5" fill="currentColor" opacity="0.5" />
        <rect x="120" y="70" width="5" height="24" rx="2.5" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
  {
    slug: 'balcony',
    name: 'Балконный блок',
    desc: 'Дверь + окно',
    price: 'от 550 BYN',
    sections: 2,
    svgContent: (
      <svg viewBox="0 0 180 200" className="w-full h-full">
        <rect x="10" y="10" width="80" height="180" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <rect x="90" y="50" width="80" height="140" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <rect x="16" y="16" width="68" height="168" rx="2" fill="rgba(124,179,66,0.08)" />
        <rect x="96" y="56" width="68" height="128" rx="2" fill="rgba(139,195,74,0.06)" />
        <rect x="78" y="100" width="5" height="24" rx="2.5" fill="currentColor" opacity="0.5" />
        <rect x="158" y="110" width="5" height="24" rx="2.5" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
  {
    slug: 'panoramic',
    name: 'Панорамное',
    desc: 'Максимум света',
    price: 'от 900 BYN',
    sections: 4,
    svgContent: (
      <svg viewBox="0 0 240 160" className="w-full h-full">
        <rect x="10" y="10" width="220" height="140" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <line x1="65" y1="10" x2="65" y2="150" stroke="currentColor" strokeWidth="1.5" />
        <line x1="120" y1="10" x2="120" y2="150" stroke="currentColor" strokeWidth="1.5" />
        <line x1="175" y1="10" x2="175" y2="150" stroke="currentColor" strokeWidth="1.5" />
        <rect x="16" y="16" width="43" height="128" rx="2" fill="rgba(124,179,66,0.06)" />
        <rect x="71" y="16" width="43" height="128" rx="2" fill="rgba(124,179,66,0.04)" />
        <rect x="126" y="16" width="43" height="128" rx="2" fill="rgba(124,179,66,0.06)" />
        <rect x="181" y="16" width="43" height="128" rx="2" fill="rgba(139,195,74,0.05)" />
      </svg>
    ),
  },
  {
    slug: 'arched',
    name: 'Арочное',
    desc: 'Эксклюзивный дизайн',
    price: 'от 650 BYN',
    sections: 1,
    svgContent: (
      <svg viewBox="0 0 120 180" className="w-full h-full">
        <path
          d="M 10 80 L 10 170 Q 10 176 16 176 L 104 176 Q 110 176 110 170 L 110 80 Q 110 20 60 20 Q 10 20 10 80 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path
          d="M 16 80 L 16 168 L 104 168 L 104 80 Q 104 28 60 28 Q 16 28 16 80 Z"
          fill="rgba(124,179,66,0.08)"
        />
        <rect x="94" y="110" width="5" height="24" rx="2.5" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
];

export default function WindowTypes() {
  return (
    // ✅ добавили grid-glow-bg (его CSS уже должен быть в globals.css)
    <section id="types" className="py-24 sm:py-32 relative gradient-bg grid-glow-bg">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />

      <div className="section-container">
        <AnimateIn className="text-center mb-16">
          <span className="text-xs font-display font-semibold tracking-[0.2em] uppercase text-green-600 mb-4 block">
            Каталог
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-4">
            Типы окон
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Выберите подходящий тип и настройте в конструкторе под ваши размеры
          </p>
        </AnimateIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WINDOW_TYPES.map((wt) => (
            <StaggerItem key={wt.slug}>
              <a
                href="#constructor"
                className="glass-card rounded-2xl p-6 block group hover:shadow-xl hover:border-green-200 transition-all duration-500"
              >
                <div className="h-40 flex items-center justify-center text-gray-300 group-hover:text-green-500/60 transition-colors duration-500 mb-6">
                  {wt.svgContent}
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-lg text-gray-900 mb-1">{wt.name}</h3>
                    <p className="text-sm text-gray-600">{wt.desc}</p>
                  </div>

                  <div className="text-right">
                    <div className="font-display font-bold text-green-600">{wt.price}</div>
                    <div className="flex items-center justify-end gap-1 text-xs text-gray-500 mt-1 group-hover:text-green-600 transition-colors">
                      Выбрать <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </a>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}