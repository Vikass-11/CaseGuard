import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  RefreshTokenRequest,
  RefreshTokenResponse
} from "../types/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

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

export const authService = {
  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await handleResponse<{ success: boolean; message: string; data: AuthResponse }>(response);
    return result.data;
  },

  async login(payload: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await handleResponse<{ success: boolean; message: string; data: AuthResponse }>(response);
    return result.data;
  },

  async refreshToken(payload: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await handleResponse<{ success: boolean; message: string; data: RefreshTokenResponse }>(response);
    return result.data;
  },

  async logout(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });

    await handleResponse<{ success: boolean; message: string }>(response);
  },

  getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }
};
