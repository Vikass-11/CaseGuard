'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
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
  BookOpen
} from 'lucide-react';
import { BriefSkeleton } from '@/components/ui/skeletons';

export default function LawyerBriefPage() {
  const router = useRouter();
  const { id } = useParams();
  const [content, setContent] = useState('');
  const [activeView, setActiveView] = useState<'preview' | 'edit'>('preview');
  const [copied, setCopied] = useState(false);

  // Load case metadata for formal caption
  const { data: caseResponse } = useQuery({
    queryKey: ['case', id],
    queryFn: async () => {
      const res = await api.get(`/cases/${id}`);
      return res.data;
    }
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/cases/${id}/generate-brief`);
      return res.data;
    },
    onSuccess: (data) => {
      setContent(data.content);
      toast.success('Legal brief generated with clinical AI analysis!');
    },
    onError: (err: any) => {
      console.error(err);
      toast.error('Failed to generate brief. Please try again.');
    }
  });

  useEffect(() => {
    if (!content && !generateMutation.isPending && !generateMutation.isSuccess && !generateMutation.isError) {
      generateMutation.mutate();
    }
  }, [id, content, generateMutation.isPending, generateMutation.isSuccess, generateMutation.isError]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await api.put(`/cases/${id}/brief`, { content });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Brief saved successfully!');
    },
    onError: () => {
      toast.error('Failed to save brief.');
    }
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Brief text copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (generateMutation.isPending && !content) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3 text-muted-foreground animate-pulse p-4 bg-card rounded-2xl border border-border/80">
          <Sparkles className="w-5 h-5 text-primary animate-spin" />
          <span className="text-sm font-bold uppercase tracking-wider">
            Synthesizing clinical facts and drafting court memorandum...
          </span>
        </div>
        <BriefSkeleton />
      </div>
    );
  }

  const caseTitle = caseResponse?.case?.title || 'Domestic Violence Injunction Proceeding';
  const caseIdShort = typeof id === 'string' ? id.slice(-6).toUpperCase() : '001';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-20">
      
      {/* Top Action Bar (hidden on print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-5 rounded-2xl border border-border/80 shadow-sm print:hidden">
        <button
          onClick={() => router.push(`/cases/${id}`)}
          className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Case
        </button>

        {/* View Toggle */}
        <div className="flex items-center bg-muted/40 p-1 rounded-xl border border-border/60">
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

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground transition-all disabled:opacity-50"
            title="Regenerate with AI"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${generateMutation.isPending ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">{generateMutation.isPending ? 'Drafting...' : 'Regenerate'}</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Print / PDF</span>
          </button>
          <button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saveMutation.isPending ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Legal Document Container */}
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
                if (block.startsWith('# ')) {
                  return (
                    <h1 key={idx} className="text-center text-lg font-bold uppercase tracking-wider border-b border-border/60 pb-3 mb-6 text-foreground print:text-black">
                      {block.replace('# ', '')}
                    </h1>
                  );
                }
                if (block.startsWith('## ')) {
                  return (
                    <h2 key={idx} className="text-base font-bold uppercase tracking-wide text-foreground print:text-black mt-8 mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary print:bg-black" />
                      {block.replace('## ', '')}
                    </h2>
                  );
                }
                if (block.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="text-sm font-bold text-foreground print:text-black mt-4 mb-2">
                      {block.replace('### ', '')}
                    </h3>
                  );
                }
                if (block.startsWith('• ') || block.startsWith('- ') || block.startsWith('1. ')) {
                  return (
                    <ul key={idx} className="space-y-2 pl-6 list-disc text-foreground/90 print:text-black">
                      {block.split('\n').map((item, itemIdx) => (
                        <li key={itemIdx} className="leading-relaxed">
                          {item.replace(/^[•\-\d\.]\s*/, '')}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={idx} className="text-justify leading-relaxed indent-6">
                    {block}
                  </p>
                );
              })}

              {/* Formal Signature Block */}
              <div className="pt-12 mt-12 border-t border-border/60 print:border-black grid grid-cols-2 gap-8 text-xs font-serif">
                <div>
                  <p>Dated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p className="mt-4 italic">CaseGuard Intelligence Dossier Ref: {id}</p>
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
                <span>{content.split(/\s+/).filter(Boolean).length} words</span>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={28}
                className="w-full bg-background border border-border/80 rounded-2xl p-6 font-mono text-xs leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y shadow-inner"
                placeholder="Edit legal memorandum text directly..."
              />
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
