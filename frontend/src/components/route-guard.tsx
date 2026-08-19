'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useRole } from '@/components/role-context';

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, user } = useRole();

  useEffect(() => {
    if (!user) {
      // Unauthenticated users trying to access host/government protected routes
      if (pathname.startsWith('/host') || pathname.startsWith('/government') || pathname.startsWith('/admin')) {
        router.replace('/login');
      }
      return;
    }

    // STRICT ROLE & APPROVAL STATUS ROUTE PROTECTION
    if (role === 'host' || user.role === 'host') {
      const isApproved = user.approval_status === 'approved' || user.is_verified;
      if (!isApproved) {
        // Pending or rejected host trying to access /host routes
        router.replace('/login');
        return;
      }

      if (!pathname.startsWith('/host')) {
        router.replace('/host');
      }
    } else if (role === 'government' || role === 'admin') {
      if (!pathname.startsWith('/government') && !pathname.startsWith('/admin')) {
        router.replace('/government');
      }
    } else if (role === 'tourist') {
      if (pathname.startsWith('/host') || pathname.startsWith('/government') || pathname.startsWith('/admin')) {
        router.replace('/');
      }
    }
  }, [role, user, pathname, router]);

  return <>{children}</>;
}
