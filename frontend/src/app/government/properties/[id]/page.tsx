'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { GovernmentLayout } from '@/components/government/government-layout';
import { ApiClient, HostBooking } from '@/services/api';
import { Destination } from '@/components/data/mock-data';
import { ArrowLeft, CheckCircle2, XCircle, FileText, AlertTriangle } from 'lucide-react';

export default function PropertyVerificationPage() {
  const params = useParams();
  const id = params.id as string;

  const [property, setProperty] = useState<(Destination & { status: 'Pending' | 'Live' | 'Rejected'; rejectionReason?: string; submittedDate?: string; approvalDate?: string }) | null>(null);
  const [bookings, setBookings] = useState<HostBooking[]>([]);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectPrompt, setShowRejectPrompt] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  
  // NEW: Add an error state to handle failed API requests
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProp();
  }, [id]);

  const loadProp = async () => {
    try {
      setError(null); // Clear previous errors
      const p = await ApiClient.getPropertyById(id);
      
      if (p) {
        setProperty(p);
      } else {
        // Fix: Set the error state directly and stop running instead of throwing an error
        setError(`Property ID ${id} does not exist in the database.`);
        return; 
      }
      
      const b = await ApiClient.getAllPortalBookings('All', id);
      setBookings(b);
    } catch (err: any) {
      console.error("Failed to load property dossier:", err);
      setError(err.message || "Failed to connect to the backend API.");
    }
  };

  const handleApprove = async () => {
    if (!property) return;
    const res = await ApiClient.approveLocation(property.id);
    if (res) {
      setActionMessage(`Property "${property.title}" has been APPROVED. Status updated to Live.`);
      loadProp();
    }
  };

  const handleReject = async () => {
    if (!property) return;
    const res = await ApiClient.rejectLocation(property.id, rejectReason);
    if (res) {
      setActionMessage(`Property "${property.title}" has been REJECTED.`);
      setShowRejectPrompt(false);
      loadProp();
    }
  };

  // NEW: Display the error message if the fetch failed
  if (error) {
    return (
      <GovernmentLayout pageTitle="Property Verification Error">
        <div className="p-12 flex flex-col items-center gap-4">
          <div className="text-center text-sm font-mono text-[#8C2E2E] bg-[#FFF0F0] p-4 rounded-xl border border-[#8C2E2E]/30">
            Error Loading Dossier: {error}
          </div>
          <Link href="/government/properties" className="inline-flex items-center gap-1.5 text-xs text-[#6B635B] hover:text-[#2E2A25] underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Applications
          </Link>
        </div>
      </GovernmentLayout>
    );
  }

  // Original loading state
  if (!property) {
    return (
      <GovernmentLayout pageTitle="Property Verification">
        <div className="p-12 text-center text-xs font-mono text-[#6B635B]">Loading Property Dossier...</div>
      </GovernmentLayout>
    );
  }

  return (
    <GovernmentLayout pageTitle={`Verification: ${property.title}`}>
      
      {/* RETURN BUTTON */}
      <div className="flex items-center justify-between border-b border-[#DDD4C8] pb-4">
        <Link href="/government/properties" className="inline-flex items-center gap-1.5 text-xs text-[#6B635B] hover:text-[#2E2A25]">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Property Applications
        </Link>
        <span className="text-xs font-mono text-[#5F6B4F] bg-[#FAF6EE] px-3 py-1 rounded-full border border-[#DDD4C8]">
          Eco Compliance Score {property.sustainabilityScore}/100
        </span>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-[#EBF3EE] border border-[#C5DEC8] text-[#3F5E4D] text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#3F5E4D]" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* APPROVAL DECISION ACTION PANEL */}
      <div className="p-6 rounded-3xl bg-[#FAF6EE] border-2 border-[#DDD4C8] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono text-[#5F6B4F] font-bold">Verification Decision Panel</span>
          <h2 className="text-2xl font-bold font-serif-heading text-[#2E2A25]">
            Application Status: <span className={property.status === 'Live' ? 'text-[#5F6B4F]' : property.status === 'Pending' ? 'text-[#A65A3A]' : 'text-[#8C2E2E]'}>{property.status === 'Live' ? 'Approved / Live' : property.status === 'Pending' ? 'Pending Review' : 'Rejected'}</span>
          </h2>
          <p className="text-xs text-[#6B635B] font-light">
            Review submitted environmental metrics, daily capacity limits, and spatial coordinates.
          </p>
        </div>

        <div className="flex gap-3">
          {property.status === 'Pending' && (
            <>
              <button
                onClick={handleApprove}
                className="py-3 px-6 bg-[#5F6B4F] hover:bg-[#4E5B3F] text-white font-semibold text-xs rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve & Publish Live
              </button>

              <button
                onClick={() => setShowRejectPrompt(true)}
                className="py-3 px-6 bg-[#8C2E2E] hover:bg-[#722525] text-white font-semibold text-xs rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" /> Reject Application
              </button>
            </>
          )}

          {property.status === 'Live' && (
            <span className="py-2.5 px-5 bg-[#EBF3EE] text-[#3F5E4D] font-mono text-xs font-bold rounded-xl border border-[#C5DEC8] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Approved on {property.approvalDate || 'Aug 14, 2026'}
            </span>
          )}

          {property.status === 'Rejected' && (
            <span className="py-2.5 px-5 bg-[#FFF0F0] text-[#8C2E2E] font-mono text-xs font-bold rounded-xl border border-[#8C2E2E]/30 flex items-center gap-2">
              <XCircle className="w-4 h-4" /> Application Rejected
            </span>
          )}
        </div>
      </div>

      {/* REJECT PROMPT MODAL */}
      {showRejectPrompt && (
        <div className="p-6 rounded-3xl bg-[#FFF0F0] border-2 border-[#8C2E2E] space-y-4 text-xs shadow-md">
          <div className="flex items-center gap-2 text-[#8C2E2E] font-bold text-sm">
            <AlertTriangle className="w-5 h-5" />
            Provide Rejection Reason for Host Notification
          </div>
          <textarea
            rows={3}
            placeholder="e.g. Daily capacity exceeds safe buffer limits for elephant migration corridor..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full p-3 bg-white border border-[#DDD4C8] rounded-xl text-xs text-[#2E2A25]"
          />
          <div className="flex gap-3">
            <button
              onClick={handleReject}
              className="py-2.5 px-5 bg-[#8C2E2E] text-white font-semibold rounded-xl text-xs"
            >
              Confirm Rejection
            </button>
            <button
              onClick={() => setShowRejectPrompt(false)}
              className="py-2.5 px-4 bg-[#EBE5DC] text-[#2E2A25] font-semibold rounded-xl text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ORIGINAL INTAKE RECORD SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="h-80 w-full rounded-3xl overflow-hidden border border-[#DDD4C8] bg-[#EBE5DC]">
            <img src={property.coverImage} alt={property.title} className="w-full h-full object-cover" />
          </div>

          <div className="p-6 rounded-3xl bg-[#FAF6EE] border border-[#DDD4C8] space-y-4 text-xs">
            <h3 className="text-xl font-bold font-serif-heading text-[#2E2A25] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#5F6B4F]" /> Original Intake Application Record
            </h3>
            <div className="space-y-3 text-[#6B635B] font-light">
              <p className="leading-relaxed"><strong className="text-[#2E2A25]">Submitted Description:</strong> {property.longDescription || property.description}</p>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#DDD4C8]">
                <div>
                  <span className="font-mono text-[10px] uppercase text-[#5F6B4F] font-bold block">Submission Date</span>
                  <p className="font-bold text-[#2E2A25]">{property.submittedDate || 'Aug 14, 2026'}</p>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase text-[#5F6B4F] font-bold block">Spatial Coordinates</span>
                  <p className="font-bold text-[#2E2A25]">
                    {property.coordinates?.lat ?? (property as any).latitude ?? 'N/A'}° N, {' '}
                    {property.coordinates?.lng ?? (property as any).longitude ?? 'N/A'}° E
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-[#FAF6EE] border-2 border-[#DDD4C8] space-y-5 text-xs shadow-sm">
            <div className="space-y-1 border-b border-[#DDD4C8] pb-4">
              <span className="text-[10px] uppercase font-mono text-[#5F6B4F] font-bold">{property.location}</span>
              <h2 className="text-2xl font-bold font-serif-heading text-[#2E2A25]">{property.title}</h2>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-[#DDD4C8] text-[#6B635B]">
                <span>Host Steward:</span>
                <strong className="text-[#2E2A25]">{property.host.name}</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-[#DDD4C8] text-[#6B635B]">
                <span>Host Impact Role:</span>
                <strong className="text-[#5F6B4F]">{property.host.communityImpact}</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-[#DDD4C8] text-[#6B635B]">
                <span>Submitted Daily Capacity:</span>
                <strong className="text-[#2E2A25]">{property.maxCapacity} Guests</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-[#DDD4C8] text-[#6B635B]">
                <span>Submitted Nightly Tariff:</span>
                <strong className="text-[#2E2A25]">₹{property.price.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-[#DDD4C8] text-[#6B635B]">
                <span>Clean Energy Standard:</span>
                <strong className="text-[#5F6B4F]">100% Solar Clean Power</strong>
              </div>
            </div>
          </div>

          {/* PROPERTY-SPECIFIC BOOKINGS SECTION */}
          <div className="p-6 rounded-3xl bg-[#FAF6EE] border border-[#DDD4C8] space-y-4 text-xs">
            <h4 className="font-bold text-[#2E2A25] font-serif-heading text-base border-b border-[#DDD4C8] pb-2">
              Bookings for this Specific Property ({bookings.length})
            </h4>

            {bookings.length === 0 ? (
              <p className="text-[#6B635B] font-light text-center py-4">No bookings recorded for this property.</p>
            ) : (
              <div className="space-y-2">
                {bookings.map((bkg) => (
                  <div key={bkg.id} className="p-3 rounded-xl bg-[#F5F1EB] flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-[#2E2A25]">{bkg.customerName}</p>
                      <p className="text-[10px] text-[#6B635B]">{bkg.stayDates} ({bkg.guestsCount} Guests)</p>
                    </div>
                    <span className="font-semibold text-[#5F6B4F]">₹{bkg.payoutAmount.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </GovernmentLayout>
  );
}