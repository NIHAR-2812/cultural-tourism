'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRole } from '@/components/role-context';
import { DESTINATIONS, ALTERNATIVE_RECOMMENDATIONS } from '@/components/data/mock-data';
import Link from 'next/link';

export function EcoRedirectionModal() {
  const { ecologicalModalOpen, setEcologicalModalOpen, selectedFullDestinationId } = useRole();

  if (!ecologicalModalOpen) return null;

  const currentDest = DESTINATIONS.find((d) => d.id === selectedFullDestinationId) || DESTINATIONS[1];
  const alternatives = ALTERNATIVE_RECOMMENDATIONS[currentDest.id] || [
    {
      id: 'divar-island-sanctuary',
      title: 'Divar Island Eco-Estuary & Bird Sanctuary',
      location: 'Divar Island (6.8 km away)',
      distanceKm: 6.8,
      coverImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      sustainabilityScore: 98,
      currentCapacity: 14,
      maxCapacity: 16,
      price: 12500,
      reason: 'Silent mangrove canoe trails along Mandovi river backwaters with active carrying quota.',
      bonusImpactPoints: 200,
    },
    {
      id: 'agonda-turtle-dunes',
      title: 'Agonda Dune Eco-Retreat & Turtle Sanctuary',
      location: 'Agonda Beach (11.2 km away)',
      distanceKm: 11.2,
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      sustainabilityScore: 96,
      currentCapacity: 10,
      maxCapacity: 18,
      price: 11000,
      reason: 'Low-footprint canvas pavilions along sea turtle protection sand dunes.',
      bonusImpactPoints: 150,
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setEcologicalModalOpen(false)}
          className="fixed inset-0 bg-[#2E2A25]/50 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-[#F5F1EB] border border-[#DDD4C8] p-8 sm:p-12 z-10 my-8 text-[#2E2A25] space-y-8"
        >
          <button
            onClick={() => setEcologicalModalOpen(false)}
            className="absolute top-6 right-6 text-xs text-[#6B635B] underline hover:text-[#2E2A25]"
          >
            Close Journal Entry ✕
          </button>

          <div className="space-y-3 border-b border-[#DDD4C8] pb-6">
            <span className="text-[11px] uppercase font-mono tracking-widest text-[#A65A3A]">
              Land Stewardship Note
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold font-serif-heading text-[#2E2A25]">
              Today this sanctuary rests.
            </h2>
            <p className="text-sm text-[#6B635B] font-light max-w-2xl leading-relaxed">
              To honor the quiet ecological rhythm of{' '}
              <span className="text-[#2E2A25] font-semibold">{currentDest.title}</span>, guest admissions for today have paused. The sanctuary land is taking its natural breathing window.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-[#6B635B]">
              Recommended Sanctuaries Within 15 km
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {alternatives.map((alt) => (
                <article key={alt.id} className="space-y-3 text-left group">
                  <div className="h-52 w-full overflow-hidden bg-[#EBE5DC]">
                    <img
                      src={alt.coverImage}
                      alt={alt.title}
                      className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono text-[#A65A3A]">
                      {alt.distanceKm} km away • {alt.location}
                    </span>
                    <h4 className="text-2xl font-bold font-serif-heading text-[#2E2A25] group-hover:text-[#A65A3A] transition-colors">
                      {alt.title}
                    </h4>
                    <p className="text-xs text-[#6B635B] font-light italic leading-relaxed">
                      &quot;{alt.reason}&quot;
                    </p>
                  </div>

                  <div className="pt-2 flex justify-between items-center text-xs">
                    <span className="font-serif-heading font-bold text-[#2E2A25] text-base">
                      ₹{alt.price.toLocaleString('en-IN')} / night
                    </span>
                    <Link
                      href={`/destinations/${alt.id}`}
                      onClick={() => setEcologicalModalOpen(false)}
                      className="font-semibold text-[#2E2A25] underline underline-offset-4 decoration-[#A65A3A]/50 hover:text-[#A65A3A]"
                    >
                      Read Sanctuary Story →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#DDD4C8] text-xs text-[#6B635B] font-light text-center">
            Thank you for traveling mindfully and respecting ecological carrying limits.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
