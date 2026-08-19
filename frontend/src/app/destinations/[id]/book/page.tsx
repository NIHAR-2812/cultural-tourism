'use client';

import React, { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Calendar as CalendarIcon,
  ShieldCheck,
  CreditCard,
  QrCode,
  TreePine,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Feather,
} from 'lucide-react';
import { ApiClient } from '@/services/api';
import { useRole } from '@/components/role-context';
import { DESTINATIONS } from '@/components/data/mock-data';

export default function MultiStepBookingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useRole();

  const id = params?.id as string;
  const destination = DESTINATIONS.find((d) => d.id === id) || DESTINATIONS[0];

  const initialGuests = Number(searchParams?.get('guests')) || 2;
  const initialNights = Number(searchParams?.get('nights')) || 3;
  const initialOffset = searchParams?.get('offset') !== 'false';

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [checkInDate, setCheckInDate] = useState('2026-09-10');
  const [nights, setNights] = useState(initialNights);
  const [guests, setGuests] = useState(initialGuests);
  const [includeOffset, setIncludeOffset] = useState(initialOffset);
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'crypto'>('card');
  const [ecoPledgeAccepted, setEcoPledgeAccepted] = useState(true);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user) {
      if (!guestName) setGuestName(user.name);
      if (!guestEmail) setGuestEmail(user.email);
    }
  }, [user]);

  const basePrice = destination.price * nights;
  const offsetFee = includeOffset ? 25 : 0;
  const conservationFee = Math.round(basePrice * 0.15);
  const grandTotal = basePrice + offsetFee;

  const handleFinalCheckout = async () => {
    setLoading(true);
    try {
      await ApiClient.bookItinerary(
        destination.id,
        checkInDate,
        guests,
        `${checkInDate} (${nights} nights)`,
        guestName || user?.name || 'Mindful Tourist',
        guestEmail || user?.email || 'tourist@test.local'
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setStep(4);
    }
  };

  const nextStep = () => {
    if (step === 3) {
      handleFinalCheckout();
    } else if (step < 4) {
      setStep((step + 1) as 1 | 2 | 3 | 4);
    }
  };
  const prevStep = () => {
    if (step > 1) setStep((step - 1) as 1 | 2 | 3 | 4);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 bg-[#FAF7F2] text-[#1C242B]">
      
      {/* Progress Bar & Header */}
      <div className="space-y-4 border-b border-[#E5DEC9] pb-6">
        <div className="flex items-center justify-between">
          <Link
            href={`/destinations/${destination.id}`}
            className="inline-flex items-center gap-1.5 text-xs text-[#5A6560] hover:text-[#1C242B]"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Sanctuary Journal
          </Link>

          <span className="text-xs font-mono text-[#3F5E4D] bg-[#EBF3EE] px-3 py-1 rounded-full border border-[#C5DEC8]">
            Step {step} of 4 — Travel Registration
          </span>
        </div>

        {/* Step Indicators */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { num: 1, label: '1. Dates & Travelers' },
            { num: 2, label: '2. Itinerary & Pledge' },
            { num: 3, label: '3. Digital Checkout' },
            { num: 4, label: '4. Eco Pass Ticket' },
          ].map((s) => (
            <div
              key={s.num}
              className={`p-2.5 rounded-xl text-center border text-xs font-medium transition-all ${
                step === s.num
                  ? 'bg-[#1C242B] text-[#FAF7F2] border-[#1C242B] font-bold shadow-sm'
                  : step > s.num
                  ? 'bg-[#EBF3EE] text-[#3F5E4D] border-[#C5DEC8]'
                  : 'bg-[#FFFDF9] text-[#8A9590] border-[#E8E1D1]'
              }`}
            >
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {/* Main Step Paper Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#FFFDF9] border border-[#E8E1D1] space-y-6 shadow-sm">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Dates & Quota */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest font-bold text-[#C86D51]">Step 1</span>
                <h2 className="text-2xl font-bold font-serif-heading text-[#1C242B]">
                  Select Travel Window & Quota
                </h2>
                <p className="text-xs text-[#5A6560] font-light">
                  All admissions directly support local Goan estuary conservation and indigenous guides.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D1] space-y-2">
                  <label className="text-xs font-semibold text-[#1C242B] flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-[#C86D51]" /> Check-in Date
                  </label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-[#FFFDF9] p-2.5 rounded-xl border border-[#E8E1D1] text-xs text-[#1C242B] focus:outline-none focus:border-[#C86D51]"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D1] space-y-2">
                  <label className="text-xs font-semibold text-[#1C242B] flex items-center gap-1.5">
                    <TreePine className="w-4 h-4 text-[#3F5E4D]" /> Number of Nights
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={nights}
                    onChange={(e) => setNights(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-[#FFFDF9] p-2.5 rounded-xl border border-[#E8E1D1] text-xs text-[#1C242B] focus:outline-none focus:border-[#C86D51]"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D1] space-y-2">
                <label className="text-xs font-semibold text-[#1C242B]">
                  Travelers Count (Max carrying capacity per reservation: 4)
                </label>
                <input
                  type="number"
                  min="1"
                  max="4"
                  value={guests}
                  onChange={(e) => setGuests(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-[#FFFDF9] p-2.5 rounded-xl border border-[#E8E1D1] text-xs text-[#1C242B] focus:outline-none focus:border-[#C86D51]"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#EBF3EE] border border-[#C5DEC8] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-[#1C242B]">Carbon Offset Tree Pledge</h4>
                  <p className="text-[11px] text-[#3F5E4D]">Sponsors 2 native trees planted by local forest rangers.</p>
                </div>
                <input
                  type="checkbox"
                  checked={includeOffset}
                  onChange={(e) => setIncludeOffset(e.target.checked)}
                  className="rounded bg-[#FAF7F2] border-[#C5DEC8] text-[#3F5E4D]"
                />
              </div>

              <button
                onClick={nextStep}
                className="w-full py-3.5 rounded-2xl bg-[#1C242B] hover:bg-[#323D45] text-[#FAF7F2] font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                Proceed to Itinerary Review <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: Itinerary Review */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest font-bold text-[#C86D51]">Step 2</span>
                <h2 className="text-2xl font-bold font-serif-heading text-[#1C242B]">
                  Review Itinerary & Eco Pledge
                </h2>
                <p className="text-xs text-[#5A6560] font-light">
                  Review your low-impact stay schedule and community fund split.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D1] flex items-center gap-4">
                <img
                  src={destination.coverImage}
                  alt={destination.title}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-base font-bold font-serif-heading text-[#1C242B]">{destination.title}</h3>
                  <p className="text-xs text-[#3F5E4D] font-medium">{destination.location}</p>
                  <p className="text-xs text-[#5A6560] mt-1">
                    {checkInDate} • {nights} nights • {guests} travelers
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D1] space-y-2 text-xs text-[#5A6560]">
                <h4 className="font-bold text-[#1C242B] uppercase tracking-wider text-[11px]">
                  15% Local Wildlife Conservation Fund Split
                </h4>
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between">
                    <span>Host Accommodation Base</span>
                    <span>${basePrice - conservationFee}</span>
                  </div>
                  <div className="flex justify-between text-[#3F5E4D] font-semibold">
                    <span>Wildlife Fund Contribution (15%)</span>
                    <span>${conservationFee}</span>
                  </div>
                </div>
              </div>

              <label className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D1] flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ecoPledgeAccepted}
                  onChange={(e) => setEcoPledgeAccepted(e.target.checked)}
                  className="mt-1 rounded bg-[#FAF7F2] border-[#E8E1D1] text-[#C86D51]"
                />
                <div className="text-xs text-[#5A6560] leading-relaxed">
                  <span className="font-bold text-[#1C242B]">I accept the EcoHaven Traveler Pledge:</span> I agree to observe single-use plastic bans, respect quiet nocturnal forest hours, and remain on designated sanctuary trails.
                </div>
              </label>

              <div className="flex gap-3">
                <button
                  onClick={prevStep}
                  className="w-1/3 py-3.5 rounded-2xl bg-[#FAF7F2] text-[#1C242B] border border-[#E8E1D1] font-semibold text-xs"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!ecoPledgeAccepted}
                  className="w-2/3 py-3.5 rounded-2xl bg-[#1C242B] hover:bg-[#323D45] disabled:opacity-50 text-[#FAF7F2] font-semibold text-xs flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Checkout */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest font-bold text-[#C86D51]">Step 3</span>
                <h2 className="text-2xl font-bold font-serif-heading text-[#1C242B]">
                  Digital Paperless Checkout
                </h2>
                <p className="text-xs text-[#5A6560] font-light">
                  Total investment: <span className="text-[#1C242B] font-bold">${grandTotal}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D1] space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#5A6560]">Full Name</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-[#1C242B] focus:outline-none"
                  />
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D1] space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#5A6560]">Paperless Email</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-[#1C242B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={prevStep}
                  className="w-1/3 py-3.5 rounded-2xl bg-[#FAF7F2] text-[#1C242B] border border-[#E8E1D1] font-semibold text-xs"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="w-2/3 py-3.5 rounded-2xl bg-[#1C242B] hover:bg-[#323D45] text-[#FAF7F2] font-semibold text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  Issue Digital Eco-Pass Ticket <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Confirmation */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-[#EBF3EE] text-[#3F5E4D] border border-[#C5DEC8] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <span className="text-xs uppercase font-bold text-[#3F5E4D] tracking-widest">
                  Booking Confirmed
                </span>
                <h2 className="text-3xl font-bold font-serif-heading text-[#1C242B]">
                  Your Digital Travel Eco-Pass
                </h2>
                <p className="text-xs text-[#5A6560]">
                  Paperless pass dispatched to <span className="text-[#1C242B] font-semibold">{guestEmail}</span>
                </p>
              </div>

              {/* Digital Pass Ticket Card */}
              <div className="p-6 rounded-3xl bg-[#FAF7F2] border border-[#E8E1D1] text-left space-y-4 max-w-md mx-auto shadow-sm">
                <div className="flex justify-between items-center border-b border-[#E5DEC9] pb-3">
                  <div>
                    <h4 className="text-base font-bold font-serif-heading text-[#1C242B]">{destination.title}</h4>
                    <p className="text-xs text-[#3F5E4D]">{destination.location}</p>
                  </div>
                  <QrCode className="w-10 h-10 text-[#5A6560] shrink-0" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-[#5A6560]">
                  <div>
                    <span className="text-[#8A9590] block text-[10px]">TRAVELER</span>
                    <span className="font-semibold text-[#1C242B]">{guestName}</span>
                  </div>
                  <div>
                    <span className="text-[#8A9590] block text-[10px]">CHECK-IN</span>
                    <span className="font-semibold text-[#1C242B]">{checkInDate}</span>
                  </div>
                  <div>
                    <span className="text-[#8A9590] block text-[10px]">PASS ID</span>
                    <span className="font-mono text-[#3F5E4D] font-bold">PASS-2026-889</span>
                  </div>
                  <div>
                    <span className="text-[#8A9590] block text-[10px]">CARRYING STATUS</span>
                    <span className="text-[#3F5E4D] font-bold">Quota Verified</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <Link
                  href="/destinations"
                  className="py-3 px-6 rounded-2xl bg-[#1C242B] text-[#FAF7F2] font-semibold text-xs hover:bg-[#323D45] transition-colors"
                >
                  Browse Destinations Journal
                </Link>
                <Link
                  href="/"
                  className="py-3 px-6 rounded-2xl bg-[#FAF7F2] text-[#1C242B] border border-[#E8E1D1] font-semibold text-xs hover:bg-[#EBE4D5]"
                >
                  Return to Home
                </Link>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
