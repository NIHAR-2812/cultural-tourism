'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Feather, ArrowUpRight, Sun, Sparkles, ShieldCheck, BookOpen, ArrowRight } from 'lucide-react';
import { DESTINATIONS } from '@/components/data/mock-data';
import { InteractiveMap } from '@/components/ui/interactive-map';
import { MBDSBreakdown } from '@/components/ui/mbds-breakdown';
import { useRole } from '@/components/role-context';

const FALLBACK_TRAVEL_IMAGE = 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80';

interface JourneyDossierCard {
  id: string;
  number: string;
  region: string;
  readTime: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  fieldNotes: string;
  image: string;
  link: string;
  tabLabel: string;
}

const FEATURED_JOURNEY_DOSSIERS: JourneyDossierCard[] = [
  {
    id: 'fj-1',
    number: 'DOSSIER N° 01',
    region: 'Western Ghats Biosphere',
    readTime: '6 Min Read',
    title: 'Where the Canopy Touches the Sky: Living Among Netravali’s Medicinal Trees',
    shortDesc: 'Devendra Kulkarni spent twenty years cataloging rare endemic epiphytes in South Goa.',
    fullDesc: 'Deep inside South Goa Devrai corridors, indigenous Velip elders catalog rare endemic epiphytes and sacred stream aquifers. Guests stay in low-footprint bamboo treehouses elevated 18 meters above the jungle floor.',
    fieldNotes: 'Field Note: Enforces strict 12-guest daily quota for forest soil preservation.',
    image: 'https://images.unsplash.com/photo-1511497584788-876761c139ab?auto=format&fit=crop&w=1200&q=80',
    link: '/destinations/netravali-cloud-forest',
    tabLabel: 'Devrai Forest File',
  },
  {
    id: 'fj-2',
    number: 'DOSSIER N° 02',
    region: 'Kerala Backwaters & Lotus Creeks',
    readTime: '5 Min Read',
    title: 'Whispers of Vembanad: Silent Solar Navigation in Kumarakom',
    shortDesc: 'Unnikrishnan Nair’s family has crafted wooden houseboats in Kottayam for three generations.',
    fullDesc: 'Master boatbuilder Unnikrishnan Nair preserves three generations of Kerala wooden watercraft. Electric solar propulsion allows quiet canoeing through bird reserve creeks without disturbing wintering waterfowl.',
    fieldNotes: 'Field Note: 100% solar electric drive with zero water discharge systems.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    link: '/destinations/kumarakom-backwater-sanctuary',
    tabLabel: 'Vembanad Water File',
  },
  {
    id: 'fj-3',
    number: 'DOSSIER N° 03',
    region: 'South Goa Conservation Coast',
    readTime: '7 Min Read',
    title: 'Guarding the Dunes: Midnight Sea Turtle Nest Patrols in Agonda',
    shortDesc: 'Ananya & Sean Patel guide silent night patrols along nesting sand dunes.',
    fullDesc: 'Canvas eco-pavilions positioned behind sand dunes that disassemble entirely during monsoon surges. Midnight silent nest guards shield sea turtle hatchlings as they reach the Arabian Sea.',
    fieldNotes: 'Field Note: Protected 450+ Olive Ridley sea turtle hatchlings in 2025.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    link: '/destinations/agonda-turtle-dunes',
    tabLabel: 'Agonda Dune File',
  },
  {
    id: 'fj-4',
    number: 'DOSSIER N° 04',
    region: 'Trans-Himalayan Reserve',
    readTime: '8 Min Read',
    title: 'High Above Himalayan Clouds: Off-grid Solar Adobe Living in Spiti',
    shortDesc: 'Perched 4,200 meters high in Kibber village, Tenzin Norbu hosts travelers in sun-baked clay homes.',
    fullDesc: 'Hand-pressed adobe earth homes in Kibber village combining Tibetan ram-earth insulating wisdom with solar traps. 30% of tariffs fund wild snow leopard prey base conservation.',
    fieldNotes: 'Field Note: Directly funds solar heating for 14 remote Kibber households.',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    link: '/destinations/spiti-high-altitude-lodge',
    tabLabel: 'Spiti High-Altitude File',
  },
  {
    id: 'fj-5',
    number: 'DOSSIER N° 05',
    region: 'Mandovi Estuary Reserve',
    readTime: '4 Min Read',
    title: 'Ancient Estuary Canoeing: Estuarine Otter & Bird Sanctuaries of Divar',
    shortDesc: 'Paddle wooden canoes through mangrove backwaters in restored 19th-century Goan red laterite cottages.',
    fullDesc: 'Silent mangrove canoe trails along Mandovi river backwaters guided by local estuarine fishermen. Experience tidal salt pans, otter breeding pools, and heritage Goan architecture.',
    fieldNotes: 'Field Note: Active estuarine Carrying Quota of 16 guests daily.',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    link: '/destinations/divar-island-sanctuary',
    tabLabel: 'Divar Estuary File',
  },
  {
    id: 'fj-6',
    number: 'DOSSIER N° 06',
    region: 'Cotigao Evergreen Rainforest',
    readTime: '6 Min Read',
    title: 'Cotigao Ancient Tree Towers: Whispers of the Primeval Forest',
    shortDesc: 'Experience 30-meter high tree canopy observation towers deep inside primeval forest.',
    fullDesc: 'Guided canopy expeditions to 30-meter observation towers deep inside ancient evergreen rainforest in direct partnership with native Velip tribal elders and wildlife trackers.',
    fieldNotes: 'Field Note: 100% native Velip tribal guide leadership.',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
    link: '/destinations/cotigao-canopy-sanctuary',
    tabLabel: 'Cotigao Canopy File',
  },
];

export default function VanantaraLandingPage() {
  const { triggerEcologicalRedirection } = useRole();
  const [activeExperience, setActiveExperience] = useState<string>('All');
  const [searchLocation, setSearchLocation] = useState('');
  const [hoveredDossierId, setHoveredDossierId] = useState<string | null>(null);

  const experiences = [
    'All',
    'Sacred Forests',
    'Village Stays',
    'Coastal Traditions',
    'Indigenous Experiences',
    'Wildlife Trails',
  ];

  const experienceMapping: Record<string, string> = {
    'Sacred Forests': 'Rainforest',
    'Village Stays': 'Village',
    'Coastal Traditions': 'Coastal',
    'Indigenous Experiences': 'Village',
    'Wildlife Trails': 'Wildlife',
  };

  const filteredDestinations = DESTINATIONS.filter((d) => {
    const targetCategory = experienceMapping[activeExperience];
    const matchesExp = activeExperience === 'All' || d.category === targetCategory;
    const matchesSearch =
      d.title.toLowerCase().includes(searchLocation.toLowerCase()) ||
      d.location.toLowerCase().includes(searchLocation.toLowerCase());
    return matchesExp && matchesSearch;
  });

  return (
    <div className="space-y-28 pb-24 bg-[#F5F1EB] text-[#2E2A25]">
      
      {/* 1. CINEMATIC HERO */}
      <section className="relative min-h-[92vh] flex flex-col justify-between px-6 lg:px-16 pt-8 pb-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2000&q=80"
            alt="Kerala Backwaters Vanantara"
            className="w-full h-full object-cover brightness-[0.88] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2E2A25]/85 via-[#2E2A25]/50 to-transparent" />
        </div>

        <div className="relative z-10 w-full pt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF6EE]/90 backdrop-blur-sm text-[#A65A3A] text-xs font-serif-heading italic border border-[#A65A3A]/30">
            <Feather className="w-3.5 h-3.5 text-[#A65A3A]" />
            Yatra Volume IV — Regenerative Eco-Tourism Marketplace
          </span>

          <button
            onClick={() => triggerEcologicalRedirection('netravali-cloud-forest')}
            className="text-xs text-[#F5F1EB] bg-[#A65A3A] hover:bg-[#8C482B] px-4 py-1.5 rounded-full border border-[#A65A3A] transition-all font-medium shadow-sm flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Test &quot;Today This Sanctuary Rests&quot; Redirection →
          </button>
        </div>

        <div className="relative z-10 max-w-3xl space-y-5 py-16">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold font-serif-heading text-white tracking-tight leading-[1.02]">
            Travel Deeply. <br />
            <span className="italic font-normal text-[#F5F1EB]">
              Protect the Wild Soil.
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-[#F5F1EB] max-w-xl font-light leading-relaxed">
            Discover off-grid bamboo stays in Kerala, sea turtle coastal dunes in Goa, and sacred cloud forest treehouses operating strictly under ecological carrying limits.
          </p>
        </div>

        {/* SEARCH STRIP WITH "BROWSE SANCTUARY JOURNAL →" BESIDE SEARCH */}
        <div className="relative z-10 max-w-4xl bg-[#F5F1EB] border-2 border-[#DDD4C8] p-4 text-xs space-y-2.5 rounded-2xl shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search sanctuary or region (Goa, Kerala, Western Ghats)..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="w-full md:flex-1 bg-[#FAF6EE] p-3 border border-[#DDD4C8] text-xs text-[#2E2A25] placeholder-[#6B635B]/70 focus:outline-none focus:border-[#A65A3A] rounded-xl"
            />

            {/* Explore Sanctuary Button */}
            <Link
              href="/destinations"
              className="w-full md:w-auto py-3 px-5 bg-[#A65A3A] hover:bg-[#8C482B] text-white font-semibold text-xs transition-colors rounded-xl flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap"
            >
              <Search className="w-4 h-4" /> Explore Sanctuary
            </Link>

            {/* Browse Sanctuary Journal Button Beside Search */}
            <Link
              href="/destinations"
              className="w-full md:w-auto py-3 px-5 bg-[#5F6B4F] hover:bg-[#4E5B3F] text-white font-semibold text-xs transition-colors rounded-xl flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4" /> Browse Sanctuary Journal →
            </Link>
          </div>

          <p className="text-[10px] text-[#5F6B4F] font-medium italic flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#5F6B4F]" /> 92% of booking fees flow directly to native village hosts and forest guides.
          </p>
        </div>
      </section>

      {/* 2. EXPLORE BY EXPERIENCE — MASONRY LAYOUT */}
      <section className="px-6 lg:px-16 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-[#DDD4C8] pb-6">
          <div className="space-y-1 max-w-lg">
            <span className="text-xs uppercase tracking-widest font-mono text-[#A65A3A] font-bold flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5 text-[#A65A3A]" /> Interactive Masonry Feed
            </span>
            <h2 className="text-4xl sm:text-6xl font-bold font-serif-heading text-[#2E2A25]">
              Explore by Experience
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-medium">
            {experiences.map((exp) => (
              <button
                key={exp}
                onClick={() => setActiveExperience(exp)}
                className={`px-3.5 py-1.5 rounded-full transition-all ${
                  activeExperience === exp
                    ? 'bg-[#A65A3A] text-white font-bold shadow-sm'
                    : 'bg-[#EBE5DC] text-[#6B635B] hover:bg-[#DDD4C8] hover:text-[#2E2A25]'
                }`}
              >
                {exp}
              </button>
            ))}
          </div>
        </div>

        {/* MASONRY GRID */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 [&>div]:break-inside-avoid">
          {filteredDestinations.map((dest, index) => {
            const isFull = dest.isAtCapacity || dest.currentCapacity >= dest.maxCapacity;
            const heightClasses = ['h-[500px]', 'h-[380px]', 'h-[440px]', 'h-[540px]', 'h-[410px]'];
            const chosenHeight = heightClasses[index % heightClasses.length];

            return (
              <div
                key={dest.id}
                className="relative group rounded-3xl overflow-hidden cursor-pointer bg-[#EBE5DC] border border-[#DDD4C8] transition-all duration-500 hover:shadow-xl hover:border-[#A65A3A]"
              >
                <div className={`w-full ${chosenHeight} relative overflow-hidden`}>
                  <img
                    src={dest.coverImage}
                    alt={dest.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_TRAVEL_IMAGE;
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {isFull && (
                    <div className="absolute top-4 left-4 z-10 bg-[#FAF6EE] text-[#A65A3A] px-3.5 py-1 rounded-full text-xs font-serif-heading italic border border-[#A65A3A]/40 shadow-sm">
                      Resting Today
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#2E2A25]/95 via-[#2E2A25]/75 to-[#2E2A25]/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 text-[#F5F1EB] space-y-3.5">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-[#D99B26] flex items-center gap-1 font-semibold">
                        <MapPin className="w-3 h-3 text-[#A65A3A]" /> {dest.location}
                      </span>
                      <h3 className="text-2xl font-bold font-serif-heading text-white leading-tight">
                        {dest.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#F5F1EB] bg-[#A65A3A]/20 p-2 rounded-xl border border-[#A65A3A]/40">
                      <img
                        src={dest.host.avatar}
                        alt={dest.host.name}
                        className="w-7 h-7 rounded-full object-cover border border-[#A65A3A]"
                      />
                      <span className="font-light">Host Steward: <strong className="font-medium text-white">{dest.host.name}</strong></span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-[#F5F1EB]/90 font-light">
                      <span className="flex items-center gap-1"><Sun className="w-3.5 h-3.5 text-[#D99B26]" /> {dest.weather.temp} ({dest.weather.condition})</span>
                      <span>•</span>
                      <span>Best: {dest.weather.bestSeason}</span>
                    </div>

                    <p className="text-xs text-[#F5F1EB]/90 font-light italic leading-relaxed bg-[#2E2A25]/60 p-2.5 rounded-xl border-l-2 border-[#A65A3A]">
                      &quot;{dest.highlights[0]}&quot;
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-white/20 text-xs">
                      <div>
                        <span className="font-serif-heading text-lg font-bold text-white">
                          ₹{dest.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-[#F5F1EB]/70 font-light"> / night</span>
                        <div className="text-[10px] text-white font-bold bg-[#5F6B4F] px-2.5 py-0.5 rounded-full inline-block ml-2 border border-[#5F6B4F]">
                          Eco Score {dest.sustainabilityScore}/100
                        </div>
                      </div>

                      {isFull ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerEcologicalRedirection(dest.id);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-[#FAF6EE] text-[#A65A3A] font-semibold text-xs flex items-center gap-1 transition-colors border border-[#A65A3A]/40"
                        >
                          Resting (Alternatives) <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <Link
                          href={`/destinations/${dest.id}`}
                          className="px-4 py-2 rounded-xl bg-[#A65A3A] hover:bg-[#8C482B] text-white font-semibold text-xs flex items-center gap-1 transition-colors shadow-sm"
                        >
                          Read Story <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED JOURNEYS — CONTINUOUS SLOW-SCROLLING MANILA FOLDER CAROUSEL */}
      <section className="py-20 bg-[#EBE5DC] border-y border-[#DDD4C8] overflow-hidden">
        <div className="px-6 lg:px-16 space-y-12">
          
          <div className="flex items-center justify-between border-b border-[#DDD4C8] pb-4">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase text-[#A65A3A] font-bold flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#A65A3A]" /> Continuous Manila Folder Loop
              </span>
              <h2 className="text-4xl sm:text-6xl font-bold font-serif-heading text-[#2E2A25]">
                Featured Journeys
              </h2>
            </div>
            <span className="text-xs font-mono text-[#6B635B] italic hidden sm:block">
              * Hovering over any folder stops carousel movement & unfolds file upward
            </span>
          </div>

          <div className="relative w-full overflow-visible group pt-4 pb-14">
            <div className="flex gap-10 w-max animate-marquee group-hover:[animation-play-state:paused]">
              {[...FEATURED_JOURNEY_DOSSIERS, ...FEATURED_JOURNEY_DOSSIERS].map((dossier, idx) => {
                const isHovered = hoveredDossierId === `${dossier.id}-${idx}`;

                return (
                  <div
                    key={`${dossier.id}-${idx}`}
                    onMouseEnter={() => setHoveredDossierId(`${dossier.id}-${idx}`)}
                    onMouseLeave={() => setHoveredDossierId(null)}
                    className="relative h-[520px] sm:h-[550px] w-[300px] sm:w-[440px] md:w-[540px] shrink-0 rounded-3xl overflow-hidden cursor-pointer border border-[#DDD4C8] shadow-md transition-all duration-500 hover:shadow-2xl bg-[#EBE5DC] group/card"
                  >
                    <div className="absolute inset-0 z-0">
                      <img
                        src={dossier.image}
                        alt={dossier.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_TRAVEL_IMAGE;
                        }}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2E2A25]/90 via-[#2E2A25]/30 to-transparent" />
                    </div>

                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                      <span className="px-3.5 py-1 bg-[#FAF6EE]/95 backdrop-blur-sm text-[#A65A3A] font-mono text-[10px] uppercase font-bold border border-[#A65A3A]/30 rounded-full shadow-sm">
                        {dossier.number}
                      </span>
                      <span className="px-3 py-1 bg-[#2E2A25]/85 text-[#F5F1EB] font-mono text-[10px] uppercase rounded-full">
                        {dossier.readTime}
                      </span>
                    </div>

                    <div
                      className={`absolute bottom-0 left-0 right-0 z-10 bg-[#8C482B] manila-folder-clip-steep-offset transition-all duration-500 ease-in-out ${
                        isHovered ? 'h-[80%]' : 'h-[40%]'
                      }`}
                    />

                    <div
                      className={`absolute bottom-0 left-0 right-0 z-20 bg-[#FAF6EE] manila-folder-clip-steep p-8 pt-11 transition-all duration-500 ease-in-out flex flex-col justify-between border-b border-x border-[#DDD4C8] shadow-2xl ${
                        isHovered ? 'h-[78%]' : 'h-[38%]'
                      }`}
                    >
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

                      <div className="space-y-2 pt-1 text-left">
                        <div className="flex items-center justify-between border-b border-[#DDD4C8] pb-2">
                          <span className="text-[11px] font-mono uppercase text-[#5F6B4F] font-bold flex items-center gap-1">
                            <Feather className="w-3.5 h-3.5 text-[#A65A3A]" /> {dossier.tabLabel}
                          </span>
                          <span className="text-[11px] font-mono text-[#A65A3A] uppercase font-semibold">
                            {isHovered ? 'Unfolded Dossier' : 'Hover to Open'}
                          </span>
                        </div>

                        <span className="text-xs uppercase font-mono tracking-wider text-[#A65A3A] font-semibold block pt-1">
                          {dossier.region}
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

                      {isHovered && (
                        <div className="space-y-4 pt-2 text-xs text-[#6B635B] text-left">
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
                        </div>
                      )}

                      {!isHovered && (
                        <div className="pt-2 border-t border-[#DDD4C8] flex justify-between items-center text-xs">
                          <span className="text-[11px] font-mono text-[#6B635B] italic">
                            Hover to unfold file upward
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
          </div>

        </div>
      </section>

      {/* 4. INTERACTIVE SANCTUARY MAP */}
      <section className="px-6 lg:px-16 space-y-6">
        <div className="space-y-1 border-b border-[#DDD4C8] pb-4">
          <span className="text-xs uppercase tracking-widest font-mono text-[#5F6B4F] font-bold">
            Interactive Sanctuary Journey Map
          </span>
          <h2 className="text-3xl font-bold font-serif-heading text-[#2E2A25]">
            Sacred Soil & Carrying Limit Map
          </h2>
        </div>

        <div className="h-[460px] w-full border-2 border-[#DDD4C8]">
          <InteractiveMap destinations={DESTINATIONS} zoom={9} />
        </div>
      </section>

      {/* 5. COMMUNITY STORIES */}
      <section className="px-6 lg:px-16 space-y-10">
        <div className="space-y-1 max-w-xl">
          <span className="text-xs uppercase tracking-widest font-mono text-[#A65A3A] font-bold">
            Community Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-heading text-[#2E2A25]">
            Indigenous Hosts as Storytellers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {DESTINATIONS.slice(0, 3).map((dest) => (
            <article
              key={dest.host.id}
              className="p-6 bg-[#FAF6EE] border border-[#DDD4C8] border-t-4 border-t-[#A65A3A] space-y-4 flex flex-col justify-between text-xs rounded-2xl"
            >
              <p className="text-xs text-[#6B635B] leading-relaxed italic font-serif-heading text-sm border-l-2 border-[#A65A3A] pl-3">
                &quot;{dest.host.bio}&quot;
              </p>

              <div className="flex items-center gap-3 pt-2 border-t border-[#DDD4C8]">
                <img
                  src={dest.host.avatar}
                  alt={dest.host.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#A65A3A]"
                />
                <div>
                  <h4 className="text-sm font-bold font-serif-heading text-[#2E2A25]">{dest.host.name}</h4>
                  <p className="text-[11px] text-[#5F6B4F] font-semibold">{dest.host.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6. RESPONSIBLE TOURISM & 7. CONSERVATION PHILOSOPHY */}
      <section className="px-6 lg:px-16 space-y-6">
        <div className="py-12 border-t border-[#DDD4C8] space-y-6">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono uppercase text-[#5F6B4F] font-bold">
              Conservation Philosophy
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold font-serif-heading text-[#2E2A25] leading-tight">
              &quot;A Sacred Pact With Indian Land & Water.&quot;
            </h2>
            <p className="text-xs sm:text-sm text-[#6B635B] font-light leading-relaxed">
              Vanantara was built on the belief that tourism should enrich native ecosystems rather than exploit them. By enforcing real-time daily carrying limits and sharing 92% of booking fees with local hosts, we preserve ancient biospheres.
            </p>
          </div>
        </div>
      </section>

      {/* 8. MARKETPLACE BENEFIT DISTRIBUTION (MBDS Storytelling Section) */}
      <section className="px-6 lg:px-16">
        <div className="p-8 sm:p-12 bg-[#FAF6EE] border-2 border-[#DDD4C8] border-t-4 border-t-[#A65A3A] max-w-4xl mx-auto space-y-6 rounded-2xl">
          <MBDSBreakdown totalAmount={14200} />
        </div>
      </section>

      {/* 9. CALL TO EXPLORE */}
      <section className="px-6 lg:px-16 text-center py-12 border-t border-[#DDD4C8]">
        <div className="max-w-xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-heading text-[#2E2A25]">
            Begin Your Mindful Yatra
          </h2>
          <p className="text-xs text-[#6B635B] font-light leading-relaxed">
            Explore sanctuaries operating within strict ecological carrying capacities.
          </p>
          <Link
            href="/destinations"
            className="inline-block py-3 px-8 bg-[#A65A3A] hover:bg-[#8C482B] text-white font-semibold text-xs transition-colors rounded-full shadow-sm"
          >
            Browse Sanctuary Journal →
          </Link>
        </div>
      </section>

    </div>
  );
}
