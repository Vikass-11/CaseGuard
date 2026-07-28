export type UserRole = "complainant" | "advocate" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization?: string;
  phone?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
  organization?: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

export interface ApiError {
  success: false;
  message: string;
}

export interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
}
