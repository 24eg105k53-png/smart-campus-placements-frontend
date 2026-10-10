'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { Briefcase, ArrowLeft, Plus, X, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function CreateJobDrivePage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [jobLocation, setJobLocation] = useState('Bangalore / Hybrid');
  const [ctcRange, setCtcRange] = useState('16 LPA - 20 LPA');
  const [minimumCgpa, setMinimumCgpa] = useState('7.00');
  const [maximumBacklogs, setMaximumBacklogs] = useState('0');
  const [targetGraduationYear, setTargetGraduationYear] = useState('2026');
  const [applicationDeadline, setApplicationDeadline] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [selectedDepts, setSelectedDepts] = useState<string[]>([
    'Computer Science and Engineering',
    'Information Technology',
  ]);
  const [skills, setSkills] = useState<string[]>(['Java', 'Spring Boot', 'PostgreSQL']);
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const departmentsList = [
    'Computer Science and Engineering',
    'Information Technology',
    'Electronics and Communication Engineering',
    'Electrical and Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
  ];

  const handleToggleDept = (dept: string) => {
    if (selectedDepts.includes(dept)) {
      setSelectedDepts(selectedDepts.filter((d) => d !== dept));
    } else {
      setSelectedDepts([...selectedDepts, dept]);
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDepts.length === 0) {
      setError('Please select at least one eligible engineering department.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiRequest('/jobs', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          jobLocation,
          ctcRange,
          minimumCgpa: parseFloat(minimumCgpa),
          maximumBacklogs: parseInt(maximumBacklogs),
          eligibleDepartments: selectedDepts.join(','),
          targetGraduationYear: parseInt(targetGraduationYear),
          applicationDeadline: new Date(applicationDeadline).toISOString(),
          requiredSkills: skills,
        }),
      });

      router.push('/dashboard/recruiter');
    } catch (err: any) {
      setError(err.message || 'Failed to publish placement drive.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <Link
        href="/dashboard/recruiter"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Publish Campus Placement Drive</h1>
        <p className="text-sm text-slate-500">Configure deterministic eligibility cutoffs and required technical skills</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1">Job Opening Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="e.g. Software Engineer (Backend Cloud Systems)"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1">Detailed Description & Responsibilities</label>
          <textarea
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Outline role expectations, day-to-day duties, and team tech stack..."
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">Job Location / Model</label>
            <input
              type="text"
              required
              value={jobLocation}
              onChange={(e) => setJobLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">Compensation / CTC Range</label>
            <input
              type="text"
              required
              value={ctcRange}
              onChange={(e) => setCtcRange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Eligibility Engine Cutoffs */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Deterministic Eligibility Engine Cutoffs
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Minimum CGPA (0-10)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                required
                value={minimumCgpa}
                onChange={(e) => setMinimumCgpa(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Max Active Backlogs</label>
              <input
                type="number"
                min="0"
                required
                value={maximumBacklogs}
                onChange={(e) => setMaximumBacklogs(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Batch Year</label>
              <input
                type="number"
                required
                value={targetGraduationYear}
                onChange={(e) => setTargetGraduationYear(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Eligible Academic Departments</label>
            <div className="grid sm:grid-cols-2 gap-2">
              {departmentsList.map((dept) => (
                <label key={dept} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedDepts.includes(dept)}
                    onChange={() => handleToggleDept(dept)}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span>{dept}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Required Skills */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1">Required Skills for AI Matching</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
              placeholder="Add skill (e.g., Docker, PostgreSQL, React)..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                {s}
                <button type="button" onClick={() => handleRemoveSkill(s)} className="hover:text-rose-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1">Application Deadline</label>
          <input
            type="date"
            required
            value={applicationDeadline}
            onChange={(e) => setApplicationDeadline(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 disabled:opacity-60 transition-all"
        >
          {loading ? 'Publishing Drive...' : 'Publish Job Drive'}
        </button>
      </form>
    </div>
  );
}
