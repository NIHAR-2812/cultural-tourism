'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useRole } from '@/components/role-context';
import { ApiClient, HostNotification } from '@/services/api';
import { VanantaraLogo } from '@/components/ui/vanantara-logo';
import {
  LayoutDashboard,
  Home,
  CalendarCheck,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

interface HostLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

export function HostLayout({ children, pageTitle }: HostLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, user, logout } = useRole();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState<HostNotification[]>([]);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // ROUTE GUARD: Ensure only Host accesses /host/*
  useEffect(() => {
    if (role === 'tourist') {
      router.push('/');
    } else if (role === 'government' || role === 'admin') {
      router.push('/government');
    }
  }, [role, router]);

  useEffect(() => {
    async function loadNotifs() {
      const list = await ApiClient.getHostNotifications();
      setNotifications(list);
    }
    loadNotifs();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const navItems = [
    { label: 'Dashboard', href: '/host', icon: LayoutDashboard },
    { label: 'My Properties', href: '/host/properties', icon: Home },
    { label: 'Bookings', href: '/host/bookings', icon: CalendarCheck },
    { label: 'Profile', href: '/host/profile', icon: User },
  ];

  if (role !== 'host') {
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
          <span className="font-serif-heading font-bold text-sm text-[#2E2A25]">Host Studio</span>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/host/notifications" className="relative p-2 text-[#2E2A25]">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#A65A3A] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
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
            <Link href="/host" className="inline-block">
              <VanantaraLogo className="w-8 h-8" showText={true} />
            </Link>
            <div className="pt-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A65A3A] bg-[#FAF6EE] px-2.5 py-0.5 rounded-full border border-[#DDD4C8] font-bold inline-flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#A65A3A]" /> Property Steward Portal
              </span>
            </div>
          </div>

          {/* Nav Items List (NO NOTIFICATIONS) */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/host'
                  ? pathname === '/host'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#A65A3A] text-white font-semibold shadow-sm'
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
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
              alt={user?.name || 'Host'}
              className="w-9 h-9 rounded-full object-cover border border-[#A65A3A]"
            />
            <div className="space-y-0.5 overflow-hidden">
              <h4 className="text-xs font-bold text-[#2E2A25] truncate">{user?.name || 'Devendra Kulkarni'}</h4>
              <p className="text-[10px] text-[#6B635B] truncate font-mono">Verified Steward</p>
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
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#A65A3A] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-[#FAF6EE] border border-[#DDD4C8] rounded-2xl p-4 shadow-xl z-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#DDD4C8] pb-2">
                    <span className="text-xs font-bold text-[#2E2A25] font-serif-heading">Recent Notifications</span>
                    <Link href="/host/notifications" onClick={() => setNotifDropdownOpen(false)} className="text-[10px] text-[#A65A3A] font-semibold hover:underline">
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

            {/* Host Avatar & Name */}
            <div className="flex items-center gap-3 pl-4 border-l border-[#DDD4C8]">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                alt={user?.name || 'Host'}
                className="w-8 h-8 rounded-full object-cover border border-[#A65A3A]"
              />
              <div className="text-left">
                <p className="text-xs font-bold text-[#2E2A25] leading-tight">{user?.name || 'Devendra Kulkarni'}</p>
                <p className="text-[10px] text-[#5F6B4F] font-mono font-semibold">Native Steward</p>
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
