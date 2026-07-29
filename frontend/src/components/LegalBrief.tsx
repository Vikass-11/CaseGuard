import React, { useEffect, useState } from 'react';
import { FileText, Clock, AlertTriangle, CheckCircle, Scale } from 'lucide-react';

interface BriefData {
  summary: string;
  keyFacts: string[];
  timeline: { date: string; event: string }[];
  potentialViolations: string[];
}

interface LegalBriefProps {
  caseId: string;
}

const LegalBrief: React.FC<LegalBriefProps> = ({ caseId }) => {
  const [brief, setBrief] = useState<BriefData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from /api/cases/:id/brief
    const mockBrief: BriefData = {
      summary: 'The complainant reports repeated harassment incidents in the workplace over the last three months, creating a hostile environment.',
      keyFacts: [
        'Incident occurred at TechCorp SF Office.',
        'Multiple instances reported by Jane Smith.',
        'Alleged perpetrator is John Doe (Manager).'
      ],
      timeline: [
        { date: '2023-07-15', event: 'First reported incident of inappropriate remarks.' },
        { date: '2023-09-10', event: 'Escalated hostile behavior during team meeting.' }
      ],
      potentialViolations: [
        'Title VII Civil Rights Act (Hostile Work Environment)',
        'California FEHA Harassment Code'
      ]
    };

    setTimeout(() => {
      setBrief(mockBrief);
      setLoading(false);
    }, 1000);
  }, [caseId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Generating AI Legal Brief...</p>
      </div>
    );
  }

  if (!brief) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="bg-indigo-50 dark:bg-indigo-900/40 px-6 py-4 border-b border-indigo-100 dark:border-indigo-800 flex items-center">
        <Scale className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-3" />
        <h2 className="text-xl font-bold text-indigo-900 dark:text-indigo-100 font-outfit">Automated Legal Brief</h2>
        <span className="ml-auto bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-200 text-xs px-2 py-1 rounded-full font-semibold uppercase tracking-wider">AI Generated</span>
      </div>
      
      <div className="p-6 space-y-8">
        {/* Summary */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
            Executive Summary
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            {brief.summary}
          </p>
        </section>

        {/* Key Facts */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500 dark:text-green-400" />
            Key Facts
          </h3>
          <ul className="space-y-2">
            {brief.keyFacts.map((fact, index) => (
              <li key={index} className="flex items-start text-gray-700 dark:text-gray-300">
                <span className="mr-2 text-indigo-500">•</span>
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Timeline */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
            Incident Timeline
          </h3>
          <div className="space-y-4 pl-2 border-l-2 border-blue-100 dark:border-blue-900 ml-2">
            {brief.timeline.map((item, index) => (
              <div key={index} className="relative pl-6">
                <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[23px] top-1.5 border-4 border-white dark:border-gray-800"></div>
                <div className="font-semibold text-sm text-gray-900 dark:text-white">{item.date}</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">{item.event}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Potential Violations */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-500 dark:text-red-400" />
            Potential Violations & Statutes
          </h3>
          <div className="flex flex-wrap gap-2">
            {brief.potentialViolations.map((violation, index) => (
              <span key={index} className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-100 dark:border-red-800">
                {violation}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LegalBrief;
