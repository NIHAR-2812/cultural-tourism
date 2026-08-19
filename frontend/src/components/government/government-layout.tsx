'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useRole } from '@/components/role-context';
import { ApiClient, GovernmentNotification } from '@/services/api';
import { VanantaraLogo } from '@/components/ui/vanantara-logo';
import {
  LayoutDashboard,
  FileCheck,
  CheckCircle2,
  Calendar,
  Bell,
  User,
  UserCheck,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

interface GovernmentLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

export function GovernmentLayout({ children, pageTitle }: GovernmentLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, user, logout } = useRole();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState<GovernmentNotification[]>([]);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // ROUTE GUARD: Ensure only Government / Admin accesses /government/*
  useEffect(() => {
    if (role === 'tourist') {
      router.push('/');
    } else if (role === 'host') {
      router.push('/host');
    }
  }, [role, router]);

  useEffect(() => {
    async function loadNotifs() {
      const list = await ApiClient.getGovernmentNotifications();
      setNotifications(list);
    }
    loadNotifs();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const navItems = [
    { label: 'Dashboard', href: '/government', icon: LayoutDashboard },
    { label: 'Host Verification', href: '/government/hosts', icon: UserCheck },
    { label: 'Property Applications', href: '/government/properties', icon: FileCheck },
    { label: 'Approved Properties', href: '/government/approved', icon: CheckCircle2 },
    { label: 'Bookings', href: '/government/bookings', icon: Calendar },
    { label: 'Profile', href: '/government/profile', icon: User },
  ];

  if (role !== 'government' && role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1EB] text-xs font-mono text-[#6B635B]">
        Redirecting to authorized dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C242B] flex flex-col lg:flex-row">
      
      {/* MOBILE HEADER BAR */}
      <div className="lg:hidden h-16 bg-[#F5F1EB] border-b border-[#DDD4C8] px-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-[#2E2A25] rounded-xl hover:bg-[#EBE5DC]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <VanantaraLogo className="w-7 h-7" showText={false} />
          <span className="font-serif-heading font-bold text-sm text-[#2E2A25]">Governance Portal</span>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/government/notifications" className="relative p-2 text-[#2E2A25]">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#5F6B4F] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* BACKDROP FOR MOBILE SIDEBAR */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity"
        />
      )}

      {/* DESKTOP & MOBILE SIDEBAR */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#F5F1EB] border-r border-[#DDD4C8] flex flex-col justify-between p-6 z-50 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-8">
          {/* Logo & Portal Badge */}
          <div className="space-y-1">
            <Link href="/government" className="inline-block">
              <VanantaraLogo className="w-8 h-8" showText={true} />
            </Link>
            <div className="pt-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#5F6B4F] bg-[#FAF6EE] px-2.5 py-0.5 rounded-full border border-[#DDD4C8] font-bold inline-flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#5F6B4F]" /> Ecotourism Council Portal
              </span>
            </div>
          </div>

          {/* Nav Items List (NO NOTIFICATIONS) */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/government'
                  ? pathname === '/government'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#5F6B4F] text-white font-semibold shadow-sm'
                      : 'text-[#6B635B] hover:bg-[#EBE5DC] hover:text-[#2E2A25]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#6B635B]'}`} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer User Info & Logout */}
        <div className="border-t border-[#DDD4C8] pt-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#5F6B4F] text-white font-bold flex items-center justify-center text-xs shadow-xs">
              RN
            </div>
            <div className="space-y-0.5 overflow-hidden">
              <h4 className="text-xs font-bold text-[#2E2A25] truncate">{user?.name || 'Dr. Ramesh Nambiar'}</h4>
              <p className="text-[10px] text-[#5F6B4F] truncate font-mono font-semibold">Council Officer</p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="w-full flex items-center gap-2 p-2.5 rounded-xl text-xs text-[#A65A3A] hover:bg-[#EBE5DC] font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* DESKTOP TOP HEADER */}
        <header className="hidden lg:flex h-20 bg-[#F5F1EB]/80 backdrop-blur border-b border-[#DDD4C8] px-8 items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-bold font-serif-heading text-[#2E2A25]">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            {/* Notification Bell Preview */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 text-[#2E2A25] rounded-xl hover:bg-[#EBE5DC] transition-colors"
              >
                <Bell className="w-5 h-5 text-[#6B635B]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#5F6B4F] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-[#FAF6EE] border border-[#DDD4C8] rounded-2xl p-4 shadow-xl z-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#DDD4C8] pb-2">
                    <span className="text-xs font-bold text-[#2E2A25] font-serif-heading">Council Alerts</span>
                    <Link href="/government/notifications" onClick={() => setNotifDropdownOpen(false)} className="text-[10px] text-[#5F6B4F] font-semibold hover:underline">
                      View All →
                    </Link>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.slice(0, 3).map((n) => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-[#F5F1EB] text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#2E2A25] text-[11px]">{n.title}</span>
                          <span className="text-[9px] text-[#6B635B]">{n.timestamp}</span>
                        </div>
                        <p className="text-[10px] text-[#6B635B] line-clamp-2">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Officer Avatar & Name */}
            <div className="flex items-center gap-3 pl-4 border-l border-[#DDD4C8]">
              <div className="w-8 h-8 rounded-full bg-[#5F6B4F] text-white font-bold flex items-center justify-center text-xs">
                RN
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#2E2A25] leading-tight">{user?.name || 'Dr. Ramesh Nambiar'}</p>
                <p className="text-[10px] text-[#5F6B4F] font-mono font-semibold">Senior Verification Officer</p>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 lg:p-10 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>

      </div>

    </div>
  );
}
