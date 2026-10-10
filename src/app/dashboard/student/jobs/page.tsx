'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import { Briefcase, Search, Building2, MapPin, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

export default function StudentJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, [search]);

  const loadJobs = async () => {
    try {
      const q = search ? `?search=${encodeURIComponent(search)}` : '';
      const data = await apiRequest(`/jobs${q}`);
      setJobs(data.content || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campus Placement Drives</h1>
          <p className="text-sm text-slate-500">Explore active recruitment drives evaluated against your academic criteria</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or company..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No Placement Drives Found</h3>
          <p className="text-xs text-slate-500 mt-1">Check back later or adjust your search filter.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                    {job.companyName}
                  </span>
                  {job.hasApplied ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                      Applied
                    </span>
                  ) : job.isEligibleForCurrentUser !== undefined ? (
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        job.isEligibleForCurrentUser
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {job.isEligibleForCurrentUser ? (
                        <>
                          <CheckCircle className="w-3 h-3" /> Eligible
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> Ineligible
                        </>
                      )}
                    </span>
                  ) : null}
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug">{job.title}</h3>

                <div className="space-y-1 text-xs text-slate-600">
                  <p className="flex items-center gap-1.5 font-semibold text-slate-800">
                    💰 Package: {job.ctcRange || 'Competitive'}
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-500">
                    <MapPin className="w-3.5 h-3.5" /> {job.jobLocation || 'Campus / Hybrid'}
                  </p>
                  <p className="text-slate-500">
                    Min CGPA: <span className="font-semibold text-slate-700">{job.minimumCgpa}</span> • Max Backlogs:{' '}
                    <span className="font-semibold text-slate-700">{job.maximumBacklogs}</span>
                  </p>
                  <p className="text-slate-500 line-clamp-1">
                    Branches: <span className="font-medium text-slate-600">{job.eligibleDepartments}</span>
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap gap-1">
                  {job.requiredSkills?.slice(0, 4).map((s: string, idx: number) => (
                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {s}
                    </span>
                  ))}
                  {job.requiredSkills?.length > 4 && (
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-400">
                      +{job.requiredSkills.length - 4}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href={`/dashboard/student/jobs/${job.id}`}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 transition-all"
                >
                  View Details & Skill Gap
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
