'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export interface StatusSegment {
  name: string;
  value: number;
  color: string;
  filterKey: 'Pending' | 'Approved' | 'Rejected';
}

interface ApplicationStatusDonutProps {
  data: Array<{ name: string; value: number; color: string }>;
  totalApplications: number;
}

export function ApplicationStatusDonut({ data, totalApplications }: ApplicationStatusDonutProps) {
  const router = useRouter();

  // Map display names to url filter params
  const chartData: StatusSegment[] = data.map((d) => {
    let filterKey: 'Pending' | 'Approved' | 'Rejected' = 'Pending';
    if (d.name.includes('Approved') || d.name.includes('Live')) filterKey = 'Approved';
    if (d.name.includes('Rejected')) filterKey = 'Rejected';
    return { ...d, filterKey };
  });

  const handleSliceClick = (entry: any) => {
    if (!entry) return;
    const filterKey =
      entry.filterKey ||
      (entry.name?.includes('Approved') || entry.name?.includes('Live')
        ? 'Approved'
        : entry.name?.includes('Rejected')
        ? 'Rejected'
        : 'Pending');
    router.push(`/government/properties?status=${filterKey}`);
  };

  return (
    <div className="p-6 rounded-3xl bg-[#FAF6EE] border border-[#DDD4C8] flex flex-col justify-between h-full shadow-xs">
      
      <div className="space-y-4">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#DDD4C8] pb-4 min-h-[56px]">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#5F6B4F] font-bold">Application Status</span>
            <h3 className="text-xl font-bold font-serif-heading text-[#2E2A25]">
              Application Status
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-[#5F6B4F] bg-[#EBF3EE] px-2.5 py-1 rounded-full border border-[#C5DEC8]">
            <span className="font-number font-semibold">{totalApplications}</span> Total
          </span>
        </div>

        {/* RECHARTS DONUT CHART WITH CENTER TEXT - DM SANS CLEAN NUMBERS */}
        <div className="relative w-full h-56 flex items-center justify-center pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as StatusSegment;
                    const percent = totalApplications ? Math.round((data.value / totalApplications) * 100) : 0;
                    return (
                      <div className="p-3 bg-[#2E2A25] text-white rounded-xl shadow-xl border border-[#DDD4C8]/30 text-xs space-y-1">
                        <p className="font-serif-heading font-bold text-sm" style={{ color: data.color }}>
                          {data.name}
                        </p>
                        <p className="text-xs font-number">{data.value} Applications ({percent}%)</p>
                        <p className="text-[10px] text-[#F5F1EB]/70 italic pt-0.5">Click to view applications →</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                onClick={(entry) => handleSliceClick(entry)}
                className="cursor-pointer"
                isAnimationActive={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#FAF6EE" strokeWidth={2} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Donut Center Display - DM SANS UPRIGHT MEDIUM/SEMIBOLD NUMBER */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none pt-2">
            <span className="text-[10px] font-mono uppercase font-semibold text-[#6B635B] leading-none">
              Total Applications
            </span>
            <span className="text-3xl font-semibold font-number text-[#2E2A25] mt-1 tracking-tight">
              {totalApplications}
            </span>
          </div>
        </div>
      </div>

      {/* INTERACTIVE LEGEND LIST */}
      <div className="space-y-2 text-xs border-t border-[#DDD4C8] pt-3 mt-4">
        {chartData.map((item) => {
          const percent = totalApplications ? Math.round((item.value / totalApplications) * 100) : 0;

          return (
            <button
              key={item.name}
              onClick={() => handleSliceClick(item)}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-[#F5F1EB] hover:bg-[#EBE5DC] transition-colors border border-[#DDD4C8]/60 text-left"
            >
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="font-semibold text-[#2E2A25]">{item.name}</span>
              </div>
              <div className="font-number text-xs">
                <span className="font-semibold text-[#2E2A25]">{item.value}</span>
                <span className="text-[10px] text-[#6B635B] ml-1">({percent}%)</span>
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
}
