'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Briefcase, LayoutDashboard, LogOut, FileText, Settings } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');

    if (!storedUser || !token) {
      router.push('/login');
      return;
    }

    const parsed = JSON.parse(storedUser);

    if (parsed.role === 'applicant') {
      router.push('/applicant/dashboard');
      return;
    }

    setUser(parsed);
    api.setToken(token);
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    api.clearToken();
    router.push('/login');
  };

  const navItemClass = (href: string) => {
    const isActive = pathname === href;
    return [
      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-colors',
      isActive
        ? 'bg-blue-50 text-blue-700'
        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
    ].join(' ');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 px-4 flex items-center border-b border-gray-200">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold text-gray-900">Fawri</div>
              <div className="text-xs text-gray-700">Admin</div>
            </div>
          </Link>
        </div>

        <nav className="p-3 space-y-1">
          <Link href="/admin/dashboard" className={navItemClass('/admin/dashboard')}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/admin/applications" className={navItemClass('/admin/applications')}>
            <FileText className="w-5 h-5" />
            Applications
          </Link>
          <Link href="/admin/settings" className={navItemClass('/admin/settings')}>
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        <div className="mt-auto p-4 border-t border-gray-200">
          <div className="text-sm text-gray-700 mb-3">
            {user ? (
              <span>
                {user.firstName} {user.lastName}
              </span>
            ) : (
              <span>Loading…</span>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-700">Fawri Recruitment Portal</p>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
