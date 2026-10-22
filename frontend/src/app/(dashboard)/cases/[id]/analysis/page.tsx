'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import {
  ArrowLeft,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Activity,
  ChevronRight,
  RefreshCw,
  FileText,
  Printer,
  Sparkles,
  Quote,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  Layers,
  Scale,
  ArrowRight
} from 'lucide-react';
import { CaseDetailSkeleton } from '@/components/ui/skeletons';
import { OverrideDialog } from '@/components/ui/OverrideDialog';

const OverriddenBadge = ({ doc, field }: { doc: any; field: string }) => {
  const overridden = doc?.overrides?.some((o: any) => o.field === field);
  if (!overridden) return null;
  return (
    <span
      className="ml-2 inline-flex text-[8px] font-bold uppercase tracking-widest text-amber-600 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded shadow-sm"
      title="Human Overridden"
    >
      Edited
    </span>
  );
};

export default function CaseAnalysisPage() {
  const router = useRouter();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [prediction, setPrediction] = useState<any>(null);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [checkedEvidence, setCheckedEvidence] = useState<Record<number, boolean>>({});
  const [copiedQuestion, setCopiedQuestion] = useState<number | null>(null);

  const { data: caseResponse, isLoading: loading, isError } = useQuery({
    queryKey: ['case', id],
    queryFn: async () => {
      const res = await api.get(`/cases/${id}`);
      return res.data;
    }
  });

  useEffect(() => {
    if (caseResponse?.prediction && !prediction) {
      setPrediction(caseResponse.prediction);
      if (caseResponse.prediction.patterns?.length > 0) {
        setSelectedPattern(caseResponse.prediction.patterns[0]);
      }
    }
    if (caseResponse?.recommendation && !recommendation) {
      setRecommendation(caseResponse.recommendation);
    }
  }, [caseResponse, prediction, recommendation]);

  const analyzeMutation = useMutation({
    mutationFn: async () => {
      const predRes = await api.post(`/cases/${id}/analyze`);
      const recRes = await api.post(`/cases/${id}/generate-recommendations`);
      return { prediction: predRes.data, recommendation: recRes.data };
    },
    onSuccess: (resData) => {
      setPrediction(resData.prediction);
      setRecommendation(resData.recommendation);
      if (resData.prediction?.patterns?.length > 0) {
        setSelectedPattern(resData.prediction.patterns[0]);
      }
      queryClient.invalidateQueries({ queryKey: ['case', id] });
      toast.success('AI Analysis completed successfully!');
    },
    onError: (err: any) => {
      console.error(err);
      toast.error('Failed to run AI analysis. Please try again.');
    }
  });

  const overridePredictionMutation = useMutation({
    mutationFn: async ({ field, newValue, reason }: any) => {
      const res = await api.put(`/cases/${id}/prediction/override`, { field, newValue, reason });
      return res.data;
    },
    onSuccess: (data) => {
      setPrediction(data);
      queryClient.invalidateQueries({ queryKey: ['case', id] });
      toast.success('Prediction overridden and logged in audit trail.');
    }
  });

  const overrideRecommendationMutation = useMutation({
    mutationFn: async ({ field, newValue, reason }: any) => {
      const res = await api.put(`/cases/${id}/recommendation/override`, { field, newValue, reason });
      return res.data;
    },
    onSuccess: (data) => {
      setRecommendation(data);
      queryClient.invalidateQueries({ queryKey: ['case', id] });
      toast.success('Recommendation overridden and logged in audit trail.');
    }
  });

  const toggleEvidenceCheck = (idx: number) => {
    setCheckedEvidence(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const copyQuestion = (q: string, idx: number) => {
    navigator.clipboard.writeText(q);
    setCopiedQuestion(idx);
    toast.success('Question copied to clipboard');
    setTimeout(() => setCopiedQuestion(null), 2000);
  };

  const data = caseResponse;

  if (loading) return <div className="p-6"><CaseDetailSkeleton /></div>;
  if (isError || !data?.case) {
    return (
      <div className="p-20 text-center">
        <p className="text-xl text-foreground font-bold tracking-tight uppercase">Case not found.</p>
      </div>
    );
  }

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'Life-Threatening':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/30';
      case 'Severe':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
      default:
        return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
    }
  };

  const getEscalationBarColor = (score: number) => {
    if (score >= 80) return 'bg-rose-500';
    if (score >= 60) return 'bg-orange-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-20">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-card p-6 rounded-3xl border border-border/80 shadow-sm gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push(`/cases/${id}`)}
            className="p-3 rounded-2xl bg-muted/50 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground border border-border/60"
            title="Back to Case Dossier"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-foreground tracking-tight">AI Clinical & Risk Analysis</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="w-3 h-3" /> Real LLM Assessment
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-medium tracking-wide mt-1">
              Case File: <strong className="text-foreground">{data.case.title}</strong> • Ref: <span className="font-mono">{data.case._id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/cases/${id}/brief`)}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold tracking-wider uppercase bg-card hover:bg-muted text-foreground border border-border/80 rounded-xl transition-all shadow-sm"
          >
            <FileText className="w-4 h-4 text-primary" />
            <span>{data.brief ? 'View Legal Brief' : 'Case Brief'}</span>
            {data.brief && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Saved
              </span>
            )}
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold tracking-wider uppercase bg-card hover:bg-muted text-foreground border border-border/80 rounded-xl transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
          <button
            onClick={() => analyzeMutation.mutate()}
            disabled={analyzeMutation.isPending}
            className="flex items-center justify-center gap-2 bg-primary px-6 py-2.5 text-primary-foreground font-bold tracking-widest uppercase text-xs transition-all hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed border border-primary rounded-xl shadow-md"
          >
            <RefreshCw className={`h-4 w-4 ${analyzeMutation.isPending ? 'animate-spin' : ''}`} />
            {analyzeMutation.isPending ? 'Evaluating AI...' : prediction ? 'Refresh Analysis' : 'Run Full Analysis'}
          </button>
        </div>
      </div>

      {/* Main Content: Not Generated vs Generated */}
      {!prediction || !recommendation ? (
        <div className="flex flex-col items-center justify-center py-28 bg-card rounded-3xl border border-border/80 shadow-sm px-6 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 border border-primary/20">
            <Activity className="h-10 w-10 text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">AI Evaluation Ready to Execute</h2>
          <p className="text-muted-foreground mb-8 max-w-lg leading-relaxed text-sm font-medium">
            Generate an in-depth clinical lethality evaluation, Danger Assessment risk score, evidence subpoena checklist, and trauma-informed interview questions grounded in the client narrative.
          </p>
          <button
            onClick={() => analyzeMutation.mutate()}
            disabled={analyzeMutation.isPending}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold tracking-widest uppercase text-xs shadow-xl hover:shadow-primary/25 hover:translate-y-[-2px] transition-all disabled:opacity-60"
          >
            <Sparkles className="w-4 h-4" />
            {analyzeMutation.isPending ? 'Processing AI Models...' : 'Run Comprehensive Analysis'}
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Lethality Alert Banner (If High / Life-Threatening or Requires Human Review) */}
          {prediction.requiresHumanReview && (
            <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-4">
              <ShieldAlert className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-rose-600 dark:text-rose-400 tracking-wider uppercase">
                    Critical Lethality Review Flagged
                  </p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-400 uppercase tracking-widest">
                    Mandatory Attorney Review
                  </span>
                </div>
                <p className="text-xs text-rose-700/80 dark:text-rose-300/80 font-medium mt-1 leading-relaxed">
                  The AI clinical engine detected acute risk markers (e.g. non-fatal strangulation, severe escalation, or threats of homicide/suicide). Campbell Danger Assessment protocols require immediate protective intervention and safety planning.
                </p>
              </div>
            </div>
          )}

          {/* Primary Assessment Hero: Severity & Escalation Meter */}
          <div className="bg-card rounded-3xl border border-border/80 overflow-hidden shadow-sm">
            <div className="p-6 px-8 border-b border-border/60 bg-gradient-to-r from-muted/40 to-transparent flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-primary" /> Danger Assessment & Lethality Metrics
              </span>
              <span className="text-xs font-mono text-muted-foreground">
                Confidence: High (LLM Evaluated)
              </span>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Severity Level Tile */}
              <div className="flex flex-col items-center justify-center p-8 bg-muted/20 rounded-2xl border border-border/60 relative group">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                    Assessed Severity Level
                  </p>
                  <OverriddenBadge doc={prediction} field="severity" />
                </div>
                
                <OverrideDialog
                  title="Severity Level"
                  field="severity"
                  currentValue={prediction.severity}
                  type="select"
                  options={['Moderate', 'Severe', 'Life-Threatening']}
                  onSave={(field, newValue, reason) => overridePredictionMutation.mutate({ field, newValue, reason })}
                  isPending={overridePredictionMutation.isPending}
                >
                  <span className={`inline-flex items-center gap-2 px-6 py-2.5 text-base font-extrabold uppercase tracking-widest rounded-2xl border cursor-pointer hover:scale-105 transition-all shadow-sm ${getSeverityBadgeClass(prediction.severity)}`}>
                    <ShieldAlert className="w-4 h-4" />
                    {prediction.severity}
                  </span>
                </OverrideDialog>
                
                <p className="text-[10px] text-muted-foreground font-medium mt-4 text-center">
                  Click badge above to review or override with audit log
                </p>
              </div>

              {/* Escalation Score Tile */}
              <div className="flex flex-col items-center justify-center p-8 bg-muted/20 rounded-2xl border border-border/60 relative">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                    Escalation Velocity Score
                  </p>
                  <OverriddenBadge doc={prediction} field="escalationScore" />
                </div>

                <OverrideDialog
                  title="Escalation Score"
                  field="escalationScore"
                  currentValue={prediction.escalationScore}
                  type="number"
                  onSave={(field, newValue, reason) => overridePredictionMutation.mutate({ field, newValue, reason })}
                  isPending={overridePredictionMutation.isPending}
                >
                  <div className="flex items-baseline space-x-2 cursor-pointer hover:scale-105 transition-all">
                    <span className="text-6xl font-black text-foreground tracking-tighter">
                      {prediction.escalationScore}
                    </span>
                    <span className="text-xl font-bold text-muted-foreground">/ 100</span>
                  </div>
                </OverrideDialog>

                {/* Visual Bar */}
                <div className="w-full max-w-xs mt-4">
                  <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden border border-border/40">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${getEscalationBarColor(prediction.escalationScore)}`}
                      style={{ width: `${prediction.escalationScore}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-1.5">
                    <span>Low</span>
                    <span className="font-bold text-foreground uppercase">{prediction.escalationLevel || 'Critical'} Level</span>
                    <span>Lethal</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Detailed Narrative Analysis Memorandum */}
          {prediction.detailedAnalysis && (
            <div className="bg-card rounded-3xl border border-border/80 overflow-hidden shadow-sm">
              <div className="p-6 px-8 border-b border-border/60 bg-muted/20 flex items-center justify-between">
                <h3 className="text-xs font-bold tracking-widest uppercase text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Clinical & Evidentiary Narrative Memorandum
                </h3>
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Campbell DA Benchmarks</span>
              </div>
              <div className="p-8">
                <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 font-medium text-sm leading-relaxed space-y-4">
                  {prediction.detailedAnalysis.split('\n\n').map((paragraph: string, i: number) => (
                    <p key={i} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Abuse Typology & Extracted Verbatim Evidence */}
          <div className="bg-card rounded-3xl border border-border/80 overflow-hidden shadow-sm">
            <div className="p-6 px-8 border-b border-border/60 bg-muted/20 flex items-center justify-between">
              <h3 className="text-xs font-bold tracking-widest uppercase text-foreground flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" /> Identified Abuse Patterns & Corroborating Quotes
              </h3>
              <OverriddenBadge doc={prediction} field="patterns" />
            </div>

            <div className="p-8 space-y-6">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-3">
                  Click on an abuse typology to examine the exact verbatim quotes extracted from the narrative:
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {prediction.patterns?.map((pattern: string, idx: number) => {
                    const isSelected = selectedPattern === pattern;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedPattern(pattern)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                            : 'bg-muted/30 hover:bg-muted/60 text-foreground border-border/80'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {pattern}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pattern Evidence Display */}
              {selectedPattern && (
                <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5 space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-primary flex items-center gap-2">
                      <Quote className="w-4 h-4" /> Evidence Supporting: {selectedPattern}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">Verbatim Extract</span>
                  </div>
                  <div className="space-y-2">
                    {prediction.patternEvidence && prediction.patternEvidence[selectedPattern] ? (
                      prediction.patternEvidence[selectedPattern].map((quote: string, i: number) => (
                        <div key={i} className="p-3 bg-background/80 rounded-xl border border-border/60 text-xs font-serif italic text-foreground/90">
                          &ldquo;{quote}&rdquo;
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">Documented in case narrative statement.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Danger Triggers */}
              {prediction.triggers && prediction.triggers.length > 0 && (
                <div className="pt-4 border-t border-border/60 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Explicit Danger Triggers & Citations
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {prediction.triggers.map((trigger: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-3.5 bg-muted/20 rounded-xl border border-border/60 text-xs font-medium text-foreground">
                        <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        <span>{trigger}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Navigator: Urgency, Evidence Checklist, Questions & Referrals */}
          <div className="bg-card rounded-3xl border border-border/80 overflow-hidden shadow-sm">
            <div className="p-6 px-8 border-b border-border/60 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold tracking-widest uppercase text-foreground">
                    Action Navigator & Litigation Roadmap
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Procedural relief and investigation strategy</p>
                </div>
              </div>

              {/* Urgency Badge with Override */}
              <OverrideDialog
                title="Procedural Urgency"
                field="urgency"
                currentValue={recommendation.urgency}
                type="select"
                options={[
                  'Immediate Emergency Injunction (Ex-Parte)',
                  'Expedited Protective Order',
                  'Standard Protective Proceeding & Safety Planning'
                ]}
                onSave={(field, newValue, reason) => overrideRecommendationMutation.mutate({ field, newValue, reason })}
                isPending={overrideRecommendationMutation.isPending}
              >
                <div className="flex items-center gap-2 bg-destructive/10 px-4 py-2 rounded-xl border border-destructive/20 cursor-pointer hover:bg-destructive/15 transition-all">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-[10px] font-extrabold text-destructive uppercase tracking-widest">
                    {recommendation.urgency}
                  </span>
                  <OverriddenBadge doc={recommendation} field="urgency" />
                </div>
              </OverrideDialog>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Evidence Subpoena Checklist */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold tracking-wider uppercase text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" /> Evidence Subpoena Checklist
                  </p>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {Object.values(checkedEvidence).filter(Boolean).length} of {recommendation.evidenceChecklist?.length || 0} gathered
                  </span>
                </div>

                <div className="space-y-2.5">
                  {recommendation.evidenceChecklist?.map((item: string, idx: number) => {
                    const isChecked = !!checkedEvidence[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleEvidenceCheck(idx)}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-foreground line-through opacity-75'
                            : 'bg-muted/20 hover:bg-muted/40 border-border/60 text-foreground'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-border bg-background'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-xs font-medium leading-relaxed">{item}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Strategic Follow-Up Questions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold tracking-wider uppercase text-foreground flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" /> Strategic Attorney Interview Questions
                  </p>
                  <span className="text-[10px] font-mono text-muted-foreground">Trauma-Informed</span>
                </div>

                <div className="space-y-2.5">
                  {recommendation.followUpQuestions?.map((q: string, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-border/60 bg-muted/20 space-y-2 group">
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-xs font-medium text-foreground leading-relaxed flex-1">
                          {q}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyQuestion(q, idx)}
                          className="p-1.5 rounded-lg bg-background hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60 transition-colors shrink-0"
                          title="Copy question"
                        >
                          {copiedQuestion === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Referrals Section */}
            {recommendation.referrals && recommendation.referrals.length > 0 && (
              <div className="p-6 px-8 border-t border-border/60 bg-muted/10 space-y-3">
                <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground text-center">
                  Emergency Resources & Referral Network
                </p>
                <div className="flex flex-wrap gap-2.5 justify-center">
                  {recommendation.referrals.map((ref: string, idx: number) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-card text-foreground border border-border/80 shadow-sm"
                    >
                      <ExternalLink className="w-3 h-3 text-primary" />
                      {ref}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Next Steps: Court Legal Brief Action Banner */}
          <div className="bg-card rounded-2xl border border-border/80 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  {data.brief ? 'Court Legal Brief & Memorandum Saved' : 'Synthesize Formal Court Brief from this Analysis'}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {data.brief
                    ? 'Privileged attorney work-product saved to database. View, edit, or export to PDF.'
                    : 'Transform these clinical lethality indicators, chronology, and statutory citations into an admissible petition memorandum.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push(`/cases/${id}/brief`)}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm shrink-0"
            >
              <FileText className="w-4 h-4" />
              <span>{data.brief ? 'Open Legal Studio' : 'Generate Court Brief'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
