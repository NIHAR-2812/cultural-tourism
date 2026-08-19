'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HostLayout } from '@/components/host/host-layout';
import { ApiClient } from '@/services/api';
import { Destination } from '@/components/data/mock-data';
import { Home, Plus, CheckCircle2, Clock, XCircle, ArrowUpRight, X } from 'lucide-react';

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState<Array<Destination & { status: 'Pending' | 'Live' | 'Rejected'; rejectionReason?: string }>>([]);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'Live' | 'Rejected'>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState(false);

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

  useEffect(() => {
    loadProps();
  }, []);

  const loadProps = async () => {
    const data = await ApiClient.getHostProperties();
    setProperties(data);
  };

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) return;
    setSubmitting(true);
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
      setSubmittedNotice(true);
      setModalOpen(false);
      loadProps();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProps = properties.filter((p) => activeFilter === 'All' || p.status === activeFilter);

  return (
    <HostLayout pageTitle="My Properties">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDD4C8] pb-4">
        <div>
          <h2 className="text-2xl font-bold font-serif-heading text-[#2E2A25]">
            Registered Sanctuaries
          </h2>
          <p className="text-xs text-[#6B635B]">
            Track status, daily guest limits, and approval state across your eco-properties.
          </p>
        </div>

        <button
          onClick={() => { setSubmittedNotice(false); setModalOpen(true); }}
          className="py-2.5 px-4 bg-[#A65A3A] hover:bg-[#8C482B] text-white font-semibold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Property
        </button>
      </div>

      {/* SUBMISSION NOTICE BANNER */}
      {submittedNotice && (
        <div className="p-4 rounded-2xl bg-[#FFF8EE] border-2 border-[#A65A3A] text-xs space-y-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#A65A3A]" />
            <div>
              <span className="font-bold text-[#A65A3A]">Property Submitted Successfully — Pending Approval</span>
              <p className="text-[#6B635B]">Your new sanctuary proposal has been sent to the Governance Council for review.</p>
            </div>
          </div>
          <button onClick={() => setSubmittedNotice(false)} className="text-[#6B635B] hover:text-[#2E2A25]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* FILTER TABS */}
      <div className="flex gap-2 text-xs">
        {(['All', 'Live', 'Pending', 'Rejected'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${
              activeFilter === filter
                ? 'bg-[#A65A3A] text-white shadow-sm'
                : 'bg-[#EBE5DC] text-[#6B635B] hover:bg-[#DDD4C8] hover:text-[#2E2A25]'
            }`}
          >
            {filter === 'Live' ? 'Approved / Live' : filter === 'Pending' ? 'Pending Approval' : filter}
          </button>
        ))}
      </div>

      {/* PROPERTIES LIST */}
      {filteredProps.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#FAF6EE] border border-[#DDD4C8] text-center text-xs space-y-3">
          <Home className="w-10 h-10 text-[#6B635B] mx-auto opacity-50" />
          <p className="font-bold text-[#2E2A25] text-base font-serif-heading">You haven&apos;t registered any properties yet.</p>
          <p className="text-[#6B635B] max-w-sm mx-auto">Click below to submit your first eco-sanctuary proposal for Council verification.</p>
          <button
            onClick={() => setModalOpen(true)}
            className="py-2.5 px-5 bg-[#A65A3A] text-white font-semibold text-xs rounded-xl shadow-sm hover:bg-[#8C482B]"
          >
            Add Your First Property
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProps.map((prop) => {
            const badgeConfig: Record<'Live' | 'Pending' | 'Rejected', { label: string; class: string }> = {
              Live: { label: 'Approved / Live', class: 'bg-[#5F6B4F] text-white' },
              Pending: { label: 'Pending Approval', class: 'bg-[#A65A3A] text-white' },
              Rejected: { label: 'Rejected', class: 'bg-[#8C2E2E] text-white' },
            };

            const statusKey = prop.status as 'Live' | 'Pending' | 'Rejected';

            return (
              <div
                key={prop.id}
                className="bg-[#FAF6EE] border border-[#DDD4C8] rounded-2xl overflow-hidden shadow-xs hover:border-[#A65A3A] transition-all flex flex-col justify-between"
              >
                <div className="h-44 w-full relative overflow-hidden bg-[#EBE5DC]">
                  <img src={prop.coverImage} alt={prop.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold shadow-xs ${badgeConfig[statusKey].class}`}>
                      {badgeConfig[statusKey].label}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#A65A3A] uppercase font-bold">{prop.location}</span>
                    <h3 className="font-bold text-lg font-serif-heading text-[#2E2A25]">{prop.title}</h3>
                    <p className="text-xs text-[#6B635B] font-light line-clamp-2">{prop.description}</p>
                  </div>

                  <div className="pt-3 border-t border-[#DDD4C8] space-y-2 text-xs">
                    <div className="flex justify-between text-[#6B635B]">
                      <span>Max Daily Carrying Capacity:</span>
                      <strong className="text-[#2E2A25]">{prop.maxCapacity} Guests</strong>
                    </div>
                    <div className="flex justify-between text-[#6B635B]">
                      <span>Nightly Tariff:</span>
                      <strong className="text-[#2E2A25]">₹{prop.price.toLocaleString('en-IN')}</strong>
                    </div>

                    <Link
                      href={`/host/properties/${prop.id}`}
                      className="w-full mt-2 py-2 px-4 bg-[#EBE5DC] hover:bg-[#DDD4C8] text-[#2E2A25] font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
                    >
                      View Details <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD PROPERTY MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF6EE] border-2 border-[#DDD4C8] rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#DDD4C8] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#A65A3A] font-bold">Steward Proposal Form</span>
                <h3 className="text-2xl font-bold font-serif-heading text-[#2E2A25]">Add New Eco Property</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-[#6B635B] hover:text-[#2E2A25]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProperty} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-mono uppercase text-[#6B635B] font-bold">Property Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Netravali Sacred Cloud Forest Treehouse"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-[#FAF6EE] p-3 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#A65A3A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono uppercase text-[#6B635B] font-bold">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-[#FAF6EE] p-3 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#A65A3A]"
                  >
                    <option value="Rainforest">Rainforest Sanctuary</option>
                    <option value="Village">Village Eco-Stay</option>
                    <option value="Coastal">Coastal Dune Retreat</option>
                    <option value="Wildlife">Wildlife Preserve</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-[#6B635B] font-bold">Max Daily Guests</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={50}
                    value={form.max_capacity}
                    onChange={(e) => setForm({ ...form, max_capacity: parseInt(e.target.value) || 12 })}
                    className="w-full bg-[#FAF6EE] p-3 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#A65A3A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono uppercase text-[#6B635B] font-bold">Price (₹ / night)</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 12500 })}
                    className="w-full bg-[#FAF6EE] p-3 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#A65A3A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-[#6B635B] font-bold">Location Region</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sanguem, South Goa"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full bg-[#FAF6EE] p-3 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#A65A3A]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase text-[#6B635B] font-bold">Cover Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full bg-[#FAF6EE] p-3 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#A65A3A]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase text-[#6B635B] font-bold">Sanctuary Description & Sustainability Pledge</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your renewable energy sources, local native village benefit sharing..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#FAF6EE] p-3 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#A65A3A]"
                />
              </div>

              <div className="p-3 bg-[#EBE5DC] rounded-xl text-[11px] text-[#A65A3A] font-mono">
                Note: Upon submission, status will set to Pending Approval for Council verification.
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-[#A65A3A] hover:bg-[#8C482B] text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
                >
                  {submitting ? 'Submitting...' : 'Submit Property Proposal →'}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="py-3 px-5 bg-[#EBE5DC] text-[#2E2A25] font-semibold text-xs rounded-xl hover:bg-[#DDD4C8]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </HostLayout>
  );
}
