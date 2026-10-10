'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Briefcase, Plus, Users, MapPin, Calendar, ArrowRight } from 'lucide-react';

export default function RecruiterDashboardPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, [user]);

  const loadJobs = async () => {
    try {
      const data = await apiRequest('/jobs');
      setJobs(data.content || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Corporate Recruiter Portal</h1>
          <p className="text-sm text-slate-500">Manage company placement drives, set eligibility filters, and review candidates</p>
        </div>

        <Link
          href="/dashboard/recruiter/jobs/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" /> Publish New Drive
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No Job Drives Created</h3>
          <p className="text-xs text-slate-500 mt-1">Publish your first opening to receive qualified student applicants.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {job.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">💰 {job.ctcRange}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.jobLocation}</span>
                  <span>Min CGPA: <b>{job.minimumCgpa}</b></span>
                  <span>Max Backlogs: <b>{job.maximumBacklogs}</b></span>
                  <span>Target: <b>{job.targetGraduationYear}</b></span>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {job.requiredSkills?.map((s: string, idx: number) => (
                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/dashboard/recruiter/jobs/${job.id}/applicants`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  Review Candidates ({job.applicantsCount || 0})
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
