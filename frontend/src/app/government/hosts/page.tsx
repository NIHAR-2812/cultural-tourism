'use client';

import React, { useState, useEffect } from 'react';
import { GovernmentLayout } from '@/components/government/government-layout';
import { ApiClient, User } from '@/services/api';
import { CheckCircle2, XCircle, Clock, Search, ShieldCheck, UserCheck, X } from 'lucide-react';

export default function GovernmentHostsPage() {
  const [hosts, setHosts] = useState<User[]>([]);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // REJECT MODAL STATE
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedHost, setSelectedHost] = useState<User | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadHosts();
  }, [activeFilter]);

  const loadHosts = async () => {
    setLoading(true);
    try {
      const data = await ApiClient.getAllHosts(activeFilter);
      setHosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveHost = async (hostId: string) => {
    setProcessing(true);
    try {
      await ApiClient.approveHost(hostId);
      await loadHosts();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const openRejectModal = (host: User) => {
    setSelectedHost(host);
    setRejectionReason('Exceeds maximum allowable daily guest carrying limits for core tiger habitat zone.');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHost) return;
    setProcessing(true);
    try {
      await ApiClient.rejectHost(selectedHost.id, rejectionReason);
      setRejectModalOpen(false);
      setSelectedHost(null);
      await loadHosts();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const filteredHosts = hosts.filter((h) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      h.name.toLowerCase().includes(q) ||
      h.email.toLowerCase().includes(q) ||
      (h.community_name && h.community_name.toLowerCase().includes(q))
    );
  });

  return (
    <GovernmentLayout pageTitle="Host Verification">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDD4C8] pb-4">
        <div>
          <h2 className="text-2xl font-bold font-serif-heading text-[#2E2A25]">
            Host Steward Accreditation &amp; Verification
          </h2>
          <p className="text-xs text-[#6B635B]">
            Audit newly registered native community stewards before granting login and property publishing access.
          </p>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#6B635B] absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search by steward name, email or sanctuary..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FAF6EE] pl-9 pr-3 py-2.5 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#5F6B4F]"
          />
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                activeFilter === filter
                  ? 'bg-[#5F6B4F] text-white shadow-sm'
                  : 'bg-[#EBE5DC] text-[#6B635B] hover:bg-[#DDD4C8] hover:text-[#2E2A25]'
              }`}
            >
              {filter === 'Pending' ? 'Pending Review' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* HOSTS TABLE */}
      {loading ? (
        <div className="py-12 text-center text-xs font-mono text-[#6B635B]">Loading Host Stewards...</div>
      ) : filteredHosts.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#FAF6EE] border border-[#DDD4C8] text-center text-xs space-y-3">
          <UserCheck className="w-10 h-10 text-[#6B635B] mx-auto opacity-50" />
          <p className="font-bold text-[#2E2A25] text-base font-serif-heading">No host stewards found.</p>
          <p className="text-[#6B635B]">There are no host applications matching your search or filter selection.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#DDD4C8] bg-[#FAF6EE] shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#DDD4C8] bg-[#F5F1EB] font-mono uppercase text-[10px] text-[#6B635B]">
                <th className="p-4 min-w-[180px]">Host Steward Name</th>
                <th className="p-4 min-w-[180px]">Email Address</th>
                <th className="p-4 min-w-[160px]">Community Sanctuary</th>
                <th className="p-4 whitespace-nowrap">Registration Date</th>
                <th className="p-4 text-center whitespace-nowrap">Approval Status</th>
                <th className="p-4 text-center whitespace-nowrap">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD4C8]">
              {filteredHosts.map((h) => {
                const statusKey = h.approval_status || (h.is_verified ? 'approved' : 'pending');

                const statusColors = {
                  approved: 'bg-[#EBF3EE] text-[#3F5E4D] border border-[#C5DEC8]',
                  pending: 'bg-[#FAF6EE] text-[#A65A3A] border border-[#A65A3A]/40',
                  rejected: 'bg-[#FFF0F0] text-[#8C2E2E] border border-[#8C2E2E]/30',
                };

                const statusLabels = {
                  approved: 'Approved',
                  pending: 'Pending Review',
                  rejected: 'Rejected',
                };

                return (
                  <tr key={h.id} className="hover:bg-[#F5F1EB]/60 transition-colors">
                    <td className="p-4 font-serif-heading font-bold text-[#2E2A25] text-sm">{h.name}</td>
                    <td className="p-4 font-mono text-[#6B635B]">{h.email}</td>
                    <td className="p-4 text-[#2E2A25]">{h.community_name || 'Native Ecosystem Sanctuary'}</td>
                    <td className="p-4 text-[#6B635B] font-mono whitespace-nowrap">{h.joined_date || '2026-08-15'}</td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-mono font-bold whitespace-nowrap shadow-xs ${statusColors[statusKey]}`}>
                        {statusLabels[statusKey]}
                      </span>
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      {statusKey === 'approved' ? (
                        <span className="text-[11px] font-mono font-semibold text-[#3F5E4D] flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Login Authorized
                        </span>
                      ) : statusKey === 'rejected' ? (
                        <div className="space-y-1">
                          <span className="text-[11px] font-mono font-semibold text-[#8C2E2E] flex items-center justify-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Login Access Blocked
                          </span>
                          <button
                            onClick={() => handleApproveHost(h.id)}
                            disabled={processing}
                            className="text-[10px] font-bold text-[#5F6B4F] underline hover:text-[#4E5B3F]"
                          >
                            Re-evaluate &amp; Approve
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleApproveHost(h.id)}
                            disabled={processing}
                            className="py-1.5 px-3 bg-[#5F6B4F] hover:bg-[#4E5B3F] text-white font-semibold text-xs rounded-xl transition-colors shadow-xs flex items-center gap-1 disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => openRejectModal(h)}
                            disabled={processing}
                            className="py-1.5 px-3 bg-[#FFF0F0] hover:bg-[#FDE8E8] text-[#8C2E2E] border border-[#8C2E2E]/30 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1 disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* REJECT CONFIRMATION MODAL */}
      {rejectModalOpen && selectedHost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF6EE] border-2 border-[#DDD4C8] border-t-4 border-t-[#8C2E2E] rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#DDD4C8] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#8C2E2E] font-bold">Government Accreditation Action</span>
                <h3 className="text-2xl font-bold font-serif-heading text-[#2E2A25]">Reject Host Application</h3>
              </div>
              <button onClick={() => setRejectModalOpen(false)} className="text-[#6B635B] hover:text-[#2E2A25]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-4 text-xs">
              <p className="text-[#6B635B]">
                Are you sure you want to reject steward <strong className="text-[#2E2A25]">{selectedHost.name}</strong> ({selectedHost.email})? They will be unable to log in.
              </p>

              <div className="space-y-1">
                <label className="font-mono uppercase text-[#8C2E2E] font-bold">Rejection Reason</label>
                <textarea
                  rows={3}
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full bg-[#FAF6EE] p-3 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#8C2E2E]"
                />
              </div>

              <div className="pt-4 border-t border-[#DDD4C8] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#EBE5DC] text-[#2E2A25] font-semibold hover:bg-[#DDD4C8] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-6 py-2.5 rounded-xl bg-[#8C2E2E] hover:bg-[#722525] text-white font-semibold shadow-sm transition-colors disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </GovernmentLayout>
  );
}
