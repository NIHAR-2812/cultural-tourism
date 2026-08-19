'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { GovernmentLayout } from '@/components/government/government-layout';
import { ApiClient } from '@/services/api';
import { Destination } from '@/components/data/mock-data';
import { FileCheck, Search, Filter, ArrowUpRight, CheckCircle2, Clock, XCircle } from 'lucide-react';

function PropertyApplicationsContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams?.get('status') as 'All' | 'Pending' | 'Approved' | 'Rejected' | null;

  const [properties, setProperties] = useState<Array<Destination & { status: 'Pending' | 'Live' | 'Rejected'; submittedDate?: string }>>([]);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>(initialStatus || 'All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialStatus && ['All', 'Pending', 'Approved', 'Rejected'].includes(initialStatus)) {
      setActiveFilter(initialStatus);
    }
  }, [initialStatus]);

  useEffect(() => {
    loadProps();
  }, [activeFilter, searchTerm]);

  const loadProps = async () => {
    setLoading(true);
    try {
      const data = await ApiClient.getAllProperties(activeFilter, searchTerm);
      setProperties(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDD4C8] pb-4">
        <div>
          <h2 className="text-2xl font-bold font-serif-heading text-[#2E2A25]">
            Eco-Sanctuary Intake Applications
          </h2>
          <p className="text-xs text-[#6B635B]">
            Process host applications, audit environmental compliance, and issue live status passes.
          </p>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#6B635B] absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search by property, host or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FAF6EE] pl-9 pr-3 py-2.5 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#5F6B4F]"
          />
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                activeFilter === filter
                  ? 'bg-[#5F6B4F] text-white shadow-sm'
                  : 'bg-[#EBE5DC] text-[#6B635B] hover:bg-[#DDD4C8] hover:text-[#2E2A25]'
              }`}
            >
              {filter === 'Pending' ? 'Pending Review' : filter === 'Approved' ? 'Approved / Live' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* APPLICATIONS TABLE / LIST */}
      {loading ? (
        <div className="py-12 text-center text-xs font-mono text-[#6B635B]">Loading Applications...</div>
      ) : properties.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#FAF6EE] border border-[#DDD4C8] text-center text-xs space-y-3">
          <FileCheck className="w-10 h-10 text-[#6B635B] mx-auto opacity-50" />
          <p className="font-bold text-[#2E2A25] text-base font-serif-heading">No applications found.</p>
          <p className="text-[#6B635B]">There are no property intake applications matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-[#DDD4C8] bg-[#FAF6EE] shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#DDD4C8] bg-[#F5F1EB] font-mono uppercase text-[10px] text-[#6B635B]">
                  <th className="p-4 min-w-[200px]">Property Name</th>
                  <th className="p-4 min-w-[150px]">Host / Community</th>
                  <th className="p-4 min-w-[150px]">Location</th>
                  <th className="p-4 whitespace-nowrap">Submission Date</th>
                  <th className="p-4 whitespace-nowrap">Daily Capacity</th>
                  <th className="p-4 text-center whitespace-nowrap">Status</th>
                  <th className="p-4 text-center whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD4C8]">
                {properties.map((prop) => {
                  const statusColors = {
                    Live: 'bg-[#EBF3EE] text-[#3F5E4D] border border-[#C5DEC8]',
                    Pending: 'bg-[#FAF6EE] text-[#A65A3A] border border-[#A65A3A]/40',
                    Rejected: 'bg-[#FFF0F0] text-[#8C2E2E] border border-[#8C2E2E]/30',
                  };

                  const statusLabels = {
                    Live: 'Approved / Live',
                    Pending: 'Pending Review',
                    Rejected: 'Rejected',
                  };

                  return (
                    <tr key={prop.id} className="hover:bg-[#F5F1EB]/60 transition-colors">
                      <td className="p-4 font-serif-heading font-bold text-[#2E2A25] text-sm">{prop.title}</td>
                      <td className="p-4 text-[#2E2A25]">{prop.host.name}</td>
                      <td className="p-4 text-[#6B635B]">{prop.location}</td>
                      <td className="p-4 text-[#6B635B] font-mono whitespace-nowrap">{prop.submittedDate || 'Aug 14, 2026'}</td>
                      <td className="p-4 font-semibold text-[#2E2A25] whitespace-nowrap">{prop.maxCapacity} Guests</td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-mono font-bold whitespace-nowrap shadow-xs ${statusColors[prop.status]}`}>
                          {statusLabels[prop.status]}
                        </span>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <Link
                          href={`/government/properties/${prop.id}`}
                          className="py-2 px-3.5 bg-[#5F6B4F] hover:bg-[#4E5B3F] text-white font-semibold text-xs rounded-xl inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-xs"
                        >
                          View Details →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

export default function PropertyApplicationsPage() {
  return (
    <GovernmentLayout pageTitle="Property Applications">
      <Suspense fallback={<div className="py-12 text-center text-xs font-mono text-[#6B635B]">Loading Applications...</div>}>
        <PropertyApplicationsContent />
      </Suspense>
    </GovernmentLayout>
  );
}
