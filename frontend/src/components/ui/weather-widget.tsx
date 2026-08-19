'use client';

import React from 'react';
import { WeatherInfo } from '@/components/data/mock-data';

export function WeatherWidget({ weather }: { weather: WeatherInfo }) {
  return (
    <div className="py-6 border-y border-[#E8E1D1] space-y-4">
      <h4 className="text-xs uppercase tracking-widest font-semibold text-[#1C242B]">
        Regional Ecosystem Climate
      </h4>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs text-[#5A6560]">
        <div>
          <span className="text-[10px] uppercase font-mono text-[#8A9590] block">Temperature</span>
          <p className="text-lg font-serif-heading font-bold text-[#1C242B] mt-0.5">{weather.temp}</p>
          <p className="text-[11px] font-light">{weather.condition}</p>
        </div>

        <div>
          <span className="text-[10px] uppercase font-mono text-[#8A9590] block">Humidity</span>
          <p className="text-lg font-serif-heading font-bold text-[#1C242B] mt-0.5">{weather.humidity}</p>
          <p className="text-[11px] font-light">Canopy Level</p>
        </div>

        <div>
          <span className="text-[10px] uppercase font-mono text-[#8A9590] block">UV Filter</span>
          <p className="text-lg font-serif-heading font-bold text-[#1C242B] mt-0.5">{weather.uvIndex}</p>
          <p className="text-[11px] font-light">Shaded Canopy</p>
        </div>

        <div>
          <span className="text-[10px] uppercase font-mono text-[#8A9590] block">Optimal Window</span>
          <p className="text-xs font-semibold text-[#C86D51] mt-1 font-serif-heading text-sm">
            {weather.bestSeason}
          </p>
        </div>
      </div>
    </div>
  );
}
