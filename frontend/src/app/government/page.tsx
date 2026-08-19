'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GovernmentLayout } from '@/components/government/government-layout';
import { ApiClient } from '@/services/api';
import { Destination } from '@/components/data/mock-data';
import { BookingSalesChart } from '@/components/government/booking-sales-chart';
import { ApplicationStatusDonut } from '@/components/government/application-status-donut';
import {
  FileCheck,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  TrendingUp,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';

export default function GovernmentDashboardPage() {
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    statusDistribution: [
      { name: 'Pending Review', value: 0, color: '#A65A3A' },
      { name: 'Approved / Live', value: 0, color: '#5F6B4F' },
      { name: 'Rejected', value: 0, color: '#8C2E2E' },
    ],
  });

  const [pendingApps, setPendingApps] = useState<Array<Destination & { status: 'Pending' | 'Live' | 'Rejected'; submittedDate?: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const s = await ApiClient.getGovernmentStats();
        setStats(s);
        const props = await ApiClient.getAllProperties('Pending');
        setPendingApps(props);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <GovernmentLayout pageTitle="Governance Overview">
      
      {/* WELCOME BANNER */}
      <div className="p-8 rounded-3xl bg-[#FAF6EE] border-2 border-[#DDD4C8] border-t-4 border-t-[#5F6B4F] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#5F6B4F] font-bold">
            Western Ghats Ecotourism &amp; Conservation Council
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-heading text-[#2E2A25]">
            Tourism &amp; Property Verification Portal
          </h2>
          <p className="text-xs text-[#6B635B] font-light max-w-xl leading-relaxed">
            Monitor eco-sanctuary intake applications, audit carrying limits, and track visitor volume across protected corridors.
          </p>
        </div>

        <Link
          href="/government/properties"
          className="px-5 py-3 rounded-xl bg-[#5F6B4F] hover:bg-[#4E5B3F] text-white font-semibold text-xs transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          Review Applications (<span className="font-number">{stats.pendingApplications}</span>) →
        </Link>
      </div>

      {/* 4 PRIMARY STATISTIC CARDS - DM SANS CLEAN UPRIGHT NUMBERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-[#FAF6EE] border border-[#DDD4C8] space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[#6B635B]">
            <span className="text-xs font-mono uppercase font-bold">Total Applications</span>
            <FileCheck className="w-4 h-4 text-[#2E2A25]" />
          </div>
          <p className="text-3xl font-semibold font-number text-[#2E2A25] tracking-tight">{stats.totalApplications}</p>
          <p className="text-[11px] text-[#6B635B] font-light">Submitted to portal</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#FAF6EE] border border-[#DDD4C8] space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[#6B635B]">
            <span className="text-xs font-mono uppercase font-bold">Pending Applications</span>
            <Clock className="w-4 h-4 text-[#A65A3A]" />
          </div>
          <p className="text-3xl font-semibold font-number text-[#A65A3A] tracking-tight">{stats.pendingApplications}</p>
          <p className="text-[11px] text-[#A65A3A] font-semibold">Awaiting Council review</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#FAF6EE] border border-[#DDD4C8] space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[#6B635B]">
            <span className="text-xs font-mono uppercase font-bold">Approved / Live</span>
            <CheckCircle2 className="w-4 h-4 text-[#5F6B4F]" />
          </div>
          <p className="text-3xl font-semibold font-number text-[#5F6B4F] tracking-tight">{stats.approvedApplications}</p>
          <p className="text-[11px] text-[#5F6B4F] font-semibold">Active in tourist catalog</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#FAF6EE] border border-[#DDD4C8] space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[#6B635B]">
            <span className="text-xs font-mono uppercase font-bold">Rejected Applications</span>
            <XCircle className="w-4 h-4 text-[#8C2E2E]" />
          </div>
          <p className="text-3xl font-semibold font-number text-[#8C2E2E] tracking-tight">{stats.rejectedApplications}</p>
          <p className="text-[11px] text-[#6B635B] font-light">Did not pass eco limits</p>
        </div>
      </div>

      {/* RECHARTS INTERACTIVE ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* CHART 1: BOOKING & SALES OVERVIEW (RECHARTS AREA CHART) */}
        <div className="lg:col-span-8 h-full">
          <BookingSalesChart />
        </div>

        {/* CHART 2: APPLICATION STATUS (RECHARTS DONUT CHART) */}
        <div className="lg:col-span-4 h-full">
          <ApplicationStatusDonut
            data={stats.statusDistribution}
            totalApplications={stats.totalApplications}
          />
        </div>

      </div>

      {/* NEW PROPERTY APPLICATIONS */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-[#DDD4C8] pb-3">
          <div>
            <h3 className="text-2xl font-bold font-serif-heading text-[#2E2A25]">
              New Property Applications
            </h3>
            <p className="text-xs text-[#6B635B]">Pending eco-sanctuary proposals awaiting verification decision</p>
          </div>
          <Link href="/government/properties" className="text-xs font-semibold text-[#5F6B4F] hover:underline">
            Manage All Applications →
          </Link>
        </div>

        {pendingApps.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#FAF6EE] border border-[#DDD4C8] text-center text-xs text-[#6B635B]">
            <CheckCircle2 className="w-8 h-8 text-[#5F6B4F] mx-auto mb-2" />
            <p className="font-bold text-[#2E2A25]">No pending applications awaiting review.</p>
            <p className="font-light">All submitted host properties have been verified.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingApps.map((app) => (
              <div key={app.id} className="p-5 rounded-2xl bg-[#FAF6EE] border border-[#DDD4C8] flex flex-col justify-between space-y-4 shadow-xs">
                <div className="flex gap-4 items-start">
                  <img src={app.coverImage} alt={app.title} className="w-20 h-20 rounded-xl object-cover border border-[#DDD4C8]" />
                  <div className="space-y-1 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#A65A3A] text-white">
                      Pending Review
                    </span>
                    <h4 className="font-bold font-serif-heading text-base text-[#2E2A25]">{app.title}</h4>
                    <p className="text-[#6B635B]">Host: <strong className="text-[#2E2A25]">{app.host.name}</strong> • {app.location}</p>
                    <p className="text-[11px] text-[#6B635B]">Submitted: {app.submittedDate || 'Aug 14, 2026'} • Max Capacity: <span className="font-number font-semibold">{app.maxCapacity}</span> Guests</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#DDD4C8] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#6B635B]">Tariff: <span className="font-number font-semibold text-[#2E2A25]">₹{app.price.toLocaleString('en-IN')}</span>/night</span>
                  <Link
                    href={`/government/properties/${app.id}`}
                    className="py-1.5 px-4 bg-[#5F6B4F] hover:bg-[#4E5B3F] text-white font-semibold text-xs rounded-xl flex items-center gap-1 transition-colors shadow-xs"
                  >
                    View Details &amp; Verify →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </GovernmentLayout>
  );
}
