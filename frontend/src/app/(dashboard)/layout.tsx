'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Shield, Home, PlusCircle, Users, LogOut, User as UserIcon } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Shield className="h-6 w-6 text-blue-500 mr-2" />
          <span className="font-bold text-lg tracking-wide">CaseGuard</span>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1">
          <Link href="/dashboard" className={`flex items-center px-3 py-2 rounded-md transition-colors ${pathname === '/dashboard' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            <Home className="h-5 w-5 mr-3" />
            Dashboard
          </Link>
          <Link href="/cases/new" className={`flex items-center px-3 py-2 rounded-md transition-colors ${pathname === '/cases/new' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            <PlusCircle className="h-5 w-5 mr-3" />
            New Case
          </Link>
          {user?.role === 'admin' && (
            <Link href="/admin" className={`flex items-center px-3 py-2 rounded-md transition-colors ${pathname.startsWith('/admin') ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
              <Users className="h-5 w-5 mr-3" />
              Admin
            </Link>
          )}
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center mb-4 px-2">
            <UserIcon className="h-8 w-8 p-1 bg-slate-800 rounded-full mr-3" />
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center w-full px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-md transition-colors">
            <LogOut className="h-4 w-4 mr-3" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800">
            {pathname === '/dashboard' ? 'Dashboard' : 
             pathname === '/cases/new' ? 'New Case Intake' : 
             pathname.startsWith('/admin') ? 'Admin Panel' : 'Case Details'}
          </h2>
        </header>
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
