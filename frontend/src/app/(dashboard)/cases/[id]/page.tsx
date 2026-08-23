'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, ShieldCheck, Activity, FileText, ChevronRight } from 'lucide-react';
import { CaseDetailSkeleton } from '@/components/ui/skeletons';

export default function CaseDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [prediction, setPrediction] = useState<any>(null);
  const [recommendation, setRecommendation] = useState<any>(null);

  const { data: caseResponse, isLoading: loading, isError } = useQuery({
    queryKey: ['case', id],
    queryFn: async () => {
      const res = await api.get(`/cases/${id}`);
      return res.data;
    }
  });

  const analyzeMutation = useMutation({
    mutationFn: async () => {
      const predRes = await api.post(`/cases/${id}/analyze`);
      const recRes = await api.post(`/cases/${id}/generate-recommendations`);
      return { prediction: predRes.data, recommendation: recRes.data };
    },
    onSuccess: (resData) => {
      setPrediction(resData.prediction);
      setRecommendation(resData.recommendation);
      toast.success('Analysis completed successfully!');
    },
    onError: () => {
      toast.error('Failed to run analysis. Please try again.');
    }
  });

  const data = caseResponse;

  if (loading) return <div className="p-6"><CaseDetailSkeleton /></div>;
  if (isError || !data?.case) return <div className="p-20 text-center"><p className="text-xl text-foreground font-bold tracking-tight uppercase">Case not found or failed to load.</p></div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <h1 className="text-3xl font-bold text-foreground uppercase tracking-tighter">{data.case.title}</h1>
            <span className={`inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest border rounded-full ${
                          data.case.status === 'open' ? 'border-primary text-foreground' : 'border-border text-muted-foreground'
                        }`}>
              {data.case.status}
            </span>
          </div>
          <p className="text-sm text-muted-foreground font-mono tracking-wider">ID: {data.case._id}</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => router.push(`/cases/${id}/brief`)} className="flex items-center justify-center px-6 py-3 text-xs font-bold tracking-widest uppercase text-foreground bg-transparent hover:bg-muted border border-border hover:border-primary/40 rounded-lg transition-all duration-300">
            <FileText className="mr-2 h-4 w-4" /> Lawyer Brief
          </button>
          <button onClick={() => analyzeMutation.mutate()} disabled={analyzeMutation.isPending} className="flex items-center justify-center bg-primary px-6 py-3 text-primary-foreground font-bold tracking-widest uppercase text-xs transition-all hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed border border-primary rounded-lg">
            <Activity className="mr-2 h-4 w-4" /> {analyzeMutation.isPending ? 'Analyzing...' : 'Run Analysis'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-muted border border-border p-1 rounded-lg">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">Overview</TabsTrigger>
              <TabsTrigger value="statement" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">Statement</TabsTrigger>
              <TabsTrigger value="timeline" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">Timeline</TabsTrigger>
              <TabsTrigger value="analysis" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <div className="bg-card rounded-3xl border border-border overflow-hidden">
                <div className="p-8 border-b border-border">
                  <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Intake Details</h3>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Relationship Type</p>
                      <p className="mt-2 text-foreground font-medium text-lg">{data.inputs?.relationshipType || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Frequency</p>
                      <p className="mt-2 text-foreground font-medium text-lg">{data.inputs?.incidentFrequency || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Prior Complaints</p>
                      <p className="mt-2 text-foreground font-medium text-lg">{data.inputs?.priorComplaints ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="statement" className="mt-6">
              <div className="bg-card rounded-3xl border border-border overflow-hidden">
                <div className="p-8 border-b border-border">
                  <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Victim Statement</h3>
                </div>
                <div className="p-8">
                  <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed font-medium">
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

            <TabsContent value="analysis" className="mt-6 space-y-6">
              {!prediction ? (
                <div className="text-center py-20 bg-card rounded-3xl border border-border">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted border border-border mb-6">
                    <Activity className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground tracking-tight uppercase">No Analysis Available</h3>
                  <p className="text-muted-foreground mt-2 mb-8 font-medium text-sm">Run the ML analysis to generate insights.</p>
                  <button onClick={() => analyzeMutation.mutate()} disabled={analyzeMutation.isPending} className="inline-flex items-center justify-center bg-primary px-6 py-3 text-primary-foreground font-bold tracking-widest uppercase text-xs transition-all hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed border border-primary rounded-lg">
                    {analyzeMutation.isPending ? 'Analyzing...' : 'Run Analysis Now'}
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-card rounded-3xl border border-border overflow-hidden">
                    <div className="p-8 border-b border-border">
                      <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Risk & Severity Assessment</h3>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center space-x-6">
                        <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-2xl border border-border flex-1">
                          <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-3">Severity</p>
                          <span className="inline-flex items-center px-4 py-1.5 text-xs font-bold uppercase tracking-widest bg-[oklch(0.96_0.03_25)] text-[oklch(0.5_0.14_25)] border border-[oklch(0.85_0.06_25)] rounded-full">
                            {prediction.severity}
                          </span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-2xl border border-border flex-1">
                          <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">Escalation Score</p>
                          <div className="flex items-baseline space-x-2">
                            <span className="text-4xl font-bold text-foreground tracking-tighter">{prediction.escalationScore}</span>
                            <span className="text-sm font-bold text-muted-foreground">/ 100</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-card rounded-3xl border border-border overflow-hidden">
                    <div className="p-8 border-b border-border">
                      <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Identified Patterns & Triggers</h3>
                    </div>
                    <div className="p-8 space-y-8">
                      <div>
                        <h4 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-4">Abuse Patterns</h4>
                        <div className="flex flex-wrap gap-2">
                          {prediction.patterns.map((p: string, i: number) => (
                            <span key={i} className="inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-200 rounded-full">{p}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-4">Risk Triggers</h4>
                        <ul className="space-y-3">
                          {prediction.triggers.map((t: string, i: number) => (
                            <li key={i} className="flex items-start text-sm text-foreground font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-white/50 mt-1.5 mr-3 shrink-0" />
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar - Safe Action Navigator */}
        <div className="space-y-6">
          <div className="bg-card rounded-3xl border border-border overflow-hidden sticky top-6">
            <div className="p-6 border-b border-border bg-muted/60">
              <h3 className="flex items-center text-xs font-bold tracking-widest uppercase text-foreground">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Safe Action Navigator
              </h3>
            </div>
            
            <div className="p-0">
              {!recommendation ? (
                <div className="p-8 text-center text-muted-foreground text-sm font-medium">
                  Run analysis to generate action items.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  <div className="p-6 bg-[oklch(0.97_0.03_80)]">
                    <p className="text-[10px] font-bold text-[oklch(0.55_0.14_65)] uppercase tracking-widest mb-2">Urgency</p>
                    <p className="text-[oklch(0.55_0.14_65)] font-bold flex items-center text-sm tracking-wide">
                      <AlertTriangle className="h-4 w-4 mr-2" /> {recommendation.urgency}
                    </p>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-4">Evidence Checklist</p>
                    <ul className="space-y-3">
                      {recommendation.evidenceChecklist.map((item: string, i: number) => (
                        <li key={i} className="flex items-start text-sm text-foreground font-medium leading-relaxed">
                          <ChevronRight className="h-4 w-4 text-muted-foreground mr-2 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-4">Follow-up Questions</p>
                    <ul className="space-y-3">
                      {recommendation.followUpQuestions.map((item: string, i: number) => (
                        <li key={i} className="flex items-start text-sm text-foreground font-medium leading-relaxed">
                          <ChevronRight className="h-4 w-4 text-muted-foreground mr-2 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 bg-muted/60">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-4">Referrals</p>
                    <div className="flex flex-wrap gap-2">
                      {recommendation.referrals.map((item: string, i: number) => (
                        <span key={i} className="inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-muted text-foreground border border-border rounded-full">{item}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
