'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  FileText,
  Upload,
  File,
  Plus,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Printer,
  ExternalLink,
  Scale,
  Sparkles,
  ArrowRight,
  Clock,
  BookOpen
} from 'lucide-react';
import { CaseDetailSkeleton } from '@/components/ui/skeletons';
import LegalMarkdownRenderer from '@/components/LegalMarkdownRenderer';

export default function CaseDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [copiedBrief, setCopiedBrief] = useState(false);

  // Timeline addition state
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [severityLevel, setSeverityLevel] = useState('Moderate');
  const [eventDescription, setEventDescription] = useState('');
  const [addingEvent, setAddingEvent] = useState(false);

  const { data: caseResponse, isLoading: loading, isError } = useQuery({
    queryKey: ['case', id],
    queryFn: async () => {
      const res = await api.get(`/cases/${id}`);
      return res.data;
    }
  });

  const data = caseResponse;

  if (loading) return <div className="p-6"><CaseDetailSkeleton /></div>;
  if (isError || !data?.case) return (
    <div className="p-20 text-center">
      <p className="text-xl text-foreground font-bold tracking-tight uppercase">Case not found or failed to load.</p>
    </div>
  );

  const hasBrief = Boolean(data.brief?.content);
  const briefSavedDate = data.brief?.updatedAt || data.brief?.createdAt;

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.post(`/cases/${id}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFile(null);
      queryClient.invalidateQueries({ queryKey: ['case', id] });
      toast.success('Document uploaded and queued for vector search!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload document.');
    } finally {
      setUploading(false);
    }
  };

  const handleAddTimelineEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventDescription.trim()) return;
    setAddingEvent(true);
    try {
      await api.post(`/cases/${id}/timeline`, {
        eventDate: new Date(eventDate),
        severityLevel,
        description: eventDescription.trim()
      });
      setEventDescription('');
      setShowAddEvent(false);
      queryClient.invalidateQueries({ queryKey: ['case', id] });
      toast.success('Timeline incident added successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add timeline incident.');
    } finally {
      setAddingEvent(false);
    }
  };

  const handleCopyBrief = () => {
    if (!data.brief?.content) return;
    navigator.clipboard.writeText(data.brief.content);
    setCopiedBrief(true);
    toast.success('Brief text copied to clipboard!');
    setTimeout(() => setCopiedBrief(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      {/* Case Header Card */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end bg-card p-8 rounded-2xl border border-border/80 shadow-sm gap-6">
        <div>
          <div className="flex items-center space-x-4 mb-3">
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{data.case.title}</h1>
            <span className={`inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest border rounded-md shadow-sm ${
              data.case.status === 'open' ? 'border-primary/20 bg-primary/5 text-primary' : 'border-border bg-muted/20 text-muted-foreground'
            }`}>
              {data.case.status}
            </span>
          </div>
          <p className="text-sm text-muted-foreground font-medium tracking-wide flex items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest mr-2">Ref ID:</span> 
            <span className="font-mono bg-muted/50 px-2 py-1 rounded text-xs">{data.case._id}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => router.push(`/cases/${id}/brief`)}
            className="flex items-center justify-center px-5 py-2.5 text-xs font-bold tracking-wider uppercase text-foreground bg-card hover:bg-muted border border-border/80 hover:border-primary/40 rounded-xl transition-all duration-300 shadow-sm group"
          >
            <FileText className="mr-2 h-4 w-4 text-primary" />
            <span>{hasBrief ? 'View Legal Brief' : 'Generate Brief'}</span>
            {hasBrief ? (
              <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Check className="w-2.5 h-2.5" /> Saved
              </span>
            ) : (
              <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="w-2.5 h-2.5" /> AI
              </span>
            )}
          </button>

          <button
            onClick={() => router.push(`/cases/${id}/analysis`)}
            className="flex items-center justify-center bg-primary px-5 py-2.5 text-primary-foreground font-bold tracking-wider uppercase text-xs transition-all hover:bg-primary/90 border border-primary rounded-xl shadow-md"
          >
            <Activity className="mr-2 h-4 w-4" /> Go to AI Analysis
          </button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="w-full">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-transparent border-b border-border/60 w-full justify-start h-auto p-0 space-x-4 sm:space-x-8 rounded-none mb-6 overflow-x-auto flex-nowrap scrollbar-none">
            <TabsTrigger value="overview" className="shrink-0 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-2 py-4 font-bold tracking-wide uppercase text-xs text-muted-foreground">
              Overview
            </TabsTrigger>
            <TabsTrigger value="brief" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-2 py-4 font-bold tracking-wide uppercase text-xs text-muted-foreground flex items-center gap-2">
              <span>Legal Brief</span>
              {hasBrief ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
              )}
            </TabsTrigger>
            <TabsTrigger value="statement" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-2 py-4 font-bold tracking-wide uppercase text-xs text-muted-foreground">
              Statement
            </TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-2 py-4 font-bold tracking-wide uppercase text-xs text-muted-foreground">
              Timeline ({data.timeline?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-2 py-4 font-bold tracking-wide uppercase text-xs text-muted-foreground">
              Documents ({data.documents?.length || 0})
            </TabsTrigger>
          </TabsList>
          
          {/* TAB 1: OVERVIEW */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Intake Details */}
              <div className="md:col-span-2 bg-card rounded-2xl border border-border/80 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-border/80 bg-muted/20 flex items-center justify-between">
                  <h3 className="text-xs font-bold tracking-widest uppercase text-foreground">Intake Facts & Background</h3>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Case Intake Sheet</span>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Relationship Type</p>
                      <p className="mt-1.5 text-foreground font-semibold text-base">{data.inputs?.relationshipType || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Incident Frequency</p>
                      <p className="mt-1.5 text-foreground font-semibold text-base">{data.inputs?.incidentFrequency || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Prior Police Calls</p>
                      <p className="mt-1.5 text-foreground font-semibold text-base">{data.inputs?.priorComplaints ? 'Yes • Documented' : 'No prior calls'}</p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border/60">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">Statement Snapshot</p>
                    <p className="text-xs text-foreground/80 leading-relaxed line-clamp-3 font-serif">
                      "{data.statement?.anonymizedText || 'No narrative provided.'}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Legal Brief & Clinical Analysis Quick Card */}
              <div className="bg-card rounded-2xl border border-border/80 overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="p-6 border-b border-border/80 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold tracking-widest uppercase text-foreground">Court Legal Brief</h3>
                    <Scale className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <div className="p-6 space-y-4 flex-1">
                  {hasBrief ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Generated & Saved in Database</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {data.brief.summary || 'Clinical legal memorandum prepared for ex-parte protective order petition.'}
                      </p>
                      {briefSavedDate && (
                        <p className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Saved: {new Date(briefSavedDate).toLocaleDateString()}</span>
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        No court brief generated yet. CaseGuard synthesizes clinical danger assessment markers, factual timelines, and statutory authority.
                      </p>
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                        <Sparkles className="w-3 h-3" /> Ready to Synthesize
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6 pt-0">
                  <button
                    onClick={() => router.push(`/cases/${id}/brief`)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-card border border-border hover:bg-muted text-foreground transition-all shadow-sm"
                  >
                    <span>{hasBrief ? 'Open Legal Studio' : 'Generate Brief Now'}</span>
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </button>
                </div>
              </div>

            </div>
          </TabsContent>

          {/* TAB 2: LEGAL BRIEF TAB */}
          <TabsContent value="brief" className="mt-6">
            <div className="bg-card rounded-3xl border border-border/80 overflow-hidden shadow-sm">
              <div className="p-8 border-b border-border/80 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-extrabold tracking-tight text-foreground flex items-center gap-2">
                      <Scale className="w-5 h-5 text-primary" />
                      Privileged Legal Case Brief & Memorandum
                    </h3>
                    {hasBrief ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Saved in Database
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground border border-border/80">
                        Draft Required
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Formal court memorandum ready for protective order or restraining order proceedings
                  </p>
                </div>

                {hasBrief && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyBrief}
                      className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground transition-all shadow-sm"
                    >
                      {copiedBrief ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedBrief ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={() => router.push(`/cases/${id}/brief`)}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Studio & Print</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="p-8">
                {hasBrief ? (
                  <div className="space-y-6">
                    {/* Metadata Pill Banner */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-muted/30 border border-border/60 text-xs">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">Assessed Risk Level</span>
                        <span className="font-bold text-foreground mt-0.5 block">{data.brief.riskLevel || 'Severe Lethality Risk'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">Abuse Typology</span>
                        <span className="font-bold text-foreground mt-0.5 block truncate">{data.brief.abuseIndicators || 'Coercive Control, Battery'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">Database Record</span>
                        <span className="font-mono text-muted-foreground text-[11px] mt-0.5 block">
                          {briefSavedDate ? new Date(briefSavedDate).toLocaleString() : 'Persisted'}
                        </span>
                      </div>
                    </div>

                    {/* Legal Document Render */}
                    <div className="p-6 sm:p-8 rounded-2xl border border-border/80 bg-background max-h-[550px] overflow-y-auto shadow-inner">
                      <LegalMarkdownRenderer content={data.brief.content} />
                      <div className="text-center pt-6 border-t border-border/60 mt-6">
                        <button
                          onClick={() => router.push(`/cases/${id}/brief`)}
                          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary hover:underline group"
                        >
                          <span>Open Full Legal Brief Studio & Print PDF</span>
                          <span className="transition-transform group-hover:translate-x-1">→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 max-w-md mx-auto space-y-4">
                    <Scale className="w-12 h-12 text-primary/40 mx-auto" />
                    <div>
                      <h4 className="text-base font-bold text-foreground">No Legal Brief Saved Yet</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Click below to generate a formal court-admissible legal memorandum synthesizing clinical danger metrics, timeline, and statutory arguments.
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={() => router.push(`/cases/${id}/brief?generate=true`)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold tracking-wider uppercase text-xs rounded-xl shadow-md hover:bg-primary/90 transition-all"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Generate Court Brief with AI</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* TAB 3: STATEMENT */}
          <TabsContent value="statement" className="mt-6">
            <div className="bg-card rounded-2xl border border-border/80 overflow-hidden shadow-sm">
              <div className="p-8 border-b border-border/80 bg-muted/20">
                <h3 className="text-xs font-bold tracking-widest uppercase text-foreground">Victim Statement (PII Redacted)</h3>
              </div>
              <div className="p-8">
                <p className="whitespace-pre-wrap text-foreground leading-relaxed font-serif text-sm">
                  {data.statement?.anonymizedText || 'No statement provided.'}
                </p>
              </div>
            </div>
          </TabsContent>

          {/* TAB 4: TIMELINE */}
          <TabsContent value="timeline" className="mt-6">
            <div className="bg-card rounded-3xl border border-border overflow-hidden">
              <div className="p-8 border-b border-border flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-bold tracking-widest uppercase text-foreground">Timeline Incidents</h3>
                  <p className="text-xs text-muted-foreground mt-1">Chronological record of escalating abuse events and interventions</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddEvent(!showAddEvent)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground font-bold tracking-wider uppercase text-xs rounded-xl shadow-sm hover:bg-primary/90 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  {showAddEvent ? 'Close Form' : 'Add Incident'}
                </button>
              </div>

              {/* Add Event Inline Form */}
              {showAddEvent && (
                <form onSubmit={handleAddTimelineEvent} className="p-8 border-b border-border/80 bg-muted/10 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Record New Incident to Timeline
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">Date of Incident</label>
                      <input
                        type="date"
                        required
                        value={eventDate}
                        onChange={e => setEventDate(e.target.value)}
                        className="w-full bg-background border border-border/80 px-4 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">Severity Classification</label>
                      <select
                        value={severityLevel}
                        onChange={e => setSeverityLevel(e.target.value)}
                        className="w-full bg-background border border-border/80 px-4 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="Low">Low - Verbal / Minor Control</option>
                        <option value="Moderate">Moderate - Escalating Intimidation / Threats</option>
                        <option value="Severe">Severe - Physical Battery / Weapon Threats</option>
                        <option value="Critical">Critical - Non-Fatal Strangulation / Life-Threatening</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        type="submit"
                        disabled={addingEvent}
                        className="w-full bg-primary text-primary-foreground font-bold uppercase tracking-wider text-xs py-2.5 px-4 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50"
                      >
                        {addingEvent ? 'Saving Incident...' : 'Save to Chronology'}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">Factual Description of Incident</label>
                    <textarea
                      required
                      rows={2}
                      value={eventDescription}
                      onChange={e => setEventDescription(e.target.value)}
                      placeholder="e.g. Perpetrator restricted airway and threatened harm if police were notified..."
                      className="w-full bg-background border border-border/80 px-4 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
                    />
                  </div>
                </form>
              )}

              <div className="p-8">
                {data.timeline?.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calendar className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
                    <p className="text-sm font-semibold">No timeline incidents recorded yet.</p>
                    <p className="text-xs text-muted-foreground mt-1">Use the "Add Incident" button above to document factual chronology.</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {data.timeline?.map((ev: any, idx: number) => {
                      let colorClass = 'bg-muted text-muted-foreground border-border/80';
                      let dotClass = 'bg-primary ring-primary/20';
                      const sev = (ev.severityLevel || ev.severity || '').toLowerCase();
                      const rawDate = ev.eventDate || ev.date;
                      const formattedDate = rawDate
                        ? new Date(rawDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
                        : 'Date Unrecorded';
                      
                      if (sev.includes('low')) {
                        colorClass = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
                        dotClass = 'bg-emerald-500 ring-emerald-500/20';
                      } else if (sev.includes('medium') || sev.includes('moderate')) {
                        colorClass = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
                        dotClass = 'bg-amber-500 ring-amber-500/20';
                      } else if (sev.includes('high') || sev.includes('severe')) {
                        colorClass = 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30';
                        dotClass = 'bg-orange-500 ring-orange-500/20';
                      } else if (sev.includes('critical') || sev.includes('life-threatening')) {
                        colorClass = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 font-bold';
                        dotClass = 'bg-rose-500 ring-rose-500/20 animate-pulse';
                      }

                      return (
                        <div key={ev._id || idx} className="relative pl-8 before:absolute before:left-0 before:top-4 before:bottom-[-2rem] last:before:bottom-0 before:w-px before:bg-border">
                          <div className={`absolute left-[-5px] top-1.5 h-3 w-3 rounded-full ring-4 ${dotClass}`} />
                          <div className="bg-card border border-border/60 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground">{formattedDate}</p>
                              <span className={`inline-block px-3 py-1 text-[10px] uppercase tracking-widest border rounded-md shadow-sm ${colorClass}`}>
                                {ev.severityLevel || ev.severity || 'Unrated'}
                              </span>
                            </div>
                            <p className="text-sm text-foreground font-medium leading-relaxed group-hover:text-primary transition-colors">{ev.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* TAB 5: DOCUMENTS */}
          <TabsContent value="documents" className="mt-6">
            <div className="bg-card rounded-3xl border border-border overflow-hidden">
              <div className="p-8 border-b border-border flex justify-between items-center">
                <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Case Documents & Evidence</h3>
              </div>
              <div className="p-8">
                {/* Upload Form */}
                <form onSubmit={handleFileUpload} className="mb-10 p-6 bg-muted/20 border border-border/80 rounded-2xl">
                  <h4 className="text-sm font-bold mb-4 uppercase tracking-widest">Upload New Document</h4>
                  <div className="flex items-center space-x-4">
                    <input 
                      type="file" 
                      accept=".txt,.md"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                    />
                    <button 
                      type="submit" 
                      disabled={!file || uploading}
                      className="px-6 py-2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest rounded-full disabled:opacity-50 flex items-center shadow-md transition-all hover:bg-primary/90"
                    >
                      {uploading ? 'Uploading...' : <><Upload className="w-4 h-4 mr-2" /> Upload & Parse</>}
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-3 uppercase tracking-wide">Supports .txt and .md. Document will be automatically chunked and embedded for AI analysis.</p>
                </form>

                {/* Document List */}
                {data.documents?.length === 0 ? (
                  <p className="text-muted-foreground font-medium text-sm">No documents uploaded yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.documents?.map((doc: any) => (
                      <div key={doc._id} className="flex items-start p-4 border border-border/60 rounded-2xl bg-card shadow-sm hover:shadow-md transition-all">
                        <div className="bg-primary/10 p-3 rounded-xl mr-4 text-primary">
                          <File className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-sm">{doc.fileName}</p>
                          <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
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
