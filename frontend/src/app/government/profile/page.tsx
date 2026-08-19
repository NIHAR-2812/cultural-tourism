'use client';

import React from 'react';
import { GovernmentLayout } from '@/components/government/government-layout';
import { useRole } from '@/components/role-context';
import { ShieldCheck, Mail, Building2, Award, CheckCircle2 } from 'lucide-react';

export default function GovernmentProfilePage() {
  const { user } = useRole();

  return (
    <GovernmentLayout pageTitle="Council Officer Profile">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDD4C8] pb-4">
        <div>
          <h2 className="text-2xl font-bold font-serif-heading text-[#2E2A25]">
            Council Officer Credentials & Purview
          </h2>
          <p className="text-xs text-[#6B635B]">
            Official accreditation details for Western Ghats Ecotourism & Conservation Audit.
          </p>
        </div>
      </div>

      <div className="max-w-3xl space-y-6">
        
        {/* PROFILE CARD */}
        <div className="p-8 rounded-3xl bg-[#FAF6EE] border-2 border-[#DDD4C8] border-t-4 border-t-[#5F6B4F] space-y-6 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-[#5F6B4F] text-white font-bold flex items-center justify-center text-xl shadow-xs">
              RN
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold font-serif-heading text-[#2E2A25]">{user?.name || 'Dr. Ramesh Nambiar'}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#EBF3EE] text-[#3F5E4D] text-[10px] font-mono font-bold border border-[#C5DEC8] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#3F5E4D]" /> Senior Verification Officer
                </span>
              </div>
              <p className="text-xs text-[#5F6B4F] font-semibold">Western Ghats Ecotourism & Conservation Council</p>
              <p className="text-[11px] text-[#6B635B] font-mono">Role: {user?.role.toUpperCase()} • Department of Environmental Governance</p>
            </div>
          </div>

          {/* DETAILS GRID */}
          <div className="pt-4 border-t border-[#DDD4C8] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#F5F1EB] space-y-1">
              <span className="font-mono text-[10px] uppercase text-[#5F6B4F] font-bold block">Official Email</span>
              <p className="font-semibold text-[#2E2A25] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#5F6B4F]" /> {user?.email || 'government@vanantara.org'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F5F1EB] space-y-1">
              <span className="font-mono text-[10px] uppercase text-[#5F6B4F] font-bold block">Governance Jurisdiction</span>
              <p className="font-semibold text-[#2E2A25] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#5F6B4F]" /> Western Ghats Biosphere Reserve
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F5F1EB] space-y-1">
              <span className="font-mono text-[10px] uppercase text-[#5F6B4F] font-bold block">Council Audit Badge</span>
              <p className="font-mono font-bold text-[#2E2A25]">GOVT-AUDIT-PASS-2026-01</p>
            </div>

            <div className="p-4 rounded-xl bg-[#F5F1EB] space-y-1">
              <span className="font-mono text-[10px] uppercase text-[#5F6B4F] font-bold block">Active Authority</span>
              <p className="font-bold text-[#2E2A25]">Property Approval & Capacity Enforcement</p>
            </div>
          </div>
        </div>

      </div>

    </GovernmentLayout>
  );
}
