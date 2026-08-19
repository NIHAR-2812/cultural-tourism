'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ApiClient, User, apiStorage } from '@/services/api';
import { ArrowLeft, CheckCircle2, ShieldCheck, Clock, Award } from 'lucide-react';

export default function AdminHostApprovalsPage() {
  const [pendingHosts, setPendingHosts] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    loadHosts();
  }, []);

  const loadHosts = async () => {
    try {
      const list = await ApiClient.getPendingHosts();
      setPendingHosts(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveHost = async (userId: string, hostName: string) => {
    try {
      await ApiClient.approveHost(userId);
      setActionMessage(`Host ${hostName} has been approved! is_verified set to TRUE.`);
      loadHosts();
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
          Community Verification Queue
        </span>
      </div>

      <div className="space-y-2 border-b border-[#E5DEC9] pb-4">
        <h1 className="text-3xl font-bold font-serif-heading text-[#1C242B]">
          Verify Community Hosts
        </h1>
        <p className="text-xs text-[#5A6560]">
          Review registered native community hosts awaiting accreditation. Approving a host sets <strong className="text-[#1C242B]">is_verified = true</strong> and unlocks their location upload features.
        </p>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-[#EBF3EE] border border-[#C5DEC8] text-[#3F5E4D] text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#3F5E4D]" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* PENDING HOST LIST */}
      <div className="space-y-4">
        {pendingHosts.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[#FAF6EE] border border-[#DDD4C8] text-center text-xs text-[#6B635B] space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#5F6B4F] mx-auto" />
            <p className="font-bold text-[#2E2A25]">No pending host verification requests.</p>
            <p className="font-light">All community host stewards are currently verified.</p>
          </div>
        ) : (
          pendingHosts.map((host) => (
            <div key={host.id} className="p-6 rounded-2xl bg-[#FAF6EE] border border-[#DDD4C8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold font-serif-heading text-[#2E2A25]">{host.name}</h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFF8EE] text-[#A65A3A] font-mono text-[10px] font-bold border border-[#A65A3A]/30">
                    Pending Verification
                  </span>
                </div>
                <p className="text-[#6B635B] font-light">
                  Email: <span className="font-medium text-[#2E2A25]">{host.email}</span> • Community: <span className="font-medium text-[#2E2A25]">{host.community_name || 'Native Stewards'}</span>
                </p>
              </div>

              <button
                onClick={() => handleApproveHost(host.id, host.name)}
                className="py-2.5 px-6 bg-[#A65A3A] hover:bg-[#8C482B] text-white font-semibold text-xs rounded-xl transition-colors shadow-sm whitespace-nowrap"
              >
                Approve Host (is_verified = true) →
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
