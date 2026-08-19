'use client';

import React from 'react';

export interface DonutSegment {
  name: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSegment[];
  totalLabel?: string;
}

export function DonutChart({ data, totalLabel = 'Applications' }: DonutChartProps) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0) || 1;

  // Compute SVG arc segments using strokeDasharray
  const radius = 65;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  const segments = data.map((item) => {
    const percent = item.value / total;
    const strokeDasharray = `${percent * circumference} ${circumference}`;
    const strokeDashoffset = -cumulativePercent * circumference;
    cumulativePercent += percent;

    return {
      ...item,
      percent: Math.round(percent * 100),
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
      {/* SVG Donut Chart */}
      <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90">
          {/* Background Ring */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#EBE5DC"
            strokeWidth={strokeWidth}
          />
          {/* Segments */}
          {segments.map((seg, idx) => (
            <circle
              key={idx}
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={seg.strokeDasharray}
              strokeDashoffset={seg.strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out hover:opacity-90"
            />
          ))}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold font-serif-heading text-[#2E2A25]">{total}</span>
          <span className="text-[10px] text-[#6B635B] font-mono uppercase font-semibold">{totalLabel}</span>
        </div>
      </div>

      {/* Legend List */}
      <div className="space-y-3 w-full text-xs">
        {segments.map((seg) => (
          <div key={seg.name} className="flex items-center justify-between p-2 rounded-xl bg-[#F5F1EB]/80 border border-[#DDD4C8]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
              <span className="font-semibold text-[#2E2A25]">{seg.name}</span>
            </div>
            <div className="font-mono text-right">
              <span className="font-bold text-[#2E2A25]">{seg.value}</span>
              <span className="text-[10px] text-[#6B635B] ml-1">({seg.percent}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
