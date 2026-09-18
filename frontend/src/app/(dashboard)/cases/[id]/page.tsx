'use client';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, FileText } from 'lucide-react';
import { CaseDetailSkeleton } from '@/components/ui/skeletons';

export default function CaseDetailsPage() {
  const router = useRouter();
  const { id } = useParams();

  const { data: caseResponse, isLoading: loading, isError } = useQuery({
    queryKey: ['case', id],
    queryFn: async () => {
      const res = await api.get(`/cases/${id}`);
      return res.data;
    }
  });

  const data = caseResponse;

  if (loading) return <div className="p-6"><CaseDetailSkeleton /></div>;
  if (isError || !data?.case) return <div className="p-20 text-center"><p className="text-xl text-foreground font-bold tracking-tight uppercase">Case not found or failed to load.</p></div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end bg-card p-8 rounded-2xl border border-border/80 shadow-sm gap-6">
        <div>
          <div className="flex items-center space-x-4 mb-3">
            <h1 className="text-4xl font-extrabold text-foreground tracking-tight">{data.case.title}</h1>
            <span className={`inline-flex items-center px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest border rounded-md shadow-sm ${
              data.case.status === 'open' ? 'border-primary/20 bg-primary/5 text-primary' : 'border-border bg-muted/20 text-muted-foreground'
            }`}>
              {data.case.status}
            </span>
          </div>
          <p className="text-sm text-muted-foreground font-medium tracking-wide flex items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest mr-2">Ref ID:</span> 
            <span className="font-mono bg-muted/50 px-2 py-1 rounded">{data.case._id}</span>
          </p>
        </div>
        <div className="flex space-x-4">
          <button onClick={() => router.push(`/cases/${id}/brief`)} className="flex items-center justify-center px-6 py-3 text-xs font-bold tracking-widest uppercase text-foreground bg-card hover:bg-muted border border-border/80 hover:border-primary/40 rounded-xl transition-all duration-300 shadow-sm">
            <FileText className="mr-2 h-4 w-4" /> Generate Brief
          </button>
          <button onClick={() => router.push(`/cases/${id}/analysis`)} className="flex items-center justify-center bg-primary px-6 py-3 text-primary-foreground font-bold tracking-widest uppercase text-xs transition-all hover:bg-primary/90 border border-primary rounded-xl shadow-md">
            <Activity className="mr-2 h-4 w-4" /> Go to AI Analysis
          </button>
        </div>
      </div>

      <div className="w-full">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-transparent border-b border-border/60 w-full justify-start h-auto p-0 space-x-8 rounded-none mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-2 py-4 font-bold tracking-wide uppercase text-xs text-muted-foreground">Overview</TabsTrigger>
            <TabsTrigger value="statement" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-2 py-4 font-bold tracking-wide uppercase text-xs text-muted-foreground">Statement</TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-2 py-4 font-bold tracking-wide uppercase text-xs text-muted-foreground">Timeline</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="bg-card rounded-2xl border border-border/80 overflow-hidden shadow-sm">
              <div className="p-8 border-b border-border/80 bg-muted/20">
                <h3 className="text-xs font-bold tracking-widest uppercase text-foreground">Intake Details</h3>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Relationship Type</p>
                    <p className="mt-2 text-foreground font-semibold text-lg">{data.inputs?.relationshipType || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Frequency</p>
                    <p className="mt-2 text-foreground font-semibold text-lg">{data.inputs?.incidentFrequency || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Prior Complaints</p>
                    <p className="mt-2 text-foreground font-semibold text-lg">{data.inputs?.priorComplaints ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="statement" className="mt-6">
            <div className="bg-card rounded-2xl border border-border/80 overflow-hidden shadow-sm">
              <div className="p-8 border-b border-border/80 bg-muted/20">
                <h3 className="text-xs font-bold tracking-widest uppercase text-foreground">Victim Statement</h3>
              </div>
              <div className="p-8">
                <p className="whitespace-pre-wrap text-foreground leading-relaxed font-medium">
                  {data.statement?.anonymizedText || 'No statement provided.'}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="mt-6">
            <div className="bg-card rounded-3xl border border-border overflow-hidden">
              <div className="p-8 border-b border-border">
                <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Timeline Events</h3>
              </div>
              <div className="p-8">
                {data.timeline?.length === 0 ? (
                  <p className="text-muted-foreground font-medium">No events recorded yet.</p>
                ) : (
                  <div className="space-y-8">
                    {data.timeline?.map((ev: any) => (
                      <div key={ev._id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-[-2rem] last:before:bottom-0 before:w-px before:bg-border">
                        <div className="absolute left-[-4px] top-2 h-2 w-2 rounded-full bg-white ring-4 ring-background" />
                        <div>
                          <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">{new Date(ev.date).toLocaleDateString()}</p>
                          <p className="text-sm text-foreground font-medium mt-2">{ev.description}</p>
                          <span className="inline-block mt-3 px-2 py-1 text-[10px] font-bold uppercase tracking-widest border border-border text-muted-foreground rounded-md">{ev.severity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
