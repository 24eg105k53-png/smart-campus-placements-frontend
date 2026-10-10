'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import {
  GraduationCap,
  Sparkles,
  Briefcase,
  Send,
  AlertTriangle,
  CheckCircle,
  FileText,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [readiness, setReadiness] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [profData, readData, appData, jobData] = await Promise.allSettled([
          apiRequest('/student/profile'),
          apiRequest('/student/readiness'),
          apiRequest('/applications/my'),
          apiRequest('/jobs?size=3'),
        ]);

        if (profData.status === 'fulfilled') setProfile(profData.value);
        if (readData.status === 'fulfilled') setReadiness(readData.value);
        if (appData.status === 'fulfilled') setApplications(appData.value);
        if (jobData.status === 'fulfilled') setJobs(jobData.value.content || []);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const score = readiness?.readinessScore ?? 75;
  const tier = readiness?.readinessTier ?? 'MODERATE_READINESS';

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-blue-500/10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-blue-100 backdrop-blur-sm">
              Batch of {profile?.graduationYear || 2026}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold mt-2">
              Welcome back, {profile?.fullName || 'Student'}!
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              {profile?.department} • CGPA: {profile?.cgpa || '8.5'} • Active Backlogs: {profile?.activeBacklogs || 0}
            </p>
          </div>

          <Link
            href="/dashboard/student/jobs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-white text-blue-700 hover:bg-blue-50 shadow-sm transition-all"
          >
            <Briefcase className="w-4 h-4" /> Browse Placement Drives
          </Link>
        </div>
      </div>

      {/* Readiness & KPI Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Placement Readiness Meter */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">Explainable Placement Readiness</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Multi-factor heuristic evaluation based on academics & skills</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                score >= 80
                  ? 'bg-emerald-100 text-emerald-800'
                  : score >= 60
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {tier.replace('_', ' ')}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1 font-semibold">
                <span className="text-slate-700">Overall Readiness Index</span>
                <span className="text-blue-600 font-bold">{score} / 100</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>

            {readiness?.breakdown && (
              <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="block text-slate-500">Academic Score</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {readiness.breakdown.academicScore} / {readiness.breakdown.maxAcademic || 30}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="block text-slate-500">Skills Score</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {readiness.breakdown.skillsScore} / {readiness.breakdown.maxSkills || 40}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="block text-slate-500">Profile Depth</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {readiness.breakdown.profileCompletenessScore} / {readiness.breakdown.maxCompleteness || 30}
                  </span>
                </div>
              </div>
            )}

            {readiness?.recommendations && readiness.recommendations.length > 0 && (
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">AI Recommendations</span>
                {readiness.recommendations.map((rec: string, i: number) => (
                  <p key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    {rec}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Profile Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Skill Profile</h3>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {profile?.skills && profile.skills.length > 0 ? (
                profile.skills.slice(0, 8).map((s: any) => (
                  <span
                    key={s.id}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {s.name}
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-500">No skills added yet. Upload resume or add manually.</p>
              )}
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100">
            <Link
              href="/dashboard/student/resume"
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                {profile?.resumeFilePath ? 'Update Resume' : 'Upload Resume'}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <Link
              href="/dashboard/student/profile"
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors"
            >
              <span className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                Edit Profile & Skills
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Active Drives & Applications */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active Drives */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-900">Featured Placement Drives</h3>
            <Link href="/dashboard/student/jobs" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job.id} className="p-4 rounded-xl border border-slate-100 hover:border-blue-200 bg-slate-50/50 transition-colors flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{job.title}</h4>
                  <p className="text-xs text-slate-500">{job.companyName} • {job.ctcRange}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {job.isEligibleForCurrentUser !== undefined && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        job.isEligibleForCurrentUser ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {job.isEligibleForCurrentUser ? 'Eligible' : 'Criteria Mismatch'}
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  href={`/dashboard/student/jobs/${job.id}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-blue-600 hover:text-white border border-slate-200 shadow-sm transition-all"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-900">My Application Tracker</h3>
            <Link href="/dashboard/student/applications" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
              View All
            </Link>
          </div>

          {applications.length > 0 ? (
            <div className="space-y-3">
              {applications.slice(0, 3).map((app) => (
                <div key={app.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{app.jobTitle}</h4>
                    <p className="text-xs text-slate-500">{app.companyName} • Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    app.status === 'SHORTLISTED' ? 'bg-emerald-100 text-emerald-800' :
                    app.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Send className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-sm">You haven't submitted any drive applications yet.</p>
              <Link href="/dashboard/student/jobs" className="text-xs font-semibold text-blue-600 hover:underline mt-1 inline-block">
                Explore eligible openings
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
