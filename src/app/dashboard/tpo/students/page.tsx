'use client';

import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { Users, Filter, CheckCircle2, XCircle } from 'lucide-react';

export default function TpoStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [department, setDepartment] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, [department]);

  const loadStudents = async () => {
    try {
      const q = department !== 'ALL' ? `?department=${encodeURIComponent(department)}` : '';
      const data = await apiRequest(`/tpo/students${q}`);
      setStudents(data || []);
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    'ALL',
    'Computer Science and Engineering',
    'Information Technology',
    'Electronics and Communication Engineering',
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Institutional Student Roster</h1>
          <p className="text-sm text-slate-500">Audited student records, CGPAs, and verified skill sets</p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === 'ALL' ? 'All Departments' : d}
              </option>
            ))}
          </select>
        </div>
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
                <th className="p-4">Reg No</th>
                <th className="p-4">Student Name</th>
                <th className="p-4">Department</th>
                <th className="p-4">CGPA</th>
                <th className="p-4">Backlogs</th>
                <th className="p-4">Skills</th>
                <th className="p-4">Resume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-mono text-xs font-bold text-slate-800">{st.studentRegistrationNumber}</td>
                  <td className="p-4 font-bold text-slate-900">{st.fullName}</td>
                  <td className="p-4 text-slate-600 text-xs">{st.department}</td>
                  <td className="p-4 font-bold text-blue-600">{st.cgpa}</td>
                  <td className="p-4">
                    <span className={`text-xs font-bold ${st.activeBacklogs > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {st.activeBacklogs}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {st.skills?.slice(0, 3).map((s: any) => (
                        <span key={s.id} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          {s.name}
                        </span>
                      ))}
                      {st.skills?.length > 3 && (
                        <span className="text-[10px] text-slate-400">+{st.skills.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    {st.resumeFilePath ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Uploaded
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                        <XCircle className="w-3.5 h-3.5" /> Pending
                      </span>
                    )}
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
