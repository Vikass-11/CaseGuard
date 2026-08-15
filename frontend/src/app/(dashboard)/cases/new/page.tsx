'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ShieldAlert } from 'lucide-react';

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
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 text-slate-800">
        <ShieldAlert className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold tracking-tight">New Case Intake</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
            <CardTitle>Case Information</CardTitle>
            <CardDescription>Enter the initial structured data and victim statement.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="title">Case Title / Reference</Label>
              <Input 
                id="title" 
                placeholder="e.g. State vs. John Doe or Jane Doe Report" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                required 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship Type</Label>
                <Input 
                  id="relationship" 
                  placeholder="e.g. Spouse, Ex-partner" 
                  value={formData.relationshipType} 
                  onChange={e => setFormData({...formData, relationshipType: e.target.value})} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Incident Frequency</Label>
                <Input 
                  id="frequency" 
                  placeholder="e.g. Daily, Weekly, Rare" 
                  value={formData.incidentFrequency} 
                  onChange={e => setFormData({...formData, incidentFrequency: e.target.value})} 
                  required 
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input 
                type="checkbox" 
                id="prior" 
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                checked={formData.priorComplaints}
                onChange={e => setFormData({...formData, priorComplaints: e.target.checked})}
              />
              <Label htmlFor="prior" className="font-normal">Prior complaints filed?</Label>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
              <Label htmlFor="statement">Victim Statement</Label>
              <Textarea 
                id="statement" 
                placeholder="Enter the detailed statement here..." 
                className="min-h-[200px]"
                value={formData.statement}
                onChange={e => setFormData({...formData, statement: e.target.value})}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50 border-t border-slate-100 flex justify-end py-4">
            <Button type="button" variant="outline" className="mr-3" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={createCaseMutation.isPending} className="bg-blue-600 hover:bg-blue-700">
              {createCaseMutation.isPending ? 'Creating...' : 'Create Case & Proceed'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
