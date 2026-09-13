'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Inbox, ArrowUpRight, Scale } from 'lucide-react';
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
      
      {/* Hero Banner */}
      <div className="relative bg-card p-12 rounded-2xl border border-border/80 overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center space-x-3 mb-4">
            <Scale className="h-6 w-6 text-destructive" />
            <span className="text-xs font-bold tracking-widest text-destructive uppercase">Legal Division</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-foreground tracking-tight leading-tight">
            Case Management
          </h1>
          <p className="text-muted-foreground mt-4 text-lg font-medium tracking-wide leading-relaxed max-w-md">
            Securely oversee active litigation, manage new intake data, and monitor risk vectors across the organization.
          </p>
        </div>
        
        <button 
          onClick={() => router.push('/cases/new')}
          className="relative z-10 flex items-center gap-4 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-5 transition-all duration-300 rounded-xl shadow-md hover:shadow-lg group"
        >
          <span className="font-bold text-sm tracking-widest uppercase">New Case Intake</span>
          <span className="flex items-center justify-center w-8 h-8 rounded-full border border-background/20 group-hover:bg-background group-hover:text-primary transition-colors duration-300">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: '✧', value: cases.length || '0', label: 'TOTAL CASES' },
          { icon: '⚑', value: cases.filter((c: any) => c.status === 'open').length || '0', label: 'OPEN CASES' },
          { icon: '✓', value: cases.filter((c: any) => c.status === 'closed').length || '0', label: 'CLOSED CASES' },
          { icon: '⊕', value: new Set(cases.map((c: any) => c.assignedTo?._id)).size || '0', label: 'WORKERS ASSIGNED' }
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border/80 rounded-2xl p-8 flex flex-col items-start justify-center transition-all duration-300 hover:shadow-md hover:border-border">
            <span className="text-muted-foreground text-2xl mb-6">{stat.icon}</span>
            <span className="text-4xl font-extrabold text-foreground mb-2 tracking-tight">{stat.value}</span>
            <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-4 bg-card p-2 rounded-xl border border-border/80 shadow-sm relative">
        <div className="pl-4">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <input 
          placeholder="SEARCH CASES BY TITLE OR ID..." 
          className="w-full bg-transparent border-0 focus:ring-0 text-foreground placeholder-muted-foreground font-semibold text-sm tracking-widest uppercase py-3 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Cases Table Section */}
      <div className="bg-card rounded-2xl border border-border/80 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-border/80 flex justify-between items-center bg-muted/20">
          <h3 className="text-sm font-bold tracking-widest uppercase text-foreground">Active Case Directory</h3>
        </div>
        
        {isLoading ? (
          <div className="p-8">
            <CaseListSkeleton />
          </div>
        ) : isError ? (
          <div className="p-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted border border-border/80 mb-6 shadow-sm">
               <span className="text-destructive text-2xl">⚠</span>
            </div>
            <p className="text-xl text-foreground font-bold tracking-tight uppercase">Failed to load cases</p>
            <p className="text-muted-foreground mt-3 font-medium text-sm">Please try refreshing the connection.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/10 hover:bg-muted/10">
                <TableHead className="py-4 px-8">Case Title</TableHead>
                <TableHead className="py-4 px-8">Reference ID</TableHead>
                <TableHead className="py-4 px-8">Status</TableHead>
                <TableHead className="py-4 px-8">Initiated</TableHead>
                <TableHead className="text-right py-4 px-8">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-32">
                    <div className="flex flex-col items-center justify-center space-y-6">
                      <div className="bg-muted/30 p-6 rounded-full border border-border/80">
                        <Inbox className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
                      </div>
                      <p className="text-foreground text-lg font-bold tracking-tight uppercase">No records found</p>
                      {search ? (
                        <p className="text-muted-foreground text-sm font-medium tracking-wide">Adjust your search parameters.</p>
                      ) : (
                        <button onClick={() => router.push('/cases/new')} className="mt-2 text-xs font-bold tracking-widest uppercase text-primary border-b border-primary/30 hover:border-primary pb-1 transition-colors">
                          Initiate new case →
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCases.map((c: any) => (
                  <TableRow key={c._id} className="group cursor-pointer transition-colors" onClick={() => router.push(`/cases/${c._id}`)}>
                    <TableCell className="py-6 px-8">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-muted/30 rounded-lg border border-border/80 flex items-center justify-center mr-4 group-hover:border-primary/40 transition-colors shadow-sm">
                          <FileText className="h-4 w-4 text-foreground" />
                        </div>
                        <span className="text-sm font-bold text-foreground tracking-wide">{c.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-6 px-8 text-muted-foreground font-mono text-xs tracking-wider">{c._id.substring(0, 8)}</TableCell>
                    <TableCell className="py-6 px-8">
                      <span className={`inline-flex items-center px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border rounded-md shadow-sm ${
                        c.status === 'open' ? 'border-primary/20 bg-primary/5 text-primary' : 'border-border bg-muted/20 text-muted-foreground'
                      }`}>
                        {c.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-6 px-8 text-muted-foreground text-sm font-medium tracking-wide">
                      {new Date(c.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </TableCell>
                    <TableCell className="py-6 px-8 text-right">
                      <button onClick={(e) => { e.stopPropagation(); router.push(`/cases/${c._id}`); }} className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-border/80 text-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all shadow-sm">
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
