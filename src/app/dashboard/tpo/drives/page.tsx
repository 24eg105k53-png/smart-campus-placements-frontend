'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import { Briefcase, Plus, Users, MapPin, Calendar, CheckCircle2 } from 'lucide-react';

export default function TpoDrivesPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDrives();
  }, []);

  const loadDrives = async () => {
    try {
      const data = await apiRequest('/jobs');
      setJobs(data.content || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Active Placement Drives Directory</h1>
          <p className="text-sm text-slate-500">Supervise institutional recruitment schedules and corporate participation</p>
        </div>

        <Link
          href="/dashboard/recruiter/jobs/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" /> Create Placement Drive
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
              <tr>
                <th className="p-4">Drive Title</th>
                <th className="p-4">Recruiting Company</th>
                <th className="p-4">CTC Package</th>
                <th className="p-4">Min CGPA</th>
                <th className="p-4">Max Backlogs</th>
                <th className="p-4">Applicants</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-900">{job.title}</td>
                  <td className="p-4 text-slate-700">{job.companyName}</td>
                  <td className="p-4 font-semibold text-slate-800">{job.ctcRange}</td>
                  <td className="p-4 text-blue-600 font-semibold">{job.minimumCgpa}</td>
                  <td className="p-4 text-slate-600">{job.maximumBacklogs}</td>
                  <td className="p-4 font-semibold text-slate-800">{job.applicantsCount || 0}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
