'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useRole } from '@/components/role-context';
import { VanantaraLogo } from '@/components/ui/vanantara-logo';
import { LogOut, Menu, X } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, user, logout } = useRole();
  const [mobileOpen, setMobileOpen] = useState(false);

  // HIDE GLOBAL NAVBAR ON DASHBOARDS (/host, /government)
  if (pathname.startsWith('/host') || pathname.startsWith('/government')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F5F1EB] border-b border-[#DDD4C8] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between gap-4">
        
        {/* Handcrafted Logo & Brand Typography */}
        <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
          <VanantaraLogo className="w-9 h-9" showText={true} />
        </Link>

        {/* Minimal Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#6B635B]">
          <Link
            href="/destinations"
            className={`hover:text-[#2E2A25] transition-colors ${
              pathname === '/destinations' ? 'text-[#2E2A25] font-bold border-b border-[#A65A3A] pb-1' : ''
            }`}
          >
            Sanctuary Journal
          </Link>

          {role === 'host' && (
            <Link
              href="/host"
              className={`hover:text-[#2E2A25] transition-colors ${
                pathname === '/host' ? 'text-[#2E2A25] font-bold border-b border-[#A65A3A] pb-1' : ''
              }`}
            >
              Host Dashboard
            </Link>
          )}

          {(role === 'admin' || role === 'government') && (
            <Link
              href="/government"
              className={`hover:text-[#2E2A25] transition-colors ${
                pathname === '/government' ? 'text-[#2E2A25] font-bold border-b border-[#A65A3A] pb-1' : ''
              }`}
            >
              Government Dashboard
            </Link>
          )}
        </nav>

        {/* Right Auth Controls (Desktop) */}
        <div className="hidden md:flex items-center gap-4 text-xs">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#6B635B] font-mono">
                {user.name} ({user.role.toUpperCase()})
              </span>
              <button
                onClick={() => { logout(); router.push('/'); }}
                className="p-1.5 rounded-full bg-[#EBE5DC] text-[#A65A3A] hover:bg-[#DDD4C8] transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-semibold text-[#2E2A25] hover:text-[#A65A3A] transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-1.5 rounded-full bg-[#A65A3A] hover:bg-[#8C482B] text-white text-xs font-semibold transition-colors shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-[#2E2A25] hover:bg-[#EBE5DC] rounded-xl transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Navigation Drawer Overlay */}
      {mobileOpen && (
        <div className="md:hidden bg-[#FAF6EE] border-b border-[#DDD4C8] px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-3 text-sm font-semibold text-[#2E2A25]">
            <Link
              href="/destinations"
              onClick={() => setMobileOpen(false)}
              className="py-2 border-b border-[#DDD4C8]/50 hover:text-[#A65A3A]"
            >
              Sanctuary Journal
            </Link>

            {role === 'host' && (
              <Link
                href="/host"
                onClick={() => setMobileOpen(false)}
                className="py-2 border-b border-[#DDD4C8]/50 text-[#A65A3A] font-bold"
              >
                Host Dashboard →
              </Link>
            )}

            {(role === 'admin' || role === 'government') && (
              <Link
                href="/government"
                onClick={() => setMobileOpen(false)}
                className="py-2 border-b border-[#DDD4C8]/50 text-[#5F6B4F] font-bold"
              >
                Government Dashboard →
              </Link>
            )}
          </nav>

          <div className="pt-2 border-t border-[#DDD4C8]">
            {user ? (
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6B635B] font-mono">
                  {user.name} ({user.role.toUpperCase()})
                </span>
                <button
                  onClick={() => { setMobileOpen(false); logout(); router.push('/'); }}
                  className="px-3.5 py-2 rounded-xl bg-[#EBE5DC] text-[#A65A3A] text-xs font-semibold flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-center rounded-xl bg-[#EBE5DC] text-[#2E2A25] font-semibold text-xs"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-center rounded-xl bg-[#A65A3A] text-white font-semibold text-xs shadow-xs"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

    </header>
  );
}
