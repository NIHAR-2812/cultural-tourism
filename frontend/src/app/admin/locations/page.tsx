'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ApiClient } from '@/services/api';
import { Destination } from '@/components/data/mock-data';
import { ArrowLeft, CheckCircle2, MapPin, Feather, Award } from 'lucide-react';

export default function AdminLocationApprovalsPage() {
  const [pendingLocations, setPendingLocations] = useState<Array<Destination & { status: 'Pending' | 'Live' | 'Rejected' }>>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const list = await ApiClient.getPendingLocations();
      setPendingLocations(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveLocation = async (locationId: string, title: string) => {
    try {
      await ApiClient.approveLocation(locationId);
      setActionMessage(`Sanctuary "${title}" has been approved! Status changed to LIVE.`);
      loadLocations();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12 space-y-8 bg-[#FAF7F2] text-[#1C242B] min-h-[85vh]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E5DEC9] pb-4">
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-[#5A6560] hover:text-[#1C242B]">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Governance Ledger
        </Link>
        <span className="text-xs font-mono text-[#A65A3A] bg-[#FAF6EE] px-3 py-1 rounded-full border border-[#DDD4C8]">
          Sanctuary Approval Queue
        </span>
      </div>

      <div className="space-y-2 border-b border-[#E5DEC9] pb-4">
        <h1 className="text-3xl font-bold font-serif-heading text-[#1C242B]">
          Verify Sanctuary Locations
        </h1>
        <p className="text-xs text-[#5A6560]">
          Review host sanctuary proposals from <strong className="text-[#1C242B]">GET /admin/pending-locations</strong>. Approving a location changes its status to <strong className="text-[#5F6B4F]">Live</strong> and makes it bookable in the Tourist catalog.
        </p>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-[#EBF3EE] border border-[#C5DEC8] text-[#3F5E4D] text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#3F5E4D]" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* PENDING LOCATIONS LIST */}
      <div className="space-y-4">
        {pendingLocations.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[#FAF6EE] border border-[#DDD4C8] text-center text-xs text-[#6B635B] space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#5F6B4F] mx-auto" />
            <p className="font-bold text-[#2E2A25]">No pending location approval requests.</p>
            <p className="font-light">All submitted host sanctuaries have been reviewed and published.</p>
          </div>
        ) : (
          pendingLocations.map((loc) => (
            <div key={loc.id} className="p-6 rounded-2xl bg-[#FAF6EE] border border-[#DDD4C8] flex flex-col md:flex-row md:items-center justify-between gap-6 text-xs shadow-sm">
              <div className="flex gap-4 items-center">
                <img src={loc.coverImage} alt={loc.title} className="w-20 h-20 rounded-xl object-cover" />
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono text-[#A65A3A] font-bold">{loc.location}</span>
                  <h4 className="text-lg font-bold font-serif-heading text-[#2E2A25]">{loc.title}</h4>
                  <p className="text-[#6B635B] font-light">
                    Host: <strong className="text-[#2E2A25]">{loc.host.name}</strong> • Max Capacity: <strong className="text-[#2E2A25]">{loc.maxCapacity} Guests</strong> • Tariff: ₹{loc.price.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleApproveLocation(loc.id, loc.title)}
                className="py-2.5 px-6 bg-[#5F6B4F] hover:bg-[#4E5B3F] text-white font-semibold text-xs rounded-xl transition-colors shadow-sm whitespace-nowrap"
              >
                Approve Location (Status = Live) →
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
