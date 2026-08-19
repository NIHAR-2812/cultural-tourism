'use client';

import React from 'react';
import Link from 'next/link';
import { Destination } from '@/components/data/mock-data';
import { useRole } from '@/components/role-context';

interface DestinationCardProps {
  destination: Destination;
  aspectRatio?: 'tall' | 'wide' | 'square' | 'normal';
}

const FALLBACK_TRAVEL_IMAGE = 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80';

export function DestinationCard({
  destination,
  aspectRatio = 'normal',
}: DestinationCardProps) {
  const { triggerEcologicalRedirection } = useRole();
  const isFull = destination.isAtCapacity || destination.currentCapacity >= destination.maxCapacity;

  const heightClasses = {
    tall: 'h-[460px]',
    wide: 'h-[320px]',
    square: 'h-[360px]',
    normal: 'h-[390px]',
  };

  return (
    <article className="group space-y-4 text-left border-b border-[#E8E1D1] pb-6">
      
      {/* Large Editorial Photograph */}
      <div className={`relative w-full ${heightClasses[aspectRatio]} overflow-hidden bg-[#EBE4D5]`}>
        <img
          src={destination.coverImage}
          alt={destination.title}
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_TRAVEL_IMAGE;
          }}
          className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-700 ease-out"
        />

        {/* Quiet Resting Note Overlay */}
        {isFull && (
          <div className="absolute top-4 left-4 bg-[#FAF7F2] text-[#C86D51] px-3 py-1 text-xs font-serif-heading italic border border-[#E8E1D1]">
            Destination Resting Today
          </div>
        )}
      </div>

      {/* Editorial Content Block */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#5A6560] font-light">
          <span className="uppercase tracking-widest text-[10px] font-medium text-[#1C242B]">
            {destination.location}
          </span>
          <span>Eco Rating {destination.sustainabilityScore}/100</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold font-serif-heading text-[#1C242B] group-hover:text-[#C86D51] transition-colors leading-tight">
          {destination.title}
        </h3>

        <p className="text-xs text-[#5A6560] font-light line-clamp-2 leading-relaxed">
          {destination.description}
        </p>

        <div className="pt-2 flex items-center justify-between text-xs">
          <span className="font-serif-heading text-lg font-bold text-[#1C242B]">
            ₹{destination.price.toLocaleString('en-IN')} <span className="text-[11px] font-normal text-[#5A6560]">/ night</span>
          </span>

          {isFull ? (
            <button
              onClick={() => triggerEcologicalRedirection(destination.id)}
              className="text-xs font-semibold text-[#C86D51] underline underline-offset-4 decoration-[#C86D51]/50 hover:decoration-[#C86D51] transition-all"
            >
              Resting (15 km Alternatives) →
            </button>
          ) : (
            <Link
              href={`/destinations/${destination.id}`}
              className="text-xs font-semibold text-[#1C242B] underline underline-offset-4 decoration-[#1C242B]/40 hover:decoration-[#C86D51] hover:text-[#C86D51] transition-all"
            >
              Read Sanctuary Story →
            </Link>
          )}
        </div>
      </div>

    </article>
  );
}
