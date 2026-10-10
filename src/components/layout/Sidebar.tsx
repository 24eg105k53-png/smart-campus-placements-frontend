'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, UserRole } from '@/context/AuthContext';
import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  Send,
  PlusCircle,
  Users,
  Award,
  TrendingUp,
  Building,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: any;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const role = user.role;

  const studentNav: NavItem[] = [
    { name: 'Overview', href: '/dashboard/student', icon: LayoutDashboard },
    { name: 'Academic Profile', href: '/dashboard/student/profile', icon: User },
    { name: 'Resume & AI Skills', href: '/dashboard/student/resume', icon: FileText },
    { name: 'Placement Drives', href: '/dashboard/student/jobs', icon: Briefcase },
    { name: 'My Applications', href: '/dashboard/student/applications', icon: Send },
  ];

  const recruiterNav: NavItem[] = [
    { name: 'Active Drives', href: '/dashboard/recruiter', icon: Briefcase },
    { name: 'Publish New Drive', href: '/dashboard/recruiter/jobs/create', icon: PlusCircle },
  ];

  const tpoNav: NavItem[] = [
    { name: 'Command Center', href: '/dashboard/tpo', icon: TrendingUp },
    { name: 'Placement Drives', href: '/dashboard/tpo/drives', icon: Briefcase },
    { name: 'Publish Drive', href: '/dashboard/recruiter/jobs/create', icon: PlusCircle },
    { name: 'Student Roster', href: '/dashboard/tpo/students', icon: Users },
    { name: 'Placement Records', href: '/dashboard/tpo/placements', icon: Award },
  ];

  let items = studentNav;
  if (role === 'RECRUITER') items = recruiterNav;
  if (role === 'TPO') items = tpoNav;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {role} Menu
        </div>
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
        <span className="font-semibold block text-slate-800">Current Role</span>
        <span className="text-slate-500">{role}</span>
      </div>
    </aside>
  );
};
