// Case/Complaint TypeScript interfaces matching Express.js backend

export interface CaseCreate {
  victimName: string;
  age: number;
  abuseType: string;
  incidentDescription: string;
  frequency: string;
  threatLevel: string;
  statement?: string;
}

export interface CaseAnalysis {
  severity: "low" | "medium" | "high" | null;
  riskScore: number | null;
  abusePatterns: string[];
  generatedBrief?: string;
  structuredBrief?: {
    summary?: string;
    keyFacts?: string[];
    timeline?: { date: string; event: string }[];
    potentialViolations?: string[];
  };
}

export interface Case {
  _id: string;
  complainantId?: string;
  title?: string;
  victimName: string;
  age: number;
  abuseType: string;
  incidentDescription: string;
  frequency: string;
  threatLevel: string;
  aiThreatLevel?: string;
  statement: string;
  descriptionRaw?: string;
  descriptionAnonymized?: string;
  status?: string;
  riskScore?: number;
  abuseCategories?: string[];
  analysis: CaseAnalysis;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCaseResponse {
  message: string;
  caseId: string;
  data: Case;
}

export interface AnalyzeCaseRequest {
  caseId: string;
  statement?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

export type ApiResponse<T> = T | ApiError;
