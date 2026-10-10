'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/context/AuthContext';
import { GraduationCap, Building2, ShieldCheck, Lock, Mail, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('student@smartcampus.edu');
  const [password, setPassword] = useState('Password@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setDemoCredentials = (role: UserRole) => {
    setError(null);
    if (role === 'STUDENT') {
      setEmail('student@smartcampus.edu');
      setPassword('Password@123');
    } else if (role === 'RECRUITER') {
      setEmail('recruiter@google.com');
      setPassword('Password@123');
    } else if (role === 'TPO') {
      setEmail('tpo@smartcampus.edu');
      setPassword('Password@123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await login(email, password);
      router.push(`/dashboard/${user.role.toLowerCase()}`);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-xl bg-blue-600 text-white items-center justify-center shadow-md shadow-blue-500/20">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Sign in to Platform</h1>
          <p className="text-sm text-slate-500">Access your role-specific placement portal</p>
        </div>

        {/* Quick Demo Role Selector */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">
            Quick-Fill Demo Credentials
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setDemoCredentials('STUDENT')}
              className="flex flex-col items-center justify-center p-2 rounded-lg text-xs font-semibold bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-700 border border-slate-200 shadow-sm transition-all"
            >
              <GraduationCap className="w-4 h-4 mb-1 text-blue-600" />
              Student
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('RECRUITER')}
              className="flex flex-col items-center justify-center p-2 rounded-lg text-xs font-semibold bg-white hover:bg-emerald-50 hover:text-emerald-600 text-slate-700 border border-slate-200 shadow-sm transition-all"
            >
              <Building2 className="w-4 h-4 mb-1 text-emerald-600" />
              Recruiter
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('TPO')}
              className="flex flex-col items-center justify-center p-2 rounded-lg text-xs font-semibold bg-white hover:bg-purple-50 hover:text-purple-600 text-slate-700 border border-slate-200 shadow-sm transition-all"
            >
              <ShieldCheck className="w-4 h-4 mb-1 text-purple-600" />
              TPO
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                placeholder="name@smartcampus.edu"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 disabled:opacity-60 transition-all"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-sm text-slate-500">
          New Student?{' '}
          <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
