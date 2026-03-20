'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Shield, Clock, Award } from 'lucide-react';

const STATS = [
  { icon: Shield, value: '10 лет', label: 'гарантия' },
  { icon: Clock, value: '1 день', label: 'установка' },
  { icon: Award, value: '5000+', label: 'объектов' },
];

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] overflow-hidden pt-28 pb-16 gradient-bg-hero cloudy-bg">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(124,179,66,0.08) 0%, transparent 70%)',
          }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute -bottom-60 -left-40 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139,195,74,0.06) 0%, transparent 70%)',
          }}
          animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="section-container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-50 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-green-700 tracking-wide">
              Работаем по всей Минской области
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-6"
          >
            <span className="text-gray-900">Эвлон-М</span>
            <br />
            <span className="text-gradient">новое поколение</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Сконфигурируйте идеальное окно в нашем 3D-конструкторе,
            рассчитайте стоимость онлайн и запишитесь на бесплатный замер
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
          >
            <a href="#constructor" className="btn-primary text-base">
              Открыть конструктор
            </a>
            <a href="#appointment" className="btn-secondary text-base">
              Записаться на замер
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="grid grid-cols-3 gap-6 max-w-lg mx-auto"
          >
            {STATS.map(({ icon: Icon, value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.15 }}
                className="text-center"
              >
                <Icon className="w-5 h-5 text-green-600 mx-auto mb-2" />
                <div className="font-display font-bold text-xl sm:text-2xl text-gray-900">{value}</div>
                <div className="text-xs text-gray-500 mt-1">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ArrowDown className="w-5 h-5 text-gray-400" />
          </motion.div>
        </motion.div>
      </div>

      {/* Window illustration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.04, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[600px] hidden xl:block"
      >
        <svg viewBox="0 0 400 500" className="w-full h-full">
          <rect x="40" y="40" width="320" height="420" rx="8" fill="none" stroke="#7cb342" strokeWidth="3"/>
          <line x1="200" y1="40" x2="200" y2="460" stroke="#7cb342" strokeWidth="2"/>
          <line x1="40" y1="250" x2="200" y2="250" stroke="#7cb342" strokeWidth="1.5"/>
          <rect x="50" y="50" width="140" height="190" rx="2" fill="rgba(124,179,66,0.08)"/>
          <rect x="210" y="50" width="140" height="400" rx="2" fill="rgba(124,179,66,0.05)"/>
          <rect x="50" y="260" width="140" height="190" rx="2" fill="rgba(139,195,74,0.06)"/>
          <rect x="180" y="140" width="8" height="30" rx="4" fill="#7cb342"/>
          <rect x="340" y="240" width="8" height="30" rx="4" fill="#7cb342"/>
        </svg>
      </motion.div>
    </section>
  );
}