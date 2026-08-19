'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRole } from '@/components/role-context';
import { ApiClient } from '@/services/api';
import { ArrowLeft, Clock, ShieldCheck, CheckCircle2, Upload } from 'lucide-react';

export default function NewLocationProposalPage() {
  const router = useRouter();
  const { isVerified } = useRole();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Rainforest',
    location: 'Western Ghats Biosphere',
    max_capacity: 12,
    price: 12500,
    latitude: 15.2,
    longitude: 74.0,
    imageUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) return;
    setLoading(true);

    try {
      await ApiClient.uploadLocation({
        title: form.title,
        description: form.description,
        max_capacity: form.max_capacity,
        latitude: form.latitude,
        longitude: form.longitude,
        price: form.price,
        category: form.category,
        location: form.location,
        images: [form.imageUrl || 'https://images.unsplash.com/photo-1511497584788-876761c139ab?auto=format&fit=crop&w=1200&q=80'],
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-12 py-12 space-y-8 bg-[#FAF7F2] text-[#1C242B]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E5DEC9] pb-4">
        <Link
          href="/host"
          className="inline-flex items-center gap-1.5 text-xs text-[#5A6560] hover:text-[#1C242B]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Host Studio
        </Link>
        <span className="text-xs font-mono text-[#A65A3A] bg-[#FAF6EE] px-3 py-1 rounded-full border border-[#DDD4C8]">
          Sanctuary Proposal Workflow
        </span>
      </div>

      {/* UNVERIFIED HOST GUARD BANNER */}
      {!isVerified && (
        <div className="p-8 rounded-3xl bg-[#FFF8EE] border-2 border-[#A65A3A] space-y-3 shadow-sm text-xs">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-[#A65A3A]" />
            <h2 className="text-xl font-bold font-serif-heading text-[#2E2A25]">
              Upload Location Blocked — Verification Pending
            </h2>
          </div>
          <p className="text-[#6B635B] leading-relaxed">
            Community Hosts must be verified by the Vanantara Governance Council before submitting locations for public catalog review.
          </p>
          <Link
            href="/host/verification"
            className="inline-block font-semibold text-[#A65A3A] underline underline-offset-4 hover:text-[#8C482B] pt-2"
          >
            Check Host Accreditation Status →
          </Link>
        </div>
      )}

      {/* SUCCESS SUBMISSION BANNER */}
      {submitted ? (
        <div className="p-8 rounded-3xl bg-[#FAF6EE] border-2 border-[#5F6B4F] space-y-4 text-xs shadow-md">
          <div className="flex items-center gap-3 text-[#5F6B4F]">
            <CheckCircle2 className="w-7 h-7" />
            <div>
              <span className="text-[10px] font-mono uppercase font-bold">Status: Pending Admin Approval</span>
              <h2 className="text-2xl font-bold font-serif-heading text-[#2E2A25]">
                Sanctuary Submitted for Admin Approval
              </h2>
            </div>
          </div>
          <p className="text-[#6B635B] leading-relaxed">
            Your sanctuary proposal for <strong className="text-[#2E2A25]">{form.title}</strong> has been submitted. It is now marked as <strong className="text-[#A65A3A]">Pending</strong> and will go <strong className="text-[#5F6B4F]">Live</strong> as soon as the Admin approves it.
          </p>
          <div className="pt-2 flex gap-4">
            <Link
              href="/host"
              className="py-2.5 px-5 bg-[#A65A3A] text-white font-semibold text-xs rounded-xl shadow-sm hover:bg-[#8C482B]"
            >
              Return to Host Studio →
            </Link>
            <button
              onClick={() => setSubmitted(false)}
              className="py-2.5 px-5 bg-[#EBE5DC] text-[#2E2A25] font-semibold text-xs rounded-xl hover:bg-[#DDD4C8]"
            >
              Submit Another Location
            </button>
          </div>
        </div>
      ) : (
        /* PROPOSAL FORM */
        <form onSubmit={handleSubmit} className="space-y-6 text-xs opacity-100">
          <div className="space-y-2 border-b border-[#E5DEC9] pb-4">
            <h1 className="text-3xl font-bold font-serif-heading text-[#1C242B]">
              Submit New Sanctuary Proposal
            </h1>
            <p className="text-[#5A6560]">
              Specify location details, daily capacity limits, and image assets.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="font-mono uppercase text-[#6B635B] font-bold">Sanctuary Title</label>
              <input
                type="text"
                required
                disabled={!isVerified}
                placeholder="e.g. Netravali Sacred Cloud Forest Treehouse"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-[#FAF6EE] p-3 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#A65A3A] disabled:opacity-50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-mono uppercase text-[#6B635B] font-bold">Category</label>
                <select
                  disabled={!isVerified}
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-[#FAF6EE] p-3 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#A65A3A] disabled:opacity-50"
                >
                  <option value="Rainforest">Sacred Rainforest</option>
                  <option value="Village">Village Stay</option>
                  <option value="Coastal">Coastal Dunes</option>
                  <option value="Wildlife">Wildlife Sanctuary</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase text-[#6B635B] font-bold">Maximum Daily Capacity</label>
                <input
                  type="number"
                  required
                  disabled={!isVerified}
                  min={1}
                  max={50}
                  value={form.max_capacity}
                  onChange={(e) => setForm({ ...form, max_capacity: parseInt(e.target.value) || 12 })}
                  className="w-full bg-[#FAF6EE] p-3 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#A65A3A] disabled:opacity-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-mono uppercase text-[#6B635B] font-bold">Base Price (INR ₹ / night)</label>
                <input
                  type="number"
                  required
                  disabled={!isVerified}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 12000 })}
                  className="w-full bg-[#FAF6EE] p-3 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#A65A3A] disabled:opacity-50"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase text-[#6B635B] font-bold">Location Region</label>
                <input
                  type="text"
                  required
                  disabled={!isVerified}
                  placeholder="e.g. Sanguem, South Goa"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full bg-[#FAF6EE] p-3 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#A65A3A] disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-mono uppercase text-[#6B635B] font-bold">Cover Image URL</label>
              <input
                type="url"
                disabled={!isVerified}
                placeholder="https://images.unsplash.com/..."
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full bg-[#FAF6EE] p-3 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#A65A3A] disabled:opacity-50"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono uppercase text-[#6B635B] font-bold">Eco Description & Carrying Pledge</label>
              <textarea
                rows={4}
                required
                disabled={!isVerified}
                placeholder="Describe your sanctuary's renewable energy, zero-plastic policy, and native community benefit sharing..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-[#FAF6EE] p-3 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#A65A3A] disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!isVerified || loading}
            className="w-full py-3.5 bg-[#A65A3A] hover:bg-[#8C482B] text-white font-semibold text-xs rounded-xl transition-colors shadow-sm disabled:opacity-45 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {loading ? 'Submitting Proposal...' : 'Submit Location for Admin Approval →'}
          </button>
        </form>
      )}

    </div>
  );
}
