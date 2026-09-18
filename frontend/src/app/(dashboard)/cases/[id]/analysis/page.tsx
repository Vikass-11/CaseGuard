'use client';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import { ArrowLeft, AlertTriangle, ShieldCheck, Activity, ChevronRight, RefreshCw, FileText } from 'lucide-react';
import { CaseDetailSkeleton } from '@/components/ui/skeletons';

export default function CaseAnalysisPage() {
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
      toast.success('AI Analysis completed successfully!');
    },
    onError: () => {
      toast.error('Failed to run analysis. Please try again.');
    }
  });

  const data = caseResponse;

  if (loading) return <div className="p-6"><CaseDetailSkeleton /></div>;
  if (isError || !data?.case) return <div className="p-20 text-center"><p className="text-xl text-foreground font-bold tracking-tight uppercase">Case not found.</p></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-20">
      {/* Header */}
      <div className="flex items-center justify-between bg-card p-6 rounded-2xl border border-border/80 shadow-sm">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => router.push(`/cases/${id}`)}
            className="p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">AI Analysis Report</h1>
            <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase mt-1">
              Case: {data.case.title}
            </p>
          </div>
        </div>
        <div>
          <button 
            onClick={() => analyzeMutation.mutate()} 
            disabled={analyzeMutation.isPending}
            className="flex items-center justify-center bg-primary px-6 py-3 text-primary-foreground font-bold tracking-widest uppercase text-xs transition-all hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed border border-primary rounded-xl shadow-md"
          >
            {analyzeMutation.isPending ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Activity className="mr-2 h-4 w-4" />
            )}
            {analyzeMutation.isPending ? 'Processing AI...' : (prediction ? 'Refresh Analysis' : 'Run Analysis')}
          </button>
        </div>
      </div>

      {!prediction || !recommendation ? (
        <div className="flex flex-col items-center justify-center py-32 bg-card rounded-3xl border border-border shadow-sm">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Activity className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">AI Evaluation Required</h2>
          <p className="text-muted-foreground mb-8 max-w-md text-center leading-relaxed">
            Generate an in-depth AI risk assessment, evidence checklist, and contextual follow-up questions tailored to this specific case.
          </p>
          <button 
            onClick={() => analyzeMutation.mutate()} 
            disabled={analyzeMutation.isPending}
            className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold tracking-widest uppercase text-sm shadow-xl hover:shadow-primary/25 hover:translate-y-[-2px] transition-all"
          >
            {analyzeMutation.isPending ? 'Analyzing Case Narrative...' : 'Run Analysis Now'}
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Main Assessment Panel */}
          <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
            <div className="p-8 border-b border-border bg-gradient-to-r from-muted/50 to-transparent">
              <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Risk & Severity Assessment</h3>
            </div>
            <div className="p-8">
              {prediction.requiresHumanReview && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-3 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-red-800 tracking-tight uppercase">Human Review Required</p>
                    <p className="text-xs text-red-600 font-medium mt-1">This case has complex risk factors that require manual assessment.</p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center justify-center p-8 bg-muted/40 rounded-2xl border border-border">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-4">Severity Level</p>
                  <span className="inline-flex items-center px-6 py-2 text-sm font-bold uppercase tracking-widest bg-[oklch(0.96_0.03_25)] text-[oklch(0.5_0.14_25)] border border-[oklch(0.85_0.06_25)] rounded-full shadow-sm">
                    {prediction.severity}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-8 bg-muted/40 rounded-2xl border border-border">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-4">Escalation Score</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-6xl font-extrabold text-foreground tracking-tighter">{prediction.escalationScore}</span>
                    <span className="text-xl font-bold text-muted-foreground">/ 100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {prediction.detailedAnalysis && (
            <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
              <div className="p-8 border-b border-border">
                <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Detailed Narrative Analysis</h3>
              </div>
              <div className="p-8">
                <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed font-medium text-base">
                  {prediction.detailedAnalysis}
                </p>
              </div>
            </div>
          )}
          
          <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
            <div className="p-8 border-b border-border">
              <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Identified Patterns & Triggers</h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h4 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-6 flex items-center">
                  <Activity className="w-4 h-4 mr-2" /> Abuse Patterns
                </h4>
                <div className="flex flex-wrap gap-3">
                  {prediction.patterns.map((p: string, i: number) => (
                    <span key={i} className="inline-flex items-center px-4 py-2.5 text-xs font-bold uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-200 rounded-xl">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-6 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" /> Risk Triggers
                </h4>
                <ul className="space-y-4">
                  {prediction.triggers.map((t: string, i: number) => (
                    <li key={i} className="flex items-start text-sm text-foreground font-medium p-3 bg-muted/30 rounded-xl border border-border/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 mr-3 shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Centered Action Navigator */}
          <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-md">
            <div className="p-8 border-b border-border bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-between">
              <h3 className="flex items-center text-sm font-extrabold tracking-widest uppercase text-foreground">
                <ShieldCheck className="h-6 w-6 mr-3 text-primary" />
                Action Navigator
              </h3>
              <div className="flex items-center bg-destructive/10 px-4 py-2 rounded-full border border-destructive/20">
                <AlertTriangle className="h-4 w-4 mr-2 text-destructive" />
                <span className="text-[10px] font-bold text-destructive uppercase tracking-widest">{recommendation.urgency}</span>
              </div>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
              
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-6 flex items-center">
                  <FileText className="w-4 h-4 mr-2" /> Evidence Checklist
                </p>
                <ul className="space-y-5">
                  {recommendation.evidenceChecklist.map((item: string, i: number) => (
                    <li key={i} className="flex items-start text-sm text-foreground font-medium leading-relaxed bg-muted/20 p-4 rounded-xl border border-border/50">
                      <ChevronRight className="h-5 w-5 text-primary mr-3 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-6 flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-2" /> Follow-up Questions
                </p>
                <ul className="space-y-5">
                  {recommendation.followUpQuestions.map((item: string, i: number) => (
                    <li key={i} className="flex items-start text-sm text-foreground font-medium leading-relaxed bg-muted/20 p-4 rounded-xl border border-border/50">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 mr-3 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            <div className="p-8 border-t border-border bg-muted/10">
              <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-5 text-center">Recommended Referrals</p>
              <div className="flex flex-wrap gap-3 justify-center">
                {recommendation.referrals.map((item: string, i: number) => (
                  <span key={i} className="inline-flex items-center px-4 py-2 text-xs font-bold uppercase tracking-widest bg-background text-foreground border border-border/80 rounded-full shadow-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
