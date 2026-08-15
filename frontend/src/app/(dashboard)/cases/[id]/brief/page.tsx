'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Printer, Save, ArrowLeft } from 'lucide-react';
import { BriefSkeleton } from '@/components/ui/skeletons';

export default function LawyerBriefPage() {
  const router = useRouter();
  const { id } = useParams();
  const [content, setContent] = useState('');
  
  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/cases/${id}/generate-brief`);
      return res.data;
    },
    onSuccess: (data) => {
      setContent(data.content);
      toast.success('Brief generated successfully!');
    },
    onError: () => {
      toast.error('Failed to generate brief.');
    }
  });

  useEffect(() => {
    // Generate on first load if content is empty
    if (!content && !generateMutation.isPending && !generateMutation.isSuccess) {
      generateMutation.mutate();
    }
  }, [id, content, generateMutation]);

  const handleSave = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Saving brief...',
        success: 'Brief saved successfully!',
        error: 'Failed to save brief.',
      }
    );
  };

  const handlePrint = () => {
    window.print();
  };

  if (generateMutation.isPending && !content) {
    return <div className="p-6"><BriefSkeleton /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <Button variant="ghost" onClick={() => router.back()} className="text-slate-500 hover:text-slate-900">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Case
        </Button>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending}>
            {generateMutation.isPending ? 'Regenerating...' : 'Regenerate Brief'}
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Export / Print
          </Button>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </div>
      </div>

      <Card className="shadow-lg border-slate-200">
        <CardHeader className="bg-slate-50 border-b border-slate-200 print:bg-white print:border-none">
          <CardTitle className="text-center text-2xl tracking-tight text-slate-800">Lawyer Case Brief</CardTitle>
          <p className="text-center text-slate-500 mt-2 font-mono text-sm">Ref ID: {id}</p>
        </CardHeader>
        <CardContent className="p-0">
          <Textarea 
            className="min-h-[600px] w-full p-8 border-0 focus-visible:ring-0 resize-y text-base leading-relaxed font-serif print:p-0"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
