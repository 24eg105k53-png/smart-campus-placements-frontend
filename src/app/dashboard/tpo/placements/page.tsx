'use client';

import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { Award, Plus, CheckCircle, ShieldCheck } from 'lucide-react';

export default function TpoPlacementsPage() {
  const [placements, setPlacements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlacements();
  }, []);

  const loadPlacements = async () => {
    try {
      const data = await apiRequest('/tpo/placements');
      setPlacements(data || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Audited Placement Offers Ledger</h1>
          <p className="text-sm text-slate-500">Official university placement records and verified corporate offers</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : placements.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Award className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No Offers Recorded Yet</h3>
          <p className="text-xs text-slate-500 mt-1">Confirmed offers will appear here once candidates complete selection rounds.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
              <tr>
                <th className="p-4">Student Name</th>
                <th className="p-4">Reg No</th>
                <th className="p-4">Department</th>
                <th className="p-4">Company</th>
                <th className="p-4">Package (CTC)</th>
                <th className="p-4">Batch</th>
                <th className="p-4">TPO Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {placements.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-900">{p.studentProfile?.user?.fullName || 'Student'}</td>
                  <td className="p-4 font-mono text-xs text-slate-700">{p.studentProfile?.studentRegistrationNumber || 'N/A'}</td>
                  <td className="p-4 text-xs text-slate-600">{p.studentProfile?.department || 'N/A'}</td>
                  <td className="p-4 font-semibold text-blue-700">{p.company?.name || 'Company'}</td>
                  <td className="p-4 font-bold text-emerald-600">{p.ctcAmount} LPA</td>
                  <td className="p-4 text-slate-700">{p.placementYear}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
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
