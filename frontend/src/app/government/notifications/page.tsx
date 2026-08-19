'use client';

import React, { useState, useEffect } from 'react';
import { GovernmentLayout } from '@/components/government/government-layout';
import { ApiClient, GovernmentNotification } from '@/services/api';
import { Bell, CheckCircle2, FileCheck, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function GovernmentNotificationsPage() {
  const [notifications, setNotifications] = useState<GovernmentNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifs();
  }, []);

  const loadNotifs = async () => {
    const data = await ApiClient.getGovernmentNotifications();
    setNotifications(data);
    setLoading(false);
  };

  const handleMarkRead = async (id: string) => {
    await ApiClient.markGovNotificationRead(id);
    loadNotifs();
  };

  return (
    <GovernmentLayout pageTitle="Council Alerts & Notifications">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDD4C8] pb-4">
        <div>
          <h2 className="text-2xl font-bold font-serif-heading text-[#2E2A25]">
            Council Alerts & Intake Updates
          </h2>
          <p className="text-xs text-[#6B635B]">
            Automated alerts for new property proposals, carrying limit warnings, and conservation fund audits.
          </p>
        </div>
      </div>

      {/* NOTIFICATIONS LIST */}
      {loading ? (
        <div className="py-12 text-center text-xs font-mono text-[#6B635B]">Loading Council Alerts...</div>
      ) : notifications.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#FAF6EE] border border-[#DDD4C8] text-center text-xs space-y-3">
          <CheckCircle2 className="w-10 h-10 text-[#5F6B4F] mx-auto opacity-70" />
          <p className="font-bold text-[#2E2A25] text-base font-serif-heading">You&apos;re all caught up.</p>
          <p className="text-[#6B635B]">There are no unread governance alerts at this time.</p>
        </div>
      ) : (
        <div className="space-y-3 max-w-3xl">
          {notifications.map((notif) => {
            const iconMap = {
              application: FileCheck,
              alert: AlertTriangle,
              system: ShieldCheck,
            };
            const Icon = iconMap[notif.type] || Bell;

            return (
              <div
                key={notif.id}
                className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 text-xs ${
                  notif.isRead
                    ? 'bg-[#FAF6EE] border-[#DDD4C8] opacity-80'
                    : 'bg-[#FAF6EE] border-l-4 border-l-[#5F6B4F] border-[#DDD4C8] shadow-xs'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                      notif.isRead ? 'bg-[#EBE5DC] text-[#6B635B]' : 'bg-[#5F6B4F] text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-[#2E2A25] text-sm font-serif-heading">{notif.title}</h4>
                      {!notif.isRead && (
                        <span className="px-2 py-0.5 rounded-full bg-[#5F6B4F] text-white font-mono text-[9px] font-bold">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-[#6B635B] font-light leading-relaxed">{notif.message}</p>
                    <span className="text-[10px] text-[#5F6B4F] font-mono font-semibold block pt-1">{notif.timestamp}</span>
                  </div>
                </div>

                {!notif.isRead && (
                  <button
                    onClick={() => handleMarkRead(notif.id)}
                    className="py-1.5 px-3 bg-[#EBE5DC] hover:bg-[#DDD4C8] text-[#2E2A25] font-semibold text-[11px] rounded-lg shrink-0 transition-colors"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

    </GovernmentLayout>
  );
}
