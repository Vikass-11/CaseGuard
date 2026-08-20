'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, FileText, Inbox, ArrowUpRight } from 'lucide-react';
import { CaseListSkeleton } from '@/components/ui/skeletons';

export default function DashboardPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const { data: cases = [], isLoading, isError } = useQuery({
    queryKey: ['cases'],
    queryFn: async () => {
      const res = await api.get('/cases');
      return res.data;
    }
  });

  const filteredCases = cases.filter((c: any) => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c._id.includes(search)
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      {/* Header Banner */}
      <div className="relative bg-white/[0.02] p-12 rounded-[2rem] border border-white/10 backdrop-blur-md overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-[0_0_80px_rgba(0,0,0,0.8)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight uppercase" style={{ fontStretch: 'condensed' }}>
            Case<br/>Management
          </h1>
          <p className="text-[#a1a1aa] mt-4 text-base font-medium tracking-wide leading-relaxed max-w-md">
            I design elegant, high-performing digital experiences that merge strategy, aesthetics, and technology. (Just kidding, manage your cases here).
          </p>
        </div>
        
        <button 
          onClick={() => router.push('/cases/new')}
          className="relative z-10 flex items-center gap-3 bg-white hover:bg-neutral-200 text-black px-8 py-5 transition-all duration-300 group"
        >
          <span className="font-bold text-xs tracking-widest uppercase">New Case</span>
          <span className="flex items-center justify-center w-8 h-8 rounded-full border border-black/20 group-hover:bg-black group-hover:text-white transition-colors duration-300">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </button>
      </div>

      {/* Stats/Metrics (Inspired by the reference image) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: '✧', value: cases.length || '0', label: 'TOTAL CASES' },
          { icon: '⚑', value: cases.filter((c: any) => c.status === 'open').length || '0', label: 'OPEN CASES' },
          { icon: '✓', value: cases.filter((c: any) => c.status === 'closed').length || '0', label: 'CLOSED CASES' },
          { icon: '⊕', value: new Set(cases.map((c: any) => c.assignedTo?._id)).size || '0', label: 'WORKERS ASSIGNED' }
        ].map((stat, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-white/[0.04]">
            <span className="text-[#a1a1aa] text-2xl mb-4">{stat.icon}</span>
            <span className="text-4xl font-bold text-white mb-2" style={{ fontStretch: 'condensed' }}>{stat.value}</span>
            <span className="text-[10px] font-bold text-[#a1a1aa] tracking-widest uppercase">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-3 bg-[#111113] p-4 rounded-xl border border-white/10 relative shadow-inner">
        <Search className="h-5 w-5 text-[#a1a1aa] ml-3" />
        <input 
          placeholder="SEARCH CASES BY TITLE OR ID..." 
          className="w-full bg-transparent border-0 focus:ring-0 text-white placeholder-[#a1a1aa] font-bold text-xs tracking-widest uppercase py-2 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Cases Table */}
      <div className="bg-white/[0.02] rounded-3xl border border-white/10 overflow-hidden backdrop-blur-md">
        <div className="p-8 border-b border-white/10">
          <h3 className="text-xs font-bold tracking-widest uppercase text-[#a1a1aa]">Featured Cases</h3>
        </div>
        
        {isLoading ? (
          <div className="p-8">
            <CaseListSkeleton />
          </div>
        ) : isError ? (
          <div className="p-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-6">
               <span className="text-white text-2xl">⚠</span>
            </div>
            <p className="text-xl text-white font-bold tracking-tight uppercase">Failed to load cases</p>
            <p className="text-[#a1a1aa] mt-3 font-medium text-sm">Please try refreshing the page.</p>
          </div>
        ) : (
          <div className="w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa] py-6 px-8">Case Title</th>
                  <th className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa] py-6 px-8">ID</th>
                  <th className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa] py-6 px-8">Status</th>
                  <th className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa] py-6 px-8">Created</th>
                  <th className="text-right text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa] py-6 px-8">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-32">
                      <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="bg-white/5 p-6 rounded-full border border-white/10">
                          <Inbox className="h-8 w-8 text-[#a1a1aa]" strokeWidth={1} />
                        </div>
                        <p className="text-white text-lg font-bold tracking-tight uppercase">No cases found</p>
                        {search ? (
                          <p className="text-[#a1a1aa] text-sm tracking-wide">Try adjusting your search filters.</p>
                        ) : (
                          <button onClick={() => router.push('/cases/new')} className="mt-2 text-xs font-bold tracking-widest uppercase text-white border-b border-white hover:text-[#a1a1aa] hover:border-[#a1a1aa] pb-1 transition-colors">
                            Create your first case →
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCases.map((c: any) => (
                    <tr key={c._id} className="group hover:bg-white/[0.04] cursor-pointer border-b border-white/5 transition-colors" onClick={() => router.push(`/cases/${c._id}`)}>
                      <td className="py-6 px-8 flex items-center">
                        <div className="h-10 w-10 bg-[#111113] rounded-lg border border-white/10 flex items-center justify-center mr-4 group-hover:border-white/30 transition-colors">
                          <FileText className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-bold text-white tracking-wide">{c.title}</span>
                      </td>
                      <td className="py-6 px-8 text-[#a1a1aa] font-mono text-xs tracking-wider">{c._id.substring(0, 8)}</td>
                      <td className="py-6 px-8">
                        <span className={`inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest border rounded-full ${
                          c.status === 'open' ? 'border-white text-white' : 'border-white/20 text-[#a1a1aa]'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-6 px-8 text-[#a1a1aa] text-sm font-medium tracking-wide">
                        {new Date(c.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-6 px-8 text-right">
                        <button onClick={(e) => { e.stopPropagation(); router.push(`/cases/${c._id}`); }} className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-white/20 text-white group-hover:bg-white group-hover:text-black transition-all">
                          <ArrowUpRight className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
