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
        <div className="h-12 w-12 bg-[#111113] rounded-xl border border-white/10 flex items-center justify-center">
          <ShieldAlert className="h-6 w-6 text-white" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase" style={{ fontStretch: 'condensed' }}>New Case Intake</h1>
          <p className="text-[#a1a1aa] text-sm tracking-wide mt-1">Enter the initial structured data and victim statement.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white/[0.02] rounded-3xl border border-white/10 overflow-hidden backdrop-blur-md">
          <div className="p-10 space-y-8">
            <div className="space-y-3">
              <label htmlFor="title" className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa]">Case Title / Reference</label>
              <input 
                id="title" 
                className="block w-full bg-[#111113] border border-white/10 px-5 py-4 text-white placeholder-white/30 focus:border-white/30 focus:ring-1 focus:ring-white/30 focus:outline-none transition-all duration-300 font-medium tracking-wide shadow-inner text-sm rounded-lg"
                placeholder="e.g. State vs. John Doe or Jane Doe Report" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                required 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label htmlFor="relationship" className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa]">Relationship Type</label>
                <input 
                  id="relationship" 
                  className="block w-full bg-[#111113] border border-white/10 px-5 py-4 text-white placeholder-white/30 focus:border-white/30 focus:ring-1 focus:ring-white/30 focus:outline-none transition-all duration-300 font-medium tracking-wide shadow-inner text-sm rounded-lg"
                  placeholder="e.g. Spouse, Ex-partner" 
                  value={formData.relationshipType} 
                  onChange={e => setFormData({...formData, relationshipType: e.target.value})} 
                  required 
                />
              </div>
              <div className="space-y-3">
                <label htmlFor="frequency" className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa]">Incident Frequency</label>
                <input 
                  id="frequency" 
                  className="block w-full bg-[#111113] border border-white/10 px-5 py-4 text-white placeholder-white/30 focus:border-white/30 focus:ring-1 focus:ring-white/30 focus:outline-none transition-all duration-300 font-medium tracking-wide shadow-inner text-sm rounded-lg"
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
                className="rounded border-white/20 bg-[#111113] text-white focus:ring-white/30 h-5 w-5 accent-white cursor-pointer"
                checked={formData.priorComplaints}
                onChange={e => setFormData({...formData, priorComplaints: e.target.checked})}
              />
              <label htmlFor="prior" className="text-sm font-medium text-white cursor-pointer tracking-wide">Prior complaints filed?</label>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10">
              <label htmlFor="statement" className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa]">Victim Statement</label>
              <textarea 
                id="statement" 
                className="block w-full bg-[#111113] border border-white/10 px-5 py-4 text-white placeholder-white/30 focus:border-white/30 focus:ring-1 focus:ring-white/30 focus:outline-none transition-all duration-300 font-medium tracking-wide shadow-inner text-sm min-h-[200px] resize-y rounded-lg"
                placeholder="Enter the detailed statement here..." 
                value={formData.statement}
                onChange={e => setFormData({...formData, statement: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="bg-[#0a0a0c] border-t border-white/10 p-6 flex justify-end items-center gap-4">
            <button type="button" onClick={() => router.back()} className="px-6 py-4 text-xs font-bold tracking-widest uppercase text-white hover:text-[#a1a1aa] transition-colors">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={createCaseMutation.isPending} 
              className="flex items-center justify-between group overflow-hidden bg-white px-6 py-3 text-black font-bold tracking-widest uppercase text-xs transition-all hover:bg-neutral-200 disabled:opacity-70 disabled:cursor-not-allowed border border-white rounded-lg"
            >
              <span className="mr-3">
                {createCaseMutation.isPending ? 'CREATING...' : 'CREATE CASE'}
              </span>
              <span className="flex items-center justify-center w-6 h-6 rounded-full border border-black/20 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
