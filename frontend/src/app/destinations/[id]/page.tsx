'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ApiClient, BookItineraryResponse, AlternativeLocation } from '@/services/api';
import { DESTINATIONS, Destination } from '@/components/data/mock-data';
import { useRole } from '@/components/role-context';
import { ArrowLeft, ShieldCheck, MapPin, Feather, CheckCircle2, AlertTriangle, ArrowRight, Calendar, Users, Moon, User as UserIcon, Mail } from 'lucide-react';

export default function SanctuaryStoryPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useRole();

  const [destination, setDestination] = useState<Destination | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-10');
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [nightsCount, setNightsCount] = useState<number>(2);
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');

  const [bookingResult, setBookingResult] = useState<BookItineraryResponse | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'breakdown' | 'confirmation'>('details');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const found = DESTINATIONS.find((d) => d.id === id) || DESTINATIONS[0];
    setDestination(found);
  }, [id]);

  useEffect(() => {
    if (user) {
      if (!guestName) setGuestName(user.name);
      if (!guestEmail) setGuestEmail(user.email);
    }
  }, [user]);

  if (!destination) {
    return <div className="p-12 text-center text-xs font-mono text-[#6B635B]">Loading Sanctuary Dossier...</div>;
  }

  const calculatedTotal = destination.price * nightsCount * guestsCount;
  const stayDatesText = `${selectedDate} (${nightsCount} night${nightsCount > 1 ? 's' : ''})`;

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setBookingResult(null);
    try {
      const nameToUse = guestName || user?.name || 'Mindful Tourist';
      const emailToUse = guestEmail || user?.email || 'tourist@test.local';
      
      const res = await ApiClient.bookItinerary(
        destination.id,
        selectedDate,
        guestsCount,
        stayDatesText,
        nameToUse,
        emailToUse
      );
      setBookingResult(res);
      if (res.status === 'proceed_to_checkout') {
        setCheckoutStep('breakdown');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = () => {
    setCheckoutStep('confirmation');
  };

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-12 py-12 space-y-12 bg-[#F5F1EB] text-[#2E2A25] min-h-[90vh]">
      
      {/* Return Button */}
      <div className="flex items-center justify-between border-b border-[#DDD4C8] pb-4">
        <Link href="/destinations" className="inline-flex items-center gap-1.5 text-xs text-[#6B635B] hover:text-[#2E2A25]">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Sanctuary Journal
        </Link>
        <span className="text-xs font-mono text-[#A65A3A] bg-[#FAF6EE] px-3 py-1 rounded-full border border-[#DDD4C8]">
          Eco Score {destination.sustainabilityScore}/100
        </span>
      </div>

      {/* Title & Cover Image */}
      <div className="space-y-4">
        <div className="space-y-1">
          <span className="text-xs uppercase font-mono tracking-widest text-[#A65A3A] font-bold flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#A65A3A]" /> {destination.location}
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold font-serif-heading text-[#2E2A25]">
            {destination.title}
          </h1>
        </div>

        <div className="h-[260px] sm:h-[360px] md:h-[440px] w-full rounded-3xl overflow-hidden border border-[#DDD4C8]">
          <img src={destination.coverImage} alt={destination.title} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* CAPACITY EXCEEDED ALERT WITH 15KM ALTERNATIVES */}
      {bookingResult?.status === 'capacity_exceeded' && (
        <div className="p-8 rounded-3xl bg-[#FFF8EE] border-2 border-[#A65A3A] space-y-6 shadow-md">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-[#A65A3A] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono text-[#A65A3A] font-bold">Ecological Carrying Limit Reached</span>
              <h3 className="text-2xl font-bold font-serif-heading text-[#2E2A25]">
                {bookingResult.message || 'This location has reached its ecological capacity for this date.'}
              </h3>
              <p className="text-xs text-[#6B635B] font-light leading-relaxed">
                To protect local aquifers and forest soil, guest admissions have paused today. We invite you to explore neighboring sanctuaries within 15 km operating with active capacity.
              </p>
            </div>
          </div>

          <div className="space-y-4 border-t border-[#DDD4C8] pt-4">
            <h4 className="text-xs uppercase font-mono tracking-widest font-bold text-[#A65A3A]">
              Recommended Sanctuaries Within 15 km
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookingResult.alternatives_within_15km?.map((alt) => (
                <div key={alt.id} className="p-5 bg-[#FAF6EE] border border-[#DDD4C8] rounded-2xl space-y-3">
                  <div className="h-36 w-full overflow-hidden rounded-xl bg-[#EBE5DC]">
                    <img src={alt.coverImage} alt={alt.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] font-mono text-[#A65A3A] uppercase font-bold">
                      {alt.distanceKm} km away • {alt.location}
                    </span>
                    <h5 className="text-lg font-bold font-serif-heading text-[#2E2A25]">{alt.title}</h5>
                    <p className="text-[#6B635B] font-light italic">&quot;{alt.reason}&quot;</p>
                  </div>
                  <div className="pt-2 border-t border-[#DDD4C8] flex justify-between items-center text-xs">
                    <span className="font-bold text-[#2E2A25]">₹{alt.price.toLocaleString('en-IN')}/night</span>
                    <Link
                      href={`/destinations/${alt.id}`}
                      className="py-1.5 px-3 bg-[#A65A3A] hover:bg-[#8C482B] text-white font-semibold text-xs rounded-lg transition-colors"
                    >
                      Book Alternative →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT STEP 2: FINANCIAL BREAKDOWN */}
      {checkoutStep === 'breakdown' && bookingResult?.breakdown && (
        <div className="p-8 sm:p-10 rounded-3xl bg-[#FAF6EE] border-2 border-[#DDD4C8] space-y-6 shadow-lg">
          <div className="border-b border-[#DDD4C8] pb-4 space-y-1">
            <span className="text-[10px] uppercase font-mono text-[#A65A3A] font-bold">Step 2 of 3 — Financial Breakdown</span>
            <h3 className="text-3xl font-bold font-serif-heading text-[#2E2A25]">
              Marketplace Benefit Distribution (MBDS)
            </h3>
            <p className="text-xs text-[#6B635B] font-light">
              Transparent breakdown returned directly from Vanantara engine.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F5F1EB] border border-[#DDD4C8] text-xs space-y-1">
            <p className="text-[10px] font-mono uppercase text-[#A65A3A] font-bold">Traveler Summary</p>
            <p className="font-semibold text-[#2E2A25]">{guestName || user?.name || 'Mindful Tourist'} ({guestEmail || user?.email || 'tourist@test.local'})</p>
            <p className="text-[#6B635B]">{stayDatesText} • {guestsCount} Guest{guestsCount > 1 ? 's' : ''}</p>
          </div>

          <div className="space-y-3 text-xs text-[#6B635B]">
            <div className="flex justify-between py-2 border-b border-[#DDD4C8]">
              <span>Base Sanctuary Tariff (₹{destination.price} × {nightsCount} nights × {guestsCount} guests)</span>
              <span className="font-bold text-[#2E2A25]">₹{bookingResult.breakdown.basePrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#DDD4C8]">
              <span>92% → Indigenous Host & Village Wages</span>
              <span className="font-bold text-[#5F6B4F]">₹{bookingResult.breakdown.hostRevenue.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#DDD4C8]">
              <span>5% → Wildlife Corridor Conservation Trust</span>
              <span className="font-bold text-[#A65A3A]">₹{bookingResult.breakdown.conservationFund.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#DDD4C8]">
              <span>3% → Vanantara Platform & Infrastructure</span>
              <span className="font-bold text-[#2E2A25]">₹{bookingResult.breakdown.platformFee.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-3 text-sm font-bold text-[#2E2A25] border-t-2 border-[#2E2A25]">
              <span>Total Financial Charge</span>
              <span className="font-serif-heading text-xl">₹{bookingResult.breakdown.totalCharge.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="pt-2 flex gap-4">
            <button
              onClick={handleConfirmPayment}
              className="py-3.5 px-8 bg-[#A65A3A] hover:bg-[#8C482B] text-white font-semibold text-xs rounded-xl transition-colors shadow-sm"
            >
              Confirm & Pay via UPI / Card →
            </button>
            <button
              onClick={() => setCheckoutStep('details')}
              className="py-3.5 px-6 bg-[#EBE5DC] text-[#2E2A25] font-semibold text-xs rounded-xl hover:bg-[#DDD4C8]"
            >
              Modify Details
            </button>
          </div>
        </div>
      )}

      {/* CHECKOUT STEP 3: BOOKING CONFIRMATION */}
      {checkoutStep === 'confirmation' && (
        <div className="p-8 sm:p-10 rounded-3xl bg-[#FAF6EE] border-2 border-[#5F6B4F] space-y-6 text-center shadow-lg">
          <div className="w-16 h-16 bg-[#5F6B4F] text-white rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <span className="text-xs uppercase font-mono text-[#5F6B4F] font-bold">Booking Confirmed</span>
            <h3 className="text-4xl font-bold font-serif-heading text-[#2E2A25]">
              Your Yatra is Reserved
            </h3>
            <p className="text-xs text-[#6B635B] font-light leading-relaxed">
              Reservation for <strong className="text-[#2E2A25]">{destination.title}</strong> on <strong className="text-[#2E2A25]">{stayDatesText}</strong> for <strong className="text-[#2E2A25]">{guestName || user?.name || 'Mindful Tourist'}</strong> ({guestsCount} guest{guestsCount > 1 ? 's' : ''}) has been confirmed. 92% of your payment has been allocated to native host <strong className="text-[#2E2A25]">{destination.host.name}</strong>.
            </p>
          </div>

          <Link
            href="/destinations"
            className="inline-block py-3 px-8 bg-[#A65A3A] hover:bg-[#8C482B] text-white font-semibold text-xs rounded-full transition-colors shadow-sm"
          >
            Explore More Sanctuaries →
          </Link>
        </div>
      )}

      {/* MAIN DETAILS & BOOKING FORM CARD */}
      {checkoutStep === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-6 text-xs text-[#6B635B] leading-relaxed font-light">
            <h2 className="text-2xl font-bold font-serif-heading text-[#2E2A25]">
              Sanctuary Overview
            </h2>
            <p className="text-sm text-[#2E2A25]">{destination.longDescription}</p>

            {/* Host Section */}
            <div className="p-6 rounded-2xl bg-[#FAF6EE] border border-[#DDD4C8] flex items-center gap-4">
              <img src={destination.host.avatar} alt={destination.host.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#A65A3A]" />
              <div className="space-y-1">
                <h4 className="text-base font-bold font-serif-heading text-[#2E2A25]">{destination.host.name}</h4>
                <p className="text-[#5F6B4F] font-semibold">{destination.host.role}</p>
                <p className="italic text-[#6B635B]">&quot;{destination.host.bio}&quot;</p>
              </div>
            </div>
          </div>

          {/* Interactive Booking Side Panel */}
          <div className="lg:col-span-5">
            <form onSubmit={handleBook} className="p-6 rounded-3xl bg-[#FAF6EE] border-2 border-[#DDD4C8] space-y-5 text-xs shadow-md">
              <div className="space-y-1 border-b border-[#DDD4C8] pb-4">
                <div className="flex items-baseline gap-1">
                  <span className="font-serif-heading text-3xl font-bold text-[#2E2A25]">
                    ₹{destination.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[#6B635B]"> / night</span>
                </div>
                <p className="text-[11px] text-[#5F6B4F] font-semibold pt-1">
                  Daily Quota: {destination.currentCapacity}/{destination.maxCapacity} Guests Today
                </p>
              </div>

              {/* Check-in Date Input */}
              <div className="space-y-1">
                <label className="font-mono uppercase text-[#6B635B] font-bold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#A65A3A]" /> Check-in Date
                </label>
                <input
                  type="date"
                  required
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-[#FAF6EE] p-3 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#A65A3A]"
                />
              </div>

              {/* Number of Guests & Nights Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono uppercase text-[#6B635B] font-bold flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#5F6B4F]" /> Guests
                  </label>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full bg-[#FAF6EE] p-3 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#A65A3A]"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                      <option key={n} value={n}>
                        {n} Guest{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-[#6B635B] font-bold flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-[#A65A3A]" /> Nights
                  </label>
                  <select
                    value={nightsCount}
                    onChange={(e) => setNightsCount(Number(e.target.value))}
                    className="w-full bg-[#FAF6EE] p-3 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#A65A3A]"
                  >
                    {[1, 2, 3, 4, 5, 7, 10, 14].map((n) => (
                      <option key={n} value={n}>
                        {n} Night{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Traveler Details Input */}
              <div className="space-y-2 pt-1 border-t border-[#DDD4C8]">
                <div className="space-y-1">
                  <label className="font-mono uppercase text-[#6B635B] font-bold flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-[#A65A3A]" /> Primary Traveler Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Test Tourist"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-[#FAF6EE] p-2.5 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#A65A3A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-[#6B635B] font-bold flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#5F6B4F]" /> Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. tourist@test.local"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full bg-[#FAF6EE] p-2.5 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#A65A3A]"
                  />
                </div>
              </div>

              {/* Estimated Total Calculation Box */}
              <div className="p-3 bg-[#F5F1EB] rounded-xl border border-[#DDD4C8] space-y-1">
                <div className="flex justify-between text-xs font-semibold text-[#2E2A25]">
                  <span>Estimated Investment</span>
                  <span className="text-[#A65A3A] font-bold">₹{calculatedTotal.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[10px] text-[#6B635B] font-light">
                  {nightsCount} night{nightsCount > 1 ? 's' : ''} × {guestsCount} traveler{guestsCount > 1 ? 's' : ''}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#A65A3A] hover:bg-[#8C482B] text-white font-semibold text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {loading ? 'Checking Carrying Quota...' : 'Book Itinerary & Review MBDS →'}
              </button>

              <p className="text-[10px] text-[#6B635B] text-center font-light italic">
                92% of fees flow directly to native village stewards.
              </p>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
