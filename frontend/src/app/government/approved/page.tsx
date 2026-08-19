'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GovernmentLayout } from '@/components/government/government-layout';
import { ApiClient } from '@/services/api';
import { Destination } from '@/components/data/mock-data';
import { CheckCircle2, ArrowUpRight, Search, ShieldCheck } from 'lucide-react';

export default function ApprovedPropertiesPage() {
  const [approvedProps, setApprovedProps] = useState<Array<Destination & { status: 'Pending' | 'Live' | 'Rejected'; approvalDate?: string }>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProps();
  }, [searchTerm]);

  const loadProps = async () => {
    setLoading(true);
    try {
      const data = await ApiClient.getAllProperties('Approved', searchTerm);
      setApprovedProps(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GovernmentLayout pageTitle="Approved Properties">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDD4C8] pb-4">
        <div>
          <h2 className="text-2xl font-bold font-serif-heading text-[#2E2A25]">
            Live Approved Eco-Sanctuaries
          </h2>
          <p className="text-xs text-[#6B635B]">
            Properties verified by Council and operating in active public catalog under daily limits.
          </p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative w-full md:w-80">
        <Search className="w-4 h-4 text-[#6B635B] absolute left-3 top-3.5" />
        <input
          type="text"
          placeholder="Search by property, host or region..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#FAF6EE] pl-9 pr-3 py-2.5 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#5F6B4F]"
        />
      </div>

      {/* APPROVED PROPERTIES GRID */}
      {loading ? (
        <div className="py-12 text-center text-xs font-mono text-[#6B635B]">Loading Approved Properties...</div>
      ) : approvedProps.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#FAF6EE] border border-[#DDD4C8] text-center text-xs space-y-3">
          <CheckCircle2 className="w-10 h-10 text-[#5F6B4F] mx-auto opacity-50" />
          <p className="font-bold text-[#2E2A25] text-base font-serif-heading">No approved properties found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedProps.map((prop) => (
            <div
              key={prop.id}
              className="bg-[#FAF6EE] border border-[#DDD4C8] rounded-2xl overflow-hidden shadow-xs hover:border-[#5F6B4F] transition-all flex flex-col justify-between"
            >
              <div className="h-44 w-full relative overflow-hidden bg-[#EBE5DC]">
                <img src={prop.coverImage} alt={prop.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#5F6B4F] text-white shadow-xs">
                    Approved / Live
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#5F6B4F] uppercase font-bold">{prop.location}</span>
                  <h3 className="font-bold text-lg font-serif-heading text-[#2E2A25]">{prop.title}</h3>
                  <p className="text-xs text-[#6B635B]">Host: <strong className="text-[#2E2A25]">{prop.host.name}</strong></p>
                </div>

                <div className="pt-3 border-t border-[#DDD4C8] space-y-2 text-xs">
                  <div className="flex justify-between text-[#6B635B]">
                    <span>Approval Date:</span>
                    <strong className="text-[#2E2A25]">{prop.approvalDate || 'Jun 12, 2026'}</strong>
                  </div>
                  <div className="flex justify-between text-[#6B635B]">
                    <span>Daily Capacity Limit:</span>
                    <strong className="text-[#2E2A25]">{prop.maxCapacity} Guests</strong>
                  </div>

                  <Link
                    href={`/government/properties/${prop.id}`}
                    className="w-full mt-2 py-2 px-4 bg-[#EBE5DC] hover:bg-[#DDD4C8] text-[#2E2A25] font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
                  >
                    View Record & Bookings <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </GovernmentLayout>
  );
}
