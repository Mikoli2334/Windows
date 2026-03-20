import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ЕвроОкна РБ — Установка пластиковых окон в Беларуси | Конструктор окон',
  description:
    'Профессиональная установка евроокон в Минске и по всей Беларуси. Конструктор окон онлайн, расчёт стоимости, запись на замер. Окна ПВХ от производителя с гарантией 10 лет.',
  keywords:
    'евроокна, пластиковые окна, установка окон Минск, окна ПВХ Беларусь, замена окон, балконный блок, стеклопакеты',
  openGraph: {
    title: 'ЕвроОкна РБ — Установка пластиковых окон',
    description: 'Конструктор окон онлайн. Рассчитайте стоимость и запишитесь на замер за 2 минуты.',
    locale: 'ru_BY',
    type: 'website',
    siteName: 'ЕвроОкна РБ',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#050a15" />
        <link rel="icon" href="/favicon.ico" />
        {/* JSON-LD structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'ЕвроОкна РБ',
              description: 'Установка пластиковых окон в Беларуси',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Минск',
                addressCountry: 'BY',
              },
              telephone: '+375-29-123-45-67',
              openingHours: 'Mo-Fr 09:00-18:00, Sa 10:00-15:00',
              priceRange: 'BYN $$',
              areaServed: 'Беларусь',
            }),
          }}
        />
      </head>
      <body className="gradient-bg min-h-screen">
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
