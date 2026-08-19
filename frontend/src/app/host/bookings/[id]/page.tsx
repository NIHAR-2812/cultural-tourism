'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { HostLayout } from '@/components/host/host-layout';
import { ApiClient, HostBooking } from '@/services/api';
import { ArrowLeft, User, CalendarCheck, MapPin, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';

export default function BookingDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [booking, setBooking] = useState<HostBooking | null>(null);

  useEffect(() => {
    async function loadBkg() {
      const b = await ApiClient.getBookingById(id);
      if (b) setBooking(b);
    }
    loadBkg();
  }, [id]);

  if (!booking) {
    return (
      <HostLayout pageTitle="Booking Details">
        <div className="p-12 text-center text-xs font-mono text-[#6B635B]">Loading Booking Details...</div>
      </HostLayout>
    );
  }

  return (
    <HostLayout pageTitle={`Booking: ${booking.id}`}>
      
      {/* RETURN LINK */}
      <div className="flex items-center justify-between border-b border-[#DDD4C8] pb-4">
        <Link href="/host/bookings" className="inline-flex items-center gap-1.5 text-xs text-[#6B635B] hover:text-[#2E2A25]">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to All Bookings
        </Link>
        <span className="text-xs font-mono text-[#A65A3A] bg-[#FAF6EE] px-3 py-1 rounded-full border border-[#DDD4C8]">
          Reference ID: {booking.id}
        </span>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* HERO STATUS CARD */}
        <div className="p-8 rounded-3xl bg-[#FAF6EE] border-2 border-[#DDD4C8] space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDD4C8] pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#A65A3A] font-bold">Confirmed Reservation</span>
              <h2 className="text-3xl font-bold font-serif-heading text-[#2E2A25]">
                {booking.customerName}
              </h2>
            </div>
            <span
              className={`px-3.5 py-1 rounded-full text-xs font-mono font-bold self-start sm:self-auto ${
                booking.status === 'Completed'
                  ? 'bg-[#EBF3EE] text-[#3F5E4D] border border-[#C5DEC8]'
                  : booking.status === 'Upcoming'
                  ? 'bg-[#FAF6EE] text-[#A65A3A] border border-[#A65A3A]/40'
                  : 'bg-[#FFF0F0] text-[#8C2E2E] border border-[#8C2E2E]/30'
              }`}
            >
              Status: {booking.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#6B635B]">
            <div className="space-y-1">
              <span className="font-mono uppercase text-[10px] text-[#A65A3A] font-bold block">Sanctuary Booked</span>
              <p className="text-base font-serif-heading font-bold text-[#2E2A25]">{booking.propertyName}</p>
            </div>

            <div className="space-y-1">
              <span className="font-mono uppercase text-[10px] text-[#A65A3A] font-bold block">Guest Stay Dates</span>
              <p className="text-base font-serif-heading font-bold text-[#2E2A25]">{booking.stayDates}</p>
            </div>

            <div className="space-y-1">
              <span className="font-mono uppercase text-[10px] text-[#6B635B] font-bold block">Number of Guests</span>
              <p className="text-sm font-bold text-[#2E2A25]">{booking.guestsCount} Guests</p>
            </div>

            <div className="space-y-1">
              <span className="font-mono uppercase text-[10px] text-[#6B635B] font-bold block">Booking Date</span>
              <p className="text-sm font-bold text-[#2E2A25]">{booking.bookingDate}</p>
            </div>
          </div>

          {/* FINANCIAL BREAKDOWN */}
          <div className="pt-4 border-t border-[#DDD4C8] space-y-2 text-xs">
            <span className="font-mono uppercase text-[10px] text-[#6B635B] font-bold block">Financial Distribution (92% Host Share)</span>
            <div className="flex justify-between items-center py-2 bg-[#F5F1EB] px-4 rounded-xl">
              <span className="font-bold text-[#2E2A25]">Host Net Revenue Payout</span>
              <span className="font-serif-heading font-bold text-lg text-[#5F6B4F]">₹{booking.payoutAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* CUSTOMER CONTACT CARD */}
        {booking.customerEmail && (
          <div className="p-6 rounded-3xl bg-[#FAF6EE] border border-[#DDD4C8] space-y-3 text-xs">
            <h3 className="font-bold text-[#2E2A25] font-serif-heading text-base flex items-center gap-2">
              <User className="w-4 h-4 text-[#A65A3A]" /> Customer Contact Information
            </h3>
            <div className="flex items-center gap-2 text-[#6B635B]">
              <Mail className="w-4 h-4 text-[#5F6B4F]" />
              <span>Customer Email: <strong className="text-[#2E2A25]">{booking.customerEmail}</strong></span>
            </div>
          </div>
        )}
      </div>

    </HostLayout>
  );
}
