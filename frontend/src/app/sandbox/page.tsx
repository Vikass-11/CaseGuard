'use client';

import { useState } from 'react';
import Link from 'next/link';
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
  Gavel,
  Lock,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import PublicNavbar from '@/components/PublicNavbar';
import PublicFooter from '@/components/PublicFooter';

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

export default function PublicSandboxPage() {
  const [statement, setStatement] = useState('');
  const [practiceType, setPracticeType] = useState('Emergency Hearing');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'attacks' | 'vulnerabilities' | 'actions' | 'statutes'>('attacks');
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!statement.trim()) {
      toast.error('Please enter a statement or select a sample scenario below.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await api.post('/cases/practice/analyze', {
        statement,
        practiceType
      });
      setAnalysis(res.data);
      toast.success('Clinical Legal Analysis completed successfully!');
    } catch (error: any) {
      console.error('Practice analysis error:', error);
      toast.error(error?.response?.data?.error || error?.response?.data?.message || 'Failed to complete analysis. Please try again.');
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
    if (score >= 75) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <div className="min-h-screen bg-[#1A1D24] text-gray-200 flex flex-col font-sans selection:bg-[#FED7A5] selection:text-[#20212B]">
      <PublicNavbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        
        {/* Sandbox Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-[#FED7A5]/30 bg-[#2D4354]/40 backdrop-blur-xl p-8 sm:p-10 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#FED7A5]/10 text-[#FED7A5] border border-[#FED7A5]/30">
                  <Sparkles className="w-3 h-3" /> Public Interactive Sandbox
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Lock className="w-3 h-3" /> Zero Data Retained
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Forensic Trial & Evidence Rehearsal Simulator
              </h1>
              <p className="text-gray-300 text-sm max-w-3xl leading-relaxed">
                Test witness declarations, oral proffer narratives, and domestic violence evidentiary standards against simulated judicial evaluation. No advocate login or account required.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              {analysis && (
                <>
                  <button
                    onClick={handleCopyReport}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#20212B] hover:bg-[#20212B]/80 text-[#FED7A5] border border-[#FED7A5]/40 rounded-xl transition-all shadow cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy Report'}
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#20212B] hover:bg-[#20212B]/80 text-gray-200 border border-gray-600 rounded-xl transition-all shadow cursor-pointer"
                  >
                    <Printer className="w-4 h-4" /> Print / PDF
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white bg-[#20212B]/50 hover:bg-[#20212B] rounded-xl transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" /> Reset
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Portal Invitation Callout Banner */}
        <div className="bg-[#20212B] border border-[#73766A]/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#2D4354] flex items-center justify-center shrink-0 border border-[#FED7A5]/20">
              <ShieldCheck className="h-5 w-5 text-[#FED7A5]" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">
                Are you an authorized legal aid attorney, prosecutor, or shelter caseworker?
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Sign in to the Advocate Portal to link analyses directly to active court dockets, manage clients, and export courtroom-ready DV-110 packets.
              </p>
            </div>
          </div>
          <Link
            href="/login"
            className="shrink-0 bg-[#2D4354] hover:bg-[#2D4354]/80 text-[#FED7A5] border border-[#FED7A5]/30 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <span>Advocate Portal Login</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Main Grid: Input & Output */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input Form & Scenarios */}
          <div className={analysis ? 'lg:col-span-5 space-y-6' : 'lg:col-span-12 max-w-4xl mx-auto w-full space-y-6'}>
            
            {/* Preset Scenario Quick Select */}
            <div className="bg-[#20212B] rounded-2xl border border-[#73766A]/30 p-5 shadow-sm space-y-3">
              <p className="text-[10px] font-bold tracking-widest uppercase text-[#FED7A5] flex items-center gap-2">
                <Zap className="w-3.5 h-3.5" /> Click A Preset Scenario To Test
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {PRESET_SCENARIOS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setStatement(preset.text);
                      setPracticeType(preset.practiceType);
                      toast.info(`Loaded scenario: ${preset.title}`);
                    }}
                    className="text-left p-3.5 rounded-xl border border-gray-700/60 hover:border-[#FED7A5]/50 bg-[#2D4354]/30 hover:bg-[#2D4354]/60 transition-all group cursor-pointer"
                  >
                    <p className="text-xs font-bold text-white group-hover:text-[#FED7A5] transition-colors line-clamp-2">
                      {preset.title}
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono mt-1.5">{preset.practiceType}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Statement Input Form */}
            <form onSubmit={handleAnalyze} className="bg-[#20212B] rounded-2xl border border-[#73766A]/30 overflow-hidden shadow-xl flex flex-col">
              <div className="p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-[#FED7A5]" />
                    <label htmlFor="sandbox-statement" className="text-xs font-bold tracking-wider uppercase text-white">
                      Testimony / Evidence Narrative
                    </label>
                  </div>
                  
                  {/* Practice Type Selector */}
                  <select
                    value={practiceType}
                    onChange={(e) => setPracticeType(e.target.value)}
                    className="bg-[#2D4354] border border-[#73766A]/40 rounded-xl px-3 py-1.5 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-[#FED7A5]"
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
                    id="sandbox-statement"
                    rows={analysis ? 14 : 10}
                    className="block w-full bg-[#1A1D24] border border-gray-700 p-5 text-gray-100 placeholder-gray-500 focus:border-[#FED7A5] focus:ring-1 focus:ring-[#FED7A5] focus:outline-none transition-all font-sans text-sm rounded-xl resize-none leading-relaxed shadow-inner"
                    placeholder="Type or paste a client declaration, witness statement, or police report excerpt here to evaluate courtroom vulnerabilities..."
                    value={statement}
                    onChange={(e) => setStatement(e.target.value)}
                    disabled={isAnalyzing}
                  />

                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-[#1A1D24]/90 backdrop-blur-md rounded-xl flex flex-col items-center justify-center border border-[#FED7A5]/30 z-20 space-y-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-[#FED7A5]/20 border-t-[#FED7A5] animate-spin" />
                        <Brain className="w-8 h-8 text-[#FED7A5] absolute inset-0 m-auto animate-pulse" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold tracking-widest uppercase text-white">Analyzing Testimony Evidence...</p>
                        <p className="text-xs text-gray-400 mt-1 font-medium">Evaluating counter-claims, hearsay standards & caselaw</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                  <span>{statement.split(/\s+/).filter(Boolean).length} words</span>
                  <span className="text-[11px] text-gray-400">Strictly confidential • No cloud storage</span>
                </div>
              </div>

              <div className="bg-[#2D4354]/30 border-t border-[#73766A]/30 p-5 flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium hidden sm:inline">
                  Tests judicial sufficiency & opposing counsel traps
                </span>
                <button
                  type="submit"
                  disabled={isAnalyzing || !statement.trim()}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FED7A5] hover:bg-[#FED7A5]/90 text-[#20212B] px-8 py-3.5 font-bold tracking-widest uppercase text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg cursor-pointer"
                >
                  <span>{isAnalyzing ? 'RUNNING CLINICAL EVALUATION...' : 'RUN PRACTICE ANALYSIS'}</span>
                  {!isAnalyzing && <ArrowUpRight className="w-4 h-4" />}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: AI Analysis Output */}
          {analysis && (
            <div className="lg:col-span-7 space-y-6 animate-in fade-in slide-in-from-right-8 duration-700 ease-out">
              
              {/* Score & Executive Summary Card */}
              <div className="bg-[#20212B] rounded-2xl border border-[#73766A]/30 p-7 shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#73766A]/30">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Probative Judicial Assessment</span>
                    <h3 className="text-xl font-extrabold text-white tracking-tight mt-0.5">Prima Facie Argument Strength</h3>
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
                  <p className="text-xs font-bold tracking-wider uppercase text-[#FED7A5] mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Strategic Executive Summary
                  </p>
                  <p className="text-sm font-medium text-gray-200 leading-relaxed bg-[#1A1D24] p-4 rounded-xl border border-gray-700/60">
                    {analysis.executiveSummary}
                  </p>
                </div>
              </div>

              {/* Analysis Tabs */}
              <div className="bg-[#20212B] rounded-2xl border border-[#73766A]/30 overflow-hidden shadow-xl">
                <div className="flex border-b border-[#73766A]/30 bg-[#1A1D24] overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab('attacks')}
                    className={`flex items-center gap-2 px-5 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'attacks'
                        ? 'border-[#FED7A5] text-[#FED7A5] bg-[#20212B]'
                        : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    Opposing Attacks ({analysis.counterarguments.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('vulnerabilities')}
                    className={`flex items-center gap-2 px-5 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'vulnerabilities'
                        ? 'border-[#FED7A5] text-[#FED7A5] bg-[#20212B]'
                        : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Evidentiary Gaps ({analysis.vulnerabilities.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('actions')}
                    className={`flex items-center gap-2 px-5 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'actions'
                        ? 'border-[#FED7A5] text-[#FED7A5] bg-[#20212B]'
                        : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Action Checklist ({analysis.recommendations.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('statutes')}
                    className={`flex items-center gap-2 px-5 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'statutes'
                        ? 'border-[#FED7A5] text-[#FED7A5] bg-[#20212B]'
                        : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    <Gavel className="w-4 h-4 text-[#FED7A5]" />
                    Legal Authorities ({analysis.legalPrinciples.length})
                  </button>
                </div>

                <div className="p-6">
                  
                  {/* Tab 1: Opposing Counsel Attacks */}
                  {activeTab === 'attacks' && (
                    <div className="space-y-4">
                      <p className="text-xs text-gray-400 font-medium mb-3">
                        Anticipate opposing counsel motions, cross-examination traps, and credibility challenges:
                      </p>
                      {analysis.counterarguments.map((item, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-gray-700/60 bg-[#1A1D24] space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-bold text-white flex-1 flex items-start gap-2">
                              <span className="w-2 h-2 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                              {item.argument}
                            </p>
                            <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md border shrink-0 ${
                              item.riskLevel === 'High' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                              item.riskLevel === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                              'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            }`}>
                              {item.riskLevel} Risk
                            </span>
                          </div>
                          <div className="bg-[#2D4354]/40 border border-[#FED7A5]/20 rounded-lg p-3 text-xs text-gray-200 font-medium">
                            <span className="font-bold text-[#FED7A5] mr-1.5">Defense Mitigation:</span>
                            {item.mitigation}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab 2: Evidentiary Weaknesses */}
                  {activeTab === 'vulnerabilities' && (
                    <div className="space-y-4">
                      <p className="text-xs text-gray-400 font-medium mb-3">
                        Governing Rules of Evidence, hearsay exceptions, and foundation requirements:
                      </p>
                      {analysis.vulnerabilities.map((v, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-white">{v.issue}</span>
                            <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              {v.ruleOrStandard}
                            </span>
                          </div>
                          <p className="text-xs text-gray-300 font-medium leading-relaxed">
                            <strong className="text-white">Recommended Cure: </strong>{v.suggestion}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab 3: Action Checklist */}
                  {activeTab === 'actions' && (
                    <div className="space-y-3">
                      <p className="text-xs text-gray-400 font-medium mb-3">
                        Recommended pre-trial procedural steps and witness investigation:
                      </p>
                      {analysis.recommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-700/60 bg-[#1A1D24] text-sm font-medium text-gray-200">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab 4: Legal Authorities */}
                  {activeTab === 'statutes' && (
                    <div className="space-y-4">
                      <p className="text-xs text-gray-400 font-medium mb-3">
                        Controlling legal doctrines, statutes, and leading case authorities:
                      </p>
                      {analysis.legalPrinciples.map((lp, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-gray-700/60 bg-[#1A1D24] space-y-2">
                          <div className="flex items-center justify-between gap-3">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-[#FED7A5]" />
                              {lp.doctrine}
                            </h4>
                            <span className="font-mono text-[10px] font-bold text-[#FED7A5] bg-[#2D4354] px-2.5 py-1 rounded-md border border-[#FED7A5]/30">
                              {lp.citation}
                            </span>
                          </div>
                          <p className="text-xs text-gray-300 font-medium leading-relaxed pl-6">
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

      </main>

      <PublicFooter />
    </div>
  );
}
