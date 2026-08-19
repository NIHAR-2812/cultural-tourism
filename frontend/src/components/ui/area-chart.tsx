'use client';

import React, { useState } from 'react';

export interface AreaChartPoint {
  month: string;
  bookingsCount: number;
  revenueGenerated: number;
}

interface AreaChartProps {
  data: AreaChartPoint[];
  height?: number;
}

export function AreaChart({ data, height = 220 }: AreaChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<AreaChartPoint | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  if (!data || data.length === 0) return null;

  const width = 600;
  const padding = { top: 20, right: 30, bottom: 35, left: 40 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map((d) => d.bookingsCount), 50);

  // Compute (x, y) coordinates for each data point
  const points = data.map((d, index) => {
    const x = padding.left + (index / (data.length - 1)) * graphWidth;
    const y = padding.top + graphHeight - (d.bookingsCount / maxVal) * graphHeight;
    return { x, y, data: d };
  });

  // Generate smooth cubic bezier SVG path string
  let linePath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cp1x = curr.x + (next.x - curr.x) / 2;
    const cp1y = curr.y;
    const cp2x = curr.x + (next.x - curr.x) / 2;
    const cp2y = next.y;
    linePath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
  }

  // Generate closed area SVG path string (down to bottom axis)
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;

  // Gridlines values
  const gridTicks = [0, 15, 30, 45, 60];

  return (
    <div className="relative w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible font-sans text-xs"
      >
        <defs>
          {/* Subtle Sage Gradient Fill */}
          <linearGradient id="sageAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5F6B4F" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#5F6B4F" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#5F6B4F" stopOpacity="0.0" />
          </linearGradient>
          {/* Drop shadow glow for line */}
          <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#5F6B4F" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* Horizontal Gridlines */}
        {gridTicks.map((tick) => {
          const y = padding.top + graphHeight - (tick / maxVal) * graphHeight;
          return (
            <g key={tick}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#DDD4C8"
                strokeDasharray="3 3"
                strokeWidth="1"
                opacity="0.7"
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-[#6B635B] text-[10px] font-mono"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Gradient Area Path */}
        <path d={areaPath} fill="url(#sageAreaGradient)" />

        {/* Smooth Curved Line Path */}
        <path
          d={linePath}
          fill="none"
          stroke="#5F6B4F"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#lineGlow)"
        />

        {/* X-Axis Labels & Vertical Markers */}
        {points.map((pt, i) => (
          <g key={i}>
            <text
              x={pt.x}
              y={height - 10}
              textAnchor="middle"
              className="fill-[#6B635B] text-[11px] font-mono font-semibold"
            >
              {pt.data.month.split(' ')[0]}
            </text>

            {/* Glowing Data Point Circle */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r="5"
              fill="#FAF6EE"
              stroke="#5F6B4F"
              strokeWidth="3"
              className="cursor-pointer transition-transform duration-200 hover:scale-150"
              onMouseEnter={() => {
                setHoveredPoint(pt.data);
                setHoverPos({ x: pt.x, y: pt.y });
              }}
              onMouseLeave={() => {
                setHoveredPoint(null);
                setHoverPos(null);
              }}
            />
          </g>
        ))}
      </svg>

      {/* Floating Hover Tooltip */}
      {hoveredPoint && hoverPos && (
        <div
          className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 bg-[#2E2A25] text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-[#DDD4C8]/30 transition-all duration-200"
          style={{
            left: `${(hoverPos.x / width) * 100}%`,
            top: `${(hoverPos.y / height) * 100}%`,
          }}
        >
          <p className="font-mono text-[10px] text-[#D99B26] uppercase font-bold">{hoveredPoint.month}</p>
          <p className="font-serif-heading text-sm font-bold text-white">
            {hoveredPoint.bookingsCount} Traveler Stays
          </p>
          <p className="text-[11px] text-[#F5F1EB]/80 font-light">
            Revenue: ₹{(hoveredPoint.revenueGenerated / 100000).toFixed(2)} Lakhs
          </p>
        </div>
      )}
    </div>
  );
}
