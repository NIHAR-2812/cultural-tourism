'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Feather, ArrowRight, BookOpen } from 'lucide-react';

interface DossierItem {
  id: string;
  number: string;
  categoryTag: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  fieldNotes: string;
  image: string;
  link: string;
  tabLabel: string;
}

const DOSSIER_FEATURES: DossierItem[] = [
  {
    id: 'dossier-01',
    number: 'DOSSIER N° 01',
    categoryTag: 'Indigenous Living Culture',
    title: 'Sacred Devrai Groves & Tribal Heritage',
    shortDesc: 'Custodianship of ancient medicinal aquifers in the Western Ghats.',
    fullDesc: 'Deep inside South Goa Devrai corridors, indigenous Velip elders catalog rare endemic epiphytes and sacred stream aquifers. Guests stay in low-footprint bamboo treehouses elevated 18 meters above the jungle floor.',
    fieldNotes: 'Field Note: Enforces strict 12-guest daily quota for forest soil preservation.',
    image: 'https://images.unsplash.com/photo-1511497584788-876761c139ab?auto=format&fit=crop&w=1200&q=80',
    link: '/destinations/netravali-cloud-forest',
    tabLabel: 'Devrai Forest File',
  },
  {
    id: 'dossier-02',
    number: 'DOSSIER N° 02',
    categoryTag: 'Estuarine Navigation',
    title: 'Silent Vembanad Bamboo Houseboats',
    shortDesc: 'Solar-electric Kettuvalam watercraft along lotus backwaters.',
    fullDesc: 'Master boatbuilder Unnikrishnan Nair preserves three generations of Kerala wooden watercraft. Electric solar propulsion allows quiet canoeing through bird reserve creeks without disturbing wintering waterfowl.',
    fieldNotes: 'Field Note: 100% solar electric drive with zero water discharge systems.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    link: '/destinations/kumarakom-backwater-sanctuary',
    tabLabel: 'Vembanad Water File',
  },
  {
    id: 'dossier-03',
    number: 'DOSSIER N° 03',
    categoryTag: 'Coastal Turtle Nesting',
    title: 'Agonda Dune Protection Pavilions',
    shortDesc: 'Red-spectrum night patrols shielding Olive Ridley hatchlings.',
    fullDesc: 'Canvas eco-pavilions positioned behind sand dunes that disassemble entirely during monsoon surges. Midnight silent nest guards shield sea turtle hatchlings as they reach the Arabian Sea.',
    fieldNotes: 'Field Note: Protected 450+ Olive Ridley sea turtle hatchlings in 2025.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    link: '/destinations/agonda-turtle-dunes',
    tabLabel: 'Agonda Dune File',
  },
  {
    id: 'dossier-04',
    number: 'DOSSIER N° 04',
    categoryTag: 'High-Altitude Solar Stays',
    title: 'Spiti Himalayan Sun-Baked Earth Stays',
    shortDesc: 'Passive solar clay homes perched 4,200m in the Himalayas.',
    fullDesc: 'Hand-pressed adobe earth homes in Kibber village combining Tibetan ram-earth insulating wisdom with solar traps. 30% of tariffs fund wild snow leopard prey base conservation.',
    fieldNotes: 'Field Note: Directly funds solar heating for 14 remote Kibber households.',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    link: '/destinations/spiti-high-altitude-lodge',
    tabLabel: 'Spiti High-Altitude File',
  },
];

export function ArchivalDossierSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="py-20 bg-[#F5F1EB] border-y border-[#DDD4C8] space-y-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest font-mono text-[#A65A3A] font-bold flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#A65A3A]" /> Sloped Manila Folder Dossiers
          </span>
          <span className="text-xs font-mono text-[#6B635B] italic hidden sm:block">
            * Hover any folder to unfold upward into photography
          </span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-bold font-serif-heading text-[#2E2A25]">
          Field Dossiers & Cultural Archives
        </h2>
        <p className="text-xs sm:text-sm text-[#6B635B] font-light max-w-2xl leading-relaxed">
          Interactive travel dossiers compiled by native land stewards, ecologists, and village historians across sacred Indian biospheres.
        </p>
      </div>

      {/* Grid of Manila Travel Folder Cards */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        {DOSSIER_FEATURES.map((dossier) => {
          const isHovered = hoveredId === dossier.id;

          return (
            <div
              key={dossier.id}
              onMouseEnter={() => setHoveredId(dossier.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative h-[550px] w-full rounded-3xl overflow-hidden cursor-pointer border border-[#DDD4C8] shadow-md transition-all duration-500 hover:shadow-2xl bg-[#EBE5DC] group"
            >
              {/* 1. LARGE BACKGROUND IMAGE FILLING ENTIRE CARD */}
              <div className="absolute inset-0 z-0">
                <img
                  src={dossier.image}
                  alt={dossier.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2E2A25]/90 via-[#2E2A25]/30 to-transparent" />
              </div>

              {/* Top Dossier Identifier Badge */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className="px-3.5 py-1 bg-[#FAF6EE]/95 backdrop-blur-sm text-[#A65A3A] font-mono text-[10px] uppercase font-bold border border-[#A65A3A]/30 rounded-full shadow-sm">
                  {dossier.number}
                </span>
              </div>

              {/* 2. LOWER LAYER: DARK TERRACOTTA SHADOW ACCENT BASE */}
              <div
                className={`absolute bottom-0 left-0 right-0 z-10 bg-[#8C482B] manila-folder-clip-steep-offset transition-all duration-500 ease-in-out ${
                  isHovered ? 'h-[80%]' : 'h-[40%]'
                }`}
              />

              {/* 3. UPPER LAYER: LIGHTER TERRACOTTA SANDSTONE PAPER SURFACE (WITH PRONOUNCED 22° SLOPED TOP & TERRACOTTA ACCENT LINE FOLLOWING CONTOUR) */}
              <div
                className={`absolute bottom-0 left-0 right-0 z-20 bg-[#FAF6EE] manila-folder-clip-steep p-8 pt-11 transition-all duration-500 ease-in-out flex flex-col justify-between border-b border-x border-[#DDD4C8] shadow-2xl ${
                  isHovered ? 'h-[78%]' : 'h-[38%]'
                }`}
              >
                {/* SVG TERRACOTTA LINE FOLLOWING THE SLOPED TOP TAB CONTOUR */}
                <svg
                  className="absolute top-0 left-0 right-0 w-full h-10 pointer-events-none z-30"
                  viewBox="0 0 100 34"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 0 2 L 36 2 L 55 33 L 100 33"
                    fill="none"
                    stroke="#A65A3A"
                    strokeWidth="3.5"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                {/* Folder Tab Header */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between border-b border-[#DDD4C8] pb-2">
                    <span className="text-[11px] font-mono uppercase text-[#5F6B4F] font-bold flex items-center gap-1">
                      <Feather className="w-3.5 h-3.5 text-[#A65A3A]" /> {dossier.tabLabel}
                    </span>
                    <span className="text-[11px] font-mono text-[#A65A3A] uppercase font-semibold">
                      {isHovered ? 'Unfolded Dossier' : 'Hover to Open'}
                    </span>
                  </div>

                  <span className="text-xs uppercase font-mono tracking-wider text-[#A65A3A] font-semibold block pt-1">
                    {dossier.categoryTag}
                  </span>

                  <h3 className="text-2xl font-bold font-serif-heading text-[#2E2A25] leading-snug">
                    {dossier.title}
                  </h3>

                  {!isHovered && (
                    <p className="text-xs text-[#6B635B] font-light line-clamp-2 leading-relaxed pt-1">
                      {dossier.shortDesc}
                    </p>
                  )}
                </div>

                {/* REVEALED CONTENT ON HOVER */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 pt-2 text-xs text-[#6B635B]"
                  >
                    <p className="font-light leading-relaxed border-l-2 border-[#A65A3A] pl-4 text-sm text-[#2E2A25]">
                      {dossier.fullDesc}
                    </p>

                    <div className="p-3 bg-[#F2E5D8] border border-[#DDD4C8] rounded-xl text-xs font-mono text-[#A65A3A] italic">
                      &quot;{dossier.fieldNotes}&quot;
                    </div>

                    <Link
                      href={dossier.link}
                      className="py-3 px-6 bg-[#A65A3A] hover:bg-[#8C482B] text-white font-semibold text-xs rounded-full inline-flex items-center gap-2 transition-colors shadow-sm w-full justify-center"
                    >
                      Explore Dossier & Sanctuary Story <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                )}

                {!isHovered && (
                  <div className="pt-2 border-t border-[#DDD4C8] flex justify-between items-center text-xs">
                    <span className="text-[11px] font-mono text-[#6B635B] italic">
                      Tap / Hover to expand
                    </span>
                    <span className="text-[#A65A3A] font-bold text-xs flex items-center gap-1">
                      Explore →
                    </span>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}
