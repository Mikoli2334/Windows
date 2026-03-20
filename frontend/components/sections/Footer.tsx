'use client';

import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 py-12 bg-gray-50">
      <div className="section-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8">
                <svg viewBox="0 0 40 40" className="w-full h-full">
                  <rect x="4" y="4" width="32" height="32" rx="4" fill="none" stroke="url(#fGrad)" strokeWidth="2"/>
                  <line x1="20" y1="4" x2="20" y2="36" stroke="url(#fGrad)" strokeWidth="1.5"/>
                  <line x1="4" y1="20" x2="36" y2="20" stroke="url(#fGrad)" strokeWidth="1.5"/>
                  <defs>
                    <linearGradient id="fGrad" x1="0" y1="0" x2="40" y2="40">
                      <stop offset="0%" stopColor="#7cb342"/>
                      <stop offset="100%" stopColor="#8bc34a"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="font-display font-bold text-gray-900">
                Эвлон-<span className="text-green-600">М</span>
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Профессиональная установка пластиковых окон по всей Беларуси с гарантией 12 лет.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-sm text-gray-900 mb-4">Услуги</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#types" className="hover:text-green-600 transition-colors">Окна ПВХ</a></li>
              <li><a href="#types" className="hover:text-green-600 transition-colors">Балконные блоки</a></li>
              <li><a href="#types" className="hover:text-green-600 transition-colors">Панорамное остекление</a></li>
              <li><a href="#constructor" className="hover:text-green-600 transition-colors">Конструктор окон</a></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-display font-semibold text-sm text-gray-900 mb-4">Информация</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#advantages" className="hover:text-green-600 transition-colors">О компании</a></li>
              <li><a href="#process" className="hover:text-green-600 transition-colors">Как мы работаем</a></li>
              <li><a href="#appointment" className="hover:text-green-600 transition-colors">Запись на замер</a></li>
              <li><a href="#contacts" className="hover:text-green-600 transition-colors">Контакты</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-sm text-gray-900 mb-4">Контакты</h4>
            <div className="space-y-3 text-sm text-gray-600">
              <a href="tel:+375291234567" className="flex items-center gap-2 hover:text-green-600 transition-colors">
                <Phone className="w-4 h-4" /> +375 (29) 123-45-67
              </a>
              <a href="mailto:info@eurookna.by" className="flex items-center gap-2 hover:text-green-600 transition-colors">
                <Mail className="w-4 h-4" /> info@eurookna.by
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" /> г. Минск, ул. Чкалова, д. 1, корпус 2,оф .30 
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Эвлон-М РБ. Все права защищены.
          </p>
          <p className="text-xs text-gray-500">
            УНП 790823293 | Свидетельство №12345
          </p>
        </div>
      </div>
    </footer>
  );
}