import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil } from 'lucide-react';

interface OverrideDialogProps {
  title: string;
  field: string;
  currentValue: any;
  onSave: (field: string, newValue: any, reason: string) => void;
  isPending: boolean;
  type?: 'text' | 'number' | 'select' | 'array';
  options?: string[];
  children?: React.ReactNode;
}

export function OverrideDialog({ title, field, currentValue, onSave, isPending, type = 'text', options = [], children }: OverrideDialogProps) {
  const [open, setOpen] = useState(false);
  const [newValue, setNewValue] = useState<any>(currentValue);
  const [reason, setReason] = useState('');

  const handleSave = () => {
    if (!reason.trim()) return; // Reason is required
    
    // For arrays, if it's a comma separated string, convert to array
    let finalValue = newValue;
    if (type === 'array' && typeof newValue === 'string') {
      finalValue = newValue.split(',').map(s => s.trim()).filter(Boolean);
    }
    
    onSave(field, finalValue, reason);
    setOpen(false);
    setReason('');
  };

  return (
    <>
      <div className="relative group inline-block w-full">
        {children}
        <button 
          onClick={() => {
            setNewValue(type === 'array' ? (Array.isArray(currentValue) ? currentValue.join(', ') : currentValue) : currentValue);
            setOpen(true);
          }}
          className="absolute top-2 right-2 p-2 bg-primary/10 text-primary rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-white"
          title="Override AI Finding"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Override AI Finding: {title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Original AI Value</Label>
              <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground whitespace-pre-wrap break-words">
                {Array.isArray(currentValue) ? currentValue.join(', ') : currentValue}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>New Value</Label>
              {type === 'select' ? (
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                >
                  {options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : type === 'number' ? (
                <Input type="number" value={newValue} onChange={(e) => setNewValue(Number(e.target.value))} />
              ) : type === 'array' ? (
                <Textarea 
                  placeholder="Comma separated values..." 
                  value={newValue} 
                  onChange={(e) => setNewValue(e.target.value)} 
                />
              ) : (
                <Input type="text" value={newValue} onChange={(e) => setNewValue(e.target.value)} />
              )}
            </div>

            <div className="space-y-2">
              <Label>Reason for Override <span className="text-red-500">*</span></Label>
              <Textarea 
                placeholder="Explain why the AI's output is incorrect or needs adjustment..." 
                value={reason} 
                onChange={(e) => setReason(e.target.value)} 
                required
              />
              <p className="text-[10px] text-muted-foreground">This reason will be logged in the permanent audit trail.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!reason.trim() || isPending}>
              {isPending ? 'Saving...' : 'Save Override'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
