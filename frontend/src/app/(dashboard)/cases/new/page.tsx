'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import { ArrowUpRight, ShieldAlert } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-4 mb-8">
        <div className="h-12 w-12 bg-muted rounded-xl border border-border flex items-center justify-center">
          <ShieldAlert className="h-6 w-6 text-foreground" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase">New Case Intake</h1>
          <p className="text-muted-foreground text-sm tracking-wide mt-1">Enter the initial structured data and victim statement.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-card rounded-3xl border border-border overflow-hidden">
          <div className="p-10 space-y-8">
            <div className="space-y-3">
              <label htmlFor="title" className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Case Title / Reference</label>
              <input 
                id="title" 
                className="block w-full bg-muted border border-border px-5 py-4 text-foreground placeholder-muted-foreground focus:border-primary/40 focus:ring-1 focus:ring-ring/40 focus:outline-none transition-all duration-300 font-medium tracking-wide shadow-inner text-sm rounded-lg"
                placeholder="e.g. State vs. John Doe or Jane Doe Report" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                required 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label htmlFor="relationship" className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Relationship Type</label>
                <input 
                  id="relationship" 
                  className="block w-full bg-muted border border-border px-5 py-4 text-foreground placeholder-muted-foreground focus:border-primary/40 focus:ring-1 focus:ring-ring/40 focus:outline-none transition-all duration-300 font-medium tracking-wide shadow-inner text-sm rounded-lg"
                  placeholder="e.g. Spouse, Ex-partner" 
                  value={formData.relationshipType} 
                  onChange={e => setFormData({...formData, relationshipType: e.target.value})} 
                  required 
                />
              </div>
              <div className="space-y-3">
                <label htmlFor="frequency" className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Incident Frequency</label>
                <input 
                  id="frequency" 
                  className="block w-full bg-muted border border-border px-5 py-4 text-foreground placeholder-muted-foreground focus:border-primary/40 focus:ring-1 focus:ring-ring/40 focus:outline-none transition-all duration-300 font-medium tracking-wide shadow-inner text-sm rounded-lg"
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
                className="rounded border-border bg-muted text-foreground focus:ring-ring/40 h-5 w-5 accent-white cursor-pointer"
                checked={formData.priorComplaints}
                onChange={e => setFormData({...formData, priorComplaints: e.target.checked})}
              />
              <label htmlFor="prior" className="text-sm font-medium text-foreground cursor-pointer tracking-wide">Prior complaints filed?</label>
            </div>

            <div className="space-y-3 pt-6 border-t border-border">
              <label htmlFor="statement" className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Victim Statement</label>
              <textarea 
                id="statement" 
                className="block w-full bg-muted border border-border px-5 py-4 text-foreground placeholder-muted-foreground focus:border-primary/40 focus:ring-1 focus:ring-ring/40 focus:outline-none transition-all duration-300 font-medium tracking-wide shadow-inner text-sm min-h-[200px] resize-y rounded-lg"
                placeholder="Enter the detailed statement here..." 
                value={formData.statement}
                onChange={e => setFormData({...formData, statement: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="bg-secondary border-t border-border p-6 flex justify-end items-center gap-4">
            <button type="button" onClick={() => router.back()} className="px-6 py-4 text-xs font-bold tracking-widest uppercase text-foreground hover:text-muted-foreground transition-colors">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={createCaseMutation.isPending} 
              className="flex items-center justify-between group overflow-hidden bg-primary px-6 py-3 text-primary-foreground font-bold tracking-widest uppercase text-xs transition-all hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed border border-primary rounded-lg"
            >
              <span className="mr-3">
                {createCaseMutation.isPending ? 'CREATING...' : 'CREATE CASE'}
              </span>
              <span className="flex items-center justify-center w-6 h-6 rounded-full border border-black/20 group-hover:bg-black group-hover:text-foreground transition-colors duration-300">
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
