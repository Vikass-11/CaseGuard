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

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c]">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
        <p className="mt-4 text-[#a1a1aa] text-xs font-bold tracking-widest uppercase">Loading Workspace...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#0a0a0c] text-slate-200 font-sans selection:bg-white/20">
      
      {/* Decorative Background */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/[0.03] via-[#0a0a0c] to-[#0a0a0c]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      </div>

      {/* Sidebar */}
      <aside className="w-[280px] bg-[#0a0a0c]/80 backdrop-blur-2xl border-r border-white/10 flex flex-col z-10">
        <div className="h-24 flex items-center px-8 border-b border-white/10">
          <div className="mr-3">
            <Shield className="h-7 w-7 text-white" strokeWidth={1.5} />
          </div>
          <span className="font-bold text-2xl tracking-tighter text-white uppercase" style={{ fontStretch: 'condensed' }}>CaseGuard</span>
        </div>
        
        <nav className="flex-1 py-8 px-6 space-y-2 overflow-y-auto">
          <p className="text-[10px] font-bold text-[#a1a1aa] tracking-widest uppercase mb-4 px-2">Menu</p>
          
          <Link href="/dashboard" className={`group flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${pathname === '/dashboard' ? 'bg-white text-black' : 'text-[#a1a1aa] hover:bg-white/5 hover:text-white'}`}>
            <Home className={`h-4 w-4 mr-3 transition-transform ${pathname === '/dashboard' ? 'text-black' : 'text-[#a1a1aa] group-hover:text-white'}`} strokeWidth={2} />
            <span className="font-bold text-xs tracking-wider uppercase">Dashboard</span>
          </Link>
          <Link href="/cases/new" className={`group flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${pathname === '/cases/new' ? 'bg-white text-black' : 'text-[#a1a1aa] hover:bg-white/5 hover:text-white'}`}>
            <PlusCircle className={`h-4 w-4 mr-3 transition-transform ${pathname === '/cases/new' ? 'text-black' : 'text-[#a1a1aa] group-hover:text-white'}`} strokeWidth={2} />
            <span className="font-bold text-xs tracking-wider uppercase">New Case</span>
          </Link>
          {user?.role === 'admin' && (
            <Link href="/admin" className={`group flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${pathname.startsWith('/admin') ? 'bg-white text-black' : 'text-[#a1a1aa] hover:bg-white/5 hover:text-white'}`}>
              <Users className={`h-4 w-4 mr-3 transition-transform ${pathname.startsWith('/admin') ? 'text-black' : 'text-[#a1a1aa] group-hover:text-white'}`} strokeWidth={2} />
              <span className="font-bold text-xs tracking-wider uppercase">Admin</span>
            </Link>
          )}
        </nav>
        
        <div className="p-6 border-t border-white/10 bg-[#0a0a0c]">
          <div className="flex items-center mb-6 px-2">
            <div className="h-10 w-10 bg-[#111113] rounded-full flex items-center justify-center border border-white/10 relative">
              <UserIcon className="h-4 w-4 text-[#a1a1aa]" />
            </div>
            <div className="ml-4 flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate tracking-wide">{user?.name}</p>
              <p className="text-[10px] text-[#a1a1aa] font-bold uppercase tracking-widest mt-0.5">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center justify-center w-full px-4 py-3 text-xs font-bold tracking-widest uppercase text-white bg-transparent hover:bg-white/5 border border-white/20 hover:border-white/40 rounded-lg transition-all duration-300 group">
            <LogOut className="h-3 w-3 mr-2 transition-transform group-hover:-translate-x-1" strokeWidth={2.5} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 min-w-0 h-screen overflow-hidden">
        <header className="h-24 bg-transparent flex items-center px-12 shrink-0 border-b border-white/10 backdrop-blur-md">
          <h2 className="text-sm font-bold tracking-widest uppercase text-[#a1a1aa]">
            {pathname === '/dashboard' ? 'Overview / Dashboard' : 
             pathname === '/cases/new' ? 'Cases / New Intake' : 
             pathname.startsWith('/admin') ? 'System / Administration' : 'Cases / Details'}
          </h2>
        </header>
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-12 max-w-[1600px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
