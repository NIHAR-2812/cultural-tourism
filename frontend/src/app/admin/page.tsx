'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ApiClient, GovernanceOverviewResponse } from '@/services/api';
import { ShieldCheck, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AntiAIGovernanceLedgerPage() {
  const [data, setData] = useState<GovernanceOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGovernance() {
      try {
        const gov = await ApiClient.getGovernanceOverview();
        setData(gov);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadGovernance();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-12 py-12 space-y-12 bg-[#FAF7F2] text-[#1C242B]">
      
      {/* Editorial Header */}
      <div className="border-b border-[#E8E1D1] pb-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase text-[#D99B26]">Governance & Conservation Council</span>
          {data?.platformStatus === 'Attention Required' ? (
            <span className="px-3 py-1 bg-[#FFF8EE] text-[#A65A3A] font-mono text-[10px] font-bold border border-[#A65A3A]/40 rounded-full flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-[#A65A3A]" /> Platform Status: Attention Required
            </span>
          ) : (
            <span className="px-3 py-1 bg-[#EBF3EE] text-[#3F5E4D] font-mono text-[10px] font-bold border border-[#C5DEC8] rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3F5E4D]" /> Platform Status: Optimal
            </span>
          )}
        </div>

        <h1 className="text-4xl font-bold font-serif-heading text-[#1C242B]">
          Conservation Governance Ledger
        </h1>
        <p className="text-xs text-[#5A6560] font-light">
          Monitoring {data?.destinationsMonitored || 6} sanctuaries across Indian biosphere corridors.
        </p>

        <div className="flex gap-4 pt-3 text-xs">
          <Link
            href="/admin/hosts"
            className="font-semibold text-[#1C242B] underline underline-offset-4 decoration-[#C86D51] hover:text-[#C86D51]"
          >
            Pending Host Verification ({data?.pendingHostApprovalsCount || 0}) →
          </Link>
          <Link
            href="/admin/locations"
            className="text-[#5A6560] underline underline-offset-4 hover:text-[#1C242B]"
          >
            Pending Location Approvals ({data?.pendingLocationApprovalsCount || 0})
          </Link>
        </div>
      </div>

      {/* Conservation Ledger Narrative */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono uppercase text-[#5A6560]">Conservation Fund Ledger</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[#5A6560] border-y border-[#E8E1D1] py-6">
          <div>
            <span className="text-[10px] uppercase font-mono text-[#8A9590] block">Fund Capital Collected</span>
            <p className="text-2xl font-serif-heading font-bold text-[#1C242B] mt-0.5">{data?.conservationFundCollected || '₹14,85,000'}</p>
            <p className="text-[11px] font-light mt-0.5">Audited bi-weekly by council</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-[#8A9590] block">Protected Land Area</span>
            <p className="text-2xl font-serif-heading font-bold text-[#1C242B] mt-0.5">{data?.hectaresProtected || 1420} Hectares</p>
            <p className="text-[11px] font-light mt-0.5">Western Ghats preserves</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-[#8A9590] block">Plastic Waste Diverted</span>
            <p className="text-2xl font-serif-heading font-bold text-[#1C242B] mt-0.5">{data?.plasticDivertedKg || 6800} kg</p>
            <p className="text-[11px] font-light mt-0.5">Zero plastic bottle standard</p>
          </div>
        </div>
      </div>

      {/* Regional Carrying Capacity Status */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold font-serif-heading text-[#1C242B] border-b border-[#E8E1D1] pb-3">
          Regional Carrying Capacity & Quota Alerts
        </h2>
        <div className="space-y-3 text-xs text-[#5A6560]">
          {(data?.capacityAlerts || []).map((z, idx) => (
            <div key={idx} className="flex justify-between py-2.5 border-b border-[#E8E1D1] items-center">
              <span className="font-medium text-[#1C242B]">{z.zone}</span>
              <span className={`italic font-mono text-xs ${z.percent >= 100 ? 'text-[#A65A3A] font-bold' : 'text-[#5F6B4F]'}`}>
                {z.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
