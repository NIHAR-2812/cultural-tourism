'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { DESTINATIONS, Destination } from '@/components/data/mock-data';

interface InteractiveMapProps {
  destinations?: Destination[];
  zoom?: number;
  center?: [number, number];
}

// Dynamically import Leaflet component with SSR disabled
const MapInner = dynamic(
  () => import('./map-inner').then((mod) => mod.MapInner),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#EBE5DC] flex items-center justify-center text-xs text-[#6B635B] font-mono">
        Loading Interactive Sanctuary Journey Map...
      </div>
    ),
  }
);

export function InteractiveMap({
  destinations = DESTINATIONS,
  zoom = 8,
  center = [15.2, 74.0],
}: InteractiveMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full bg-[#EBE5DC] flex items-center justify-center text-xs text-[#6B635B] font-mono border border-[#DDD4C8]">
        Loading Interactive Sanctuary Journey Map...
      </div>
    );
  }

  return (
    <div className="w-full h-full relative z-10 border border-[#DDD4C8] overflow-hidden">
      <MapInner destinations={destinations} zoom={zoom} center={center} />
    </div>
  );
}
