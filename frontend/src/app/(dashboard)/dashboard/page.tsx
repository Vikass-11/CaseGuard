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
      <div className="relative bg-card p-12 rounded-[2rem] border border-border overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-card rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight uppercase">
            Case<br/>Management
          </h1>
          <p className="text-muted-foreground mt-4 text-base font-medium tracking-wide leading-relaxed max-w-md">
            I design elegant, high-performing digital experiences that merge strategy, aesthetics, and technology. (Just kidding, manage your cases here).
          </p>
        </div>
        
        <button 
          onClick={() => router.push('/cases/new')}
          className="relative z-10 flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-5 transition-all duration-300 group"
        >
          <span className="font-bold text-xs tracking-widest uppercase">New Case</span>
          <span className="flex items-center justify-center w-8 h-8 rounded-full border border-black/20 group-hover:bg-black group-hover:text-foreground transition-colors duration-300">
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
          <div key={i} className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-muted/60">
            <span className="text-muted-foreground text-2xl mb-4">{stat.icon}</span>
            <span className="text-4xl font-bold text-foreground mb-2">{stat.value}</span>
            <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-3 bg-muted p-4 rounded-xl border border-border relative shadow-inner">
        <Search className="h-5 w-5 text-muted-foreground ml-3" />
        <input 
          placeholder="SEARCH CASES BY TITLE OR ID..." 
          className="w-full bg-transparent border-0 focus:ring-0 text-foreground placeholder-muted-foreground font-bold text-xs tracking-widest uppercase py-2 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Cases Table */}
      <div className="bg-card rounded-3xl border border-border overflow-hidden">
        <div className="p-8 border-b border-border">
          <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Featured Cases</h3>
        </div>
        
        {isLoading ? (
          <div className="p-8">
            <CaseListSkeleton />
          </div>
        ) : isError ? (
          <div className="p-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted border border-border mb-6">
               <span className="text-foreground text-2xl">⚠</span>
            </div>
            <p className="text-xl text-foreground font-bold tracking-tight uppercase">Failed to load cases</p>
            <p className="text-muted-foreground mt-3 font-medium text-sm">Please try refreshing the page.</p>
          </div>
        ) : (
          <div className="w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground py-6 px-8">Case Title</th>
                  <th className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground py-6 px-8">ID</th>
                  <th className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground py-6 px-8">Status</th>
                  <th className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground py-6 px-8">Created</th>
                  <th className="text-right text-[10px] font-bold tracking-widest uppercase text-muted-foreground py-6 px-8">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-32">
                      <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="bg-muted p-6 rounded-full border border-border">
                          <Inbox className="h-8 w-8 text-muted-foreground" strokeWidth={1} />
                        </div>
                        <p className="text-foreground text-lg font-bold tracking-tight uppercase">No cases found</p>
                        {search ? (
                          <p className="text-muted-foreground text-sm tracking-wide">Try adjusting your search filters.</p>
                        ) : (
                          <button onClick={() => router.push('/cases/new')} className="mt-2 text-xs font-bold tracking-widest uppercase text-foreground border-b border-primary hover:text-muted-foreground hover:border-muted-foreground pb-1 transition-colors">
                            Create your first case →
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCases.map((c: any) => (
                    <tr key={c._id} className="group hover:bg-muted/60 cursor-pointer border-b border-border transition-colors" onClick={() => router.push(`/cases/${c._id}`)}>
                      <td className="py-6 px-8 flex items-center">
                        <div className="h-10 w-10 bg-muted rounded-lg border border-border flex items-center justify-center mr-4 group-hover:border-primary/40 transition-colors">
                          <FileText className="h-4 w-4 text-foreground" />
                        </div>
                        <span className="text-sm font-bold text-foreground tracking-wide">{c.title}</span>
                      </td>
                      <td className="py-6 px-8 text-muted-foreground font-mono text-xs tracking-wider">{c._id.substring(0, 8)}</td>
                      <td className="py-6 px-8">
                        <span className={`inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest border rounded-full ${
                          c.status === 'open' ? 'border-primary text-foreground' : 'border-border text-muted-foreground'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-6 px-8 text-muted-foreground text-sm font-medium tracking-wide">
                        {new Date(c.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-6 px-8 text-right">
                        <button onClick={(e) => { e.stopPropagation(); router.push(`/cases/${c._id}`); }} className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-border text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all">
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
