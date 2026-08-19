'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRole, UserRole } from '@/components/role-context';
import { ShieldCheck, Feather, Award, CheckCircle2, Clock, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useRole();
  const [role, setRoleSelection] = useState<UserRole>('host');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingState, setPendingState] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setLoading(true);
    try {
      const res = await register(role, email, name);
      if (role === 'host' || res.status === 'pending') {
        setPendingState(true);
      } else {
        router.push('/destinations');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (pendingState) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-6 py-16 bg-[#F5F1EB] text-[#2E2A25]">
        <div className="w-full max-w-md bg-[#FAF6EE] border-2 border-[#DDD4C8] border-t-4 border-t-[#A65A3A] p-8 sm:p-10 space-y-6 rounded-2xl shadow-xl text-center">
          
          <div className="w-16 h-16 rounded-full bg-[#F2E5D8] border border-[#A65A3A]/30 flex items-center justify-center mx-auto text-[#A65A3A]">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#A65A3A] text-white">
              ● Pending Government Approval
            </span>
            <h1 className="text-3xl font-bold font-serif-heading text-[#2E2A25]">
              Registration Submitted
            </h1>
            <p className="text-xs text-[#6B635B] font-light leading-relaxed">
              Your Host application has been received. Our Government team will review your registration before you can access the Host portal.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F5F1EB] border border-[#DDD4C8] text-xs text-left space-y-1">
            <p className="text-[10px] font-mono uppercase font-bold text-[#A65A3A]">Application Reference</p>
            <p className="font-semibold text-[#2E2A25]">{name}</p>
            <p className="text-[#6B635B] font-mono text-[11px]">{email}</p>
          </div>

          <div className="pt-2">
            <Link
              href="/login"
              className="w-full py-3 bg-[#5F6B4F] hover:bg-[#4E5B3F] text-white font-semibold text-xs rounded-xl transition-colors shadow-sm inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-16 bg-[#F5F1EB] text-[#2E2A25]">
      <div className="w-full max-w-md bg-[#FAF6EE] border-2 border-[#DDD4C8] border-t-4 border-t-[#A65A3A] p-8 sm:p-10 space-y-6 rounded-2xl shadow-xl">
        
        <div className="space-y-2 border-b border-[#DDD4C8] pb-4">
          <span className="text-[11px] font-mono uppercase text-[#A65A3A] font-bold flex items-center gap-1">
            <Feather className="w-3.5 h-3.5 text-[#A65A3A]" /> Community Registration
          </span>
          <h1 className="text-3xl font-bold font-serif-heading text-[#2E2A25]">
            Create Account
          </h1>
          <p className="text-xs text-[#6B635B] font-light">
            Register as a Native Community Host or Mindful Tourist.
          </p>
        </div>

        {/* Account Type Toggle */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase text-[#6B635B] font-bold">Account Type</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRoleSelection('host')}
              className={`p-3 text-left border rounded-xl space-y-1 transition-all ${
                role === 'host'
                  ? 'bg-[#FAF6EE] border-[#A65A3A] border-2 shadow-sm'
                  : 'bg-[#EBE5DC] border-[#DDD4C8] opacity-75'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#2E2A25]">
                <Award className="w-4 h-4 text-[#A65A3A]" /> Community Host
              </div>
              <p className="text-[10px] text-[#6B635B]">Pending Government verification before login access</p>
            </button>

            <button
              type="button"
              onClick={() => setRoleSelection('tourist')}
              className={`p-3 text-left border rounded-xl space-y-1 transition-all ${
                role === 'tourist'
                  ? 'bg-[#FAF6EE] border-[#A65A3A] border-2 shadow-sm'
                  : 'bg-[#EBE5DC] border-[#DDD4C8] opacity-75'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#2E2A25]">
                <ShieldCheck className="w-4 h-4 text-[#5F6B4F]" /> Tourist
              </div>
              <p className="text-[10px] text-[#6B635B]">Browse &amp; book ecological carrying limit sanctuaries</p>
            </button>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-mono uppercase text-[#6B635B] font-bold">Full Name / Native Steward Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Ganesh Sawant"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#FAF6EE] p-3 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#A65A3A]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono uppercase text-[#6B635B] font-bold">Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. ganesh@vanantara.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#FAF6EE] p-3 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#A65A3A]"
            />
          </div>

          {role === 'host' && (
            <div className="p-3 bg-[#F2E5D8] border border-[#DDD4C8] rounded-xl text-[11px] text-[#A65A3A] font-mono">
              Note: Community Host accounts require Government Approval before login is granted.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#A65A3A] hover:bg-[#8C482B] text-white font-semibold text-xs rounded-xl transition-colors shadow-sm"
          >
            {loading ? 'Submitting Application...' : `Submit ${role.toUpperCase()} Application →`}
          </button>
        </form>

        <div className="pt-4 border-t border-[#DDD4C8] text-center text-xs text-[#6B635B]">
          Already registered?{' '}
          <Link href="/login" className="font-bold text-[#A65A3A] underline hover:text-[#8C482B]">
            Sign in here
          </Link>
        </div>

      </div>
    </div>
  );
}
