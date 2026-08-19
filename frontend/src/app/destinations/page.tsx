'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Feather, ArrowUpRight, Sun, ShieldCheck } from 'lucide-react';
import { ApiClient } from '@/services/api';
import { Destination } from '@/components/data/mock-data';
import { useRole } from '@/components/role-context';

const FALLBACK_TRAVEL_IMAGE = 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80';

export default function SanctuaryJournalCatalogPage() {
  const { triggerEcologicalRedirection } = useRole();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadCatalog() {
      try {
        const liveCatalog = await ApiClient.getTouristCatalog();
        setDestinations(liveCatalog);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  const categories = ['All', 'Rainforest', 'Village', 'Coastal', 'Wildlife'];

  const filteredDestinations = destinations.filter((d) => {
    const matchesCat = activeCategory === 'All' || d.category === activeCategory;
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-16 pb-24 bg-[#F5F1EB] text-[#2E2A25] min-h-[90vh]">
      
      {/* Editorial Catalog Header */}
      <section className="px-6 lg:px-16 pt-12 space-y-6">
        <div className="max-w-3xl space-y-3 border-b border-[#DDD4C8] pb-6">
          <span className="text-xs uppercase tracking-widest font-mono text-[#A65A3A] font-bold flex items-center gap-1.5">
            <Feather className="w-3.5 h-3.5 text-[#A65A3A]" /> Live Public Sanctuary Catalog
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold font-serif-heading text-[#2E2A25]">
            Sanctuary Journal & Live Dossiers
          </h1>
          <p className="text-xs sm:text-sm text-[#6B635B] font-light leading-relaxed">
            Curated list of live eco-cultural sanctuaries operating strictly within ecological carrying limits.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search by sanctuary or region..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#FAF6EE] p-3 border border-[#DDD4C8] text-xs text-[#2E2A25] placeholder-[#6B635B]/70 focus:outline-none focus:border-[#A65A3A] rounded-xl"
            />
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-medium">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full transition-all ${
                  activeCategory === cat
                    ? 'bg-[#A65A3A] text-white font-bold shadow-sm'
                    : 'bg-[#EBE5DC] text-[#6B635B] hover:bg-[#DDD4C8] hover:text-[#2E2A25]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* MASONRY CATALOG FEED */}
      <section className="px-6 lg:px-16">
        {loading ? (
          <div className="py-20 text-center text-xs font-mono text-[#6B635B]">
            Loading Live Sanctuary Catalog...
          </div>
        ) : filteredDestinations.length === 0 ? (
          <div className="py-20 text-center text-xs font-mono text-[#6B635B]">
            No live sanctuaries found matching criteria.
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 [&>div]:break-inside-avoid">
            {filteredDestinations.map((dest, index) => {
              const isFull = dest.isAtCapacity || dest.currentCapacity >= dest.maxCapacity;
              const heightClasses = ['h-[480px]', 'h-[380px]', 'h-[440px]', 'h-[520px]', 'h-[410px]'];
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
                          src={dest.host?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                          alt={dest.host?.name || 'Native Steward'}
                          className="w-7 h-7 rounded-full object-cover border border-[#A65A3A]"
                        />
                        <span className="font-light">Host Steward: <strong className="font-medium text-white">{dest.host?.name || 'Native Steward'}</strong></span>
                      </div>

                      <p className="text-xs text-[#F5F1EB]/90 font-light italic leading-relaxed bg-[#2E2A25]/60 p-2.5 rounded-xl border-l-2 border-[#A65A3A]">
                        &quot;{dest.highlights?.[0] || dest.sustainabilityHighlights?.[0] || dest.tagline || dest.description}&quot;
                      </p>

                      <div className="pt-2 flex items-center justify-between border-t border-white/20 text-xs">
                        <div>
                          <span className="font-serif-heading text-lg font-bold text-white">
                            ₹{dest.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-[#F5F1EB]/70 font-light"> / night</span>
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
        )}
      </section>

    </div>
  );
}
