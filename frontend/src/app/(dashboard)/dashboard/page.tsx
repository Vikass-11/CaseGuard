'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  FileText,
  Inbox,
  ArrowUpRight,
  Scale,
  Brain,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  Clock,
  Plus
} from 'lucide-react';
import { CaseListSkeleton } from '@/components/ui/skeletons';

export default function DashboardPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const { data: cases = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['cases'],
    queryFn: async () => {
      const res = await api.get('/cases');
      return res.data;
    }
  });

  const filteredCases = cases.filter((c: any) => {
    const matchesSearch =
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c._id?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'OPEN' && (c.status === 'INTAKE' || c.status === 'open' || !c.status)) ||
      (statusFilter === 'ANALYSIS' && c.status === 'ANALYSIS') ||
      (statusFilter === 'CLOSED' && (c.status === 'CLOSED' || c.status === 'closed'));

    return matchesSearch && matchesStatus;
  });

  const totalCasesCount = cases.length;
  const openCasesCount = cases.filter((c: any) => c.status !== 'CLOSED' && c.status !== 'closed').length;
  const closedCasesCount = cases.filter((c: any) => c.status === 'CLOSED' || c.status === 'closed').length;

  const getStatusBadge = (status: string) => {
    const s = (status || 'INTAKE').toUpperCase();
    switch (s) {
      case 'CLOSED':
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-border text-[10px] font-bold">CLOSED</Badge>;
      case 'ANALYSIS':
        return <Badge variant="outline" className="bg-[#FED7A5]/20 text-[#9E6752] border-[#FED7A5] text-[10px] font-bold">IN ANALYSIS</Badge>;
      case 'REVIEW':
        return <Badge variant="outline" className="bg-[#2D4354]/10 text-[#2D4354] border-[#2D4354]/30 text-[10px] font-bold">COURT REVIEW</Badge>;
      case 'INTAKE':
      default:
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30 text-[10px] font-bold">ACTIVE INTAKE</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans pb-16">
      
      {/* Hero Banner */}
      <div className="relative bg-card p-8 sm:p-10 rounded-3xl border border-border/80 overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[90px] pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center space-x-2.5">
            <Scale className="h-5 w-5 text-destructive" />
            <span className="text-xs font-bold tracking-widest text-destructive uppercase">Forensic Litigation Suite</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
            Case Management Directory
          </h1>
          <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-xl">
            Oversee active litigation, manage intake testimonies, review clinical risk vectors, and generate court-admissible briefs.
          </p>
        </div>
        
        <button 
          onClick={() => router.push('/cases/new')}
          className="relative z-10 flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-4 transition-all duration-200 rounded-2xl shadow-md hover:shadow-lg group cursor-pointer self-start md:self-auto shrink-0"
        >
          <span className="font-bold text-xs tracking-widest uppercase">New Case Intake</span>
          <span className="flex items-center justify-center w-7 h-7 rounded-full border border-background/20 group-hover:bg-background group-hover:text-primary transition-colors duration-200">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {[
          { icon: '✧', value: totalCasesCount, label: 'TOTAL PORTFOLIO' },
          { icon: '⚑', value: openCasesCount, label: 'ACTIVE LITIGATIONS' },
          { icon: '✓', value: closedCasesCount, label: 'RESOLVED / CLOSED' },
          { icon: '⊕', value: new Set(cases.map((c: any) => c.createdBy)).size || 1, label: 'ACTIVE ADVOCATES' }
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border/80 rounded-2xl p-6 flex flex-col justify-center hover:shadow-sm transition-all">
            <span className="text-muted-foreground text-xl mb-3">{stat.icon}</span>
            <span className="text-3xl font-extrabold text-foreground tracking-tight mb-1">{stat.value}</span>
            <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-card p-1 rounded-2xl border border-border/80 self-stretch sm:self-auto">
          {[
            { id: 'ALL', label: 'All Cases' },
            { id: 'OPEN', label: 'Active Intake' },
            { id: 'ANALYSIS', label: 'In Analysis' },
            { id: 'CLOSED', label: 'Closed' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#2D4354] text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="flex items-center space-x-3 bg-card px-4 py-2.5 rounded-2xl border border-border/80 shadow-sm w-full sm:w-80">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input 
            placeholder="Search cases by title or ID..." 
            className="w-full bg-transparent border-0 text-foreground placeholder-muted-foreground font-medium text-xs tracking-wide focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Cases Table Section */}
      <div className="bg-card rounded-3xl border border-border/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border/80 flex justify-between items-center bg-muted/20">
          <h3 className="text-xs font-bold tracking-widest uppercase text-foreground">
            Case Portfolio ({filteredCases.length})
          </h3>
          <span className="text-[11px] text-muted-foreground">Showing verified records in organization scope</span>
        </div>
        
        {isLoading ? (
          <div className="p-8">
            <CaseListSkeleton />
          </div>
        ) : isError ? (
          <div className="p-16 text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-destructive/10 text-destructive mb-2">
               <ShieldAlert className="w-7 h-7" />
            </div>
            <p className="text-lg text-foreground font-bold tracking-tight">Failed to load cases</p>
            <p className="text-muted-foreground text-xs">Please verify your connection and try refreshing.</p>
            <Button onClick={() => refetch()} variant="outline" className="text-xs mt-2">Retry</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/10 hover:bg-muted/10">
                  <TableHead className="py-4 px-6 text-xs font-bold uppercase tracking-wider">Case Title & Reference</TableHead>
                  <TableHead className="py-4 px-6 text-xs font-bold uppercase tracking-wider">Status</TableHead>
                  <TableHead className="py-4 px-6 text-xs font-bold uppercase tracking-wider">Initiated</TableHead>
                  <TableHead className="text-right py-4 px-6 text-xs font-bold uppercase tracking-wider">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-16 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Inbox className="w-10 h-10 text-muted-foreground/40 stroke-1" />
                        <p className="text-sm font-bold text-foreground">No case files match your search criteria</p>
                        <p className="text-xs text-muted-foreground">Try clearing your filters or begin a new intake record.</p>
                        <Button
                          onClick={() => router.push('/cases/new')}
                          className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider mt-2"
                        >
                          <Plus className="w-3.5 h-3.5 mr-1.5" /> Start New Intake
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCases.map((c: any) => (
                    <TableRow key={c._id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="py-4 px-6 font-medium">
                        <Link href={`/cases/${c._id}`} className="hover:text-primary transition-colors block">
                          <span className="font-bold text-sm text-foreground block">{c.title}</span>
                          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">ID: {c._id}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        {getStatusBadge(c.status)}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-xs text-muted-foreground">
                        {new Date(c.createdAt || Date.now()).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-right py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/cases/${c._id}`}
                            className="px-3 py-1.5 rounded-lg border border-border text-xs font-bold uppercase tracking-wider hover:bg-muted transition-colors text-foreground"
                          >
                            Dossier
                          </Link>
                          <Link
                            href={`/cases/${c._id}/analysis`}
                            className="px-3 py-1.5 rounded-lg bg-[#FED7A5]/20 border border-[#FED7A5] text-[#9E6752] text-xs font-bold uppercase tracking-wider hover:bg-[#FED7A5]/40 transition-colors"
                          >
                            AI Analysis
                          </Link>
                          <Link
                            href={`/cases/${c._id}/brief`}
                            className="px-3 py-1.5 rounded-lg bg-[#2D4354] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2D4354]/90 transition-colors"
                          >
                            Brief Studio
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

    </div>
  );
}
