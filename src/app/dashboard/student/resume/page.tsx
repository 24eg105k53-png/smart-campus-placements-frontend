'use client';

import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { FileText, Upload, Sparkles, CheckCircle2, AlertCircle, FileCheck } from 'lucide-react';

export default function StudentResumePage() {
  const [profile, setProfile] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const p = await apiRequest('/student/profile');
      setProfile(p);
      if (p.resumeSummary) {
        setAnalysis(p.resumeSummary);
      }
    } catch (e) {}
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension !== 'pdf' && extension !== 'docx') {
      setError('Please select a valid PDF or DOCX file.');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await apiRequest('/student/resume/upload', {
        method: 'POST',
        body: formData,
      });

      let extractedSkills: string[] = [];
      try {
        extractedSkills = JSON.parse(res.extractedSkillsJson || '[]');
      } catch (e) {}

      setAnalysis({
        processingStatus: res.processingStatus,
        extractedSkills: extractedSkills,
        extractedSummary: res.extractedSummary,
        extractedCgpa: res.extractedCgpa,
      });

      setSuccess('Resume uploaded and parsed successfully by AI service! Newly identified skills have been synced to your profile.');
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to upload and parse resume.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Resume & AI Skill Extraction</h1>
        <p className="text-sm text-slate-500">Upload your resume in PDF or DOCX format for automated NLP parsing and skill matching</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-start gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {/* Upload Dropzone */}
      <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center hover:border-blue-500 transition-colors">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <Upload className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Upload Your Resume</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Supports .pdf and .docx documents (Maximum 10 MB). Scanned image PDFs will have limited text extraction.
        </p>

        <div className="mt-6 flex justify-center">
          <label className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-md shadow-blue-500/20">
            <FileText className="w-4 h-4" />
            {uploading ? 'Analyzing with AI Service...' : 'Select File from Computer'}
            <input
              type="file"
              accept=".pdf,.docx"
              disabled={uploading}
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {profile?.resumeFilePath && (
          <p className="text-xs text-slate-500 mt-4 flex items-center justify-center gap-1.5">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            Current active resume: <span className="font-semibold text-slate-700">{profile.resumeFilePath}</span>
          </p>
        )}
      </div>

      {/* Extracted Analysis Display */}
      {analysis && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">AI Parsing Results</h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              {analysis.processingStatus || 'COMPLETED'}
            </span>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Detected Summary</h4>
            <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">
              {analysis.extractedSummary || 'Extracted candidate background details.'}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Extracted Technical Competencies ({analysis.extractedSkills?.length || 0})
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.extractedSkills && analysis.extractedSkills.length > 0 ? (
                analysis.extractedSkills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-400">No skills recognized in the uploaded document.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
