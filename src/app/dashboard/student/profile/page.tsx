'use client';

import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { User, Plus, X, Check, AlertCircle } from 'lucide-react';

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await apiRequest('/student/profile');
      setProfile(data);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const updated = await apiRequest('/student/profile', {
        method: 'PUT',
        body: JSON.stringify({
          phoneNumber: profile.phoneNumber,
          githubProfileUrl: profile.githubProfileUrl,
          linkedinProfileUrl: profile.linkedinProfileUrl,
          cgpa: profile.cgpa,
          activeBacklogs: profile.activeBacklogs,
        }),
      });
      setProfile(updated);
      setMessage('Profile updated successfully!');
    } catch (e: any) {
      setMessage(e.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    try {
      const skills = await apiRequest('/student/skills', {
        method: 'POST',
        body: JSON.stringify([newSkill.trim()]),
      });
      setProfile({ ...profile, skills });
      setNewSkill('');
    } catch (e) {}
  };

  const handleRemoveSkill = async (skillId: number) => {
    try {
      await apiRequest(`/student/skills/${skillId}`, { method: 'DELETE' });
      setProfile({
        ...profile,
        skills: profile.skills.filter((s: any) => s.id !== skillId),
      });
    } catch (e) {}
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Academic & Skill Profile</h1>
        <p className="text-sm text-slate-500">Manage verified institutional details, contact points, and technical competencies</p>
      </div>

      {message && (
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {/* Academic Details (Locked/Official) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Verified Academic Record</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-500 block">Registration No</span>
            <span className="font-semibold text-slate-800">{profile.studentRegistrationNumber}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-500 block">University Degree</span>
            <span className="font-semibold text-slate-800">{profile.degree} - {profile.university}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-500 block">Department / Branch</span>
            <span className="font-semibold text-slate-800">{profile.department}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-500 block">Graduation Batch</span>
            <span className="font-semibold text-slate-800">{profile.graduationYear}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-500 block">Cumulative CGPA</span>
            <span className="font-semibold text-blue-600">{profile.cgpa} / 10.0</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-500 block">Active Backlogs</span>
            <span className={`font-semibold ${profile.activeBacklogs > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {profile.activeBacklogs} Backlogs
            </span>
          </div>
        </div>
      </div>

      {/* Skills Taxonomy Manager */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Technical Skill Inventory</h2>
        <p className="text-xs text-slate-500">Add technical skills to align your profile with recruiter search and criteria checks.</p>

        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
            placeholder="Add skill e.g. Docker, Kubernetes, AWS..."
            className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> Add Skill
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {profile.skills?.map((skill: any) => (
            <span
              key={skill.id}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
            >
              {skill.name}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill.id)}
                className="text-slate-400 hover:text-rose-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Contact & Portfolio Links */}
      <form onSubmit={handleUpdate} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Contact & Portfolio Links</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={profile.phoneNumber || ''}
              onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="+91 9876543210"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub Profile URL</label>
            <input
              type="url"
              value={profile.githubProfileUrl || ''}
              onChange={(e) => setProfile({ ...profile, githubProfileUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="https://github.com/username"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">LinkedIn Profile URL</label>
          <input
            type="url"
            value={profile.linkedinProfileUrl || ''}
            onChange={(e) => setProfile({ ...profile, linkedinProfileUrl: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Profile Changes'}
        </button>
      </form>
    </div>
  );
}
