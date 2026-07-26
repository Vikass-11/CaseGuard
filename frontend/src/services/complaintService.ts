import {
  CaseCreate,
  Case,
  CreateCaseResponse,
  AnalyzeCaseRequest,
  CaseAnalysis
} from "../types/complaint";

const API_BASE_URL = "http://localhost:3000/api/cases";

class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new ApiError(errorData.message || response.statusText, response.status);
  }
  return response.json();
}

export const complaintService = {
  async createCase(payload: CaseCreate): Promise<CreateCaseResponse> {
    const response = await fetch(`${API_BASE_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    return handleResponse<CreateCaseResponse>(response);
  },

  async analyzeCase(payload: AnalyzeCaseRequest): Promise<CaseAnalysis> {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    return handleResponse<CaseAnalysis>(response);
  },

  async getCaseById(id: string): Promise<Case> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    return handleResponse<Case>(response);
  }
};
