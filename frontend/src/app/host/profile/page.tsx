'use client';

import React from 'react';
import { HostLayout } from '@/components/host/host-layout';
import { useRole } from '@/components/role-context';
import { ShieldCheck, User as UserIcon, Mail, Award, MapPin, CheckCircle2 } from 'lucide-react';

export default function HostProfilePage() {
  const { user } = useRole();

  return (
    <HostLayout pageTitle="Steward Profile">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDD4C8] pb-4">
        <div>
          <h2 className="text-2xl font-bold font-serif-heading text-[#2E2A25]">
            Host Stewardship Profile
          </h2>
          <p className="text-xs text-[#6B635B]">
            Authenticated native steward credentials and carrying quota accreditation.
          </p>
        </div>
      </div>

      <div className="max-w-3xl space-y-6">
        
        {/* PROFILE HEADER CARD */}
        <div className="p-8 rounded-3xl bg-[#FAF6EE] border-2 border-[#DDD4C8] border-t-4 border-t-[#A65A3A] space-y-6 shadow-sm">
          <div className="flex items-center gap-5">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
              alt={user?.name || 'Host'}
              className="w-20 h-20 rounded-full object-cover border-2 border-[#A65A3A] shadow-xs"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold font-serif-heading text-[#2E2A25]">{user?.name || 'Devendra Kulkarni'}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#EBF3EE] text-[#3F5E4D] text-[10px] font-mono font-bold border border-[#C5DEC8] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#3F5E4D]" /> Verified Steward
                </span>
              </div>
              <p className="text-xs text-[#5F6B4F] font-semibold">{user?.community_name || 'Netravali Forest Stewards'}</p>
              <p className="text-[11px] text-[#6B635B] font-mono">Role: {user?.role.toUpperCase()} • Joined August 2026</p>
            </div>
          </div>

          {/* DETAILS GRID */}
          <div className="pt-4 border-t border-[#DDD4C8] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#F5F1EB] space-y-1">
              <span className="font-mono text-[10px] uppercase text-[#A65A3A] font-bold block">Account Email</span>
              <p className="font-semibold text-[#2E2A25] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#A65A3A]" /> {user?.email || 'host@vanantara.org'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F5F1EB] space-y-1">
              <span className="font-mono text-[10px] uppercase text-[#5F6B4F] font-bold block">Community Affiliation</span>
              <p className="font-semibold text-[#2E2A25] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#5F6B4F]" /> {user?.community_name || 'Western Ghats Stewards'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F5F1EB] space-y-1">
              <span className="font-mono text-[10px] uppercase text-[#A65A3A] font-bold block">Ecological Pass ID</span>
              <p className="font-mono font-bold text-[#2E2A25]">VAN-ECO-PASS-2026-88</p>
            </div>

            <div className="p-4 rounded-xl bg-[#F5F1EB] space-y-1">
              <span className="font-mono text-[10px] uppercase text-[#5F6B4F] font-bold block">Benefit Share Quota</span>
              <p className="font-bold text-[#2E2A25]">92% Direct Village Wage Revenue</p>
            </div>
          </div>
        </div>

      </div>

    </HostLayout>
  );
}
