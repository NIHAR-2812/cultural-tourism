'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileText,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Award,
  Feather,
} from 'lucide-react';

export default function HostVerificationOnboardingPage() {
  const [scheduledAudit, setScheduledAudit] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 bg-[#FAF7F2] text-[#1C242B]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E5DEC9] pb-4">
        <Link
          href="/host"
          className="inline-flex items-center gap-1.5 text-xs text-[#5A6560] hover:text-[#1C242B]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Host Center
        </Link>
        <span className="text-xs font-mono text-[#3F5E4D] bg-[#EBF3EE] px-3 py-1 rounded-full border border-[#C5DEC8]">
          Status: Host Fellowship Onboarding
        </span>
      </div>

      {/* Hero Welcome Box — Dedicated Onboarding Experience */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#F4EFEA] border border-[#E5DEC9] space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#FFFDF9] text-[#C86D51] border border-[#E8E1D1]">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#C86D51] font-bold">
              Host Fellowship Program
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-heading text-[#1C242B]">
              Welcome to the EcoHaven Host Fellowship
            </h1>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#5A6560] max-w-2xl leading-relaxed font-light">
          We are thrilled to accompany you on your regenerative travel journey. Complete the accreditation modules below to receive your official EcoHaven Certificate.
        </p>

        {/* Tracker */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#E8E1D1] text-xs space-y-1">
            <div className="flex justify-between items-center text-[#3F5E4D] font-bold">
              <span>1. Application Filed</span>
              <CheckCircle2 className="w-4 h-4 text-[#3F5E4D]" />
            </div>
            <p className="text-[11px] text-[#6B7570]">Documents verified on Aug 14</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#E8E1D1] text-xs space-y-1">
            <div className="flex justify-between items-center text-[#C86D51] font-bold">
              <span>2. Field Eco-Audit</span>
              <Clock className="w-4 h-4 text-[#C86D51]" />
            </div>
            <p className="text-[11px] text-[#6B7570]">{scheduledAudit ? 'Confirmed for Aug 24' : 'Awaiting Schedule'}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#E8E1D1] text-xs space-y-1 opacity-60">
            <div className="flex justify-between items-center text-[#2C3539] font-bold">
              <span>3. Eco Pass Issuance</span>
              <Award className="w-4 h-4 text-[#8A9590]" />
            </div>
            <p className="text-[11px] text-[#6B7570]">Pending audit</p>
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-6">
        
        <div className="p-6 rounded-3xl bg-[#FFFDF9] border border-[#E8E1D1] space-y-4 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-lg font-bold font-serif-heading text-[#1C242B] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#C86D51]" />
              Schedule Inspection Visit
            </h3>
            <p className="text-xs text-[#5A6560]">Select a slot for a 30-minute virtual or field visit by an official Western Ghats conservation inspector.</p>
          </div>

          {scheduledAudit ? (
            <div className="p-4 rounded-2xl bg-[#EBF3EE] border border-[#C5DEC8] text-[#3F5E4D] text-xs flex items-center justify-between">
              <span className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#3F5E4D]" />
                Inspection Confirmed: August 24, 2026 at 10:00 AM IST
              </span>
              <button
                onClick={() => setScheduledAudit(false)}
                className="text-[11px] underline text-[#5A6560]"
              >
                Reschedule
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { date: 'Aug 22, 2026', time: '10:00 AM IST' },
                { date: 'Aug 24, 2026', time: '02:30 PM IST' },
                { date: 'Aug 26, 2026', time: '11:00 AM IST' },
              ].map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => setScheduledAudit(true)}
                  className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D1] hover:border-[#C86D51] text-left text-xs space-y-1 transition-colors"
                >
                  <p className="font-bold text-[#1C242B] font-serif-heading text-sm">{slot.date}</p>
                  <p className="text-[11px] text-[#5A6560]">{slot.time}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 rounded-3xl bg-[#FFFDF9] border border-[#E8E1D1] space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#3F5E4D]" />
            <h3 className="text-lg font-bold font-serif-heading text-[#1C242B]">
              Ethical Charter Agreement
            </h3>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D1] space-y-2 text-xs text-[#5A6560]">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#3F5E4D] shrink-0 mt-0.5" />
              <span>Host agrees never to exceed approved daily visitor carrying limits.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#3F5E4D] shrink-0 mt-0.5" />
              <span>Ensure 100% solar or micro-hydro clean power for guest stays.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#3F5E4D] shrink-0 mt-0.5" />
              <span>Share 15% booking revenue with local indigenous guides.</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
