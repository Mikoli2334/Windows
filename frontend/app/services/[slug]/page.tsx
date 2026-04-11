import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServiceBySlug, services } from '@/lib/services-data';

type Props = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export default function ServiceDetailsPage({ params }: Props) {
  const service = getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="py-16 sm:py-24 bg-[#f8f8f8]">
        <div className="section-container">
          <Link
            href="/"
            className="inline-flex text-sm text-green-700 hover:text-green-800 mb-6"
          >
            ← Назад на главную
          </Link>

          <div className="grid lg:grid-cols-2 gap-10 items-start mb-14">
            <div>
              <h1 className="font-display font-bold text-4xl sm:text-5xl text-gray-900 mb-6">
                {service.title}
              </h1>

              <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                {service.intro.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-10">
                <Link
                  href="/#appointment"
                  className="inline-flex items-center justify-center rounded-xl px-6 py-3 bg-green-500 text-white font-semibold hover:bg-green-600 transition"
                >
                  Записаться на услугу
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl shadow-md">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-12">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="font-display font-semibold text-2xl text-gray-900 mb-5">
                {service.reasonsTitle}
              </h2>
              <ul className="space-y-3">
                {service.reasons.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-700">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-green-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="font-display font-semibold text-2xl text-gray-900 mb-5">
                {service.processTitle}
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                {service.process.map((item, index) => (
                  <p key={index}>{item}</p>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="font-display font-semibold text-2xl text-gray-900 mb-5">
                {service.pricingTitle}
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                {service.pricing.map((item, index) => (
                  <p key={index}>{item}</p>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="font-display font-semibold text-2xl text-gray-900 mb-5">
                {service.whyUsTitle}
              </h2>
              <ul className="space-y-3">
                {service.whyUs.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-700">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-green-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}