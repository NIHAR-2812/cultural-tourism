'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HostLayout } from '@/components/host/host-layout';
import { useRole } from '@/components/role-context';
import { ApiClient, HostBooking } from '@/services/api';
import { Destination } from '@/components/data/mock-data';
import {
  Home,
  Clock,
  CheckCircle2,
  CalendarCheck,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  XCircle,
  X,
} from 'lucide-react';

export default function HostDashboardHomePage() {
  const { user } = useRole();
  const [stats, setStats] = useState({
    totalProperties: 0,
    pendingApprovals: 0,
    acceptedProperties: 0,
    totalBookings: 0,
    upcomingBookings: 0,
  });
  const [properties, setProperties] = useState<Array<Destination & { status: 'Pending' | 'Live' | 'Rejected'; rejectionReason?: string }>>([]);
  const [recentBookings, setRecentBookings] = useState<HostBooking[]>([]);
  const [loading, setLoading] = useState(true);

  // REGISTER NEW PROPERTY MODAL STATE
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
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const s = await ApiClient.getHostStats();
      setStats(s);
      const props = await ApiClient.getHostProperties();
      setProperties(props);
      const bkgs = await ApiClient.getHostBookings('Upcoming');
      setRecentBookings(bkgs.slice(0, 3));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <HostLayout pageTitle="Dashboard Overview">
      
      {submittedNotice && (
        <div className="p-4 rounded-2xl bg-[#EBF3EE] border border-[#C5DEC8] text-[#3F5E4D] text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#3F5E4D]" />
            <span><strong>Property Submitted!</strong> Your sanctuary application is now Pending Admin/Council Verification.</span>
          </div>
          <button onClick={() => setSubmittedNotice(false)} className="text-[11px] font-bold text-[#3F5E4D]">Dismiss</button>
        </div>
      )}

      {/* WELCOME BANNER WITH REGISTER PROPERTY BUTTON */}
      <div className="p-8 rounded-3xl bg-[#FAF6EE] border-2 border-[#DDD4C8] border-t-4 border-t-[#A65A3A] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#A65A3A] font-bold">
            Property Steward Studio
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-heading text-[#2E2A25]">
            Welcome back, {user?.name || 'Devendra Kulkarni'}
          </h2>
          <p className="text-xs text-[#6B635B] font-light max-w-xl leading-relaxed">
            Manage your registered sanctuaries, track governance approval pipeline, and coordinate upcoming traveler reservations.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-3 rounded-xl bg-[#A65A3A] hover:bg-[#8C482B] text-white font-semibold text-xs transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Register New Property
        </button>
      </div>

      {/* STATISTICS CARDS - DM SANS CLEAN UPRIGHT NUMBERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-[#FAF6EE] border border-[#DDD4C8] space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[#6B635B]">
            <span className="text-xs font-mono uppercase font-bold">Total Properties</span>
            <Home className="w-4 h-4 text-[#A65A3A]" />
          </div>
          <p className="text-3xl font-semibold font-number text-[#2E2A25] tracking-tight">{stats.totalProperties}</p>
          <p className="text-[11px] text-[#6B635B] font-light">Registered under steward account</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#FAF6EE] border border-[#DDD4C8] space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[#6B635B]">
            <span className="text-xs font-mono uppercase font-bold">Pending Approvals</span>
            <Clock className="w-4 h-4 text-[#A65A3A]" />
          </div>
          <p className="text-3xl font-semibold font-number text-[#A65A3A] tracking-tight">{stats.pendingApprovals}</p>
          <p className="text-[11px] text-[#6B635B] font-light">Awaiting Council review</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#FAF6EE] border border-[#DDD4C8] space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[#6B635B]">
            <span className="text-xs font-mono uppercase font-bold">Accepted / Live</span>
            <CheckCircle2 className="w-4 h-4 text-[#5F6B4F]" />
          </div>
          <p className="text-3xl font-semibold font-number text-[#5F6B4F] tracking-tight">{stats.acceptedProperties}</p>
          <p className="text-[11px] text-[#6B635B] font-light">Active in tourist catalog</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#FAF6EE] border border-[#DDD4C8] space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[#6B635B]">
            <span className="text-xs font-mono uppercase font-bold">Total Bookings</span>
            <CalendarCheck className="w-4 h-4 text-[#2E2A25]" />
          </div>
          <p className="text-3xl font-semibold font-number text-[#2E2A25] tracking-tight">{stats.totalBookings}</p>
          <p className="text-[11px] text-[#5F6B4F] font-semibold"><span className="font-number font-semibold">{stats.upcomingBookings}</span> upcoming arrivals</p>
        </div>
      </div>

      {/* PROPERTY STATUS OVERVIEW */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#DDD4C8] pb-3">
          <div>
            <h3 className="text-2xl font-bold font-serif-heading text-[#2E2A25]">
              Property Status Overview
            </h3>
            <p className="text-xs text-[#6B635B]">Registered sanctuaries and carrying capacity health</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="text-xs font-semibold text-[#A65A3A] hover:underline flex items-center gap-1"
            >
              + Register Property
            </button>
            <Link
              href="/host/properties"
              className="text-xs font-semibold text-[#5F6B4F] hover:underline flex items-center gap-1"
            >
              View All Properties →
            </Link>
          </div>
        </div>

        {properties.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#FAF6EE] border border-[#DDD4C8] text-center text-xs text-[#6B635B] space-y-3">
            <p className="font-bold text-[#2E2A25]">You haven&apos;t registered any properties yet.</p>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-block py-2.5 px-5 bg-[#A65A3A] text-white font-semibold text-xs rounded-xl"
            >
              Register Your First Property
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {properties.map((prop) => {
              const statusColors: Record<'Live' | 'Pending' | 'Rejected', string> = {
                Live: 'bg-[#5F6B4F] text-white',
                Pending: 'bg-[#A65A3A] text-white',
                Rejected: 'bg-[#8C2E2E] text-white',
              };

              const statusLabels: Record<'Live' | 'Pending' | 'Rejected', string> = {
                Live: 'Approved / Live',
                Pending: 'Pending Approval',
                Rejected: 'Rejected',
              };

              const statusKey = prop.status as 'Live' | 'Pending' | 'Rejected';

              return (
                <div
                  key={prop.id}
                  className="p-5 rounded-2xl bg-[#FAF6EE] border border-[#DDD4C8] flex flex-col justify-between space-y-4 shadow-xs"
                >
                  <div className="flex gap-4">
                    <img
                      src={prop.coverImage}
                      alt={prop.title}
                      className="w-20 h-20 rounded-xl object-cover border border-[#DDD4C8]"
                    />
                    <div className="space-y-1 text-xs">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${statusColors[statusKey]}`}>
                        {statusLabels[statusKey]}
                      </span>
                      <h4 className="font-bold font-serif-heading text-base text-[#2E2A25]">{prop.title}</h4>
                      <p className="text-[#6B635B]">{prop.location} • Max Capacity: <span className="font-number font-semibold">{prop.maxCapacity}</span> Guests</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#DDD4C8] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#6B635B]">
                      Tariff: <strong className="text-[#2E2A25] font-number font-semibold">₹{prop.price.toLocaleString('en-IN')}/night</strong>
                    </span>
                    <Link
                      href={`/host/properties/${prop.id}`}
                      className="text-xs font-semibold text-[#A65A3A] hover:underline flex items-center gap-1"
                    >
                      View Details <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* UPCOMING BOOKINGS */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-[#DDD4C8] pb-3">
          <h3 className="text-2xl font-bold font-serif-heading text-[#2E2A25]">
            Upcoming Guest Arrivals
          </h3>
          <Link href="/host/bookings" className="text-xs font-semibold text-[#A65A3A] hover:underline">
            View All Bookings →
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#FAF6EE] border border-[#DDD4C8] text-center text-xs text-[#6B635B]">
            No upcoming bookings yet.
          </div>
        ) : (
          <div className="space-y-3">
            {recentBookings.map((bkg) => (
              <div
                key={bkg.id}
                className="p-4 rounded-xl bg-[#FAF6EE] border border-[#DDD4C8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-[#A65A3A]">{bkg.id}</span>
                    <h4 className="font-bold text-[#2E2A25] font-serif-heading text-sm">{bkg.customerName}</h4>
                  </div>
                  <p className="text-[#6B635B] font-light">
                    {bkg.propertyName} • <strong className="text-[#2E2A25]">{bkg.stayDates}</strong> (<span className="font-number font-semibold">{bkg.guestsCount}</span> Guests)
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-number font-semibold text-sm text-[#5F6B4F]">
                    ₹{bkg.payoutAmount.toLocaleString('en-IN')}
                  </span>
                  <Link
                    href={`/host/bookings/${bkg.id}`}
                    className="py-1.5 px-3 bg-[#EBE5DC] hover:bg-[#DDD4C8] text-[#2E2A25] font-semibold text-xs rounded-lg transition-colors"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* REGISTER NEW PROPERTY MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF6EE] border-2 border-[#DDD4C8] rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#DDD4C8] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#A65A3A] font-bold">Steward Proposal Form</span>
                <h3 className="text-2xl font-bold font-serif-heading text-[#2E2A25]">Register New Property</h3>
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
                    step={500}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 12000 })}
                    className="w-full bg-[#FAF6EE] p-3 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#A65A3A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-[#6B635B] font-bold">Location / Region</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Netravali, South Goa"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full bg-[#FAF6EE] p-3 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#A65A3A]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase text-[#6B635B] font-bold">Property Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full bg-[#FAF6EE] p-3 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#A65A3A]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono uppercase text-[#6B635B] font-bold">Eco Carrying Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your renewable energy sources, community employment share, and zero plastic practices..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#FAF6EE] p-3 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#A65A3A]"
                />
              </div>

              <div className="pt-4 border-t border-[#DDD4C8] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#EBE5DC] text-[#2E2A25] font-semibold hover:bg-[#DDD4C8] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#A65A3A] hover:bg-[#8C482B] text-white font-semibold shadow-sm transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Submitting Proposal...' : 'Submit Property Proposal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </HostLayout>
  );
}
