'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GovernmentLayout } from '@/components/government/government-layout';
import { ApiClient, HostBooking } from '@/services/api';
import { Calendar, Search, Filter, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function GovernmentPortalBookingsPage() {
  const [bookings, setBookings] = useState<HostBooking[]>([]);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Upcoming' | 'Completed' | 'Cancelled'>('All');
  const [selectedProperty, setSelectedProperty] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, [activeFilter, selectedProperty, searchTerm]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await ApiClient.getAllPortalBookings(activeFilter, selectedProperty, searchTerm);
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GovernmentLayout pageTitle="Portal-Wide Bookings">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDD4C8] pb-4">
        <div>
          <h2 className="text-2xl font-bold font-serif-heading text-[#2E2A25]">
            Portal-Wide Tourism Activity &amp; Bookings
          </h2>
          <p className="text-xs text-[#6B635B]">
            Audit overall traveler bookings across all approved sanctuaries and native host communities.
          </p>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#6B635B] absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search by customer, host, property or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FAF6EE] pl-9 pr-3 py-2.5 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#5F6B4F]"
          />
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {(['All', 'Upcoming', 'Completed', 'Cancelled'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                activeFilter === filter
                  ? 'bg-[#5F6B4F] text-white shadow-sm'
                  : 'bg-[#EBE5DC] text-[#6B635B] hover:bg-[#DDD4C8] hover:text-[#2E2A25]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* BOOKINGS TABLE */}
      {loading ? (
        <div className="py-12 text-center text-xs font-mono text-[#6B635B]">Loading Portal Bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#FAF6EE] border border-[#DDD4C8] text-center text-xs space-y-3">
          <Calendar className="w-10 h-10 text-[#6B635B] mx-auto opacity-50" />
          <p className="font-bold text-[#2E2A25] text-base font-serif-heading">No portal bookings found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#DDD4C8] bg-[#FAF6EE] shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#DDD4C8] bg-[#F5F1EB] font-mono uppercase text-[10px] text-[#6B635B]">
                <th className="p-4 whitespace-nowrap">Reference ID</th>
                <th className="p-4 min-w-[200px]">Property</th>
                <th className="p-4 min-w-[150px]">Host / Community</th>
                <th className="p-4 whitespace-nowrap">Customer Name</th>
                <th className="p-4 whitespace-nowrap">Stay Dates</th>
                <th className="p-4 whitespace-nowrap">Guests</th>
                <th className="p-4 whitespace-nowrap">Status</th>
                <th className="p-4 text-right whitespace-nowrap">Host Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD4C8]">
              {bookings.map((bkg) => {
                const statusColors: Record<string, string> = {
                  Upcoming: 'bg-[#FAF6EE] text-[#A65A3A] border border-[#A65A3A]/40',
                  Confirmed: 'bg-[#EBF3EE] text-[#3F5E4D] border border-[#C5DEC8]',
                  Completed: 'bg-[#EBF3EE] text-[#3F5E4D] border border-[#C5DEC8]',
                  Cancelled: 'bg-[#FFF0F0] text-[#8C2E2E] border border-[#8C2E2E]/30',
                };

                return (
                  <tr key={bkg.id} className="hover:bg-[#F5F1EB]/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#5F6B4F] whitespace-nowrap">{bkg.id}</td>
                    <td className="p-4 font-serif-heading font-bold text-[#2E2A25]">{bkg.propertyName}</td>
                    <td className="p-4 text-[#2E2A25]">{bkg.hostName || 'Devendra Kulkarni'}</td>
                    <td className="p-4 text-[#6B635B] whitespace-nowrap">{bkg.customerName}</td>
                    <td className="p-4 text-[#6B635B] font-light whitespace-nowrap">{bkg.stayDates}</td>
                    <td className="p-4 font-semibold text-[#2E2A25] whitespace-nowrap">{bkg.guestsCount} Guests</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-mono font-bold whitespace-nowrap shadow-xs ${statusColors[bkg.status]}`}>
                        {bkg.status}
                      </span>
                    </td>
                    <td className="p-4 text-right font-serif-heading font-bold text-sm text-[#5F6B4F] whitespace-nowrap">
                      ₹{bkg.payoutAmount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </GovernmentLayout>
  );
}
