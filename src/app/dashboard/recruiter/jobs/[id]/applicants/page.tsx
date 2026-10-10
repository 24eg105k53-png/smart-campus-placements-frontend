'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import { ArrowLeft, Users, CheckCircle, XCircle, Clock, FileText, Sparkles } from 'lucide-react';

export default function CandidateReviewPage() {
  const params = useParams();
  const jobId = params.id as string;

  const [applicants, setApplicants] = useState<any[]>([]);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, [jobId]);

  const loadData = async () => {
    try {
      const [appData, jobData] = await Promise.allSettled([
        apiRequest(`/applications/job/${jobId}`),
        apiRequest(`/jobs/${jobId}`),
      ]);

      if (appData.status === 'fulfilled') setApplicants(appData.value || []);
      if (jobData.status === 'fulfilled') setJob(jobData.value);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId: number, newStatus: string) => {
    setUpdatingId(appId);
    try {
      const updated = await apiRequest(`/applications/${appId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: newStatus,
          recruiterNotes: `Status updated to ${newStatus} by recruiter on ${new Date().toLocaleDateString()}`,
        }),
      });

      setApplicants(applicants.map((a) => (a.id === appId ? { ...a, status: updated.status } : a)));
    } catch (e) {
      alert('Failed to update applicant status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/recruiter"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Drives
      </Link>

      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
            Candidate Evaluation
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Applicants for {job?.title || 'Job Drive'}
          </h1>
          <p className="text-sm text-slate-500">
            Total pre-screened eligible applicants: <span className="font-bold text-slate-800">{applicants.length}</span>
          </p>
        </div>
      </div>

      {applicants.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No Applicants Yet</h3>
          <p className="text-xs text-slate-500 mt-1">Eligible students have not submitted applications yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applicants.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-slate-900">{app.studentName}</h3>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-semibold text-slate-600">{app.studentRegistrationNumber}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    app.status === 'SHORTLISTED' ? 'bg-emerald-100 text-emerald-800' :
                    app.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                    app.status === 'PLACED' ? 'bg-purple-100 text-purple-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {app.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <span>Branch: <b>{app.studentDepartment}</b></span>
                  <span>CGPA: <b className="text-blue-600">{app.studentCgpa}</b></span>
                  <span>Backlogs: <b>{app.studentBacklogs}</b></span>
                  <span className="flex items-center gap-1 font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    <Sparkles className="w-3.5 h-3.5" />
                    Skill Match: {app.matchScore}%
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {app.studentSkills?.map((s: string, idx: number) => (
                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status Action Workflow */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  disabled={updatingId === app.id}
                  onClick={() => handleStatusChange(app.id, 'SHORTLISTED')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                >
                  Shortlist
                </button>
                <button
                  disabled={updatingId === app.id}
                  onClick={() => handleStatusChange(app.id, 'PLACED')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors"
                >
                  Mark Placed
                </button>
                <button
                  disabled={updatingId === app.id}
                  onClick={() => handleStatusChange(app.id, 'REJECTED')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
