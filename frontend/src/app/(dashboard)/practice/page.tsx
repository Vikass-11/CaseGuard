'use client';

import { useState } from 'react';
import {
  Brain,
  Scale,
  CheckCircle2,
  FileText,
  ArrowUpRight,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  BookOpen,
  Copy,
  Check,
  Printer,
  RotateCcw,
  Zap,
  Target,
  Gavel
} from 'lucide-react';
import { AudioRecorder } from '@/components/ui/audio-recorder';
import { toast } from 'sonner';
import api from '@/lib/api';

interface AnalysisResult {
  strengthScore: number;
  strengthRating: 'High' | 'Medium' | 'Low';
  executiveSummary: string;
  counterarguments: {
    argument: string;
    riskLevel: 'High' | 'Medium' | 'Low';
    mitigation: string;
  }[];
  vulnerabilities: {
    issue: string;
    ruleOrStandard: string;
    suggestion: string;
  }[];
  recommendations: string[];
  legalPrinciples: {
    doctrine: string;
    citation: string;
    application: string;
  }[];
}

const PRESET_SCENARIOS = [
  {
    title: 'Emergency Ex-Parte Injunction (Choking / Strangulation)',
    practiceType: 'Emergency Hearing',
    text: "Client reports respondent broke into her apartment at 2 AM last Thursday, pinned her against the kitchen counter, and placed both hands around her throat until she became lightheaded and vision went black. Respondent shouted 'If you ever call the cops or try to keep my kids from me, you won't survive the week.' Client escaped when her dog barked, ran to neighbor's house, and photographed neck petechiae and contusions the next morning. No immediate 911 call was made due to extreme terror."
  },
  {
    title: 'Coercive Control & Digital Stalking',
    practiceType: 'Restraining Order Trial',
    text: "Respondent has placed unauthorized GPS tracking AirTags in client's vehicle and installed spyware on her phone. He constantly texts screenshots of her real-time locations and financial accounts. He has cancelled her joint credit cards, leaving her and their 4-year-old child without funds for groceries. He threatens to report her to immigration if she seeks child support."
  },
  {
    title: 'Contested Hearing / Self-Defense Rebuttal',
    practiceType: 'Evidentiary Hearing',
    text: "Opposing counsel claims client was the primary physical aggressor because respondent sustained scratches on his forearm. Client testifies that she scratched him while fighting for air when respondent pinned her down and covered her nose and mouth with a sofa cushion. A 911 recording exists where client's whispered voice can be heard begging for help in the background before call disconnected."
  }
];

export default function PracticeAnalyserPage() {
  const [statement, setStatement] = useState('');
  const [practiceType, setPracticeType] = useState('Emergency Hearing');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'attacks' | 'vulnerabilities' | 'actions' | 'statutes'>('attacks');
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!statement.trim()) {
      toast.error('Please enter a statement or record testimony to analyze.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await api.post('/cases/practice/analyze', {
        statement,
        practiceType
      });
      setAnalysis(res.data);
      toast.success('AI Legal Analysis generated successfully!');
    } catch (error: any) {
      console.error('Practice analysis error:', error);
      toast.error(error?.response?.data?.message || 'Failed to complete analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setStatement('');
    setAnalysis(null);
  };

  const handleCopyReport = () => {
    if (!analysis) return;
    const text = `CASEGUARD PRACTICE & TRIAL ANALYSIS REPORT
=====================================================
PRACTICE TYPE: ${practiceType}
STRENGTH SCORE: ${analysis.strengthScore}/100 (${analysis.strengthRating} Rating)

EXECUTIVE SUMMARY:
${analysis.executiveSummary}

OPPOSING COUNSEL ATTACK VECTORS & MITIGATIONS:
${analysis.counterarguments.map(c => `• [${c.riskLevel.toUpperCase()} RISK] ${c.argument}\n  Mitigation: ${c.mitigation}`).join('\n\n')}

EVIDENTIARY VULNERABILITIES:
${analysis.vulnerabilities.map(v => `• Issue: ${v.issue} (${v.ruleOrStandard})\n  Cure: ${v.suggestion}`).join('\n\n')}

ACTIONABLE RECOMMENDATIONS:
${analysis.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

LEGAL DOCTRINES & AUTHORITIES:
${analysis.legalPrinciples.map(p => `• ${p.doctrine} (${p.citation}): ${p.application}`).join('\n\n')}
`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Report copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 50) return 'text-amber-500 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-500 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-20">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-primary/5 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-5">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center shadow-inner">
              <Brain className="h-8 w-8 text-primary" strokeWidth={1.8} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Practice & Research Analyser</h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-primary/10 text-primary border border-primary/20">
                  <Sparkles className="w-3 h-3" /> Real-Time AI
                </span>
              </div>
              <p className="text-muted-foreground text-sm font-medium tracking-wide mt-1.5 max-w-2xl">
                A courtroom preparation sandbox. Test witness declarations, oral arguments, and evidence narratives against opposing counsel attacks and evidentiary standards.
              </p>
            </div>
          </div>
          
          {analysis && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyReport}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold tracking-wider uppercase bg-card hover:bg-muted text-foreground border border-border/80 rounded-xl transition-all shadow-sm"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy Report'}
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold tracking-wider uppercase bg-card hover:bg-muted text-foreground border border-border/80 rounded-xl transition-all shadow-sm"
              >
                <Printer className="w-4 h-4" /> Print / PDF
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold tracking-wider uppercase text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted rounded-xl transition-all"
              >
                <RotateCcw className="w-4 h-4" /> Start Over
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input Form & Scenarios */}
        <div className={analysis ? 'lg:col-span-5 space-y-6' : 'lg:col-span-12 max-w-4xl mx-auto w-full space-y-6'}>
          
          {/* Preset Scenario Quick Select */}
          <div className="bg-card rounded-2xl border border-border/80 p-5 shadow-sm space-y-3">
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-primary" /> Quick Case Presets
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {PRESET_SCENARIOS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setStatement(preset.text);
                    setPracticeType(preset.practiceType);
                    toast.info(`Loaded scenario: ${preset.title}`);
                  }}
                  className="text-left p-3 rounded-xl border border-border/60 hover:border-primary/40 bg-muted/30 hover:bg-primary/5 transition-all group"
                >
                  <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{preset.title}</p>
                  <p className="text-[10px] text-muted-foreground font-mono mt-1">{preset.practiceType}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Statement Input Form */}
          <form onSubmit={handleAnalyze} className="bg-card rounded-2xl border border-border/80 overflow-hidden shadow-sm flex flex-col">
            <div className="p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-primary" />
                  <label htmlFor="statement" className="text-xs font-bold tracking-wider uppercase text-foreground">
                    Testimony / Evidence Narrative
                  </label>
                </div>
                
                {/* Practice Type Selector */}
                <select
                  value={practiceType}
                  onChange={(e) => setPracticeType(e.target.value)}
                  className="bg-muted/40 border border-border/80 rounded-lg px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Emergency Hearing">Emergency Ex-Parte Hearing</option>
                  <option value="Restraining Order Trial">Restraining Order Hearing</option>
                  <option value="Deposition Prep">Deposition & Cross-Examination</option>
                  <option value="Child Custody Proceeding">Child Custody & Abuse Proceeding</option>
                  <option value="Criminal DV Charging">Criminal DV & Lethality Proffer</option>
                </select>
              </div>

              <div className="relative">
                <textarea
                  id="statement"
                  rows={analysis ? 14 : 12}
                  className="block w-full bg-background border border-border/80 p-5 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 font-sans text-sm rounded-xl resize-none leading-relaxed shadow-inner"
                  placeholder="Paste client statement, witness interview, or police summary here, or click the mic button above to transcribe live dictation..."
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  disabled={isAnalyzing}
                />

                {isAnalyzing && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-md rounded-xl flex flex-col items-center justify-center border border-primary/30 z-20 space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                      <Brain className="w-8 h-8 text-primary absolute inset-0 m-auto animate-pulse" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold tracking-widest uppercase text-foreground">Analyzing Case Evidence...</p>
                      <p className="text-xs text-muted-foreground mt-1 font-medium">Evaluating counterarguments, hearsay standards & caselaw</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                <span>{statement.split(/\s+/).filter(Boolean).length} words</span>
                <AudioRecorder onTranscriptionComplete={(text) => setStatement(prev => prev ? prev + '\n\n' + text : text)} />
              </div>
            </div>

            <div className="bg-muted/30 border-t border-border/80 p-5 flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
                Analyzes evidentiary rules & counter-claims
              </span>
              <button
                type="submit"
                disabled={isAnalyzing || !statement.trim()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary px-8 py-3.5 text-primary-foreground font-bold tracking-widest uppercase text-xs transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed border border-primary rounded-xl shadow-md hover:shadow-lg"
              >
                <span>{isAnalyzing ? 'RUNNING LEGAL EVALUATION...' : 'RUN PRACTICE ANALYSIS'}</span>
                {!isAnalyzing && <ArrowUpRight className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: AI Analysis Output */}
        {analysis && (
          <div className="lg:col-span-7 space-y-6 animate-in fade-in slide-in-from-right-8 duration-700 ease-out">
            
            {/* Score & Executive Summary Card */}
            <div className="bg-card rounded-2xl border border-border/80 p-7 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/60">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Probative Evaluation</span>
                  <h3 className="text-xl font-extrabold text-foreground tracking-tight mt-0.5">Prima Facie Argument Strength</h3>
                </div>
                <div className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border ${getScoreColor(analysis.strengthScore)}`}>
                  <Target className="w-5 h-5" />
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold tracking-tighter">{analysis.strengthScore}</span>
                    <span className="text-xs font-bold uppercase opacity-80">/ 100</span>
                  </div>
                  <span className="ml-2 pl-3 border-l border-current/30 text-xs font-extrabold uppercase tracking-wider">
                    {analysis.strengthRating}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold tracking-wider uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-primary" /> Strategic Executive Summary
                </p>
                <p className="text-sm font-medium text-foreground/90 leading-relaxed bg-muted/20 p-4 rounded-xl border border-border/60">
                  {analysis.executiveSummary}
                </p>
              </div>
            </div>

            {/* Analysis Tabs */}
            <div className="bg-card rounded-2xl border border-border/80 overflow-hidden shadow-sm">
              <div className="flex border-b border-border/80 bg-muted/20 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('attacks')}
                  className={`flex items-center gap-2 px-5 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                    activeTab === 'attacks'
                      ? 'border-primary text-primary bg-card shadow-sm'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  Opposing Attacks ({analysis.counterarguments.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('vulnerabilities')}
                  className={`flex items-center gap-2 px-5 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                    activeTab === 'vulnerabilities'
                      ? 'border-primary text-primary bg-card shadow-sm'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Evidentiary Gaps ({analysis.vulnerabilities.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('actions')}
                  className={`flex items-center gap-2 px-5 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                    activeTab === 'actions'
                      ? 'border-primary text-primary bg-card shadow-sm'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Action Checklist ({analysis.recommendations.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('statutes')}
                  className={`flex items-center gap-2 px-5 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                    activeTab === 'statutes'
                      ? 'border-primary text-primary bg-card shadow-sm'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Gavel className="w-4 h-4 text-primary" />
                  Legal Authorities ({analysis.legalPrinciples.length})
                </button>
              </div>

              <div className="p-6">
                
                {/* Tab 1: Opposing Counsel Attacks */}
                {activeTab === 'attacks' && (
                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground font-medium mb-3">
                      Anticipate opposing counsel motions, cross-examination traps, and credibility challenges:
                    </p>
                    {analysis.counterarguments.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-border/80 bg-muted/10 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-bold text-foreground flex-1 flex items-start gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                            {item.argument}
                          </p>
                          <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md border shrink-0 ${
                            item.riskLevel === 'High' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                            item.riskLevel === 'Medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                            'bg-blue-500/10 text-blue-500 border-blue-500/20'
                          }`}>
                            {item.riskLevel} Risk
                          </span>
                        </div>
                        <div className="bg-primary/5 border border-primary/15 rounded-lg p-3 text-xs text-foreground/90 font-medium">
                          <span className="font-bold text-primary mr-1.5">Defense Mitigation:</span>
                          {item.mitigation}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab 2: Evidentiary Weaknesses */}
                {activeTab === 'vulnerabilities' && (
                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground font-medium mb-3">
                      Governing Rules of Evidence, hearsay exceptions, and foundation requirements:
                    </p>
                    {analysis.vulnerabilities.map((v, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-foreground">{v.issue}</span>
                          <span className="font-mono text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {v.ruleOrStandard}
                          </span>
                        </div>
                        <p className="text-xs text-foreground/80 font-medium leading-relaxed">
                          <strong className="text-foreground">Recommended Cure: </strong>{v.suggestion}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab 3: Action Checklist */}
                {activeTab === 'actions' && (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground font-medium mb-3">
                      Recommended pre-trial procedural steps and witness investigation:
                    </p>
                    {analysis.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl border border-border/80 bg-muted/20 text-sm font-medium text-foreground">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab 4: Legal Authorities */}
                {activeTab === 'statutes' && (
                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground font-medium mb-3">
                      Controlling legal doctrines, statutes, and leading case authorities:
                    </p>
                    {analysis.legalPrinciples.map((lp, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-border/80 bg-card space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-primary" />
                            {lp.doctrine}
                          </h4>
                          <span className="font-mono text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                            {lp.citation}
                          </span>
                        </div>
                        <p className="text-xs text-foreground/80 font-medium leading-relaxed pl-6">
                          {lp.application}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
