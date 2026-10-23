'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import {
  Printer,
  Save,
  ArrowLeft,
  Sparkles,
  Copy,
  Check,
  FileText,
  Eye,
  Edit3,
  Scale,
  RefreshCw,
  BookOpen,
  ShieldCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  Bookmark,
  FileDown
} from 'lucide-react';
import { BriefSkeleton } from '@/components/ui/skeletons';

export default function LawyerBriefPage() {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [content, setContent] = useState('');
  const [activeView, setActiveView] = useState<'preview' | 'edit'>('preview');
  const [copied, setCopied] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  // Load case metadata and existing saved brief
  const { data: caseResponse, isLoading: isLoadingCase, isError: isCaseError } = useQuery({
    queryKey: ['case', id],
    queryFn: async () => {
      const res = await api.get(`/cases/${id}`);
      return res.data;
    }
  });

  const existingBrief = caseResponse?.brief;

  // Once caseResponse loads, if a saved brief already exists, populate content
  useEffect(() => {
    if (existingBrief?.content && !hasUnsavedChanges) {
      setContent(existingBrief.content);
      const savedDate = existingBrief.updatedAt || existingBrief.createdAt;
      if (savedDate) {
        setLastSavedAt(new Date(savedDate));
      }
    }
  }, [existingBrief, hasUnsavedChanges]);

  // Generate brief mutation (generates and automatically saves to DB)
  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/cases/${id}/generate-brief`);
      return res.data;
    },
    onSuccess: (data) => {
      setContent(data.content);
      setHasUnsavedChanges(false);
      setLastSavedAt(new Date());
      // Update case query cache immediately so brief is persistent across all pages
      queryClient.setQueryData(['case', id], (old: any) => ({
        ...old,
        brief: data
      }));
      toast.success('Legal brief generated and automatically saved to case file!');
    },
    onError: (err: any) => {
      console.error('Failed to generate brief:', err);
      toast.error('Failed to generate brief. Please check case details and try again.');
    }
  });

  // Save manual edits mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await api.put(`/cases/${id}/brief`, { content });
      return res.data;
    },
    onSuccess: (data) => {
      setHasUnsavedChanges(false);
      setLastSavedAt(new Date());
      queryClient.setQueryData(['case', id], (old: any) => ({
        ...old,
        brief: data
      }));
      toast.success('Brief saved to database successfully!');
    },
    onError: (err: any) => {
      console.error('Failed to save brief:', err);
      toast.error('Failed to save brief changes.');
    }
  });

  // If user arrives with auto-generation requested (e.g. "?generate=true") and no brief exists yet
  useEffect(() => {
    const autoGen = searchParams?.get('generate') === 'true';
    if (
      autoGen &&
      !isLoadingCase &&
      caseResponse &&
      !existingBrief &&
      !content &&
      !generateMutation.isPending &&
      !generateMutation.isSuccess &&
      !generateMutation.isError
    ) {
      generateMutation.mutate();
    }
  }, [searchParams, isLoadingCase, caseResponse, existingBrief, content, generateMutation]);

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Brief copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadWordDoc = () => {
    if (!content) return;
    const wordContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Legal Memorandum - ${caseTitle}</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; color: #000; margin: 1in; }
          h1 { font-size: 16pt; font-weight: bold; text-align: center; text-transform: uppercase; margin-bottom: 6pt; }
          h2 { font-size: 13pt; font-weight: bold; text-transform: uppercase; margin-top: 18pt; margin-bottom: 6pt; border-bottom: 1.5pt solid #000; padding-bottom: 3pt; }
          h3 { font-size: 12pt; font-weight: bold; margin-top: 12pt; margin-bottom: 4pt; }
          p { margin-bottom: 10pt; text-align: justify; text-indent: 0.5in; }
          ul { margin-top: 4pt; margin-bottom: 10pt; }
          li { margin-bottom: 4pt; }
          .caption-box { border: 2pt solid #000; padding: 12pt; margin-bottom: 20pt; text-align: center; }
        </style>
      </head>
      <body>
        <div class="caption-box">
          <p style="font-weight: bold; text-indent: 0; margin: 0; font-size: 11pt;">IN THE DISTRICT COURT OF THE JUDICIAL DISTRICT</p>
          <p style="font-weight: bold; text-indent: 0; margin: 0; font-size: 11pt;">FAMILY LAW & PROTECTIVE RELIEF DIVISION</p>
          <br>
          <p style="text-indent: 0; margin: 0;"><strong>IN RE: ${caseTitle.toUpperCase()}</strong>, Petitioner</p>
          <p style="text-indent: 0; margin: 0;">v. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>CASE NO: CG-${caseIdShort}</strong></p>
          <p style="text-indent: 0; margin: 0;"><strong>ADVERSE PARTY</strong>, Respondent.</p>
        </div>
        ${content.split('\\n\\n').map(block => {
          const t = block.trim();
          if (t.startsWith('# ')) return `<h1>${t.replace('# ', '')}</h1>`;
          if (t.startsWith('## ')) return `<h2>${t.replace('## ', '')}</h2>`;
          if (t.startsWith('### ')) return `<h3>${t.replace('### ', '')}</h3>`;
          if (t.startsWith('• ') || t.startsWith('- ')) {
            return `<ul>${t.split('\\n').map(l => `<li>${l.replace(/^[•\\-]\\s*/, '')}</li>`).join('')}</ul>`;
          }
          return `<p>${t}</p>`;
        }).join('')}
      </body>
      </html>
    `;
    const blob = new Blob([wordContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Legal_Memorandum_${caseTitle.replace(/[^a-zA-Z0-9]/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Editable Legal Memorandum (.doc) downloaded successfully!');
  };

  const handleContentChange = (newVal: string) => {
    setContent(newVal);
    setHasUnsavedChanges(true);
  };

  const caseTitle = caseResponse?.case?.title || 'Domestic Violence Injunction Proceeding';
  const caseIdShort = typeof id === 'string' ? id.slice(-6).toUpperCase() : '001';
  const researchCitations: string[] = existingBrief?.researchCitations || [];

  const wordCount = useMemo(() => {
    return content ? content.split(/\s+/).filter(Boolean).length : 0;
  }, [content]);

  // Loading skeleton while initial case details are loading
  if (isLoadingCase) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <BriefSkeleton />
      </div>
    );
  }

  // Active generating state
  if (generateMutation.isPending && !content) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3 p-5 bg-card rounded-2xl border border-primary/30 shadow-sm animate-pulse">
          <Sparkles className="w-5 h-5 text-primary animate-spin" />
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-foreground">
              Synthesizing Clinical Facts & Drafting Legal Brief...
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Analyzing victim narrative, timeline events, clinical danger assessment, and statutory benchmarks.
            </p>
          </div>
        </div>
        <BriefSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500 pb-20">
      
      {/* Top Action Bar (hidden on print) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card p-5 rounded-2xl border border-border/80 shadow-sm print:hidden">
        
        {/* Left: Back and Status Pill */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => router.push(`/cases/${id}`)}
            className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Case Overview</span>
          </button>

          <div className="h-4 w-px bg-border/80 hidden sm:block" />

          {/* Real-time Save & DB Status Badge */}
          {generateMutation.isPending ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Generating & Saving...</span>
            </div>
          ) : saveMutation.isPending ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 animate-pulse">
              <Save className="w-3.5 h-3.5 animate-spin" />
              <span>Saving Changes...</span>
            </div>
          ) : hasUnsavedChanges ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Unsaved Changes</span>
            </div>
          ) : lastSavedAt || existingBrief ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>
                Saved in Database
                {lastSavedAt ? ` • ${lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground border border-border/80">
              <Clock className="w-3.5 h-3.5" />
              <span>Not Yet Generated</span>
            </div>
          )}
        </div>

        {/* Center: View Toggle (Court Document vs Markdown Editor) */}
        {content && (
          <div className="flex items-center bg-muted/40 p-1 rounded-xl border border-border/60 self-start lg:self-center">
            <button
              type="button"
              onClick={() => setActiveView('preview')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                activeView === 'preview'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Court Document View
            </button>
            <button
              type="button"
              onClick={() => setActiveView('edit')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                activeView === 'edit'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" /> Markdown Editor
            </button>
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {content ? (
            <>
              <button
                type="button"
                onClick={() => generateMutation.mutate()}
                disabled={generateMutation.isPending}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground transition-all disabled:opacity-50 shadow-sm"
                title="Regenerate with AI"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${generateMutation.isPending ? 'animate-spin' : ''}`} />
                <span>{generateMutation.isPending ? 'Regenerating...' : 'Regenerate'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground transition-all shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={downloadWordDoc}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-[#2D4354] hover:bg-[#20212B] text-white transition-all shadow-sm"
                title="Download editable legal brief in Word format"
              >
                <FileDown className="w-3.5 h-3.5 text-[#FED7A5]" />
                <span>Download Word (.doc)</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground transition-all shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>

              <button
                type="button"
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending || !hasUnsavedChanges}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm ${
                  hasUnsavedChanges
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-muted text-muted-foreground cursor-not-allowed border border-border/80'
                }`}
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saveMutation.isPending ? 'Saving...' : hasUnsavedChanges ? 'Save Changes' : 'Saved'}</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${generateMutation.isPending ? 'animate-spin' : ''}`} />
              <span>{generateMutation.isPending ? 'Synthesizing...' : 'Generate Legal Brief'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Empty State: If no brief has been generated yet */}
      {!content && !generateMutation.isPending && (
        <div className="bg-card rounded-3xl border border-border/80 p-12 text-center shadow-sm space-y-6 max-w-2xl mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
            <Scale className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-foreground tracking-tight">
              Court-Ready Legal Memorandum & Case Brief
            </h2>
            <p className="text-xs text-muted-foreground font-medium max-w-md mx-auto mt-2 leading-relaxed">
              Synthesize the victim narrative, chronological timeline incidents, clinical lethality indicators, and relevant legal research benchmarks into a formal petition memorandum.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 text-left text-xs space-y-2 max-w-md mx-auto">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Included in Brief Synthesis:</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-[11px]">
              <li>Factual Chronology & Escalation Milestones</li>
              <li>Clinical Abuse Typology & Lethality Assessment</li>
              <li>Danger Assessment & Strangulation Benchmarks</li>
              <li>Pre-Hearing Evidentiary Investigation Checklist</li>
              <li>Formal Prayer for Injunctive Court Relief</li>
            </ul>
          </div>

          <div>
            <button
              type="button"
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Court Brief with Clinical AI</span>
            </button>
          </div>
        </div>
      )}

      {/* Legal Document Container */}
      {content && (
        <div className="bg-card rounded-3xl border border-border/80 overflow-hidden shadow-sm print:border-none print:shadow-none print:bg-white print:text-black">
          
          {/* Document Header Caption */}
          <div className="p-8 sm:p-12 border-b border-border/60 bg-muted/10 print:bg-white print:border-b-2 print:border-black text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase text-muted-foreground print:text-black">
              <Scale className="w-4 h-4 text-primary print:text-black" />
              <span>Confidential Attorney Work Product • Privileged Legal Document</span>
            </div>
            
            {/* Formal Legal Caption Box */}
            <div className="border border-border/80 print:border-black p-6 rounded-2xl bg-card print:bg-white max-w-2xl mx-auto text-left font-serif text-xs leading-relaxed space-y-3">
              <div className="text-center font-bold tracking-wider text-foreground print:text-black text-sm uppercase">
                IN THE DISTRICT COURT OF THE JUDICIAL DISTRICT<br />
                FAMILY LAW & PROTECTIVE RELIEF DIVISION
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-b border-border/60 print:border-black py-4">
                <div>
                  <p className="font-bold text-foreground print:text-black">IN RE: {caseTitle.toUpperCase()}</p>
                  <p className="text-muted-foreground print:text-black italic mt-1">Petitioner / Protected Party,</p>
                  <p className="mt-2 font-mono text-[10px]">v.</p>
                  <p className="font-bold text-foreground print:text-black mt-2">ADVERSE PARTY / RESPONDENT.</p>
                </div>
                <div className="border-l border-border/60 print:border-black pl-4 flex flex-col justify-center">
                  <p className="font-mono font-bold text-foreground print:text-black">CASE NO: CG-{caseIdShort}</p>
                  <p className="font-bold uppercase tracking-wider mt-2 text-foreground print:text-black">
                    MEMORANDUM OF POINTS AND AUTHORITIES IN SUPPORT OF PETITION FOR EX-PARTE RESTRAINING ORDER
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Document Body: Preview vs Editor */}
          <div className="p-8 sm:p-14">
            {activeView === 'preview' ? (
              <div className="font-serif text-sm leading-relaxed text-foreground/90 print:text-black space-y-6 max-w-none">
                {content.split('\n\n').map((block, idx) => {
                  const trimmed = block.trim();
                  if (!trimmed) return null;

                  if (trimmed.startsWith('# ')) {
                    return (
                      <h1 key={idx} className="text-center text-lg font-bold uppercase tracking-wider border-b border-border/60 pb-3 mb-6 text-foreground print:text-black">
                        {trimmed.replace('# ', '')}
                      </h1>
                    );
                  }
                  if (trimmed.startsWith('## ')) {
                    return (
                      <h2 key={idx} className="text-base font-bold uppercase tracking-wide text-foreground print:text-black mt-8 mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary print:bg-black" />
                        {trimmed.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (trimmed.startsWith('### ')) {
                    return (
                      <h3 key={idx} className="text-sm font-bold text-foreground print:text-black mt-4 mb-2">
                        {trimmed.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) {
                    return (
                      <ul key={idx} className="space-y-2 pl-6 list-disc text-foreground/90 print:text-black">
                        {trimmed.split('\n').map((item, itemIdx) => (
                          <li key={itemIdx} className="leading-relaxed">
                            {item.replace(/^[•\-\d\.]\s*/, '')}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={idx} className="text-justify leading-relaxed indent-6">
                      {trimmed}
                    </p>
                  );
                })}

                {/* Research Literature Grounding Callout (if available) */}
                {researchCitations.length > 0 && (
                  <div className="mt-10 p-6 rounded-2xl bg-muted/20 border border-border/80 print:border-black space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary print:text-black">
                      <BookOpen className="w-4 h-4" />
                      <span>Clinical Research Literature & Evidence Benchmarks</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-muted-foreground print:text-black font-sans">
                      {researchCitations.map((cite, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-2">
                          <span className="font-mono text-primary print:text-black">•</span>
                          <span>{cite}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Formal Signature Block */}
                <div className="pt-12 mt-12 border-t border-border/60 print:border-black grid grid-cols-2 gap-8 text-xs font-serif">
                  <div>
                    <p>Dated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="mt-4 italic">CaseGuard Intelligence Dossier Ref: {id}</p>
                    {lastSavedAt && (
                      <p className="text-[10px] text-muted-foreground print:hidden mt-1">
                        Persisted in MongoDB: {lastSavedAt.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-bold underline">RESPECTFULLY SUBMITTED,</p>
                    <div className="h-10" />
                    <p className="font-bold text-foreground print:text-black">COUNSEL FOR PETITIONER</p>
                    <p className="text-muted-foreground print:text-black">State Bar Certified Domestic Violence Legal Advocate</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                  <span>Markdown Mode • Supports standard headers (#, ##), bullet points, and citations</span>
                  <span>{wordCount} words</span>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  rows={28}
                  className="w-full bg-background border border-border/80 rounded-2xl p-6 font-mono text-xs leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y shadow-inner"
                  placeholder="Edit legal memorandum text directly..."
                />
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
