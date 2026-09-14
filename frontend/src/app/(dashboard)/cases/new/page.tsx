'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import { ArrowUpRight, ShieldAlert } from 'lucide-react';
import { AudioRecorder } from '@/components/ui/audio-recorder';

export default function NewCasePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    relationshipType: '',
    incidentFrequency: '',
    priorComplaints: false,
    statement: ''
  });

  const createCaseMutation = useMutation({
    mutationFn: async () => {
      // 1. Create Case
      const caseRes = await api.post('/cases', { title: formData.title });
      const caseId = caseRes.data._id;

      // 2. Add Intake Details
      await api.put(`/cases/${caseId}/input`, {
        relationshipType: formData.relationshipType,
        incidentFrequency: formData.incidentFrequency,
        priorComplaints: formData.priorComplaints,
        incidentTypes: ['General'] // Simplified for now
      });

      // 3. Add Statement
      await api.put(`/cases/${caseId}/statement`, {
        anonymizedText: formData.statement
      });

      return caseId;
    },
    onSuccess: (caseId) => {
      toast.success('Case created successfully!');
      router.push(`/cases/${caseId}`);
    },
    onError: () => {
      toast.error('Failed to create case. Please try again.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCaseMutation.mutate();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex items-center space-x-4 mb-8 bg-card p-8 rounded-2xl border border-border/80 shadow-sm">
        <div className="h-14 w-14 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center">
          <ShieldAlert className="h-7 w-7 text-primary" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">New Case Intake</h1>
          <p className="text-muted-foreground text-sm font-medium tracking-wide mt-1">Enter the initial structured data and victim statement for processing.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-card rounded-2xl border border-border/80 overflow-hidden shadow-sm">
          <div className="p-10 space-y-8">
            <div className="space-y-3">
              <label htmlFor="title" className="text-[10px] font-bold tracking-widest uppercase text-foreground">Case Title / Reference</label>
              <input 
                id="title" 
                className="block w-full bg-background border border-border/80 px-5 py-4 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 font-medium text-sm rounded-xl shadow-sm"
                placeholder="e.g. State vs. John Doe or Jane Doe Report" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                required 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label htmlFor="relationship" className="text-[10px] font-bold tracking-widest uppercase text-foreground">Relationship Type</label>
                <input 
                  id="relationship" 
                  className="block w-full bg-background border border-border/80 px-5 py-4 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 font-medium text-sm rounded-xl shadow-sm"
                  placeholder="e.g. Spouse, Ex-partner" 
                  value={formData.relationshipType} 
                  onChange={e => setFormData({...formData, relationshipType: e.target.value})} 
                  required 
                />
              </div>
              <div className="space-y-3">
                <label htmlFor="frequency" className="text-[10px] font-bold tracking-widest uppercase text-foreground">Incident Frequency</label>
                <input 
                  id="frequency" 
                  className="block w-full bg-background border border-border/80 px-5 py-4 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 font-medium text-sm rounded-xl shadow-sm"
                  placeholder="e.g. Daily, Weekly, Rare" 
                  value={formData.incidentFrequency} 
                  onChange={e => setFormData({...formData, incidentFrequency: e.target.value})} 
                  required 
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <input 
                type="checkbox" 
                id="prior" 
                className="rounded border-border/80 bg-background text-primary focus:ring-primary h-5 w-5 cursor-pointer shadow-sm"
                checked={formData.priorComplaints}
                onChange={e => setFormData({...formData, priorComplaints: e.target.checked})}
              />
              <label htmlFor="prior" className="text-sm font-semibold text-foreground cursor-pointer tracking-wide">Prior complaints filed?</label>
            </div>

            <div className="space-y-3 pt-6 border-t border-border/80">
              <div className="flex items-center justify-between">
                <label htmlFor="statement" className="text-[10px] font-bold tracking-widest uppercase text-foreground">Victim Statement</label>
                <AudioRecorder onTranscriptionComplete={(text) => setFormData(prev => ({ ...prev, statement: prev.statement ? prev.statement + '\n\n' + text : text }))} />
              </div>
              <textarea 
                id="statement" 
                className="block w-full bg-background border border-border/80 px-5 py-4 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 font-medium tracking-wide text-sm min-h-[240px] resize-y rounded-xl shadow-sm leading-relaxed"
                placeholder="Enter the detailed statement here..." 
                value={formData.statement}
                onChange={e => setFormData({...formData, statement: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="bg-muted/30 border-t border-border/80 p-8 flex justify-end items-center gap-4">
            <button type="button" onClick={() => router.back()} className="px-6 py-4 text-xs font-bold tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={createCaseMutation.isPending} 
              className="flex items-center justify-between group overflow-hidden bg-primary px-8 py-4 text-primary-foreground font-bold tracking-widest uppercase text-xs transition-all hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed border border-primary rounded-xl shadow-md hover:shadow-lg"
            >
              <span className="mr-3">
                {createCaseMutation.isPending ? 'CREATING...' : 'CREATE CASE'}
              </span>
              <span className="flex items-center justify-center w-6 h-6 rounded-full border border-background/20 group-hover:bg-background group-hover:text-primary transition-colors duration-300">
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
