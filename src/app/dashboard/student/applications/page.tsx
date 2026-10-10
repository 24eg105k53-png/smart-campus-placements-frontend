'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import { Send, Clock, Building2, Briefcase, CheckCircle2, XCircle } from 'lucide-react';

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await apiRequest('/applications/my');
      setApplications(data || []);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SHORTLISTED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Shortlisted for Rounds</span>;
      case 'PLACED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">Offer Extended / Placed</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">Application Closed</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">Under Review</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Application Tracker</h1>
        <p className="text-sm text-slate-500">Track interview progress, review status, and feedback from recruiters</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Send className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No Applications Yet</h3>
          <p className="text-xs text-slate-500 mt-1">Start applying to active campus placement drives.</p>
          <Link
            href="/dashboard/student/jobs"
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700"
          >
            Explore Drives
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-lg">{app.jobTitle}</span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {app.companyName}
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  💰 Offered CTC: <span className="font-semibold text-slate-700">{app.ctcRange || 'N/A'}</span> •
                  Applied on {new Date(app.appliedAt).toLocaleDateString()}
                </p>

                {app.recruiterNotes && (
                  <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-700">Recruiter Notes: </span>
                    {app.recruiterNotes}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(app.status)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
