'use client';

import { Thermometer, Volume2, Shield, Palette, Wrench, Banknote } from 'lucide-react';

import { AnimateIn, StaggerContainer, StaggerItem } from '../ui/AnimateIn';

const ADVANTAGES = [

  {

    icon: Thermometer,

    title: 'Энергосбережение',

    desc: 'Многокамерные профили и энергосберегающие стеклопакеты сохраняют до 40% тепла в доме зимой.',

    accent: 'from-blue-500/20 to-cyan-500/20',

    iconColor: 'text-blue-600',

  },

  {

    icon: Volume2,

    title: 'Шумоизоляция',

    desc: 'Снижение уличного шума до 45 дБ. Спокойный сон даже на оживлённых улицах Минска.',

    accent: 'from-violet-500/20 to-purple-500/20',

    iconColor: 'text-purple-600',

  },

  {

    icon: Shield,

    title: 'Гарантия 12 лет',

    desc: 'Полная гарантия на профиль, стеклопакет и фурнитуру. Бесплатное обслуживание первые 2 года.',

    accent: 'from-emerald-500/20 to-green-500/20',

    iconColor: 'text-emerald-600',

  },

  {

    icon: Palette,

    title: 'Любой дизайн',

    desc: 'Более 50 цветов ламинации, арочные и нестандартные формы. Идеальное решение для вашего интерьера.',

    accent: 'from-orange-500/20 to-amber-500/20',

    iconColor: 'text-orange-600',

  },

  {

    icon: Wrench,

    title: 'Монтаж за 1 день',

    desc: 'Профессиональная бригада установит окна по ГОСТу с минимумом пыли и шума.',

    accent: 'from-rose-500/20 to-pink-500/20',

    iconColor: 'text-rose-600',

  },

  {

    icon: Banknote,

    title: 'Рассрочка 0%',

    desc: 'Беспроцентная рассрочка до 12 месяцев. Первый взнос — от 10%. Без переплат.',

    accent: 'from-sky-500/20 to-cyan-500/20',

    iconColor: 'text-sky-600',

  },

];

export default function Advantages() {

  return (

    <section

      id="advantages"

      className="relative py-20 sm:py-28 overflow-hidden bg-white"

    >

      {/* Background image */}

      <div

        className="absolute inset-0 bg-cover bg-center bg-no-repeat"

        style={{ backgroundImage: "url('/backgrounds/advantages-bg.png')" }}

        aria-hidden="true"

      />

      {/* Soft overlay for readability */}

      <div

        className="absolute inset-0 bg-white/45"

        aria-hidden="true"

      />

      {/* Light gradient to make cards cleaner */}

      <div

        className="absolute inset-0 bg-gradient-to-b from-white/25 via-white/45 to-white/70"

        aria-hidden="true"

      />

      {/* Top divider */}

      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />

      <div className="section-container relative z-10">

        <AnimateIn className="text-center mb-12 sm:mb-14">

          <span className="text-xs font-display font-semibold tracking-[0.2em] uppercase text-green-700 mb-3 block">

            Почему мы

          </span>

          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-4">

            Наши преимущества

          </h2>

          <p className="text-gray-700 max-w-xl mx-auto">

            Более 15 лет опыта и тысячи довольных клиентов по всей Беларуси

          </p>

        </AnimateIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {ADVANTAGES.map(({ icon: Icon, title, desc, accent, iconColor }) => (

            <StaggerItem key={title}>

              <div className="glass-card glow-border rounded-2xl p-7 h-full group hover:shadow-xl hover:border-green-200 transition-all duration-500 cursor-default bg-white/95 backdrop-blur-sm">

                <div

                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500`}

                >

                  <Icon className={`w-7 h-7 ${iconColor}`} />

                </div>

                <h3 className="font-display font-semibold text-lg text-gray-900 mb-3">

                  {title}

                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">

                  {desc}

                </p>

              </div>

            </StaggerItem>

          ))}

        </StaggerContainer>

      </div>

    </section>

  );

}