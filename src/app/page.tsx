'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  GraduationCap,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Cpu,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { loginAsDemo } = useAuth();

  const handleDemoLogin = async (role: 'STUDENT' | 'RECRUITER' | 'TPO') => {
    try {
      const user = await loginAsDemo(role);
      router.push(`/dashboard/${user.role.toLowerCase()}`);
    } catch (e) {
      router.push('/login');
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-blue-50/70 via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            AI-Powered Career Intelligence & Deterministic Eligibility Verification
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Smart Campus Placement &{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Skill Recommendation
            </span>{' '}
            System
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            An enterprise university placement platform connecting graduating students, corporate recruiters, and placement officers with automated eligibility screening and explainable skill gap intelligence.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => handleDemoLogin('STUDENT')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
            >
              <GraduationCap className="w-5 h-5" />
              Demo as Student
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDemoLogin('RECRUITER')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm transition-all hover:scale-[1.02]"
            >
              <Building2 className="w-5 h-5 text-emerald-600" />
              Demo as Recruiter
            </button>
            <button
              onClick={() => handleDemoLogin('TPO')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm transition-all hover:scale-[1.02]"
            >
              <ShieldCheck className="w-5 h-5 text-purple-600" />
              Demo as TPO Officer
            </button>
          </div>
        </div>
      </section>

      {/* KPI Stats Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-extrabold text-blue-600">92.4%</p>
            <p className="text-sm font-medium text-slate-500 mt-1">Placement Rate (2025-26)</p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600">24.0 LPA</p>
            <p className="text-sm font-medium text-slate-500 mt-1">Highest CTC Offered</p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600">12.5 LPA</p>
            <p className="text-sm font-medium text-slate-500 mt-1">Average CTC Package</p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-extrabold text-purple-600">45+</p>
            <p className="text-sm font-medium text-slate-500 mt-1">Active Corporate Partners</p>
          </div>
        </div>
      </section>

      {/* Key Architectural Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Enterprise Architectural Pillars</h2>
          <p className="text-slate-600 mt-2">Built with Java Spring Boot 3, Python FastAPI, and Next.js 14</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Deterministic Eligibility Engine</h3>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Automated server-side verification of CGPA cutoffs, active backlog limits, graduation year, and authorized engineering branches before application submission.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-500">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Zero manual recruiter filtering overhead</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Transparent rejection explanations</li>
            </ul>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">AI Skill-Gap & Resume NLP</h3>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              FastAPI microservice extracts technical competencies from PDF/DOCX resumes, matches canonical aliases, and computes TF-IDF cosine similarity scores.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-500">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Explainable missing vs matching skills</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Multi-factor readiness index (0-100)</li>
            </ul>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Institutional TPO Governance</h3>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Centralized administrative portal empowering Training & Placement Officers with branch-wise analytics, drive management, and tamper-resistant offer verification.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-500">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Live Recharts interactive visualizations</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Audited compensation & offer ledger</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
