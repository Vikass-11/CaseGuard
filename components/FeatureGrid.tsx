import React from 'react';
import { FeatureCardItem } from '@/types';

const FEATURES: FeatureCardItem[] = [
  {
    title: 'Local PII Anonymization',
    description: 'Automatic stripping of victim names, addresses, and ID numbers before LLM processing.',
    badge: 'Security',
    icon: '🛡️',
  },
  {
    title: 'ML Risk & Threat Scoring',
    description: 'Scikit-Learn NLP algorithms score violence risk metrics to assist prioritization.',
    badge: 'AI Core',
    icon: '⚖️',
  },
  {
    title: 'Multi-Modal Evidence Extraction',
    description: 'Local OCR for legal FIRs/complaints and Faster-Whisper audio transcription.',
    badge: 'OCR & Speech',
    icon: '📄',
  },
  {
    title: 'Multi-Agent Legal Drafting',
    description: 'Autonomous legal agents research statutory codes and draft court petitions.',
    badge: 'RAG Pipeline',
    icon: '🤖',
  },
];

export const FeatureGrid: React.FC = () => {
  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-16 border-t border-slate-800">
      <h2 className="text-2xl font-bold text-center mb-12">Core Platform Capabilities</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((feature, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition">
            <div className="text-3xl mb-4">{feature.icon}</div>
            <span className="text-xs font-medium text-blue-400 bg-blue-950 border border-blue-800 px-2.5 py-0.5 rounded-full">
              {feature.badge}
            </span>
            <h3 className="text-lg font-bold mt-3 mb-2">{feature.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};