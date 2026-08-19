'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function VanantaraLogo({ className = 'w-10 h-10', showText = false }: LogoProps) {
  return (
    <div className="inline-flex items-center gap-3 group select-none">
      
      {/* Newly Generated Handcrafted Warli & Topographic Logo Image */}
      <div className={`${className} relative rounded-full overflow-hidden border border-[#E8E1D1] shadow-sm shrink-0 transition-transform duration-500 group-hover:scale-105 bg-[#FAF7F2]`}>
        <img
          src="/vanantara_logo.jpg"
          alt="Vanantara Logo"
          className="w-full h-full object-cover"
        />
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className="text-2xl sm:text-3xl font-bold font-serif-heading text-[#1C242B] tracking-tight group-hover:text-[#C86D51] transition-colors leading-none">
            Vanantara
          </span>
          <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#5A6560] pt-1">
            Regenerative Sanctuary
          </span>
        </div>
      )}

    </div>
  );
}
