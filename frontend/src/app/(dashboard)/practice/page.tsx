'use client';
import { useState } from 'react';
import { ArrowUpRight, Brain, Scale, CheckCircle2, FileText } from 'lucide-react';
import { AudioRecorder } from '@/components/ui/audio-recorder';
import { toast } from 'sonner';

export default function PracticeAnalyserPage() {
  const [statement, setStatement] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statement.trim()) {
      toast.error('Please provide a statement or recording to analyze.');
      return;
    }

    setIsAnalyzing(true);
    // Simulate API call for practice analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setReport(`## Brief Analysis Report

### Argument Strength
The provided statement outlines a clear timeline of events, which is a strong foundation. However, it lacks specific dates and corroborating evidence references.

### Potential Counterarguments
- **Lack of specifics**: Opposing counsel may argue the narrative is too vague without precise timestamps.
- **Hearsay**: Some parts of the statement rely on third-party accounts which may be inadmissible.

### Legal Risks & Vulnerabilities
- Ensure emotional language is balanced with factual assertions.
- The mention of "prior incidents" needs documented proof to be effective in court.

### Recommendations for Practice
1. **Be Specific:** Try to anchor every key event to a specific date and time.
2. **Stick to the Facts:** Avoid over-editorializing the other party's motives unless it can be proven.
3. **Gather Evidence:** Mention exactly what evidence (e.g., text messages, medical reports) supports each claim in your statement.`);
      toast.success('Analysis complete!');
    }, 2500);
  };

  const handleReset = () => {
    setStatement('');
    setReport(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex items-center justify-between mb-8 bg-card p-8 rounded-2xl border border-border/80 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="h-14 w-14 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center">
            <Brain className="h-7 w-7 text-primary" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Practice Analyser</h1>
            <p className="text-muted-foreground text-sm font-medium tracking-wide mt-1">A safe sandbox to test arguments, statements, and evidence evaluation.</p>
          </div>
        </div>
        {report && (
           <button 
             onClick={handleReset}
             className="px-6 py-3 text-xs font-bold tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors border border-border/80 rounded-xl hover:bg-muted/50"
           >
             Start Over
           </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Input */}
        <div className={`transition-all duration-500 ${report ? 'lg:col-span-1 opacity-70 hover:opacity-100' : 'lg:col-span-2 max-w-4xl mx-auto w-full'}`}>
          <form onSubmit={handleAnalyze} className="bg-card rounded-2xl border border-border/80 overflow-hidden shadow-sm h-full flex flex-col">
            <div className="p-8 flex-1 space-y-6">
              <div className="flex items-center justify-between">
                <label htmlFor="statement" className="text-[10px] font-bold tracking-widest uppercase text-foreground flex items-center gap-2">
                  <Scale className="w-4 h-4 text-primary" />
                  Practice Statement / Evidence
                </label>
                <AudioRecorder onTranscriptionComplete={(text) => setStatement(prev => prev ? prev + '\n\n' + text : text)} />
              </div>
              
              <div className="relative flex-1 flex flex-col">
                <textarea 
                  id="statement" 
                  className="block w-full bg-background border border-border/80 p-5 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 font-medium tracking-wide text-sm min-h-[300px] lg:min-h-[400px] flex-1 resize-none rounded-xl shadow-sm leading-relaxed"
                  placeholder="Type or record your practice argument, client statement, or evidence summary here..." 
                  value={statement}
                  onChange={e => setStatement(e.target.value)}
                  disabled={isAnalyzing}
                />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center border border-primary/20 z-10">
                    <Brain className="w-10 h-10 text-primary animate-pulse mb-4" />
                    <p className="text-sm font-bold tracking-widest uppercase text-primary animate-pulse">Analyzing Statement...</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-muted/30 border-t border-border/80 p-6 flex justify-end">
              <button 
                type="submit" 
                disabled={isAnalyzing || !statement.trim()} 
                className="w-full lg:w-auto flex items-center justify-center group overflow-hidden bg-primary px-8 py-4 text-primary-foreground font-bold tracking-widest uppercase text-xs transition-all hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed border border-primary rounded-xl shadow-md hover:shadow-lg"
              >
                <span className="mr-3">
                  {isAnalyzing ? 'PROCESSING...' : 'GENERATE ANALYSIS'}
                </span>
                {!isAnalyzing && (
                  <span className="flex items-center justify-center w-6 h-6 rounded-full border border-background/20 group-hover:bg-background group-hover:text-primary transition-colors duration-300">
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Output */}
        {report && (
          <div className="lg:col-span-1 animate-in fade-in slide-in-from-right-8 duration-700 ease-out h-full">
             <div className="bg-card rounded-2xl border border-border/80 overflow-hidden shadow-sm h-full flex flex-col max-h-[600px]">
                <div className="p-8 border-b border-border/80 bg-primary/5 flex items-center gap-3 shrink-0">
                  <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Brief Analysis Report</h2>
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      Generated successfully
                    </p>
                  </div>
                </div>
                <div className="p-8 flex-1 overflow-y-auto">
                   <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-h3:text-primary prose-h3:text-base prose-h3:tracking-tight prose-li:text-muted-foreground">
                      {report.split('\n\n').map((block, i) => {
                        if (block.startsWith('## ')) {
                           return <h2 key={i} className="text-xl font-bold mb-4">{block.replace('## ', '')}</h2>
                        }
                        if (block.startsWith('### ')) {
                           return <h3 key={i} className="text-primary font-semibold mb-2 mt-6">{block.replace('### ', '')}</h3>
                        }
                        if (block.startsWith('- ') || block.startsWith('1. ')) {
                           return (
                             <ul key={i} className="space-y-2 my-4 list-disc pl-5">
                               {block.split('\n').map((item, j) => (
                                 <li key={j} className="text-sm leading-relaxed text-foreground/80">
                                   <span dangerouslySetInnerHTML={{ __html: item.replace(/^(-\s|\d+\.\s)/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                 </li>
                               ))}
                             </ul>
                           )
                        }
                        return <p key={i} className="text-sm leading-relaxed text-foreground/80 mb-4">{block}</p>
                      })}
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
