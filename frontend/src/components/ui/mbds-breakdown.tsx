'use client';

import React from 'react';

interface MBDSBreakdownProps {
  totalAmount: number; // Total amount in INR ₹
}

export function MBDSBreakdown({ totalAmount }: MBDSBreakdownProps) {
  const hostAmount = Math.round(totalAmount * 0.92);
  const trustAmount = Math.round(totalAmount * 0.05);
  const platformAmount = Math.round(totalAmount * 0.03);

  return (
    <div className="space-y-6 py-6 border-y border-[#DDD4C8]">
      <div className="space-y-1">
        <span className="text-[10px] font-mono uppercase text-[#A65A3A]">
          Transparent Marketplace Benefit Distribution (MBDS)
        </span>
        <h4 className="text-xl font-bold font-serif-heading text-[#2E2A25]">
          Where Your Travel Investment Goes
        </h4>
        <p className="text-xs text-[#6B635B] font-light leading-relaxed">
          Vanantara guarantees 92% of all booking revenues flow directly into indigenous host hands and local village wages.
        </p>
      </div>

      {/* Storytelling Progress Flow */}
      <div className="space-y-4 text-xs text-[#6B635B]">
        
        {/* 92% Community Host */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[#2E2A25]">
              92% → Indigenous Host & Local Village Wages
            </span>
            <span className="font-serif-heading font-bold text-base text-[#5F6B4F]">
              ₹{hostAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="w-full bg-[#EBE5DC] h-2 rounded-full overflow-hidden">
            <div className="h-full bg-[#5F6B4F] rounded-full" style={{ width: '92%' }} />
          </div>
          <p className="text-[11px] font-light text-[#6B635B]">
            Direct payout to native Goan, Kerala, and Western Ghats stewards and village artisans.
          </p>
        </div>

        {/* 5% Wildlife Conservation Trust */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[#2E2A25]">
              5% → Wildlife Corridor Conservation Trust
            </span>
            <span className="font-serif-heading font-bold text-base text-[#A65A3A]">
              ₹{trustAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="w-full bg-[#EBE5DC] h-2 rounded-full overflow-hidden">
            <div className="h-full bg-[#A65A3A] rounded-full" style={{ width: '5%' }} />
          </div>
          <p className="text-[11px] font-light text-[#6B635B]">
            Funds mangrove replanting, sea turtle nest guards, and forest aquifer audits.
          </p>
        </div>

        {/* 3% Platform Infrastructure */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[#2E2A25]">
              3% → Vanantara Platform & Zero-Paper Infrastructure
            </span>
            <span className="font-serif-heading font-bold text-base text-[#2E2A25]">
              ₹{platformAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="w-full bg-[#EBE5DC] h-2 rounded-full overflow-hidden">
            <div className="h-full bg-[#2E2A25] rounded-full" style={{ width: '3%' }} />
          </div>
          <p className="text-[11px] font-light text-[#6B635B]">
            Covers real-time carrying capacity monitoring servers and paperless ticketing.
          </p>
        </div>

      </div>
    </div>
  );
}
