'use client';

import Link from 'next/link';
import { AnimateIn } from '../ui/AnimateIn';
import { services } from '@/lib/services-data';

export default function Services() {
  return (
    <section id="services" className="py-24 sm:py-32 bg-[#f8f8f8]">
      <div className="section-container">
        <AnimateIn className="mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 mb-3">
            Услуги
          </h2>
          <div className="w-24 h-1 bg-[#b79b6c]" />
        </AnimateIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <AnimateIn key={service.slug} delay={index * 0.1}>
              <Link
                href={`/services/${service.slug}`}
                className="block group"
              >
                <div className="overflow-hidden bg-white shadow-sm hover:shadow-md transition rounded-xl">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  <div className="p-5 text-center">
                    <h3 className="font-display font-bold text-2xl text-gray-900">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mt-2 text-sm">
                      {service.shortDescription}
                    </p>
                  </div>
                </div>
              </Link>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}