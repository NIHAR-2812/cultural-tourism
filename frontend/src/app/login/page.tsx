'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRole, UserRole } from '@/components/role-context';
import { Feather, Lock, Clock, XCircle, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useRole();
  const [selectedRole, setSelectedRole] = useState<UserRole>('tourist');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState<{ type: 'none' | 'pending' | 'rejected' | 'invalid'; message?: string; reason?: string }>({
    type: 'none',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorState({ type: 'none' });

    try {
      const loggedUser = await login(selectedRole, email || undefined);
      
      // LOGIC REDIRECT BASED ON AUTH ROLE
      if (loggedUser.role === 'tourist') {
        router.push('/');
      } else if (loggedUser.role === 'host') {
        router.push('/host');
      } else if (loggedUser.role === 'government' || loggedUser.role === 'admin') {
        router.push('/government');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      if (err?.code === 'HOST_PENDING_APPROVAL') {
        setErrorState({
          type: 'pending',
          message: 'Your Host account is still awaiting Government approval. Please try again after your application has been reviewed.',
        });
      } else if (err?.code === 'HOST_REJECTED') {
        setErrorState({
          type: 'rejected',
          message: 'Your Host application was not approved.',
          reason: err.reason || 'Does not meet environmental carrying capacity guidelines.',
        });
      } else {
        setErrorState({
          type: 'invalid',
          message: 'Email or password is incorrect.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // PENDING HOST SCREEN
  if (errorState.type === 'pending') {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-6 py-16 bg-[#F5F1EB] text-[#2E2A25]">
        <div className="w-full max-w-md bg-[#FAF6EE] border-2 border-[#DDD4C8] border-t-4 border-t-[#A65A3A] p-8 sm:p-10 space-y-6 rounded-2xl shadow-xl text-center">
          
          <div className="w-16 h-16 rounded-full bg-[#F2E5D8] border border-[#A65A3A]/30 flex items-center justify-center mx-auto text-[#A65A3A]">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#A65A3A] text-white">
              ● Application Under Review
            </span>
            <h1 className="text-3xl font-bold font-serif-heading text-[#2E2A25]">
              Application Under Review
            </h1>
            <p className="text-xs text-[#6B635B] font-light leading-relaxed">
              Your Host account is still awaiting Government approval. Please try again after your application has been reviewed.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F5F1EB] border border-[#DDD4C8] text-xs text-left space-y-1">
            <p className="text-[10px] font-mono uppercase font-bold text-[#A65A3A]">Account Status</p>
            <p className="font-semibold text-[#2E2A25]">{email || 'Host Account'}</p>
            <p className="text-[11px] text-[#A65A3A] font-medium">Pending Council Verification</p>
          </div>

          <button
            onClick={() => setErrorState({ type: 'none' })}
            className="w-full py-3 bg-[#5F6B4F] hover:bg-[#4E5B3F] text-white font-semibold text-xs rounded-xl transition-colors shadow-sm inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </button>

        </div>
      </div>
    );
  }

  // REJECTED HOST SCREEN
  if (errorState.type === 'rejected') {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-6 py-16 bg-[#F5F1EB] text-[#2E2A25]">
        <div className="w-full max-w-md bg-[#FAF6EE] border-2 border-[#DDD4C8] border-t-4 border-t-[#8C2E2E] p-8 sm:p-10 space-y-6 rounded-2xl shadow-xl text-center">
          
          <div className="w-16 h-16 rounded-full bg-[#FFF0F0] border border-[#8C2E2E]/30 flex items-center justify-center mx-auto text-[#8C2E2E]">
            <XCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#8C2E2E] text-white">
              ● Application Not Approved
            </span>
            <h1 className="text-3xl font-bold font-serif-heading text-[#2E2A25]">
              Host Application Not Approved
            </h1>
            <p className="text-xs text-[#6B635B] font-light leading-relaxed">
              Your Host application was not approved by the Government Conservation Council.
            </p>
          </div>

          {errorState.reason && (
            <div className="p-4 rounded-xl bg-[#FFF0F0] border border-[#8C2E2E]/30 text-xs text-left space-y-1">
              <p className="text-[10px] font-mono uppercase font-bold text-[#8C2E2E]">Council Review Note</p>
              <p className="text-[#8C2E2E] font-medium leading-relaxed">{errorState.reason}</p>
            </div>
          )}

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => setErrorState({ type: 'none' })}
              className="w-full py-3 bg-[#2E2A25] hover:bg-[#1C242B] text-white font-semibold text-xs rounded-xl transition-colors shadow-sm inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </button>
            <a
              href="mailto:support@vanantara.org"
              className="w-full py-2.5 bg-[#EBE5DC] hover:bg-[#DDD4C8] text-[#2E2A25] font-semibold text-xs rounded-xl transition-colors text-center"
            >
              Contact Support
            </a>
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
            <Feather className="w-3.5 h-3.5 text-[#A65A3A]" /> Mindful Yatra Portal
          </span>
          <h1 className="text-3xl font-bold font-serif-heading text-[#2E2A25]">
            Account Sign In
          </h1>
          <p className="text-xs text-[#6B635B] font-light">
            Authenticate to access your role-specific dashboard experience.
          </p>
        </div>

        {/* Role Persona Selector for Demo Authentication */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase text-[#6B635B] font-bold">Select Role</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { role: 'tourist', label: 'Tourist' },
              { role: 'host', label: 'Host' },
              { role: 'government', label: 'Government' },
            ].map((item) => (
              <button
                key={item.role}
                type="button"
                onClick={() => {
                  setSelectedRole(item.role as UserRole);
                  setErrorState({ type: 'none' });
                }}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  selectedRole === item.role
                    ? 'bg-[#A65A3A] text-white border-[#A65A3A] shadow-sm'
                    : 'bg-[#EBE5DC] text-[#6B635B] border-[#DDD4C8] hover:text-[#2E2A25]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {errorState.type === 'invalid' && (
          <div className="p-3.5 rounded-xl bg-[#FFF0F0] border border-[#8C2E2E]/30 text-xs text-[#8C2E2E] flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorState.message}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-mono uppercase text-[#6B635B] font-bold">Email Address</label>
            <input
              type="email"
              placeholder={`e.g. ${selectedRole}@vanantara.org`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#FAF6EE] p-3 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#A65A3A]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono uppercase text-[#6B635B] font-bold">Password</label>
            <input
              type="password"
              placeholder="••••••••••••"
              defaultValue="password123"
              className="w-full bg-[#FAF6EE] p-3 border border-[#DDD4C8] text-xs text-[#2E2A25] rounded-xl focus:outline-none focus:border-[#A65A3A]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#A65A3A] hover:bg-[#8C482B] text-white font-semibold text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : `Sign in as ${selectedRole.toUpperCase()} →`}
          </button>
        </form>

        <div className="pt-4 border-t border-[#DDD4C8] text-center text-xs text-[#6B635B]">
          Need an account?{' '}
          <Link href="/register" className="font-bold text-[#A65A3A] underline hover:text-[#8C482B]">
            Register as Host or Tourist
          </Link>
        </div>

      </div>
    </div>
  );
}
