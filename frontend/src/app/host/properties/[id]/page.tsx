'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { HostLayout } from '@/components/host/host-layout';
import { ApiClient, HostBooking } from '@/services/api';
import { Destination } from '@/components/data/mock-data';
import { ArrowLeft, Clock, CheckCircle2, XCircle, MapPin, Users, CalendarCheck, Feather } from 'lucide-react';

export default function PropertyDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [property, setProperty] = useState<(Destination & { status: 'Pending' | 'Live' | 'Rejected'; rejectionReason?: string }) | null>(null);
  const [bookings, setBookings] = useState<HostBooking[]>([]);

  useEffect(() => {
    async function loadProp() {
      const p = await ApiClient.getPropertyById(id);
      if (p) setProperty(p);
      const b = await ApiClient.getHostBookings('All');
      setBookings(b.filter((bkg) => bkg.propertyId === id));
    }
    loadProp();
  }, [id]);

  if (!property) {
    return (
      <HostLayout pageTitle="Property Details">
        <div className="p-12 text-center text-xs font-mono text-[#6B635B]">Loading Property Details...</div>
      </HostLayout>
    );
  }

  return (
    <HostLayout pageTitle={`Property: ${property.title}`}>
      
      {/* RETURN BUTTON */}
      <div className="flex items-center justify-between border-b border-[#DDD4C8] pb-4">
        <Link href="/host/properties" className="inline-flex items-center gap-1.5 text-xs text-[#6B635B] hover:text-[#2E2A25]">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to My Properties
        </Link>
        <span className="text-xs font-mono text-[#A65A3A] bg-[#FAF6EE] px-3 py-1 rounded-full border border-[#DDD4C8]">
          Eco Score {property.sustainabilityScore}/100
        </span>
      </div>

      {/* PROPERTY APPROVAL STATE NOTICE BANNERS */}
      {property.status === 'Pending' && (
        <div className="p-6 rounded-3xl bg-[#FFF8EE] border-2 border-[#A65A3A] space-y-2 text-xs shadow-sm">
          <div className="flex items-center gap-3 font-bold text-sm text-[#A65A3A]">
            <Clock className="w-5 h-5" />
            Your property is waiting for approval.
          </div>
          <p className="text-[#6B635B] font-light leading-relaxed">
            Your property proposal has been received by the Western Ghats Conservation Council. Once verified, it will go live and become bookable automatically.
          </p>
        </div>
      )}

      {property.status === 'Live' && (
        <div className="p-6 rounded-3xl bg-[#F2F6F3] border-2 border-[#5F6B4F] space-y-2 text-xs shadow-sm">
          <div className="flex items-center gap-3 font-bold text-sm text-[#5F6B4F]">
            <CheckCircle2 className="w-5 h-5" />
            Your property is live and available for bookings.
          </div>
          <p className="text-[#6B635B] font-light leading-relaxed">
            This sanctuary is actively published in the public Tourist catalog operating under daily carrying capacity limits.
          </p>
        </div>
      )}

      {property.status === 'Rejected' && (
        <div className="p-6 rounded-3xl bg-[#FFF0F0] border-2 border-[#8C2E2E] space-y-2 text-xs shadow-sm">
          <div className="flex items-center gap-3 font-bold text-sm text-[#8C2E2E]">
            <XCircle className="w-5 h-5" />
            Your property was not approved.
          </div>
          {property.rejectionReason && (
            <p className="text-[#8C2E2E] font-medium">Rejection Reason: {property.rejectionReason}</p>
          )}
        </div>
      )}

      {/* HERO IMAGE & DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="h-80 w-full rounded-3xl overflow-hidden border border-[#DDD4C8] bg-[#EBE5DC]">
            <img src={property.coverImage} alt={property.title} className="w-full h-full object-cover" />
          </div>

          <div className="p-6 rounded-3xl bg-[#FAF6EE] border border-[#DDD4C8] space-y-4 text-xs">
            <h3 className="text-xl font-bold font-serif-heading text-[#2E2A25]">Sanctuary Description</h3>
            <p className="text-[#6B635B] leading-relaxed font-light">{property.longDescription || property.description}</p>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-[#FAF6EE] border-2 border-[#DDD4C8] space-y-5 text-xs shadow-sm">
            <div className="space-y-1 border-b border-[#DDD4C8] pb-4">
              <span className="text-[10px] uppercase font-mono text-[#A65A3A] font-bold">{property.location}</span>
              <h2 className="text-2xl font-bold font-serif-heading text-[#2E2A25]">{property.title}</h2>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-[#DDD4C8] text-[#6B635B]">
                <span>Status Badge:</span>
                <strong className="text-[#2E2A25]">{property.status}</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-[#DDD4C8] text-[#6B635B]">
                <span>Daily Guest Capacity:</span>
                <strong className="text-[#2E2A25]">{property.maxCapacity} Guests</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-[#DDD4C8] text-[#6B635B]">
                <span>Nightly Tariff:</span>
                <strong className="text-[#2E2A25]">₹{property.price.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-[#DDD4C8] text-[#6B635B]">
                <span>Total Bookings Received:</span>
                <strong className="text-[#2E2A25]">{bookings.length} Bookings</strong>
              </div>
            </div>
          </div>

          {/* ASSOCIATED BOOKINGS SUMMARY */}
          <div className="p-6 rounded-3xl bg-[#FAF6EE] border border-[#DDD4C8] space-y-4 text-xs">
            <h4 className="font-bold text-[#2E2A25] font-serif-heading text-base border-b border-[#DDD4C8] pb-2">
              Bookings for this Property
            </h4>

            {bookings.length === 0 ? (
              <p className="text-[#6B635B] font-light text-center py-4">No bookings received for this property yet.</p>
            ) : (
              <div className="space-y-2">
                {bookings.map((bkg) => (
                  <div key={bkg.id} className="p-3 rounded-xl bg-[#F5F1EB] flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-[#2E2A25]">{bkg.customerName}</p>
                      <p className="text-[10px] text-[#6B635B]">{bkg.stayDates}</p>
                    </div>
                    <span className="font-semibold text-[#5F6B4F]">₹{bkg.payoutAmount.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </HostLayout>
  );
}
