'use client';

import React from 'react';

interface SustainabilityScoreProps {
  score: number;
  highlights?: string[];
  size?: 'sm' | 'md' | 'lg';
}

export function SustainabilityScore({
  score,
  highlights,
}: SustainabilityScoreProps) {
  return (
    <div className="space-y-2 text-xs">
      <div className="font-serif-heading text-sm text-[#1C242B]">
        Eco Rating <span className="font-bold text-[#3F5E4D]">{score}</span> / 100
      </div>

      {highlights && highlights.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#5A6560] font-light">
          {highlights.map((item, idx) => (
            <span key={idx} className="after:content-['•'] after:ml-4 last:after:content-none">
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
