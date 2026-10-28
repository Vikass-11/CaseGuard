'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import {
  ArrowUpRight,
  ShieldAlert,
  ShieldCheck,
  Mic,
  FileText,
  UserCheck,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { AudioRecorder } from '@/components/ui/audio-recorder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function NewCasePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    relationshipType: 'Intimate Partner / Spouse',
    incidentFrequency: 'Weekly',
    priorComplaints: false,
    statement: ''
  });

  const createCaseMutation = useMutation({
    mutationFn: async () => {
      if (!formData.title.trim()) {
        throw new Error('Case title or reference name is required.');
      }
      if (!formData.statement.trim()) {
        throw new Error('A initial victim statement or incident summary is required.');
      }

      // 1. Create Case
      const caseRes = await api.post('/cases', { title: formData.title.trim() });
      const caseId = caseRes.data._id;

      // 2. Add Intake Details
      await api.put(`/cases/${caseId}/input`, {
        relationshipType: formData.relationshipType,
        incidentFrequency: formData.incidentFrequency,
        priorComplaints: formData.priorComplaints,
        incidentTypes: ['General']
      });

      // 3. Add Statement (sent as originalText to undergo PII redaction)
      await api.put(`/cases/${caseId}/statement`, {
        originalText: formData.statement.trim()
      });

      return caseId;
    },
    onSuccess: (caseId) => {
      toast.success('Case portfolio initialized and PII redaction completed.');
      router.push(`/cases/${caseId}`);
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to create case portfolio. Please try again.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCaseMutation.mutate();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans pb-16">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-8 rounded-3xl border border-border/80 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="h-14 w-14 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <ShieldAlert className="h-7 w-7" strokeWidth={1.75} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#9E6752]">INTAKE PROTOCOL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              New Case Intake & Statement Logging
            </h1>
            <p className="text-muted-foreground text-xs font-medium mt-1">
              Structured forensic data collection with automatic PII de-identification.
            </p>
          </div>
        </div>

        <button
          onClick={() => router.back()}
          className="self-start sm:self-center inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border/80 px-3.5 py-2 rounded-xl hover:bg-muted transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-card rounded-3xl border border-border/80 overflow-hidden shadow-sm">
          
          <div className="p-8 sm:p-10 space-y-8">
            
            {/* Section 1: Case Identity */}
            <div className="space-y-4">
              <div className="border-b border-border/60 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">1. Case Identification</h2>
                <p className="text-xs text-muted-foreground">Legal reference, petitioner/respondent docket identifier, or safe client code.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Case Title / Docket Reference *
                </Label>
                <Input 
                  id="title" 
                  className="h-12 bg-background border-border/80 px-4 text-foreground text-sm font-medium rounded-xl focus:border-primary"
                  placeholder="e.g. State v. [Redacted] or Jane Doe Protective Petition" 
                  value={formData.title} 
                  onChange={e => setFormData({ ...formData, title: e.target.value })} 
                  required 
                />
              </div>
            </div>

            {/* Section 2: Relationship Dynamics */}
            <div className="space-y-4 pt-2">
              <div className="border-b border-border/60 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">2. Relationship Dynamics & Frequency</h2>
                <p className="text-xs text-muted-foreground">Parameters evaluated by clinical lethality algorithms.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="relationship" className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Relationship Dynamic *
                  </Label>
                  <select
                    id="relationship"
                    value={formData.relationshipType}
                    onChange={e => setFormData({ ...formData, relationshipType: e.target.value })}
                    className="w-full h-12 bg-background border border-border/80 px-4 text-foreground text-xs font-medium rounded-xl focus:outline-none focus:border-primary"
                    required
                  >
                    <option>Intimate Partner / Spouse</option>
                    <option>Former Spouse / Divorced</option>
                    <option>Cohabitant / Dating Partner</option>
                    <option>Parent of Common Minor Child</option>
                    <option>Family / Household Member</option>
                    <option>Other Interpersonal Dynamic</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency" className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Abuse / Incident Frequency *
                  </Label>
                  <select
                    id="frequency"
                    value={formData.incidentFrequency}
                    onChange={e => setFormData({ ...formData, incidentFrequency: e.target.value })}
                    className="w-full h-12 bg-background border border-border/80 px-4 text-foreground text-xs font-medium rounded-xl focus:outline-none focus:border-primary"
                    required
                  >
                    <option>Daily / Constant Coercive Control</option>
                    <option>Weekly (Escalating)</option>
                    <option>Monthly / Periodic Explosions</option>
                    <option>Single Acute Catastrophic Assault</option>
                    <option>Post-Separation Stalking Only</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-3 p-4 rounded-2xl bg-muted/20 border border-border/60 cursor-pointer hover:bg-muted/30 transition-colors">
                  <input 
                    type="checkbox" 
                    id="prior" 
                    className="rounded border-border bg-background text-primary focus:ring-primary h-5 w-5 cursor-pointer"
                    checked={formData.priorComplaints}
                    onChange={e => setFormData({ ...formData, priorComplaints: e.target.checked })}
                  />
                  <div className="text-xs">
                    <span className="font-bold text-foreground block">Prior Police Reports or Restraining Orders Filed</span>
                    <span className="text-muted-foreground">Tick if 911 calls, EPOs, or hospital emergency room evaluations exist.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Section 3: Narrative Statement */}
            <div className="space-y-4 pt-2">
              <div className="border-b border-border/60 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">3. Victim Narrative Statement</h2>
                  <p className="text-xs text-muted-foreground">Type detailed survivor testimony or click &quot;Record Audio&quot; to transcribe live statement.</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#3A6B53] bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 self-start sm:self-auto">
                  <ShieldCheck className="w-3.5 h-3.5" /> Presidio PII Auto-Scrubbed
                </span>
              </div>

              <div className="flex justify-end">
                <AudioRecorder
                  onTranscriptionComplete={(text) =>
                    setFormData(prev => ({
                      ...prev,
                      statement: prev.statement ? prev.statement + '\n\n' + text : text
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Textarea 
                  id="statement" 
                  rows={9}
                  className="w-full bg-background border border-border/80 p-5 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none font-normal text-sm resize-y rounded-2xl shadow-sm leading-relaxed"
                  placeholder="Describe the sequence of events in detail: dates, times, specific threats made, any physical contact (choking, bruising, weapon brandishing), threats involving children, property damage, and real-time fear level..." 
                  value={formData.statement}
                  onChange={e => setFormData({ ...formData, statement: e.target.value })}
                  required
                />
                <div className="flex justify-between items-center text-[11px] text-muted-foreground px-1">
                  <span>Character count: {formData.statement.length}</span>
                  <span>Minimum ~50 words recommended for accurate risk scoring</span>
                </div>
              </div>
            </div>

          </div>
          
          {/* Action Footer */}
          <div className="bg-muted/30 border-t border-border/80 p-8 flex flex-col sm:flex-row items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full sm:w-auto px-6 py-3.5 text-xs font-bold tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <Button 
              type="submit" 
              disabled={createCaseMutation.isPending} 
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3.5 text-xs font-bold uppercase tracking-widest rounded-xl shadow-md transition-all cursor-pointer"
            >
              {createCaseMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#FED7A5]" /> INITIALIZING DOSSIER...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>CREATE CASE PORTFOLIO</span>
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </div>

        </div>
      </form>
    </div>
  );
}
