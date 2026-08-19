'use client';

import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'dark' | 'emerald' | 'amber';
}

export function GlassCard({
  children,
  className = '',
  variant = 'dark',
}: GlassCardProps) {
  const variantStyles = {
    dark: 'bg-stone-900/60 border-stone-800/80',
    emerald: 'bg-emerald-950/40 border-emerald-500/20 shadow-[0_10px_30px_rgba(6,95,70,0.15)]',
    amber: 'bg-amber-950/30 border-amber-500/20',
  };

  return (
    <div
      className={`rounded-3xl border backdrop-blur-xl p-6 shadow-xl ${variantStyles[variant]} ${className}`}
    >
      {children}
    </div>
  );
}
