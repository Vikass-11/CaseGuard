import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EvidenceViewer, { Evidence } from './EvidenceViewer';

interface CaseDetail {
  id: string;
  title: string;
  status: string;
  threatLevel: string;
  riskScore: number;
  abuseCategories: string[];
  descriptionRaw: string;
  descriptionAnonymized: string;
  createdAt: string;
  complainantName: string; // From populated user
}

const CaseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [evidenceData, setEvidenceData] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);

  // Example role fetching logic (usually from AuthContext)
  const isAdvocate = true; // Hardcoded for this mockup

  useEffect(() => {
    // In a real app, fetch from /api/cases/:id and /api/cases/:id/evidence
    const mockCase: CaseDetail = {
      id: id || '1',
      title: 'Workplace Harassment Incident',
      status: 'URGENT',
      threatLevel: 'HIGH',
      riskScore: 85,
      abuseCategories: ['Harassment', 'Hostile Work Environment'],
      descriptionRaw: 'My boss John Doe has been repeatedly harassing me at the TechCorp office in San Francisco.',
      descriptionAnonymized: 'My boss [PERSON_NAME] has been repeatedly harassing me at the [ORGANIZATION] office in [LOCATION].',
      createdAt: '2023-10-01T10:00:00Z',
      complainantName: 'Jane Smith'
    };
    
    const mockEvidence: Evidence[] = [
      { id: 'e1', filename: 'email_thread.pdf', fileUrl: '#', fileType: 'document', uploadDate: '2023-10-01T10:30:00Z', uploadedBy: 'user_1' },
      { id: 'e2', filename: 'incident_photo.jpg', fileUrl: '#', fileType: 'image', uploadDate: '2023-10-01T11:00:00Z', uploadedBy: 'user_1' }
    ];

    setTimeout(() => {
      setCaseData(mockCase);
      setEvidenceData(mockEvidence);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center dark:text-white">Loading case details...</div>;
  }

  if (!caseData) {
    return <div className="p-8 text-center text-red-500">Case not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8 border border-gray-100 dark:border-gray-700">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white font-outfit">
              {caseData.title}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Case Reference: #{caseData.id}
            </p>
          </div>
          <div className="flex space-x-2">
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
              ${caseData.status === 'URGENT' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-gray-100 text-gray-800'}`}>
              {caseData.status}
            </span>
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
              ${caseData.threatLevel === 'HIGH' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-gray-100 text-gray-800'}`}>
              Threat: {caseData.threatLevel}
            </span>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200 dark:sm:divide-gray-700">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Complainant Name</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                {caseData.complainantName}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Abuse Categories</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                {caseData.abuseCategories.join(', ')}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Risk Score</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2 flex items-center">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2 max-w-xs">
                  <div className={`h-2.5 rounded-full ${caseData.riskScore > 75 ? 'bg-red-600' : caseData.riskScore > 40 ? 'bg-yellow-400' : 'bg-green-500'}`} style={{ width: `${caseData.riskScore}%` }}></div>
                </div>
                {caseData.riskScore}/100
              </dd>
            </div>
            
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Case Description (Anonymized)
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                {caseData.descriptionAnonymized}
              </dd>
            </div>

            {isAdvocate && (
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-red-500 dark:text-red-400 flex items-center">
                  <span className="mr-2">🔒</span> Case Description (Raw)
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2 bg-red-50 dark:bg-red-900/10 p-4 rounded-md border border-red-200 dark:border-red-900/50">
                  <p className="mb-2 text-xs text-red-600 dark:text-red-400 font-semibold">RESTRICTED VIEW: For legal advocates only.</p>
                  {caseData.descriptionRaw}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white font-outfit mb-4">
          Attached Evidence
        </h3>
        <EvidenceViewer evidenceList={evidenceData} />
      </div>
    </div>
  );
};

export default CaseDetails;
