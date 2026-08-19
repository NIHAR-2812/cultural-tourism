'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, TreePine, Globe, ShieldCheck } from 'lucide-react';
import { VanantaraLogo } from '@/components/ui/vanantara-logo';

export function Footer() {
  const pathname = usePathname();

  // HIDE FOOTER ON DASHBOARD ROUTES (/host, /government)
  if (pathname.startsWith('/host') || pathname.startsWith('/government')) {
    return null;
  }

  return (
    <footer className="bg-[#EBE5DC] border-t border-[#DDD4C8] pt-16 pb-12 text-[#6B635B]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Pledge */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <VanantaraLogo className="w-8 h-8" />
              <span className="text-2xl font-bold font-serif-heading text-[#2E2A25]">
                Vanantara
              </span>
            </div>
            <p className="text-xs text-[#6B635B] leading-relaxed font-light">
              A regenerative tourism marketplace protecting ecosystems, empowering indigenous communities, enforcing carrying capacities, and redistributing revenue back into local hands.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#5F6B4F]">
              <ShieldCheck className="w-4 h-4 text-[#5F6B4F]" />
              Certified Regenerative Ecotourism Marketplace
            </div>
          </div>

          {/* Sanctuaries & Preserves */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#2E2A25]">
              Sanctuaries & Preserves
            </h4>
            <ul className="space-y-2 text-xs text-[#6B635B]">
              <li><Link href="/destinations" className="hover:text-[#A65A3A] transition-colors">Divar Mangrove Estuary</Link></li>
              <li><Link href="/destinations" className="hover:text-[#A65A3A] transition-colors">Netravali Cloud Forest</Link></li>
              <li><Link href="/destinations" className="hover:text-[#A65A3A] transition-colors">Agonda Sea Turtle Dunes</Link></li>
              <li><Link href="/destinations" className="hover:text-[#A65A3A] transition-colors">Kumarakom Bamboo Estuary</Link></li>
            </ul>
          </div>

          {/* Stewardship & Benefit Split */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#2E2A25]">
              Benefit Distribution
            </h4>
            <ul className="space-y-2 text-xs text-[#6B635B]">
              <li><span className="text-[#5F6B4F] font-bold">92%</span> → Indigenous Host Wages</li>
              <li><span className="text-[#A65A3A] font-bold">5%</span> → Wildlife Conservation Trust</li>
              <li><span className="text-[#6B635B] font-bold">3%</span> → Zero-Paper Infrastructure</li>
              <li><Link href="/destinations" className="hover:text-[#A65A3A] transition-colors">Haversine 15 km Redirection</Link></li>
            </ul>
          </div>

          {/* Newsletter Journal */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#2E2A25]">
              The Vanantara Journal
            </h4>
            <p className="text-xs text-[#6B635B] font-light">
              Subscribe to quarterly dispatches on monsoon wildlife migrations and quiet eco-retreat windows.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address..."
                className="w-full px-3 py-2 bg-[#F5F1EB] border border-[#DDD4C8] text-xs text-[#2E2A25] placeholder-[#6B635B]/70 focus:outline-none focus:border-[#A65A3A]"
              />
              <button className="px-3.5 py-2 bg-[#2E2A25] hover:bg-[#423C35] text-[#F5F1EB] font-bold">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#DDD4C8] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B635B]">
          <p>© 2026 Vanantara Regenerative Eco-Tourism Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><TreePine className="w-3.5 h-3.5 text-[#5F6B4F]" /> 14,200 Hectares Protected</span>
            <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-[#A65A3A]" /> Zero Plastic Standard</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
