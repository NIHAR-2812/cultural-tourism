'use client';

import React from 'react';
import { useRole } from '@/components/role-context';

interface CapacityMeterProps {
  currentCapacity: number;
  maxCapacity: number;
  destinationId?: string;
  compact?: boolean;
  showTriggerBtn?: boolean;
}

export function CapacityMeter({
  currentCapacity,
  maxCapacity,
  destinationId,
  compact = false,
  showTriggerBtn = true,
}: CapacityMeterProps) {
  const { triggerEcologicalRedirection } = useRole();
  const isFull = currentCapacity >= maxCapacity;

  if (compact) {
    return (
      <div className="text-xs font-light text-[#5A6560]">
        {isFull ? (
          <span className="text-[#C86D51] font-medium italic">Destination Resting Today</span>
        ) : (
          <span>{currentCapacity} of {maxCapacity} daily travelers</span>
        )}
      </div>
    );
  }

  return (
    <div className="py-4 border-y border-[#E8E1D1] space-y-2 text-xs text-[#5A6560]">
      <div className="flex justify-between items-center">
        <span className="uppercase tracking-widest font-medium text-[11px] text-[#1C242B]">
          Daily Ecological Carrying Quota
        </span>
        <span className="font-serif-heading text-sm text-[#1C242B]">
          {isFull ? 'Resting Today' : `${currentCapacity} / ${maxCapacity} Guests`}
        </span>
      </div>

      <p className="font-light leading-relaxed">
        {isFull
          ? 'Admissions for today are paused to honor local wildlife rest windows and soil recovery.'
          : 'Enforced strictly to prevent land erosion and preserve regional flora.'}
      </p>

      {isFull && showTriggerBtn && destinationId && (
        <button
          onClick={() => triggerEcologicalRedirection(destinationId)}
          className="mt-2 text-xs font-semibold text-[#C86D51] underline underline-offset-4 decoration-[#C86D51]/50 hover:decoration-[#C86D51] transition-all text-left block"
        >
          Discover 15 km Alternative Sanctuaries →
        </button>
      )}
    </div>
  );
}
