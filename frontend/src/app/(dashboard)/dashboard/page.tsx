'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, FileText, Inbox } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Cases</h1>
          <p className="text-slate-500">Manage and analyze domestic violence cases.</p>
        </div>
        <Button onClick={() => router.push('/cases/new')} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> New Case
        </Button>
      </div>

      <div className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <Search className="h-5 w-5 text-slate-400" />
        <Input 
          placeholder="Search cases by title or ID..." 
          className="border-0 focus-visible:ring-0 shadow-none text-base"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <CaseListSkeleton />
          </div>
        ) : isError ? (
          <div className="p-12 text-center text-red-500">
            Failed to load cases. Please try again.
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Case Title</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="bg-slate-100 p-3 rounded-full">
                        <Inbox className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium">No cases found.</p>
                      {search ? (
                        <p className="text-sm text-slate-400">Try adjusting your search filters.</p>
                      ) : (
                        <Button variant="outline" onClick={() => router.push('/cases/new')} className="mt-2">
                          Create your first case
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCases.map((c: any) => (
                  <TableRow key={c._id} className="hover:bg-slate-50 cursor-pointer" onClick={() => router.push(`/cases/${c._id}`)}>
                    <TableCell className="font-medium text-slate-900 flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-blue-500" />
                      {c.title}
                    </TableCell>
                    <TableCell className="text-slate-500 font-mono text-xs">{c._id.substring(0, 8)}</TableCell>
                    <TableCell>
                      <Badge variant={c.status === 'open' ? 'default' : 'secondary'} className={c.status === 'open' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}>
                        {c.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); router.push(`/cases/${c._id}`); }}>
                        View Details
                      </Button>
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
