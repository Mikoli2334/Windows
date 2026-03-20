'use client';

import { AnimateIn, StaggerContainer, StaggerItem } from '../ui/AnimateIn';
import { PhoneCall, Ruler, Factory, Hammer, ThumbsUp } from 'lucide-react';

const STEPS = [
  { icon: PhoneCall, title: 'Заявка', desc: 'Оставьте заявку на сайте или позвоните нам. Консультация бесплатная.', num: '01' },
  { icon: Ruler, title: 'Замер', desc: 'Мастер приедет в удобное время и сделает точные замеры бесплатно.', num: '02' },
  { icon: Factory, title: 'Производство', desc: 'Изготовим окна на современном оборудовании за 5–7 рабочих дней.', num: '03' },
  { icon: Hammer, title: 'Монтаж', desc: 'Профессиональная установка по ГОСТу за 1 день с гарантией.', num: '04' },
  { icon: ThumbsUp, title: 'Готово', desc: 'Принимайте работу и наслаждайтесь комфортом. Гарантия 10 лет.', num: '05' },
];

export default function Process() {
  return (
    <section id="process" className="py-24 sm:py-32 relative gradient-bg cloudy-bg">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />

      <div className="section-container">
        <AnimateIn className="text-center mb-16">
          <span className="text-xs font-display font-semibold tracking-[0.2em] uppercase text-green-600 mb-4 block">
            Процесс
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-4">
            Как мы работаем
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            От заявки до установки — 5 простых шагов
          </p>
        </AnimateIn>

        <StaggerContainer className="relative">
          {/* Connecting line */}
          <div className="absolute top-0 bottom-0 left-6 lg:left-1/2 w-px bg-gradient-to-b from-green-500/30 via-green-300/20 to-green-500/30 hidden sm:block" />

          <div className="space-y-8 lg:space-y-12">
            {STEPS.map(({ icon: Icon, title, desc, num }, i) => (
              <StaggerItem key={num}>
                <div className={`flex items-start gap-6 lg:gap-12 ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  {/* Number circle */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-white border-2 border-green-500/40 flex items-center justify-center shadow-md">
                      <span className="font-display font-bold text-sm text-green-600">{num}</span>
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    className={`glass-card rounded-2xl p-6 flex-1 max-w-md hover-lift ${
                      i % 2 === 1 ? 'lg:text-right lg:ml-auto' : ''
                    }`}
                  >
                    <div className={`flex items-center gap-3 mb-3 ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                      <Icon className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <h3 className="font-display font-semibold text-lg text-gray-900">{title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}