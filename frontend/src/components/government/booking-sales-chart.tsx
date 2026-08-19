'use client';

import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ApiClient } from '@/services/api';

export type TimeRange = '7D' | '30D' | '3M' | '1Y';

export function BookingSalesChart() {
  const [range, setRange] = useState<TimeRange>('30D');
  const [data, setData] = useState<Array<{ label: string; bookings: number; revenue: number }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await ApiClient.getBookingSalesAnalytics(range);
      setData(res);
      setLoading(false);
    }
    loadData();
  }, [range]);

  const totalBookings = data.reduce((acc, curr) => acc + curr.bookings, 0);
  const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);

  const ranges: Array<{ label: string; value: TimeRange }> = [
    { label: '7 Days', value: '7D' },
    { label: '30 Days', value: '30D' },
    { label: '3 Months', value: '3M' },
    { label: '1 Year', value: '1Y' },
  ];

  return (
    <div className="p-6 rounded-3xl bg-[#FAF6EE] border border-[#DDD4C8] flex flex-col justify-between h-full shadow-xs">
      
      <div className="space-y-4">
        {/* HEADER & TIME RANGE SELECTOR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDD4C8] pb-4 min-h-[56px]">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#5F6B4F] font-bold">Portal Analytics</span>
            <h3 className="text-xl font-bold font-serif-heading text-[#2E2A25]">
              Booking &amp; Sales Overview
            </h3>
          </div>

          {/* Range Selector Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-[#EBE5DC] rounded-2xl border border-[#DDD4C8] self-start sm:self-auto">
            {ranges.map((r) => (
              <button
                key={r.value}
                onClick={() => setRange(r.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                  range === r.value
                    ? 'bg-[#5F6B4F] text-white shadow-xs'
                    : 'text-[#6B635B] hover:text-[#2E2A25]'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* METRICS PREVIEW - DM SANS CLEAN UPRIGHT NUMBERS */}
        <div className="flex items-center gap-6 text-xs border-b border-[#DDD4C8]/60 pb-3">
          <div>
            <span className="text-[10px] text-[#6B635B] font-mono block">Period Stays</span>
            <strong className="text-lg font-semibold font-number text-[#2E2A25]">{totalBookings} Stays</strong>
          </div>
          <div className="border-l border-[#DDD4C8] pl-6">
            <span className="text-[10px] text-[#6B635B] font-mono block">Gross Booking Revenue</span>
            <strong className="text-lg font-semibold font-number text-[#5F6B4F]">
              ₹{(totalRevenue / 100000).toFixed(2)} Lakhs
            </strong>
          </div>
        </div>

        {/* RECHARTS AREA CHART */}
        <div className="w-full h-64 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="bookingAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5F6B4F" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#5F6B4F" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#DDD4C8" vertical={false} opacity={0.7} />
              <XAxis
                dataKey="label"
                stroke="#6B635B"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#DDD4C8' }}
              />
              <YAxis
                stroke="#6B635B"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const pt = payload[0].payload;
                    return (
                      <div className="p-3 bg-[#2E2A25] text-white rounded-xl shadow-xl border border-[#DDD4C8]/30 text-xs space-y-1">
                        <p className="font-mono text-[10px] text-[#D99B26] font-bold uppercase">{pt.label}</p>
                        <p className="font-number font-semibold text-sm text-white">{pt.bookings} Stays Booked</p>
                        <p className="text-[11px] text-[#F5F1EB]/80 font-number">Revenue: ₹{(pt.revenue / 100000).toFixed(2)} Lakhs</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="bookings"
                stroke="#5F6B4F"
                strokeWidth={3}
                activeDot={{ r: 6, fill: '#FAF6EE', stroke: '#5F6B4F', strokeWidth: 3 }}
                fill="url(#bookingAreaGrad)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
