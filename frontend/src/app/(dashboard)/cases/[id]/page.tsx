'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
  if (isError || !data?.case) return <div className="p-12 text-center text-red-500">Case not found or failed to load.</div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900">{data.case.title}</h1>
            <Badge variant={data.case.status === 'open' ? 'default' : 'secondary'} className={data.case.status === 'open' ? 'bg-green-100 text-green-800' : ''}>
              {data.case.status.toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-slate-500 font-mono">ID: {data.case._id}</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => router.push(`/cases/${id}/brief`)}>
            <FileText className="mr-2 h-4 w-4" /> Lawyer Brief
          </Button>
          <Button onClick={() => analyzeMutation.mutate()} disabled={analyzeMutation.isPending} className="bg-indigo-600 hover:bg-indigo-700">
            <Activity className="mr-2 h-4 w-4" /> {analyzeMutation.isPending ? 'Analyzing...' : 'Run Analysis'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1 rounded-lg">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="statement">Statement</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Intake Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Relationship Type</p>
                      <p className="mt-1 text-slate-900">{data.inputs?.relationshipType || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Frequency</p>
                      <p className="mt-1 text-slate-900">{data.inputs?.incidentFrequency || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Prior Complaints</p>
                      <p className="mt-1 text-slate-900">{data.inputs?.priorComplaints ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="statement" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Victim Statement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                    {data.statement?.anonymizedText || 'No statement provided.'}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Timeline Events</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.timeline?.length === 0 ? (
                    <p className="text-slate-500">No events recorded yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {data.timeline?.map((ev: any) => (
                        <div key={ev._id} className="flex space-x-4 border-l-2 border-slate-200 pl-4 py-1">
                          <div>
                            <p className="text-sm font-medium text-slate-900">{new Date(ev.date).toLocaleDateString()}</p>
                            <p className="text-sm text-slate-600 mt-1">{ev.description}</p>
                            <Badge className="mt-2 text-xs" variant="outline">{ev.severity}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="mt-4 space-y-4">
              {!prediction ? (
                <div className="text-center py-12 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <Activity className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-slate-900">No Analysis Available</h3>
                  <p className="text-slate-500 mt-1 mb-4">Run the ML analysis to generate insights.</p>
                  <Button onClick={() => analyzeMutation.mutate()} disabled={analyzeMutation.isPending} className="bg-indigo-600 hover:bg-indigo-700">
                    {analyzeMutation.isPending ? 'Analyzing...' : 'Run Analysis Now'}
                  </Button>
                </div>
              ) : (
                <>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle>Risk & Severity Assessment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-6">
                        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg border border-slate-100 flex-1">
                          <p className="text-sm text-slate-500 font-medium mb-1">Severity</p>
                          <Badge variant="destructive" className="text-lg px-4 py-1">
                            {prediction.severity}
                          </Badge>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg border border-slate-100 flex-1">
                          <p className="text-sm text-slate-500 font-medium mb-1">Escalation Score</p>
                          <div className="flex items-baseline space-x-2">
                            <span className="text-3xl font-bold text-slate-900">{prediction.escalationScore}</span>
                            <span className="text-sm text-slate-500">/ 100</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle>Identified Patterns & Triggers</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-2">Abuse Patterns</h4>
                        <div className="flex flex-wrap gap-2">
                          {prediction.patterns.map((p: string, i: number) => (
                            <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">{p}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-2">Risk Triggers</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {prediction.triggers.map((t: string, i: number) => (
                            <li key={i} className="text-sm text-slate-700">{t}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar - Safe Action Navigator */}
        <div className="space-y-4">
          <Card className="border-blue-100 shadow-md">
            <CardHeader className="bg-blue-50 border-b border-blue-100 rounded-t-lg pb-4">
              <CardTitle className="flex items-center text-blue-900">
                <ShieldCheck className="h-5 w-5 mr-2" />
                Safe Action Navigator
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {!recommendation ? (
                <div className="p-6 text-center text-slate-500 text-sm">
                  Run analysis to generate action items.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  <div className="p-4 bg-orange-50">
                    <p className="text-xs font-semibold text-orange-800 uppercase tracking-wider mb-1">Urgency</p>
                    <p className="text-orange-900 font-medium flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" /> {recommendation.urgency}
                    </p>
                  </div>
                  
                  <div className="p-4">
                    <p className="text-sm font-semibold text-slate-800 mb-2">Evidence Checklist</p>
                    <ul className="space-y-2">
                      {recommendation.evidenceChecklist.map((item: string, i: number) => (
                        <li key={i} className="flex items-start text-sm text-slate-600">
                          <ChevronRight className="h-4 w-4 text-slate-400 mr-1 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4">
                    <p className="text-sm font-semibold text-slate-800 mb-2">Follow-up Questions</p>
                    <ul className="space-y-2">
                      {recommendation.followUpQuestions.map((item: string, i: number) => (
                        <li key={i} className="flex items-start text-sm text-slate-600">
                          <ChevronRight className="h-4 w-4 text-slate-400 mr-1 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-b-lg">
                    <p className="text-sm font-semibold text-slate-800 mb-2">Referrals</p>
                    <div className="flex flex-wrap gap-2">
                      {recommendation.referrals.map((item: string, i: number) => (
                        <Badge key={i} variant="outline" className="bg-white">{item}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
