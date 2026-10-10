'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import {
  Briefcase,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Send,
  Building2,
} from 'lucide-react';
import Link from 'next/link';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<any>(null);
  const [eligibility, setEligibility] = useState<any>(null);
  const [skillGap, setSkillGap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    loadJobDetails();
  }, [jobId]);

  const loadJobDetails = async () => {
    try {
      const [jobData, eligData, gapData] = await Promise.allSettled([
        apiRequest(`/jobs/${jobId}`),
        apiRequest(`/jobs/${jobId}/eligibility`),
        apiRequest(`/jobs/${jobId}/skill-gap`),
      ]);

      if (jobData.status === 'fulfilled') setJob(jobData.value);
      if (eligData.status === 'fulfilled') setEligibility(eligData.value);
      if (gapData.status === 'fulfilled') setSkillGap(gapData.value);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    setApplyError(null);
    try {
      await apiRequest(`/applications/apply/${jobId}`, { method: 'POST' });
      setApplySuccess(true);
      setJob({ ...job, hasApplied: true });
    } catch (err: any) {
      setApplyError(err.message || 'Application failed.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-600">Job posting not found.</p>
        <Link href="/dashboard/student/jobs" className="text-blue-600 text-sm font-semibold mt-2 inline-block">
          Return to Drives
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <Link
        href="/dashboard/student/jobs"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Placement Drives
      </Link>

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
              {job.companyName}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">{job.companyIndustry}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{job.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 mt-2">
            <span className="flex items-center gap-1 font-semibold text-slate-700">💰 {job.ctcRange}</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.jobLocation}</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" /> Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div>
          {job.hasApplied ? (
            <span className="px-5 py-2.5 rounded-xl font-bold text-sm bg-indigo-100 text-indigo-800 inline-block">
              Application Submitted
            </span>
          ) : eligibility?.eligible ? (
            <button
              onClick={handleApply}
              disabled={applying}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 disabled:opacity-60 transition-all hover:scale-[1.02]"
            >
              <Send className="w-4 h-4" />
              {applying ? 'Submitting...' : 'One-Click Apply Now'}
            </button>
          ) : (
            <button
              disabled
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
            >
              Ineligible to Apply
            </button>
          )}
        </div>
      </div>

      {applySuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Your application has been successfully submitted and delivered to corporate recruiters!</span>
        </div>
      )}

      {applyError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
          <XCircle className="w-5 h-5 text-rose-600" />
          <span>{applyError}</span>
        </div>
      )}

      {/* Deterministic Eligibility Status Box */}
      {eligibility && (
        <div className={`p-6 rounded-2xl border shadow-sm ${
          eligibility.eligible
            ? 'bg-emerald-50/70 border-emerald-200'
            : 'bg-rose-50/70 border-rose-200'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              {eligibility.eligible ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600" />
              )}
              Deterministic Eligibility Evaluation
            </h3>
            <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${
              eligibility.eligible ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {eligibility.eligible ? 'Criteria Met' : 'Mismatch'}
            </span>
          </div>

          <div className="grid sm:grid-cols-4 gap-3 text-xs mb-3">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">CGPA Cutoff</span>
              <span className="font-semibold text-slate-800">
                Min {eligibility.minimumCgpa} (Yours: {eligibility.studentCgpa})
              </span>
              <span className={`block font-bold mt-0.5 ${eligibility.cgpaEligible ? 'text-emerald-600' : 'text-rose-600'}`}>
                {eligibility.cgpaEligible ? '✓ Pass' : '✗ Below Cutoff'}
              </span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Backlogs Limit</span>
              <span className="font-semibold text-slate-800">
                Max {eligibility.maximumBacklogs} (Yours: {eligibility.studentBacklogs})
              </span>
              <span className={`block font-bold mt-0.5 ${eligibility.backlogsEligible ? 'text-emerald-600' : 'text-rose-600'}`}>
                {eligibility.backlogsEligible ? '✓ Pass' : '✗ Exceeded'}
              </span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Eligible Branch</span>
              <span className="font-semibold text-slate-800 truncate block">
                {eligibility.studentDepartment}
              </span>
              <span className={`block font-bold mt-0.5 ${eligibility.departmentEligible ? 'text-emerald-600' : 'text-rose-600'}`}>
                {eligibility.departmentEligible ? '✓ Eligible' : '✗ Restricted'}
              </span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Graduation Batch</span>
              <span className="font-semibold text-slate-800">
                Target {eligibility.targetGraduationYear}
              </span>
              <span className={`block font-bold mt-0.5 ${eligibility.graduationYearEligible ? 'text-emerald-600' : 'text-rose-600'}`}>
                {eligibility.graduationYearEligible ? '✓ Matched' : '✗ Year Mismatch'}
              </span>
            </div>
          </div>

          {!eligibility.eligible && eligibility.failureReasons && (
            <div className="mt-2 text-xs text-rose-700 bg-white/70 p-3 rounded-xl border border-rose-200">
              <span className="font-semibold block mb-1">Reason for Ineligibility:</span>
              <ul className="list-disc list-inside space-y-0.5">
                {eligibility.failureReasons.map((r: string, idx: number) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* AI Skill-Gap Analysis */}
      {skillGap && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">AI Skill-Gap & Cosine Analysis</h3>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-blue-600">{skillGap.matchPercentage}% Competency Match</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
            {skillGap.explanation}
          </p>

          <div className="grid sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                Matching Skills ({skillGap.matchingSkills?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {skillGap.matchingSkills?.map((skill: string, idx: number) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-800">
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
                Missing Skills to Bridge ({skillGap.missingSkills?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {skillGap.missingSkills?.length > 0 ? (
                  skillGap.missingSkills.map((skill: string, idx: number) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-100 text-amber-800">
                      + {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-700">None! You have all required skills.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Job Description */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Job Description & Responsibilities</h3>
        <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{job.description}</p>
      </div>
    </div>
  );
}
