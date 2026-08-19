'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HostLayout } from '@/components/host/host-layout';
import { ApiClient, HostBooking } from '@/services/api';
import { CalendarCheck, Search, Filter, ArrowUpRight, CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function BookingsManagementPage() {
  const [bookings, setBookings] = useState<HostBooking[]>([]);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Upcoming' | 'Completed' | 'Cancelled'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, [activeFilter, searchTerm]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await ApiClient.getHostBookings(activeFilter, searchTerm);
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <HostLayout pageTitle="Bookings Management">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDD4C8] pb-4">
        <div>
          <h2 className="text-2xl font-bold font-serif-heading text-[#2E2A25]">
            Traveler Bookings & Reservations
          </h2>
          <p className="text-xs text-[#6B635B]">
            Track guest stays, stay dates, and payouts allocated to your properties.
          </p>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#6B635B] absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search by customer, property or booking ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FAF6EE] pl-9 pr-3 py-2.5 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#A65A3A]"
          />
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {(['All', 'Upcoming', 'Completed', 'Cancelled'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                activeFilter === filter
                  ? 'bg-[#A65A3A] text-white shadow-sm'
                  : 'bg-[#EBE5DC] text-[#6B635B] hover:bg-[#DDD4C8] hover:text-[#2E2A25]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* BOOKINGS TABLE / CARDS */}
      {loading ? (
        <div className="py-12 text-center text-xs font-mono text-[#6B635B]">Loading Bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#FAF6EE] border border-[#DDD4C8] text-center text-xs space-y-3">
          <CalendarCheck className="w-10 h-10 text-[#6B635B] mx-auto opacity-50" />
          <p className="font-bold text-[#2E2A25] text-base font-serif-heading">No bookings found.</p>
          <p className="text-[#6B635B]">There are no reservation records matching your search criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-[#DDD4C8] bg-[#FAF6EE] shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#DDD4C8] bg-[#F5F1EB] font-mono uppercase text-[10px] text-[#6B635B]">
                  <th className="p-4">Booking ID</th>
                  <th className="p-4">Property</th>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Stay Dates</th>
                  <th className="p-4">Guests</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Host Payout</th>
                  <th className="p-4 text-right">Action</th>
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
                      <td className="p-4 font-mono font-bold text-[#A65A3A]">{bkg.id}</td>
                      <td className="p-4 font-semibold text-[#2E2A25] max-w-xs truncate">{bkg.propertyName}</td>
                      <td className="p-4 text-[#2E2A25]">{bkg.customerName}</td>
                      <td className="p-4 text-[#6B635B] font-light">{bkg.stayDates}</td>
                      <td className="p-4 text-[#2E2A25]">{bkg.guestsCount} Guests</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${statusColors[bkg.status]}`}>
                          {bkg.status}
                        </span>
                      </td>
                      <td className="p-4 text-right font-serif-heading font-bold text-sm text-[#5F6B4F]">
                        ₹{bkg.payoutAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/host/bookings/${bkg.id}`}
                          className="py-1.5 px-3 bg-[#EBE5DC] hover:bg-[#DDD4C8] text-[#2E2A25] font-semibold text-xs rounded-xl inline-flex items-center gap-1 transition-colors"
                        >
                          Details <ArrowUpRight className="w-3 h-3" />
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

    </HostLayout>
  );
}
